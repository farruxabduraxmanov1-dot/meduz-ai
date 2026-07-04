"""MedUZ AI V3 — Chat REST + WebSocket integration tests.

Covers:
- POST /api/chat/conversations (idempotent)
- GET  /api/chat/conversations?user_id=
- GET  /api/chat/messages?conversation_id=
- POST /api/chat/mark-read
- WS   /api/ws/chat/<user_id>  (hello, ping/pong, message ack, typing, read, auto-reply)
"""
import os
import json
import uuid
import asyncio
import pytest
import requests
import websockets  # already installed in the env

PUBLIC_HTTP = (
    os.environ.get("EXPO_PUBLIC_BACKEND_URL")
    or os.environ.get("EXPO_BACKEND_URL")
    or "https://health-ecosystem-uz.preview.emergentagent.com"
).rstrip("/")

# WS: kubernetes ingress supports wss on the public URL, but also allow local ws for CI
PUBLIC_WS = "wss://" + PUBLIC_HTTP.replace("https://", "").replace("http://", "")
LOCAL_WS  = "ws://localhost:8001"


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _uid(prefix: str = "TEST"):
    return f"{prefix}_{uuid.uuid4().hex[:10]}"


# ============== REST ==============
class TestChatRest:
    def test_create_conversation_returns_sorted_id(self, api):
        u1 = _uid("u1")
        u2 = "dr-001"  # sorted alphabetically → dr-001 < u1 (t < u)
        payload = {
            "user_id": u1, "user_role": "patient", "user_name": "Patient A", "user_avatar": "",
            "peer_id": u2, "peer_role": "doctor",  "peer_name": "Dr. Akmal",  "peer_avatar": "",
        }
        r = api.post(f"{PUBLIC_HTTP}/api/chat/conversations", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        body = r.json()
        # Sorted ids: dr-001 first (alphabetical), then TEST_u1_....
        expected = f"conv_{sorted([u1, u2])[0]}__{sorted([u1, u2])[1]}"
        assert body.get("conversation_id") == expected

    def test_create_conversation_is_idempotent(self, api):
        u1 = _uid("u1")
        u2 = "sp-001"
        payload = {
            "user_id": u1, "user_role": "patient", "user_name": "P", "user_avatar": "",
            "peer_id": u2, "peer_role": "service",  "peer_name": "Sevara",  "peer_avatar": "",
        }
        r1 = api.post(f"{PUBLIC_HTTP}/api/chat/conversations", json=payload, timeout=20).json()
        r2 = api.post(f"{PUBLIC_HTTP}/api/chat/conversations", json=payload, timeout=20).json()
        assert r1["conversation_id"] == r2["conversation_id"]

    def test_list_conversations_shape(self, api):
        u1 = _uid("u1")
        u2 = "admin-org-001"
        api.post(f"{PUBLIC_HTTP}/api/chat/conversations", json={
            "user_id": u1, "user_role": "patient", "user_name": "P", "user_avatar": "",
            "peer_id": u2, "peer_role": "admin",   "peer_name": "Reception", "peer_avatar": "",
        }, timeout=20)
        r = api.get(f"{PUBLIC_HTTP}/api/chat/conversations", params={"user_id": u1}, timeout=20)
        assert r.status_code == 200, r.text
        body = r.json()
        assert "conversations" in body
        assert len(body["conversations"]) >= 1
        c = body["conversations"][0]
        for key in ("conversation_id", "peer", "peer_online", "last_message", "last_message_at", "unread"):
            assert key in c, f"missing {key} in conversation row"
        peer = c["peer"]
        for key in ("user_id", "role", "name"):
            assert key in peer

    def test_get_messages_empty_history(self, api):
        u1 = _uid("u1")
        u2 = "dr-002"
        api.post(f"{PUBLIC_HTTP}/api/chat/conversations", json={
            "user_id": u1, "user_role": "patient", "user_name": "P", "user_avatar": "",
            "peer_id": u2, "peer_role": "doctor",  "peer_name": "Dr X",  "peer_avatar": "",
        }, timeout=20)
        cid = f"conv_{sorted([u1, u2])[0]}__{sorted([u1, u2])[1]}"
        r = api.get(f"{PUBLIC_HTTP}/api/chat/messages", params={"conversation_id": cid}, timeout=20)
        assert r.status_code == 200
        assert r.json() == {"messages": []}

    def test_mark_read_requires_fields(self, api):
        r = api.post(f"{PUBLIC_HTTP}/api/chat/mark-read", json={}, timeout=20)
        assert r.status_code == 400


# ============== WEBSOCKET ==============
async def _recv_until(ws, type_name: str, timeout: float = 8.0):
    """Receive frames until one with the given type is found; ignore others."""
    end = asyncio.get_event_loop().time() + timeout
    collected = []
    while asyncio.get_event_loop().time() < end:
        remaining = max(0.05, end - asyncio.get_event_loop().time())
        try:
            raw = await asyncio.wait_for(ws.recv(), timeout=remaining)
        except asyncio.TimeoutError:
            break
        msg = json.loads(raw)
        collected.append(msg)
        if msg.get("type") == type_name:
            return msg, collected
    return None, collected


class TestChatWebSocket:
    """Uses LOCAL ws://localhost:8001 which is the same process supervisor manages."""

    @pytest.mark.asyncio
    async def test_hello_on_connect(self):
        uid = _uid("wsuser")
        async with websockets.connect(f"{LOCAL_WS}/api/ws/chat/{uid}") as ws:
            raw = await asyncio.wait_for(ws.recv(), timeout=5)
            hello = json.loads(raw)
            assert hello["type"] == "hello"
            assert hello["user_id"] == uid
            assert "online_users" in hello and isinstance(hello["online_users"], list)
            assert "ts" in hello

    @pytest.mark.asyncio
    async def test_ping_pong(self):
        uid = _uid("wsping")
        async with websockets.connect(f"{LOCAL_WS}/api/ws/chat/{uid}") as ws:
            # drain hello
            await ws.recv()
            await ws.send(json.dumps({"type": "ping"}))
            pong, _ = await _recv_until(ws, "pong", timeout=5)
            assert pong is not None, "no pong received"
            assert pong["type"] == "pong"

    @pytest.mark.asyncio
    async def test_message_ack_and_persistence(self):
        sender = _uid("pat")
        peer = "dr-999"
        async with websockets.connect(f"{LOCAL_WS}/api/ws/chat/{sender}") as ws:
            await ws.recv()  # hello
            await ws.send(json.dumps({
                "type": "message",
                "peer_id": peer,
                "peer_role": "doctor",
                "peer_name": "Dr Nine",
                "sender_role": "patient",
                "sender_name": "TestPatient",
                "text": "Hello doctor",
            }))
            ack, _ = await _recv_until(ws, "message_ack", timeout=5)
            assert ack is not None
            assert ack["status"] == "delivered"
            m = ack["message"]
            assert m["isMe"] is True
            assert m["text"] == "Hello doctor"
            assert m["sender_id"] == sender
            assert m["conversation_id"].startswith("conv_")

        # Verify persistence via REST
        cid = ack["message"]["conversation_id"]
        r = requests.get(f"{PUBLIC_HTTP}/api/chat/messages", params={"conversation_id": cid}, timeout=15)
        assert r.status_code == 200
        msgs = r.json()["messages"]
        assert any(m["text"] == "Hello doctor" for m in msgs)

    @pytest.mark.asyncio
    async def test_typing_forwarded_between_peers(self):
        a = _uid("A")
        b = _uid("B")
        async with websockets.connect(f"{LOCAL_WS}/api/ws/chat/{a}") as wsa, \
                   websockets.connect(f"{LOCAL_WS}/api/ws/chat/{b}") as wsb:
            await wsa.recv(); await wsb.recv()  # hellos
            # b may also get a presence event about a; drain
            await asyncio.sleep(0.3)
            # send typing from A -> B
            await wsa.send(json.dumps({"type": "typing", "peer_id": b, "is_typing": True}))
            typing, _ = await _recv_until(wsb, "typing", timeout=5)
            assert typing is not None
            assert typing["is_typing"] is True
            assert typing["user_id"] == a

    @pytest.mark.asyncio
    async def test_read_receipt_notifies_peer(self):
        a = _uid("A")
        b = _uid("B")
        async with websockets.connect(f"{LOCAL_WS}/api/ws/chat/{a}") as wsa, \
                   websockets.connect(f"{LOCAL_WS}/api/ws/chat/{b}") as wsb:
            await wsa.recv(); await wsb.recv()
            await asyncio.sleep(0.3)
            # A sends message to B (both online -> B receives it)
            await wsa.send(json.dumps({
                "type": "message", "peer_id": b, "peer_role": "doctor", "peer_name": "B",
                "sender_role": "patient", "sender_name": "A", "text": "hey",
            }))
            ack, _ = await _recv_until(wsa, "message_ack", timeout=5)
            cid = ack["message"]["conversation_id"]
            incoming, _ = await _recv_until(wsb, "message", timeout=5)
            assert incoming is not None
            # B marks read → A should get a 'read' notification
            await wsb.send(json.dumps({"type": "read", "conversation_id": cid, "peer_id": a}))
            read_evt, _ = await _recv_until(wsa, "read", timeout=5)
            assert read_evt is not None
            assert read_evt["conversation_id"] == cid
            assert read_evt["user_id"] == b

    @pytest.mark.asyncio
    async def test_auto_reply_from_claude_when_peer_offline(self):
        """When patient sends to offline doctor, backend must:
           - reply typing(true), typing(false)
           - then push a 'message' with isMe:false containing a real Claude reply.
        """
        sender = _uid("patAI")
        peer = "dr-offline-xyz"  # nobody connected as this uid
        async with websockets.connect(f"{LOCAL_WS}/api/ws/chat/{sender}") as ws:
            await ws.recv()  # hello
            await ws.send(json.dumps({
                "type": "message",
                "peer_id": peer, "peer_role": "doctor", "peer_name": "Dr. Akmal Karimov",
                "sender_role": "patient", "sender_name": "Test Patient",
                "text": "Hello, I have a mild headache since morning. Should I be worried?",
            }))
            ack, _ = await _recv_until(ws, "message_ack", timeout=5)
            assert ack is not None
            # typing true within ~4s
            t_on, _ = await _recv_until(ws, "typing", timeout=6)
            assert t_on is not None and t_on["is_typing"] is True
            # Wait for final 'message' from peer (Claude reply). Give it up to 12s total budget.
            reply, seen = await _recv_until(ws, "message", timeout=15)
            assert reply is not None, f"no auto-reply received; got: {[m.get('type') for m in seen]}"
            m = reply["message"]
            assert m["isMe"] is False
            assert m["sender_id"] == peer
            assert m["sender_role"] == "doctor"
            assert isinstance(m["text"], str) and len(m["text"]) > 5
            # Should NOT be the hardcoded fallback (i.e., Claude actually ran).
            # We can't assert exact wording, but at minimum reply is nonempty and different from user's message.
            assert m["text"].lower() != "hello, i have a mild headache since morning. should i be worried?"

    @pytest.mark.asyncio
    async def test_online_peer_receives_message_no_autoreply(self):
        """When peer is online, no Claude auto-reply should be triggered."""
        a = _uid("pat")
        b = _uid("doc")
        async with websockets.connect(f"{LOCAL_WS}/api/ws/chat/{a}") as wsa, \
                   websockets.connect(f"{LOCAL_WS}/api/ws/chat/{b}") as wsb:
            await wsa.recv(); await wsb.recv()
            await asyncio.sleep(0.3)
            await wsa.send(json.dumps({
                "type": "message", "peer_id": b, "peer_role": "doctor", "peer_name": "Doc",
                "sender_role": "patient", "sender_name": "Pat", "text": "hi",
            }))
            # A gets ack, B gets message
            ack, _ = await _recv_until(wsa, "message_ack", timeout=5)
            inc, _ = await _recv_until(wsb, "message", timeout=5)
            assert ack is not None and inc is not None
            # Now wait ~5s and confirm A does NOT receive an auto-reply typing/message
            typing, seen = await _recv_until(wsa, "typing", timeout=5)
            assert typing is None, f"unexpected typing/auto-reply when peer online: {seen}"
