"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, User, X } from "lucide-react";
import AnimatedButton from "./AnimatedButton";
import Banner from "./Banner";
import { useAuth } from "@/lib/contexts/AuthContext";

/* Wiki used to be a fourth link hardcoded after the map, so it drifted out of
   sync with the others (and was missing from the mobile list's styling). */
const DESKTOP_NAV = [
  { label: "Story", href: "/story" },
  { label: "Content", href: "/content" },
  { label: "Download", href: "/download" },
  { label: "Wiki", href: "/wiki" },
];

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    await logout();
    router.push("/login");
  };

  // The bar IS the cloud: a solid white plate whose bottom edge breaks into
  // stepped pixel cloud lumps (.cloud-bank). Not a blue sky strip with a white
  // fringe — the whole mass reads as one cloud the page hangs from. Because the
  // ground is now white, every child flips to royal-blue ink (gold on white
  // fails contrast at 1.7:1; royal #26356f clears 9:1). Solid, never a blurred
  // scrim: blur is reserved for modal dismissal. Scroll only drops the shadow,
  // so nothing about the cloud changes as you move down the page.
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-cloud transition-shadow duration-200 ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      {/* The cloud's underside. Hangs below the bar, so it must not eat clicks
          meant for the hero beneath it. */}
      <div
        className="cloud-bank pointer-events-none absolute left-0 top-full h-6 w-full"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative w-24 h-12 md:w-32 md:h-16">
          <Image
            src="/images/logo/logo.webp"
            alt="Mystic Journey Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation — the hover rule is a stepped 3-block underline
            (a growing hairline is a modern-web tell). yellow-400 was an
            off-brand near-miss for the gold token. */}
        <nav className="hidden md:flex items-center gap-1">
          {DESKTOP_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative px-3 py-2 font-semibold text-sm md:text-base tracking-wide text-heraldry-royal transition-colors duration-200 hover:text-accent-deep focus-visible:text-accent-deep"
            >
              {item.label}
              <span
                className="pointer-events-none absolute bottom-1 left-3 right-3 h-0.5 origin-left scale-x-0 bg-accent-deep transition-transform duration-200 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>

        {/* Right Side - User Menu or Login Button */}
        <div className="hidden md:block">
          {isLoading ? (
            <div
              className="h-11 w-28 animate-pulse border-2 border-heraldry-royal/30 bg-heraldry-royal/10"
              aria-label="Checking login session"
              role="status"
            />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                // Gold signet: bevelled square that sinks on press. The old
                // version scaled up on hover (a smooth zoom the pixel system
                // disallows) and used a hardcoded gradient off the token set.
                // Border is black, not accent: a gold rim around a gold face has
                // nothing to define it now that the plate behind is white.
                className="pixel-press pixel-bevel-gold relative flex h-11 w-11 items-center justify-center border-2 border-black/60 bg-accent text-on-accent cursor-pointer hover:bg-accent-hover"
                aria-label="User menu"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
              >
                <span className="text-base font-black">
                  {user.userName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </button>

              {isUserMenuOpen && (
                // Solid wood panel — the old translucent + backdrop-blur card
                // let the pixel background bleed through and smear.
                <div
                  role="menu"
                  aria-label="Account"
                  className="pixel-bevel absolute right-0 mt-2 w-60 border-2 border-wood-dark overflow-hidden"
                >
                  <div className="border-b-2 border-black/50 px-4 py-3">
                    <p className="truncate text-sm font-bold text-fg">{user.userName}</p>
                    <p className="truncate text-xs text-fg-muted">@{user.userName}</p>
                    <Banner tone="gold" pennant={false} className="mt-2">
                      {user.role}
                    </Banner>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/account/profile"
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-fg-muted transition-colors hover:bg-accent hover:text-on-accent focus-visible:bg-accent focus-visible:text-on-accent cursor-pointer"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      Profile
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      // Destructive action, separated from navigation by a rule
                      // and carrying the danger token rather than a gold hover.
                      className="flex w-full items-center gap-2.5 border-t-2 border-black/50 px-4 py-3 text-left text-sm text-fg-muted transition-colors hover:bg-danger hover:text-fg focus-visible:bg-danger focus-visible:text-fg cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              {/* ab--ink flips the button's white ring/label to royal, which is
                  the only way it stays visible on the cloud plate. */}
              <AnimatedButton size="sm" className="ab--ink">
                Login
              </AnimatedButton>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button — 44x44 minimum touch target (was 40x40 from
            p-2 + a 24px icon). Inline SVG paths replaced with the Lucide set
            the rest of the app uses. */}
        <button
          type="button"
          className="pixel-press pixel-bevel-iron flex h-11 w-11 items-center justify-center border-2 border-black/60 text-parchment md:hidden cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        // Same DESKTOP_NAV source as the desktop bar, so the two lists can no
        // longer drift apart. Solid stone panel instead of a blurred scrim.
        // z-10 puts it over the cloud lumps, which share this top-full edge, so
        // the panel hangs out of the cloud rather than behind it. Its top edge
        // is black, which is what separates a dark panel from a white plate.
        <div className="md:hidden absolute top-full left-0 z-10 w-full border-t-2 border-black/60 bg-night-deep p-4 shadow-lg">
          <nav className="flex flex-col" aria-label="Mobile">
            {DESKTOP_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                // py-3 keeps every row at a 44px+ touch target with 0 gaps,
                // and the rules between rows read as carved panel seams.
                className="border-b-2 border-black/40 py-3 text-base font-semibold tracking-wide text-fg transition-colors hover:text-accent focus-visible:text-accent cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4">
              {isLoading ? (
                <p className="px-2 py-3 text-sm text-fg-muted" role="status">
                  Checking session...
                </p>
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 pb-2">
                    <span className="pixel-bevel-gold flex h-10 w-10 items-center justify-center border-2 border-black/60 bg-accent text-sm font-black text-on-accent">
                      {user.userName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-fg">{user.userName}</p>
                      <p className="truncate text-xs text-fg-muted">@{user.userName}</p>
                    </div>
                    <Banner tone="gold" pennant={false} className="ml-auto">
                      {user.role}
                    </Banner>
                  </div>
                  <Link
                    href="/account/profile"
                    className="flex w-full items-center gap-2.5 px-2 py-3 text-left text-sm text-fg-muted transition-colors hover:bg-accent hover:text-on-accent focus-visible:bg-accent focus-visible:text-on-accent cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 border-t-2 border-black/50 px-2 py-3 text-left text-sm text-fg-muted transition-colors hover:bg-danger hover:text-fg focus-visible:bg-danger focus-visible:text-fg cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <AnimatedButton>Login</AnimatedButton>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
