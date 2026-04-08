"use client";

import { CreditCard, Shield, Activity, Power, AlertTriangle, Key, History, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useActiveVehicle, vehicleData } from "@/context/ActiveVehicleContext";
import { useBooking } from "@/context/BookingContext";

const scanHistory = [
  { date: "2026-03-15 14:30", location: "Bengkel Hendra Motor", auth: "Success" },
  { date: "2026-02-10 09:15", location: "Dealer Toyota BSD", auth: "Success" },
];

export default function NFCPage() {
  const ctx = useActiveVehicle();
  const currentVehicleData = ctx?.currentVehicleData || vehicleData.avanza;
  const bookingCtx = useBooking();
  const activeSession = bookingCtx?.booking;
  const hasActiveService = activeSession && !["COMPLETED", "REJECTED"].includes(activeSession.status);

  const [isActive, setIsActive] = useState(true);

  return (
    <div>
      {hasActiveService && (
        <Link href="/dapp/book/status" className="flex items-center gap-3 mb-6 p-4 rounded-xl transition-colors hover:bg-white/5" style={{ background: "rgba(94, 234, 212,0.08)", border: "1px solid rgba(94, 234, 212,0.2)" }}>
          <Wrench className="w-5 h-5 shrink-0" style={{ color: "var(--solana-green)" }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: "var(--solana-green)" }}>Servis Sedang Berjalan</p>
            <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>{activeSession.workshop.name} · {activeSession.status}</p>
          </div>
          <span className="text-xs font-semibold" style={{ color: "var(--solana-green)" }}>Lihat Status →</span>
        </Link>
      )}
      <div className="page-header">
        <h1 className="flex items-center gap-3">
          <CreditCard className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
          NFC Card Management
        </h1>
        <p>Manage your linked physical smart cards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Card visualization */}
        <div className="flex flex-col gap-6">
          <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden transition-all duration-300" 
            style={{ 
              background: isActive ? "linear-gradient(135deg, rgba(94, 234, 212,0.7) 0%, rgba(94, 234, 212,0.3) 100%)" : "rgba(30,30,50,0.8)",
              border: `1px solid ${isActive ? "rgba(94, 234, 212,0.5)" : "rgba(255,255,255,0.1)"}`,
              filter: isActive ? "none" : "grayscale(100%)"
            }}
          >
            {/* Background design */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-white" />
                <span className="font-bold text-lg text-white">NOC ID</span>
              </div>
              <Activity className="w-6 h-6 text-white animate-pulse" style={{ opacity: isActive ? 1 : 0.2 }} />
            </div>

            <div className="relative z-10">
              <p className="text-white/70 text-xs mb-1">Linked Vehicle</p>
              <p className="text-white font-bold text-xl mb-4 tracking-wide">{currentVehicleData.name}</p>
              <div className="flex justify-between items-end">
                <p className="text-white/80 mono text-sm tracking-widest">NFC-{currentVehicleData.vin.substring(currentVehicleData.vin.length - 8, currentVehicleData.vin.length - 4)}-{currentVehicleData.vin.substring(currentVehicleData.vin.length - 4)}</p>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: isActive ? "rgba(94, 234, 212,0.2)" : "rgba(255,0,0,0.2)", color: isActive ? "#5EEAD4" : "#FCA5A5" }}>
                  {isActive ? "ACTIVE" : "FROZEN"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 max-w-md mx-auto w-full">
            <button 
              onClick={() => setIsActive(!isActive)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all cursor-pointer"
              style={{ background: isActive ? "rgba(239,68,68,0.1)" : "rgba(94, 234, 212,0.1)", color: isActive ? "#FCA5A5" : "#5EEAD4", border: `1px solid ${isActive ? "rgba(239,68,68,0.3)" : "rgba(94, 234, 212,0.3)"}` }}
            >
              <Power className="w-4 h-4" /> {isActive ? "Freeze Card" : "Unfreeze Card"}
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold glow-btn-outline cursor-pointer text-sm">
              <AlertTriangle className="w-4 h-4" /> Report Lost
            </button>
          </div>
        </div>

        {/* Security Settings & History */}
        <div className="flex flex-col gap-8">
          <div className="glass-card-static p-8">
            <h3 className="text-base font-semibold mb-6 flex items-center gap-2">
              <Key className="w-5 h-5" style={{ color: "var(--solana-purple)" }} /> Permissions
            </h3>
            
            <div className="flex items-center justify-between p-4 rounded-xl mb-3" style={{ background: "rgba(20,20,40,0.5)" }}>
              <div>
                <p className="text-sm font-medium">Verify Only Mode</p>
                <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Scanner can only see health, cannot append logs</p>
              </div>
              <button className="w-12 h-6 rounded-full transition-all relative" style={{ background: "rgba(148,163,184,0.3)" }}>
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5" style={{ left: 2 }} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(20,20,40,0.5)" }}>
              <div>
                <p className="text-sm font-medium">Require PIN</p>
                <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>DApp approval required for every scan</p>
              </div>
              <button className="w-12 h-6 rounded-full transition-all relative" style={{ background: "var(--solana-green)" }}>
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5" style={{ left: 26 }} />
              </button>
            </div>
          </div>

          <div className="glass-card-static p-8">
            <h3 className="text-base font-semibold mb-6 flex items-center gap-2">
              <History className="w-5 h-5" style={{ color: "var(--solana-purple)" }} /> Scan History
            </h3>
            <div className="flex flex-col gap-3">
              {scanHistory.map((scan, i) => (
                <div key={i} className="flex justify-between items-center p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <div>
                    <p className="text-sm font-medium">{scan.location}</p>
                    <p className="text-xs mono mt-1" style={{ color: "var(--solana-text-muted)" }}>{scan.date}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(94, 234, 212,0.1)", color: "var(--solana-green)" }}>
                    {scan.auth}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
