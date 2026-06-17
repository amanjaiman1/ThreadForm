# ThreadForm — Design System

> **Brand feeling:** *Creative confidence.* Canva's friendliness, Nike's bold energy, Figma's precision. The UI should feel like a pro tool that anyone can use — quiet and neutral around the canvas so the **garment and the user's art are always the heroes**, energetic and expressive in marketing and celebratory moments.

This system is **token-first**: every value below lives in `packages/design-tokens` as CSS variables + JS tokens, consumed by Tailwind and the shared `ui` package. Designers and engineers reference tokens, never raw values.

---

## 1. Color

### 1.1 Philosophy
- **Canvas neutrality:** the editor is built on neutral grays so any garment color and artwork looks true. Color is reserved for action, brand, and state.
- **One confident brand color** (Thread Violet) + **one energetic accent** (Volt) for moments that should pop (CTAs, success, "order now").
- **WCAG AA minimum** for text and interactive elements; AAA for body text where feasible.

### 1.2 Brand Palette

| Token | Hex | Use |
|-------|-----|-----|
| `--color-brand-50` | `#F2EEFF` | tints, hover wash |
| `--color-brand-100` | `#E4DBFF` | subtle backgrounds |
| `--color-brand-300` | `#B9A4FF` | borders, illustrations |
| `--color-brand-500` | `#6C3CE9` | **Thread Violet — primary brand** |
| `--color-brand-600` | `#5A2FD0` | primary hover |
| `--color-brand-700` | `#481FB0` | primary active / pressed |
| `--color-brand-900` | `#2A1170` | deep accents, gradients |

### 1.3 Accent (energy)

| Token | Hex | Use |
|-------|-----|-----|
| `--color-accent-400` | `#C6FF4D` | highlights, badges |
| `--color-accent-500` | `#A6F000` | **Volt — high-energy CTA / "Order"** |
| `--color-accent-600` | `#86C400` | accent hover |

> Volt is used sparingly — for the single most important action on a screen (e.g., **Order**, **Start designing**). Never two Volt CTAs competing on one view.

### 1.4 Neutrals (the canvas)

| Token | Hex | Use |
|-------|-----|-----|
| `--color-ink-900` | `#0E0E12` | primary text, dark UI chrome |
| `--color-ink-700` | `#2B2B33` | headings on light |
| `--color-ink-500` | `#5B5B66` | secondary text |
| `--color-ink-400` | `#8A8A96` | placeholder, disabled text |
| `--color-line-200` | `#E6E6EC` | borders, dividers |
| `--color-surface-100` | `#F6F6F9` | app background |
| `--color-surface-50` | `#FAFAFC` | panels |
| `--color-surface-0` | `#FFFFFF` | cards, canvas frame |

### 1.5 Semantic / State

| Token | Hex | Meaning |
|-------|-----|---------|
| `--color-success` | `#1FA971` | paid, in stock, print-safe |
| `--color-warning` | `#E0A100` | low-res image, deadline soon |
| `--color-danger`  | `#E5484D` | errors, low-res blocking, destructive |
| `--color-info`    | `#2F77F0` | tips, neutral notices |

### 1.6 Dark Mode (Studio default option)
The editor offers a dark theme so artwork colors are judged against a neutral dark field. Tokens flip via `[data-theme="dark"]`:
- `--color-surface-0 → #16161C`, `--color-surface-100 → #0E0E12`, `--color-ink-900 → #F4F4F7`, lines lighten, brand/accent stay constant for recognizability.

### 1.7 Gradients (marketing / celebratory only)
- `--gradient-brand`: `linear-gradient(135deg, #6C3CE9, #2A1170)`
- `--gradient-volt`: `linear-gradient(135deg, #A6F000, #6C3CE9)` — used for hero moments and the success confetti backdrop.

---

## 2. Typography

### 2.1 Typefaces
| Role | Font | Notes |
|------|------|-------|
| **Display / Headlines** | `Clash Display` (or `Satoshi`) | bold, confident, marketing + section titles |
| **UI / Body** | `Inter` | workhorse, excellent legibility at small sizes |
| **Mono / Specs** | `JetBrains Mono` | dimensions, SKUs, code, print specs |
| **In-canvas design fonts** | curated library (Anton, Bebas Neue, Playfair, Poppins, etc.) | what users print *with*; separate from UI fonts |

> The **design font library** (used on garments) is distinct from the **product UI fonts**. Never let them mix.

### 2.2 Type Scale (1.250 — major third, base 16px)

| Token | Size / Line | Weight | Use |
|-------|-------------|--------|-----|
| `--text-display` | 56 / 60 | 700 | hero headlines |
| `--text-h1` | 40 / 48 | 700 | page titles |
| `--text-h2` | 32 / 40 | 600 | section titles |
| `--text-h3` | 24 / 32 | 600 | card titles |
| `--text-lg` | 20 / 28 | 500 | lead paragraphs |
| `--text-body` | 16 / 24 | 400 | body (default) |
| `--text-sm` | 14 / 20 | 400 | secondary, labels |
| `--text-xs` | 12 / 16 | 500 | captions, badges, meta |

- **Tracking:** display/headlines slightly tight (`-0.01em` to `-0.02em`); body normal; all-caps labels `+0.04em`.
- **Max line length:** 60–75 characters for body.

---

## 3. Spacing & Layout

### 3.1 Spacing scale (4px base)
`--space-0:0 · 1:4 · 2:8 · 3:12 · 4:16 · 5:20 · 6:24 · 8:32 · 10:40 · 12:48 · 16:64 · 20:80 · 24:96`

Use multiples of 4; default rhythm unit is **8px**. Component internal padding favors 12/16; section spacing favors 48/64/96.

### 3.2 Radius
`--radius-sm:6 · md:10 · lg:16 · xl:24 · pill:999 · canvas-frame:12`
- Friendly but not bubbly. Buttons & inputs `md`; cards `lg`; modals/sheets `xl`; chips/avatars `pill`.

### 3.3 Elevation (shadows)
| Token | Use |
|-------|-----|
| `--shadow-xs` | subtle separation (inputs) |
| `--shadow-sm` | cards |
| `--shadow-md` | dropdowns, popovers |
| `--shadow-lg` | modals, floating toolbars |
| `--shadow-canvas` | the design canvas frame (soft, ambient) |

Shadows are soft and low-contrast (creative-tool calm), never harsh.

### 3.4 Grid & Breakpoints
| Token | Width | Layout |
|-------|-------|--------|
| `sm` | ≥640 | single column, stacked editor (mobile design via simplified tools) |
| `md` | ≥768 | 2-pane |
| `lg` | ≥1024 | **Studio canonical**: left tools · center canvas/3D · right properties |
| `xl` | ≥1280 | wider canvas, dual preview (2D + 3D) |
| `2xl` | ≥1536 | max content width 1440 for marketing |

**Studio layout (lg+):**
```
┌──────────────────────────────────────────────────────────┐
│ Top bar: logo · design title · undo/redo · Save · Order   │
├───────────┬───────────────────────────────┬──────────────┤
│ Tool rail │      Canvas / 3D Preview        │  Properties  │
│ (text,    │   (2D edit ⇄ 3D rotate toggle)  │  (layer,     │
│  image,   │                                 │   color,     │
│  logo,    │                                 │   size,      │
│  shapes,  │                                 │   garment)   │
│  layers)  │                                 │              │
└───────────┴───────────────────────────────┴──────────────┘
```

---

## 4. Components

Built in `packages/ui`, headless logic (Radix-style) + token styling, fully accessible (keyboard, focus rings, ARIA).

### 4.1 Foundational
- **Button** — variants: `primary` (Thread Violet), `cta` (Volt, one per view), `secondary`, `ghost`, `danger`, `icon`. Sizes sm/md/lg. States: hover/active/focus/disabled/loading.
- **Input / Textarea / Select / Combobox** — with label, helper, error; print-spec inputs use mono.
- **Checkbox / Radio / Switch / Slider** — slider critical for scale/rotation in editor.
- **Badge / Tag / Chip** — status (paid, print-safe, low-res), filters.
- **Avatar / AvatarGroup** — campaign members.
- **Tooltip / Popover / Dropdown Menu.**
- **Tabs / Segmented control** — 2D ⇄ 3D, front/back/sleeve switching.
- **Toast / Banner / Inline alert** — uses semantic colors.
- **Modal / Drawer / Bottom sheet** (mobile).
- **Skeleton / Spinner / Progress** — render & upload states.

### 4.2 Domain (apparel-specific)
- **GarmentCanvas** — the 2D Fabric editing surface with selection handles, snap guides, print-area boundary overlay.
- **Preview3D** — R3F viewer with orbit, color swatch row, view presets (front/back/45°), AR button (V3).
- **ToolRail** — Text / Image / Logo / Upload / Shapes / Templates / Layers.
- **PropertiesPanel** — context-sensitive controls for the selected layer or garment.
- **LayerList** — drag-reorder, lock, hide, rename.
- **ColorSwatchPicker** — garment colors (from variants) + custom artwork colors + brand-kit palette.
- **SizeSelector / SizeMatrix** — single size, or quantity-per-size grid for bulk.
- **PrintSafetyMeter** — live DPI/resolution indicator (success/warning/danger).
- **PriceQuoteCard** — unit price, bulk tier savings, add-ons, live total.
- **TemplateGallery / TemplateCard** — discovery + ad slots interleaved.
- **CampaignTracker** — members joined, sizes collected, payment progress bar, deadline countdown.
- **OrderStatusTimeline** — pending → paid → production → shipped → delivered.
- **AdSlot** — typed wrapper enforcing placement rules (never inside canvas/checkout).

### 4.3 Component Rules
- One **Volt CTA** maximum per view; everything else `primary`/`secondary`.
- Destructive actions require confirmation; never adjacent to primary CTA.
- All interactive elements: visible focus ring (`--color-brand-500`, 2px offset), min 44×44px touch target.
- Empty states always offer the next action (e.g., "No designs yet → Start designing").

---

## 5. Motion Principles

> **Motion communicates, it never decorates.** It explains spatial relationships (where panels come from), confirms actions, and adds delight at moments that earn it (3D reveal, order placed).

### 5.1 Tokens
| Token | Value | Use |
|-------|-------|-----|
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | most transitions |
| `--ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1.2)` | playful overshoot (success, add element) |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | dismiss/exit |
| `--dur-fast` | 120ms | hovers, toggles |
| `--dur-base` | 200ms | panels, popovers |
| `--dur-slow` | 320ms | modals, drawers |
| `--dur-reveal` | 600ms | 3D garment reveal, hero |

### 5.2 Signature Motions
- **3D reveal:** when switching 2D→3D, the garment eases in with a gentle rotate-and-settle (`--dur-reveal`, `--ease-emphasized`) — the "wow" that builds buying confidence.
- **Element drop:** dragging text/logo onto the garment snaps with a soft scale bounce (`--ease-emphasized`).
- **Color change:** garment material cross-fades color over `--dur-base` (no hard flip).
- **Order placed:** Volt gradient sweep + subtle confetti, OrderStatusTimeline animates to "paid."
- **Autosave:** quiet, non-blocking "Saved" micro-toast; never interrupts.
- **Campaign progress:** progress bar fills smoothly as members join (realtime).

### 5.3 Principles
1. **Fast in, faster out** — entrances ~200ms, exits shorter; never make users wait on chrome.
2. **Spatial consistency** — panels animate from their edge (right panel slides from right).
3. **Respect `prefers-reduced-motion`** — replace transforms with instant/opacity-only; disable confetti and 3D auto-spin.
4. **60fps or nothing** — animate `transform`/`opacity` only; never layout properties.
5. **Earned delight** — celebratory motion only at genuine milestones (first save, order placed, campaign goal hit).

---

## 6. Accessibility & Inclusivity (cross-cutting)
- Color is never the sole signal (pair with icon/text — e.g., PrintSafetyMeter shows label + color).
- AA contrast minimum; test brand/Volt on both themes.
- Full keyboard operability of the editor (move/scale layers via arrows/shortcuts).
- Localized typography & RTL-readiness (token-driven logical properties).
- Honor `prefers-reduced-motion` and `prefers-color-scheme`.

---

## 7. Tokens Source of Truth
- Defined once in `packages/design-tokens` → exported as: CSS variables (`:root` + `[data-theme="dark"]`), a Tailwind preset, and typed JS (`tokens.ts`).
- Components in `packages/ui` consume tokens only. **No hard-coded hex, px, or duration in feature code.**
- Changing a brand value = editing one token file → propagates everywhere.
