"use client";

import AdminTable from "@/components/ui/AdminTable";
import { useRouter } from "next/navigation";

export default function ManageDungeonsPage() {
  const router = useRouter();
  
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Dungeon Name" },
    { key: "reqLevel", label: "Required Level" },
    { key: "energyCost", label: "Energy Cost" },
    { key: "maxPlayers", label: "Max Players" },
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
    { id: 1, name: "Goblin Cave", reqLevel: 5, energyCost: 10, maxPlayers: 4, isActive: true },
    { id: 2, name: "Dragon's Lair", reqLevel: 30, energyCost: 25, maxPlayers: 8, isActive: true },
    { id: 3, name: "Abyssal Rift", reqLevel: 50, energyCost: 40, maxPlayers: 12, isActive: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Dungeons</h1>
        <p className="text-white/50 text-sm">Configure dungeon settings, requirements, and capacity.</p>
      </div>
      <AdminTable 
        title="Dungeon Configurations" 
        columns={columns} 
        data={mockData} 
        onAdd={() => router.push("/manage-dungeons/create")}
        onEdit={(item) => router.push(`/manage-dungeons/edit?id=${item.id}`)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}
