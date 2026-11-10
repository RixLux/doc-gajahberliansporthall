---
title: 5-Minute Quickstart
description: Get the complete Gajah Berlian Sports Hall stack running locally in under 5 minutes.
---

This guide walks you through setting up both the **Backend (NestJS + PostgreSQL + Redis)** and **Frontend (React + Vite)** on your local development machine.

---

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js**: v20 LTS or higher (`node -v`)
- **npm**: v10 or higher
- **Docker & Docker Compose**: For local PostgreSQL and Redis (`docker compose version`)
- **Git**: For submodule management

---

## 1. Clone the Repository

Clone the repository with submodules to ensure both the frontend and backend repositories are checked out:

```bash
git clone --recurse-submodules git@github.com:RixLux/Gajah-Berlian-Sport-Hall.git
cd Gajah-Berlian-Sport-Hall
```

:::tip[Already cloned without submodules?]
If you cloned without `--recurse-submodules`, initialize and pull the submodules by running:
```bash
git submodule update --init --recursive
```
:::

---

## 2. Start the Backend Stack

### A. Navigate & Install Dependencies

```bash
cd BE-Gajah-Berlian-Sport-Hall
npm install
```

### B. Configure Environment Variables

Create your `.env` configuration from the example file:

```bash
cp .env.example .env
```

The default values in `.env` are preconfigured for local Docker development:
```ini
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gajah_berlian_db?schema=public"
REDIS_HOST="localhost"
REDIS_PORT=6379
JWT_SECRET="super-secret-jwt-key-for-local-development-only"
JWT_REFRESH_SECRET="super-secret-refresh-key-for-local-development-only"
MIDTRANS_SERVER_KEY="SB-Mid-server-demo-key"
MIDTRANS_CLIENT_KEY="SB-Mid-client-demo-key"
MIDTRANS_IS_PRODUCTION=false
```

### C. Spin up Database & Redis Containers

Start PostgreSQL and Redis in the background:

```bash
docker compose up -d
```

Verify containers are running:
```bash
docker compose ps
```

### D. Run Database Migrations & Seed Data

Run Prisma migrations to initialize the schema and populate the database with default venues, courts, an admin account, and a demo customer:

```bash
npx prisma migrate dev --name init
npm run seed
```

### E. Start the Backend Development Server

```bash
npm run start:dev
```

The backend API is now live at:
- **API Base URL**: `http://localhost:3000/api/v1`
- **Swagger Documentation**: `http://localhost:3000/api/docs`

---

## 3. Start the Frontend Application

Open a second terminal window:

```bash
cd FE-Gajah-Berlian-Sport-Hall
npm install
```

### A. Configure Environment Variables

Create `.env.local`:

```bash
cp .env.example .env.local
```

Ensure it points to your local backend:
```ini
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### B. Start the Vite Dev Server

```bash
npm run dev
```

The frontend application is now accessible at `http://localhost:5173`.

---

## 4. Default Seeded Accounts & Credentials

The seed script creates two pre-configured accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@gajahberlian.com` | `AdminPassword123!` | Full Admin Portal (`/admin`), Metrics, Maintenance |
| **Customer** | `customer@demo.com` | `Password123!` | Booking, Profile autofill, Booking History |

:::tip[1-Click Demo Login]
On the login screen (`/login`), click the **"Akun Demo Cepat"** buttons to automatically populate the credentials for either role with one click!
:::

---

## 5. Running the Root Documentation

To preview or edit this documentation portal locally:

```bash
# From project root
npm install
npm run dev
```

The documentation site will open at `http://localhost:4321`.
