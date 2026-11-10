---
title: System Architecture & Design
description: High-level system architecture, communication topology, and Clean Architecture layers.
---

This document outlines the system architecture of the Gajah Berlian Sports Hall booking platform, including subsystem boundaries, the Clean/Hexagonal Architecture in the backend, and data flow patterns.

---

## 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph Clients["Clients Layer"]
        PublicWeb["Public Customers (Guest / User)"]
        AdminWeb["Venue Staff & Admin"]
    end

    subgraph Frontend["Frontend SPA (React 19 + Vite)"]
        Router["React Router v7"]
        AuthCtx["AuthContext (JWT Session)"]
        SitePages["Public & Customer Pages"]
        AdminPages["Guarded Admin Portal"]
        APIClient["API Client (Fetch + Token Interceptor)"]
    end

    subgraph Backend["Backend API (NestJS Clean Architecture)"]
        Controllers["HTTP Controllers & Webhook Handlers"]
        Guards["JwtAuthGuard & RolesGuard"]
        UseCases["Application Use Cases (Commands & Queries)"]
        Domain["Domain Entities & Business Rules"]
        Adapters["Infrastructure Adapters (Prisma, Redis, Midtrans)"]
    end

    subgraph External["External Services & Datastores"]
        Postgres[("PostgreSQL + PostGIS")]
        Redis[("Redis (Locks & 15-Min Slot Holds)")]
        Midtrans["Midtrans Snap API & Webhooks"]
    end

    PublicWeb --> Router
    AdminWeb --> Router
    Router --> AuthCtx
    Router --> SitePages
    Router --> AdminPages
    SitePages --> APIClient
    AdminPages --> APIClient

    APIClient -->|HTTP / JSON + Bearer Token| Controllers
    Controllers --> Guards
    Guards --> UseCases
    UseCases --> Domain
    UseCases --> Adapters

    Adapters -->|Prisma ORM| Postgres
    Adapters -->|ioredis| Redis
    Adapters -->|HTTPS Client| Midtrans
    Midtrans -.->|Webhook Notifications| Controllers
```

---

## 2. Hexagonal / Clean Architecture (Backend)

The backend follows Uncle Bob's **Clean Architecture (Ports & Adapters)** to decouple business logic from external frameworks, database drivers, and third-party vendors.

```
BE-Gajah-Berlian-Sport-Hall/src/
├── core/
│   ├── domain/                  # Enterprise Business Rules (Layer 1)
│   │   ├── booking/             # Booking entity, BookingCode, BookingDuration, Price
│   │   ├── court/               # Court, Venue, OperationalHours
│   │   ├── user/                # User entity, Email, Role
│   │   ├── payment/             # Payment entity, PaymentMethod, PaymentStatus
│   │   └── common/              # DomainException
│   │
│   └── application/             # Application Business Rules (Layer 2)
│       ├── booking/             # CreateBookingReservationUseCase, CancelBookingUseCase...
│       ├── availability/        # CheckAvailabilityQuery, GetCourtsQuery
│       ├── admin/               # GetAdminDashboardStatsQuery, CreateMaintenanceBlockUseCase
│       ├── auth/                # LoginUseCase, RegisterUseCase, GetCurrentUserQuery
│       └── ports/               # ITokenService, IPasswordHasher, ILockManager...
│
├── infrastructure/              # Interface Adapters & Frameworks (Layer 3)
│   ├── database/prisma/         # Prisma repositories implementing domain ports
│   ├── cache/redis/             # RedisLockManager, RedisSlotHoldManager
│   ├── payment/midtrans/        # MidtransPaymentGateway
│   ├── auth/                    # BcryptPasswordHasher, JwtTokenService
│   └── scheduler/               # BookingExpirationScheduler (@nestjs/schedule)
│
└── presentation/                # Driving Adapters (Layer 4)
    ├── http/
    │   ├── controllers/         # AuthController, BookingController, AdminController...
    │   ├── guards/              # JwtAuthGuard, RolesGuard, OptionalJwtAuthGuard
    │   └── dtos/                # Class-validator request & response DTOs
    └── webhooks/
        └── midtrans-webhook.controller.ts # Cryptographic signature validation & processing
```

### Dependency Rule
Dependencies only point **inward**:
- The **Domain** has ZERO external dependencies (no NestJS, no Prisma, no Redis).
- The **Application** layer depends only on Domain entities and abstract ports (interfaces).
- **Infrastructure** implements application ports using concrete technologies (Prisma, Redis, Midtrans).
- **Presentation** drives the application through HTTP requests and DTOs.

---

## 3. End-to-End Booking Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer / Guest
    participant FE as Frontend (React)
    participant API as Backend (NestJS)
    participant Redis as Redis Cache
    participant DB as PostgreSQL
    participant Midtrans as Midtrans Gateway

    Customer->>FE: Select Court, Date, and Time Slot
    FE->>API: GET /api/v1/availability?courtId=...&date=...
    API->>DB: Query confirmed bookings & maintenance
    API->>Redis: Query currently held slots
    API-->>FE: Return available hours matrix

    Customer->>FE: Fill contact info & Submit Booking
    FE->>API: POST /api/v1/bookings
    API->>Redis: Acquire distributed lock (Redlock)
    API->>Redis: Check & set 15-minute slot hold
    API->>DB: Insert Booking (Status: PENDING_PAYMENT, expiresAt = now + 15m)
    API->>Redis: Release distributed lock
    API-->>FE: Return BookingCode & Payment details

    Customer->>FE: Proceed to Payment
    FE->>API: POST /api/v1/bookings/:code/payment
    API->>Midtrans: Request Snap Token
    Midtrans-->>API: Return Snap Token & Redirect URL
    API-->>FE: Display Snap / QRIS modal
    Customer->>Midtrans: Complete payment (QRIS / VA)
    Midtrans->>API: POST /api/v1/webhooks/midtrans (Notification)
    API->>API: Verify SHA-512 Signature
    API->>DB: Update Booking (CONFIRMED) & Payment (SETTLEMENT)
    API->>Redis: Release slot hold
    API-->>Midtrans: 200 OK
```
