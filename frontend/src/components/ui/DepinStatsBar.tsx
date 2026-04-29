"use client";

import React, { useState } from "react";
import { formatNumber } from "@/lib/yield";
import { Wallet } from "lucide-react";

export function DepinStatsBar() {
  const [walletConnected, setWalletConnected] = useState(false);

  return (
    <div className="sticky top-6 z-20 py-4 px-6 md:px-8 mb-6 bg-white rounded-2xl shadow-sm border border-zinc-100 flex flex-wrap items-center justify-between gap-y-4">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)] animate-pulse" />
          <span className="text-zinc-500 font-medium">Live</span>
        </div>
        <div>
          <span className="text-zinc-500">Connected EV Assets: </span>
          <span className="font-semibold text-zinc-900">{formatNumber(847)} unit</span>
        </div>
        <div>
          <span className="text-zinc-500">Network Activity: </span>
          <span className="font-semibold text-zinc-900">
            {formatNumber(42391)} Km <span className="text-zinc-300 font-normal mx-1">|</span> 0 kWh
          </span>
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
        <button 
          onClick={() => setWalletConnected(!walletConnected)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-400 rounded-lg shadow-sm transition-colors"
        >
          {walletConnected ? (
            <>
              <div className="w-5 h-5 rounded-full bg-teal-700 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-teal-300" />
              </div>
              8xFa...9Bv2
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </>
          )}
        </button>
      </div>
    </div>
  );
}
