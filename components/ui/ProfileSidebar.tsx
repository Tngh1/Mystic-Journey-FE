"use client";

import { 
  User, Link as LinkIcon, Mail, ShieldCheck, FileText, 
  CreditCard, Clock, Tag, CircleDollarSign, Award, Ticket, 
  Users, Star, Building 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 h-fit flex-shrink-0 flex flex-col gap-8 bg-white/10 border border-white/10 md:p-6 rounded-xl">
      {/* Group 1 */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Account</h3>
        <ul className="space-y-1 text-sm font-medium">
          <li>
            <Link 
              href="/account/profile" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                pathname === "/account/profile" ? "bg-white/10 text-white" : "hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <User className={`w-4 h-4 ${pathname === "/account/profile" ? "text-[#ffc032]" : ""}`} />
              Settings
            </Link>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-md transition-colors cursor-pointer">
              <LinkIcon className="w-4 h-4" />
              Linked Accounts
            </a>
          </li>
          <li>
            <Link 
              href="/account/security" 
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                pathname === "/account/security" ? "bg-white/10 text-white" : "hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${pathname === "/account/security" ? "text-[#ffc032]" : ""}`} />
              Password & Security
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
