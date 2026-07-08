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
              <p className="text-white/60">Last updated: July 8, 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">1.</span> Introduction
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                Mystic Journey is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you play our game and use our services. Please read this policy carefully. By using Mystic Journey, you consent to the data practices described herein.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">2.</span> Information We Collect
              </h2>
              <p className="mb-6">
                We gather various types of information to enhance your gaming experience and ensure fair gameplay for all adventurers.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-5 rounded-xl border border-white/5 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Personal Information</h3>
                  <p className="text-sm text-white/60">Account credentials, email address, and profile data you provide during registration.</p>
                </div>
                
                <div className="bg-white/5 p-5 rounded-xl border border-white/5 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Gameplay Data</h3>
                  <p className="text-sm text-white/60">Character progress, inventory, achievements, match history, and in-game statistics.</p>
                </div>
                
                <div className="bg-white/5 p-5 rounded-xl border border-white/5 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Technical Data</h3>
                  <p className="text-sm text-white/60">Device identifiers, IP address, browser type, and session information.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">3.</span> How We Use Your Information
              </h2>
              <ul className="space-y-3 pl-4">
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>To create and manage your player account and provide customer support.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>To detect, prevent, and address cheating, hacking, or any violations of our game rules.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>To communicate important updates, maintenance notices, and promotional content.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>To analyze player behavior and improve game balance, features, and overall experience.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>To comply with legal obligations and protect the rights and safety of our community.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">4.</span> Data Security
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                We employ industry-standard encryption and security protocols to protect your personal data. Passwords are hashed using bcrypt, and all data transmissions occur over secure HTTPS connections. While we strive to safeguard your information, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">5.</span> Cookies & Tracking
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                Mystic Journey uses cookies and similar technologies to maintain your login session, remember your preferences, and analyze game performance. You may disable cookies through your browser settings, though doing so may affect certain game functionalities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">6.</span> Your Rights
              </h2>
              <ul className="space-y-3 pl-4">
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>You may access and update your account information at any time through the in-game settings.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>You may request deletion of your account and associated data by contacting our support team.</span>
                </li>
                <li className="flex gap-3">
                  <ArrowRight className="w-5 h-5 text-[#ffc032] shrink-0 mt-0.5" />
                  <span>You have the right to opt out of promotional communications at any time.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#ffc032]">7.</span> Contact Us
              </h2>
              <p className="bg-white/5 p-4 rounded-xl border border-white/5">
                If you have any questions or concerns about this Privacy Policy, please contact our Data Protection Officer at privacy@mysticjourney.game or through our in-game support system.
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
