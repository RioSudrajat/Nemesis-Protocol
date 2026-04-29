"use client";

import { useState } from "react";
import { Copy, Share2, Users, CheckCircle2, Send, Twitter, MessageCircle } from "lucide-react";
import { DepinStatsBar } from "@/components/ui/DepinStatsBar";
import { formatNumber, truncateWallet } from "@/lib/yield";

const referred = [
  { wallet: "NMS3f2abc4de", type: "Operator", joined: "12 Apr 2026", pts: 500 },
  { wallet: "NMS7defgh5ij", type: "Investor", joined: "10 Apr 2026", pts: 500 },
  { wallet: "NMS9ijklm6no", type: "Operator", joined: "5 Apr 2026", pts: 500 },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const refLink = "https://nemesis.id/ref/NMS127xyz";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  };

  const totalReferrals = referred.length;
  const totalPoints = referred.reduce((s, r) => s + r.pts, 0);

  return (
    <div className="text-zinc-900 pb-8 w-full max-w-7xl mx-auto px-4 md:px-0">
      <DepinStatsBar />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Users size={28} className="text-teal-600" />
            Referrals
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Invite others to join — get {formatNumber(500)} points for every active referral.
          </p>
        </div>

        {/* Link section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
          <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-2 block">Your Referral Link</label>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              readOnly
              value={refLink}
              className="flex-1 font-mono text-sm px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-colors bg-teal-500 hover:bg-teal-600 shadow-sm"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={18} /> Copied
                </>
              ) : (
                <>
                  <Copy size={18} /> Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Referrals</p>
            <p className="text-2xl font-bold text-zinc-900 mt-2">{formatNumber(totalReferrals)}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-200 bg-teal-50/10">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Points from Referrals</p>
            <p className="text-2xl font-bold mt-2 text-teal-600">
              {formatNumber(totalPoints)}
            </p>
          </div>
        </div>

        {/* Referred wallets */}
        <div>
          <h3 className="text-lg font-bold text-zinc-900 mb-4">Referred Wallets</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    <th className="text-left py-4 px-6 font-semibold text-zinc-500">Wallet</th>
                    <th className="text-left py-4 px-6 font-semibold text-zinc-500">Type</th>
                    <th className="text-left py-4 px-6 font-semibold text-zinc-500">Joined Date</th>
                    <th className="text-right py-4 px-6 font-semibold text-zinc-500">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {referred.map((r, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0"
                    >
                      <td className="py-4 px-6 font-mono font-medium text-zinc-900">{truncateWallet(r.wallet)}</td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-zinc-100 text-zinc-600">
                          {r.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-zinc-500 font-medium">{r.joined}</td>
                      <td className="py-4 px-6 text-right font-bold text-teal-600">
                        +{formatNumber(r.pts)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Share */}
        <div>
          <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <Share2 size={20} className="text-teal-600" />
            Share Now
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="bg-white rounded-xl px-4 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-zinc-200 text-zinc-900 hover:border-teal-200 hover:text-teal-600 shadow-sm"
            >
              <Send size={18} className="text-[#0088cc]" /> Telegram
            </button>
            <button
              className="bg-white rounded-xl px-4 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-zinc-200 text-zinc-900 hover:border-teal-200 hover:text-teal-600 shadow-sm"
            >
              <Twitter size={18} className="text-zinc-900" /> Twitter / X
            </button>
            <button
              className="bg-white rounded-xl px-4 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-zinc-200 text-zinc-900 hover:border-teal-200 hover:text-teal-600 shadow-sm"
            >
              <MessageCircle size={18} className="text-[#25D366]" /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
