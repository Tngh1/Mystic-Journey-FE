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
      <div className="flex min-h-screen  text-white">
        <AdminSideBar />
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          <AdminTopBar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}