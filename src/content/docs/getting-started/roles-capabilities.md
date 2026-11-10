---
title: Role Capabilities Matrix
description: Comprehensive permissions and capability matrix for Guest, Customer, and Admin roles.
---

The Gajah Berlian Sports Hall platform enforces strict Role-Based Access Control (RBAC) at both the backend presentation layer (NestJS Guards) and the frontend routing layer (`AdminRoute`).

---

## 1. Capability Matrix

| Feature / User Action | 👤 Guest User (Public Visitor) | 🏸 Logged-in Customer | 🛡️ Administrator |
| :--- | :---: | :---: | :---: |
| **Browse Venue Info & Pricing** | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Inspect Court Live Availability** | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Create Court Reservation** | ✅ Allowed (Manual form) | ✅ Allowed (1-Click Autofill) | ✅ Allowed |
| **15-Minute Slot Hold Window** | ✅ Automatic hold | ✅ Automatic hold | ✅ Automatic hold |
| **Midtrans Payment Simulation / Checkout** | ✅ Allowed | ✅ Allowed | N/A |
| **View Booking Receipt by Code** | ✅ Allowed (via Search) | ✅ Allowed | ✅ Allowed (Any code) |
| **Multi-Device History Synchronization** | ❌ (Local storage only) | ✅ Live from `GET /me/bookings` | ✅ Master reservations |
| **Self-Service Unpaid Cancellation** | ❌ Contact staff | ✅ Allowed (`POST /cancel`) | ✅ Allowed |
| **Access Admin Dashboard (`/admin`)** | ❌ Redirect to `/login` | ❌ 403 Forbidden Screen | ✅ Full Access |
| **View Revenue & Operational KPIs** | ❌ | ❌ | ✅ Live (`/metrics`) |
| **Block / Unblock Court Maintenance** | ❌ | ❌ | ✅ Full CRUD |
| **Search & Inspect All Reservations** | ❌ | ❌ | ✅ Master Search |

---

## 2. Detailed Role Specifications

### 👤 Guest User (Public Visitor)
* **Definition**: Any unauthenticated visitor accessing the web app.
* **Goal**: Discover the sports hall, check rates, view available court hours, and book a court without forcing registration.
* **Capabilities**:
  1. Access public information pages: Homepage, About, Facilities, Pricing Calculator, and Location Map.
  2. Select court, date, and duration on `/booking` to view real-time available time slots.
  3. Complete checkout on `/booking/data-pemesan` by providing basic contact information (Name, WhatsApp phone, optional email).
  4. Initiate payment and receive a unique booking code (`GB-YYYYMM-XXXX`).
  5. Enter booking code on `/booking/riwayat` to view and print official e-receipt.
* **Limitations**:
  - Cannot access administrative routes (`/admin`).
  - Booking records are not persisted to a server profile (only local browser storage).
  - Cannot cancel bookings online once submitted.

---

### 🏸 Logged-in User (Customer)
* **Definition**: A user registered with a valid customer account (`role === 'CUSTOMER'`).
* **Goal**: Fast repeat bookings, automatic profile prefill, and multi-device booking tracking.
* **Capabilities**:
  1. All capabilities of a Guest User.
  2. **1-Click Checkout Autofill**: Form inputs for name, email, and phone are automatically filled from their database profile with a verified identity badge.
  3. **Live Booking History**: Access `/booking/riwayat` connected to backend `GET /me/bookings`:
     - Filter bookings by tabs: *Semua*, *Menunggu Bayar*, *Terkonfirmasi*, *Dibatalkan*.
     - One-click **"Bayar Sekarang"** to resume pending payments within the 15-minute window.
     - Self-service **"Batalkan"** button for unpaid bookings, triggering immediate release of the Redis slot hold.
  4. **Profile Dropdown**: Navbar avatar displaying first name, email, role badge, and one-click logout.
* **Limitations**:
  - Forbidden from accessing `/admin`. Attempting to access renders a custom branded **403 Access Denied** page.

---

### 🛡️ Administrator (Venue Manager)
* **Definition**: An administrative operator with `role === 'ADMIN'`.
* **Goal**: Supervise hall occupancy, monitor financial revenue, manage court maintenance downtime, and inspect customer bookings.
* **Capabilities**:
  1. **Guarded Admin Portal**: Access to `/admin/*`, protected by `AdminRoute` and backend `@Roles(Role.ADMIN)` guard.
  2. **Live KPI Dashboard (`/admin`)**:
     - Total Revenue (Rp formatted).
     - Confirmed Bookings count.
     - Pending Bookings count (active holds).
     - Active Courts count.
  3. **Court Maintenance Management**:
     - Block specific court hours for cleaning, re-stringing nets, or floor maintenance via `POST /admin/schedules/maintenance`.
     - Blocked slots immediately appear unavailable to public customers.
     - Remove/unblock maintenance blocks via `DELETE /admin/schedules/maintenance/:id`.
  4. **Master History Table (`/admin/history`)**:
     - Real-time search across all reservations by booking code or customer name.
     - Status filter chips: *Semua*, *Terkonfirmasi*, *Menunggu*, *Batal / Kadaluarsa*.
