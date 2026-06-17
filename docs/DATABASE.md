# ThreadForm — Database Design

> **Engine:** PostgreSQL (primary). **Cache/ephemeral:** Redis. **Blobs:** S3 (referenced by URL/key).
> Conventions: `snake_case`, UUID (v7, time-sortable) primary keys, `created_at`/`updated_at` on every table (UTC `timestamptz`), soft delete via `deleted_at` where useful, money stored as integer **minor units** (paise/cents) + ISO `currency`. JSONB for flexible design data.

---

## 1. Entity Map

```
users ──< org_members >── organizations
  │                              │
  │                              └─< brand_kits
  ├─< assets
  ├─< designs ──< design_versions
  │     │
  │     └──< design_shares
  │
  ├─< carts ──< cart_items
  └─< orders ──< order_items >── designs
        │            │
        │            └── garment_products / garment_variants
        ├─< payments
        ├─< shipments
        └── bulk_campaigns ──< campaign_members ──< campaign_member_items

garment_products ──< garment_variants
garment_products ──< print_areas
garment_products ──< pricing_tiers

templates ──(references)── designs
ad_slots ──< ad_impressions
analytics_events
print_partners ──< fulfillment_jobs
```

---

## 2. Core Schema

### 2.1 Identity & Organizations

```sql
CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  email          CITEXT UNIQUE NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  password_hash  TEXT,                      -- null for OAuth-only
  display_name   TEXT,
  avatar_url     TEXT,
  plan           TEXT NOT NULL DEFAULT 'free',  -- free | pro | org
  role           TEXT NOT NULL DEFAULT 'user',  -- user | admin | support
  locale         TEXT DEFAULT 'en-IN',
  marketing_opt_in BOOLEAN NOT NULL DEFAULT false,
  last_seen_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMPTZ
);

CREATE TABLE auth_identities (        -- OAuth / magic-link providers
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider     TEXT NOT NULL,         -- google | apple | email_otp
  provider_uid TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_uid)
);

CREATE TABLE sessions (               -- refresh tokens (or use Redis)
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_hash  TEXT NOT NULL,
  user_agent    TEXT,
  ip            INET,
  expires_at    TIMESTAMPTZ NOT NULL,
  revoked_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE organizations (          -- teams/clubs/startups
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  name        TEXT NOT NULL,
  slug        CITEXT UNIQUE NOT NULL,
  type        TEXT,                   -- club | society | sports | startup | community
  owner_id    UUID NOT NULL REFERENCES users(id),
  plan        TEXT NOT NULL DEFAULT 'free',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE org_members (
  org_id     UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'member',  -- owner | admin | member
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id, user_id)
);

CREATE TABLE brand_kits (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  org_id     UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,  -- personal kit
  name       TEXT NOT NULL,
  colors     JSONB NOT NULL DEFAULT '[]',   -- ["#RRGGBB", ...]
  fonts      JSONB NOT NULL DEFAULT '[]',
  logo_asset_ids JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (org_id IS NOT NULL OR user_id IS NOT NULL)
);
```

### 2.2 Catalog (Garments)

```sql
CREATE TABLE garment_products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  slug          CITEXT UNIQUE NOT NULL,     -- 'hoodie-classic'
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,              -- tshirt | hoodie | oversized_tee
  description   TEXT,
  model_url     TEXT NOT NULL,              -- GLTF in CDN
  model_meta    JSONB NOT NULL DEFAULT '{}',-- UV/print-area metadata, LODs
  base_cost     INTEGER NOT NULL,           -- partner cost, minor units
  currency      TEXT NOT NULL DEFAULT 'INR',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE garment_variants (             -- color × size SKUs
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  product_id    UUID NOT NULL REFERENCES garment_products(id) ON DELETE CASCADE,
  sku           TEXT UNIQUE NOT NULL,
  color_name    TEXT NOT NULL,
  color_hex     TEXT NOT NULL,
  size          TEXT NOT NULL,              -- XS S M L XL XXL
  weight_gsm    INTEGER,
  stock_status  TEXT NOT NULL DEFAULT 'in_stock',
  extra_cost    INTEGER NOT NULL DEFAULT 0, -- surcharge for premium colors/sizes
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, color_hex, size)
);

CREATE TABLE print_areas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  product_id    UUID NOT NULL REFERENCES garment_products(id) ON DELETE CASCADE,
  key           TEXT NOT NULL,              -- front | back | left_sleeve | right_sleeve
  label         TEXT NOT NULL,
  width_mm      INTEGER NOT NULL,
  height_mm     INTEGER NOT NULL,
  dpi           INTEGER NOT NULL DEFAULT 300,
  uv_region     JSONB NOT NULL,            -- mapping to model UVs
  UNIQUE (product_id, key)
);

CREATE TABLE pricing_tiers (                -- bulk quantity breakpoints
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  product_id    UUID NOT NULL REFERENCES garment_products(id) ON DELETE CASCADE,
  min_qty       INTEGER NOT NULL,           -- 1, 10, 25, 50, 100
  unit_price    INTEGER NOT NULL,           -- customer price per unit, minor units
  currency      TEXT NOT NULL DEFAULT 'INR',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, min_qty)
);

CREATE TABLE print_addons (                 -- embroidery, sleeve print, etc.
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  slug        CITEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  price       INTEGER NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'INR',
  is_active   BOOLEAN NOT NULL DEFAULT true
);
```

### 2.3 Assets

```sql
CREATE TABLE assets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  org_id        UUID REFERENCES organizations(id) ON DELETE SET NULL,
  kind          TEXT NOT NULL,              -- upload | logo | stock | font
  storage_key   TEXT NOT NULL,             -- S3 key
  url           TEXT NOT NULL,             -- CDN URL
  mime_type     TEXT NOT NULL,
  width_px      INTEGER,
  height_px     INTEGER,
  dpi           INTEGER,
  bytes         BIGINT,
  is_print_safe BOOLEAN,                    -- resolution check result
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);
```

### 2.4 Designs

```sql
CREATE TABLE designs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  owner_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  org_id         UUID REFERENCES organizations(id) ON DELETE SET NULL,
  anon_token     TEXT,                      -- pre-login ownership claim
  title          TEXT NOT NULL DEFAULT 'Untitled design',
  product_id     UUID NOT NULL REFERENCES garment_products(id),
  primary_variant_id UUID REFERENCES garment_variants(id),
  document       JSONB NOT NULL,            -- the DesignDocument (current)
  thumbnail_url  TEXT,                      -- rendered preview
  status         TEXT NOT NULL DEFAULT 'draft',  -- draft | saved | ordered | archived
  version        INTEGER NOT NULL DEFAULT 1,     -- optimistic concurrency
  is_template    BOOLEAN NOT NULL DEFAULT false,
  visibility     TEXT NOT NULL DEFAULT 'private', -- private | unlisted | public
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at     TIMESTAMPTZ
);

CREATE TABLE design_versions (              -- history / restore
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  design_id   UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  version     INTEGER NOT NULL,
  document    JSONB NOT NULL,
  thumbnail_url TEXT,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (design_id, version)
);

CREATE TABLE design_shares (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  design_id     UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  share_token   TEXT UNIQUE NOT NULL,       -- public link slug
  permission    TEXT NOT NULL DEFAULT 'view', -- view | comment | edit | order
  expires_at    TIMESTAMPTZ,
  created_by    UUID REFERENCES users(id),
  view_count    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE templates (                    -- curated/public starting points
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  design_id    UUID NOT NULL REFERENCES designs(id),
  category     TEXT NOT NULL,               -- fest | sports | club | startup | event
  tags         TEXT[] NOT NULL DEFAULT '{}',
  is_featured  BOOLEAN NOT NULL DEFAULT false,
  use_count    INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.5 Cart & Orders

```sql
CREATE TABLE carts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  anon_token   TEXT,                        -- guest cart
  currency     TEXT NOT NULL DEFAULT 'INR',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  cart_id      UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  design_id    UUID NOT NULL REFERENCES designs(id),
  variant_id   UUID NOT NULL REFERENCES garment_variants(id),
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  unit_price   INTEGER NOT NULL,            -- snapshot at add time
  addons       JSONB NOT NULL DEFAULT '[]',
  personalization JSONB,                    -- {name, number} for jerseys
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  order_number    TEXT UNIQUE NOT NULL,     -- human-readable TF-2026-00012
  user_id         UUID REFERENCES users(id),
  org_id          UUID REFERENCES organizations(id),
  bulk_campaign_id UUID REFERENCES bulk_campaigns(id),
  type            TEXT NOT NULL,            -- individual | bulk
  status          TEXT NOT NULL DEFAULT 'pending',
       -- pending | paid | in_production | shipped | delivered | cancelled | refunded
  subtotal        INTEGER NOT NULL,
  discount        INTEGER NOT NULL DEFAULT 0,
  shipping_fee    INTEGER NOT NULL DEFAULT 0,
  tax             INTEGER NOT NULL DEFAULT 0,
  total           INTEGER NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'INR',
  shipping_address JSONB,
  billing_address  JSONB,
  notes           TEXT,
  placed_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  design_id       UUID NOT NULL REFERENCES designs(id),
  design_version  INTEGER NOT NULL,         -- exact version ordered
  variant_id      UUID NOT NULL REFERENCES garment_variants(id),
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  unit_price      INTEGER NOT NULL,
  addons          JSONB NOT NULL DEFAULT '[]',
  personalization JSONB,
  print_file_url  TEXT,                     -- production output (Render Service)
  line_total      INTEGER NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.6 Bulk / Group Campaigns

```sql
CREATE TABLE bulk_campaigns (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  organizer_id   UUID NOT NULL REFERENCES users(id),
  org_id         UUID REFERENCES organizations(id),
  design_id      UUID NOT NULL REFERENCES designs(id),
  title          TEXT NOT NULL,             -- "Spring Fest Hoodies"
  share_token    TEXT UNIQUE NOT NULL,      -- join link
  status         TEXT NOT NULL DEFAULT 'collecting',
       -- collecting | locked | paid | in_production | fulfilled | cancelled
  collection_mode TEXT NOT NULL DEFAULT 'each_pays',  -- each_pays | organizer_pays
  deadline_at    TIMESTAMPTZ,
  min_qty        INTEGER,                   -- MOQ to unlock production
  target_qty     INTEGER,
  allow_personalization BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE campaign_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  campaign_id   UUID NOT NULL REFERENCES bulk_campaigns(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES users(id),  -- nullable: guest member
  name          TEXT NOT NULL,
  email         CITEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | waived
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE campaign_member_items (        -- each member's size/qty/personalization
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  member_id     UUID NOT NULL REFERENCES campaign_members(id) ON DELETE CASCADE,
  variant_id    UUID NOT NULL REFERENCES garment_variants(id),
  quantity      INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  personalization JSONB,                    -- {name:"MEERA", number:"10"}
  unit_price    INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.7 Payments & Fulfillment

```sql
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  order_id        UUID REFERENCES orders(id) ON DELETE SET NULL,
  campaign_member_id UUID REFERENCES campaign_members(id), -- split group payments
  provider        TEXT NOT NULL,            -- stripe | razorpay
  provider_ref    TEXT,                     -- charge/intent id
  idempotency_key TEXT UNIQUE,
  amount          INTEGER NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'INR',
  status          TEXT NOT NULL DEFAULT 'created',
       -- created | authorized | succeeded | failed | refunded | partially_refunded
  failure_reason  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE print_partners (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  name         TEXT NOT NULL,
  region       TEXT NOT NULL,
  capabilities JSONB NOT NULL DEFAULT '{}', -- products, techniques, max DPI
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE fulfillment_jobs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  partner_id    UUID REFERENCES print_partners(id),
  status        TEXT NOT NULL DEFAULT 'queued',
       -- queued | accepted | printing | quality_check | shipped | delivered | failed
  partner_ref   TEXT,
  print_files   JSONB NOT NULL DEFAULT '[]',
  defect_flag   BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE shipments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  carrier       TEXT,
  tracking_no   TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',
  shipped_at    TIMESTAMPTZ,
  delivered_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.8 Ads & Analytics

```sql
CREATE TABLE ad_slots (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  key         CITEXT UNIQUE NOT NULL,       -- gallery_top | dashboard_side | preview_wait
  surface     TEXT NOT NULL,                -- gallery | dashboard | feed | preview
  format      TEXT NOT NULL,                -- banner | native | interstitial
  is_active   BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE ad_impressions (               -- high-volume; partition by day
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  slot_id     UUID NOT NULL REFERENCES ad_slots(id),
  user_id     UUID REFERENCES users(id),
  anon_id     TEXT,
  campaign_ref TEXT,
  event       TEXT NOT NULL,                -- impression | click
  context     JSONB NOT NULL DEFAULT '{}',  -- product/category for contextual targeting
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);

CREATE TABLE analytics_events (             -- high-volume; partition by day
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  user_id     UUID REFERENCES users(id),
  anon_id     TEXT,
  name        TEXT NOT NULL,                -- design_start | design_save | checkout_complete
  props       JSONB NOT NULL DEFAULT '{}',
  session_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);
```

---

## 3. Relationships Summary

| Relationship | Type | Notes |
|--------------|------|-------|
| users ↔ organizations | many-to-many via `org_members` | roles per membership |
| users → designs | one-to-many | `anon_token` allows pre-login ownership, claimed on signup |
| designs → design_versions | one-to-many | immutable history snapshots |
| designs → design_shares | one-to-many | tokenized public links |
| garment_products → garment_variants | one-to-many | color × size SKUs |
| garment_products → print_areas / pricing_tiers | one-to-many | print zones & bulk pricing |
| orders → order_items | one-to-many | each item snapshots design_version + price |
| orders → payments / shipments / fulfillment_jobs | one-to-many | lifecycle records |
| bulk_campaigns → campaign_members → campaign_member_items | nested one-to-many | group ordering core |
| campaign_members → payments | one-to-one(ish) | split "each_pays" collection |
| ad_slots → ad_impressions | one-to-many | partitioned, high volume |

**Snapshot principle:** orders and order_items store **price and design_version at purchase time** so later catalog/design edits never mutate historical orders.

---

## 4. Indexing Strategy

### 4.1 Primary access patterns → indexes
```sql
-- Designs: list a user's/org's designs, newest first
CREATE INDEX idx_designs_owner ON designs (owner_user_id, updated_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_designs_org   ON designs (org_id, updated_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_designs_anon  ON designs (anon_token) WHERE anon_token IS NOT NULL;
CREATE INDEX idx_designs_public ON designs (visibility, updated_at DESC)
  WHERE visibility = 'public';

-- Design document: JSONB GIN only if querying inside it; otherwise skip (large)
-- CREATE INDEX idx_designs_doc ON designs USING GIN (document jsonb_path_ops);

-- Versions / shares
CREATE INDEX idx_design_versions ON design_versions (design_id, version DESC);
CREATE UNIQUE INDEX idx_share_token ON design_shares (share_token);

-- Catalog
CREATE INDEX idx_variants_product ON garment_variants (product_id);
CREATE UNIQUE INDEX idx_variant_sku ON garment_variants (sku);
CREATE INDEX idx_pricing_lookup ON pricing_tiers (product_id, min_qty);
CREATE INDEX idx_products_active ON garment_products (category) WHERE is_active;

-- Orders
CREATE UNIQUE INDEX idx_order_number ON orders (order_number);
CREATE INDEX idx_orders_user   ON orders (user_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders (status) WHERE status IN ('paid','in_production');
CREATE INDEX idx_orders_campaign ON orders (bulk_campaign_id);
CREATE INDEX idx_order_items_order ON order_items (order_id);

-- Bulk campaigns
CREATE UNIQUE INDEX idx_campaign_token ON bulk_campaigns (share_token);
CREATE INDEX idx_campaign_status ON bulk_campaigns (status, deadline_at);
CREATE INDEX idx_campaign_members ON campaign_members (campaign_id);
CREATE INDEX idx_member_items ON campaign_member_items (member_id);

-- Payments (idempotency + lookups)
CREATE UNIQUE INDEX idx_payment_idem ON payments (idempotency_key)
  WHERE idempotency_key IS NOT NULL;
CREATE INDEX idx_payments_order ON payments (order_id);
CREATE INDEX idx_payments_provider_ref ON payments (provider, provider_ref);

-- Fulfillment / shipments
CREATE INDEX idx_fulfillment_order ON fulfillment_jobs (order_id);
CREATE INDEX idx_fulfillment_status ON fulfillment_jobs (status);
CREATE INDEX idx_shipments_tracking ON shipments (tracking_no);

-- Assets
CREATE INDEX idx_assets_owner ON assets (owner_user_id, created_at DESC)
  WHERE deleted_at IS NULL;

-- Templates discovery
CREATE INDEX idx_templates_cat ON templates (category, is_featured, use_count DESC);
CREATE INDEX idx_templates_tags ON templates USING GIN (tags);

-- Identity
CREATE UNIQUE INDEX idx_users_email ON users (email);
CREATE INDEX idx_sessions_user ON sessions (user_id) WHERE revoked_at IS NULL;
```

### 4.2 Strategy Principles
- **Composite + partial indexes** for the dashboard's "my recent, non-deleted designs/orders" pattern.
- **GIN** indexes only where we actually search inside JSONB/arrays (tags, optionally design document). Avoid indexing large design JSONB unless query-driven — it bloats and slows writes.
- **Covering/sort-friendly** indexes (`... , updated_at DESC`) to serve list pages without extra sorts.
- **Partitioning** for `ad_impressions` and `analytics_events` (range by day/month) — high write volume, time-series reads, cheap drop of old partitions per retention policy.
- **Unique constraints** double as integrity + lookup indexes (sku, order_number, share_token, idempotency_key).
- **Foreign keys** indexed on the child side (Postgres doesn't auto-index FKs) to keep joins and cascade deletes fast.

### 4.3 Redis (not Postgres) for
- Active editor sessions / autosave debounce buffers.
- Rate limiting (token buckets) and quote caching.
- Realtime pub/sub for bulk campaign live updates.
- Hot catalog/pricing cache.

### 4.4 Data Retention & Integrity
- `ad_impressions` / `analytics_events`: retain raw 90 days, roll up to aggregates, drop old partitions.
- Soft delete (`deleted_at`) for designs/assets to support undo and abuse review; hard purge job after grace period.
- Money always integer minor units + currency; never float.
- All writes that cross modules (order→payment→fulfillment) use the **outbox** table pattern (omitted above for brevity) for reliable eventing.
