import { ArrowLeft, Lock, Eye, Database, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import MoonHeader from "@/components/ui/MoonHeader";
import { Scroll, Clause, Provisions, Note } from "@/components/ui/LegalScroll";

/* The privacy policy as a charter on parchment — see components/ui/LegalScroll.
   Every word below is the copy the page already carried; only the surface it is
   written on changed. */

const COLLECTED: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Database,
    title: "Personal Information",
    text: "Account credentials, email address, and profile data you provide during registration.",
  },
  {
    icon: Eye,
    title: "Gameplay Data",
    text: "Character progress, inventory, achievements, match history, and in-game statistics.",
  },
  {
    icon: Lock,
    title: "Technical Data",
    text: "Device identifiers, IP address, browser type, and session information.",
  },
];

const USES = [
  "To create and manage your player account and provide customer support.",
  "To detect, prevent, and address cheating, hacking, or any violations of our game rules.",
  "To communicate important updates, maintenance notices, and promotional content.",
  "To analyze player behavior and improve game balance, features, and overall experience.",
  "To comply with legal obligations and protect the rights and safety of our community.",
];

const RIGHTS = [
  "You may access and update your account information at any time through the in-game settings.",
  "You may request deletion of your account and associated data by contacting our support team.",
  "You have the right to opt out of promotional communications at any time.",
];

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh pt-[88px] pb-16 md:pt-[112px]">
      <MoonHeader eyebrow="Legal" icon={Shield} title="Privacy Policy">
        Last updated: July 8, 2026
      </MoonHeader>

      <Scroll>
        <Clause n={1} title="Introduction">
          <Note>
            Mystic Journey is committed to protecting your privacy. This Privacy Policy explains how
            we collect, use, disclose, and safeguard your information when you play our game and use
            our services. Please read this policy carefully. By using Mystic Journey, you consent to
            the data practices described herein.
          </Note>
        </Clause>

        <Clause n={2} title="Information We Collect">
          <p>
            We gather various types of information to enhance your gaming experience and ensure fair
            gameplay for all adventurers.
          </p>
          {/* Three inked plates rather than the old blue/purple/amber pads: the
              sigil carries no meaning of its own, so it takes the sheet's own ink
              instead of three colours borrowed from outside the system. */}
          <ul className="grid gap-3 pt-1 sm:grid-cols-3">
            {COLLECTED.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="border-2 border-on-parchment/25 bg-parchment-dim/50 p-4 text-center shadow-[3px_3px_0_rgb(59_42_23_/_0.20)]"
              >
                <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center border-2 border-black/50 bg-on-parchment text-parchment">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-sm font-black uppercase tracking-[0.12em] text-on-parchment">
                  {title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-snug">{text}</p>
              </li>
            ))}
          </ul>
        </Clause>

        <Clause n={3} title="How We Use Your Information">
          <Provisions items={USES} />
        </Clause>

        <Clause n={4} title="Data Security">
          <Note>
            We employ industry-standard encryption and security protocols to protect your personal
            data. Passwords are hashed using bcrypt, and all data transmissions occur over secure
            HTTPS connections. While we strive to safeguard your information, no method of
            transmission over the Internet is 100% secure, and we cannot guarantee absolute
            security.
          </Note>
        </Clause>

        <Clause n={5} title="Cookies & Tracking">
          <Note>
            Mystic Journey uses cookies and similar technologies to maintain your login session,
            remember your preferences, and analyze game performance. You may disable cookies through
            your browser settings, though doing so may affect certain game functionalities.
          </Note>
        </Clause>

        <Clause n={6} title="Your Rights">
          <Provisions items={RIGHTS} />
        </Clause>

        <Clause n={7} title="Contact Us">
          <Note>
            If you have any questions or concerns about this Privacy Policy, please contact our Data
            Protection Officer at privacy@mysticjourney.game or through our in-game support system.
          </Note>
        </Clause>
      </Scroll>

      {/* The way back sits below the sheet, on the dark ground, where gold is the
          one thing meaning "act on this" — inside the parchment it would be
          1.7:1 and unreadable. */}
      <div className="flex justify-center px-4">
        <Link
          href="/register"
          className="pixel-press flex min-h-11 items-center gap-2 border-2 border-accent bg-transparent px-5 text-sm font-black uppercase tracking-widest text-accent shadow-[3px_3px_0_rgb(0_0_0_/_0.5)] hover:bg-accent hover:text-on-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Return to Registration
        </Link>
      </div>
    </div>
  );
}
