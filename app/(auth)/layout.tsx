import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";


// Renders the auth layout view component.
// Returns the JSX element hierarchy for the page view.
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
