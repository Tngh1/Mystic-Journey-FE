"use client";

import { useState } from "react";
import { Search, Plus, Eye, Edit2, RefreshCw, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface GameConfig {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  description: string;
  isActive: boolean;
  updatedAt: string;
}

const mockConfigs: GameConfig[] = [
  { id: "1", key: "MAX_LEVEL", value: "100", type: "number", category: "Player", description: "Maximum player level in game", isActive: true, updatedAt: "2024-03-01" },
  { id: "2", key: "INITIAL_GOLD", value: "500", type: "number", category: "Player", description: "Starting gold for new players", isActive: true, updatedAt: "2024-03-01" },
  { id: "3", key: "INITIAL_GEMS", value: "50", type: "number", category: "Player", description: "Starting gems for new players", isActive: true, updatedAt: "2024-03-01" },
  { id: "4", key: "MAX_ENERGY", value: "100", type: "number", category: "Energy", description: "Maximum energy capacity", isActive: true, updatedAt: "2024-02-28" },
  { id: "5", key: "ENERGY_REGEN_RATE", value: "1", type: "number", category: "Energy", description: "Energy regeneration per minute", isActive: true, updatedAt: "2024-02-28" },
  { id: "6", key: "GACHA_STANDARD_COST", value: "160", type: "number", category: "Shop", description: "Standard gacha pull cost in gems", isActive: true, updatedAt: "2024-02-25" },
  { id: "7", key: "MAINTENANCE_MODE", value: "false", type: "boolean", category: "System", description: "Enable/disable game maintenance", isActive: true, updatedAt: "2024-03-05" },
  { id: "8", key: "EVENT_ENABLED", value: "true", type: "boolean", category: "Events", description: "Enable/disable current event", isActive: true, updatedAt: "2024-03-10" },
  { id: "9", key: "BATTLE_SPEED", value: "1.0", type: "number", category: "Battle", description: "Battle animation speed multiplier", isActive: true, updatedAt: "2024-02-20" },
  { id: "10", key: "CRITICAL_RATE", value: "5", type: "number", category: "Battle", description: "Base critical hit rate percentage", isActive: true, updatedAt: "2024-02-20" },
  { id: "11", key: "DODGE_RATE", value: "3", type: "number", category: "Battle", description: "Base dodge rate percentage", isActive: true, updatedAt: "2024-02-20" },
  { id: "12", key: "GACHA_PREMIUM_COST", value: "300", type: "number", category: "Shop", description: "Premium gacha pull cost in gems", isActive: false, updatedAt: "2024-02-25" },
];

export default function ManageGameConfigPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [configs] = useState<GameConfig[]>(mockConfigs);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = ["All", "Player", "Energy", "Shop", "System", "Events", "Battle", "Gacha", "Social"];

  const filteredConfigs = configs.filter((config) => {
    const matchesSearch = config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || config.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredConfigs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredConfigs.slice(startIndex, endIndex);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      number: "text-blue-400 bg-blue-400/10",
      string: "text-green-400 bg-green-400/10",
      boolean: "text-purple-400 bg-purple-400/10",
      json: "text-orange-400 bg-orange-400/10",
    };
    return colors[type] || "text-gray-400 bg-gray-400/10";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Game Config</h1>
        <p className="text-white/50 text-sm">View and manage game configuration settings.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-sm">Total Configs</p>
          <p className="text-2xl font-bold text-white">{configs.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-sm">Active</p>
          <p className="text-2xl font-bold text-emerald-400">{configs.filter(c => c.isActive).length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-sm">Categories</p>
          <p className="text-2xl font-bold text-[#ffc032]">{categories.length - 1}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-sm">Last Updated</p>
          <p className="text-lg font-bold text-white">Mar 10</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#ffc032] text-black"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/manage-game-config/create")}
              className="flex items-center gap-2 bg-[#ffc032] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#ffc032]/90 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Config
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search by key or description..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Key</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Value</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider">Updated</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/40">
                    <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No configurations found</p>
                  </td>
                </tr>
              ) : (
                currentData.map((config) => (
                  <tr key={config.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-white">{config.key}</p>
                        <p className="text-xs text-white/50 truncate max-w-[200px]">{config.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-sm text-[#ffc032] bg-[#ffc032]/10 px-2 py-1 rounded">
                        {config.value}
                      </code>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(config.type)}`}>
                        {config.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/80">{config.category}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        config.isActive ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
                      }`}>
                        {config.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/60">{config.updatedAt}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => router.push(`/manage-game-config/detail?id=${config.id}`)}
                          className="p-1.5 text-white/50 hover:text-[#ffc032] hover:bg-[#ffc032]/10 rounded transition-colors cursor-pointer"
                          title="View Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => router.push(`/manage-game-config/edit?id=${config.id}`)}
                          className="p-1.5 text-white/50 hover:text-[#ffc032] hover:bg-[#ffc032]/10 rounded transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/50">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredConfigs.length)} of {filteredConfigs.length} results
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-white/50">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`min-w-[32px] px-2 py-1 rounded text-sm font-medium transition-colors cursor-pointer ${
                      currentPage === page 
                        ? 'bg-[#ffc032]/10 text-[#ffc032] border border-[#ffc032]/20' 
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
