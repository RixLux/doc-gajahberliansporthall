---
title: Introduction
description: Overview of the Gajah Berlian Sports Hall court booking platform and architecture.
---

Welcome to the **Gajah Berlian Sports Hall** developer documentation.

Gajah Berlian Sports Hall is a full-stack, enterprise-grade badminton court reservation and venue management platform built for modern sports hall operations in Padang City, West Sumatra. It features real-time slot availability checking, atomic concurrency-safe booking reservations, automated Midtrans payment processing, and a comprehensive management dashboard for venue operators.

---

## Repository Structure

The project is structured as a root workspace containing two primary submodules:

```
Gajah-Berlian-Sport-Hall/           # Root Workspace & Documentation (Astro)
├── astro.config.mjs               # Astro + Starlight configuration
├── package.json                   # Root doc package
├── src/content/docs/              # Markdown & MDX developer guides
│
├── FE-Gajah-Berlian-Sport-Hall/   # Frontend Submodule (React + Vite + Tailwind v4)
│   ├── src/
│   │   ├── components/            # UI components, layout pieces, modal dialogs
│   │   ├── context/               # AuthContext, state management
│   │   ├── layouts/               # SiteLayout, AuthLayout, AdminLayout
│   │   ├── pages/                 # BookingPage, CustomerPage, PaymentPage, Admin...
│   │   ├── services/              # apiClient, paymentService
│   │   └── i18n/                  # Bilingual localization (ID & EN)
│   ├── vercel.json                # Vercel SPA routing rewrite rules
│   └── package.json
│
└── BE-Gajah-Berlian-Sport-Hall/   # Backend Submodule (NestJS + Prisma + Redis)
    ├── src/
    │   ├── core/domain/           # Pure business entities, value objects, ports
    │   ├── core/application/      # Use cases, queries, commands, DTOs
    │   ├── infrastructure/        # Prisma adapters, Redis lock/hold, Midtrans client
    │   └── presentation/          # HTTP controllers, JWT guards, webhooks
    ├── prisma/                    # Schema, migrations, and seed script
    ├── docker-compose.yml         # Local PostgreSQL & Redis infrastructure
    ├── Dockerfile                 # Multi-stage production container build
    └── package.json
```

---

## Technology Stack

### Frontend
- **Framework**: React 19 with Vite 8
- **Styling**: Tailwind CSS v4 with custom brand palettes (Dark Forest Emerald `#102a22`, Champagne `#c8ae78`, Sage `#94a896`)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM (v7 SPA with client-side rewrite handling)
- **Internationalization**: Lightweight custom `I18nContext` supporting Indonesian (`ID`) and English (`EN`)

### Backend
- **Framework**: NestJS 11 (TypeScript, strict mode)
- **Architecture**: Clean / Hexagonal Architecture (Domain, Application, Infrastructure, Presentation)
- **ORM & Database**: Prisma ORM with PostgreSQL (PostGIS extension enabled)
- **In-Memory Cache & Concurrency**: Redis with Redlock distributed locking & 15-minute slot hold manager
- **Payment Gateway**: Midtrans Snap API (QRIS, Virtual Accounts, E-Wallets, Credit Cards)
- **Scheduling**: `@nestjs/schedule` for automatic background expiration of unpaid bookings
- **Testing**: Jest with 83 automated tests (unit, integration, and E2E)

---

## Core Capabilities

1. **Atomic Booking Engine**: Eliminates double-booking race conditions through Redis distributed locks and a 15-minute reservation hold window.
2. **Instant Payment Settlement**: Automated reconciliation via Midtrans Webhooks with cryptographic signature verification.
3. **Role-Based Workflows**: Distinct, tailored user journeys for unauthenticated Guests, registered Customers, and Venue Administrators.
4. **Administrative Maintenance Management**: Administrators can block court slots for routine maintenance, immediately reflecting across public availability schedules.
