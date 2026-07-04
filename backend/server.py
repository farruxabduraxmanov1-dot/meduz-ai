"""MedUZ AI - Backend server for the AI-First Healthcare Ecosystem."""
from fastapi import FastAPI, APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import random
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Set
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="MedUZ AI")
api_router = APIRouter(prefix="/api")


# ============== MODELS ==============
class HealthResponse(BaseModel):
    status: str
    service: str = "MedUZ AI"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MockLoginRequest(BaseModel):
    method: Literal["phone", "google"]
    phone: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None


class MockLoginResponse(BaseModel):
    user_id: str
    name: str
    method: str
    token: str


class AIChatRequest(BaseModel):
    session_id: str
    text: str
    language: Literal["uz", "ru", "en"] = "en"
    image_base64: Optional[str] = None
    role: Literal["patient", "doctor"] = "patient"


class AIChatResponse(BaseModel):
    session_id: str
    reply: str
    urgency: Optional[str] = None
    suggestions: List[str] = []


class DoctorToolRequest(BaseModel):
    tool: Literal[
        "medical_summary",
        "recommendations",
        "patient_notes",
        "follow_up_plan",
    ]
    patient_context: str
    language: Literal["uz", "ru", "en"] = "en"


class DoctorToolResponse(BaseModel):
    tool: str
    content: str


class AppointmentRequest(BaseModel):
    doctor_id: str
    doctor_name: str
    patient_name: str
    date: str
    time: str
    consultation_type: Literal["online", "offline", "home"] = "offline"
    notes: Optional[str] = ""


class AppointmentResponse(BaseModel):
    id: str
    doctor_name: str
    patient_name: str
    date: str
    time: str
    consultation_type: str
    notes: str
    status: str = "confirmed"
    created_at: datetime


class HomeVisitRequest(BaseModel):
    service: str
    address: str
    preferred_time: str
    phone: str
    notes: Optional[str] = ""
    patient_name: str
    gender_preference: Optional[str] = "any"
    eta_minutes: Optional[int] = None


class HomeVisitResponse(BaseModel):
    id: str
    service: str
    status: str = "submitted"
    eta_minutes: int = 35
    gender_preference: Optional[str] = "any"
    created_at: datetime


# ============== AI PROMPT TEMPLATES ==============
PATIENT_SYSTEM_PROMPT = """You are MedUZ AI — the medical AI assistant of MedUZ AI, an AI-first healthcare ecosystem in Uzbekistan.

You assist PATIENTS who describe symptoms. You are NOT a doctor and you must always remind users that AI guidance does not replace medical consultation.

Your responsibilities:
1. Listen carefully to symptoms (and any uploaded photo).
2. Provide a calm, structured preliminary assessment.
3. Output the answer in the user's chosen language (Uzbek "uz", Russian "ru", or English "en"). Match natural medical vocabulary used in Uzbekistan.
4. Keep the tone warm, professional, reassuring.

Always respond with this exact structure (translate the section labels into the chosen language):

**Possible causes** — 2 to 4 likely conditions in plain language.
**Urgency level** — one of: LOW / MEDIUM / HIGH / EMERGENCY, plus 1 short sentence why.
**First aid / What you can do now** — concrete safe steps.
**Recommended specialist** — which doctor type to see (e.g. Pediatrician, Cardiologist).
**Disclaimer** — exactly: "AI recommendations do not replace medical consultation."

Stay under 220 words. Use markdown bold for section labels only. No headings (#).
"""

DOCTOR_TOOL_PROMPTS = {
    "medical_summary": "You are a clinical assistant. Produce a concise medical summary (max 180 words) covering: chief complaint, key history, exam findings, working diagnosis. Use bullet points.",
    "recommendations": "You are a clinical assistant. Produce evidence-based recommendations (max 180 words). Bullet list: investigations, treatment, lifestyle, follow-up criteria.",
    "patient_notes": "You are a clinical assistant. Write structured patient notes in SOAP format (Subjective, Objective, Assessment, Plan). Max 200 words.",
    "follow_up_plan": "You are a clinical assistant. Produce a 4-week follow-up plan with weekly checkpoints, red flags to monitor, and patient education. Max 200 words.",
}


def _language_name(code: str) -> str:
    return {"uz": "Uzbek", "ru": "Russian", "en": "English"}.get(code, "English")


# ============== ROUTES ==============
@api_router.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse(status="ok")


@api_router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok")


@api_router.post("/auth/mock-login", response_model=MockLoginResponse)
async def mock_login(req: MockLoginRequest):
    user_id = str(uuid.uuid4())
    if req.method == "phone":
        name = req.name or f"User {(req.phone or '')[-4:]}"
    else:
        name = req.name or (req.email.split("@")[0].title() if req.email else "Google User")
    token = f"demo-token-{user_id}"
    user_doc = {
        "user_id": user_id,
        "name": name,
        "method": req.method,
        "phone": req.phone,
        "email": req.email,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user_doc)
    return MockLoginResponse(user_id=user_id, name=name, method=req.method, token=token)


@api_router.post("/ai/chat", response_model=AIChatResponse)
async def ai_chat(req: AIChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    lang_name = _language_name(req.language)
    system_prompt = (
        PATIENT_SYSTEM_PROMPT
        + f"\n\nIMPORTANT: Respond in {lang_name} (code: {req.language}). Translate ALL section labels into {lang_name}."
    )

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=req.session_id,
        system_message=system_prompt,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    file_contents = None
    if req.image_base64:
        file_contents = [ImageContent(image_base64=req.image_base64)]

    user_msg = UserMessage(text=req.text, file_contents=file_contents)

    try:
        reply_text = await chat.send_message(user_msg)
    except Exception as exc:  # noqa: BLE001
        logger.exception("AI chat failure")
        raise HTTPException(status_code=502, detail=f"AI service error: {exc}") from exc

    # Best-effort urgency parsing — look at the "Urgency level" section only
    urgency = None
    import re
    m = re.search(r"(EMERGENCY|HIGH|MEDIUM|LOW)\b\s*[—\-:]", reply_text.upper())
    if m:
        urgency = m.group(1)
    else:
        upper = reply_text.upper()
        for level in ("EMERGENCY", "HIGH", "MEDIUM", "LOW"):
            if level in upper:
                urgency = level
                break

    suggestions = ["find_doctor", "find_organization", "find_medicine", "request_home_visit"]

    # Persist messages
    now_iso = datetime.now(timezone.utc).isoformat()
    await db.ai_messages.insert_many(
        [
            {
                "session_id": req.session_id,
                "role": "user",
                "text": req.text,
                "has_image": bool(req.image_base64),
                "language": req.language,
                "created_at": now_iso,
            },
            {
                "session_id": req.session_id,
                "role": "assistant",
                "text": reply_text,
                "urgency": urgency,
                "language": req.language,
                "created_at": now_iso,
            },
        ]
    )

    return AIChatResponse(
        session_id=req.session_id,
        reply=reply_text,
        urgency=urgency,
        suggestions=suggestions,
    )


@api_router.post("/ai/doctor-tool", response_model=DoctorToolResponse)
async def ai_doctor_tool(req: DoctorToolRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    lang_name = _language_name(req.language)
    base_prompt = DOCTOR_TOOL_PROMPTS[req.tool]
    system_prompt = f"{base_prompt}\n\nAlways respond in {lang_name}."

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"doctor-tool-{uuid.uuid4()}",
        system_message=system_prompt,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    try:
        content = await chat.send_message(UserMessage(text=req.patient_context))
    except Exception as exc:  # noqa: BLE001
        logger.exception("Doctor tool failure")
        raise HTTPException(status_code=502, detail=f"AI service error: {exc}") from exc

    return DoctorToolResponse(tool=req.tool, content=content)


@api_router.post("/appointments", response_model=AppointmentResponse)
async def create_appointment(req: AppointmentRequest):
    appt = {
        "id": str(uuid.uuid4()),
        "doctor_id": req.doctor_id,
        "doctor_name": req.doctor_name,
        "patient_name": req.patient_name,
        "date": req.date,
        "time": req.time,
        "consultation_type": req.consultation_type,
        "notes": req.notes or "",
        "status": "confirmed",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.appointments.insert_one(dict(appt))
    return AppointmentResponse(
        id=appt["id"],
        doctor_name=appt["doctor_name"],
        patient_name=appt["patient_name"],
        date=appt["date"],
        time=appt["time"],
        consultation_type=appt["consultation_type"],
        notes=appt["notes"],
        status=appt["status"],
        created_at=datetime.now(timezone.utc),
    )


@api_router.post("/home-visits", response_model=HomeVisitResponse)
async def create_home_visit(req: HomeVisitRequest):
    # Default ETA per service if not provided
    DEFAULT_ETA = {
        "Doctor Home Visit": 35,
        "Nurse Home Visit": 30,
        "Injection Service": 22,
        "IV Therapy": 45,
        "Dressings": 27,
        "Postoperative Care": 35,
        "Elderly Care": 45,
        "Child Care": 35,
        "Rehabilitation": 65,
    }
    eta = req.eta_minutes if req.eta_minutes else DEFAULT_ETA.get(req.service, 35)
    visit = {
        "id": str(uuid.uuid4()),
        "service": req.service,
        "address": req.address,
        "preferred_time": req.preferred_time,
        "phone": req.phone,
        "notes": req.notes or "",
        "patient_name": req.patient_name,
        "gender_preference": req.gender_preference or "any",
        "eta_minutes": eta,
        "status": "submitted",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.home_visits.insert_one(dict(visit))
    return HomeVisitResponse(
        id=visit["id"],
        service=visit["service"],
        status="submitted",
        eta_minutes=eta,
        gender_preference=req.gender_preference or "any",
        created_at=datetime.now(timezone.utc),
    )


# ============== WEBSOCKET CHAT ==============

class ChatMessage(BaseModel):
    id: str
    conversation_id: str
    sender_id: str
    sender_role: str
    sender_name: str
    text: str
    created_at: datetime
    read_by: List[str] = Field(default_factory=list)


class ChatConversation(BaseModel):
    id: str
    participants: List[Dict[str, str]]  # [{user_id, role, name, avatar}]
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    unread_counts: Dict[str, int] = Field(default_factory=dict)


class ConversationCreateRequest(BaseModel):
    peer_id: str
    peer_role: str
    peer_name: str
    peer_avatar: Optional[str] = ""
    user_id: str
    user_role: str
    user_name: str
    user_avatar: Optional[str] = ""


def conversation_id_for(a: str, b: str) -> str:
    ids = sorted([a, b])
    return f"conv_{ids[0]}__{ids[1]}"


class ConnectionManager:
    def __init__(self) -> None:
        self.active: Dict[str, WebSocket] = {}
        self.user_profiles: Dict[str, dict] = {}
        self.presence_subscribers: Set[str] = set()

    async def connect(self, user_id: str, ws: WebSocket, profile: Optional[dict] = None):
        await ws.accept()
        # If a previous socket exists, close it
        prev = self.active.get(user_id)
        if prev is not None:
            try:
                await prev.close()
            except Exception:
                pass
        self.active[user_id] = ws
        if profile:
            self.user_profiles[user_id] = profile
        await self.broadcast_presence(user_id, True)

    async def disconnect(self, user_id: str):
        if user_id in self.active:
            del self.active[user_id]
        await self.broadcast_presence(user_id, False)

    def is_online(self, user_id: str) -> bool:
        return user_id in self.active

    async def send_to(self, user_id: str, payload: dict) -> bool:
        ws = self.active.get(user_id)
        if ws is None:
            return False
        try:
            await ws.send_json(payload)
            return True
        except Exception:
            return False

    async def broadcast_presence(self, user_id: str, online: bool):
        payload = {"type": "presence", "user_id": user_id, "online": online, "ts": datetime.now(timezone.utc).isoformat()}
        for uid, ws in list(self.active.items()):
            if uid == user_id:
                continue
            try:
                await ws.send_json(payload)
            except Exception:
                pass


manager = ConnectionManager()


# Personas for auto-reply (Claude Sonnet 4.5) — investor demo
PERSONA_PROMPTS = {
    "doctor": (
        "You are a friendly, professional medical doctor at a clinic in Uzbekistan. "
        "Keep replies short (1-3 sentences), warm and human. Never diagnose over chat — "
        "instead ask a clarifying question, or invite the patient to book an in-person appointment. "
        "Reply in the same language as the patient (English, Russian, or Uzbek)."
    ),
    "service": (
        "You are a certified home care specialist (nurse, physiotherapist, or IV therapist) in Uzbekistan. "
        "Keep replies short (1-3 sentences), warm and reassuring. Confirm the visit details, offer arrival window, "
        "and ask if the patient needs anything specific. Reply in the same language as the patient."
    ),
    "admin": (
        "You are the reception/front-desk administrator of a medical clinic in Uzbekistan. "
        "Keep replies short (1-3 sentences), friendly and helpful. Answer questions about opening hours, "
        "doctors, appointments, or how to reach a specialist. Reply in the same language as the patient."
    ),
    "patient": (
        "You are the patient. Keep replies short, warm and appreciative. Reply in the same language."
    ),
}

# Track scheduled auto-replies to avoid duplicates
_auto_reply_tasks: Dict[str, asyncio.Task] = {}


async def _generate_auto_reply(conversation_id: str, sender_role: str, patient_message: str,
                                peer_id: str, peer_role: str, peer_name: str,
                                sender_id: str, sender_name: str):
    """Generate a Claude-powered persona reply after a small delay, then push to sender via WS + persist."""
    try:
        # Simulate typing delay 1.5s..3.5s
        await asyncio.sleep(random.uniform(1.5, 3.5))
        # Emit typing indicator to the sender's side (they see peer typing)
        await manager.send_to(sender_id, {
            "type": "typing",
            "conversation_id": conversation_id,
            "user_id": peer_id,
            "is_typing": True,
        })
        # Small thinking delay
        await asyncio.sleep(random.uniform(1.8, 3.2))

        # Compose Claude reply
        reply_text = "Hi, thanks for reaching out. How can I help you today?"
        if EMERGENT_LLM_KEY:
            try:
                system_prompt = PERSONA_PROMPTS.get(peer_role, PERSONA_PROMPTS["doctor"])
                chat = LlmChat(
                    api_key=EMERGENT_LLM_KEY,
                    session_id=f"autoreply-{conversation_id}",
                    system_message=(
                        system_prompt +
                        f"\n\nYour name is {peer_name}. Address the patient by name if you know it. "
                        "Keep the tone natural and mobile-friendly. No markdown headers."
                    ),
                ).with_model("anthropic", "claude-sonnet-4-5-20250929")
                resp = await chat.send_message(UserMessage(text=patient_message))
                reply_text = (resp or reply_text).strip()
                if len(reply_text) > 600:
                    reply_text = reply_text[:600].rsplit(" ", 1)[0] + "…"
            except Exception as exc:
                logger.warning(f"Auto-reply LLM failed: {exc}")

        # Stop typing
        await manager.send_to(sender_id, {
            "type": "typing",
            "conversation_id": conversation_id,
            "user_id": peer_id,
            "is_typing": False,
        })

        # Persist the reply
        reply = {
            "id": str(uuid.uuid4()),
            "conversation_id": conversation_id,
            "sender_id": peer_id,
            "sender_role": peer_role,
            "sender_name": peer_name,
            "text": reply_text,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "read_by": [peer_id],
        }
        await db.chat_messages.insert_one(dict(reply))

        # Update conversation last message + increment unread for sender
        await db.chat_conversations.update_one(
            {"_id": conversation_id},
            {
                "$set": {
                    "last_message": reply_text,
                    "last_message_at": reply["created_at"],
                    "last_sender_id": peer_id,
                },
                "$inc": {f"unread_counts.{sender_id}": 1},
            },
            upsert=False,
        )

        # Push to sender
        await manager.send_to(sender_id, {
            "type": "message",
            "message": {**reply, "isMe": False},
        })
    except asyncio.CancelledError:
        pass
    except Exception as exc:
        logger.exception(f"Auto-reply failure: {exc}")
    finally:
        _auto_reply_tasks.pop(conversation_id, None)


@app.websocket("/api/ws/chat/{user_id}")
async def ws_chat(websocket: WebSocket, user_id: str):
    # Accept and register
    try:
        await manager.connect(user_id, websocket)
    except Exception:
        return

    # On connect, send current presence snapshot to this client
    try:
        await websocket.send_json({
            "type": "hello",
            "user_id": user_id,
            "online_users": [uid for uid in manager.active.keys() if uid != user_id],
            "ts": datetime.now(timezone.utc).isoformat(),
        })
    except Exception:
        pass

    try:
        while True:
            data = await websocket.receive_json()
            mtype = data.get("type")

            if mtype == "message":
                # {type:'message', conversation_id, peer_id, peer_role, peer_name, sender_role, sender_name, text}
                text = (data.get("text") or "").strip()
                if not text:
                    continue
                conversation_id = data.get("conversation_id") or conversation_id_for(user_id, data["peer_id"])
                sender_role = data.get("sender_role", "patient")
                sender_name = data.get("sender_name", "User")
                peer_id = data["peer_id"]
                peer_role = data.get("peer_role", "doctor")
                peer_name = data.get("peer_name", "Peer")

                msg = {
                    "id": str(uuid.uuid4()),
                    "conversation_id": conversation_id,
                    "sender_id": user_id,
                    "sender_role": sender_role,
                    "sender_name": sender_name,
                    "text": text,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "read_by": [user_id],
                }
                # Ensure conversation doc exists
                await db.chat_conversations.update_one(
                    {"_id": conversation_id},
                    {
                        "$setOnInsert": {
                            "_id": conversation_id,
                            "participants": [
                                {"user_id": user_id, "role": sender_role, "name": sender_name, "avatar": data.get("sender_avatar", "")},
                                {"user_id": peer_id, "role": peer_role, "name": peer_name, "avatar": data.get("peer_avatar", "")},
                            ],
                        },
                        "$set": {
                            "last_message": text,
                            "last_message_at": msg["created_at"],
                            "last_sender_id": user_id,
                        },
                        "$inc": {f"unread_counts.{peer_id}": 1},
                    },
                    upsert=True,
                )
                await db.chat_messages.insert_one(dict(msg))

                # Ack to sender
                await websocket.send_json({"type": "message_ack", "message": {**msg, "isMe": True}, "status": "delivered"})

                # If peer online, deliver
                delivered = await manager.send_to(peer_id, {"type": "message", "message": {**msg, "isMe": False}})

                # If peer offline AND we're in demo mode (patient→peer), schedule Claude auto-reply
                if not delivered and sender_role == "patient" and peer_role in {"doctor", "service", "admin"}:
                    # cancel prior scheduled reply for the same conversation
                    prev = _auto_reply_tasks.pop(conversation_id, None)
                    if prev and not prev.done():
                        prev.cancel()
                    task = asyncio.create_task(_generate_auto_reply(
                        conversation_id=conversation_id,
                        sender_role=sender_role,
                        patient_message=text,
                        peer_id=peer_id, peer_role=peer_role, peer_name=peer_name,
                        sender_id=user_id, sender_name=sender_name,
                    ))
                    _auto_reply_tasks[conversation_id] = task

            elif mtype == "typing":
                # forward typing to peer
                peer_id = data.get("peer_id")
                if peer_id:
                    await manager.send_to(peer_id, {
                        "type": "typing",
                        "conversation_id": data.get("conversation_id") or conversation_id_for(user_id, peer_id),
                        "user_id": user_id,
                        "is_typing": bool(data.get("is_typing")),
                    })

            elif mtype == "read":
                # {type:'read', conversation_id, peer_id}
                cid = data.get("conversation_id")
                peer_id = data.get("peer_id")
                if cid:
                    await db.chat_conversations.update_one(
                        {"_id": cid},
                        {"$set": {f"unread_counts.{user_id}": 0}},
                    )
                    await db.chat_messages.update_many(
                        {"conversation_id": cid, "sender_id": {"$ne": user_id}, "read_by": {"$ne": user_id}},
                        {"$addToSet": {"read_by": user_id}},
                    )
                    if peer_id:
                        await manager.send_to(peer_id, {
                            "type": "read",
                            "conversation_id": cid,
                            "user_id": user_id,
                            "ts": datetime.now(timezone.utc).isoformat(),
                        })

            elif mtype == "ping":
                await websocket.send_json({"type": "pong", "ts": datetime.now(timezone.utc).isoformat()})

    except WebSocketDisconnect:
        pass
    except Exception as exc:
        logger.warning(f"WS error: {exc}")
    finally:
        await manager.disconnect(user_id)


# ============== REST for chat history / inbox ==============

@api_router.post("/chat/conversations")
async def ensure_conversation(req: ConversationCreateRequest):
    cid = conversation_id_for(req.user_id, req.peer_id)
    await db.chat_conversations.update_one(
        {"_id": cid},
        {
            "$setOnInsert": {
                "_id": cid,
                "participants": [
                    {"user_id": req.user_id, "role": req.user_role, "name": req.user_name, "avatar": req.user_avatar or ""},
                    {"user_id": req.peer_id, "role": req.peer_role, "name": req.peer_name, "avatar": req.peer_avatar or ""},
                ],
                "unread_counts": {req.user_id: 0, req.peer_id: 0},
                "last_message": None,
                "last_message_at": None,
            }
        },
        upsert=True,
    )
    return {"conversation_id": cid}


@api_router.get("/chat/conversations")
async def list_conversations(user_id: str):
    convs = await db.chat_conversations.find({"participants.user_id": user_id}).sort("last_message_at", -1).to_list(200)
    result = []
    for c in convs:
        peers = [p for p in c.get("participants", []) if p.get("user_id") != user_id]
        peer = peers[0] if peers else {"user_id": "?", "role": "?", "name": "Unknown", "avatar": ""}
        unread = (c.get("unread_counts") or {}).get(user_id, 0)
        result.append({
            "conversation_id": c.get("_id"),
            "peer": peer,
            "peer_online": manager.is_online(peer.get("user_id", "")),
            "last_message": c.get("last_message"),
            "last_message_at": c.get("last_message_at"),
            "last_sender_id": c.get("last_sender_id"),
            "unread": unread,
        })
    return {"conversations": result}


@api_router.get("/chat/messages")
async def get_messages(conversation_id: str, limit: int = 200):
    docs = await db.chat_messages.find({"conversation_id": conversation_id}).sort("created_at", 1).to_list(limit)
    return {
        "messages": [
            {
                "id": d.get("id"),
                "conversation_id": d.get("conversation_id"),
                "sender_id": d.get("sender_id"),
                "sender_role": d.get("sender_role"),
                "sender_name": d.get("sender_name"),
                "text": d.get("text"),
                "created_at": d.get("created_at"),
                "read_by": d.get("read_by", []),
            }
            for d in docs
        ]
    }


@api_router.post("/chat/mark-read")
async def mark_conversation_read(payload: Dict[str, str]):
    cid = payload.get("conversation_id")
    user_id = payload.get("user_id")
    if not cid or not user_id:
        raise HTTPException(400, "conversation_id and user_id required")
    await db.chat_conversations.update_one(
        {"_id": cid},
        {"$set": {f"unread_counts.{user_id}": 0}},
    )
    await db.chat_messages.update_many(
        {"conversation_id": cid, "sender_id": {"$ne": user_id}, "read_by": {"$ne": user_id}},
        {"$addToSet": {"read_by": user_id}},
    )
    return {"ok": True}


# Re-mount api_router now that chat routes are attached
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("meduz-ai")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
