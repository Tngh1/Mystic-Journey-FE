import type { ElementType, HTMLAttributes, ReactNode } from "react";

type PanelMaterial = "wood" | "iron" | "plate" | "stone" | "parchment" | "gold";

/* Extends the plain HTML attributes so a panel can carry the ARIA a live region
   needs (`role="alert"`, `aria-busy`) without a prop per attribute. */
interface PanelProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Which material the frame is carved from. Defaults to aged wood. */
  material?: PanelMaterial;
  /** Corner studs. Decorative — omit on small/dense panels where they crowd. */
  rivets?: boolean;
  /** Render as something other than a div (e.g. "article", "aside"). */
  as?: ElementType;
  className?: string;
}

/**
 * The framed surface every medieval panel is built from: a bevelled plank with
 * a lit top-left edge and a shadowed bottom-right one, plus the hard offset
 * shadow the pixel system uses everywhere.
 *
 * Bevels come from inset box-shadows rather than extra border widths, so
 * hover/active states can't shift layout — see `layout-shift-avoid`.
 */
const MATERIAL_CLASSES: Record<PanelMaterial, string> = {
  wood: "pixel-bevel border-2 border-wood-dark text-fg",
  iron: "pixel-bevel-iron border-2 border-black/60 text-fg",
  // The admin keep's surface: rolled steel on the forge floor. Darker and cooler
  // than `iron`, which stays the material for buttons and small fittings sitting
  // *on* a plate panel — a plate button on a plate panel would vanish.
  plate: "pixel-bevel-plate border-2 border-black/60 text-fg",
  // Stone panels sit on the masonry ground and only need a hard edge; the
  // wall texture already reads as carved, so a bevel on top muddies it.
  stone: "stone-wall border-2 border-black/60 shadow-lg text-fg",
  parchment: "parchment border-2 border-wood shadow-lg",
  gold: "pixel-bevel-gold border-2 border-accent bg-accent text-on-accent",
};

export default function Panel({
  children,
  material = "wood",
  rivets = false,
  as: Tag = "div",
  className = "",
  ...rest
}: PanelProps) {
  return (
    <Tag
      {...rest}
      className={[
        MATERIAL_CLASSES[material],
        rivets ? "pixel-rivets" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
