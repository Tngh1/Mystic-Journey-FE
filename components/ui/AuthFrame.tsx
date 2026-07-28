import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/* The gatehouse register as a hung banner, cut for this particular sky.

   The art is a wide vista: night at the top, a bright gold sunset band through
   the middle, a dark foreground bluff with the three heroes on it. Two things
   follow from that. A dark object reads best where the picture is brightest, so
   the form is dark steel-blue wool and hangs *through* the sunset band rather
   than sitting under it. And the bluff is the one part of the picture with
   characters in it, so nothing covers it — the banner drops from the rod at the
   top and stops short, leaving the ground in view.

   Steel-blue against a gold sunset is the complement of the picture's own
   palette, which is why the cloth is `iron-dark` and not wood: wood would sit
   in the same warm family as the sky and go muddy against it.

   Everything on the cloth is dark-surface, so AuthField's parchment-on-dark
   colours and its whole a11y contract are untouched. Fields sit straight on the
   wool — no inner panel — because the cloth is already the surface.

   Built the way the rest of the sprite work is: stacked hard-edged courses with
   `border-2 border-black/60` outlines, lit on the top edge, no curves, no blur.
   The swallowtail is three stepping courses rather than a clip-path, so it keeps
   its outline and works at any width. */

const OUTLINE = "border-black/60";

/* Woven wool: 2px warp lines on a 7px repeat, so the cloth still reads as
   fabric whatever width the container ends up. */
const WEAVE =
  "bg-[repeating-linear-gradient(90deg,rgb(255_255_255_/_0.035)_0_2px,transparent_2px_7px)]";

const TAIL = `mx-auto block border-x-2 border-b-2 ${OUTLINE} bg-iron-dark ${WEAVE}`;

/* Stitched seam — a dark groove with a lit thread under it. */
function Seam() {
  return (
    <span
      className="block h-0.5 bg-black/55 shadow-[0_2px_0_rgb(233_220_184_/_0.1)]"
      aria-hidden="true"
    />
  );
}

export default function AuthFrame({
  eyebrow,
  icon: Icon,
  title,
  lede,
  children,
  footer,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  /** One line under the title. */
  lede?: ReactNode;
  /** The form itself, straight on the cloth. */
  children: ReactNode;
  /** The way out — "no account yet?" and friends, stitched above the tail. */
  footer?: ReactNode;
}) {
  return (
    <div className="w-full">
      {/* The rod. Overhangs the cloth on both sides and is capped, so the cloth
          reads as hanging from it rather than as a box with a lid. */}
      <div className="-mx-4 flex items-stretch sm:-mx-6" aria-hidden="true">
        <span className={`h-4 w-3 border-2 ${OUTLINE} bg-iron-light`} />
        <span
          className={`h-4 flex-1 border-y-2 ${OUTLINE} bg-iron shadow-[inset_0_2px_0_var(--color-iron-light)]`}
        />
        <span className={`h-4 w-3 border-2 ${OUTLINE} bg-iron-light`} />
      </div>

      {/* Two rings carrying it at the corners. */}
      <div className="flex justify-between px-8 sm:px-12" aria-hidden="true">
        <span className={`h-3 w-3 border-2 ${OUTLINE} bg-iron-light`} />
        <span className={`h-3 w-3 border-2 ${OUTLINE} bg-iron-light`} />
      </div>

      {/* The cloth. No bottom border — the tail below continues the outline. */}
      <div
        className={`relative border-2 border-b-0 ${OUTLINE} bg-iron-dark ${WEAVE} shadow-[6px_6px_0_rgb(0_0_0_/_0.5)]`}
      >
        <div
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_2px_rgb(233_220_184_/_0.08)]"
          aria-hidden="true"
        />

        <div className="relative min-w-0 space-y-4 p-4 md:space-y-5 md:p-5">
          {/* The charge: the page's device, punched into the wool. */}
          <div className="space-y-1.5 text-center">
            <span
              className={`mx-auto flex h-10 w-10 items-center justify-center border-2 ${OUTLINE} bg-black/40 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.5)]`}
            >
              <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
            </span>

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-parchment-dim">
              {eyebrow}
            </p>

            <h1 className="text-xl font-bold leading-tight text-parchment md:text-2xl">{title}</h1>

            {lede && (
              <p className="mx-auto max-w-[42ch] text-xs leading-snug text-parchment-dim">{lede}</p>
            )}
          </div>

          <Seam />

          {children}

          {footer && (
            <>
              <Seam />
              <p className="text-center text-sm text-parchment-dim">{footer}</p>
            </>
          )}
        </div>
      </div>

      {/* Swallowtail, stepping to a point. */}
      <div aria-hidden="true">
        <span className={`${TAIL} h-2 w-[78%]`} />
        <span className={`${TAIL} h-2 w-[48%]`} />
        <span className={`${TAIL} h-2 w-[20%]`} />
      </div>
    </div>
  );
}
