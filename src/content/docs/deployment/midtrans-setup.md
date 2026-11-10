---
title: Midtrans Payment Gateway Setup
description: Step-by-step configuration for Midtrans Snap API, sandbox testing, production keys, and webhook notification verification.
---

Gajah Berlian Sports Hall integrates with **Midtrans Snap**, the leading payment gateway in Indonesia supporting QRIS, Bank Virtual Accounts (BCA, Mandiri, BNI, BRI), GoPay, and Credit Cards.

---

## 1. Midtrans Account Setup

1. Sign up for a free merchant account at [Midtrans.com](https://midtrans.com).
2. Access the **Merchant Administration Portal (MAP)** at [dashboard.midtrans.com](https://dashboard.midtrans.com).
3. Toggle between **Sandbox** (for development & testing) and **Production** (for real transactions).

---

## 2. API Keys Configuration

In the Midtrans MAP dashboard, navigate to **Settings** &rarr; **Access Keys**:

1. Copy your **Server Key** and **Client Key**.
2. Add them to your backend `.env`:

```ini
# For Local / Staging (Sandbox)
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxx"
MIDTRANS_IS_PRODUCTION=false

# For Production
MIDTRANS_SERVER_KEY="Mid-server-xxxxxxxxxxxx"
MIDTRANS_CLIENT_KEY="Mid-client-xxxxxxxxxxxx"
MIDTRANS_IS_PRODUCTION=true
```

:::caution[Keep Server Key Secret!]
The `MIDTRANS_SERVER_KEY` must **only** reside on the backend server. It must never be committed to Git or exposed to the client-side frontend.
:::

---

## 3. Webhook Notification URL Setup

When a customer completes payment (e.g. scans the QRIS code in their banking app), Midtrans delivers an asynchronous HTTP `POST` webhook notification to your backend API to settle the booking.

### Registering the Webhook Endpoint:
1. In the Midtrans MAP, navigate to **Settings** &rarr; **Configuration**.
2. In the **Payment Notification URL** field, enter:
   ```
   https://api.gajahberlian.com/api/v1/webhooks/midtrans
   ```
3. Set the **Finish Redirect URL** (where the customer is sent after paying):
   ```
   https://app.gajahberlian.com/booking/konfirmasi
   ```
4. Click **Update Settings**.

---

## 4. Cryptographic Signature Verification

To prevent unauthorized actors from spoofing payment success notifications, the backend automatically validates the cryptographic SHA-512 signature on every incoming webhook event.

### Signature Formula:
$$\text{Signature} = \text{SHA512}(\text{order\_id} + \text{status\_code} + \text{gross\_amount} + \text{ServerKey})$$

Implementation in `BE-Gajah-Berlian-Sport-Hall`:

```typescript
// MidtransWebhookController.ts
const signatureString = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;
const expectedSignature = crypto
  .createHash('sha512')
  .update(signatureString)
  .digest('hex');

if (payload.signature_key !== expectedSignature) {
  throw new UnauthorizedException('Invalid cryptographic signature.');
}
```

If the signature matches, the system transitions the booking to `CONFIRMED`, marks the payment as `SETTLEMENT`, and releases the 15-minute slot hold.

---

## 5. Simulating Payments in Sandbox

During development, you do not need real money to test payments:
1. Visit the [Midtrans Payment Simulator](https://simulator.sandbox.midtrans.com/).
2. Select your payment method (BCA Virtual Account, Mandiri, BRI, QRIS).
3. Paste the Virtual Account number or simulate scanning the QR string.
4. Click **Pay**. The sandbox will dispatch the webhook to your backend within 2 seconds.
