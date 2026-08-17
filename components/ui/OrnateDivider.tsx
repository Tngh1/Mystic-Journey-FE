interface OrnateDividerProps {
  weight?: "even" | "left" | "right";
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}

// Renders the ornate divider reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
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
