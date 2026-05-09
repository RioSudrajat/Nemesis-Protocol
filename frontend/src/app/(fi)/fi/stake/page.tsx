"use client";

import { useState } from "react";
import { Lock, CheckCircle2, Clock, Zap } from "lucide-react";

export default function StakePage() {
  const [notified, setNotified] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <div className="glass-card p-10 max-w-lg text-center w-full">
        <div className="flex justify-center mb-6">
          <Lock size={80} className="text-teal-300" />
        </div>

        <h1 className="text-3xl font-bold font-[family-name:var(--font-orbitron)] gradient-text mb-4">
          Future $NMS Layer
        </h1>

        <p className="text-gray-300 leading-relaxed mb-8">
          $NMS staking belum dibuka. Fokus produk saat ini adalah pembiayaan productive EV infrastructure dengan proof readiness, verified utilization, cash yield, dan principal recovery.
        </p>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex flex-col items-center gap-1">
            <CheckCircle2 size={28} className="text-teal-300" />
            <p className="text-sm font-semibold">Financing</p>
            <p className="text-xs text-gray-400">Live rails</p>
          </div>
          <div className="h-px flex-1 bg-teal-500/30 mx-3" />
          <div className="flex flex-col items-center gap-1">
            <Clock size={28} className="text-amber-400" />
            <p className="text-sm font-semibold">Network</p>
            <p className="text-xs text-gray-400">Expansion</p>
          </div>
          <div className="h-px flex-1 bg-teal-500/30 mx-3" />
          <div className="flex flex-col items-center gap-1">
            <Zap size={28} className="text-teal-300" />
            <p className="text-sm font-semibold">$NMS</p>
            <p className="text-xs text-gray-400">Future layer</p>
          </div>
        </div>

        <button
          onClick={() => setNotified(true)}
          disabled={notified}
          className="glow-btn mt-8 px-6 py-3 rounded-xl font-semibold w-full"
        >
          {notified ? "✅ Terima kasih! Kami akan kabari" : "🔔 Beritahu Saya"}
        </button>
      </div>
    </div>
  );
}
