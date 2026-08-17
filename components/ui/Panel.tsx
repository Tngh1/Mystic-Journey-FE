import type { ElementType, HTMLAttributes, ReactNode } from "react";

type PanelMaterial = "wood" | "iron" | "plate" | "stone" | "parchment" | "gold";

interface PanelProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  material?: PanelMaterial;
  rivets?: boolean;
  as?: ElementType;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}

const MATERIAL_CLASSES: Record<PanelMaterial, string> = {
  wood: "pixel-bevel border-2 border-wood-dark text-fg",
  iron: "pixel-bevel-iron border-2 border-black/60 text-fg",
  plate: "pixel-bevel-plate border-2 border-black/60 text-fg",
  stone: "stone-wall border-2 border-black/60 shadow-lg text-fg",
  parchment: "parchment border-2 border-wood shadow-lg",
  gold: "pixel-bevel-gold border-2 border-accent bg-accent text-on-accent",
};

// Renders the panel reusable UI component.
// Features: applies customizable style variants and responsive CSS classes; renders child component slots dynamically.
// Returns the styled JSX element.
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
