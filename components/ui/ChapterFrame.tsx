import type { HTMLAttributes, ReactNode } from "react";

/* The chapter board on /story, rebuilt as the realm it describes.

   Every chapter used to sit in the same oak Panel, so the four realms were told
   apart by a 16px glyph and a cloth colour. Now the whole enclosure changes: the
   Elf Forest chapters are read under a canopy between two bark trunks standing in
   soil; Autumn Pumpkin is read inside the gourd, ribbed rind on both sides and
   the stem overhead; Frozen Mountain is a pillar of ice with peaks on top and
   icicles hanging under them; Abandoned Castle is a battlemented curtain wall
   between two towers with the gate at its foot.

   Each frame is the same three parts — crown, two rails, base — so the reading
   surface inside is identical everywhere and only the enclosure differs. All of
   it is stacked hard-edged courses in existing tokens: nothing curves, nothing
   blurs, and the structure is aria-hidden because the location and level are
   already stated in text inside. */

export type Realm = "forest" | "pumpkin" | "frozen" | "castle";

const OUTLINE = "border-black/60";

/** One course of the crown or base: a band with the system's black outline. */
function Course({ w, h, fill, extra = "" }: { w: string; h: string; fill: string; extra?: string }) {
  return <span className={`block border-2 ${OUTLINE} ${w} ${h} ${fill} ${extra}`} />;
}

/* ── Elf Forest ──────────────────────────────────────────────────────────
   Canopy stepping out to the full width of the board, bark trunks down both
   sides, roots in the soil under it. */

const forest = {
  fill: "bg-heraldry-pine",
  Crown: () => (
    <div className="flex flex-col items-center" aria-hidden="true">
      <Course w="w-20" h="h-3" fill="bg-grass-lit" />
      <Course w="w-2/5" h="h-3" fill="bg-grass-lit" />
      <Course w="w-3/5" h="h-3" fill="bg-grass" />
      <Course w="w-4/5" h="h-3" fill="bg-grass" />
      <Course w="w-full" h="h-4" fill="bg-heraldry-pine" />
    </div>
  ),
  /** Bark: oak lit on one side, shadowed on the other, with knots down it. */
  Rail: () => (
    <span
      className={`flex w-5 shrink-0 flex-col items-center justify-around border-x-2 ${OUTLINE} bg-wood shadow-[inset_2px_0_0_var(--color-wood-light),inset_-2px_0_0_var(--color-wood-dark)] sm:w-7`}
      aria-hidden="true"
    >
      <span className={`h-2 w-2 border-2 ${OUTLINE} bg-wood-dark`} />
      <span className={`h-2 w-2 border-2 ${OUTLINE} bg-wood-dark`} />
      <span className={`h-2 w-2 border-2 ${OUTLINE} bg-wood-dark`} />
    </span>
  ),
  Base: () => (
    <div className="flex flex-col items-center" aria-hidden="true">
      <Course w="w-full" h="h-3" fill="bg-soil" />
      <Course w="w-4/5" h="h-3" fill="bg-soil-dark" />
      <Course w="w-2/5" h="h-2" fill="bg-soil-dark" />
    </div>
  ),
};

/* ── Autumn Pumpkin ──────────────────────────────────────────────────────
   Read from inside the gourd: stem and leaf overhead, ribbed rind down both
   sides, the shell closing under it. Terracotta, not gold — gold on this site
   means "act on this", and the page's one gold thing is Play Now. */

const RIND = "shadow-[inset_0_3px_0_rgb(255_255_255_/_0.12),inset_0_-3px_0_rgb(0_0_0_/_0.25)]";

const pumpkin = {
  fill: "bg-heraldry-ember",
  Crown: () => (
    <div className="flex flex-col items-center" aria-hidden="true">
      <Course w="w-3" h="h-4" fill="bg-heraldry-pine" />
      <Course w="w-10" h="h-2.5" fill="bg-heraldry-pine" />
      <Course w="w-2/5" h="h-3" fill="bg-clay-light" extra={RIND} />
      <Course w="w-3/4" h="h-3" fill="bg-clay-light" extra={RIND} />
      <Course w="w-full" h="h-4" fill="bg-clay" extra={RIND} />
    </div>
  ),
  /** The rind, ribbed by two sunk bands so the wall reads as a curved shell. */
  Rail: () => (
    <span
      className={`w-5 shrink-0 border-x-2 ${OUTLINE} bg-clay shadow-[inset_4px_0_0_var(--color-clay-light),inset_-4px_0_0_var(--color-clay-dark)] sm:w-7`}
      aria-hidden="true"
    />
  ),
  Base: () => (
    <div className="flex flex-col items-center" aria-hidden="true">
      <Course w="w-full" h="h-4" fill="bg-clay" extra={RIND} />
      <Course w="w-3/4" h="h-3" fill="bg-clay-dark" extra={RIND} />
      <Course w="w-2/5" h="h-2.5" fill="bg-clay-dark" />
    </div>
  ),
};

/* ── Frozen Mountain ────────────────────────────────────────────────────
   A pillar of ice: snow peaks on top, a row of icicles hanging under the cap,
   ice columns down the sides, and a drift banked at the foot. The icicles are a
   repeating gradient so the row tiles at any width instead of assuming one. */

const frozen = {
  fill: "bg-heraldry-royal",
  Crown: () => (
    <div className="flex flex-col items-center" aria-hidden="true">
      <Course w="w-12" h="h-3" fill="bg-cloud" />
      <Course w="w-2/5" h="h-3" fill="bg-cloud" />
      <Course w="w-3/4" h="h-3" fill="bg-cloud-shade" />
      <Course w="w-full" h="h-4" fill="bg-cloud-deep" />
      {/* Icicles, hanging off the cap. */}
      <span
        className="block h-3 w-full bg-[repeating-linear-gradient(90deg,var(--color-cloud)_0_6px,transparent_6px_18px)]"
      />
    </div>
  ),
  Rail: () => (
    <span
      className={`w-5 shrink-0 border-x-2 ${OUTLINE} bg-cloud-deep shadow-[inset_3px_0_0_var(--color-cloud),inset_-3px_0_0_var(--color-heraldry-royal)] sm:w-7`}
      aria-hidden="true"
    />
  ),
  Base: () => (
    <div className="flex flex-col items-center" aria-hidden="true">
      <Course w="w-full" h="h-4" fill="bg-cloud-deep" />
      <Course w="w-4/5" h="h-3" fill="bg-cloud-shade" />
      <Course w="w-1/2" h="h-2.5" fill="bg-cloud" />
    </div>
  ),
};

/* ── Abandoned Castle ───────────────────────────────────────────────────
   Curtain wall between two towers: merlons along the wall-walk, arrow slits down
   each tower, and the gate standing open in the plinth. Merlons tile by
   gradient for the same reason the icicles do. */

const castle = {
  fill: "bg-stone",
  Crown: () => (
    <div className="flex flex-col items-center" aria-hidden="true">
      <span
        className="block h-4 w-full bg-[repeating-linear-gradient(90deg,var(--color-stone-light)_0_14px,transparent_14px_28px)]"
      />
      <Course w="w-full" h="h-5" fill="bg-stone-light" />
    </div>
  ),
  /** A tower, with slits punched down it. */
  Rail: () => (
    <span
      className={`flex w-5 shrink-0 flex-col items-center justify-around border-x-2 ${OUTLINE} bg-stone-light shadow-[inset_3px_0_0_rgb(255_255_255_/_0.08),inset_-3px_0_0_rgb(0_0_0_/_0.35)] sm:w-7`}
      aria-hidden="true"
    >
      <span className={`h-4 w-1.5 border-2 ${OUTLINE} bg-iron-dark`} />
      <span className={`h-4 w-1.5 border-2 ${OUTLINE} bg-iron-dark`} />
      <span className={`h-4 w-1.5 border-2 ${OUTLINE} bg-iron-dark`} />
    </span>
  ),
  Base: () => (
    <div className="flex flex-col items-center" aria-hidden="true">
      <Course w="w-full" h="h-5" fill="bg-stone-light" />
      {/* The gate, standing open. */}
      <Course w="w-16" h="h-4" fill="bg-iron-dark" />
    </div>
  ),
};

const FRAMES = { forest, pumpkin, frozen, castle } as const;

export default function ChapterFrame({
  realm,
  children,
  ...rest
}: { realm: Realm; children: ReactNode } & HTMLAttributes<HTMLElement>) {
  const { Crown, Rail, Base, fill } = FRAMES[realm];
  return (
    <article {...rest}>
      <Crown />
      <div className="flex items-stretch">
        <Rail />
        <div className={`min-w-0 flex-1 border-y-2 ${OUTLINE} ${fill}`}>{children}</div>
        <Rail />
      </div>
      <Base />
    </article>
  );
}
