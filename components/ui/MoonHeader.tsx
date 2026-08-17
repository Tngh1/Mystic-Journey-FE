import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// Renders the moon header reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
export default function MoonHeader({
  eyebrow,
  icon: Icon,
  title,
  children,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="relative px-4 py-10 md:py-14">
      <div className="relative mx-auto aspect-square w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[30rem]">
        <img
          src="/images/ui/moon.svg"
          alt=""
          aria-hidden="true"
          className="pixelated pointer-events-none absolute inset-0 h-full w-full"
        />

        <div className="absolute inset-x-[19%] inset-y-[29%] flex flex-col items-center justify-center text-center text-heraldry-royal">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] md:text-xs">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {eyebrow}
          </p>

          <h1 className="mt-1.5 text-base leading-none font-bold sm:text-xl md:text-3xl">
            {title}
          </h1>

          <span
            className="my-2 h-0.5 w-16 bg-heraldry-royal/40 md:my-3 md:w-24"
            aria-hidden="true"
          />

          <p className="max-w-[34ch] text-[11px] leading-snug text-heraldry-royal/85 sm:text-sm md:text-base md:leading-relaxed">
            {children}
          </p>
        </div>
      </div>
    </header>
  );
}
