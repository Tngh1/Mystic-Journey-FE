import type { HTMLAttributes, ReactNode } from "react";


export type Realm = "forest" | "pumpkin" | "frozen" | "castle";

const OUTLINE = "border-black/60";

// Renders the course reusable UI component.
// Returns the styled JSX element.
function Course({ w, h, fill, extra = "" }: { w: string; h: string; fill: string; extra?: string }) {
  return <span className={`block border-2 ${OUTLINE} ${w} ${h} ${fill} ${extra}`} />;
}


// Helper function executing forest.
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


const RIND = "shadow-[inset_0_3px_0_rgb(255_255_255_/_0.12),inset_0_-3px_0_rgb(0_0_0_/_0.25)]";

// Helper function executing pumpkin.
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


// Helper function executing frozen.
const frozen = {
  fill: "bg-heraldry-royal",
  Crown: () => (
    <div className="flex flex-col items-center" aria-hidden="true">
      <Course w="w-12" h="h-3" fill="bg-cloud" />
      <Course w="w-2/5" h="h-3" fill="bg-cloud" />
      <Course w="w-3/4" h="h-3" fill="bg-cloud-shade" />
      <Course w="w-full" h="h-4" fill="bg-cloud-deep" />
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


// Helper function executing castle.
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
      <Course w="w-16" h="h-4" fill="bg-iron-dark" />
    </div>
  ),
};

// Renders the frames reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
const FRAMES = { forest, pumpkin, frozen, castle } as const;

// Renders the chapter frame reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
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
