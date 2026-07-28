import type { ReactNode } from "react";

interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow: string;
  /** Section title — always renders as an h2 (the page h1 is the hero). */
  title: ReactNode;
  /** Optional supporting line under the title. */
  subtitle?: ReactNode;
  /** Left-align instead of centering (used by asymmetric section headers). */
  align?: "center" | "left";
  className?: string;
}

/**
 * The landing page's section header: gold eyebrow flanked by pixel rules, then
 * an h2. Extracted because Hero/About/World/Class each had their own copy with
 * slightly different rule thickness, tracking, and muted-text opacity.
 */
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
