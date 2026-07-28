import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Panel from "./Panel";

/* The whole of /content as the thing the page actually is: a herald's notice
   board — a log frame standing in the ground, planks between the uprights, a
   small parchment title plate nailed at the top, and every posted notice nailed
   up on the same planks under it, so the board grows taller as the list grows
   instead of the list sitting on the page below a sign.

   Built from the timber-framed board reference rather than a roofed kiosk: one
   overhanging top beam, two upright logs the board is nailed between, a lower
   brace and two legs. The earlier shingle roof made the header the largest thing
   on the page; the title is a plate now, sized to its own text, so the notices
   are what the board is carrying.

   Same idiom as ChapterFrame and the heraldic sprites: stacked hard-edged
   courses in existing tokens, lit on one edge, darker toward the bottom. Frame
   and legs are decoration, so they are aria-hidden; the h1 and the lede are
   ordinary text on the plate.

   Ink is `on-parchment` (8.7:1 on the sheet). Gold is not used for the copy —
   it stays the CTA colour — and the eyebrow reads as a heading by weight and
   tracking rather than by hue. */

const OUTLINE = "border-black/60";

/** A log seen end-on along its length: bands of grain tiled by gradient. */
const GRAIN =
  "bg-[repeating-linear-gradient(90deg,rgb(0_0_0_/_0.18)_0_2px,transparent_2px_22px)]";

function Beam({ w, h, fill }: { w: string; h: string; fill: string }) {
  return (
    <span
      className={`block border-2 ${OUTLINE} ${w} ${h} ${fill} ${GRAIN} shadow-[inset_0_2px_0_var(--color-wood-light),inset_0_-2px_0_var(--color-wood-dark)]`}
    />
  );
}

/** One of the two uprights the board is nailed between, lit on one side. */
function Upright() {
  return (
    <span
      className={`w-4 shrink-0 border-2 ${OUTLINE} bg-wood shadow-[inset_2px_0_0_var(--color-wood-light),inset_-2px_0_0_var(--color-wood-dark)] sm:w-6`}
      aria-hidden="true"
    />
  );
}

/**
 * The board itself with nothing posted on it: top beam, planks between two
 * uprights, lower brace, legs. Exported because /content/[id] is the same
 * board carrying one notice instead of a list — the two pages should read as
 * the same object, not as two takes on it.
 */
export function BoardFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      {/* Top beam, overhanging the uprights the way the cut log does. */}
      <div className="flex justify-center" aria-hidden="true">
        <Beam w="w-full" h="h-3.5 md:h-4" fill="bg-wood-light" />
      </div>

      {/* Board nailed between two uprights, inset so the beam above and the
          brace below both overhang it. */}
      <div className="mx-auto flex w-[97%] items-stretch">
        <Upright />

        {/* `rivets` are the four nail heads; Panel owns the plank bevel and the
            hard shadow. `min-w-0` so a long unbroken string inside a notice
            can't widen the planks. */}
        <Panel material="wood" rivets className="min-w-0 flex-1 p-3 shadow-lg md:p-4">
          {children}
        </Panel>

        <Upright />
      </div>

      <div className="flex justify-center" aria-hidden="true">
        <Beam w="w-full" h="h-3 md:h-3.5" fill="bg-wood" />
      </div>

      {/* The legs. Explicit height: Upright sizes to its flex row, and this row
          has no content of its own to stretch against. */}
      <div className="mx-auto flex h-8 w-[97%] justify-between md:h-10" aria-hidden="true">
        <Upright />
        <Upright />
      </div>
    </div>
  );
}

export default function NoticeBoard({
  eyebrow,
  icon: Icon,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  /** The lede, under the title on the plate. */
  lede: ReactNode;
  /** What is nailed to the board under the title — the notices themselves. */
  children?: ReactNode;
}) {
  return (
    /* `mt-auto` and no bottom padding: inside a full-height flex column the
       board sinks to the bottom of a short page, so its legs end in the
       footer's turf strip (which overhangs the seam by 16px) rather than
       stopping over empty sky. On a long list this is a no-op. */
    <section className="relative mt-auto px-4 pt-10 md:pt-14">
      <div className="mx-auto w-full max-w-[64rem]">
        <BoardFrame>
          {/* The title plate: a small parchment sign sized to its own text, not
              a full-width panel. Centred rather than stretched, so it reads as
              one notice among the others rather than a page header. */}
          <div className="flex justify-center">
            <div className="parchment inline-block max-w-full border-2 border-wood-dark px-5 py-3 text-center text-on-parchment shadow-[inset_0_0_0_2px_rgb(0_0_0_/_0.12)] md:px-8 md:py-4">
              <p className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em]">
                <Icon className="h-3 w-3" aria-hidden="true" />
                {eyebrow}
              </p>

              <h1 className="text-lg leading-tight font-bold sm:text-xl md:text-2xl">{title}</h1>

              <p className="mx-auto max-w-[46ch] text-[11px] leading-snug text-on-parchment/85 sm:text-xs">
                {lede}
              </p>
            </div>
          </div>

          {/* Everything posted under the title, on the same planks. */}
          {children && <div className="mt-3 min-w-0 md:mt-4">{children}</div>}
        </BoardFrame>
      </div>
    </section>
  );
}
