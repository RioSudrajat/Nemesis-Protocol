"use client";

import { useState, useEffect } from "react";
import { Scan, Copy, Download, Clock, Shield, CheckCircle2, Maximize2, X, CreditCard, Activity, Power, AlertTriangle, Key, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveVehicle, vehicleData } from "@/context/ActiveVehicleContext";

const scanHistory = [
  { date: "2026-03-15 14:30", location: "Bengkel Hendra Motor", auth: "Success" },
  { date: "2026-02-10 09:15", location: "Dealer Toyota BSD", auth: "Success" },
];

export default function IdentityPage() {
  const ctx = useActiveVehicle();
  const currentVehicleData = ctx?.currentVehicleData || vehicleData.avanza;

  const [activeTab, setActiveTab] = useState<"nfc" | "qr">("qr");

  // QR state
  const [copied, setCopied] = useState(false);
  const [timeLimit, setTimeLimit] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  // NFC state
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!timeLimit || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLimit, timeLeft]);

  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const formatTime = (secs: number) => { const m = Math.floor(secs / 60); const s = secs % 60; return `${m}:${s < 10 ? "0" : ""}${s}`; };

  return (
    <div>
      <div className="page-header">
        <h1 className="flex items-center gap-3">
          <Shield className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
          Identity Card
        </h1>
        <p>Manage your vehicle's digital identity — QR code and NFC card</p>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-3 mb-8">
        <button onClick={() => setActiveTab("qr")} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer" style={{ background: activeTab === "qr" ? "rgba(153,69,255,0.15)" : "rgba(20,20,40,0.5)", border: `1px solid ${activeTab === "qr" ? "var(--solana-purple)" : "rgba(153,69,255,0.2)"}`, color: activeTab === "qr" ? "var(--solana-purple)" : "var(--solana-text-muted)" }}>
          <Scan className="w-5 h-5" /> QR Code
        </button>
        <button onClick={() => setActiveTab("nfc")} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer" style={{ background: activeTab === "nfc" ? "rgba(20,241,149,0.15)" : "rgba(20,20,40,0.5)", border: `1px solid ${activeTab === "nfc" ? "var(--solana-green)" : "rgba(153,69,255,0.2)"}`, color: activeTab === "nfc" ? "var(--solana-green)" : "var(--solana-text-muted)" }}>
          <CreditCard className="w-5 h-5" /> NFC Card
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "qr" ? (
          <motion.div key="qr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* QR Code display */}
              <div className="glass-card-static p-10 flex flex-col items-center text-center">
                <div className="relative w-64 h-64 rounded-2xl mb-6 flex items-center justify-center group" style={{ background: "white", padding: 16 }}>
                  <div className="w-full h-full" style={{ background: `repeating-conic-gradient(#0E0E1A 0% 25%, transparent 0% 50%) 50% / 20px 20px`, borderRadius: 8 }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ background: "var(--solana-gradient)" }}>
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <button onClick={() => setIsFullscreen(true)} className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl cursor-pointer">
                    <Maximize2 className="w-8 h-8 text-white" />
                  </button>
                </div>
                <p className="text-xs mono mb-4" style={{ color: "var(--solana-text-muted)" }}>NOC ID #{currentVehicleData.vin.substring(currentVehicleData.vin.length - 5)} · {currentVehicleData.name}</p>
                {timeLimit && (
                  <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl" style={{ background: "rgba(20,241,149,0.08)", border: "1px solid rgba(20,241,149,0.2)" }}>
                    <Clock className="w-4 h-4" style={{ color: "var(--solana-green)" }} />
                    <span className="text-xs font-semibold" style={{ color: "var(--solana-green)" }}>{timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : "Expired"}</span>
                  </div>
                )}
                <div className="flex gap-3 w-full">
                  <button onClick={handleCopy} className="glow-btn-outline flex-1 gap-2 text-sm cursor-pointer" style={{ padding: "10px 16px" }}>
                    {copied ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                  <button className="glow-btn flex-1 gap-2 text-sm cursor-pointer" style={{ padding: "10px 16px" }}>
                    <Download className="w-4 h-4" /> Download
                  </button>
                </div>
              </div>
              {/* QR Settings */}
              <div className="flex flex-col gap-8">
                <div className="glass-card-static p-8">
                  <h3 className="text-base font-semibold mb-6">QR Settings</h3>
                  <div className="flex items-center justify-between mb-4 p-4 rounded-xl" style={{ background: "rgba(20,20,40,0.5)" }}>
                    <div><p className="text-sm font-medium">Time-limited Code</p><p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>QR expires after 5 minutes for security</p></div>
                    <button onClick={() => setTimeLimit(!timeLimit)} className="w-12 h-6 rounded-full transition-all relative cursor-pointer" style={{ background: timeLimit ? "var(--solana-green)" : "rgba(148,163,184,0.3)" }}>
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: timeLimit ? 26 : 2 }} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(20,20,40,0.5)" }}>
                    <div><p className="text-sm font-medium">Include Service History</p><p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Let workshop see full maintenance records</p></div>
                    <button className="w-12 h-6 rounded-full transition-all relative" style={{ background: "var(--solana-green)" }}>
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5" style={{ left: 26 }} />
                    </button>
                  </div>
                </div>
                <div className="glass-card-static p-8">
                  <h3 className="text-base font-semibold mb-6">Vehicle Identity Card</h3>
                  <div className="p-5 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(153,69,255,0.12) 0%, rgba(20,241,149,0.06) 100%)", border: "1px solid rgba(153,69,255,0.2)" }}>
                    <div className="flex justify-between items-start mb-4">
                      <div><p className="text-lg font-bold">{currentVehicleData.name}</p><p className="text-xs mono" style={{ color: "var(--solana-text-muted)" }}>VIN: {currentVehicleData.vin}</p></div>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--solana-gradient)" }}><Shield className="w-5 h-5 text-white" /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>NOC ID</p><p className="font-semibold mono text-sm">#{currentVehicleData.vin.substring(currentVehicleData.vin.length - 5)}</p></div>
                      <div><p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Health</p><p className="font-semibold text-sm" style={{ color: "#A3E635" }}>{currentVehicleData.health}</p></div>
                      <div><p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Services</p><p className="font-semibold text-sm">12</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="nfc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* NFC Card */}
              <div className="flex flex-col gap-6">
                <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden transition-all duration-300"
                  style={{ background: isActive ? "linear-gradient(135deg, rgba(153,69,255,0.7) 0%, rgba(20,241,149,0.3) 100%)" : "rgba(30,30,50,0.8)", border: `1px solid ${isActive ? "rgba(153,69,255,0.5)" : "rgba(255,255,255,0.1)"}`, filter: isActive ? "none" : "grayscale(100%)" }}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-2"><Shield className="w-6 h-6 text-white" /><span className="font-bold text-lg text-white">NOC ID</span></div>
                    <Activity className="w-6 h-6 text-white animate-pulse" style={{ opacity: isActive ? 1 : 0.2 }} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-white/70 text-xs mb-1">Linked Vehicle</p>
                    <p className="text-white font-bold text-xl mb-4 tracking-wide">{currentVehicleData.name}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-white/80 mono text-sm tracking-widest">NFC-{currentVehicleData.vin.substring(currentVehicleData.vin.length - 8, currentVehicleData.vin.length - 4)}-{currentVehicleData.vin.substring(currentVehicleData.vin.length - 4)}</p>
                      <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: isActive ? "rgba(20,241,149,0.2)" : "rgba(255,0,0,0.2)", color: isActive ? "#14F195" : "#EF4444" }}>{isActive ? "ACTIVE" : "FROZEN"}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 max-w-md mx-auto w-full">
                  <button onClick={() => setIsActive(!isActive)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all cursor-pointer" style={{ background: isActive ? "rgba(239,68,68,0.1)" : "rgba(20,241,149,0.1)", color: isActive ? "#EF4444" : "#14F195", border: `1px solid ${isActive ? "rgba(239,68,68,0.3)" : "rgba(20,241,149,0.3)"}` }}>
                    <Power className="w-4 h-4" /> {isActive ? "Freeze Card" : "Unfreeze Card"}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold glow-btn-outline cursor-pointer text-sm">
                    <AlertTriangle className="w-4 h-4" /> Report Lost
                  </button>
                </div>
              </div>
              {/* NFC Settings */}
              <div className="flex flex-col gap-8">
                <div className="glass-card-static p-8">
                  <h3 className="text-base font-semibold mb-6 flex items-center gap-2"><Key className="w-5 h-5" style={{ color: "var(--solana-purple)" }} /> Permissions</h3>
                  <div className="flex items-center justify-between p-4 rounded-xl mb-3" style={{ background: "rgba(20,20,40,0.5)" }}>
                    <div><p className="text-sm font-medium">Verify Only Mode</p><p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Scanner can only see health, cannot append logs</p></div>
                    <button className="w-12 h-6 rounded-full transition-all relative" style={{ background: "rgba(148,163,184,0.3)" }}><div className="w-5 h-5 bg-white rounded-full absolute top-0.5" style={{ left: 2 }} /></button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(20,20,40,0.5)" }}>
                    <div><p className="text-sm font-medium">Require PIN</p><p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>DApp approval required for every scan</p></div>
                    <button className="w-12 h-6 rounded-full transition-all relative" style={{ background: "var(--solana-green)" }}><div className="w-5 h-5 bg-white rounded-full absolute top-0.5" style={{ left: 26 }} /></button>
                  </div>
                </div>
                <div className="glass-card-static p-8">
                  <h3 className="text-base font-semibold mb-6 flex items-center gap-2"><History className="w-5 h-5" style={{ color: "var(--solana-purple)" }} /> Scan History</h3>
                  <div className="flex flex-col gap-3">
                    {scanHistory.map((scan, i) => (
                      <div key={i} className="flex justify-between items-center p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <div><p className="text-sm font-medium">{scan.location}</p><p className="text-xs mono mt-1" style={{ color: "var(--solana-text-muted)" }}>{scan.date}</p></div>
                        <span className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(20,241,149,0.1)", color: "var(--solana-green)" }}>{scan.auth}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen QR Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <button onClick={() => setIsFullscreen(false)} className="absolute top-6 right-6 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"><X className="w-6 h-6 text-white" /></button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="flex flex-col items-center">
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-3xl flex items-center justify-center relative shadow-2xl" style={{ background: "white", padding: 24, boxShadow: "0 0 50px rgba(153,69,255,0.2)" }}>
                <div className="w-full h-full" style={{ background: `repeating-conic-gradient(#0E0E1A 0% 25%, transparent 0% 50%) 50% / 24px 24px`, borderRadius: 12 }} />
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "var(--solana-gradient)" }}><Shield className="w-10 h-10 text-white" /></div></div>
              </div>
              <p className="text-lg mono mt-8 font-bold text-white tracking-widest">NOC ID #00001</p>
              {timeLimit && <div className="mt-4 px-6 py-3 rounded-2xl bg-black/50 border border-green-500/30 text-green-400 font-mono text-xl">{timeLeft > 0 ? formatTime(timeLeft) : "EXPIRED"}</div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
