"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Edit2, Clock, Tag, FileText } from "lucide-react";

interface GameConfig {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  description: string;
  isActive: boolean;
  updatedAt: string;
  updatedBy: string;
  createdAt: string;
}

const mockConfig: GameConfig = {
  id: "1",
  key: "MAX_LEVEL",
  value: "100",
  type: "number",
  category: "Player",
  description: "Maximum player level in game. This setting determines the highest level a player can reach.",
  isActive: true,
  updatedAt: "2024-03-01 14:30",
  updatedBy: "admin_super",
  createdAt: "2024-01-01 09:00",
};

export default function GameConfigDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configId = searchParams.get("id");
  
  const [config, setConfig] = useState<GameConfig | null>(null);

  useEffect(() => {
    if (configId) {
      setConfig(mockConfig);
    }
  }, [configId]);

  if (!config) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/manage-game-config")}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Config Detail</h1>
            <p className="text-white/50 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      number: "text-blue-400 bg-blue-400/10",
      string: "text-green-400 bg-green-400/10",
      boolean: "text-purple-400 bg-purple-400/10",
      json: "text-orange-400 bg-orange-400/10",
    };
    return colors[type] || "text-gray-400 bg-gray-400/10";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/manage-game-config")}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Config Detail</h1>
            <p className="text-white/50 text-sm">View configuration details (ID: {configId})</p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/manage-game-config/edit?id=${config.id}`)}
          className="flex items-center gap-2 bg-[#ffc032] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#ffc032]/90 transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" /> Edit Config
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Info Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Configuration Information</h2>
            
            <div className="space-y-6">
              {/* Key */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Config Key</label>
                <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3">
                  <code className="text-lg text-[#ffc032] font-mono">{config.key}</code>
                </div>
              </div>

              {/* Value */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Value</label>
                <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3">
                  <code className="text-lg text-white font-mono break-all">{config.value}</code>
                </div>
              </div>

              {/* Type & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Type</label>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getTypeColor(config.type)}`}>
                    {config.type}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Category</label>
                  <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-white/10 text-white">
                    {config.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Description
                  </span>
                </label>
                <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-3">
                  <p className="text-white/80">{config.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Status</h3>
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${config.isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              <span className={`text-lg font-semibold ${config.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                {config.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Metadata</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-white/40 mt-0.5" />
                <div>
                  <p className="text-xs text-white/50">Created At</p>
                  <p className="text-sm text-white">{config.createdAt}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-white/40 mt-0.5" />
                <div>
                  <p className="text-xs text-white/50">Last Updated</p>
                  <p className="text-sm text-white">{config.updatedAt}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 text-white/40 mt-0.5" />
                <div>
                  <p className="text-xs text-white/50">Updated By</p>
                  <p className="text-sm text-white">{config.updatedBy}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/manage-game-config/edit?id=${config.id}`)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <Edit2 className="w-4 h-4" /> Edit Configuration
              </button>
              <button
                onClick={() => router.push("/manage-game-config")}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
