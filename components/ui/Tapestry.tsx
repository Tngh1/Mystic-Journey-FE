import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type TapestryDye = "royal" | "crimson" | "pine" | "arcane" | "ember";

/* The hanging tapestry — the account area's own furniture.

   Everywhere else in the portal is *built*: wood planks in the wiki, rolled steel
   in the admin keep, masonry in the class bay. The account pages are the one part
   of the site that is about the player rather than the game's contents, so they
   get the one furnishing that is textile instead of structural: a woven hanging
   on an iron rod, dyed in a heraldry colour, fringed along the bottom.

   Three parts, all hard-edged:
     • the rod — an iron bar with a finial at each end, drawn wider than the cloth
       so it reads as something the cloth hangs from, not a header bar;
     • the cloth — `.tapestry` (warp and weft as two 4px hard-stop gradients) over
       a heraldry dye, with a gold thread couched inside the hem;
     • the fringe — tassels cut with a repeating mask, so it is one element rather
       than thirty spans.

   Parchment on the dark dyes clears 7:1, so body copy inside is legible without
   a second surface behind it. */

const DYE_CLASSES: Record<TapestryDye, string> = {
  royal: "bg-heraldry-royal",
  crimson: "bg-heraldry-crimson",
  pine: "bg-heraldry-pine",
  arcane: "bg-heraldry-arcane",
  ember: "bg-heraldry-ember",
};

/* `title` is dropped from the HTML attributes it extends: there it is the browser
   tooltip and must be a string, here it is the embroidered heading and takes any
   node. A tooltip on a heading would be the wrong affordance anyway. */
interface TapestryProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  children: ReactNode;
  /** Embroidered along the head of the cloth. Omit for an untitled hanging. */
  title?: ReactNode;
  /** Sits left of the title. Decorative — pass `aria-hidden` at the call site. */
  icon?: ReactNode;
  /** Small text at the right of the title band (a count, a number, a state). */
  meta?: ReactNode;
  /** Which dye the cloth is woven in. */
  dye?: TapestryDye;
  /** Element for the `<h*>` the title renders as, so headings stay in order. */
  titleAs?: "h1" | "h2" | "h3";
  /** `id` for the title, to point an `aria-labelledby` at it. */
  titleId?: string;
  /** Render the hanging as something other than a div. */
  as?: ElementType;
  /** Padding etc. for the cloth body. */
  bodyClassName?: string;
  className?: string;
}

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
      {/* Rod */}
      <div className="flex items-center" aria-hidden="true">
        <span className="h-3.5 w-3.5 shrink-0 border-2 border-black/60 bg-iron-light" />
        <span className="h-2 flex-1 border-y-2 border-black/60 bg-iron-light shadow-[inset_0_1px_0_rgb(255_255_255_/_0.28)]" />
        <span className="h-3.5 w-3.5 shrink-0 border-2 border-black/60 bg-iron-light" />
      </div>

      {/* Cloth. Inset from the rod ends by the finial width so the hanging is
          visibly narrower than what carries it. */}
      <div
        className={`tapestry mx-1.5 border-x-2 border-b-2 border-black/70 ${DYE_CLASSES[dye]} shadow-[4px_4px_0_rgb(0_0_0_/_0.5)]`}
      >
        {/* Couched gold thread inside the hem */}
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

      {/* Fringe. One masked strip rather than a row of tassel elements. */}
      <div
        className="mx-1.5 h-3 bg-accent-deep/70 [mask-image:repeating-linear-gradient(to_right,#000_0_3px,transparent_3px_7px)]"
        aria-hidden="true"
      />
    </Tag>
  );
}
