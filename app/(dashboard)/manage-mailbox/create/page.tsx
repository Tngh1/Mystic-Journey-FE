"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Globe, User, Users } from "lucide-react";
import { sendByList, sendBroadcast } from "@/lib/api/mail";
import type { SendMailByListIdRequest, SendMailToAllRequest } from "@/lib/api/mail";

type PlayerSelection = "single" | "multiple";

export default function SendMailPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendToAll, setSendToAll] = useState(false);
  const [playerSelection, setPlayerSelection] = useState<PlayerSelection>("single");
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "System",
    attachedGold: 0,
    attachedGems: 0,
    attachedItemId: 0,
    attachedItemQuantity: 0,
    expiredAt: "",
  });

  const [singleIdInput, setSingleIdInput] = useState("");
  const [multipleIdsInput, setMultipleIdsInput] = useState("");

  const handleSingleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSingleIdInput(e.target.value);
  };

  const handleMultipleIdsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMultipleIdsInput(e.target.value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const buildBasePayload = () => ({
    title: formData.title,
    content: formData.content,
    type: formData.type,
    attachedGold: formData.attachedGold,
    attachedGems: formData.attachedGems,
    attachedItemId: formData.attachedItemId || undefined,
    attachedItemQuantity: formData.attachedItemQuantity,
    expiredAt: formData.expiredAt || undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      if (sendToAll) {
        const payload: SendMailToAllRequest = buildBasePayload();
        await sendBroadcast(payload);
      } else {
        let ids: number[] = [];
        if (playerSelection === "single") {
          const id = parseInt(singleIdInput, 10);
          if (!isNaN(id)) ids = [id];
        } else {
          ids = multipleIdsInput
            .split(/[\s,]+/)
            .map((s) => parseInt(s.trim(), 10))
            .filter((n) => !isNaN(n));
        }

        if (ids.length === 0) {
          setError("Please enter at least one player ID.");
          setSubmitting(false);
          return;
        }

        const payload: SendMailByListIdRequest = { ...buildBasePayload(), playerProfileIds: ids };
        await sendByList(payload);
      }

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
        {/* Send to All Toggle */}
        <div
          className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
            sendToAll
              ? "bg-purple-900/20 border-purple-600"
              : "bg-gray-900 border-gray-700"
          }`}
        >
          <input
            id="sendToAll"
            type="checkbox"
            checked={sendToAll}
            onChange={(e) => setSendToAll(e.target.checked)}
            className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
          />
          <div className="flex-1">
            <label htmlFor="sendToAll" className="flex items-center gap-2 cursor-pointer">
              <Globe className={`w-5 h-5 ${sendToAll ? "text-purple-400" : "text-gray-400"}`} />
              <div>
                <div className="text-sm font-medium text-white">Send to All Players</div>
                <div className="text-xs text-gray-400">Mail will be sent to every active player in the game</div>
              </div>
            </label>
          </div>
        </div>

        {/* Player Selection - only when not Send to All */}
        {!sendToAll && (
          <div className="space-y-4">
            {/* Selection Mode Toggle */}
            <div className="flex gap-2 p-1 bg-gray-900 rounded-lg">
              <button
                type="button"
                onClick={() => setPlayerSelection("single")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                  playerSelection === "single"
                    ? "bg-gray-700 text-white shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <User className="w-4 h-4" />
                Single
              </button>
              <button
                type="button"
                onClick={() => setPlayerSelection("multiple")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                  playerSelection === "multiple"
                    ? "bg-gray-700 text-white shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Users className="w-4 h-4" />
                Multiple
              </button>
            </div>

            {/* Single ID Input */}
            {playerSelection === "single" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Player Profile ID
                </label>
                <input
                  type="number"
                  value={singleIdInput}
                  onChange={handleSingleIdChange}
                  min="1"
                  placeholder="Enter player ID"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            {/* Multiple IDs Input */}
            {playerSelection === "multiple" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Player Profile IDs
                </label>
                <textarea
                  value={multipleIdsInput}
                  onChange={handleMultipleIdsChange}
                  placeholder="e.g. 1, 2, 3, 4, 5"
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Title */}
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

        {/* Content */}
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

        {/* Type */}
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

        {/* Rewards */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Attached Gold</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Attached Gems</label>
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

        {/* Item */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Attached Item ID</label>
            <input
              type="number"
              name="attachedItemId"
              value={formData.attachedItemId || ""}
              onChange={handleChange}
              min="1"
              placeholder="Optional"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Item Quantity</label>
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

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
              sendToAll
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-[#ffc032] hover:bg-[#e6ae2c] text-[#111]"
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : sendToAll ? (
              "Broadcast to All"
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
