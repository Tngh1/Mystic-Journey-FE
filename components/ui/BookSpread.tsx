import type { CSSProperties, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Banner, { type BannerTone } from "@/components/ui/Banner";

interface BookSpreadProps {
  left: ReactNode;
  right: ReactNode;
  title?: ReactNode;
  tone?: BannerTone;
  ratio?: "even" | "wide-right" | "wide-left";
  tabs?: ReactNode;
  footer?: ReactNode;
  leafHeight?: string;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}

// Renders the corner filigree reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
function CornerFiligree() {
  const corner = "pointer-events-none absolute h-5 w-5 border-accent-deep";
  return (
    <span aria-hidden="true">
      <span className={`${corner} left-1.5 top-1.5 border-l-2 border-t-2`} />
      <span className={`${corner} right-1.5 top-1.5 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-1.5 left-1.5 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-1.5 right-1.5 border-b-2 border-r-2`} />
    </span>
  );
}

const TONE_HIDE: Partial<Record<BannerTone, string>> = {
  royal: "var(--color-heraldry-royal)",
  crimson: "var(--color-heraldry-crimson)",
  ember: "var(--color-heraldry-ember)",
  pine: "var(--color-heraldry-pine)",
  arcane: "var(--color-heraldry-arcane)",
};

// Renders the book spread reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
export default function BookSpread({
  left,
  right,
  title,
  tone = "royal",
  ratio = "even",
  tabs,
  footer,
  leafHeight,
  className = "",
}: BookSpreadProps) {
  const leaf = [
    "parchment relative min-w-0 border-2 border-wood-dark p-5 md:p-6 transition-all duration-300",
    leafHeight ? `${leafHeight} overflow-hidden` : "",
  ].join(" ");

  const columns =
    ratio === "wide-right"
      ? "md:grid-cols-[minmax(0,15rem)_1.25rem_minmax(0,1fr)]"
      : ratio === "wide-left"
        ? "md:grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,19rem)]"
        : "md:grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)]";

  return (
    <div className={`relative ${className}`}>
      <div
        className="book-leather relative w-full rounded-sm p-3.5 md:p-5"
        style={TONE_HIDE[tone] ? ({ "--book-hide": TONE_HIDE[tone] } as CSSProperties) : undefined}
      >
        <CornerFiligree />

        {tabs && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 md:absolute md:-left-11 md:top-10 md:mb-0 md:flex-col md:overflow-visible md:pb-0 z-20">
            {tabs}
          </div>
        )}

        {title && (
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
            <Banner tone={tone}>{title}</Banner>
          </div>
        )}

        <div className={["grid grid-cols-1 items-stretch", columns].join(" ")}>
          <div className={`${leaf} book-page-stack-left`}>{left}</div>

          <div className="book-spine h-4 w-full md:h-auto" aria-hidden="true" />

          <div className={`${leaf} book-page-stack-right`}>{right}</div>
        </div>

        {footer && (
          <div className="mt-3 flex justify-center md:mt-4">{footer}</div>
        )}
      </div>
    </div>
  );
}

// Renders the book tab reusable UI component.
// Features: binds user interaction event listeners.
// Returns the styled JSX element.
export function BookTab({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={count === undefined ? label : `${label}, ${count} entries`}
      title={label}
      className={[
        "pixel-press relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border-2 shadow-md transition-all duration-200 md:h-12 md:w-12 group",
        active
          ? "border-accent bg-accent-deep text-on-accent md:-translate-x-1 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
          : "border-black/60 bg-wood text-parchment-dim hover:border-accent-deep hover:text-parchment hover:-translate-x-0.5",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-7 w-7 items-center justify-center border transition-colors",
          active ? "border-on-accent/60 bg-black/20" : "border-accent-deep/45 group-hover:border-accent-deep",
        ].join(" ")}
        aria-hidden="true"
      >
        {icon}
      </span>

      {count !== undefined && count > 0 && (
        <span className="absolute -top-1.5 -left-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-amber-300/60 bg-amber-950 px-1 text-[9px] font-black text-amber-300 shadow">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

// Renders the book pager reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
export function BookPager({
  page,
  totalPages,
  onPage,
  className = "",
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const window = 5;
  let start = Math.max(1, page - Math.floor(window / 2));
  const end = Math.min(totalPages, start + window - 1);
  start = Math.max(1, end - window + 1);
  // Helper function executing pages.
  // Processes input parameters and returns the calculated result.
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const cell =
    "pixel-press flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border-2 text-sm font-black tabular-nums shadow-md transition-colors";
  const idle = "border-accent-deep/70 bg-wood-dark text-parchment hover:border-accent hover:text-accent";
  const off = "border-black/50 bg-wood-dark/60 text-parchment-dim/40 cursor-not-allowed";

  return (
    <nav aria-label="Pagination" className={`flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={`${cell} ${page <= 1 ? off : idle}`}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          aria-current={p === page ? "page" : undefined}
          aria-label={`Page ${p}`}
          className={[
            cell,
            p === page ? "border-accent bg-accent-deep text-on-accent" : idle,
          ].join(" ")}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={`${cell} ${page >= totalPages ? off : idle}`}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

// Renders the book stat table reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
export function BookStatTable({
  rows,
  className = "",
}: {
  rows: { label: string; value: ReactNode; icon?: ReactNode }[];
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}) {
  return (
    <dl className={`border-2 border-wood/50 ${className}`}>
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={[
            "flex items-center justify-between gap-4 px-3 py-2",
            i > 0 ? "border-t border-wood/25" : "",
          ].join(" ")}
        >
          <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-parchment/75">
            {r.icon}
            {r.label}
          </dt>
          <dd className="text-right text-sm font-black tabular-nums text-on-parchment">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// Renders the book page title reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
export function BookPageTitle({
  eyebrow,
  children,
  align = "center",
  as: Tag = "h1",
}: {
  eyebrow?: ReactNode;
  children: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.3em] text-on-parchment/65">
          {eyebrow}
        </p>
      )}
      <Tag className="text-2xl font-black text-on-parchment md:text-3xl">{children}</Tag>
      <span
        className={[
          "mt-2 block h-0.5 bg-wood/40",
          align === "center" ? "mx-auto w-24" : "w-24",
        ].join(" ")}
        aria-hidden="true"
      />
    </div>
  );
}
