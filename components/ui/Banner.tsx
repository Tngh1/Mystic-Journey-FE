import type { ReactNode } from "react";

/* Exported so data files can declare a tone without restating the union and
   drifting from it — see GameClass.bannerTone in lib/data/classes.ts. */
export type BannerTone = "gold" | "gilt" | "royal" | "crimson" | "ember" | "pine" | "arcane" | "iron";

interface BannerProps {
  children: ReactNode;
  /** Heraldic cloth colour. Gold is the brand default; the rest label chapters
   *  and factions only — never a call to action. */
  tone?: BannerTone;
  /** Notch the bottom edge into a pennant tail. Off for inline chips. */
  pennant?: boolean;
  className?: string;
}

/* Gold carries the trim the dungeon standard has in the art, so its border is
   the deep gold rather than black; the cloth tones sit on a black stitch. */
const TONE_CLASSES: Record<BannerTone, string> = {
  gold: "bg-accent text-on-accent border-accent-deep",
  // Deep gold trim on a black stitch, not the CTA gold. This is what a
  // legendary rarity plate hangs on: gilt reads as precious without reading as
  // "click me", which `gold` would.
  gilt: "bg-accent-deep text-on-accent border-black/60",
  royal: "bg-heraldry-royal text-parchment border-accent-deep",
  crimson: "bg-heraldry-crimson text-parchment border-black/60",
  ember: "bg-heraldry-ember text-parchment border-black/60",
  pine: "bg-heraldry-pine text-parchment border-black/60",
  arcane: "bg-heraldry-arcane text-parchment border-black/60",
  iron: "pixel-bevel-iron text-fg border-black/60",
};

/**
 * A hanging heraldic banner used for chapter/realm/faction labels.
 *
 * The pennant tail is a clip-path notch rather than a rotated pseudo-element,
 * so it costs no extra node and stays crisp at any size. Parchment-on-cloth is
 * the text pairing for the dark tones (≥7:1); gold keeps the ink token.
 */
export default function Banner({
  children,
  tone = "gold",
  pennant = true,
  className = "",
}: BannerProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center border-2 px-3 pt-1 text-xs font-bold uppercase tracking-widest shadow-md",
        pennant ? "pb-3" : "pb-1",
        TONE_CLASSES[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        pennant
          ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 7px), 0 100%)" }
          : undefined
      }
    >
      {children}
    </span>
  );
}
