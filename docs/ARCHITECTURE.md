# ThreadForm — Architecture

> Engineering blueprint for the ThreadForm platform. Optimized for: a buttery-smooth design canvas, realistic 3D garment previews, reliable group/bulk ordering, and an ad-supported free tier that scales to hundreds of thousands of MAU.

---

## 1. System Overview

```
                         ┌─────────────────────────────────────────┐
                         │                Clients                   │
                         │   Web (Next.js)   ·   PWA / mobile web    │
                         └───────────────┬─────────────────────────┘
                                         │ HTTPS / WSS
                         ┌───────────────▼─────────────────────────┐
                         │            Edge / CDN (Cloudfront)        │
                         │  static assets · garment models · images │
                         └───────────────┬─────────────────────────┘
                                         │
                         ┌───────────────▼─────────────────────────┐
                         │              API Gateway / BFF            │
                         │     auth · rate-limit · routing · cache   │
                         └───┬───────┬───────┬───────┬───────┬──────┘
                             │       │       │       │       │
                     ┌───────▼─┐ ┌───▼────┐ ┌▼──────┐ ┌▼─────┐ ┌▼────────┐
                     │ Identity│ │ Design │ │ Catalog│ │ Order│ │ Render  │
                     │ Service │ │ Service│ │Service │ │Service│ │ Service │
                     └────┬────┘ └───┬────┘ └───┬───┘ └──┬───┘ └────┬────┘
                          │          │          │        │          │
                  ┌───────▼──────────▼──────────▼────────▼──────────▼───────┐
                  │   PostgreSQL  ·  Redis  ·  Object Storage (S3)  ·  Queue │
                  └──────────────────────────────────────────────────────────┘
                                         │
                         ┌───────────────▼─────────────────────────┐
                         │     External: Print Partners · Payments   │
                         │       · Ad Network · Email/SMS · Analytics│
                         └───────────────────────────────────────────┘
```

**Architecture style:** Modular monolith for MVP (single deployable, clear module boundaries), with the Render Service and async workers split out as independent services from day one because their scaling and runtime profiles differ. Modules are designed to graduate into independent services (V2+) without rewrites.

---

## 2. Frontend Architecture

### 2.1 Stack
| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | **Next.js (App Router) + React 18 + TypeScript** | SSR/ISR for SEO-critical marketing & template gallery (ad funnel), CSR for the editor |
| 2D design canvas | **Fabric.js** (or Konva) on `<canvas>` | Mature object model, layers, transforms, serialization |
| 3D preview | **Three.js via React Three Fiber (R3F)** + `drei` | Declarative 3D in React, garment GLTF models, real-time texture mapping |
| Styling | **Tailwind CSS + CSS variables (design tokens)** | Speed + token-driven theming (see DESIGN_SYSTEM.md) |
| State | **Zustand** (editor) + **TanStack Query** (server state) | Lightweight local store + cache/sync for API data |
| Forms | **React Hook Form + Zod** | Performant, schema-validated |
| Realtime | **WebSocket / Server-Sent Events** | Group order live updates, collaboration (V2) |
| Animation | **Framer Motion** | Motion principles (see DESIGN_SYSTEM.md) |
| Build/tooling | Turbopack/Vite, ESLint, Prettier, Vitest, Playwright | DX + testing |

### 2.2 Application Layers
1. **Marketing / Discovery (SSR/ISR):** Landing, template gallery, inspiration feed, blog — SEO + ad surfaces.
2. **Studio (CSR, the editor):** The core design experience. Heavy client app, code-split, lazy-loaded.
3. **Dashboard (CSR):** Saved designs, orders, bulk campaigns, brand kit.
4. **Checkout (CSR + secure iframe for payments).**

### 2.3 The Studio (Editor) — Internal Architecture
```
Studio
├── CanvasEngine (2D)         // Fabric layer: objects, selection, transforms
│   ├── LayerManager
│   ├── TextTool / ImageTool / LogoTool / ShapeTool
│   ├── HistoryStack (undo/redo, command pattern)
│   └── Serializer  → DesignDocument (JSON)
├── PreviewEngine (3D)        // R3F: maps 2D canvas → garment texture
│   ├── GarmentModelLoader (GLTF)
│   ├── PrintAreaProjector    // UV mapping print zones
│   ├── MaterialController     // fabric color, finish
│   └── CameraRig / Orbit
├── DesignStore (Zustand)     // single source of truth for the open design
├── AssetManager              // uploads, fonts, user logos, stock
└── ExportPipeline            // print-ready raster + preview thumbnails
```

**2D → 3D sync:** The 2D canvas renders to an offscreen texture (or exported data URL) that is applied to the garment model's print-area material. Updates are throttled (rAF + debounce) so dragging stays at 60fps while the 3D texture refreshes on idle frames.

### 2.4 The DesignDocument (canonical design format)
A version-stamped JSON describing a design independent of rendering tech:
```jsonc
{
  "schemaVersion": 2,
  "garment": { "productId": "hoodie-classic", "color": "#1A1A1A", "size": "L" },
  "printAreas": {
    "front": {
      "widthMm": 300, "heightMm": 400, "dpi": 300,
      "layers": [
        { "id": "l1", "type": "text", "value": "RIA'S CLUB",
          "font": "Anton", "size": 64, "fill": "#FFFFFF",
          "x": 0.5, "y": 0.3, "rotation": 0, "z": 1 },
        { "id": "l2", "type": "image", "assetId": "ast_123",
          "x": 0.5, "y": 0.6, "scale": 0.8, "z": 2 }
      ]
    },
    "back": { "layers": [] }
  },
  "meta": { "createdBy": "user_x", "updatedAt": "..." }
}
```
- Coordinates normalized (0–1) to print-area space → resolution-independent and print-safe.
- This document is what the API stores, what the Render Service consumes, and what generates both the 3D preview and the print-ready file.

### 2.5 Performance Strategy
- Route-level + component-level code splitting; Studio loaded only when needed.
- 3D models served compressed (Draco/meshopt) from CDN; LOD for low-power devices.
- Image uploads client-resized before upload; CDN-served responsive variants.
- Web Workers for heavy serialization/raster prep to keep the main thread free.
- Optimistic UI for design edits; background autosave.

---

## 3. Backend Architecture

### 3.1 Stack
| Concern | Choice |
|---------|--------|
| Runtime / Framework | **Node.js + NestJS (TypeScript)** — modular, DI, opinionated structure |
| API | **REST** (primary, see API_SPEC.md) + WebSocket gateway for realtime |
| Database | **PostgreSQL** (primary relational store) |
| Cache / sessions / rate-limit | **Redis** |
| Object storage | **S3-compatible** (assets, design exports, print files) |
| Async jobs | **BullMQ (Redis)** queue + workers |
| Search (V2) | **OpenSearch / Meilisearch** for templates & catalog |
| Auth | **JWT access + refresh**, OAuth (Google), magic link |
| Payments | **Stripe** (cards, wallets) + regional gateway (e.g., Razorpay for India) |
| Email/SMS | Transactional provider (e.g., SES + a transactional SMS) |

### 3.2 Service Modules
| Module | Responsibility |
|--------|----------------|
| **Identity** | Accounts, auth, sessions, orgs/teams, roles |
| **Design** | CRUD for designs, versions, autosave, sharing, templates |
| **Asset** | Uploads, image processing, logo/font management, stock library |
| **Catalog** | Garment products, colors, sizes, print areas, pricing tiers |
| **Pricing** | Quote engine (unit + bulk tiers + add-ons + shipping + tax) |
| **Order** | Carts, individual orders, bulk campaigns, member contributions |
| **Render** | Generates 3D preview thumbnails + print-ready files (own service) |
| **Fulfillment** | Print-partner routing, production status, tracking webhooks |
| **Payments** | Charges, refunds, split collection for group orders, payouts |
| **Ads** | Ad slot config, targeting context, impression/click logging |
| **Notification** | Email/SMS/in-app (order status, group invites, reminders) |
| **Analytics** | Event ingestion, funnel + business metrics |

### 3.3 Render Service (separate service)
- Headless rendering (headless browser / GPU node) consumes a `DesignDocument`.
- Produces: (a) marketing-quality 3D preview images/thumbnails, (b) **print-ready output** (vector where possible, else 300 DPI raster with bleed, CMYK profile, placement coordinates in mm).
- Triggered async via queue on save/checkout; results stored in S3 and referenced by URL.
- Scales horizontally and independently (CPU/GPU heavy, bursty).

### 3.4 Reliability & Cross-Cutting
- **Idempotency keys** on order/payment endpoints.
- **Outbox pattern** for reliable event publishing (order → fulfillment, payment → order).
- **Webhook handlers** (payments, print partners) are signature-verified and idempotent.
- **Rate limiting** per IP/user at the gateway (Redis token bucket).
- **Observability:** structured logs, OpenTelemetry traces, metrics dashboards, error tracking (Sentry).
- **Security:** least-privilege S3, signed URLs for assets, input validation (Zod/class-validator), CSRF protection on cookie flows, secrets in a vault.

---

## 4. State Management

### 4.1 Client State Taxonomy
| State type | Tool | Examples |
|-----------|------|----------|
| **Editor / ephemeral UI** | Zustand | selected layer, tool mode, zoom, undo stack |
| **Canonical design** | Zustand store + autosave to server | the open `DesignDocument` |
| **Server cache** | TanStack Query | catalog, saved designs list, orders, quotes |
| **Session/auth** | HttpOnly cookies + lightweight context | access token, user profile |
| **URL state** | Next.js router/searchParams | shared design id, gallery filters |

### 4.2 Autosave & History
- **Command pattern** for edits → enables undo/redo and granular dirty tracking.
- Debounced autosave (e.g., 2s idle or on blur) → PATCH design; optimistic local commit, reconciled with server version.
- **Versioning:** each significant save creates a `design_version` row (see DATABASE.md) for restore/branching.

### 4.3 Realtime / Collaboration (V2)
- WebSocket rooms per design / per bulk campaign.
- Group order: live member join, size selection, payment status broadcast.
- Multiplayer editing (V3) via CRDT (Yjs) over the WebSocket gateway.

### 4.4 Conflict Resolution
- Designs carry a `version` integer; server rejects stale writes (409) → client merges/reloads.
- For group campaigns, member contributions are append-only to avoid edit conflicts.

---

## 5. Rendering Pipeline

The pipeline spans **interactive (client)** and **production (server)** rendering from one source of truth.

```
                       ┌──────────────────────────┐
                       │     DesignDocument JSON    │  ← single source of truth
                       └─────────────┬──────────────┘
              ┌──────────────────────┼───────────────────────┐
              ▼                      ▼                        ▼
   ┌────────────────────┐ ┌────────────────────┐  ┌────────────────────────┐
   │  2D Canvas (Fabric)│ │ 3D Preview (R3F)   │  │  Render Service (server)│
   │  edit surface       │ │ live texture map   │  │  async, headless        │
   └─────────┬──────────┘ └─────────┬──────────┘  └────────────┬───────────┘
             │ offscreen texture     │ orbit/zoom/light          │
             ▼                       ▼                            ▼
   ┌────────────────────┐ ┌────────────────────┐  ┌────────────────────────┐
   │ throttled GPU upload│ │ realistic garment  │  │ (a) preview thumbnails  │
   │ → garment material  │ │ confidence to buy  │  │ (b) PRINT-READY file    │
   └────────────────────┘ └────────────────────┘  │     300 DPI · bleed ·   │
                                                   │     CMYK · placement mm │
                                                   └────────────────────────┘
```

### 5.1 Interactive Loop (client)
1. User edits → command dispatched → DesignStore updates.
2. Fabric re-renders the 2D canvas (60fps target).
3. Canvas texture pushed to the 3D garment material via `PrintAreaProjector` (UV-mapped print zones), throttled with `requestAnimationFrame`.
4. R3F renders the garment with PBR materials (fabric roughness, color), orbit controls, soft lighting/HDRI.

### 5.2 Print-Area Projection
- Each garment GLTF defines named UV regions (`front`, `back`, `left_sleeve`, etc.) matching `printAreas` in the DesignDocument.
- Mockup placement uses normalized coordinates → consistent between preview and print.
- Garment color changes recolor the base material; the print texture uses transparency so only artwork shows.

### 5.3 Production Render (server)
- On checkout (and on demand), the Render Service rasterizes/vectorizes each print area at production spec.
- Output bundle: print files per area + spec sheet (placement, dimensions, colors, garment SKU) → handed to Fulfillment for the print partner.
- Preview thumbnails generated for dashboard, share cards (OG images), and order confirmations.

---

## 6. File / Repository Structure

Monorepo (Turborepo + pnpm workspaces).

```
threadform/
├── apps/
│   ├── web/                      # Next.js app (marketing + studio + dashboard)
│   │   ├── app/                  # App Router routes
│   │   │   ├── (marketing)/      # landing, gallery, inspiration (SSR/ISR)
│   │   │   ├── studio/           # the editor (CSR)
│   │   │   ├── dashboard/        # designs, orders, bulk campaigns
│   │   │   └── checkout/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── editor/           # CanvasEngine, tools, layers, history
│   │   │   ├── preview3d/        # R3F scene, garment loaders, projector
│   │   │   ├── catalog/
│   │   │   ├── order/
│   │   │   └── bulk/
│   │   ├── stores/               # Zustand stores
│   │   ├── lib/                  # api client, hooks, utils
│   │   └── styles/               # tokens, tailwind config
│   ├── api/                      # NestJS modular monolith
│   │   └── src/modules/
│   │       ├── identity/
│   │       ├── design/
│   │       ├── asset/
│   │       ├── catalog/
│   │       ├── pricing/
│   │       ├── order/
│   │       ├── fulfillment/
│   │       ├── payments/
│   │       ├── ads/
│   │       ├── notification/
│   │       └── analytics/
│   ├── render/                   # Render Service (headless preview + print files)
│   └── workers/                  # BullMQ consumers (render, email, fulfillment)
├── packages/
│   ├── ui/                       # shared design-system components
│   ├── design-tokens/            # colors, type, spacing (single source)
│   ├── design-schema/            # DesignDocument types + Zod validators
│   ├── api-contracts/            # shared DTOs / OpenAPI types
│   ├── garment-assets/           # GLTF models, UV/print-area metadata
│   └── config/                   # eslint, tsconfig, tailwind presets
├── infra/                        # IaC (Terraform), Docker, CI/CD
├── docs/                         # this documentation set
└── package.json / turbo.json / pnpm-workspace.yaml
```

### 6.1 Key Shared Packages
- **`design-schema`** — the `DesignDocument` contract used by web, api, and render. Single definition prevents drift.
- **`design-tokens`** — generated CSS variables + JS tokens consumed by both `ui` and Tailwind (see DESIGN_SYSTEM.md).
- **`garment-assets`** — versioned 3D models + print-area metadata, served via CDN.

---

## 7. Deployment & Environments (summary)
- **Environments:** `local` → `preview` (per-PR) → `staging` → `production`.
- **Hosting:** Web on edge/serverless (e.g., Vercel) or containers; API + Render + Workers as containers (ECS/Kubernetes).
- **Data:** managed PostgreSQL (with read replica in V2), managed Redis, S3 + CloudFront.
- **CI/CD:** lint → typecheck → unit → e2e (Playwright) → build → deploy; DB migrations gated and reversible.
- **Scaling priorities:** Render Service and image/CDN first (they bottleneck at scale), then API read replicas, then queue worker fleets.

> See **DATABASE.md** for the schema, **API_SPEC.md** for endpoints, and **DESIGN_SYSTEM.md** for the token/component system referenced above.
