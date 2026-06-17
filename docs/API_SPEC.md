# ThreadForm — API Specification

> **Style:** REST over HTTPS, JSON. **Base URL:** `https://api.threadform.com/v1`
> **Auth:** Bearer JWT (access token) in `Authorization` header; refresh via cookie/endpoint. Guest flows use an `X-Anon-Token` header.
> **Money:** integer **minor units** (paise) + `currency` (default `INR`). **Time:** ISO-8601 UTC. **IDs:** UUID v7 strings.
> Aligns with entities in DATABASE.md and behaviors in USER_FLOWS.md.

---

## 1. Conventions

### 1.1 Headers
| Header | Purpose |
|--------|---------|
| `Authorization: Bearer <jwt>` | authenticated requests |
| `X-Anon-Token: <token>` | guest design/cart ownership (pre-login) |
| `Idempotency-Key: <uuid>` | **required** on POST that create orders/payments |
| `X-Request-Id: <uuid>` | client trace id (echoed back) |
| `Content-Type: application/json` | except multipart upload |

### 1.2 Pagination (cursor-based)
`GET /resource?limit=20&cursor=<opaque>` →
```json
{ "data": [ ... ], "page": { "next_cursor": "abc", "has_more": true, "limit": 20 } }
```

### 1.3 Success envelope
Single resource returns the object directly; collections use the paginated shape above. `201` for creation, `200` for reads/updates, `202` for accepted async work, `204` for deletes.

### 1.4 Standard error envelope
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Quantity must be greater than 0.",
    "request_id": "req_01HX...",
    "details": [
      { "field": "items[0].quantity", "issue": "min", "expected": ">= 1" }
    ]
  }
}
```

### 1.5 HTTP status & error codes
| HTTP | `code` | When |
|------|--------|------|
| 400 | `VALIDATION_ERROR` | malformed/invalid payload |
| 401 | `UNAUTHENTICATED` | missing/expired token |
| 403 | `FORBIDDEN` | authenticated but not allowed |
| 404 | `NOT_FOUND` | resource missing or not visible |
| 409 | `CONFLICT` / `VERSION_CONFLICT` | stale design version, duplicate |
| 410 | `GONE` | expired/revoked share token |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | bad upload type |
| 422 | `UNPROCESSABLE` | semantically invalid (e.g., below MOQ to lock) |
| 423 | `LOCKED` | campaign locked, edits not allowed |
| 429 | `RATE_LIMITED` | too many requests (`Retry-After` header) |
| 402 | `PAYMENT_REQUIRED` / `PAYMENT_FAILED` | charge declined |
| 409 | `OUT_OF_STOCK` | variant unavailable at checkout |
| 500 | `INTERNAL_ERROR` | unexpected |
| 503 | `SERVICE_UNAVAILABLE` | dependency down (render/partner) |

Validation errors always include `details[]`. Payment errors include `details.provider_decline_code` when available.

---

## 2. Auth & Identity

### POST /auth/signup
```json
// req
{ "email": "ria@college.edu", "password": "•••", "display_name": "Ria",
  "anon_token": "anon_abc" }   // optional: claim guest design/cart
// 201
{ "user": { "id": "usr_...", "email": "ria@college.edu", "plan": "free" },
  "tokens": { "access": "jwt...", "expires_in": 900 } }
```
Errors: `409 CONFLICT` (email exists), `400 VALIDATION_ERROR`.

### POST /auth/login · POST /auth/oauth/google · POST /auth/magic-link · POST /auth/refresh · POST /auth/logout
- `oauth/google`: `{ "id_token": "...", "anon_token": "..." }`.
- `magic-link`: request `{ "email" }` → 202; verify `{ "token" }` → tokens.
- `refresh`: reads refresh cookie → new access token.

### GET /me  ·  PATCH /me
```json
// GET 200
{ "id": "usr_...", "email": "...", "display_name": "Ria", "plan": "free",
  "avatar_url": null, "locale": "en-IN" }
```

### Organizations
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/orgs` | create org/team/club |
| GET | `/orgs/:id` | fetch org |
| POST | `/orgs/:id/members` | invite member `{ email, role }` |
| DELETE | `/orgs/:id/members/:userId` | remove member |
| GET/POST/PATCH | `/orgs/:id/brand-kits` | brand kit CRUD |

---

## 3. Catalog (public, cacheable)

### GET /catalog/products
```json
// 200
{ "data": [
  { "id": "prd_hoodie", "slug": "hoodie-classic", "name": "Classic Hoodie",
    "category": "hoodie", "model_url": "https://cdn/.../hoodie.glb",
    "base_price_from": 79900, "currency": "INR" }
] }
```

### GET /catalog/products/:slug
```json
// 200 — full product incl. variants, print areas, pricing tiers
{ "id": "prd_hoodie", "slug": "hoodie-classic", "name": "Classic Hoodie",
  "category": "hoodie", "model_url": "https://cdn/.../hoodie.glb",
  "model_meta": { "lods": [...], "print_area_uvs": {...} },
  "variants": [
    { "id": "var_blk_l", "sku": "HOD-BLK-L", "color_name": "Black",
      "color_hex": "#1A1A1A", "size": "L", "extra_cost": 0, "stock_status": "in_stock" }
  ],
  "print_areas": [
    { "key": "front", "label": "Front", "width_mm": 300, "height_mm": 400, "dpi": 300 },
    { "key": "back", "label": "Back", "width_mm": 300, "height_mm": 400, "dpi": 300 }
  ],
  "pricing_tiers": [
    { "min_qty": 1, "unit_price": 99900 },
    { "min_qty": 10, "unit_price": 84900 },
    { "min_qty": 25, "unit_price": 74900 },
    { "min_qty": 50, "unit_price": 67900 }
  ],
  "addons": [ { "slug": "back-print", "name": "Back Print", "price": 9900 } ] }
```

---

## 4. Assets (uploads)

### POST /assets/upload-url  (presigned, recommended)
```json
// req
{ "mime_type": "image/png", "bytes": 240133, "kind": "upload" }
// 200
{ "asset_id": "ast_...", "upload_url": "https://s3/...signed",
  "fields": { ... }, "expires_in": 300 }
```
Client PUTs the file to `upload_url`, then:

### POST /assets/:id/finalize
Triggers processing (dimensions, DPI, print-safety).
```json
// 200
{ "id": "ast_...", "url": "https://cdn/.../img.png", "width_px": 2400,
  "height_px": 3000, "dpi": 300, "is_print_safe": true }
```
Errors: `415 UNSUPPORTED_MEDIA_TYPE`, `413` (too large), `422` flag `is_print_safe:false` (still returns, client warns).

### GET /assets?kind=logo · DELETE /assets/:id

---

## 5. Designs

### POST /designs
```json
// req
{ "product_id": "prd_hoodie", "primary_variant_id": "var_blk_l",
  "title": "Spring Fest Hoodie", "document": { /* DesignDocument */ },
  "anon_token": "anon_abc" }   // guest ownership if not logged in
// 201
{ "id": "dsn_...", "version": 1, "status": "draft", "title": "Spring Fest Hoodie",
  "thumbnail_url": null, "updated_at": "..." }
```

### GET /designs/:id  ·  GET /designs?owner=me&limit=20&cursor=...
Returns design + current `document`. List is filtered to caller (or `anon_token`).

### PATCH /designs/:id   (autosave / edit — optimistic concurrency)
```json
// req — must send the version you based edits on
{ "version": 4, "document": { /* updated DesignDocument */ }, "title": "..." }
// 200
{ "id": "dsn_...", "version": 5, "updated_at": "...", "thumbnail_url": "https://cdn/..." }
```
- `409 VERSION_CONFLICT` if `version` is stale → response includes `current_version` and `current_document` so the client can reconcile.

### Versions
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/designs/:id/versions` | history list |
| GET | `/designs/:id/versions/:n` | fetch a snapshot |
| POST | `/designs/:id/restore` `{ "version": 3 }` | restore (creates new version) |

### POST /designs/:id/duplicate  ("Make it yours" / fork) · DELETE /designs/:id (soft)

### POST /designs/:id/render   (request preview/print render — async)
```json
// req
{ "type": "preview" }    // preview | print
// 202
{ "job_id": "rnd_...", "status": "queued" }
```
Poll `GET /render-jobs/:id` → `{ "status": "done", "outputs": [ { "area": "front", "url": "..." } ] }`.

---

## 6. Sharing

### POST /designs/:id/shares
```json
// req
{ "permission": "order", "expires_at": null }   // view | comment | order | edit
// 201
{ "share_token": "shr_aZ19", "url": "https://threadform.com/d/aZ19",
  "og_image_url": "https://cdn/.../og.png", "permission": "order" }
```

### GET /shared/:token   (public, no auth)
```json
// 200
{ "design": { "title": "...", "product": {...}, "document": {...},
  "thumbnail_url": "..." }, "permission": "order" }
```
Errors: `410 GONE` (expired/revoked), `404 NOT_FOUND`.

### DELETE /shares/:token   (revoke)

---

## 7. Pricing / Quote

### POST /quote   (live price for editor & cart)
```json
// req
{ "items": [
   { "product_id": "prd_hoodie", "variant_id": "var_blk_l", "quantity": 30,
     "addons": ["back-print"] } ],
  "shipping_country": "IN", "campaign": true }
// 200
{ "currency": "INR",
  "lines": [
    { "variant_id": "var_blk_l", "quantity": 30, "unit_price": 74900,
      "tier_applied": { "min_qty": 25 }, "addons_total": 297000,
      "line_total": 2544000 } ],
  "subtotal": 2544000, "bulk_savings": 750000,
  "shipping_fee": 0, "tax": 457920, "total": 3001920 }
```

---

## 8. Cart & Orders

### Cart
| Method | Path | Body / notes |
|--------|------|--------------|
| GET | `/cart` | current cart (by user or `X-Anon-Token`) |
| POST | `/cart/items` | `{ design_id, variant_id, quantity, addons, personalization }` |
| PATCH | `/cart/items/:id` | update qty/addons |
| DELETE | `/cart/items/:id` | remove |

### POST /orders   (individual checkout — idempotent)
```json
// headers: Idempotency-Key: <uuid>
// req
{ "cart_id": "crt_...", "type": "individual",
  "shipping_address": { "name":"Arjun", "line1":"...", "city":"Pune",
    "state":"MH", "postal_code":"411001", "country":"IN", "phone":"+91..." },
  "shipping_method": "standard" }
// 201
{ "id": "ord_...", "order_number": "TF-2026-00012", "status": "pending",
  "total": 99900, "currency": "INR",
  "payment": { "client_secret": "pi_...", "provider": "razorpay" } }
```
Errors: `409 OUT_OF_STOCK` (includes `unavailable_variants[]`), `409 VERSION_CONFLICT` (design changed since add), `422 UNPROCESSABLE`.

### GET /orders  ·  GET /orders/:id
```json
// 200
{ "id": "ord_...", "order_number": "TF-2026-00012", "type": "individual",
  "status": "in_production", "total": 99900, "currency": "INR",
  "items": [ { "design_id": "dsn_...", "design_version": 5, "variant_id": "var_blk_l",
    "quantity": 1, "unit_price": 99900, "print_file_url": "https://cdn/..." } ],
  "timeline": [
    { "status": "paid", "at": "..." }, { "status": "in_production", "at": "..." } ],
  "shipment": { "carrier": "Delhivery", "tracking_no": "...", "status": "pending" } }
```

### POST /orders/:id/reorder  ·  POST /orders/:id/cancel (pre-production only)

---

## 9. Bulk / Group Campaigns

### POST /campaigns
```json
// req
{ "design_id": "dsn_...", "title": "Spring Fest Hoodies",
  "collection_mode": "each_pays", "deadline_at": "2026-07-01T00:00:00Z",
  "min_qty": 25, "target_qty": 45, "allow_personalization": false }
// 201
{ "id": "cmp_...", "share_token": "join_Xy7", "status": "collecting",
  "join_url": "https://threadform.com/join/Xy7" }
```

### GET /campaigns/:id   (organizer dashboard — CampaignTracker data)
```json
// 200
{ "id": "cmp_...", "title": "Spring Fest Hoodies", "status": "collecting",
  "collection_mode": "each_pays", "deadline_at": "...",
  "min_qty": 25, "target_qty": 45,
  "stats": { "members": 31, "items": 33, "paid": 28, "pending": 3,
             "size_breakdown": { "S": 6, "M": 12, "L": 11, "XL": 4 } } }
```

### GET /join/:token   (public — member view of campaign + design)

### POST /campaigns/:id/members   (member joins — public, may be guest)
```json
// req
{ "name": "Meera", "email": "meera@college.edu",
  "items": [ { "variant_id": "var_blk_l", "quantity": 1,
               "personalization": { "name": "MEERA", "number": "10" } } ] }
// 201
{ "member_id": "mem_...", "payment_status": "pending",
  // each_pays returns a payment intent:
  "payment": { "amount": 84900, "client_secret": "pi_...", "provider": "razorpay" } }
```

### PATCH /campaigns/:id/members/:memberId  (edit before lock)  ·  DELETE (remove member)

### POST /campaigns/:id/lock   (organizer — create consolidated bulk order)
```json
// 200
{ "campaign_id": "cmp_...", "status": "locked",
  "order": { "id": "ord_...", "order_number": "TF-2026-00041",
    "type": "bulk", "total": 2802700, "currency": "INR" } }
```
Errors: `422 UNPROCESSABLE` (`below_moq`, includes `current_qty`/`min_qty`), `423 LOCKED` (already locked).

### POST /campaigns/:id/remind   (nudge unpaid members)  ·  POST /campaigns/:id/cancel (refunds each_pays)

---

## 10. Payments

### POST /payments/intent   (idempotent)
```json
// headers: Idempotency-Key
// req
{ "order_id": "ord_...", "provider": "razorpay" }
// 200
{ "payment_id": "pay_...", "client_secret": "pi_...", "amount": 99900,
  "currency": "INR", "status": "created" }
```

### POST /payments/:id/confirm
```json
// req (provider confirmation token)
{ "provider_ref": "pay_razorpay_xyz", "signature": "..." }
// 200
{ "payment_id": "pay_...", "status": "succeeded", "order_status": "paid" }
```
Errors: `402 PAYMENT_FAILED` (`details.provider_decline_code`), `409 CONFLICT` (already paid — idempotent no-op returns success).

### POST /payments/:id/refund   (admin/support · partial supported)

---

## 11. Webhooks (inbound — signature-verified, idempotent)

| Source | Path | Events |
|--------|------|--------|
| Payments | `POST /webhooks/payments` | `payment.succeeded`, `payment.failed`, `refund.completed` |
| Print partner | `POST /webhooks/fulfillment` | `job.accepted`, `job.printing`, `job.shipped`, `job.delivered`, `job.failed` |
| Render | internal queue (not public) | render completion |

- All webhooks verify an HMAC signature header; replays are de-duped by event id.
- Handlers update `orders`/`payments`/`fulfillment_jobs`/`shipments` and emit notifications.

```json
// example fulfillment webhook body
{ "event_id": "evt_...", "type": "job.shipped", "order_number": "TF-2026-00012",
  "carrier": "Delhivery", "tracking_no": "DLV123", "occurred_at": "..." }
```

---

## 12. Ads & Analytics

### GET /ads/slot/:key
```json
// 200 — server returns an ad decision for the slot (contextual)
{ "slot": "gallery_top", "format": "native",
  "creative": { "title": "...", "image_url": "...", "click_url": "...", "is_house": true },
  "impression_token": "imp_..." }
```
> Ads are only served for discovery/idle slots (gallery, dashboard, feed, preview-wait). No ad endpoints exist for canvas/checkout surfaces.

### POST /ads/event   `{ "impression_token", "event": "impression"|"click" }` → 204

### POST /events   (batch analytics)
```json
{ "events": [
  { "name": "design_start", "props": { "product": "hoodie" }, "ts": "..." },
  { "name": "design_save", "props": { "design_id": "dsn_..." }, "ts": "..." } ] }
// 204
```

---

## 13. Rate Limits (defaults)
| Scope | Limit |
|-------|-------|
| Anonymous (per IP) | 60 req/min |
| Authenticated | 600 req/min |
| Asset uploads | 30/min |
| Autosave `PATCH /designs/:id` | 1/sec (debounced client-side) |
| Payments/orders | 10/min + idempotency required |

`429` responses include `Retry-After` (seconds) and `X-RateLimit-Remaining`.

---

## 14. Versioning & Compatibility
- URL-versioned (`/v1`). Breaking changes → `/v2`; additive changes are backward-compatible.
- `DesignDocument` carries its own `schemaVersion`; the API migrates older documents forward on read.
- Deprecations announced via `Deprecation` and `Sunset` response headers.

> Full machine-readable contract published as **OpenAPI 3.1** (`packages/api-contracts/openapi.yaml`), the source of truth for generated client types.
