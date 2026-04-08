"use client";

import { ArrowRightLeft, ShieldAlert, CheckCircle2, User, KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { useActiveVehicle, vehicleData } from "@/context/ActiveVehicleContext";

export default function TransferPage() {
  const ctx = useActiveVehicle();
  const currentVehicleData = ctx?.currentVehicleData || vehicleData.avanza;

  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = () => {
    setIsTransferring(true);
    setTimeout(() => setIsTransferring(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="page-header text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(94, 234, 212,0.1)" }}>
          <ArrowRightLeft className="w-8 h-8" style={{ color: "var(--solana-purple)" }} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Vehicle Transfer</h1>
        <p style={{ color: "var(--solana-text-muted)" }}>Transfer on-chain ownership to a new wallet</p>
      </div>

      <div className="glass-card-static p-8 md:p-10 mb-8">
        <h3 className="text-base font-bold mb-6 flex items-center gap-2 border-b pb-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <CheckCircle2 className="w-5 h-5" style={{ color: "var(--solana-green)" }} /> Asset to Transfer
        </h3>
        
        <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-black/30 border border-white/5">
          <div>
            <p className="font-bold text-lg">{currentVehicleData.name}</p>
            <p className="text-sm mono mt-1" style={{ color: "var(--solana-text-muted)" }}>VIN: {currentVehicleData.vin}</p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>NOC ID</p>
            <p className="font-bold mono text-teal-400">#{currentVehicleData.vin.substring(currentVehicleData.vin.length - 5)}</p>
          </div>
        </div>

        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-400" /> Recipient Details
        </h3>
        
        <div className="mb-8">
          <label className="block text-xs mb-2" style={{ color: "var(--solana-text-muted)" }}>Recipient Solana Wallet Address</label>
          <input 
            type="text" 
            placeholder="e.g., 7NX..." 
            className="w-full bg-black/50 border outline-none rounded-xl py-4 px-4 text-sm font-mono transition-colors focus:border-teal-500"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          />
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-4 mb-8">
          <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-400 mb-1">Warning: Irreversible Action</p>
            <p className="text-xs text-red-400/80 leading-relaxed">
              Transferring this vehicle will permanently move the cNFT to the recipient address. 
              You will lose all access to its maintenance logs, AI predictions, and $NOC token rewards associated with future servicing.
            </p>
          </div>
        </div>

        <button 
          onClick={handleTransfer}
          disabled={isTransferring}
          className="glow-btn w-full py-4 font-bold text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTransferring ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Initiating Signature...</>
          ) : (
            <><KeyRound className="w-5 h-5" /> Initiate Transfer Signature</>
          )}
        </button>
      </div>
      
      <p className="text-center text-xs opacity-50">Requires connected wallet approval. Estimated network fee: ~0.00001 SOL.</p>
    </div>
  );
}
