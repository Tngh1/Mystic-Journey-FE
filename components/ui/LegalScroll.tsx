import type { ReactNode } from "react";

/* The legal pages as a scroll on an iron rod.

   /terms and /privacy-policy were the last two surfaces still off the token
   system entirely: `#111111` cards at `rounded-3xl`, `#ffc032` written out
   twenty times by hand, and blue/purple/amber/red-500 sigil pads that belong to
   no material here. They were also the only pages carrying 2,000 words of body
   copy on a near-black ground at white/80 — the least legible block in the whole
   portal, on the two pages people actually have to read.

   So the charter goes onto parchment, which is what a charter is written on and
   the one light surface in the system: ink on paper is 8.7:1. The sheet hangs
   from an iron rod at the head and is weighted by another at the foot, and each
   clause is numbered in an inked square so the ordinal is scannable without
   colour doing the work.

   Both pages are the same document with different words, so this is one file:
   Scroll for the sheet, Clause for a numbered article, Provisions for a bulleted
   list, Note for a block that wants setting apart from the running text.

   Nothing gold anywhere inside the sheet — gold on parchment is 1.7:1 and
   fails. Ink, or crimson at ~6:1, and the page's gold link sits below the sheet
   on the dark ground where it reads. */

/* The rod: a steel bar with turned caps overhanging both edges of the sheet. */
function Rod() {
  return (
    <div className="flex items-center" aria-hidden="true">
      <span className="h-3.5 w-4 border-2 border-black/60 bg-iron-light shadow-[inset_-1px_-1px_0_rgb(0_0_0_/_0.5)]" />
      <span className="h-4 flex-1 border-y-2 border-black/60 bg-iron-dark shadow-[inset_0_2px_0_rgb(91_98_114_/_0.40)]" />
      <span className="h-3.5 w-4 border-2 border-black/60 bg-iron-light shadow-[inset_-1px_-1px_0_rgb(0_0_0_/_0.5)]" />
    </div>
  );
}

/** The hanging sheet. `.parchment` carries its own ink colour, so body copy
 *  inside inherits 8.7:1 without a text class on every paragraph. */
export function Scroll({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[68rem] px-4 pb-14 md:px-6">
      <Rod />
      <article className="parchment border-x-2 border-wood px-5 py-9 shadow-lg sm:px-10 sm:py-12 md:px-14">
        {children}
      </article>
      <Rod />
    </div>
  );
}

/** One numbered article of the charter. */
export function Clause({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="flex items-baseline gap-3 text-xl font-black text-on-parchment sm:text-2xl">
        {/* The ordinal, struck rather than tinted: dark square, pale figure. */}
        <span
          className="flex h-8 w-8 shrink-0 translate-y-1 items-center justify-center bg-on-parchment text-sm font-black tabular-nums text-parchment"
          aria-hidden="true"
        >
          {n}
        </span>
        {title}
      </h2>
      {/* Ruled line under the head — parchment carries no machine borders. */}
      <span className="mt-3 mb-5 block h-0.5 w-full bg-on-parchment/25" aria-hidden="true" />
      {/* 1.85 leading and a ~72ch measure: this is the longest copy on the site. */}
      <div className="max-w-[74ch] space-y-4 text-[15px] leading-[1.85] sm:text-base">
        {children}
      </div>
    </section>
  );
}

/** A bulleted list of provisions. Marker is an inked lozenge, not a gold arrow. */
export function Provisions({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-heraldry-crimson"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A passage set apart from the running text — sunk one step into the sheet. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="border-2 border-on-parchment/20 bg-parchment-dim/60 px-4 py-3.5 shadow-[inset_2px_2px_0_rgb(59_42_23_/_0.10)]">
      {children}
    </p>
  );
}
