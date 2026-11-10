---
title: Testing & Verification
description: Automated test suites, coverage reports, and frontend build validation.
---

Gajah Berlian Sports Hall maintains a comprehensive automated testing suite to verify domain logic, concurrent locking safety, payment webhooks, and UI integrity.

---

## 1. Backend Automated Tests

The backend test suite is powered by **Jest** and contains **83 automated tests across 18 test suites**.

### Running Unit Tests
```bash
cd BE-Gajah-Berlian-Sport-Hall
npm test
```

### Test Suite Breakdown

| Test Suite | Purpose |
| :--- | :--- |
| `domain/booking/booking.spec.ts` | Validates time slot overlap calculation, price computation, and status state machine |
| `domain/court/court.spec.ts` | Validates court rates and operational opening/closing hour boundaries |
| `domain/user/user.spec.ts` | Validates email value object and role assignment |
| `domain/payment/payment.spec.ts` | Validates Midtrans payment status transitions (Pending -> Settlement -> Expire) |
| `application/booking/booking.use-cases.spec.ts` | Tests atomic reservation creation and slot hold allocation |
| `application/booking/booking-queries.spec.ts` | Tests receipt lookup by code and customer booking queries |
| `application/availability/availability.spec.ts` | Tests hourly availability matrix calculation against bookings and maintenance |
| `application/payment/payment.use-cases.spec.ts` | Tests payment session generation and Midtrans Snap integration |
| `application/admin/admin.spec.ts` | Tests revenue calculation, KPI aggregation, and maintenance block creation |
| `infrastructure/concurrency.spec.ts` | Simulates concurrent parallel requests to verify race-condition immunity |
| `infrastructure/cache/cache-infrastructure.spec.ts` | Tests Redis distributed lock acquisition and slot hold TTL expiry |
| `infrastructure/scheduler/booking-expiration.scheduler.spec.ts` | Tests automatic cleanup of expired reservations every 60 seconds |
| `presentation/http/guards/guards.spec.ts` | Tests JWT authentication and role-based route guard enforcement |
| `presentation/http/controllers/health.controller.spec.ts` | Tests health check endpoint for container orchestrators |

---

## 2. Running Test Coverage

To generate an HTML and terminal test coverage report:

```bash
cd BE-Gajah-Berlian-Sport-Hall
npm run test:cov
```

The detailed HTML report is output to `coverage/lcov-report/index.html`.

---

## 3. End-to-End (E2E) Testing

To run full end-to-end HTTP integration tests against a live database instance:

```bash
cd BE-Gajah-Berlian-Sport-Hall
npm run test:e2e
```

---

## 4. Frontend Production Build Verification

Verify that the React frontend compiles cleanly with Vite, Tailwind CSS v4, and TypeScript checks:

```bash
cd FE-Gajah-Berlian-Sport-Hall
npm run build
```

Expected result:
```
vite building client environment for production...
✓ 2381 modules transformed.
dist/index.html
dist/assets/index.css
dist/assets/index.js
✓ built in ~1.0s
```
