---
title: Backend Deployment (Docker & VPS)
description: Production deployment guide for NestJS, PostgreSQL, and Redis using Docker and Docker Compose.
---

This guide walks you through deploying the **BE-Gajah-Berlian-Sport-Hall** API to a Linux VPS (Ubuntu 22.04 / 24.04) or any Docker-compatible container cloud.

---

## 1. Production Dockerfile Overview

The backend repository includes a hardened, multi-stage `Dockerfile`:

```dockerfile
# Stage 1: Build & Prisma Client Generation
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

* **Security**: Multi-stage build strips dev dependencies, TypeScript source files, and build tools from the final image.
* **Lightweight**: Uses Alpine Linux (~180MB total image size).

---

## 2. Deploying with Docker Compose on a VPS

### Step 1: Prepare the Server
Connect to your Ubuntu VPS via SSH:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

### Step 2: Clone Backend Repository
```bash
git clone git@github.com:RixLux/BE-Gajah-Berlian-Sport-Hall.git /opt/gajah-berlian-backend
cd /opt/gajah-berlian-backend
```

### Step 3: Configure Production `.env`
Create `/opt/gajah-berlian-backend/.env`:

```ini
NODE_ENV=production
PORT=3000

# Database (Postgres container credentials)
DATABASE_URL="postgresql://gb_admin:SecurePasswordHere@postgres:5432/gajah_berlian_prod?schema=public"

# Redis
REDIS_HOST="redis"
REDIS_PORT=6379
REDIS_PASSWORD="StrongRedisPasswordHere"

# JWT Secrets (Generate with: openssl rand -base64 32)
JWT_SECRET="YOUR_RANDOM_64_CHAR_SECRET"
JWT_REFRESH_SECRET="YOUR_ANOTHER_RANDOM_64_CHAR_SECRET"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Midtrans Production Credentials
MIDTRANS_SERVER_KEY="Mid-server-YOUR-PRODUCTION-KEY"
MIDTRANS_CLIENT_KEY="Mid-client-YOUR-PRODUCTION-KEY"
MIDTRANS_IS_PRODUCTION=true

# Security
CORS_ORIGIN="https://app.gajahberlian.com"
```

### Step 4: Production `docker-compose.prod.yml`
Create a production compose configuration:

```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:16-3.4-alpine
    restart: always
    environment:
      POSTGRES_USER: gb_admin
      POSTGRES_PASSWORD: SecurePasswordHere
      POSTGRES_DB: gajah_berlian_prod
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - gb_internal

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --requirepass StrongRedisPasswordHere
    volumes:
      - redisdata:/data
    networks:
      - gb_internal

  api:
    build: .
    restart: always
    ports:
      - "127.0.0.1:3000:3000"
    env_file: .env
    depends_on:
      - postgres
      - redis
    networks:
      - gb_internal

volumes:
  pgdata:
  redisdata:

networks:
  gb_internal:
```

### Step 5: Start Containers & Apply Migrations
```bash
docker compose -f docker-compose.prod.yml up -d --build

# Run database migrations inside the running API container
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

# Seed production admin user
docker compose -f docker-compose.prod.yml exec api npm run seed
```

---

## 3. Nginx Reverse Proxy & SSL (HTTPS)

Install Nginx and Certbot:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/api.gajahberlian.com`:
```nginx
server {
    server_name api.gajahberlian.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and provision SSL:
```bash
sudo ln -s /etc/nginx/sites-available/api.gajahberlian.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d api.gajahberlian.com
```

---

## 4. Health Checks & Monitoring

The API provides an unauthenticated health check endpoint:
```bash
curl https://api.gajahberlian.com/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "uptime": 12845.2,
  "timestamp": "2026-11-10T10:00:00.000Z"
}
```
Use this endpoint with uptime monitoring tools (UptimeRobot, Better Uptime, Datadog).
