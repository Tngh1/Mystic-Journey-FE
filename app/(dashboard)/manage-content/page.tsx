"use client";

import AdminTable from "@/components/ui/AdminTable";
import { useRouter } from "next/navigation";

export default function ManageContentPage() {
  const router = useRouter();
  
  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { 
      key: "isActive", 
      label: "Status",
      render: (val: boolean) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${val ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: "createdAt", label: "Created At" },
  ];

  const mockData = [
    { id: 1, title: "Getting Started Guide", category: "Guides", isActive: true, createdAt: "2024-01-10" },
    { id: 2, title: "Class Overview", category: "Wiki", isActive: true, createdAt: "2024-01-15" },
    { id: 3, title: "Easter Event 2024", category: "Events", isActive: false, createdAt: "2024-03-20" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Content</h1>
        <p className="text-white/50 text-sm">Manage wiki contents, guides, and other CMS blocks.</p>
      </div>
      <AdminTable 
        title="Content List" 
        columns={columns} 
        data={mockData} 
        onAdd={() => router.push("/manage-content/create")}
        onEdit={(item) => router.push(`/manage-content/edit?id=${item.id}`)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}
