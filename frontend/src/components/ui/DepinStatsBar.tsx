import React from "react";
import { formatNumber } from "@/lib/yield";

export function DepinStatsBar() {
  return (
    <div className="sticky top-6 z-20 py-4 px-6 md:px-8 mb-6 bg-white rounded-2xl shadow-sm border border-zinc-100 flex flex-wrap items-center justify-between gap-y-4">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)] animate-pulse" />
          <span className="text-zinc-500 font-medium">Live</span>
        </div>
        <div>
          <span className="text-zinc-500">Total Fleet: </span>
          <span className="font-semibold text-zinc-900">{formatNumber(847)} unit</span>
        </div>
        <div>
          <span className="text-zinc-500">Km Today: </span>
          <span className="font-semibold text-zinc-900">{formatNumber(42391)} km</span>
        </div>
        <div className="hidden md:block">
          <span className="text-zinc-500">Active Nodes: </span>
          <span className="font-semibold text-zinc-900">{formatNumber(623)}</span>
        </div>
        <div className="hidden md:block">
          <span className="text-zinc-500">On-chain: </span>
          <span className="font-semibold text-teal-600">
            {formatNumber(847)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 rounded-lg border border-zinc-200 transition-colors">
          <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">P</div>
          Profile
        </button>
      </div>
    </div>
  );
}
