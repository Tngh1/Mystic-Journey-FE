interface OrnateDividerProps {
  /** Bias the rule lengths so stacked dividers don't look mechanically equal. */
  weight?: "even" | "left" | "right";
  className?: string;
}

/**
 * Section rule: two accent bars meeting at a diamond lozenge. Purely
 * decorative, so the whole thing is aria-hidden — a screen reader gains
 * nothing from announcing it.
 *
 * The lozenge is a square rotated 45deg, which is the one place a transform is
 * allowed to fake a curve-free "ornament" without breaking the pixel grid.
 */
export default function OrnateDivider({
  weight = "even",
  className = "",
}: OrnateDividerProps) {
  const left = weight === "right" ? "flex-[2.4]" : "flex-1";
  const right = weight === "left" ? "flex-[2.4]" : "flex-1";

  return (
    <div
      className={`flex items-center gap-3 ${className}`.trim()}
      aria-hidden="true"
    >
      <div className={`h-0.5 ${left} bg-linear-to-r from-transparent to-accent/50`} />
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rotate-45 bg-accent/60" />
        <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
        <span className="h-1.5 w-1.5 rotate-45 bg-accent/60" />
      </div>
      <div className={`h-0.5 ${right} bg-linear-to-l from-transparent to-accent/50`} />
    </div>
  );
}
