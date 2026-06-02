"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, Send } from "lucide-react";

export default function CreateMailboxPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    recipientId: "",
    recipientName: "",
    subject: "",
    message: "",
    type: "System",
    itemId: "",
    itemQuantity: 0,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating mailbox message:", formData);
    router.push("/manage-mailbox");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-mailbox")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Send Mail</h1>
          <p className="text-white/50 text-sm">Send a message to a player</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Recipient ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.recipientId}
                onChange={(e) => handleChange("recipientId", e.target.value)}
                placeholder="Enter player ID"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Recipient Name
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => handleChange("recipientName", e.target.value)}
                placeholder="Player display name (auto-filled)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Mail Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                <option value="System" className="bg-[#1a1a1a]">System</option>
                <option value="Gift" className="bg-[#1a1a1a]">Gift</option>
                <option value="Event" className="bg-[#1a1a1a]">Event</option>
                <option value="Support" className="bg-[#1a1a1a]">Support Reply</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Item ID (optional)
              </label>
              <input
                type="text"
                value={formData.itemId}
                onChange={(e) => handleChange("itemId", e.target.value)}
                placeholder="Attach item ID"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="Enter mail subject"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Message <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Enter your message"
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-mailbox")}
              className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" /> Send Mail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
