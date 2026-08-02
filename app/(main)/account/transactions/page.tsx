"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Loader2, AlertCircle, Calendar, Package } from "lucide-react";
import ProfileSidebar from "@/components/ui/ProfileSidebar";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getByPlayerId } from "@/lib/api/purchase-histories";
import type { PurchaseHistoryResponse } from "@/lib/api/purchase-histories";

export default function UserTransactionsPage() {
  const { user, isLoading } = useAuth();
  const [transactions, setTransactions] = useState<PurchaseHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user?.playerProfileId) {
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    getByPlayerId(user.playerProfileId)
      .then((res) => {
        if (mounted) {
          // Sort by date descending
          const sorted = res.sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime());
          setTransactions(sorted);
        }
      })
      .catch((e) => {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load transactions.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [isLoading, user?.playerProfileId]);

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center px-4">
        <div className="text-center bg-[#111111] border border-white/10 rounded-xl p-10 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Not Authenticated</h2>
          <p className="text-white/60 mb-8">Please log in to view your profile.</p>
          <Link href="/login" className="inline-block px-6 py-3 bg-[#ffc032] hover:bg-[#ffd04c] text-[#111] rounded-xl transition-colors font-semibold w-full cursor-pointer">
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === "USD") {
      return `$${Number(price).toFixed(2)}`;
    }
    return `${Number(price).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-['BeVietnamPro'] pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        <ProfileSidebar />

        <main className="flex-1 md:pl-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
              <CreditCard className="w-3.5 h-3.5" /> Shop
            </span>
            <span className="h-px w-12 bg-linear-to-r from-[#ffc032]/60 to-transparent" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Purchase History</h1>
          <p className="text-white/60 text-sm mb-10">Review your past transactions in the game shop.</p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
            </div>
          ) : !user.playerProfileId ? (
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No Character Yet</h2>
              <p className="text-white/50 text-sm max-w-md mx-auto">
                This account hasn't created a character. Start the game to create your hero.
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-red-400 font-medium mb-1">Failed to load transactions</p>
              <p className="text-red-400/60 text-sm">{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Purchases Found</h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                You haven't bought any items from the shop yet. Your transactions will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {transactions.map((tx) => (
                <div 
                  key={tx.purchaseHistoryId}
                  className="bg-[#111111] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors flex flex-col sm:flex-row sm:items-center gap-5"
                >
                  {/* Item Image */}
                  <div className="w-16 h-16 shrink-0 rounded-lg bg-black border border-white/10 overflow-hidden">
                    {tx.itemIconUrl ? (
                      <img src={tx.itemIconUrl} alt={tx.itemName || "Item"} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{tx.itemName}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-gray-500" />
                        <span>Qty: {tx.quantity}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span>{formatDate(tx.purchasedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 font-mono">TX: #{tx.purchaseHistoryId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:text-right shrink-0">
                    <div className="text-[#ffc032] font-bold text-lg">
                      {formatPrice(tx.totalPrice, tx.currency)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                      {tx.currency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
