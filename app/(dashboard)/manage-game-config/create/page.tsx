"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getAllSettings, createSetting, removeSetting } from "@/lib/api/game";

const TYPES = ["string", "number", "boolean", "json"];

const CATEGORIES = ["Player", "Energy", "Shop", "System", "Events", "Battle", "Gacha", "Social"];

interface FormData {
  key: string;
  value: string;
  type: string;
  category: string;
  description: string;
  isActive: boolean;
}

export default function CreateGameConfigPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    key: "",
    value: "",
    type: "string",
    category: "System",
    description: "",
    isActive: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await createSetting(formData);
      router.push("/manage-game-config");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create game setting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/manage-game-config"
              className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#ffc032]" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Add New Configuration</h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Key */}
          <div className="mb-4">
            <label htmlFor="key" className="block text-sm font-medium text-[#ffc032] mb-2">
              Key <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="key"
              name="key"
              value={formData.key}
              onChange={handleChange}
              required
              placeholder="e.g., MAX_PLAYER_LEVEL"
              className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032]"
            />
          </div>

          {/* Value */}
          <div className="mb-4">
            <label htmlFor="value" className="block text-sm font-medium text-[#ffc032] mb-2">
              Value <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              required
              placeholder="e.g., 100"
              className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032]"
            />
          </div>

          {/* Type and Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-[#ffc032] mb-2">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032]"
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[#ffc032] mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-[#ffc032] mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe what this configuration does..."
              className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] resize-none"
            />
          </div>

          {/* Is Active */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 rounded bg-[#111] border-[#333] text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0"
              />
              <span className="text-sm text-gray-300">Active</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/manage-game-config"
              className="px-6 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-[#ffc032] text-[#111] rounded-lg font-semibold hover:bg-[#e6a82a] transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
