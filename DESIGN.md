# Mystic Journey — Design System

The admin portal and public site for **Mystic Journey**, a dark-fantasy MMORPG.
This document is the single source of truth for UI. Read it before any UI change
(mandated by `AGENTS.md`). Tokens live in `app/globals.css` under `@theme`.

---

## 1. Brand identity

Dark-fantasy, gold-on-black. The mood is a torchlit dungeon: deep black surfaces,
a single warm gold accent that carries every primary action, and restrained use
of semantic color (green/red/blue) for status only.

Do **not** introduce a second brand accent (no purple/pink/teal CTAs). Gold is the
identity — competing accents read as a different product.

---

## 2. Color tokens

Consume via Tailwind utilities generated from `@theme` (e.g. `bg-surface`,
`text-accent`, `border-line`) or `var(--color-*)` in raw CSS. Do not hardcode new
hex values in components — add or reuse a token.

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#000000` | App background |
| `--color-surface` | `#111111` | Cards, panels, top bars |
| `--color-surface-2` | `#0d0d0d` | Inset fields, nested surfaces |
| `--color-line` | `white/10` | Default borders / dividers |
| `--color-line-strong` | `white/20` | Emphasised borders |wwwwww
| `--color-accent` | `#ffc032` | Primary accent, CTA, active state |
| `--color-accent-hover` | `#ffd04c` | Accent hover |
| `--color-accent-deep` | `#ff8c00` | Gradient partner (gold → amber) |
| `--color-on-accent` | `#111111` | Text/icon on a gold fill |
| `--color-fg` | `#ffffff` | Primary text |
| `--color-fg-muted` | `#9ca3af` | Secondary text |
| `--color-fg-subtle` | `#6b7280` | Tertiary / placeholder |
| `--color-success` | `#22c55e` | Success / positive status |
| `--color-danger` | `#ef4444` | Destructive / error |
| `--color-info` | `#3b82f6` | Informational status |

The historical hardcoded values (`#111`, `#ffc032`, `#ff8c00`, `white/10`) map
1:1 onto these tokens — prefer the token in new code.

---

## 3. Typography

| Role | Family | Notes |
|---|---|---|
| Headings | `PatrickHandSC` | Hand-drawn, fantasy feel (set on `h1–h6`) |
| Body (default) | `PatrickHand` | App default via `body` |
| UI / data | `BeVietnamPro` | Dense admin tables, forms, numbers |
| Fallback multilingual | `NotoSans` | Vietnamese / broad glyph coverage |

Fonts are self-hosted in `public/fonts` and declared with `@font-face`
(`font-display: swap`). Keep long-form/admin data in `BeVietnamPro` for legibility.

---

## 4. Shape, spacing, elevation

- **Radius:** `rounded-xl` (inputs, buttons) and `rounded-2xl` (cards, panels).
  Pills (`rounded-full`) for badges and status chips.
- **Spacing rhythm:** 4/8px scale — gaps and padding in multiples (`gap-2`,
  `p-4`, `space-y-5`). Section spacing tiers 16 / 24 / 32 / 48.
- **Borders over shadows:** surfaces are separated by `border-line`, not drop
  shadows. Gold elements may use a soft glow (`shadow-lg shadow-[#ffc032]/20`).

---

## 5. Components

- **Primary button:** gold fill `bg-accent`, `text-on-accent`, `rounded-xl`,
  `font-bold`, hover → `accent-hover`, `cursor-pointer`.
- **Secondary / ghost:** transparent on `accent/10` tint with `border-accent/30`.
- **Inputs:** `bg-surface-2`, `border-line`, focus → `border-accent`. Always pair
  with a `<label htmlFor>` (accessibility lint enforces this).
- **Status chips:** semantic tint + matching text + border at 15% / 30% opacity
  (e.g. `bg-green-500/15 text-green-400 border-green-500/30`).
- **Tables:** `AdminTable` is the standard admin list surface (server-side
  pagination via `usePagedQuery`).

---

## 6. Quality rules (from `ui-ux-pro-max`)

Enforced globally in `app/globals.css`; keep honouring them per-component:

- **Focus:** every interactive element inherits a gold `:focus-visible` ring — do
  not remove outlines without providing an alternative visible focus state.
- **Reduced motion:** animations/transitions collapse under
  `prefers-reduced-motion: reduce`. Do not force long animations regardless.
- **Contrast:** primary text ≥ 4.5:1, secondary ≥ 3:1 on dark surfaces. Prefer
  `fg-muted` over darker grays for body copy on black.
- **Icons:** SVG only (Lucide). Never emojis as structural/nav icons. Consistent
  size (`w-4 h-4` inline, `w-5 h-5` controls) and stroke.
- **Pointer affordance:** `cursor-pointer` on all clickable non-native elements.
- **Color is never the only signal:** pair status color with an icon or label.
- **Motion timing:** micro-interactions 150–300ms with smooth easing.
- **Responsive:** verify at 375 / 768 / 1024 / 1440px.

---

## 7. Anti-patterns

- Hardcoding new hex colors instead of adding/using a token.
- A second brand accent competing with gold.
- Emoji icons; raster (PNG) icons that pixelate.
- Removing focus outlines; layout-shifting hover states.
- Low-contrast gray body text on black.
