<div align="center">

# 🌊 AIWave Agency

**AI voice agents & workflow automation — built for the service industry.**

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>

---

## what is this?

AIWave is a full-stack SaaS platform that lets agencies deploy AI voice agents, automate workflows, manage contacts, run campaigns, and track everything — all from one slick dashboard.

Think: your business on autopilot. 🤖

---

## ✨ features

- 🎙️ **AI Voice Agents** — human-sounding calls that book, follow up, and qualify leads
- 🔄 **Workflow Automation** — post-call CRM updates, SMS, emails — all hands-free
- 📊 **Analytics Dashboard** — real-time call stats, agent performance, campaign ROI
- 📅 **Booking Integration** — Cal.com-powered scheduling built right in
- 🔐 **Auth** — Supabase email/OTP + Google OAuth, protected routes
- 🏢 **Multi-industry** — medical spas, dental, real estate, barber shops & more

---

## 🚀 getting started

**Prerequisites:** Node.js 18+

```bash
# 1. install deps
npm install

# 2. set up your env
cp .env.example .env
# fill in your Supabase URL + anon key

# 3. run it
npm run dev
```

App runs at → `http://localhost:3000`

---

## 🗂️ project structure

```
src/
├── components/
│   ├── landing/        # hero, pricing, demo, booking
│   ├── dashboard/      # agents, campaigns, analytics, settings...
│   ├── Navbar.tsx
│   └── AuthModal.tsx
├── services/           # voice, chat, n8n, firebase integrations
├── lib/                # supabase client + utils
└── App.tsx             # routing + auth logic
```

---

## 🔑 env variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🛠️ scripts

| command | what it does |
|---|---|
| `npm run dev` | dev server on port 3000 |
| `npm run build` | production build |
| `npm run preview` | preview the build |
| `npm run lint` | type-check with tsc |

---

## 📦 stack

| layer | tech |
|---|---|
| frontend | React 19 + TypeScript |
| styling | Tailwind CSS v4 + Framer Motion |
| auth & db | Supabase |
| routing | React Router v7 |
| charts | Recharts |
| bundler | Vite 6 |

---

<div align="center">

made with 🌊 by **AIWave Agency** · © 2026

</div>
