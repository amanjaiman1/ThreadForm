# ThreadForm — Roadmap

> Three horizons, one thesis: **win activation and the viral group-order loop first, then deepen monetization.** Each version has a clear theme, scoped features, success criteria, and the revenue mix it targets (see PRODUCT.md §3.4).

| Version | Theme | Revenue mix (Ads / Orders / Premium) | Primary metric |
|---------|-------|--------------------------------------|----------------|
| **MVP** | *Design → Share → Order, beautifully* | 70 / 30 / 0 | Design Save Rate + first orders |
| **V2** | *The group-order growth engine* | 50 / 45 / 5 | Bulk order share of revenue |
| **V3** | *Platform, premium & immersive* | 35 / 45 / 20 | Pro MRR + net retention |

---

## MVP — "Design → Share → Order, beautifully"
**Objective:** Prove that people can design apparel they love and buy it, and that sharing brings new makers. Keep scope ruthless; ship the magic (3D + frictionless creation), defer the rest.

### Must-have features
- **Designer (Studio):**
  - Garments: **t-shirt, hoodie, oversized tee** (front + back print areas).
  - Add **text** (curated design fonts, color, size, basic curve), **upload images**, **add logos**, basic **shapes/clipart**.
  - Layers, drag/scale/rotate, snap-to-print-area, undo/redo.
  - **Live 3D preview** (R3F) with color switching and orbit — the core "wow."
  - **PrintSafetyMeter** (DPI check) + **live price quote**.
- **Design first, account later:** guest design via `anon_token`, claimed on signup (email + Google + magic link).
- **Save designs** to dashboard; autosave + version history.
- **Share** via tokenized link with auto OG preview image; "Make it yours" fork.
- **Individual checkout:** cart → address → payment (Razorpay + Stripe) → order; idempotent.
- **Order tracking** timeline; transactional emails.
- **Fulfillment:** 1 print partner integration; Render Service produces print-ready files.
- **Ads (primary revenue):** house + basic display ads in **gallery + dashboard** only.
- **Template gallery** (small curated set) for fast starts + SEO/ad funnel.
- **Analytics events** wired for the activation funnel.

### Explicitly out of scope (MVP)
Bulk/group campaigns, real-time collaboration, AR, marketplace, Pro subscription, embroidery/sleeve add-ons, org/team accounts, mobile native apps, search.

### Success criteria to exit MVP
- Design Start → Save Rate ≥ 40%; TTFD < 5 min.
- ≥ X paid individual orders/week with < 2% defect rate.
- Checkout completion ≥ 55%.
- Share→signup K-factor measurable and > 0.2.

---

## V2 — "The group-order growth engine"
**Objective:** Unlock the revenue and virality thesis: organizers (Ria, Coach Meera) bring whole groups. This is where AOV and acquisition compound.

### Headline features
- **Bulk / Group Campaigns** (the centerpiece):
  - Organizer creates a campaign from a design; **join link + QR**.
  - **Member self-service:** pick size/color, optional **personalization (name/number)** for jerseys.
  - **Collection modes:** `each_pays` (split payment) and `organizer_pays`.
  - **CampaignTracker:** realtime members/sizes/payment progress, deadline countdown, MOQ.
  - **Lock → consolidated bulk order** with **bulk pricing tiers**; reminders for unpaid members; cancellation refunds.
- **Org / Team accounts & roles** (owner/admin/member) + **Brand Kits** (logos, colors, fonts).
- **Reorder** in one click; saved addresses.
- **More print options:** add-ons (**back/sleeve print, embroidery**), more garment colors/sizes, heavyweight options.
- **Realtime layer:** WebSocket updates for campaigns; **comments on shared designs**.
- **Search & richer template library** (categories: fest, sports, club, startup, event).
- **Ads maturity:** native ad formats, inspiration feed, contextual targeting; early direct apparel-brand sponsorships.
- **Multi-partner fulfillment routing** (region/capability based) for reliability and capacity.
- **ThreadForm Pro (early/limited):** ad-free + unlimited storage + brand kits as paid perks (seeds the 5% premium).

### Success criteria to exit V2
- **Bulk orders ≥ 35% of order revenue.**
- Avg members per campaign and campaign-completion (locked & fulfilled) trending up.
- K-factor > 0.4 (group invites are the main driver).
- Defect rate held < 2% across multiple partners.

---

## V3 — "Platform, premium & immersive"
**Objective:** Turn ThreadForm into a durable platform with high-margin premium revenue, deeper creativity, and standout immersive previews.

### Headline features
- **ThreadForm Pro & Pro for Orgs (full):**
  - Subscription/per-seat: ad-free, **team workspaces**, approval workflows, **invoicing/GST**, priority production, advanced export.
  - Org admin dashboards, custom MOQ deals, bulk reorder programs.
- **Real-time multiplayer design** (CRDT/Yjs) — co-design like Figma.
- **AR / immersive try-on:** view the garment on a phone in AR; richer PBR materials, fabric simulation, multiple model body types.
- **Creator Marketplace:** designers publish templates/assets; ThreadForm takes a revenue cut (new premium stream).
- **AI assist:** generate art/logos/text layouts, auto-vectorize uploads, smart color/palette suggestions, "describe your design."
- **Expanded catalog:** more garment types (caps, totes, jackets), embroidery-first products, premium lines.
- **Native mobile apps** (design-on-the-go, AR-native).
- **Programmatic ads at scale** + premium direct sponsorships; advanced ad analytics.
- **Internationalization:** multi-currency, multi-region fulfillment, localized content.

### Success criteria
- **Premium ≈ 20% of revenue**; healthy free→Pro conversion and **net revenue retention > 100%** for orgs.
- Marketplace contributing measurable GMV.
- AR/collaboration driving engagement and differentiation (retention lift).

---

## Sequencing rationale
1. **MVP** proves the core loop and funds growth via ads while orders ramp.
2. **V2** captures the real money and virality (groups) — the strategic heart of the business.
3. **V3** compounds with premium, marketplace, and immersive tech once the funnel and supply chain are proven.

## Cross-cutting tracks (every version)
- **Trust & quality:** proofs, transparent pricing/timelines, defect/reprint monitoring, support flows.
- **Performance & reliability:** Studio 60fps, render throughput, uptime, observability.
- **Accessibility & i18n:** AA from day one; i18n groundwork in V2, full in V3.
- **Data & experimentation:** funnel analytics, A/B testing of activation and checkout, ad yield optimization.

## Guardrails (don't trade away for speed)
- Never put ads in the canvas or checkout.
- Never block creation behind login.
- Keep checkout completion, designer crash rate, and refund rate within targets while shipping new features.

> Living document — revisit each horizon's scope against real metrics from the **Flow Health Dashboard** (USER_FLOWS.md §7) and the success metrics in PRODUCT.md §4.
