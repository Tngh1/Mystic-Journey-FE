"use client";

import AdminTable from "@/components/ui/AdminTable";
import { useRouter } from "next/navigation";

export default function ManageGachaPoolsPage() {
  const router = useRouter();
  
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Banner Name" },
    { key: "type", label: "Type" },
    { key: "cost", label: "Pull Cost (Gems)" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
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
    { id: 1, name: "Standard Banner", type: "Standard", cost: 160, startDate: "2024-01-01", endDate: "2099-12-31", isActive: true },
    { id: 2, name: "Dragon Knight Awakening", type: "Event", cost: 160, startDate: "2024-03-01", endDate: "2024-03-20", isActive: true },
    { id: 3, name: "Winter Festival", type: "Event", cost: 120, startDate: "2023-12-15", endDate: "2024-01-05", isActive: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Gacha Pools</h1>
        <p className="text-white/50 text-sm">Configure banners, drop rates, and costs for the gacha system.</p>
      </div>
      <AdminTable 
        title="Gacha Banners" 
        columns={columns} 
        data={mockData} 
        onAdd={() => router.push("/manage-gacha-pools/create")}
        onEdit={(item) => router.push(`/manage-gacha-pools/edit?id=${item.id}`)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}
