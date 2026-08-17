import type { ReactNode } from "react";

export type BannerTone = "gold" | "gilt" | "royal" | "crimson" | "ember" | "pine" | "arcane" | "iron";

interface BannerProps {
  children: ReactNode;
  tone?: BannerTone;
  pennant?: boolean;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}

const TONE_CLASSES: Record<BannerTone, string> = {
  gold: "bg-accent text-on-accent border-accent-deep",
  gilt: "bg-accent-deep text-on-accent border-black/60",
  royal: "bg-heraldry-royal text-parchment border-accent-deep",
  crimson: "bg-heraldry-crimson text-parchment border-black/60",
  ember: "bg-heraldry-ember text-parchment border-black/60",
  pine: "bg-heraldry-pine text-parchment border-black/60",
  arcane: "bg-heraldry-arcane text-parchment border-black/60",
  iron: "pixel-bevel-iron text-fg border-black/60",
};

// Renders the banner reusable UI component.
// Features: applies customizable style variants and responsive CSS classes; renders child component slots dynamically.
// Returns the styled JSX element.
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
