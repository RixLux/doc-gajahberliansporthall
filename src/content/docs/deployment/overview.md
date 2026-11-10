---
title: Deployment Overview
description: Recommended hosting strategies for pre-production demos, dedicated VPS setups, and switching between local, demo, and production environments.
---

Gajah Berlian Sports Hall is designed to run across all project stages — from **local development**, to a **100% free pre-production demo stack**, to a **high-availability production deployment**.

---

## 1. Free Pre-Production Demo Stack ($0.00 / Month)

For teams evaluating the platform or running a public demo without infrastructure costs, the following fully-free stack is recommended. Each service's free tier is stable and does not require a credit card.

```mermaid
graph LR
    Vercel["Frontend: Vercel (Free)<br/>gajahberliansporthall.vercel.app"]
    Render["Backend API: Render (Free Web Service)<br/>your-api.onrender.com"]
    Supabase["Database: Supabase (Free Postgres)<br/>Includes PostGIS & 500MB DB"]
    Upstash["Cache & Locks: Upstash (Free Redis)<br/>10,000 commands/day serverless"]
    Midtrans["Payment: Midtrans Sandbox (Free)<br/>Virtual Accounts & QRIS Simulator"]

    Vercel -->|HTTPS REST| Render
    Render --> Supabase
    Render --> Upstash
    Render <--> Midtrans
```

### Service Selection Rationale

| Service | Provider | Notes |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | Automatic deployments from GitHub; free tier is generous |
| **Backend API** | [Render](https://render.com) | Runs NestJS from a connected GitHub repository |
| **PostgreSQL** | [Supabase](https://supabase.com) or [Neon](https://neon.tech) | Free tier never expires; includes PostGIS extension |
| **Redis** | [Upstash](https://upstash.com) | Serverless Redis; 10,000 commands/day on free tier |
| **Payments** | Midtrans Sandbox | Full simulator for Virtual Accounts and QRIS; no charges |

**Important caveats:**
- **Render Free Web Service**: The service enters a sleep state after 15 minutes of inactivity. The first request following a sleep period will incur a cold-start delay of approximately 45 seconds.
- **Avoid Render Free PostgreSQL**: Render's free PostgreSQL instance is **automatically deleted after 30 days**. Use Supabase or Neon instead — their free tiers have no expiry.
- **Avoid Render Redis**: Render discontinued free Redis (minimum \$7/month). Use Upstash, which provides a single `rediss://...` connection string compatible with the backend out of the box.

### Setup Steps

1. **Database** — Create a free project on [Supabase](https://supabase.com). Copy the `Transaction Pooler` or `Direct Connection` string and use it as `DATABASE_URL`.
2. **Redis** — Create a free Redis database on [Upstash](https://upstash.com). Copy the `REDIS_URL` value (`rediss://default:xxx@xxx.upstash.io:6379`).
3. **Backend Web Service** — Create a new Web Service on [Render](https://render.com) and connect the backend repository:
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build && npm run seed`
   - **Start Command**: `npm run start:prod`
   - **Environment Variables**: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `MIDTRANS_SERVER_KEY`
4. **Frontend API Endpoint** — In the Vercel project settings under **Environment Variables**, set `VITE_API_BASE_URL` to `https://your-app.onrender.com/api/v1` and trigger a new deployment.

---

## 2. Environment Switching Strategy

The project supports three distinct deployment targets, each driven by a separate environment configuration. This allows developers to work locally, test against cloud services, or deploy to production without changing any source code.

```mermaid
flowchart TD
    subgraph EnvModes["Target Stages"]
        Local["1. Local Dev<br/>(localhost:5173 + localhost:3000)"]
        Demo["2. Pre-Production Demo<br/>(Vercel + Render + Supabase + Upstash)"]
        Prod["3. Production<br/>(Custom Domain + VPS / Cloud)"]
    end

    subgraph FEControls["Frontend Controls (Vite Modes)"]
        Cmd1["npm run dev<br/>(.env.development / .env.local)"]
        Cmd2["npm run dev:demo / build:demo<br/>(.env.demo)"]
        Cmd3["npm run build<br/>(Vercel Environment Variables)"]
    end

    Cmd1 --> Local
    Cmd2 --> Demo
    Cmd3 --> Prod
```

### A. Frontend Environment Switching via npm Scripts

Vite's native mode system is used to load environment-specific variables without code changes. The following scripts are defined in `FE-Gajah-Berlian-Sport-Hall/package.json`:

```json
"scripts": {
  "dev": "vite",
  "dev:demo": "vite --mode demo",
  "build": "vite build",
  "build:demo": "vite build --mode demo"
}
```

**Local development** (frontend → local backend):
```bash
npm run dev
```
Loads `.env.local` or `.env.development`:
```ini
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

**Local frontend → cloud demo backend**:
```bash
npm run dev:demo
```
Loads `.env.demo`:
```ini
VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
```
This mode is useful for testing frontend changes in isolation while keeping the persistent cloud database and payment sandbox as the data source.

### B. Vercel Environment Management

In the [Vercel Dashboard](https://vercel.com) under **Project Settings → Environment Variables**, configure:

| Environment | Variable | Value |
|---|---|---|
| Production | `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api/v1` |

Vercel injects these variables at build time, so each deployment automatically targets the correct backend without any manual file edits.

### C. Alternative: Instant Local Demo via Cloudflare Tunnel

For situations where a quick public demo is needed without deploying any service to the cloud (e.g., a live presentation or a reviewer testing on a shared device), Cloudflare Tunnel can expose a locally running backend over a temporary HTTPS URL:

1. Start the backend locally on port 3000.
2. Run the tunnel — no account or installation required:
   ```bash
   npx cloudflared tunnel --url http://localhost:3000
   ```
3. Cloudflare outputs a temporary public HTTPS URL (e.g. `https://random-words.trycloudflare.com`).
4. Set that URL as `VITE_API_BASE_URL` in Vercel's environment variables and redeploy. The hosted frontend will now proxy all API requests to the local machine.

> **Note**: The temporary URL changes each time `cloudflared` is restarted. This approach is suitable for short-lived demos only.

## Pre-Deployment Checklist

Before deploying to production, make sure you have prepared:  

1. **Domain Names**:
   - e.g.`app.gajahberlian.com` (Frontend)
   - e.g.`api.gajahberlian.com` (Backend API)
2. **Secrets & Keys**:
   - High-entropy `JWT_SECRET` and `JWT_REFRESH_SECRET` (generate with `openssl rand -base64 32`).
   - Production PostgreSQL connection string.
   - Production Redis connection string.
   - Midtrans Production Server Key and Client Key.
3. **Webhook URL**:
   - Register `https://api.gajahberlian.com/api/v1/webhooks/midtrans` in the Midtrans Merchant Administration Portal (MAP).
