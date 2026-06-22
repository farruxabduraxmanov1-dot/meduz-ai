"""MedUZ AI backend integration tests against the public preview URL."""
import os
import uuid
import pytest
import requests

# Use the public preview URL the mobile app actually talks to
BASE_URL = (
    os.environ.get("EXPO_PUBLIC_BACKEND_URL")
    or os.environ.get("EXPO_BACKEND_URL")
    or "https://health-ecosystem-uz.preview.emergentagent.com"
).rstrip("/")


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ============== HEALTH ==============
class TestHealth:
    def test_health_ok(self, api):
        r = api.get(f"{BASE_URL}/api/health", timeout=20)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["status"] == "ok"
        assert body.get("service") == "MedUZ AI"


# ============== AUTH ==============
class TestAuthMockLogin:
    def test_phone_login(self, api):
        r = api.post(
            f"{BASE_URL}/api/auth/mock-login",
            json={"method": "phone", "phone": "+998901234567"},
            timeout=20,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["method"] == "phone"
        assert body["user_id"]
        assert body["name"]
        assert body["token"].startswith("demo-token-")

    def test_google_login(self, api):
        r = api.post(
            f"{BASE_URL}/api/auth/mock-login",
            json={"method": "google", "email": "demo@meduz.uz", "name": "Demo User"},
            timeout=20,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["method"] == "google"
        assert body["name"] == "Demo User"
        assert body["user_id"]
        assert body["token"]


# ============== AI CHAT ==============
class TestAIChat:
    SYMPTOM = "My child has fever 39C and ear pain"

    @pytest.mark.parametrize("language", ["en", "ru", "uz"])
    def test_ai_chat_multilingual(self, api, language):
        session_id = f"TEST_{language}_{uuid.uuid4()}"
        r = api.post(
            f"{BASE_URL}/api/ai/chat",
            json={
                "session_id": session_id,
                "text": self.SYMPTOM,
                "language": language,
                "role": "patient",
            },
            timeout=90,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["session_id"] == session_id
        assert isinstance(body["reply"], str) and len(body["reply"]) > 40
        assert isinstance(body["suggestions"], list) and len(body["suggestions"]) >= 1
        # urgency may be None but if present should be one of the 4 levels
        if body.get("urgency"):
            assert body["urgency"] in {"LOW", "MEDIUM", "HIGH", "EMERGENCY"}


# ============== DOCTOR TOOL ==============
class TestDoctorTool:
    def test_medical_summary(self, api):
        r = api.post(
            f"{BASE_URL}/api/ai/doctor-tool",
            json={
                "tool": "medical_summary",
                "patient_context": (
                    "45 year old male, chest pain on exertion for 2 weeks, "
                    "hypertension, smoker, BP 150/95, ECG shows ST depression in V4-V6."
                ),
                "language": "en",
            },
            timeout=90,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["tool"] == "medical_summary"
        assert isinstance(body["content"], str) and len(body["content"]) > 40


# ============== APPOINTMENTS ==============
class TestAppointments:
    def test_create_appointment(self, api):
        payload = {
            "doctor_id": "doc-1",
            "doctor_name": "Dr. Akmal Karimov",
            "patient_name": "TEST_Patient",
            "date": "2026-02-01",
            "time": "10:30",
            "consultation_type": "offline",
            "notes": "TEST appointment",
        }
        r = api.post(f"{BASE_URL}/api/appointments", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["id"]
        assert body["status"] == "confirmed"
        assert body["doctor_name"] == payload["doctor_name"]
        assert body["consultation_type"] == "offline"


# ============== HOME VISITS ==============
class TestHomeVisits:
    def test_create_home_visit(self, api):
        payload = {
            "service": "nurse_visit",
            "address": "TEST_Tashkent, Yunusabad",
            "preferred_time": "Today 5pm",
            "phone": "+998901234567",
            "notes": "TEST home visit",
            "patient_name": "TEST_Patient",
        }
        r = api.post(f"{BASE_URL}/api/home-visits", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["id"]
        assert body["status"] == "submitted"
        assert body["eta_minutes"] == 35
        assert body["service"] == "nurse_visit"
