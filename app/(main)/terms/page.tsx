import { FileText, AlertTriangle, Gavel, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#ffc032]/20 flex items-center justify-center text-[#ffc032]">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
              <p className="text-white/60">Last updated: July 8, 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">1.</span> Acceptance of Terms
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                Welcome to Mystic Journey. By downloading, installing, or using our game, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services. Your continued use of the game constitutes acceptance of any updates or modifications to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">2.</span> Account Registration
              </h2>
              <ul className="space-y-3 pl-4">
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>You must be at least 13 years of age to create an account. Users under 18 require parental consent.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>You are solely responsible for maintaining the confidentiality of your login credentials.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>One account per player. Sharing or selling accounts is strictly prohibited.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>You agree to provide accurate and complete information during registration.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">3.</span> Prohibited Conduct
              </h2>
              <p className="mb-4">
                To maintain a fair and enjoyable environment for all adventurers, the following activities are strictly forbidden and may result in account suspension or permanent ban:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-red-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-red-400">Cheating & Exploits</h3>
                  </div>
                  <p className="text-sm">Using hacks, bots, macros, game bugs, or any third-party software to gain unfair advantage.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-red-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-red-400">Harassment & Abuse</h3>
                  </div>
                  <p className="text-sm">Hate speech, discrimination, threats, doxxing, or any form of bullying directed at other players.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-red-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-red-400">Real Money Trading</h3>
                  </div>
                  <p className="text-sm">Selling, buying, or trading in-game currency, items, or accounts for real currency.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-red-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-red-400">Impersonation</h3>
                  </div>
                  <p className="text-sm">Pretending to be staff members, other players, or affiliated organizations.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">4.</span> Virtual Items & Currency
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                All in-game items, currency, characters, and achievements are virtual goods owned by Mystic Journey and licensed to you for use within the game. These virtual goods have no real-world value and cannot be exchanged for cash. We reserve the right to modify, remove, or reset virtual items at any time without compensation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">5.</span> Intellectual Property
              </h2>
              <ul className="space-y-3 pl-4">
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>All game content, including characters, artwork, music, and story, is the property of Mystic Journey.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>You may not copy, modify, distribute, or create derivative works based on game content.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>Streaming or posting gameplay is permitted for personal, non-commercial purposes with attribution.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">6.</span> Service Availability
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                Mystic Journey may experience downtime for maintenance, updates, or unforeseen circumstances. We do not guarantee uninterrupted service. We reserve the right to modify, suspend, or discontinue any aspect of the game at any time with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">7.</span> Account Termination
              </h2>
              <ul className="space-y-3 pl-4">
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>We may terminate or suspend accounts that violate these Terms immediately and without prior notice.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>Terminated accounts forfeit all virtual items, currency, and access to the game.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>You may request account deletion at any time by contacting support.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">8.</span> Limitation of Liability
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                To the fullest extent permitted by law, Mystic Journey shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the game. Your use of the game is at your sole risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">9.</span> Governing Law
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Mystic Journey operates, without regard to its conflict of law provisions. Any disputes shall be resolved through binding arbitration or in the courts of competent jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">10.</span> Contact
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                For questions regarding these Terms & Conditions, please reach out to our support team at legal@mysticjourney.game or use the in-game help center.
              </p>
            </section>

            <div className="pt-8 mt-8 border-t border-white/10 flex justify-center">
              <Link href="/register" className="text-[#ffc032] hover:text-[#ffd966] font-semibold transition-colors flex items-center gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Return to Registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
