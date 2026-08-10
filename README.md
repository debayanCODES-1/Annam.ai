<!-- prettier-ignore -->
# Parali-to-Prosper

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

Parali-to-Prosper is a focused demo that helps smallholder farmers and local coordinators convert crop residue (parali) into value — reducing burning, increasing income, and improving decision-making.

Key goals:

- Make residue management actionable for farmers.
- Connect farmers with machinery and buyers.
- Provide coordinators with district-level precision metrics.
- Prototype offline-friendly flows and multilingual support.

---

**Quick links**

- Live app (local): http://localhost:3000
- Branch: `main`
- Run: `npm run dev`

---

## At-a-glance architecture

```mermaid
flowchart TB
  A[Next.js App Router]
  B[UI Components & Pages]
  C[Client storage (IndexedDB / localStorage)]
  D[Next.js Server / API Routes]
  E[Recommendation Service (lib/services)]
  F[Prisma ORM]
  G[SQLite demo database]
  H[Weather & Market adapters]
  I[Residue & Crop Scoring]

  A --> B
  A --> C
  A --> D
  D --> E
  D --> F
  F --> G
  D --> H
  E --> I
  I --> A
```

### Components (brief)

- `app/` — Next.js App Router pages (farmer/coordinator/machinery APIs).
- `components/` — Reusable UI pieces (cards, forms, dashboard widgets).
- `lib/` — Business logic: `services`, `calculations`, `adapters` (recommendation engine lives here).
- `prisma/` — Schema, seed data, demo SQLite file in `prisma/dev.db`.
- `public/` — Static assets (icons, images, previously PWA service worker removed).

---

## Why this shape?

- Fast developer iteration with Next.js App Router + server components.
- Clear separation: UI (pages/components) — Business (lib) — Data (Prisma).
- Recommendation engine is modular so scoring rules can be tuned or swapped for ML.
- Demo-friendly SQLite for local development; swap `DATABASE_URL` for Postgres in production.

---

## Quickstart (developers)

1. Install

```bash
npm install
```

2. Copy env

```bash
cp .env.example .env
# edit .env as needed (DATABASE_URL, NEXT_PUBLIC_*)
```

3. Database (demo)

```bash
npx prisma db push
npm run db:seed
```

4. Run

```bash
npm run dev
# or build
npm run build && npm start
```

Ports: app runs on `http://localhost:3000` by default.

---

## Environment variables

- `DATABASE_URL` — SQLite file path (dev) or Postgres connection string (prod).
- `NEXT_PUBLIC_APP_NAME` — App display name.
- `NEXT_PUBLIC_DEFAULT_LANGUAGE` — `en` default.
- `NEXT_PUBLIC_PILOT_REGION` — e.g. `Punjab`.

Store sensitive secrets (VERCEL_TOKEN, DB credentials) in your CI/hosting provider.

---

## Core flows & services

- Farmer onboarding — client form saved to IndexedDB/localStorage and server when online.
- Recommendation engine — `lib/calculations/cropRecommendation.ts` + `lib/services/recommendationService.ts` produce `RecommendationOutput` (includes offer/urgency/market signals).
- Machinery booking — API routes and server-side checks via Prisma.
- Coordinator dashboard — aggregated farm metrics (district grouping logic lives in server code).

---

## Testing & quality

- Typecheck: `npm run typecheck` (TS), `npm run lint` (eslint)
- Unit tests: `npm run test` (Vitest)
- E2E tests: `npm run test:e2e` (Playwright)

---

## Deployment notes

- Recommended: Vercel with `main` branch auto-deploy.
- For production, use a managed Postgres (set `DATABASE_URL` accordingly).
- This repo previously included PWA service worker assets; they were intentionally removed from `public/` to simplify the demo. Re-enable PWA by re-adding `next-pwa` and service worker config if needed.

CI: `.github/workflows/deploy-vercel.yml` included for Vercel deployments.

---

## Contributing

1. Branch from `main` and open a PR.
2. Run tests and ensure lint/typecheck pass.
3. Keep PRs small and focused (UI vs backend vs infra).

---

## Contact

Maintainer: Debayan (GitHub: @debayanCODES-1)

---

_This README replaces the previous file with a clearer developer and architecture-oriented guide. If you want a longer user-facing README (with screenshots and walkthrough GIFs), tell me which pages to document and I’ll add them._
