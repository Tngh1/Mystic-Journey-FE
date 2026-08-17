"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, User, X } from "lucide-react";
import AnimatedButton from "./AnimatedButton";
import Banner from "./Banner";
import { useAuth } from "@/lib/contexts/AuthContext";

const DESKTOP_NAV = [
  { label: "Story", href: "/story" },
  { label: "Content", href: "/content" },
  { label: "Download", href: "/download" },
  { label: "Wiki", href: "/wiki" },
];

// Renders the header reusable UI component.
// Returns the styled JSX element.
export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // Initialize boolean flag as inactive
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);  // Initialize boolean flag as inactive
  const [isScrolled, setIsScrolled] = useState(false);  // Initialize boolean flag as inactive

  // Subscribe the required browser or runtime event handlers when dependencies change and remove the same handlers during cleanup.
  useEffect(() => {
    // Event handler for handle scroll.
    // Executes asynchronous API request and toggles loading indicators.
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Event handler for handle logout.
  // Executes asynchronous API request and toggles loading indicators.
  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    await logout();  // Await asynchronous operation before proceeding
    router.push("/login");  // Navigate to the next page and push to history stack
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-cloud transition-shadow duration-200 ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <div
        className="cloud-bank pointer-events-none absolute left-0 top-full h-6 w-full"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="relative w-24 h-12 md:w-32 md:h-16">
          <Image
            src="/images/logo/logo.webp"
            alt="Mystic Journey Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

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
              <AnimatedButton size="sm" className="ab--ink">
                Login
              </AnimatedButton>
            </Link>
          )}
        </div>

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

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 z-10 w-full border-t-2 border-black/60 bg-night-deep p-4 shadow-lg">
          <nav className="flex flex-col" aria-label="Mobile">
            {DESKTOP_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
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
