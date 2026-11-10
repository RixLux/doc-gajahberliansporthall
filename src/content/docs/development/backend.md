---
title: Backend Developer Guide
description: Architecture, coding conventions, and developer workflows for the NestJS backend.
---

This guide details how to work with the **BE-Gajah-Berlian-Sport-Hall** codebase.

---

## 1. Clean Architecture Organization

The backend adheres strictly to **Clean / Hexagonal Architecture**. Code is structured into four concentric layers:

```
src/
├── core/
│   ├── domain/           # Pure business models (Zero external dependencies)
│   └── application/      # Use cases, queries, commands, DTOs, and ports
├── infrastructure/       # Implementations of application ports
└── presentation/         # HTTP controllers, DTOs, guards, decorators, webhooks
```

### Layer Rules
1. **Domain Layer**:
   - Contains pure TypeScript classes: `Booking`, `Court`, `Venue`, `User`, `Payment`.
   - Rich Value Objects: `Email`, `BookingCode`, `BookingDuration`, `Price`.
   - Never import `@nestjs/*`, `@prisma/*`, or any database/HTTP library inside `core/domain/`.
2. **Application Layer**:
   - Contains use case orchestrators: `CreateBookingReservationUseCase`, `CancelBookingUseCase`.
   - Defines ports (interfaces) for external resources: `IBookingRepository`, `ICourtRepository`, `ILockManager`, `ISlotHoldManager`, `ITokenService`.
3. **Infrastructure Layer**:
   - Implements ports: `PrismaBookingRepository`, `RedisLockManager`, `MidtransPaymentGateway`.
   - Contains database mapping logic between Prisma models and pure Domain entities.
4. **Presentation Layer**:
   - Contains NestJS controllers: `BookingController`, `AuthController`, `AdminController`.
   - Maps HTTP requests to DTOs and passes them to Application Use Cases.

---

## 2. Developer Workflows

### Starting the Dev Server with Watch Mode
```bash
cd BE-Gajah-Berlian-Sport-Hall
npm run start:dev
```
The server restarts automatically whenever changes are saved.

### Database Migrations (Prisma)
When modifying `prisma/schema.prisma`:

1. **Create and apply a migration**:
   ```bash
   npx prisma migrate dev --name describe_your_change
   ```
2. **Regenerate the Prisma client**:
   ```bash
   npx prisma generate
   ```
3. **Open Prisma Studio (Visual DB GUI)**:
   ```bash
   npx prisma studio
   ```
   Accessible at `http://localhost:5555`.

### Re-seeding the Database
To reset and re-seed default data (Venue, Courts 1 & 2, Admin, Demo Customer):
```bash
npm run seed
```

---

## 3. How to Add a New Feature (Step-by-Step)

When implementing a new feature (e.g. "Customer Reviews"):

1. **Define Domain Entities & Repository Port**:
   - Create `src/core/domain/review/entities/Review.ts`.
   - Create `src/core/domain/review/ports/IReviewRepository.ts`.
2. **Define Application Use Case**:
   - Create `src/core/application/review/commands/CreateReviewUseCase.ts`.
3. **Implement Infrastructure Adapter**:
   - Add model to `prisma/schema.prisma`.
   - Create `src/infrastructure/database/prisma/PrismaReviewRepository.ts` implementing `IReviewRepository`.
4. **Expose Presentation Controller**:
   - Create `src/presentation/http/controllers/review.controller.ts` with validation DTOs.
   - Register controller and repository provider in NestJS module.
5. **Write Unit Tests**:
   - Test domain logic and use cases without booting NestJS or connecting to a real database.
