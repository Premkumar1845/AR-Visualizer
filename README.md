# AR-Visualizer

> Place digital objects into the real world. A browser-based spatial visualization platform powered by WebXR, React Three Fiber, and Supabase.

A production-grade monorepo containing a cinematic React + TypeScript frontend and an Express + Supabase backend. Inspired by Apple Vision Pro, Linear, Arc Browser, Nothing OS, Tesla UI, and Adobe Substance 3D.

---

## Monorepo Structure

```
AR-Visualizer/
├── client/        # React + Vite + TS + Tailwind + R3F + WebXR
├── server/        # Node + Express MVC + Supabase
└── database/      # PostgreSQL schema + RLS policies
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- A Supabase project (free tier works)

### 1. Database
Run `database/schema.sql` inside your Supabase SQL editor. This provisions all tables, RLS policies, and storage buckets.

### 2. Backend
```bash
cd server
cp .env.example .env   # fill in Supabase URL + service role key + JWT secret
npm install
npm run dev            # http://localhost:5000
```

### 3. Frontend
```bash
cd client
cp .env.example .env   # fill in VITE_API_URL + VITE_SUPABASE_URL + anon key
npm install
npm run dev            # http://localhost:5173
```

---

## Feature Map

| Area | Status |
|------|--------|
| Cinematic landing page | ✅ |
| JWT + Supabase auth (login / register / forgot) | ✅ |
| Protected dashboard | ✅ |
| Drag-drop upload studio (PNG / JPG / WebP) | ✅ |
| WebXR AR workspace (R3F + @react-three/xr) | ✅ |
| Saved scenes library | ✅ |
| MVC backend with services + middleware | ✅ |
| Supabase storage + row-level security | ✅ |
| 3D animated logo system | ✅ |
| Mobile + tablet + desktop responsive | ✅ |

---

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Zustand, Axios, React Hook Form, Zod, Lucide, Three.js, @react-three/fiber, @react-three/drei, @react-three/xr.

**Backend:** Node, Express, JWT, bcrypt, Multer, Sharp, Supabase JS.

**Database / Storage:** Supabase (PostgreSQL + Auth + Storage + RLS).

---

## Design System

- Backgrounds: `#070708`, `#0F1115`, `#15171C`
- Primary accent: `#7b61ff`
- Secondary accent: `#8ea7ff`
- Text: `#F5F7FA`, `#A8B0BD`
- Cards: `rgba(255,255,255,0.04)` · Borders: `rgba(255,255,255,0.08)`
- Typography: Inter (UI), Manrope (body), Cabin (mono accents), Instrument Serif (editorial highlights).

---

## Deployment

- **Frontend** → Vercel (`client/`)
- **Backend** → Railway or Render (`server/`)
- **DB + Storage** → Supabase

See each subdirectory's README for environment variables.
