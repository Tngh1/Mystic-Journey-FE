import { ArrowLeft, AlertTriangle, Gavel } from "lucide-react";
import Link from "next/link";
import MoonHeader from "@/components/ui/MoonHeader";
import { Scroll, Clause, Provisions, Note } from "@/components/ui/LegalScroll";


const REGISTRATION = [
  "You must be at least 13 years of age to create an account. Users under 18 require parental consent.",
  "You are solely responsible for maintaining the confidentiality of your login credentials.",
  "One account per player. Sharing or selling accounts is strictly prohibited.",
  "You agree to provide accurate and complete information during registration.",
];

const PROHIBITED = [
  {
    title: "Cheating & Exploits",
    text: "Using hacks, bots, macros, game bugs, or any third-party software to gain unfair advantage.",
  },
  {
    title: "Harassment & Abuse",
    text: "Hate speech, discrimination, threats, doxxing, or any form of bullying directed at other players.",
  },
  {
    title: "Real Money Trading",
    text: "Selling, buying, or trading in-game currency, items, or accounts for real currency.",
  },
  {
    title: "Impersonation",
    text: "Pretending to be staff members, other players, or affiliated organizations.",
  },
];

const PROPERTY = [
  "All game content, including characters, artwork, music, and story, is the property of Mystic Journey.",
  "You may not copy, modify, distribute, or create derivative works based on game content.",
  "Streaming or posting gameplay is permitted for personal, non-commercial purposes with attribution.",
];

const TERMINATION = [
  "We may terminate or suspend accounts that violate these Terms immediately and without prior notice.",
  "Terminated accounts forfeit all virtual items, currency, and access to the game.",
  "You may request account deletion at any time by contacting support.",
];

// Renders the terms page view component.
// Returns the JSX element hierarchy for the page view.
export default function TermsPage() {
  return (
    <div className="min-h-dvh pt-[88px] pb-16 md:pt-[112px]">
      <MoonHeader eyebrow="Legal" icon={Gavel} title="Terms &amp; Conditions">
        Last updated: July 8, 2026
      </MoonHeader>

      <Scroll>
        <Clause n={1} title="Acceptance of Terms">
          <Note>
            Welcome to Mystic Journey. By downloading, installing, or using our game, you agree to be
            bound by these Terms &amp; Conditions. If you do not agree to these terms, please do not
            use our services. Your continued use of the game constitutes acceptance of any updates or
            modifications to these terms.
          </Note>
        </Clause>

        <Clause n={2} title="Account Registration">
          <Provisions items={REGISTRATION} />
        </Clause>

        <Clause n={3} title="Prohibited Conduct">
          <p>
            To maintain a fair and enjoyable environment for all adventurers, the following
            activities are strictly forbidden and may result in account suspension or permanent ban:
          </p>
          <ul className="grid gap-3 pt-1 sm:grid-cols-2">
            {PROHIBITED.map(({ title, text }) => (
              <li
                key={title}
                className="border-2 border-on-parchment/25 bg-parchment-dim/50 p-4 shadow-[3px_3px_0_rgb(59_42_23_/_0.20)]"
              >
                <h3 className="flex items-center gap-2.5 text-sm font-black uppercase tracking-[0.1em] text-on-parchment">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-black/50 bg-heraldry-crimson text-parchment">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {title}
                </h3>
                <p className="mt-2 text-[13px] leading-snug">{text}</p>
              </li>
            ))}
          </ul>
        </Clause>

        <Clause n={4} title="Virtual Items & Currency">
          <Note>
            All in-game items, currency, characters, and achievements are virtual goods owned by
            Mystic Journey and licensed to you for use within the game. These virtual goods have no
            real-world value and cannot be exchanged for cash. We reserve the right to modify,
            remove, or reset virtual items at any time without compensation.
          </Note>
        </Clause>

        <Clause n={5} title="Intellectual Property">
          <Provisions items={PROPERTY} />
        </Clause>

        <Clause n={6} title="Service Availability">
          <Note>
            Mystic Journey may experience downtime for maintenance, updates, or unforeseen
            circumstances. We do not guarantee uninterrupted service. We reserve the right to modify,
            suspend, or discontinue any aspect of the game at any time with or without notice.
          </Note>
        </Clause>

        <Clause n={7} title="Account Termination">
          <Provisions items={TERMINATION} />
        </Clause>

        <Clause n={8} title="Limitation of Liability">
          <Note>
            To the fullest extent permitted by law, Mystic Journey shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages resulting from your use
            of or inability to use the game. Your use of the game is at your sole risk.
          </Note>
        </Clause>

        <Clause n={9} title="Governing Law">
          <Note>
            These Terms shall be governed by and construed in accordance with the laws of the
            jurisdiction in which Mystic Journey operates, without regard to its conflict of law
            provisions. Any disputes shall be resolved through binding arbitration or in the courts
            of competent jurisdiction.
          </Note>
        </Clause>

        <Clause n={10} title="Contact">
          <Note>
            For questions regarding these Terms &amp; Conditions, please reach out to our support team
            at legal@mysticjourney.game or use the in-game help center.
          </Note>
        </Clause>
      </Scroll>

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
