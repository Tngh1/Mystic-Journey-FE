"use client";

import AdminTable from "@/components/ui/AdminTable";
import { useRouter } from "next/navigation";

export default function ManageMonstersPage() {
  const router = useRouter();
  
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { 
      key: "type", 
      label: "Type",
      render: (val: string) => {
        const colors: Record<string, string> = {
          Normal: "text-gray-300 bg-gray-500/10",
          Elite: "text-blue-400 bg-blue-400/10",
          Boss: "text-red-400 bg-red-400/10",
        };
        return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[val] || ''}`}>{val}</span>;
      }
    },
    { key: "level", label: "Level" },
    { key: "maxHp", label: "Max HP" },
    { key: "atk", label: "ATK" },
    { key: "def", label: "DEF" },
    { key: "expReward", label: "EXP Reward" },
    { key: "goldReward", label: "Gold Reward" },
  ];

  const mockData = [
    { id: 1, name: "Slime", type: "Normal", level: 1, maxHp: 50, atk: 5, def: 2, expReward: 10, goldReward: 5 },
    { id: 2, name: "Goblin Warrior", type: "Normal", level: 5, maxHp: 150, atk: 15, def: 10, expReward: 35, goldReward: 15 },
    { id: 3, name: "Orc Captain", type: "Elite", level: 15, maxHp: 800, atk: 50, def: 40, expReward: 150, goldReward: 50 },
    { id: 4, name: "Dragon King", type: "Boss", level: 50, maxHp: 15000, atk: 350, def: 200, expReward: 5000, goldReward: 2000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Monsters</h1>
        <p className="text-white/50 text-sm">Configure monster stats, types, and rewards.</p>
      </div>
      <AdminTable 
        title="Monsters List" 
        columns={columns} 
        data={mockData} 
        onAdd={() => router.push("/manage-monsters/create")}
        onEdit={(item) => router.push(`/manage-monsters/edit?id=${item.id}`)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}
