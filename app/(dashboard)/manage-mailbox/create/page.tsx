"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { send, SendMailRequest } from "@/lib/api/mail";

export default function SendMailPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState<SendMailRequest>({
    playerProfileId: 0,
    title: "",
    content: "",
    type: "System",
    attachedGold: 0,
    attachedGems: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await send(formData);
      router.push("/manage-mailbox");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send mail");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <button
          onClick={() => router.push("/manage-mailbox")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Mailbox
        </button>
        <h1 className="text-3xl font-bold text-white">Send Mail</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Player Profile ID
          </label>
          <input
            type="number"
            name="playerProfileId"
            value={formData.playerProfileId || ""}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="System">System</option>
            <option value="Gift">Gift</option>
            <option value="Event">Event</option>
            <option value="Compensation">Compensation</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Attached Gold
            </label>
            <input
              type="number"
              name="attachedGold"
              value={formData.attachedGold || ""}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Attached Gems
            </label>
            <input
              type="number"
              name="attachedGems"
              value={formData.attachedGems || ""}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Attached Item ID (Optional)
            </label>
            <input
              type="number"
              name="attachedItemId"
              value={formData.attachedItemId || ""}
              onChange={handleChange}
              min="1"
              placeholder="Leave empty if none"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Item Quantity
            </label>
            <input
              type="number"
              name="attachedItemQuantity"
              value={formData.attachedItemQuantity || ""}
              onChange={handleChange}
              min="1"
              placeholder="Required if item ID set"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Mail"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push("/manage-mailbox")}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
