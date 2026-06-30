"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getSettingByKey, updateSettingByKey, GameSettingResponse } from "@/lib/api/game-settings";

const TYPES = ["string", "number", "boolean", "json"];

const CATEGORIES = ["Player", "Energy", "Shop", "System", "Events", "Battle", "Gacha", "Social"];

interface FormData {
  value: string;
  type: string;
  category: string;
  description: string;
  isActive: boolean;
}

export default function EditGameConfigPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [setting, setSetting] = useState<GameSettingResponse | null>(null);
  const [formData, setFormData] = useState<FormData>({
    value: "",
    type: "string",
    category: "System",
    description: "",
    isActive: true,
  });

  const fetchSetting = async () => {
    try {
      setFetching(true);
      setError(null);
      const data = await getSettingByKey(id as string);
      setSetting(data);
      setFormData({
        value: data.value ?? "",
        type: "string",
        category: "System",
        description: data.description ?? "",
        isActive: data.isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch game setting");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!id) {
      void Promise.resolve().then(() => {
        setError("No ID provided");
        setFetching(false);
      });
      return;
    }
    void Promise.resolve().then(fetchSetting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
    if (!setting) return;

    try {
      setLoading(true);
      setError(null);
      await updateSettingByKey(setting.key, {
        value: formData.value,
        description: formData.description,
        isActive: formData.isActive,
      });
      router.push("/manage-game-config");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update game setting");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
      </div>
    );
  }

  if (!setting) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Configuration not found"}</p>
          <Link
            href="/manage-game-config"
            className="px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg font-semibold hover:bg-[#e6a82a] transition-colors"
          >
            Back to List
          </Link>
        </div>
      </div>
    );
  }

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
            <div>
              <h1 className="text-2xl font-bold text-white">Update Configuration</h1>
              <p className="text-sm text-gray-400 mt-1 font-mono">{setting.key}</p>
            </div>
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

          {/* Key (Read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#ffc032] mb-2">Key</label>
            <input
              type="text"
              value={setting.key}
              disabled
              className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Key cannot be modified</p>
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
              placeholder="Enter value..."
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
                disabled
                className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-gray-500 cursor-not-allowed"
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
                disabled
                className="w-full px-4 py-2 bg-[#111] border border-[#333] rounded-lg text-gray-500 cursor-not-allowed"
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
