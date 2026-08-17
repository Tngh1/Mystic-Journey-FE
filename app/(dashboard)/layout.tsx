import "../globals.css";
import AdminSideBar from "@/components/ui/AdminSideBar";
import AdminTopBar from "@/components/ui/AdminTopBar";
import { SidebarProvider } from "@/lib/contexts/SidebarContext";

// Renders the dashboard layout view component.
// Returns the JSX element hierarchy for the page view.
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
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
