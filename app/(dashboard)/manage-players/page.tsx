"use client";

import AdminTable from "@/components/ui/AdminTable";
import { useRouter } from "next/navigation";

export default function ManagePlayersPage() {
  const router = useRouter();
  
  const columns = [
    { key: "id", label: "ID" },
    { key: "displayName", label: "Display Name" },
    { key: "class", label: "Class" },
    { key: "level", label: "Level" },
    { key: "exp", label: "EXP" },
    { key: "gold", label: "Gold" },
    { key: "gems", label: "Gems" },
    { key: "energy", label: "Energy" },
    { key: "createdAt", label: "Created At" },
  ];

  const mockData = [
    { id: 1, displayName: "Hero123", class: "Knight", level: 10, exp: 4500, gold: 1200.5, gems: 50, energy: 80, createdAt: "2024-03-01" },
    { id: 2, displayName: "MageKing", class: "Mage", level: 25, exp: 12000, gold: 5400, gems: 300, energy: 100, createdAt: "2024-02-15" },
    { id: 3, displayName: "ShadowHunter", class: "Archer", level: 18, exp: 8900, gold: 3200, gems: 120, energy: 95, createdAt: "2024-02-28" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Players</h1>
        <p className="text-white/50 text-sm">View and manage all player profiles in the game.</p>
      </div>
      <AdminTable 
        title="Player Profiles" 
        columns={columns} 
        data={mockData} 
        onEdit={(item) => router.push(`/manage-players/edit?id=${item.id}`)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}
