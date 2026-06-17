# ThreadForm — User Flows

> How real people move through ThreadForm. Each flow lists the **trigger**, **steps**, **decision points**, **edge cases**, and the **metrics** it drives (see PRODUCT.md). Personas referenced: **Sam** (visitor), **Arjun** (solo creator), **Ria** (club lead), **Coach Meera** (team), **Dev** (startup).

**Golden rule across all flows:** *Design first, account later.* Never block creativity behind a login. Ads appear only in discovery/idle surfaces — never the canvas or checkout.

---

## 1. Visitor Flow (Sam — discovery → activation)

**Goal:** Turn an anonymous arrival into an engaged maker (and an ad impression), then nudge to a saved design.

```
Landing / Template Gallery (SSR, ad slots)
        │
        ▼
"Start designing" (Volt CTA)  ──or──  pick a Template
        │
        ▼
Studio opens with a guest design (anon_token created)
        │
   ┌────┴─────────────────────────┐
   │ Places ≥1 element  → design_start event fired
   └────┬─────────────────────────┘
        ▼
3D preview reveal (the "wow")
        │
        ▼
Tries to Save / Order  → Soft auth wall
        │
   ┌────┴────────────────────┐
   │ Sign up / Google / magic │ → guest design CLAIMED via anon_token
   └────┬────────────────────┘
        ▼
Design saved to dashboard  → design_save event (ACTIVATION)
```

- **Entry points:** organic/social/search → landing or a shared design (see Share flow), or an ad/template.
- **Decision points:** Start blank vs template; Save now vs keep exploring.
- **Ad exposure:** gallery, inspiration feed, dashboard, and the "preparing your preview" idle moment.
- **Edge cases:**
  - Leaves before saving → guest design persists by `anon_token` (cookie); return reopens it; reminder email only if they later sign up.
  - Bot/abuse → rate-limited, no asset upload until light verification.
- **Metrics:** Design Start Rate, TTFD (<5 min), Design Save Rate, ad RPM/viewability, share-driven signups.

---

## 2. Designer Flow (Arjun — create a design)

**Goal:** Go from blank garment to a saved, print-safe, order-ready design with confidence.

```
Choose garment (t-shirt / hoodie / oversized tee)
        │
        ▼
Pick color + size  (garment_variants)
        │
        ▼
Add content to print areas (front / back / sleeves):
   • Add text  → choose design font, color, size, curve
   • Add logo  → from brand kit or upload
   • Upload image → auto resolution / print-safety check
   • Add shapes / templates / clipart
        │
        ▼
Arrange: drag, scale, rotate, layer order, snap to print-area guides
        │
        ▼
Live PrintSafetyMeter + live PriceQuoteCard update
        │
        ▼
Toggle 2D ⇄ 3D · rotate garment · switch color to compare
        │
        ▼
Autosave (guest or account)  →  Save / Name design
        │
        ▼
Next: Order  •  Share  •  Start a bulk campaign
```

- **Decision points:** garment type, color/size, which print areas, upload vs brand-kit logo.
- **Print-safety logic:** image DPI computed against print-area size → meter shows **success / warning (still printable) / danger (too low, blocks high-quality order)** with a clear fix ("upload a larger image").
- **Edge cases:**
  - Low-res upload → warning; allow proceed only above a hard minimum, else block with guidance.
  - Element dragged outside print area → snaps back / clamped to bounds.
  - Browser refresh / crash → restored from autosave (last `design_version`).
  - Undo/redo → command history (see ARCHITECTURE.md).
- **Metrics:** designs per user, 3D interactions/session, edit error rate (guardrail), save rate.

---

## 3. Checkout Flow (individual order — Arjun)

**Goal:** Convert a saved design into a paid individual order with minimal friction.

```
Design → "Order" (Volt CTA)
        │
        ▼
Confirm garment: product · color · size · quantity · add-ons (embroidery, sleeve print)
        │
        ▼
Review mockup (3D) + final PriceQuoteCard (unit price, add-ons, shipping, tax, total)
        │
        ▼
Cart  (guest cart by anon_token, or account cart)
        │
        ▼
Auth checkpoint (if guest) — minimal: email + create-account-on-pay
        │
        ▼
Shipping address  →  Shipping method/estimate
        │
        ▼
Payment (Stripe / Razorpay)  — idempotency key, secure element
        │
   ┌────┴────────────┐
   │ Success         │ Failure → retry / alt method, cart preserved
   └────┬────────────┘
        ▼
Order created (status: paid) + order_number  →  confirmation + email
        │
        ▼
Render Service generates print-ready files → Fulfillment job → partner
        │
        ▼
OrderStatusTimeline: paid → in_production → shipped → delivered (tracking)
```

- **Decision points:** quantity (may cross into bulk tier pricing → prompt "ordering 10+? save with a group order"), add-ons, shipping speed.
- **Edge cases:**
  - Payment fails/timeout → idempotent retry; never double-charge; cart intact.
  - Variant out of stock at checkout → suggest nearest available color/size.
  - Design edited after adding to cart → cart snapshots `design_version`; prompt if a newer version exists.
  - Address validation failure → inline correction.
- **Metrics:** checkout completion rate (guardrail), AOV, payment success rate, refund rate.

---

## 4. Share Flow (viral loop — any designer)

**Goal:** Make every design a shareable, beautiful link that drives new visitors and group orders.

```
Design → "Share"
        │
        ▼
Choose permission:  View  •  Comment  •  Order  •  (Edit / collaborate – V2)
        │
        ▼
System creates design_share (share_token) → short URL + rich OG preview image
   (OG image rendered by Render Service: garment mockup + title)
        │
        ▼
Share via: copy link · WhatsApp · Instagram · QR code · email
        │
        ▼
Recipient opens link (no login needed)
   ┌──────────────────────────────────────────────┐
   │ View-only  → can admire, "Make it yours" (fork)│
   │ Order      → straight into Checkout            │
   │ Comment    → feedback (V2)                     │
   └──────────────────────────────────────────────┘
        │
        ▼
Recipient acts → visitor flow / checkout / starts own design (K-factor)
```

- **Decision points:** permission level, expiry, channel.
- **OG/social:** auto-generated preview card so links look premium in chats/feeds (drives clicks).
- **Edge cases:**
  - Expired/revoked token → friendly "this design is no longer shared" + CTA to design your own.
  - Public vs unlisted vs private visibility respected.
  - Fork ("Make it yours") → copies design as a new draft owned by the recipient; original untouched.
- **Metrics:** share→signup K-factor (>0.4 target), share link CTR, forks per share, view_count.

---

## 5. Bulk / Group Order Flow (Ria & Coach Meera — the growth engine)

**Goal:** Let one organizer collect sizes, personalization, and payment from many members without spreadsheets — then ship in one batch.

### 5.1 Organizer starts a campaign
```
Finalize a base design → "Start a group order"
        │
        ▼
Configure bulk_campaign:
   • Title ("Spring Fest Hoodies")
   • Collection mode:  each_pays  |  organizer_pays
   • Deadline · target/min quantity (MOQ)
   • Allow personalization? (name/number for jerseys – Coach Meera)
        │
        ▼
Get a join link (share_token) + QR  →  share to the group
```

### 5.2 Members join
```
Member opens join link (no account needed to participate)
        │
        ▼
Sees the design (3D) → selects size (+ color if allowed)
        │  + name/number if personalization enabled
        ▼
each_pays mode  → member pays their share now (payment per campaign_member)
organizer_pays  → member just submits size/details
        │
        ▼
campaign_member + campaign_member_items recorded; live CampaignTracker updates
```

### 5.3 Organizer monitors & locks
```
CampaignTracker (realtime): members joined · sizes collected · payment progress · countdown
        │
   ┌────┴───────────────────────────────────────┐
   │ Reaches MOQ / deadline → "Lock & Order"      │
   └────┬───────────────────────────────────────┘
        ▼
Campaign locked → consolidated order created (type: bulk)
   • each_pays: collected funds reconciled; chase unpaid members (reminders)
   • organizer_pays: organizer pays the full total once
        │
        ▼
Bulk pricing tier applied (cheaper per unit) → order_items per size/personalization
        │
        ▼
Render Service generates per-variant print files (incl. personalization) → Fulfillment
        │
        ▼
Production → single batch shipment (to organizer) or split shipping (V2)
        │
        ▼
OrderStatusTimeline shared with organizer (+ members get status updates)
```

- **Decision points:** collection mode, MOQ vs deadline trigger, personalization on/off, ship-to-one vs ship-to-many.
- **Edge cases:**
  - Below MOQ at deadline → extend deadline, lower scope, switch to individual pricing, or cancel + refund (each_pays).
  - Unpaid members (each_pays) → automated reminders; organizer can cover, waive, or drop them before lock.
  - Member edits size before lock → allowed; locked after campaign locks.
  - Duplicate joins / abuse → dedupe by email; organizer can remove members.
  - Refunds on cancellation → per-member refunds via payments.
- **Metrics:** bulk order share of revenue (35% target), AOV (bulk vs individual), members per campaign, payment completion within campaign, organizer reorder rate.

---

## 6. Supporting / Cross-Cutting Flows (summary)

| Flow | Trigger | Outcome |
|------|---------|---------|
| **Auth / Account claim** | Save/Order as guest | anon_token design + cart claimed to new account |
| **Brand kit setup** (Dev) | Org/Pro user | logos, colors, fonts reused across designs |
| **Reorder** (Dev) | Past order in dashboard | one-click new order from saved design_version |
| **Order tracking** | Post-purchase | OrderStatusTimeline + carrier tracking, notifications |
| **Refund / issue** | Defect / cancel | support flow → payment refund, fulfillment defect_flag |
| **Template → design** | Pick template | clones template into a new editable draft |
| **Upgrade to Pro** (V3) | Hit free-tier limit / wants ad-free | plan change, premium features unlocked |

---

## 7. Flow Health Dashboard (what to watch)
- **Activation funnel:** visit → design_start → design_save → first order.
- **Checkout funnel:** order intent → cart → pay → success (watch each drop-off).
- **Campaign funnel:** create → members join → MOQ reached → locked → fulfilled.
- **Viral loop:** share created → link opened → action (order/fork/signup) → new design.

> Each flow emits `analytics_events` (see DATABASE.md) so funnels are measurable end-to-end.
