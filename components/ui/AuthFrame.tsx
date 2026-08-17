import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";


const OUTLINE = "border-black/60";

const WEAVE =
  "bg-[repeating-linear-gradient(90deg,rgb(255_255_255_/_0.035)_0_2px,transparent_2px_7px)]";

// Renders the tail reusable UI component.
// Returns the styled JSX element.
const TAIL = `mx-auto block border-x-2 border-b-2 ${OUTLINE} bg-iron-dark ${WEAVE}`;

// Renders the seam reusable UI component.
// Features: applies customizable style variants and responsive CSS classes; renders child component slots dynamically.
// Returns the styled JSX element.
function Seam() {
  return (
    <span
      className="block h-0.5 bg-black/55 shadow-[0_2px_0_rgb(233_220_184_/_0.1)]"
      aria-hidden="true"
    />
  );
}

// Renders the auth frame reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
export default function AuthFrame({
  eyebrow,
  icon: Icon,
  title,
  lede,
  children,
  footer,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="-mx-4 flex items-stretch sm:-mx-6" aria-hidden="true">
        <span className={`h-4 w-3 border-2 ${OUTLINE} bg-iron-light`} />
        <span
          className={`h-4 flex-1 border-y-2 ${OUTLINE} bg-iron shadow-[inset_0_2px_0_var(--color-iron-light)]`}
        />
        <span className={`h-4 w-3 border-2 ${OUTLINE} bg-iron-light`} />
      </div>

      <div className="flex justify-between px-8 sm:px-12" aria-hidden="true">
        <span className={`h-3 w-3 border-2 ${OUTLINE} bg-iron-light`} />
        <span className={`h-3 w-3 border-2 ${OUTLINE} bg-iron-light`} />
      </div>

      <div
        className={`relative border-2 border-b-0 ${OUTLINE} bg-iron-dark ${WEAVE} shadow-[6px_6px_0_rgb(0_0_0_/_0.5)]`}
      >
        <div
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_2px_rgb(233_220_184_/_0.08)]"
          aria-hidden="true"
        />

        <div className="relative min-w-0 space-y-4 p-4 md:space-y-5 md:p-5">
          <div className="space-y-1.5 text-center">
            <span
              className={`mx-auto flex h-10 w-10 items-center justify-center border-2 ${OUTLINE} bg-black/40 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.5)]`}
            >
              <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
            </span>

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-parchment-dim">
              {eyebrow}
            </p>

            <h1 className="text-xl font-bold leading-tight text-parchment md:text-2xl">{title}</h1>

            {lede && (
              <p className="mx-auto max-w-[42ch] text-xs leading-snug text-parchment-dim">{lede}</p>
            )}
          </div>

          <Seam />

          {children}

          {footer && (
            <>
              <Seam />
              <p className="text-center text-sm text-parchment-dim">{footer}</p>
            </>
          )}
        </div>
      </div>

      <div aria-hidden="true">
        <span className={`${TAIL} h-2 w-[78%]`} />
        <span className={`${TAIL} h-2 w-[48%]`} />
        <span className={`${TAIL} h-2 w-[20%]`} />
      </div>
    </div>
  );
}
