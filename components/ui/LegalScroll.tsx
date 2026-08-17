import type { ReactNode } from "react";


// Renders the rod reusable UI component.
// Features: applies customizable style variants and responsive CSS classes; renders child component slots dynamically.
// Returns the styled JSX element.
function Rod() {
  return (
    <div className="flex items-center" aria-hidden="true">
      <span className="h-3.5 w-4 border-2 border-black/60 bg-iron-light shadow-[inset_-1px_-1px_0_rgb(0_0_0_/_0.5)]" />
      <span className="h-4 flex-1 border-y-2 border-black/60 bg-iron-dark shadow-[inset_0_2px_0_rgb(91_98_114_/_0.40)]" />
      <span className="h-3.5 w-4 border-2 border-black/60 bg-iron-light shadow-[inset_-1px_-1px_0_rgb(0_0_0_/_0.5)]" />
    </div>
  );
}

// Renders the scroll reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
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

// Renders the clause reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
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
        <span
          className="flex h-8 w-8 shrink-0 translate-y-1 items-center justify-center bg-on-parchment text-sm font-black tabular-nums text-parchment"
          aria-hidden="true"
        >
          {n}
        </span>
        {title}
      </h2>
      <span className="mt-3 mb-5 block h-0.5 w-full bg-on-parchment/25" aria-hidden="true" />
      <div className="max-w-[74ch] space-y-4 text-[15px] leading-[1.85] sm:text-base">
        {children}
      </div>
    </section>
  );
}

// Renders the provisions reusable UI component.
// Returns the styled JSX element.
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

// Renders the note reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="border-2 border-on-parchment/20 bg-parchment-dim/60 px-4 py-3.5 shadow-[inset_2px_2px_0_rgb(59_42_23_/_0.10)]">
      {children}
    </p>
  );
}
