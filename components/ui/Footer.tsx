"use client";

import { useState } from "react";
import Link from "next/link";
import SocialIcon from "./SocialIcon";
import Button from "./Button";

const MAIN_NAV = [
  { label: "Game Features", href: "#game-features", highlight: true },
  { label: "Classes", href: "#classes" },
  { label: "Gallery", href: "#gallery" },
  { label: "Litepaper", href: "#litepaper" },
  { label: "Whitepaper", href: "#whitepaper" },
  { label: "Lore", href: "#lore" },
];

const SECONDARY_NAV = [
  { label: "Marketplace", href: "#marketplace" },
  { label: "Tokens", href: "#tokens" },
  { label: "About", href: "#about" },
];

const SOCIALS = [
  { label: "Twitter", href: "#" },
  { label: "Discord", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Telegram", href: "#" },
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
    <footer className="w-full bg-black border-t border-white/5">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-20 lg:py-24">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          {/* LEFT - Brand + Navigation */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <div className="mb-8">
              <Link href="/" className="inline-block">
                <span className="font-black text-2xl tracking-widest text-[#ffc032] uppercase">
                  Mystic
                </span>
                <span className="font-black text-2xl tracking-widest text-white uppercase">
                  {" "}
                  Journey
                </span>
              </Link>
            </div>

            {/* Main Nav */}
            <nav className="flex flex-col gap-3">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm tracking-wide transition-colors duration-200 ${
                    item.highlight
                      ? "text-[#ffc032] hover:text-white"
                      : "text-white/40 hover:text-[#ffc032]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* MIDDLE - Secondary Links */}
          <div className="lg:col-span-3">
            <nav className="flex flex-col gap-3">
              {SECONDARY_NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-white/40 tracking-wide transition-colors duration-200 hover:text-[#ffc032]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT - Subscribe + Social */}
          <div className="lg:col-span-5">
            <h3 className="mb-5 text-sm font-black tracking-widest text-white/60 uppercase">
              Stay Updated
            </h3>

            {/* Subscribe Form */}
            <form onSubmit={handleSubscribe} className="mb-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-[#ffc032] focus:bg-white/10"
                />
                <Button variant="outline" size="md">SUBSCRIBE</Button>
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-200 hover:border-[#ffc032] hover:bg-[#ffc032]/10 hover:text-[#ffc032]"
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
        <div className="mt-8 flex flex-col gap-4 text-center text-xs text-white/30 md:flex-row md:items-center md:justify-between md:text-left">
          <span>Copyright 2022</span>
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <Link
              href="#"
              className="transition-colors duration-200 hover:text-[#ffc032]"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link
              href="#"
              className="transition-colors duration-200 hover:text-[#ffc032]"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
