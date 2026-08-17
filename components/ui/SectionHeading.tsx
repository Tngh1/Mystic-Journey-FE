import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}

// Renders the section heading reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "text-center" : "text-left"} ${className}`.trim()}>
      <div
        className={`mb-5 flex items-center gap-3 ${centered ? "justify-center" : "justify-start"}`}
      >
        {centered && (
          <span
            className="h-0.5 w-10 bg-linear-to-r from-transparent to-accent/60"
            aria-hidden="true"
          />
        )}
        <span className="text-xs font-bold uppercase tracking-[0.34em] text-accent">
          {eyebrow}
        </span>
        <span
          className="h-0.5 w-10 bg-linear-to-l from-transparent to-accent/60"
          aria-hidden="true"
        />
      </div>

      <h2 className="text-4xl font-bold leading-tight tracking-[0.02em] text-fg sm:text-5xl lg:text-6xl">
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-4 max-w-[70ch] text-base text-fg-muted md:text-lg ${
            centered ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
