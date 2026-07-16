"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimatedButton from "./AnimatedButton";
import { useAuth } from "@/lib/contexts/AuthContext";

const NAV_ITEMS = [
  { label: "Story", href: "/story" },
  { label: "Content", href: "/content" },
  { label: "Download", href: "/download" },
];

const ROLE_NAMES: Record<string, string> = {
  Player: "Player",
  Admin: "Admin",
  SuperAdmin: "SuperAdmin",
};

export default function Header() {
  const { user, logout } = useAuth();
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

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20'
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative w-24 h-12 md:w-32 md:h-16">
          <Image
            src="/images/logo/logo.png"
            alt="Mystic Journey Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative text-white font-semibold text-sm md:text-base tracking-wide hover:text-yellow-400 transition-colors duration-300 group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {/* Wiki Link (no dropdown) */}
          <Link
            href="/wiki"
            className="relative text-white font-semibold text-sm md:text-base tracking-wide hover:text-yellow-400 transition-colors duration-300 group"
          >
            Wiki
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        {/* Right Side - User Menu or Login Button */}
        <div className="hidden md:block">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#ffc032] to-[#ca831f] rounded-full text-white shadow-lg hover:shadow-[#ffc032]/20 hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-white/20 hover:border-white/50"
                aria-label="User Menu"
              >
                <span className="text-base font-bold">
                  {user.userName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-semibold text-sm truncate">{user.userName}</p>
                    <p className="text-white/50 text-xs truncate">@{user.userName}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#ffc032]/20 text-[#ffc032] text-xs rounded-full font-medium">
                      {ROLE_NAMES[user.role] || user.role}
                    </span>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/account/profile"
                      className="w-full px-4 py-2.5 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-white/80 hover:text-white hover:bg-red-500/15 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <AnimatedButton size="sm">Login</AnimatedButton>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-lg border-t border-white/10 p-4">
          <nav className="flex flex-col space-y-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white font-semibold text-base hover:text-yellow-400 transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/wiki"
              className="text-white font-semibold text-base hover:text-yellow-400 transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Wiki
            </Link>
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#ffc032] to-[#ca831f] rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {user.userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{user.userName}</p>
                      <p className="text-white/50 text-xs">@{user.userName}</p>
                    </div>
                  </div>
                  <Link
                    href="/account/profile"
                    className="w-full px-4 py-2.5 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm flex items-center gap-2 rounded-lg cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-white/80 hover:text-white hover:bg-red-500/15 transition-colors text-sm flex items-center gap-2 rounded-lg cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
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
