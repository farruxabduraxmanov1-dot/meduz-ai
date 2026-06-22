"""MedUZ AI - Backend server for the AI-First Healthcare Ecosystem."""
from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
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


class HomeVisitResponse(BaseModel):
    id: str
    service: str
    status: str = "submitted"
    eta_minutes: int = 35
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
    visit = {
        "id": str(uuid.uuid4()),
        "service": req.service,
        "address": req.address,
        "preferred_time": req.preferred_time,
        "phone": req.phone,
        "notes": req.notes or "",
        "patient_name": req.patient_name,
        "status": "submitted",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.home_visits.insert_one(dict(visit))
    return HomeVisitResponse(
        id=visit["id"],
        service=visit["service"],
        status="submitted",
        eta_minutes=35,
        created_at=datetime.now(timezone.utc),
    )


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
