"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";

const mockContent = {
  id: 1,
  title: "New Update v2.0",
  content: "We are excited to announce the new update...",
  type: "News",
  isPublished: true,
};

export default function EditContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("id");
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "News",
    isPublished: false,
  });

  useEffect(() => {
    if (contentId) {
      setFormData({
        title: mockContent.title,
        content: mockContent.content,
        type: mockContent.type,
        isPublished: mockContent.isPublished,
      });
    }
  }, [contentId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating content:", formData);
    router.push("/manage-content");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-content")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Content</h1>
          <p className="text-white/50 text-sm">Update content details (ID: {contentId})</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter content title"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Content Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                <option value="News" className="bg-[#1a1a1a]">News</option>
                <option value="Announcement" className="bg-[#1a1a1a]">Announcement</option>
                <option value="Article" className="bg-[#1a1a1a]">Article</option>
                <option value="Event" className="bg-[#1a1a1a]">Event</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Enter content details"
              rows={10}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => handleChange("isPublished", e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0"
            />
            <label htmlFor="isPublished" className="text-sm text-white/70">
              Published
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-content")}
              className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
