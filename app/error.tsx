"use client";

import { useEffect } from "react";
import Link from "next/link";
import FaceAnimation from "@/components/ui/FaceAnimation";
import Panel from "@/components/ui/Panel";

/* Matches not-found.tsx: stone ground, wood board, gold for the recovery action.
   The message keeps error.message so the recovery path is specific (error-clarity,
   error-recovery), and "Try again" comes first because reset() is cheaper for the
   user than losing their place. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="stone-wall flex min-h-dvh items-center justify-center px-4 py-16">
      <Panel material="wood" className="w-full max-w-md p-8 text-center" role="alert">
        <div className="mb-6 flex justify-center">
          <FaceAnimation />
        </div>

        <h1 className="text-3xl font-black uppercase tracking-widest text-danger">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-parchment-dim">
          {error.message || "An unexpected error occurred. Try again below."}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="pixel-press pixel-bevel-gold flex min-h-11 flex-1 cursor-pointer items-center justify-center border-2 border-black/60 bg-accent px-6 py-3 text-sm font-black uppercase tracking-widest text-on-accent hover:bg-accent-hover"
          >
            Try again
          </button>
          <Link
            href="/"
            className="pixel-press pixel-bevel-iron flex min-h-11 flex-1 items-center justify-center border-2 border-black/60 px-6 py-3 text-sm font-black uppercase tracking-widest text-parchment hover:text-accent"
          >
            Back to Home
          </Link>
        </div>
      </Panel>
    </div>
  );
}
