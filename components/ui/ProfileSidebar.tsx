"use client";

import { User, Settings, ShieldCheck, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/transactions", label: "Transactions", icon: CreditCard },
  { href: "/account/setting", label: "Settings", icon: Settings },
  { href: "/account/security", label: "Password & Security", icon: ShieldCheck },
];

/**
 * The account nav as a row of pennants hung from one rod — the textile idiom the
 * rest of `/account` is built from (see `components/ui/Tapestry.tsx`), rather
 * than the wooden tab-stack it used to be. The wood belonged to the wiki.
 *
 * Each entry is a small hanging: cloth on a hook, the open one dyed and inked in
 * gold with a gilt bar down its inner edge and a tail notched into its foot.
 *
 * The open page is marked four ways — `aria-current`, the dye, the gold ink and
 * the edge bar — so it never rests on colour alone. Rows are `h-11`, the touch
 * floor.
 */
export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit w-full shrink-0 md:w-60">
      {/* The rod the pennants hang from, matching Tapestry's. */}
      <div className="flex items-center" aria-hidden="true">
        <span className="h-3.5 w-3.5 shrink-0 border-2 border-black/60 bg-iron-light" />
        <span className="h-2 flex-1 border-y-2 border-black/60 bg-iron-light shadow-[inset_0_1px_0_rgb(255_255_255_/_0.28)]" />
        <span className="h-3.5 w-3.5 shrink-0 border-2 border-black/60 bg-iron-light" />
      </div>

      <div className="tapestry mx-1.5 border-x-2 border-b-2 border-black/70 bg-heraldry-royal p-2 shadow-[4px_4px_0_rgb(0_0_0_/_0.5)]">
        {/* Not a heading: this column renders before the page's h1 in the DOM, so an
            <h2> here would put the document's first heading at level 2 and open a
            section that outranks the page title. It names the nav instead. */}
        <p
          id="account-nav-label"
          className="px-1 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-parchment-dim"
        >
          Account
        </p>
        <nav aria-labelledby="account-nav-label">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "pixel-press relative flex h-11 items-center gap-3 border-2 px-3 transition-colors",
                      isActive
                        ? "border-accent-deep bg-black/40 text-accent"
                        : "border-transparent text-parchment hover:border-accent-deep/50 hover:bg-black/20 hover:text-accent",
                    ].join(" ")}
                  >
                    {/* The gilt edge marker on the open pennant. */}
                    {isActive && (
                      <span
                        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-accent"
                        aria-hidden="true"
                      />
                    )}
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className={`truncate text-sm ${isActive ? "font-bold" : ""}`}>
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div
        className="mx-1.5 h-3 bg-accent-deep/70 [mask-image:repeating-linear-gradient(to_right,#000_0_3px,transparent_3px_7px)]"
        aria-hidden="true"
      />
    </aside>
  );
}
