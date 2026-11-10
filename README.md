# Gajah Berlian Sports Hall

> Production-ready full-stack badminton court reservation and venue management platform.

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)
[![NestJS](https://img.shields.io/badge/backend-NestJS%2011-ea2845.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/frontend-React%2019%20+%20Vite-61dafb.svg)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/orm-Prisma%20Postgres-2d3748.svg)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/cache-Redis%20Locking-dc382d.svg)](https://redis.io/)

---

## 📖 Developer Documentation Portal

The repository root is equipped with a complete, production-grade documentation portal built with **Astro + Starlight**.

### Launching the Docs Locally
```bash
npm install
npm run dev
```
Open **`http://localhost:4321`** in your browser.

### Building Static Documentation
```bash
npm run build
```
The static site is generated into `./dist/`.

---

## 🗂️ Monorepo Submodules

| Submodule | Technology | Description |
| :--- | :--- | :--- |
| **[`FE-Gajah-Berlian-Sport-Hall`](./FE-Gajah-Berlian-Sport-Hall)** | React 19, Vite, Tailwind CSS v4, Framer Motion | Public visitor booking wizard, customer dashboard, and guarded admin portal |
| **[`BE-Gajah-Berlian-Sport-Hall`](./BE-Gajah-Berlian-Sport-Hall)** | NestJS 11, Clean Architecture, Prisma, Redis, Midtrans | Core business API, atomic slot reservation engine, distributed locks, payment webhooks |

---

## 🚀 Quickstart for Developers

1. **Clone with submodules**:
   ```bash
   git clone --recurse-submodules git@github.com:RixLux/Gajah-Berlian-Sport-Hall.git
   cd Gajah-Berlian-Sport-Hall
   ```
2. **Start Backend**:
   ```bash
   cd BE-Gajah-Berlian-Sport-Hall
   npm install && cp .env.example .env
   docker compose up -d
   npx prisma migrate dev && npm run seed
   npm run start:dev
   ```
   API live at `http://localhost:3000/api/v1` (Swagger: `http://localhost:3000/api/docs`).
3. **Start Frontend**:
   ```bash
   cd ../FE-Gajah-Berlian-Sport-Hall
   npm install && cp .env.example .env.local
   npm run dev
   ```
   App live at `http://localhost:5173`.

---

## 👥 Seeded Test Credentials

- **Administrator**: `admin@gajahberlian.com` / `AdminPassword123!`
- **Demo Customer**: `customer@demo.com` / `Password123!`

For more detailed guides on architecture, testing, and deployment (Vercel, Docker, VPS, and Midtrans), browse the Astro documentation portal!
