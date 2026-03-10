# OpsPulse — Backend Setup Guide

Production-ready Next.js + TypeScript + MongoDB backend for the OpsPulse business intelligence dashboard.

---

## Quick Start (5 steps)

### 1. Copy files into your Next.js project

```
your-nextjs-project/
├── lib/
│   └── mongodb.ts
├── types/
│   └── index.ts
├── middleware/
│   └── auth.ts
├── utils/
│   ├── jwt.ts
│   ├── password.ts
│   ├── otp.ts
│   └── pdfGenerator.ts
├── pages/
│   └── api/
│       ├── auth/
│       │   ├── signup.ts
│       │   ├── login.ts
│       │   ├── send-otp.ts
│       │   └── verify-otp.ts
│       ├── users/
│       │   └── me.ts
│       ├── inventory/
│       │   ├── index.ts        ← GET list, POST create
│       │   └── [id].ts         ← GET one, PUT update, DELETE
│       ├── reports/
│       │   ├── index.ts        ← GET list, POST generate
│       │   └── [id].ts         ← GET one, DELETE
│       └── analytics/
│           └── overview.ts
├── scripts/
│   ├── seed.ts
│   └── sample-data.json
├── .env.local                  ← create from .env.example
├── next.config.js
└── tsconfig.seed.json
```

### 2. Install dependencies

```bash
npm install mongodb bcryptjs jsonwebtoken pdfkit
npm install -D @types/bcryptjs @types/jsonwebtoken @types/pdfkit ts-node dotenv
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
# Then edit .env.local and add your MongoDB Atlas connection string and JWT secret
```

**MongoDB Atlas setup:**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Free tier cluster
2. Database Access → Add user with `readWriteAnyDatabase` role
3. Network Access → Add `0.0.0.0/0` (or your IP)
4. Connect → Drivers → Node.js → copy the URI

### 4. Seed the database

```bash
npm run seed
```

This inserts:
- 5 businesses
- 15 users (5 admins + 10 employees)
- 55 inventory items across all businesses
- 50 reports (10 per business)
- 1 demo OTP

**Test credentials after seed:**
```
Email:    arjun@techzone.in
Password: Password@123
```

### 5. Run the dev server

```bash
npm run dev
# API available at http://localhost:3000/api/
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create account + business | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| POST | `/api/auth/send-otp` | Send OTP to mobile | No |
| POST | `/api/auth/verify-otp` | Verify OTP code | No |
| GET | `/api/users/me` | Get current user profile | Yes |

### Inventory

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/inventory` | List all products | Yes |
| POST | `/api/inventory` | Create product | Yes |
| GET | `/api/inventory/[id]` | Get single product | Yes |
| PUT | `/api/inventory/[id]` | Update product | Yes |
| DELETE | `/api/inventory/[id]` | Delete product | Yes |

**GET /api/inventory query params:**
- `category` — filter by category
- `search` — search by name or SKU
- `lowStock=true` — only low-stock items
- `page` — pagination (default: 1)
- `limit` — per page (default: 50, max: 100)

### Reports

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reports` | List reports | Yes |
| POST | `/api/reports` | Generate new report + PDF | Yes |
| GET | `/api/reports/[id]` | Get single report | Yes |
| DELETE | `/api/reports/[id]` | Delete report | Yes |

### Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/overview` | Monthly sales + cash flow + KPIs | Yes |

---

## Authentication Flow

All protected routes require a Bearer token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Full sign-up flow:**
```
POST /api/auth/signup → { token, user }
POST /api/auth/send-otp { userId } → sends OTP
POST /api/auth/verify-otp { userId, otpCode } → { token, verified: true }
```

**Login flow:**
```
POST /api/auth/login { email, password } → { token, user }
```

---

## Connecting to Your Frontend (OpsPulse.jsx)

Replace the hardcoded data in `OpsPulse.jsx` with these API calls:

```typescript
// lib/api.ts
const BASE = "/api";

export const api = {
  login: (email: string, password: string) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json()),

  getInventory: (token: string) =>
    fetch(`${BASE}/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()),

  createProduct: (token: string, data: object) =>
    fetch(`${BASE}/inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  generateReport: (token: string) =>
    fetch(`${BASE}/reports`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()),

  getAnalytics: (token: string) =>
    fetch(`${BASE}/analytics/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()),
};
```

---

## Database Schema (MongoDB)

### Indexes Created Automatically by Seed Script

| Collection | Index | Type |
|-----------|-------|------|
| users | email | unique |
| users | businessId | standard |
| inventory | {businessId, sku} | unique compound |
| inventory | {businessId, category} | standard |
| reports | {businessId, reportDate: -1} | standard |
| otps | expiresAt | TTL (auto-purge) |

---

## Generated PDF Reports

Reports are saved to `public/reports/` and served at `/reports/filename.pdf`.

The PDF includes:
- Business health score with visual gauge bar
- KPI summary tiles (revenue, orders, stock, low-stock count)
- Weekly cash flow table
- Full inventory snapshot
- Active alerts
- AI-generated analysis paragraph

---

## Production Checklist

- [ ] Set a strong `JWT_SECRET` (64+ random chars)
- [ ] Restrict MongoDB Network Access to your server IP
- [ ] Move `public/reports/` to S3 or cloud storage
- [ ] Add rate limiting (e.g. `next-rate-limit`)
- [ ] Connect a real SMS provider for OTP (Twilio, MSG91)
- [ ] Enable MongoDB Atlas backups
- [ ] Set `NODE_ENV=production` in deployment env vars
