"use client";

import AdminTable from "@/components/ui/AdminTable";
import { useRouter } from "next/navigation";

export default function ManageAdminsPage() {
  const router = useRouter();
  
  const columns = [
    { key: "accountId", label: "Account ID" },
    { key: "userName", label: "Username" },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { 
      key: "isActive", 
      label: "Status",
      render: (val: boolean) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${val ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  const mockData = [
    { accountId: "A-001", userName: "admin_super", fullName: "Super Admin", email: "super@mysticjourney.com", isActive: true },
    { accountId: "A-002", userName: "mod_jane", fullName: "Jane Doe", email: "jane@mysticjourney.com", isActive: true },
    { accountId: "A-003", userName: "mod_banned", fullName: "Bad Mod", email: "badmod@mysticjourney.com", isActive: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Admins</h1>
        <p className="text-white/50 text-sm">Manage staff accounts and their permissions.</p>
      </div>
      <AdminTable 
        title="Admin Accounts" 
        columns={columns} 
        data={mockData} 
        onAdd={() => router.push("/manage-admins/create")}
        onEdit={(item) => router.push(`/manage-admins/edit?id=${item.accountId}`)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}
