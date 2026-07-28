# Mystic Journey — Design System

The web portal's visual language is **pixel-art vintage medieval**, matched to the
Unity client's art (the Pixel World tileset under `Assets/PixelWorld`). The goal
is that a screenshot of the game dropped into a page looks like it belongs there,
rather than sitting inside modern SaaS chrome.

Three rules drive every decision below. When in doubt, apply these:

1. **No curves.** A global `border-radius: 0 !important` in `app/globals.css`
   catches every element, including third-party CSS. Do not add `rounded-*`.
2. **No blur.** Shadows are hard offsets with zero blur radius. `backdrop-blur`
   is reserved for one meaning — a modal dismissing its background — and is not
   decoration.
3. **Gold is the only saturated colour that means "act on this."** Everything
   else is a *material* (wood, stone, iron, parchment) or *heraldic cloth* (a
   chapter/faction label). A new bright accent competes with the CTA and is the
   most common way to break this system.

Source of truth for tokens is the `@theme` block in `app/globals.css`. Consume
them as Tailwind utilities (`bg-surface`, `text-accent`, `border-line`) or as
`var(--color-*)` in raw CSS. Never hardcode a hex in a component.

## Colour

### Base / identity

| Token | Value | Use |
|---|---|---|
| `bg` | `#000000` | App background |
| `surface` | `#111111` | Cards, panels |
| `surface-2` | `#0d0d0d` | Inset fields, nested surfaces |
| `line` / `line-strong` | white 10% / 20% | Default and emphasised borders |
| `accent` | `#ffc032` | Gold — primary accent and CTA |
| `accent-hover` | `#ffd04c` | CTA hover |
| `accent-deep` | `#ff8c00` | Gradient partner, gold bevel shadow, gold trim |
| `on-accent` | `#111111` | Text on gold |
| `fg` / `fg-muted` / `fg-subtle` | white / `#9ca3af` / `#6b7280` | Text tiers |
| `success` / `danger` / `info` | `#22c55e` / `#ef4444` / `#3b82f6` | Semantic status only |

### Materials

Sampled from the tileset's own biomes (snow forest, grassland camp, woodland,
autumn harvest, castle courtyard, witch dungeon, desert market) and darkened to
sit under white text.

| Token | Value | Use |
|---|---|---|
| `wood` / `wood-light` / `wood-dark` | `#3b2a1a` / `#5c4227` / `#221610` | Frame fill, lit top bevel, shadowed bottom bevel |
| `stone` / `stone-light` | `#1f1c19` / `#2e2823` | Warm quarried block, mortar highlight |
| `iron` / `iron-light` | `#3a3f4a` / `#5b6272` | Controls and fittings, armour highlight |
| `parchment` / `parchment-dim` | `#e9dcb8` / `#cdbc92` | Paper and canvas, paper in shade |
| `on-parchment` | `#3b2a17` | Ink on paper — 8.7:1 |

Two greys on purpose: the courtyard cobble and the knights' armour are cool
blue-grey (`iron`), while plateau and desert rock are warm (`stone`). Wood is a
mid-brown, not a near-black — the fence rails and crates in the art are lighter
than they look at thumbnail size.

The tileset's amber foliage (`#f2c94c`) and lava (`#f0801e`) are already almost
exactly `accent` and `accent-deep`. That is why gold reads as native here, and
why it does not need a partner colour.

### Heraldic cloth

Not invented realm colours — the cloth the art already uses: the dungeon's blue
standard with gold trim, the Skeleton King's crimson cape and the market's
striped awnings, the spruce line, the autumn maples, the imps' violet.

| Token | Value | Reads as |
|---|---|---|
| `heraldry-royal` | `#26356f` | The standard — blue with gold trim |
| `heraldry-crimson` | `#7f2424` | Cape, awning stripe |
| `heraldry-ember` | `#7a3517` | Autumn rust and maple |
| `heraldry-pine` | `#1e4430` | Woodland, spruce shadow |
| `heraldry-arcane` | `#4e3168` | Imps, brews, dungeon magic |

All five clear 6.5:1 against `parchment`, which is the text colour they pair
with. **Chapter and faction plates only, never a CTA.**

`heraldry-royal` carries one extra job: it is the ink for anything sitting on
the white cloud header. Gold on white is 1.7:1 and fails; royal on white is
about 9:1.

### Sky and ground

The page is stacked like one of the game's own screens — a white cloud mass
across the top, starfield in the middle, turf over earth at the bottom.

| Token | Value | Use |
|---|---|---|
| `cloud` | `#ffffff` | Sunlit crown row, **and the header plate itself** |
| `cloud-mid` | `#e8f4fb` | Cloud body |
| `cloud-shade` | `#cfe6f5` | Underside in shade |
| `cloud-deep` | `#b8dcf0` | Base row, the coolest step |
| `grass` / `grass-lit` | `#3f7d33` / `#62b544` | Turf blade, sunlit tip |
| `soil` / `soil-dark` | `#5a3d24` / `#3d2817` | Earth under the turf, deep earth |
| `night` / `night-deep` | `#0b0620` / `#060312` | Starfield ground, and mobile menus |

The four cloud tones are one tone ramp, not four palette entries — always used
in that order, lightest at the top. There is no `sky-bar` or `cloud-lit`; both
were tried and removed.

## Typography

Body is `PatrickHand`; headings are `PatrickHandSC` (set on `body` and `h1–h6`
in globals.css, so you rarely set a family by hand). Those two are the **only**
faces the app ships — both use `font-display: swap` and both are preloaded from
`app/layout.tsx`, since discovering them through globals.css put the body font
612 ms into the critical chain. `BeVietnamPro` and `NotoSans` used to be loaded
here too; they were referenced only by the old error/404 screens, so the faces
(~2.25 MB) and their six `@font-face` rules are gone. Do not add a family
without first checking whether the display face already covers the case.

Base body is 16px minimum — below that, iOS auto-zooms on focus. Body
line-height 1.5–1.75; measure capped at 60–75 characters (`max-w-[70ch]` or
`max-w-3xl`). Use `tabular-nums` for stat columns, prices, and timers so numbers
do not jitter as they change.

Section headers go through `SectionHeading`, which renders an `h2` — the page
`h1` belongs to the hero. Do not skip heading levels.

## Elevation and bevels

The medieval read comes from **bevels**, not gradients: a lit top-left edge and a
shadowed bottom-right one, like a carved plank. Bevels are `inset` box-shadows,
so they cost no extra DOM and never change layout between states.

`--shadow-2xs` through `--shadow-2xl` are redefined as hard offsets
(`1px 1px 0` … `8px 8px 0`, all at `rgb(0 0 0 / 0.6)`), so the stock
`shadow-sm`/`shadow-lg` utilities and colour-modified variants like
`shadow-accent/20` pick up the pixel treatment automatically.

## Utilities

Defined in `app/globals.css`, after Tailwind's layer.

| Class | What it does |
|---|---|
| `pixelated` | Nearest-neighbour image scaling. Required on every sprite or map image. |
| `pixel-frame` / `pixel-frame-gold` | Chunky 2px frame plus hard offset shadow; gold variant for active/CTA panels. |
| `pixel-bevel` | Carved wood plank (fill + lit/shadow insets + drop shadow). |
| `pixel-bevel-iron` | Same geometry in cold iron, for controls and fittings. |
| `pixel-bevel-gold` | The active/legendary variant; pair with `bg-accent`. |
| `pixel-press` | Mechanical press: the element sinks into its own shadow on `:active`. Stepped easing. |
| `pixel-grid` | Faint 32px dungeon-tile lattice for panel interiors. |
| `pixel-scanlines` | CRT overlay for hero/media surfaces. Decorative — pair with `pointer-events-none` + `aria-hidden`. |
| `pixel-rivets` | Four corner studs drawn as background images. Decorative. |
| `stone-wall` | Masonry ground for full-bleed sections. Darker and coarser than `pixel-grid`. |
| `parchment` | The one light surface in the system, with hard-stop fibre speckle. |
| `torch-flicker` | Stepped opacity cycle for light sources (torch flame — override `animation-duration` for a slower beat). Opacity only; disabled under reduced motion. Don't put it behind body copy: the `/story` sun carries the chronicle text and is deliberately static. |
| `cloud-bank` | The cloud lumps hanging off the header's bottom edge. One 64×6 SVG tile repeated at 4×; pair with `h-6`. |
| `turf-strip` / `soil-ground` | The footer's grass blades over earth. `turf-strip` is the blade row, `soil-ground` the fill beneath it. |
| `class-fan` | The fanned class cards on the landing page. Transform/opacity only. |

Two gotchas, both real bugs hit while building this:

- `pixel-bevel-iron` sets its own `background-color` and is defined *after*
  Tailwind's layer, so it out-cascades `group-hover:bg-accent`. If an element
  needs to change fill on hover, use `bg-iron` plus an explicit
  `shadow-[inset_…]` instead of the utility — see `AboutSection`'s pillar icons.
- `pixel-frame` and the bevels both set `box-shadow`. Applying both to one
  element means the last one wins — pick one.

## Primitives

Prefer these over re-deriving the look inline. Each is in `components/ui/`.

- **`Panel`** — the framed surface everything is built from.
  `material="wood" | "iron" | "stone" | "parchment" | "gold"`, optional
  `rivets`, and `as` to render a semantic tag (`article`, `aside`).
- **`Banner`** — hanging heraldic banner for chapter/realm/faction labels.
  `tone="gold" | "royal" | "crimson" | "ember" | "pine" | "arcane" | "iron"`.
  The pennant tail is a `clip-path` notch, not a rotated pseudo-element, so it
  stays crisp at any size; `pennant={false}` for an inline chip. The `BannerTone`
  type is exported — a data file that carries a tone (`GameClass.bannerTone`)
  should import it rather than restate the union and drift from it.
- **`OrnateDivider`** — two accent rules meeting at a diamond lozenge.
  `weight="even" | "left" | "right"` biases the rule lengths so stacked dividers
  do not look mechanically equal. Fully `aria-hidden`.
- **`SectionHeading`** — gold eyebrow flanked by pixel rules, then the `h2`.
  `align="center" | "left"`.
- **`AnimatedButton`** — the *secondary* action, with the arrow-swap hover. The
  primary action is a solid `bg-accent` button (see `HeroSection`). Sizes
  `sm | md | lg`. Pass `className="ab--ink"` when it sits on light ground (the
  white cloud header): that variant swaps the ring/label pair to royal-on-white,
  because the default white ring is invisible there.
- **`BookSpread`** — the open-book shell every `/wiki` codex uses: leather cover,
  two equal leaves, spine, page-stack edges. `BookTab` for the filter tabs down
  the edge, `BookPager` for the centred pagination under the spine,
  `BookPageTitle` for a leaf's heading, `BookStatTable` for stat rows on a leaf.
  Paging swaps the leaf contents with no flip animation — the 3D page-turn that
  used to live here was removed on request.
- **`MoonHeader`** — the page hero for `(main)` pages: `eyebrow` + `icon` + `title`
  and the lede as children, all set *inside* one large pixel moon
  (`/images/ui/moon.svg`). It replaced the `stone-wall` + `pixel-scanlines` band
  that `/content`, `/download`, `/wiki` and `/wiki/classes` each carried a copy
  of. Ink is `heraldry-royal`, never gold — gold on the near-white disc is 1.7:1.
  The `/story` hero is the same recipe with `sun.svg` and `on-parchment` ink; a
  disc is a 32×32 SVG rasterised from a real circle (a coarser grid renders as an
  octagon), absolutely filling an `aspect-square` parent, with the copy at
  `inset-x-[19%] inset-y-[29%]` so the text field scales with the disc.
- **`AuthField`** — the carved input slot plus visible label, helper text, and
  `role="alert"` error used by every `(auth)` form. It owns the
  `autoComplete`/`type` pairing, so credential fields autofill correctly.

One primary CTA per screen. Secondary actions stay visually subordinate:
outlined gold, or iron.

## Accessibility (non-negotiable)

These are the checks this system has already been corrected against, so
regressions here are regressions, not preferences.

- **Contrast** — 4.5:1 for body text, 3:1 for large text. Dimming an inactive
  element to `opacity-40` drops body copy below the floor; 70% is the floor used
  in `FeatureSection`. Prefer swapping to `text-fg-muted` over lowering opacity.
- **Focus** — a global `:focus-visible` gold ring at 2px with 2px offset lives in
  globals.css. Never remove it.
- **Touch targets** — 44×44 minimum with 8px between. `h-11 w-11` is the house
  size for icon buttons; `p-2` around a 24px icon is 40px and too small.
- **Colour is never the only signal** — stat bars carry an icon and a number;
  status carries text.
- **Icon-only controls need `aria-label`**; decorative icons and ornaments need
  `aria-hidden="true"`.
- **Labels are visible**, not placeholders standing in for them. Errors sit below
  their field.
- **Reduced motion** — a `prefers-reduced-motion` block neutralises animation and
  transition durations globally. Anything motion-heavy (the hero video) must also
  self-disable via `motion-reduce:hidden`.
- Use SVG icons from **Lucide**, the set the app already uses. Never emoji.

## Motion

150–300ms for micro-interactions, ≤400ms for larger transitions. Animate
`transform` and `opacity` only — never `width`, `height`, `top`, or `left`.

The pixel constraint adds one rule: **no smooth zooms**. A `scale(1.05)` on hover
is the clearest modern-web tell there is. Use `pixel-press` (a stepped positional
sink), a crossfade, or a stepped opacity cycle instead. `steps()` easing makes a
change read as a sprite swap rather than a tween.

## Layout

Mobile-first. Section padding scales `px-4 py-20` → `sm:px-6 sm:py-24` →
`lg:px-8 lg:py-28`; containers cap at `max-w-5xl`/`max-w-7xl`. Spacing follows
the 4px scale. Use `min-h-dvh`, not `100vh`. `[id] { scroll-margin-top: 6rem }`
keeps in-page anchors clear of the fixed header.

## Applying this to a new page

Work outward from the material, in this order:

1. Pick the ground: `stone-wall` for a full-bleed section, `pixel-grid` for a
   panel interior, plain `bg-bg` otherwise.
2. Put content in a `Panel`. Wood is the default; `parchment` when the content is
   long-form lore and legibility matters most.
3. Label it with `SectionHeading`, and a `Banner` if it belongs to a realm or
   faction.
4. Add exactly one gold CTA. Everything else is outlined or iron.
5. Separate blocks with `OrnateDivider` rather than a hairline `border-t`.

Verify with `npm run build` and `npm run lint`. Built CSS lands in
`.next/static/chunks/*.css` (not `.next/static/css`) if you need to confirm a
token actually emitted.
