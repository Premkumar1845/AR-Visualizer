<div align="center">

# AR‑Visualizer

### Place digital objects into the real world - directly from your browser.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-r160-000000?logo=three.js&logoColor=white)](https://threejs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node](https://img.shields.io/badge/Node-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)

</div>

## Overview

**AR‑Visualizer** is a browser‑native augmented reality workspace that lets users upload 3D assets, place them in real‑world space using WebXR, and save persistent scenes to the cloud. It is designed as a cinematic, production‑grade reference application showcasing modern full‑stack patterns:

- **Frontend:** React 18 + TypeScript + Vite, with React Three Fiber for 3D and `@react-three/xr` for WebXR AR sessions.
- **Backend:** Express (MVC) on Node 20+ with Helmet, CORS, rate limiting, JWT authentication, and Supabase as the data + storage layer.
- **Database:** PostgreSQL on Supabase with full Row‑Level Security policies, plus a `ar-assets` storage bucket for uploads.

The UI takes design cues from **Apple Vision Pro**, **Linear**, **Arc Browser**, **Nothing OS**, **Tesla UI**, and **Adobe Substance 3D** — clean type, glass surfaces, and motion that feels precise rather than decorative.

---

## Features

| Area | Capability |
|------|------------|
| Auth | Email/password sign‑up & sign‑in, JWT sessions, protected routes, forgot‑password flow |
| Upload Studio | Drag‑and‑drop GLB/GLTF/USDZ uploads, automatic asset processing pipeline, thumbnail generation |
| AR Workspace | WebXR session entry, hit‑test placement, object selection/translation, gesture‑based controls |
| Scene Persistence | Save & reload positioned objects per user, cloud‑synced via Supabase |
| Asset Library | Personal library with filtering, preview, and deletion |
| Dashboard | Activity log, upload counts, recent scenes |
| Security | Helmet, CORS allow‑list, rate limiting, bcrypt password hashing, RLS at the database level |
| DX | Type‑safe API client, Zustand state stores, React Hook Form + Zod validation |

---

## Tech Stack

### Client (`/client`)
- React 18, TypeScript, Vite 5
- Tailwind CSS 3 with a custom design token system
- React Router 6
- React Three Fiber 8 + Drei + `@react-three/xr` 6
- Zustand 5 for global state
- React Hook Form + Zod
- Axios with an interceptor layer

### Server (`/server`)
- Node.js 20+ (ESM)
- Express 4 (controllers / services / routes split)
- Helmet, CORS, `express-rate-limit`, Morgan
- bcryptjs + jsonwebtoken
- Multer (memory storage) + Sharp for image processing
- `@supabase/supabase-js` (service‑role client)

### Data
- PostgreSQL via Supabase
- Supabase Storage (`ar-assets` bucket)
- Row‑Level Security on every table

---

## Architecture

```
                ┌──────────────────────┐
                │      Browser         │
                │  React + R3F + XR    │
                └─────────┬────────────┘
                          │ HTTPS (JWT)
                          ▼
                ┌──────────────────────┐
                │   Express API        │
                │  (controllers /      │
                │   services / mw)     │
                └─────────┬────────────┘
                          │ service‑role key
                          ▼
                ┌──────────────────────┐
                │   Supabase           │
                │  Postgres + Storage  │
                │  + RLS policies      │
                └──────────────────────┘
```

The browser talks **only** to the Express API. The API holds the Supabase service‑role key and is the single source of truth for writes, ensuring RLS cannot be bypassed from the client.

---

## Project Structure

```
AR-Visualizer/
├── client/
│   ├── public/
│   └── src/
│       ├── components/      # Navbar, ProtectedRoute, HeroVisual, Logo3D
│       ├── layouts/         # AppLayout, AuthLayout
│       ├── pages/           # Landing, Login, Register, Dashboard, UploadStudio, ARWorkspace, Library, ForgotPassword
│       ├── services/        # api, auth, asset, scene
│       ├── store/           # authStore, sceneStore
│       ├── xr/              # PlacedObject and XR helpers
│       └── utils/
├── server/
│   ├── config/              # env, supabase
│   ├── controllers/         # auth, asset, scene
│   ├── services/            # auth, asset, scene
│   ├── routes/              # auth, asset, scene
│   ├── middleware/          # auth, error, upload, validate
│   ├── xr-processing/       # asset pipeline
│   ├── utils/               # ApiError, asyncHandler
│   ├── app.js
│   └── server.js
└── database/
    └── schema.sql           # Tables + RLS + storage policies
```

---

## Quick Start

### Prerequisites
- **Node.js 20+** and **npm 10+**
- A free **Supabase** project (URL + service role key + anon/publishable key)
- A modern browser with WebXR support for AR (Chrome on Android, or a WebXR‑capable headset)

### 1 — Provision the database
Open the Supabase SQL editor and run the full contents of [database/schema.sql](database/schema.sql). This creates all tables, RLS policies, and the `ar-assets` storage bucket.

### 2 — Backend
```bash
cd server
cp .env.example .env       # then edit with your real values
npm install
npm run dev                # http://localhost:5000
```

### 3 — Frontend
```bash
cd client
cp .env.example .env       # then edit with your real values
npm install
npm run dev                # http://localhost:5173
```

Open `http://localhost:5173`, create an account, and you're in.

---

## Environment Variables

### `server/.env`
| Key | Description |
|-----|-------------|
| `PORT` | API port (default `5000`) |
| `CLIENT_ORIGIN` | Allowed CORS origin (e.g. `http://localhost:5173`) |
| `JWT_SECRET` | Long random string used to sign session tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `SUPABASE_URL` | `https://<project>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **secret** key (server‑only) |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name (default `ar-assets`) |

### `client/.env`
| Key | Description |
|-----|-------------|
| `VITE_API_URL` | Backend base URL incl. `/api`, e.g. `http://localhost:5000/api` |
| `VITE_SUPABASE_URL` | Public Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Publishable (anon) key |

> Both `.env` files are git‑ignored. Never commit real keys.

---

## Database Schema

Defined fully in [database/schema.sql](database/schema.sql):

- **users** — accounts (email, name, avatar, hashed password)
- **uploaded_assets** — 3D files in Supabase Storage with metadata
- **ar_sessions** — per‑user AR session telemetry
- **saved_scenes** — JSON scene graphs of placed objects
- **activity_logs** — audit trail
- **subscriptions** — billing tier per user

All tables have **Row‑Level Security** enabled. The backend uses the service‑role key to perform validated writes on behalf of the authenticated user.

---

## API Reference

Base URL: `<server>/api`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/login` | Email + password login → JWT |
| `POST` | `/auth/forgot-password` | Request password reset |
| `GET`  | `/auth/me` | Current user (requires `Authorization: Bearer <jwt>`) |

### Assets
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/assets/upload` | Upload a 3D file (multipart) |
| `GET`  | `/assets` | List my assets |
| `GET`  | `/assets/:id` | Get one asset |
| `DELETE` | `/assets/:id` | Delete asset + storage object |

### Scenes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/scenes` | Save scene graph |
| `GET`  | `/scenes` | List my scenes |
| `GET`  | `/scenes/:id` | Load scene |
| `DELETE` | `/scenes/:id` | Delete scene |

---

## Available Scripts

### `client/`
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server on `:5173` |
| `npm run build` | Type‑check + production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint over `src/` |

### `server/`
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Express with `--watch` |
| `npm start` | Start Express in production mode |

---

## Deployment

### Client → **Vercel**
1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New… → Project** → import the repo.
3. **Configure Project:**
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**
   - `VITE_API_URL` → your deployed backend, e.g. `https://ar-visualizer-api.onrender.com/api`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy.

### Server → **Render** or **Railway**
The Express server is a long‑running process (rate limiter + multer + Sharp), so a traditional Node host fits best.

**Render:**
1. **New → Web Service** → connect repo.
2. **Root Directory:** `server`
3. **Build Command:** `npm install`
4. **Start Command:** `node server.js`
5. Add all server env vars from the table above.
6. Set `CLIENT_ORIGIN` to your final Vercel URL.

### Database → **Supabase** (already hosted)
Just keep the same project used in development, or create a new one for production and re‑run `database/schema.sql`.

---

## Roadmap

- [ ] Multiplayer shared scenes (Supabase Realtime)
- [ ] USDZ Quick Look fallback on iOS Safari
- [ ] Asset versioning + soft delete
- [ ] Public scene gallery
- [ ] Stripe‑backed subscription tiers
- [ ] CLI for bulk asset upload

---

## Contributing

PRs and issues are welcome. Please:

1. Fork the repo and create a feature branch.
2. Run `npm run lint` in `client/` and ensure the server starts cleanly.
3. Open a pull request describing the change and any screenshots/screen recordings.

---

## License

[MIT](LICENSE) © Premkumar — built with care.
