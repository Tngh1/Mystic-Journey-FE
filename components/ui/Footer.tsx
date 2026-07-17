"use client";

import { useState } from "react";
import Link from "next/link";
import SocialIcon from "./SocialIcon";
import AnimatedButton from "./AnimatedButton";

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

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-black border-t border-white/10">
      <div className="container mx-auto px-4 py-16 md:py-20 lg:py-24">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          {/* LEFT - Brand + Game Nav */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <div className="mb-8">
              <Link href="/" className="inline-block cursor-pointer">
                <span className="font-black text-2xl tracking-widest text-[#ffc032] uppercase">
                  Mystic
                </span>
                <span className="font-black text-2xl tracking-widest text-white uppercase">
                  {" "}
                  Journey
                </span>
              </Link>
              <p className="mt-3 text-sm text-white/50">
                An epic dark-fantasy MMORPG adventure awaits.
              </p>
            </div>

            {/* Game Nav */}
            <nav className="flex flex-col gap-3">
              {GAME_NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm tracking-wide transition-colors duration-200 text-white/50 hover:text-[#ffc032] cursor-pointer w-fit"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* MIDDLE - Company Links */}
          <div className="lg:col-span-3">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="text-xs font-bold tracking-[0.3em] text-[#ffc032] uppercase">
                Company
              </span>
              <span className="h-px flex-1 bg-linear-to-r from-[#ffc032]/40 to-transparent" />
            </div>
            <nav className="flex flex-col gap-3">
              {COMPANY_NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-white/50 tracking-wide transition-colors duration-200 hover:text-[#ffc032] cursor-pointer w-fit"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT - Subscribe + Social */}
          <div className="lg:col-span-5">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="text-xs font-bold tracking-[0.3em] text-[#ffc032] uppercase">
                Stay Updated
              </span>
              <span className="h-px flex-1 bg-linear-to-r from-[#ffc032]/40 to-transparent" />
            </div>

            {/* Subscribe Form */}
            <form onSubmit={handleSubscribe} className="mb-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="flex-1 rounded-full border border-white/10 bg-[#0d0d0d] px-5 py-3 text-sm text-white placeholder-white/40 outline-none transition-all duration-200 focus:border-[#ffc032]"
                />
                <AnimatedButton size="md" type="submit">Subscribe</AnimatedButton>
              </div>
              {subscribed && (
                <p className="mt-3 text-xs text-[#ffc032]">
                  Thank you for subscribing!
                </p>
              )}
            </form>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-200 hover:border-[#ffc032] hover:bg-[#ffc032]/10 hover:text-[#ffc032] cursor-pointer"
                  >
                    <SocialIcon name={social.label} />
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#ffc032]/20" />
          <div className="h-2 w-2 rounded-full bg-[#ffc032]" />
          <div className="h-px flex-1 bg-[#ffc032]/20" />
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col gap-4 text-center text-xs text-white/40 md:flex-row md:items-center md:justify-between md:text-left">
          <span>Copyright 2026 Mystic Journey. All rights reserved.</span>
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <Link
              href="/privacy-policy"
              className="transition-colors duration-200 hover:text-[#ffc032] cursor-pointer"
            >
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/terms"
              className="transition-colors duration-200 hover:text-[#ffc032] cursor-pointer"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
