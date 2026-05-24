import { FileText, ArrowRight } from "lucide-react";
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
              <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
              <p className="text-white/60">Last updated: May 24, 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">1.</span> Acceptance of Terms
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                By accessing and using Mystic Journey, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this service, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">2.</span> User Accounts
              </h2>
              <ul className="space-y-3 pl-4">
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>You must be at least 13 years old to use this Service.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>You are responsible for maintaining the confidentiality of your account and password.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>You agree to accept responsibility for all activities that occur under your account.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">3.</span> In-Game Conduct
              </h2>
              <p className="mb-4">
                We strive to create a welcoming and fair environment for all players. The following behaviors are strictly prohibited:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h3 className="font-semibold text-[#ffc032] mb-2">Cheating</h3>
                  <p className="text-sm">Using third-party software, bots, or exploiting bugs to gain an unfair advantage.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <h3 className="font-semibold text-[#ffc032] mb-2">Harassment</h3>
                  <p className="text-sm">Any form of harassment, hate speech, or toxic behavior towards other players.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">4.</span> Termination
              </h2>
              <p>
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <div className="pt-8 mt-8 border-t border-white/10 flex justify-center">
              <Link href="/register" className="text-[#ffc032] hover:text-[#ffc032] font-semibold transition-colors flex items-center gap-2">
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
