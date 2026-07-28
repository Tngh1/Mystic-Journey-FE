import "../globals.css";
import AdminSideBar from "@/components/ui/AdminSideBar";
import AdminTopBar from "@/components/ui/AdminTopBar";
import { SidebarProvider } from "@/lib/contexts/SidebarContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      {/* The keep's armoury floor. This was `stone-wall` — warm quarried brown —
          with wood panels standing on it, which made every admin screen read as
          a tavern table. Wood belongs to the wiki and the story; admin work is
          plate steel on cold flagstone, so the dashboard gets `forge-floor` and
          its panels are cut in iron. */}
      <div className="forge-floor flex min-h-dvh text-fg">
        <AdminSideBar />
        <div className="flex min-h-dvh flex-1 flex-col lg:ml-64">
          <AdminTopBar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}