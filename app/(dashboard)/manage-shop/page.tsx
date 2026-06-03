"use client";

import AdminTable from "@/components/ui/AdminTable";
import { useRouter } from "next/navigation";

export default function ManageShopPage() {
  const router = useRouter();
  
  const columns = [
    { key: "id", label: "ID" },
    { key: "itemName", label: "Item Name" },
    { key: "price", label: "Price" },
    { key: "currencyType", label: "Currency Type" },
    { key: "stock", label: "Stock" },
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
    { id: 1, itemName: "Health Potion (L)", price: 500, currencyType: "Gold", stock: -1, isActive: true },
    { id: 2, itemName: "10x Summon Ticket", price: 1500, currencyType: "Gems", stock: 5, isActive: true },
    { id: 3, itemName: "Starter Pack", price: 4.99, currencyType: "USD", stock: 1, isActive: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Shop</h1>
        <p className="text-white/50 text-sm">Manage shop items, pricing, and availability.</p>
      </div>
      <AdminTable 
        title="Shop Items" 
        columns={columns} 
        data={mockData} 
        onAdd={() => router.push("/manage-shop/create")}
        onEdit={(item) => router.push(`/manage-shop/edit?id=${item.id}`)}
        onDelete={(item) => console.log("Delete", item)}
      />
    </div>
  );
}
