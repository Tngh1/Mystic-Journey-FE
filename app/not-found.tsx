import Link from "next/link";
import FaceAnimation from "@/components/ui/FaceAnimation";
import Panel from "@/components/ui/Panel";

// Renders the not found reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
export default function NotFound() {
  return (
    <div className="stone-wall flex min-h-dvh items-center justify-center px-4 py-16">
      <Panel material="wood" className="w-full max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          <FaceAnimation />
        </div>

        <h1 className="text-3xl font-black uppercase tracking-widest text-accent">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-parchment-dim">
          This path leads nowhere. The road back is marked below.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="pixel-press pixel-bevel-gold flex min-h-11 flex-1 items-center justify-center border-2 border-black/60 bg-accent px-6 py-3 text-sm font-black uppercase tracking-widest text-on-accent hover:bg-accent-hover"
          >
            Back to Home
          </Link>
          <Link
            href="/wiki"
            className="pixel-press pixel-bevel-iron flex min-h-11 flex-1 items-center justify-center border-2 border-black/60 px-6 py-3 text-sm font-black uppercase tracking-widest text-parchment hover:text-accent"
          >
            Explore Wiki
          </Link>
        </div>
      </Panel>
    </div>
  );
}
