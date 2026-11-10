---
title: Frontend Deployment (Vercel)
description: Step-by-step instructions for deploying the React frontend to Vercel, Netlify, or Cloudflare Pages.
---

The frontend repository `FE-Gajah-Berlian-Sport-Hall` is a React SPA built with Vite. It compiles down to pure static HTML, CSS, and JS assets, making it exceptionally fast, secure, and cost-effective to host on global edge CDNs like Vercel.

---

## 1. Deploying to Vercel

### Step 1: Import Repository
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** &rarr; **Project**.
3. Select your Git repository `ramjitampan/gajahberliansporthall` (or your fork).

### Step 2: Configure Project Settings
In the Vercel project configuration screen:

* **Framework Preset**: `Vite`
* **Root Directory**: `FE-Gajah-Berlian-Sport-Hall` (Click *Edit* and select this submodule folder)
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Install Command**: `npm install`

### Step 3: Add Environment Variables
Under **Environment Variables**, add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://api.gajahberlian.com/api/v1` | The public URL of your deployed NestJS backend API |

### Step 4: Deploy
Click **Deploy**. Vercel will build the project and assign a production domain (e.g. `gajahberlian.vercel.app`).

---

## 2. SPA Routing Configuration (`vercel.json`)

Because this is a Single Page Application (SPA) using React Router, any deep link (like `/booking/pembayaran` or `/admin`) must be rewritten to `index.html` so the client-side router handles navigation instead of returning a 404.

This is already pre-configured in `FE-Gajah-Berlian-Sport-Hall/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/((?!assets/|.*\\..*).*)",
      "destination": "/index.html"
    }
  ]
}
```

This rewrite rule ensures that static image assets (`assets/*`) load directly from disk, while all page routes fall through gracefully to `index.html`.

---

## 3. Custom Domain Setup

To point your custom domain (e.g. `gajahberlian.com` or `app.gajahberlian.com`):
1. In Vercel Project Settings, navigate to **Domains**.
2. Enter your custom domain name.
3. Add the displayed `CNAME` or `A` records to your DNS provider (e.g., Cloudflare, Namecheap, Niagahoster, DomaiNesia).
4. Vercel will automatically provision a free SSL certificate via Let's Encrypt.
