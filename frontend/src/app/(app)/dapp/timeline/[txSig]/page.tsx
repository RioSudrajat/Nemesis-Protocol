"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Car, Store, Wrench, Copy, CheckCircle2, Star, ExternalLink } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";

function formatIDR(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function TxDetailPage({ params }: { params: Promise<{ txSig: string }> }) {
  const { txSig } = use(params);
  const completedBookings = useBookingStore(s => s.completedBookings);
  const [copied, setCopied] = useState(false);

  const tx = useMemo(() => completedBookings.find(b => b.txSig === txSig) || null, [completedBookings, txSig]);

  const handleCopy = () => {
    navigator.clipboard.writeText(txSig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!tx) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <FileText className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-gray-400 mb-4">Transaction not found.</p>
        <Link href="/dapp/timeline" className="text-sm underline" style={{ color: "var(--solana-purple, #9945FF)" }}>Back to Timeline</Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/dapp/timeline" className="inline-flex items-center gap-2 text-sm mb-6 hover:underline" style={{ color: "var(--solana-purple, #9945FF)" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Timeline
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <ExternalLink className="w-7 h-7" style={{ color: "var(--solana-purple, #9945FF)" }} />
        <h1 className="font-bold text-2xl">On-chain Service Record</h1>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <span className="mono text-xs text-gray-400">{txSig.slice(0, 20)}...{txSig.slice(-8)}</span>
        <button onClick={handleCopy} className="p-1 rounded hover:bg-white/10 transition-colors">
          {copied ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#86EFAC" }} /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
        </button>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium ml-2" style={{ background: "rgba(134,239,172,0.15)", color: "#86EFAC", border: "1px solid rgba(134,239,172,0.4)" }}>
          <CheckCircle2 className="w-3 h-3 inline mr-1" /> Anchored on Solana
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Car className="w-4 h-4" style={{ color: "#5EEAD4" }} /> Vehicle</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-400">Name:</span> <span className="font-medium">{tx.vehicleName}</span></div>
            <div><span className="text-gray-400">VIN:</span> <span className="mono text-xs">{tx.vin}</span></div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Store className="w-4 h-4" style={{ color: "#5EEAD4" }} /> Workshop</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-400">Name:</span> <span className="font-medium">{tx.workshopName}</span></div>
            <div><span className="text-gray-400">Service:</span> <span className="font-medium">{tx.serviceType}</span></div>
            <div><span className="text-gray-400">Date:</span> <span className="font-medium">{tx.date}</span></div>
            <div><span className="text-gray-400">Completed:</span> <span className="font-medium">{tx.completedAt}</span></div>
          </div>
        </div>
      </div>

      {tx.parts.length > 0 && (
        <div className="glass-card p-6 rounded-2xl mb-8">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Wrench className="w-4 h-4" style={{ color: "#5EEAD4" }} /> Parts Used</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-400 border-b border-white/5"><th className="py-2 text-left">Part</th><th className="py-2 text-left">Part #</th><th className="py-2 text-left">Manufacturer</th><th className="py-2 text-right">Price</th><th className="py-2 text-center">OEM</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {tx.parts.map((p, i) => (
                <tr key={i}>
                  <td className="py-2 font-medium">{p.name}</td>
                  <td className="py-2 mono text-xs text-gray-400">{p.partNumber}</td>
                  <td className="py-2 text-gray-400">{p.manufacturer}</td>
                  <td className="py-2 text-right">{formatIDR(p.price)}</td>
                  <td className="py-2 text-center">{p.isOEM ? <CheckCircle2 className="w-4 h-4 mx-auto" style={{ color: "#86EFAC" }} /> : <span className="text-gray-500">-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="glass-card p-6 rounded-2xl mb-8">
        <h3 className="text-sm font-semibold mb-4">Cost Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Service Cost</span><span>{formatIDR(tx.serviceCost)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Gas Fee</span><span>{formatIDR(tx.gasFee)}</span></div>
          <div className="flex justify-between border-t border-white/10 pt-2 font-bold"><span>Total</span><span style={{ color: "#5EEAD4" }}>{formatIDR(tx.totalIDR)}</span></div>
        </div>
      </div>

      {tx.mechanicNotes && (
        <div className="glass-card p-6 rounded-2xl mb-8">
          <h3 className="text-sm font-semibold mb-3">Mechanic Notes</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{tx.mechanicNotes}</p>
        </div>
      )}

      {tx.review && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Star className="w-4 h-4" style={{ color: "#FCD34D" }} /> Review</h3>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="w-4 h-4" fill={i < tx.review!.rating ? "#FCD34D" : "transparent"} style={{ color: i < tx.review!.rating ? "#FCD34D" : "#4B5563" }} />
            ))}
          </div>
          <p className="text-sm text-gray-300">{tx.review.comment}</p>
          {tx.review.onChainVerified && (
            <span className="inline-flex items-center gap-1 text-xs mt-2 px-2 py-0.5 rounded-full" style={{ background: "rgba(134,239,172,0.15)", color: "#86EFAC" }}>
              <CheckCircle2 className="w-3 h-3" /> On-chain Verified
            </span>
          )}
        </div>
      )}
    </div>
  );
}
