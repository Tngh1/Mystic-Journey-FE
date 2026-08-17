"use client";

import Link from "next/link";
import { Settings, ScrollText, MapPin } from "lucide-react";
import ProfileSidebar from "@/components/ui/ProfileSidebar";
import Panel from "@/components/ui/Panel";
import Tapestry from "@/components/ui/Tapestry";
import { useAuth } from "@/lib/contexts/AuthContext";


// Renders the ledger row view component.
// Returns the JSX element hierarchy for the page view.
function LedgerRow({
  label,
  value,
  mono,
  last,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-3 py-2.5 ${last ? "" : "border-b border-black/35"}`}
    >
      <span className="text-[11px] font-bold uppercase tracking-widest text-parchment-dim">
        {label}
      </span>
      <span className={`text-sm font-bold text-parchment ${mono ? "font-mono tabular-nums" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// Renders the ledger panel view component.
// Returns the JSX element hierarchy for the page view.
function LedgerPanel({
  id,
  title,
  icon,
  rows,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  rows: { label: string; value: React.ReactNode; mono?: boolean }[];
}) {
  return (
    <Tapestry
      as="section"
      aria-labelledby={id}
      dye="crimson"
      title={title}
      titleId={id}
      icon={icon}
      bodyClassName="p-2"
    >
      <div className="border-2 border-black/50 bg-black/25 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.4)]">
        {rows.map((r, i) => (
          <LedgerRow key={r.label} {...r} last={i === rows.length - 1} />
        ))}
      </div>
    </Tapestry>
  );
}

// Renders the account setting page view component.
// Returns the JSX element hierarchy for the page view.
export default function AccountSettingPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 pt-[88px] pb-16 md:pt-[112px]">
        <Panel material="iron" role="alert" className="w-full max-w-md p-8 text-center">
          <h1 className="mb-3 text-2xl font-bold text-parchment">Not Authenticated</h1>
          <p className="mb-6 text-sm text-parchment-dim">Sign in to read your account record.</p>
          <Link
            href="/login"
            className="pixel-press flex min-h-11 w-full items-center justify-center border-2 border-accent bg-accent text-sm font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover"
          >
            Login
          </Link>
        </Panel>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pt-[88px] pb-16 md:pt-[112px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 md:flex-row md:gap-8 md:px-6">
        <ProfileSidebar />

        <main className="min-w-0 flex-1">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-accent">
              <Settings className="h-3.5 w-3.5" aria-hidden="true" /> Settings
            </span>
            <span className="h-0.5 w-12 bg-accent/60" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-fg md:text-4xl">Settings</h1>
          <p className="mb-8 text-sm text-fg-muted">
            What the archive has on record for your account.
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            <LedgerPanel
              id="account-info"
              title="Account"
              icon={<ScrollText className="h-4 w-4 text-accent" aria-hidden="true" />}
              rows={[
                { label: "Account ID", value: user.accountId, mono: true },
                { label: "Username", value: `@${user.userName}` },
                { label: "Email", value: user.email },
                { label: "Role", value: user.role },
              ]}
            />

            <LedgerPanel
              id="last-position"
              title="Last Seen"
              icon={<MapPin className="h-4 w-4 text-accent" aria-hidden="true" />}
              rows={[
                { label: "Map", value: user.lastMapName },
                { label: "Position X", value: user.positionX, mono: true },
                { label: "Position Y", value: user.positionY, mono: true },
              ]}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
