import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/* The page header as a pixel moon, the night counterpart of the /story sun.
   Four pages carried the same stone-wall band (masonry ground + scanlines + a
   gold eyebrow on black), which read as a web page header rather than anything
   from the game; the title now sits inside one large sprite instead of on top
   of a UI strip. One component rather than four copies, since the four bands
   were already identical apart from their words.

   Ink is `heraldry-royal`, not gold: gold on the near-white disc is 1.7:1 and
   fails, royal is about 9:1 — the same rule the white cloud header follows.
   No flicker either; this disc carries body copy, and pulsing the text's own
   background is where the torch-flicker cycle hurts legibility. */
export default function MoonHeader({
  eyebrow,
  icon: Icon,
  title,
  children,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  /** The lede, inside the disc under the rule. */
  children: ReactNode;
}) {
  return (
    <header className="relative px-4 py-10 md:py-14">
      {/* Square so the moon stays round, and capped so the text band inside it
          never gets wider than a readable measure. The cap used to be 40rem,
          which filled the viewport and read as a splash screen rather than a
          page header; 30rem still leaves the middle band wide enough for the
          title to break at two lines. */}
      <div className="relative mx-auto aspect-square w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[30rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ui/moon.svg"
          alt=""
          aria-hidden="true"
          className="pixelated pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* The copy sits in the disc's flat middle band, inset horizontally by
            a fifth so it clears the stepped left and right edges. Percentages,
            not padding, so the field scales with the moon at every breakpoint. */}
        <div className="absolute inset-x-[19%] inset-y-[29%] flex flex-col items-center justify-center text-center text-heraldry-royal">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] md:text-xs">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {eyebrow}
          </p>

          <h1 className="mt-1.5 text-base leading-none font-bold sm:text-xl md:text-3xl">
            {title}
          </h1>

          {/* Royal rule rather than OrnateDivider: the divider is gold, and
              gold on the pale disc is invisible. */}
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
