---
title: Frontend Developer Guide
description: Architecture, state management, and component conventions for the React frontend.
---

This guide details the structure and workflows for **FE-Gajah-Berlian-Sport-Hall**.

---

## 1. Project Organization

```
src/
├── assets/         # Optimized imagery (court previews, hero banner, waiting area)
├── components/     # UI primitives, Navbar, Footer, VenueMap, AdminRoute
│   └── home/       # Homepage sectional components (Hero, Facilities, Steps...)
├── context/        # AuthContext (user session, JWT storage, role state)
├── data/           # Static metadata & price constants
├── hooks/          # useBooking, useTheme
├── i18n/           # I18nContext and dictionary mappings (ID & EN)
├── layouts/        # SiteLayout, AuthLayout, AdminLayout
├── pages/          # BookingPage, CustomerPage, PaymentPage, AdminDashboard...
├── services/       # apiClient (REST wrapper), paymentService
└── utils/          # Currency formatting, date calculations, validation
```

---

## 2. Authentication & State Management

### `AuthContext` (`src/context/AuthContext.jsx`)
Centralizes user identity and token lifecycle across the application:

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, login, register, logout } = useAuth();
  // ...
}
```

* **Persistence**: Access token is stored in browser `localStorage`.
* **Automatic Verification**: On app mount, `apiClient.getMe()` is called to fetch the latest user profile and role from `/api/v1/auth/me`. If invalid or expired, tokens are purged cleanly.
* **Roles**:
  - `isAdmin`: `user?.role === 'ADMIN'`
  - `isCustomer`: `user?.role === 'CUSTOMER'`

### Route Protection with `AdminRoute` (`src/components/AdminRoute.jsx`)
Guards all `/admin/*` routes:
```jsx
// src/App.jsx
<Route path="admin" element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route index element={<AdminDashboardPage />} />
    <Route path="history" element={<AdminHistoryPage />} />
  </Route>
</Route>
```
1. **Unauthenticated visitor**: Automatically redirected to `/login?redirect=/admin`.
2. **Authenticated Customer**: Blocked by a branded **403 Access Denied** screen explaining that administrative access is restricted to hall managers.
3. **Administrator**: Renders the admin layout and dashboard.

---

## 3. Booking Step Wizard

The booking workflow is divided into four distinct pages:

1. **Step 1 — Slot Selection (`/booking`)**:
   - User picks date, court, and duration (1–4 hours).
   - Time slot grid visually reflects available, occupied, or maintenance-blocked hours.
2. **Step 2 — Customer Details (`/booking/data-pemesan`)**:
   - For logged-in users: inputs are **automatically autofilled** from their profile.
   - For guests: manual inputs for name and WhatsApp phone, with an optional banner inviting login/register.
3. **Step 3 — Payment (`/booking/pembayaran`)**:
   - Communicates with `/bookings/:code/payment` to obtain Midtrans Snap session token.
   - Live 15-minute countdown clock.
4. **Step 4 — Confirmation (`/booking/konfirmasi`)**:
   - Official verifiable booking receipt with booking code (`GB-YYYYMM-XXXX`).
   - Printable receipt styling (`@media print` rules).

---

## 4. Internationalization (i18n)

Translations are managed via `src/i18n/translations.js` with `I18nContext.jsx`:

```jsx
import { useTranslation } from '../i18n/I18nContext';

export function Example() {
  const { t, lang, toggleLang } = useTranslation();
  return <button onClick={toggleLang}>{t('nav.home')}</button>;
}
```
Supported locales: **Indonesian (`id`)** and **English (`en`)**.
