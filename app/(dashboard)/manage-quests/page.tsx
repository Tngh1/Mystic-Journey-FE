"use client";

import AdminTable from "@/components/ui/AdminTable";
import { useRouter } from "next/navigation";

export default function ManageQuestsPage() {
  const router = useRouter();
  
  const columns = [
    { key: "id", label: "ID" },
    { key: "title", label: "Quest Title" },
    { 
      key: "type", 
      label: "Type",
      render: (val: string) => {
        const colors: Record<string, string> = {
          Main: "text-purple-400 bg-purple-400/10",
          Side: "text-blue-400 bg-blue-400/10",
          Daily: "text-green-400 bg-green-400/10",
        };
        return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[val] || ''}`}>{val}</span>;
      }
    },
    { key: "reqLevel", label: "Req Level" },
    { key: "expReward", label: "EXP Reward" },
    { key: "goldReward", label: "Gold Reward" },
  ];

  const mockData = [
    { id: 1, title: "A Hero's Beginning", type: "Main", reqLevel: 1, expReward: 100, goldReward: 50 },
    { id: 2, title: "Clear the Rats", type: "Side", reqLevel: 2, expReward: 50, goldReward: 20 },
    { id: 3, title: "Daily Login", type: "Daily", reqLevel: 1, expReward: 10, goldReward: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Quests</h1>
        <p className="text-white/50 text-sm">Create and modify quests and their rewards.</p>
      </div>
      <AdminTable 
        title="Quests List" 
        columns={columns} 
        data={mockData} 
        onAdd={() => router.push("/manage-quests/create")}
        onEdit={(item) => router.push(`/manage-quests/edit?id=${item.id}`)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}
