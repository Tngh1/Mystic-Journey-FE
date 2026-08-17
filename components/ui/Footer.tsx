"use client";

import { useState } from "react";
import Link from "next/link";
import SocialIcon from "./SocialIcon";
import AnimatedButton from "./AnimatedButton";
import OrnateDivider from "./OrnateDivider";

const GAME_NAV = [
  { label: "Download", href: "/download" },
  { label: "Wiki", href: "/wiki" },
  { label: "Game Guide", href: "/wiki" },
];

const COMPANY_NAV = [
  { label: "About Us", href: "/wiki" },
  { label: "Contact", href: "/wiki" },
  { label: "Careers", href: "/wiki" },
];

const SOCIALS = [
  { label: "Twitter", href: "#" },
  { label: "Discord", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
];

// Renders the column heading reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
        {children}
      </span>
      <span
        className="h-0.5 flex-1 bg-linear-to-r from-accent/40 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

const FOOTER_LINK =
  "w-fit py-1 text-sm tracking-wide text-parchment-dim transition-colors duration-200 hover:text-accent focus-visible:text-accent cursor-pointer";

// Renders the footer reusable UI component.
// Returns the styled JSX element.
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);  // Initialize boolean flag as inactive

  // Event handler for handle subscribe.
  // Prevents default browser form submission action.
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default HTML form submission and page reload
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="soil-ground relative w-full">
      <div
        className="turf-strip pointer-events-none absolute -top-4 left-0 h-8 w-full"
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-4 pb-16 pt-20 md:pb-20 md:pt-24 lg:pb-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="mb-8">
              <Link href="/" className="inline-block cursor-pointer">
                <span className="text-2xl font-black uppercase tracking-widest text-accent">
                  Mystic
                </span>
                <span className="text-2xl font-black uppercase tracking-widest text-parchment">
                  {" "}
                  Journey
                </span>
              </Link>
              <p className="mt-3 text-sm text-parchment-dim">
                An epic dark-fantasy MMORPG adventure awaits.
              </p>
            </div>

            <nav className="flex flex-col gap-2" aria-label="Game">
              {GAME_NAV.map((item) => (
                <Link key={item.label} href={item.href} className={FOOTER_LINK}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <ColumnHeading>Company</ColumnHeading>
            <nav className="flex flex-col gap-2" aria-label="Company">
              {COMPANY_NAV.map((item) => (
                <Link key={item.label} href={item.href} className={FOOTER_LINK}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-5">
            <ColumnHeading>Stay Updated</ColumnHeading>

            <form onSubmit={handleSubscribe} className="mb-8">
              <label
                htmlFor="footer-email"
                className="mb-2 block text-xs font-bold uppercase tracking-widest text-parchment-dim"
              >
                Email address
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="raven@mysticjourney.gg"
                  className="min-h-11 flex-1 border-2 border-black/60 bg-black/40 px-4 py-3 text-sm text-parchment placeholder-parchment-dim/50 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.5)] outline-none transition-colors duration-200 focus:border-accent"
                />
                <AnimatedButton size="md" type="submit">
                  Subscribe
                </AnimatedButton>
              </div>
              <p className="mt-3 min-h-4 text-xs text-accent" role="status" aria-live="polite">
                {subscribed ? "Thank you for subscribing!" : ""}
              </p>
            </form>

            <div className="flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="pixel-press pixel-bevel-iron flex h-11 w-11 items-center justify-center border-2 border-black/60 text-parchment-dim transition-colors hover:text-accent focus-visible:text-accent cursor-pointer"
                >
                  <SocialIcon name={social.label} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <OrnateDivider className="mt-16" />

        <div className="mt-8 flex flex-col gap-4 text-center text-xs text-parchment-dim/80 md:flex-row md:items-center md:justify-between md:text-left">
          <span>Copyright 2026 Mystic Journey. All rights reserved.</span>
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <Link
              href="/privacy-policy"
              className="py-1 transition-colors duration-200 hover:text-accent focus-visible:text-accent cursor-pointer"
            >
              Privacy Policy
            </Link>
            <span className="text-parchment-dim/50" aria-hidden="true">
              |
            </span>
            <Link
              href="/terms"
              className="py-1 transition-colors duration-200 hover:text-accent focus-visible:text-accent cursor-pointer"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
