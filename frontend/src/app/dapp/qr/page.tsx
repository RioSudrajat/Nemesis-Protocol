"use client";

import { useState, useEffect } from "react";
import { Scan, Copy, Download, Clock, Shield, CheckCircle2, Maximize2, X, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useActiveVehicle, vehicleData } from "@/context/ActiveVehicleContext";
import { useBooking } from "@/context/BookingContext";

export default function QRPage() {
  const ctx = useActiveVehicle();
  const currentVehicleData = ctx?.currentVehicleData || vehicleData.avanza;
  const activeVehicle = ctx?.activeVehicle || "avanza";
  const bookingCtx = useBooking();
  // Show the active session for the currently selected vehicle only — other
  // vehicles may have their own sessions running independently.
  const activeSession = bookingCtx?.bookings[activeVehicle] || null;
  const hasActiveService = activeSession && !["COMPLETED", "REJECTED"].includes(activeSession.status);

  const [copied, setCopied] = useState(false);
  const [timeLimit, setTimeLimit] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins in secs

  useEffect(() => {
    if (!timeLimit || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLimit, timeLeft]);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

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
          <Scan className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
          QR Code
        </h1>
        <p>Share vehicle identity securely with workshops</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* QR Code display */}
        <div className="glass-card-static p-10 flex flex-col items-center text-center">
          {/* Mock QR */}
          <div className="relative w-64 h-64 rounded-2xl mb-6 flex items-center justify-center group" style={{ background: "white", padding: 16 }}>
            <div className="w-full h-full" style={{ background: `repeating-conic-gradient(#0E0E1A 0% 25%, transparent 0% 50%) 50% / 20px 20px`, borderRadius: 8 }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ background: "var(--solana-gradient)" }}>
                <Shield className="w-7 h-7 text-white" />
              </div>
            </div>
            
            {/* Expand overlay */}
            <button 
              onClick={() => setIsFullscreen(true)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl cursor-pointer"
            >
              <Maximize2 className="w-8 h-8 text-white" />
            </button>
          </div>

          <p className="text-xs mono mb-4" style={{ color: "var(--solana-text-muted)" }}>NOC ID #{currentVehicleData.vin.substring(currentVehicleData.vin.length - 5)} · {currentVehicleData.name}</p>

          {timeLimit && (
            <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl" style={{ background: "rgba(94, 234, 212,0.08)", border: "1px solid rgba(94, 234, 212,0.2)" }}>
              <Clock className="w-4 h-4" style={{ color: "var(--solana-green)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--solana-green)" }}>
                {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : "Expired"}
              </span>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button onClick={handleCopy} className="glow-btn-outline flex-1 gap-2 text-sm" style={{ padding: "10px 16px" }}>
              {copied ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
            </button>
            <button className="glow-btn flex-1 gap-2 text-sm" style={{ padding: "10px 16px" }}>
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-8">
          <div className="glass-card-static p-8">
            <h3 className="text-base font-semibold mb-6">QR Settings</h3>
            <div className="flex items-center justify-between mb-4 p-4 rounded-xl" style={{ background: "rgba(20,20,40,0.5)" }}>
              <div>
                <p className="text-sm font-medium">Time-limited Code</p>
                <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>QR expires after 5 minutes for security</p>
              </div>
              <button onClick={() => setTimeLimit(!timeLimit)} className="w-12 h-6 rounded-full transition-all relative" style={{ background: timeLimit ? "var(--solana-green)" : "rgba(148,163,184,0.3)" }}>
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: timeLimit ? 26 : 2 }} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(20,20,40,0.5)" }}>
              <div>
                <p className="text-sm font-medium">Include Service History</p>
                <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Let workshop see full maintenance records</p>
              </div>
              <button className="w-12 h-6 rounded-full transition-all relative" style={{ background: "var(--solana-green)" }}>
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5" style={{ left: 26 }} />
              </button>
            </div>
          </div>

          {/* Vehicle card */}
          <div className="glass-card-static p-8">
            <h3 className="text-base font-semibold mb-6">Vehicle Identity Card</h3>
            <div className="p-5 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(94, 234, 212,0.12) 0%, rgba(94, 234, 212,0.06) 100%)", border: "1px solid rgba(94, 234, 212,0.2)" }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-lg font-bold">{currentVehicleData.name}</p>
                  <p className="text-xs mono" style={{ color: "var(--solana-text-muted)" }}>VIN: {currentVehicleData.vin}</p>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--solana-gradient)" }}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>NOC ID</p>
                  <p className="font-semibold mono text-sm">#{currentVehicleData.vin.substring(currentVehicleData.vin.length - 5)}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Health</p>
                  <p className="font-semibold text-sm" style={{ color: "#5EEAD4" }}>{currentVehicleData.health}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Services</p>
                  <p className="font-semibold text-sm">12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
      
      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-3xl flex items-center justify-center relative shadow-2xl" style={{ background: "white", padding: 24, boxShadow: "0 0 50px rgba(94, 234, 212,0.2)" }}>
                <div className="w-full h-full" style={{ background: `repeating-conic-gradient(#0E0E1A 0% 25%, transparent 0% 50%) 50% / 24px 24px`, borderRadius: 12 }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "var(--solana-gradient)" }}>
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              
              <p className="text-lg mono mt-8 font-bold text-white tracking-widest">NOC ID #00001</p>
              
              {timeLimit && (
                <div className="mt-4 px-6 py-3 rounded-2xl bg-black/50 border border-teal-500/30 text-teal-400 font-mono text-xl">
                  {timeLeft > 0 ? formatTime(timeLeft) : "EXPIRED"}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
