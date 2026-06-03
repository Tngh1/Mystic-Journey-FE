"use client";

import AdminTable from "@/components/ui/AdminTable";
import { useRouter } from "next/navigation";

export default function ManageAchievementsPage() {
  const router = useRouter();
  
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Achievement Name" },
    { key: "description", label: "Description" },
    { key: "points", label: "Points" },
    { key: "rewardItem", label: "Reward Item" },
  ];

  const mockData = [
    { id: 1, name: "First Blood", description: "Defeat your first monster.", points: 10, rewardItem: "10 Gems" },
    { id: 2, name: "Max Level", description: "Reach level 100.", points: 100, rewardItem: "Crown of the King" },
    { id: 3, name: "Rich Man", description: "Accumulate 1,000,000 gold.", points: 50, rewardItem: "Golden Ring" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Achievements</h1>
        <p className="text-white/50 text-sm">Manage game achievements and rewards.</p>
      </div>
      <AdminTable 
        title="Achievements List" 
        columns={columns} 
        data={mockData} 
        onAdd={() => router.push("/manage-achievements/create")}
        onEdit={(item) => router.push(`/manage-achievements/edit?id=${item.id}`)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}
