import "../globals.css";
import AdminSideBar from "@/components/ui/AdminSideBar";
import AdminTopBar from "@/components/ui/AdminTopBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#111111] text-white">
      <AdminSideBar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <AdminTopBar />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
