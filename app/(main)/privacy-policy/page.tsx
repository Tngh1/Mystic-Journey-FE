import { Shield, ArrowRight, Lock, Eye, Database } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#ffc032]/20 flex items-center justify-center text-[#ffc032]">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
              <p className="text-white/60">Last updated: May 24, 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">1.</span> Information We Collect
              </h2>
              <p className="mb-6">
                When you interact with Mystic Journey, we collect information that helps us provide you with the best possible gaming experience.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-5 rounded-xl border border-white/5 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Account Data</h3>
                  <p className="text-sm text-white/60">Email, username, full name, and encrypted password.</p>
                </div>
                
                <div className="bg-white/5 p-5 rounded-xl border border-white/5 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Usage Data</h3>
                  <p className="text-sm text-white/60">Game progress, playtime, and interactions with other players.</p>
                </div>
                
                <div className="bg-white/5 p-5 rounded-xl border border-white/5 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Security Data</h3>
                  <p className="text-sm text-white/60">IP addresses, login timestamps, and device information.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">2.</span> How We Use Your Information
              </h2>
              <ul className="space-y-3 pl-4">
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>To provide, maintain, and improve our services and your gameplay experience.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>To send you technical notices, updates, security alerts, and support messages.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>To monitor and analyze trends, usage, and activities in connection with our Services.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">3.</span> Data Protection
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                We implement a variety of security measures to maintain the safety of your personal information. Your password is encrypted and we do not store plaintext passwords on our servers. Access to your personal information is restricted to authorized personnel only.
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
