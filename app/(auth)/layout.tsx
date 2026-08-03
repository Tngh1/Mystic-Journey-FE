import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

/* The gatehouse the four auth pages stand in.

   Ground is the game's own title screen (`main-menu.webp`), the same art the
   client opens on. It is decoration, hence the empty alt and `aria-hidden`.

   The scrims are top-weighted, which is the opposite of what a floating form
   needs and exactly what a hung banner needs. The banner (AuthFrame) drops from
   a rod at the top of the page, so the night sky behind the rod is darkened to
   give the ironwork something to bite into, and the picture is then left alone
   on the way down: the sunset band keeps its gold, and the foreground bluff with
   the three heroes on it stays lit and uncovered.

   One light overall wash on top of that, plain black — it was `night` (#0b0620)
   once, a *violet* black, which at these opacities washed the sunset mauve and
   lost the game's warm palette. Black only darkens.

   Top-aligned (`pt-6`, no `mt-auto`) because a banner hangs from its rod. The
   old wood board was bottom-aligned for the opposite reason: an object with legs
   meets the ground. */

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-black">
      <Image
        src="/images/ui/main-menu.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="pixelated select-none object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/80 via-black/25 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pixel-scanlines pointer-events-none absolute inset-0 opacity-15"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-md px-4 pt-6 pb-12 sm:px-6">
        <div className="mb-4 flex justify-center">
          <Link href="/" className="relative block h-16 w-28" aria-label="Mystic Journey home">
            <Image
              src="/images/logo/logo.webp"
              alt="Mystic Journey"
              fill
              sizes="112px"
              className="pixelated object-contain"
              priority
            />
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
