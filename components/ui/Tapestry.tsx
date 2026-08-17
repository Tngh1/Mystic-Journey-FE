import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type TapestryDye = "royal" | "crimson" | "pine" | "arcane" | "ember";


const DYE_CLASSES: Record<TapestryDye, string> = {
  royal: "bg-heraldry-royal",
  crimson: "bg-heraldry-crimson",
  pine: "bg-heraldry-pine",
  arcane: "bg-heraldry-arcane",
  ember: "bg-heraldry-ember",
};

interface TapestryProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  children: ReactNode;
  title?: ReactNode;
  icon?: ReactNode;
  meta?: ReactNode;
  dye?: TapestryDye;
  titleAs?: "h1" | "h2" | "h3";
  titleId?: string;
  as?: ElementType;
  bodyClassName?: string;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}

// Renders the tapestry reusable UI component.
// Features: applies customizable style variants and responsive CSS classes; renders child component slots dynamically.
// Returns the styled JSX element.
export default function Tapestry({
  children,
  title,
  icon,
  meta,
  dye = "royal",
  titleAs: Heading = "h2",
  titleId,
  as: Tag = "div",
  bodyClassName = "p-4",
  className = "",
  ...rest
}: TapestryProps) {
  return (
    <Tag className={["flex flex-col", className].filter(Boolean).join(" ")} {...rest}>
      <div className="flex items-center" aria-hidden="true">
        <span className="h-3.5 w-3.5 shrink-0 border-2 border-black/60 bg-iron-light" />
        <span className="h-2 flex-1 border-y-2 border-black/60 bg-iron-light shadow-[inset_0_1px_0_rgb(255_255_255_/_0.28)]" />
        <span className="h-3.5 w-3.5 shrink-0 border-2 border-black/60 bg-iron-light" />
      </div>

      <div
        className={`tapestry mx-1.5 border-x-2 border-b-2 border-black/70 ${DYE_CLASSES[dye]} shadow-[4px_4px_0_rgb(0_0_0_/_0.5)]`}
      >
        <div className="border-2 border-accent-deep/35">
          {title && (
            <div className="flex items-center justify-between gap-3 border-b-2 border-black/45 bg-black/25 px-4 py-2.5">
              <Heading
                id={titleId}
                className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-parchment"
              >
                {icon}
                {title}
              </Heading>
              {meta && (
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-parchment-dim">
                  {meta}
                </span>
              )}
            </div>
          )}
          <div className={bodyClassName}>{children}</div>
        </div>
      </div>

      <div
        className="mx-1.5 h-3 bg-accent-deep/70 [mask-image:repeating-linear-gradient(to_right,#000_0_3px,transparent_3px_7px)]"
        aria-hidden="true"
      />
    </Tag>
  );
}
