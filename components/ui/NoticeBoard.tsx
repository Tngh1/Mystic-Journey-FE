import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Panel from "./Panel";


const OUTLINE = "border-black/60";

const GRAIN =
  "bg-[repeating-linear-gradient(90deg,rgb(0_0_0_/_0.18)_0_2px,transparent_2px_22px)]";

// Renders the beam reusable UI component.
// Returns the styled JSX element.
function Beam({ w, h, fill }: { w: string; h: string; fill: string }) {
  return (
    <span
      className={`block border-2 ${OUTLINE} ${w} ${h} ${fill} ${GRAIN} shadow-[inset_0_2px_0_var(--color-wood-light),inset_0_-2px_0_var(--color-wood-dark)]`}
    />
  );
}

// Renders the upright reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
function Upright() {
  return (
    <span
      className={`w-4 shrink-0 border-2 ${OUTLINE} bg-wood shadow-[inset_2px_0_0_var(--color-wood-light),inset_-2px_0_0_var(--color-wood-dark)] sm:w-6`}
      aria-hidden="true"
    />
  );
}

// Renders the board frame reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
export function BoardFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      <div className="flex justify-center" aria-hidden="true">
        <Beam w="w-full" h="h-3.5 md:h-4" fill="bg-wood-light" />
      </div>

      <div className="mx-auto flex w-[97%] items-stretch">
        <Upright />

        <Panel material="wood" rivets className="min-w-0 flex-1 p-3 shadow-lg md:p-4">
          {children}
        </Panel>

        <Upright />
      </div>

      <div className="flex justify-center" aria-hidden="true">
        <Beam w="w-full" h="h-3 md:h-3.5" fill="bg-wood" />
      </div>

      <div className="mx-auto flex h-8 w-[97%] justify-between md:h-10" aria-hidden="true">
        <Upright />
        <Upright />
      </div>
    </div>
  );
}

// Renders the notice board reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
export default function NoticeBoard({
  eyebrow,
  icon: Icon,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  lede: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative mt-auto px-4 pt-10 md:pt-14">
      <div className="mx-auto w-full max-w-[64rem]">
        <BoardFrame>
          <div className="flex justify-center">
            <div className="parchment inline-block max-w-full border-2 border-wood-dark px-5 py-3 text-center text-on-parchment shadow-[inset_0_0_0_2px_rgb(0_0_0_/_0.12)] md:px-8 md:py-4">
              <p className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em]">
                <Icon className="h-3 w-3" aria-hidden="true" />
                {eyebrow}
              </p>

              <h1 className="text-lg leading-tight font-bold sm:text-xl md:text-2xl">{title}</h1>

              <p className="mx-auto max-w-[46ch] text-[11px] leading-snug text-on-parchment/85 sm:text-xs">
                {lede}
              </p>
            </div>
          </div>

          {children && <div className="mt-3 min-w-0 md:mt-4">{children}</div>}
        </BoardFrame>
      </div>
    </section>
  );
}
