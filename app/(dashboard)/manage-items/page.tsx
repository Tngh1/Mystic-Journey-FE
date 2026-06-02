"use client";

import AdminTable from "@/components/ui/AdminTable";
import { useRouter } from "next/navigation";

export default function ManageItemsPage() {
  const router = useRouter();
  
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { 
      key: "rarity", 
      label: "Rarity",
      render: (val: string) => {
        const colors: Record<string, string> = {
          Common: "text-gray-400",
          Uncommon: "text-green-400",
          Rare: "text-blue-400",
          Epic: "text-purple-400",
          Legendary: "text-orange-400",
          Mythic: "text-red-400"
        };
        return <span className={`font-semibold ${colors[val] || 'text-white'}`}>{val}</span>;
      }
    },
    { key: "slot", label: "Slot" },
    { key: "baseValue", label: "Base Value" },
    { key: "maxStack", label: "Max Stack" },
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
    { id: 1, name: "Iron Sword", type: "Weapon", rarity: "Common", slot: "Weapon", baseValue: 50, maxStack: 1, isActive: true },
    { id: 2, name: "Health Potion", type: "Consumable", rarity: "Common", slot: "None", baseValue: 10, maxStack: 99, isActive: true },
    { id: 3, name: "Dragon Scale Armor", type: "Armor", rarity: "Legendary", slot: "Armor", baseValue: 5000, maxStack: 1, isActive: true },
    { id: 4, name: "Broken Shield", type: "Armor", rarity: "Common", slot: "Weapon", baseValue: 5, maxStack: 1, isActive: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Items</h1>
        <p className="text-white/50 text-sm">Create and modify game items, weapons, and consumables.</p>
      </div>
      <AdminTable 
        title="Game Items" 
        columns={columns} 
        data={mockData} 
        onAdd={() => router.push("/manage-items/create")}
        onEdit={(item) => router.push(`/manage-items/edit?id=${item.id}`)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}
