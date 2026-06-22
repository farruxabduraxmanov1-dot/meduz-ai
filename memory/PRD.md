# MedUZ AI — Product Requirements (Investor Demo MVP)

## Overview
**MedUZ AI** is an investor-ready clickable mobile MVP of an AI-First Healthcare Ecosystem for Uzbekistan. Built in React Native (Expo) + FastAPI + MongoDB. The AI assistant (Claude Sonnet 4.5 via Emergent LLM key) is the entry point of the platform; doctors, clinics, pharmacies, medical services and home medical assistance are all reachable through the AI.

## Languages
UZ / RU / EN with selection screen on first launch. UI fully translated. AI responses adapt to the selected language.

## Authentication
Mocked phone+OTP and Google login (no real OTP/OAuth — instant demo session). Local storage persists language, role and user.

## Roles (all four fully clickable)
1. **Patient** — Dashboard with dominant AI Assistant card + 6 modules: AI Chat, Doctors, Medical Organizations, Pharmacies, Medical Services, Home Medical Assistance. Includes booking flow, organization profiles, medicine search, home care request flow.
2. **Doctor** — Cabinet with appointments, analytics, earnings, AI assistant for doctors (real Claude tool: medical summary / recommendations / SOAP notes / follow-up plan), reviews, profile/settings.
3. **Medical Organization Admin** — Console with doctor management, departments, analytics (visits & revenue), marketing tools (campaigns, featured org).
4. **Medical Services Provider** — Dashboard with orders, income, gallery, reviews.

## Backend
FastAPI app at `/app/backend/server.py`. Endpoints:
- `GET /api/health`
- `POST /api/auth/mock-login` (phone/google)
- `POST /api/ai/chat` (Claude Sonnet 4.5, multilingual, image-capable, persists chat messages in MongoDB)
- `POST /api/ai/doctor-tool` (4 clinical tools)
- `POST /api/appointments` (persists booking)
- `POST /api/home-visits` (persists home visit request)

## Demo data (in-app)
- 20 doctors across all major specialties and 6 Uzbekistan cities
- 15 medical organizations (public hospitals, private clinics, polyclinics, specialized centers)
- 15 pharmacies + 8 medicines
- 15 independent medical service providers
- Realistic reviews, departments, schedules, charts

## Design system
- Background `#F5F7FF`, white surfaces with soft shadows
- Blue→Purple gradient accents (`#2563EB` → `#7C3AED`)
- Large rounded corners, premium spacing, modern icons (MaterialCommunityIcons + Ionicons)
- Medical Jellyfish concept logo as gradient circle with `jellyfish-outline` icon

## Monetization (architectural placeholders — no real payments)
- Featured Doctor / Featured Organization / Featured Provider premium tiers
- Marketing campaigns, advanced analytics, AI Assistant Pro
- Home care commission model architecture

## Investor differentiator
AI is the entry point, not a feature. Every healthcare action funnels through MedUZ AI's assistant.
