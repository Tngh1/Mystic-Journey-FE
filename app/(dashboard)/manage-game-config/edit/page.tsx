"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";

interface GameConfig {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  description: string;
  isActive: boolean;
}

const mockConfig: GameConfig = {
  id: "1",
  key: "MAX_LEVEL",
  value: "100",
  type: "number",
  category: "Player",
  description: "Maximum player level in game",
  isActive: true,
};

const CONFIG_TYPES = [
  { value: "number", label: "Number" },
  { value: "string", label: "String" },
  { value: "boolean", label: "Boolean" },
  { value: "json", label: "JSON" },
];

const CONFIG_CATEGORIES = [
  { value: "Player", label: "Player" },
  { value: "Energy", label: "Energy" },
  { value: "Shop", label: "Shop" },
  { value: "System", label: "System" },
  { value: "Events", label: "Events" },
  { value: "Battle", label: "Battle" },
  { value: "Gacha", label: "Gacha" },
  { value: "Social", label: "Social" },
];

export default function EditGameConfigPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configId = searchParams.get("id");
  
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    type: "string",
    category: "Player",
    description: "",
    isActive: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (configId) {
      setFormData({
        key: mockConfig.key,
        value: mockConfig.value,
        type: mockConfig.type,
        category: mockConfig.category,
        description: mockConfig.description,
        isActive: mockConfig.isActive,
      });
    }
  }, [configId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating config:", formData);
    router.push("/manage-game-config");
  };

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
            <h1 className="text-2xl font-bold text-white">Edit Game Config</h1>
            <p className="text-white/50 text-sm">Update configuration (ID: {configId})</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Warning Banner */}
          <div className="flex items-start gap-3 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-400 font-medium">Important Notice</p>
              <p className="text-xs text-yellow-400/70 mt-1">
                Changing game configurations may affect gameplay. Please verify the values before saving.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Config Key */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Config Key <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => handleChange("key", e.target.value)}
                  placeholder="e.g., MAX_LEVEL"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                  required
                />
                <p className="text-xs text-white/50">Use uppercase with underscores (e.g., MAX_LEVEL)</p>
              </div>

              {/* Config Value */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Value <span className="text-red-400">*</span>
                </label>
                {formData.type === "json" ? (
                  <textarea
                    value={formData.value}
                    onChange={(e) => handleChange("value", e.target.value)}
                    placeholder='{"key": "value"}'
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
                    required
                  />
                ) : formData.type === "boolean" ? (
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="booleanValue"
                        checked={formData.value === "true"}
                        onChange={() => handleChange("value", "true")}
                        className="w-4 h-4 text-[#ffc032] bg-white/5 border-white/20 focus:ring-[#ffc032]"
                      />
                      <span className="text-white">true</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="booleanValue"
                        checked={formData.value === "false"}
                        onChange={() => handleChange("value", "false")}
                        className="w-4 h-4 text-[#ffc032] bg-white/5 border-white/20 focus:ring-[#ffc032]"
                      />
                      <span className="text-white">false</span>
                    </label>
                  </div>
                ) : (
                  <input
                    type={formData.type === "number" ? "number" : "text"}
                    value={formData.value}
                    onChange={(e) => handleChange("value", e.target.value)}
                    placeholder="Enter value"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                    required
                  />
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe what this configuration does"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
                  required
                />
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              {/* Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                >
                  {CONFIG_TYPES.map((type) => (
                    <option key={type.value} value={type.value} className="bg-[#1a1a1a]">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                >
                  {CONFIG_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-[#1a1a1a]">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Status</label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-sm text-white/70 cursor-pointer">
                    Enable this configuration
                  </label>
                </div>
              </div>

              {/* Current Value Preview */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-xs text-white/50 mb-2">Current Value Type</p>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getTypeColor(formData.type)}`}>
                  {formData.type}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-game-config")}
              className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                hasChanges
                  ? "bg-[#ffc032] text-black hover:bg-[#ffc032]/90"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              }`}
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
