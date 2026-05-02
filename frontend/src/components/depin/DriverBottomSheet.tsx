"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import {
  Navigation, Clock, Gauge, Zap, Battery, Activity,
  ShieldCheck, Settings, Wrench, CheckCircle2, AlertTriangle, ChevronUp,
} from "lucide-react";

interface Props {
  expanded: boolean;
  onToggle: (v: boolean) => void;
  vehicleId: string;
  vehicleName: string;
  vehicleModel: string;
  gpsEnabled: boolean;
  todayDistance: number;
  todayActiveTime: number;
  todayAvgSpeed: number;
  todayEnergy: number;
  todayRegenPercent: number;
  todayRouteCoverage: number;
  todaySegments: number;
  batteryLevel: number;
  dailyFee: number;
  isPaidToday: boolean;
  monthPaidDays: number;
  monthTotalDays: number;
  arrears: number;
  batteryHealthDelta: number;
  tireTreadDelta: number;
  brakePadStatus: string;
  nextServiceKm: number;
}

const fmt = (s: number) => { const h = Math.floor(s/3600), m = Math.floor((s%3600)/60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };
const rp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export function DriverBottomSheet(p: Props) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { controls.start(p.expanded ? "expanded" : "collapsed"); }, [p.expanded, controls]);

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -50) p.onToggle(true);
    else if (info.offset.y > 50) p.onToggle(false);
  };

  return (
    <motion.div
      className="fixed left-0 right-0 z-30 max-w-[480px] mx-auto"
      style={{ bottom: 56, borderRadius: "24px 24px 0 0", background: "rgba(10,14,23,0.95)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderTop: "1px solid rgba(94,234,212,0.15)", boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" }}
      animate={controls}
      variants={{ collapsed: { height: 120 }, expanded: { height: "70dvh" } }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.1} onDragEnd={onDragEnd}
    >
      {/* Handle */}
      <div className="flex flex-col items-center pt-3 pb-2 cursor-pointer" onClick={() => p.onToggle(!p.expanded)}>
        <div className="w-10 h-1 rounded-full bg-white/20 mb-2" />
        <motion.div animate={{ rotate: p.expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronUp size={16} className="text-white/40" />
        </motion.div>
      </div>

      {/* Collapsed header */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "rgba(94,234,212,0.12)", border: "1px solid rgba(94,234,212,0.2)" }}>🏍️</div>
            <div>
              <p className="text-white font-bold text-sm">{p.vehicleId} <span className="text-white/40">•</span> <span className="text-white/70 font-medium">{p.vehicleModel}</span></p>
              <p className="text-xs text-white/40 mt-0.5">{p.vehicleName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider" style={{ background: p.gpsEnabled ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: p.gpsEnabled ? "#22C55E" : "#EF4444", border: `1px solid ${p.gpsEnabled ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}` }}>
              {p.gpsEnabled ? "● Active" : "○ Off"}
            </span>
            <span className="text-xs text-white/50">{fmt(p.todayActiveTime)} today</span>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {p.expanded && (
        <div ref={ref} className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: "calc(70dvh - 120px)" }} onPointerDownCapture={e => e.stopPropagation()}>
          <div className="h-px bg-white/5 mb-5" />

          {/* Stats grid */}
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-4">Today&apos;s Activity</h3>
          <div className="grid grid-cols-3 gap-y-6 gap-x-3 mb-6">
            <Stat icon={<Navigation size={12}/>} label="Distance" value={`${p.todayDistance.toFixed(1)}`} unit="km" color="text-sky-400" />
            <Stat icon={<Clock size={12}/>} label="Active" value={fmt(p.todayActiveTime)} color="text-amber-400" />
            <Stat icon={<Gauge size={12}/>} label="Avg Speed" value={`${p.todayAvgSpeed.toFixed(0)}`} unit="km/h" color="text-rose-400" />
            <Stat icon={<Zap size={12}/>} label="Energy" value={`${p.todayEnergy.toFixed(1)}`} unit="kWh" color="text-yellow-400" />
            <Stat icon={<Battery size={12}/>} label="Battery" value={`${p.batteryLevel}`} unit="%" color="text-teal-400" />
            <Stat icon={<Activity size={12}/>} label="Regen" value={`+${p.todayRegenPercent}%`} color="text-emerald-400" accent />
          </div>

          {/* Proof of Activity */}
          <div className="h-px bg-white/5 mb-5" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-4">Proof of Activity</h3>
          <div className="space-y-3 mb-6">
            <Proof label="GPS Verified" value={p.gpsEnabled ? "Active" : "Inactive"} ok={p.gpsEnabled} />
            <Proof label="Route Coverage" value={`${p.todayRouteCoverage}%`} ok={p.todayRouteCoverage >= 50} />
            <Proof label="Active Hours" value={fmt(p.todayActiveTime)} ok={p.todayActiveTime >= 3600} />
            <Proof label="Segments" value={`${p.todaySegments}`} ok={p.todaySegments >= 3} />
          </div>

          {/* Component Health */}
          <div className="h-px bg-white/5 mb-5" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-4">Component Health</h3>
          <div className="space-y-3 mb-6">
            <Health icon={<Battery size={15}/>} label="Battery Health" value={`${p.batteryHealthDelta}%`} bad={p.batteryHealthDelta < 0} />
            <Health icon={<Settings size={15}/>} label="Tire Tread" value={`${p.tireTreadDelta}%`} bad={p.tireTreadDelta < 0} />
            <Health icon={<ShieldCheck size={15}/>} label="Brake Pads" value={p.brakePadStatus} bad={false} />
            <Health icon={<Wrench size={15}/>} label="Next Service" value={`${p.nextServiceKm} km`} bad={p.nextServiceKm < 100} />
          </div>

          {/* Rental Status */}
          <div className="h-px bg-white/5 mb-5" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-4">Rental Status</h3>
          <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-bold text-lg">{rp(p.dailyFee)}<span className="text-white/30 text-sm font-normal">/day</span></p>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1" style={{ background: p.isPaidToday ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: p.isPaidToday ? "#22C55E" : "#EF4444", border: `1px solid ${p.isPaidToday ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}` }}>
                {p.isPaidToday ? <><CheckCircle2 size={10}/> PAID</> : <><AlertTriangle size={10}/> UNPAID</>}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40">This month: {p.monthPaidDays}/{p.monthTotalDays} days</span>
              <span className={p.arrears > 0 ? "text-red-400 font-semibold" : "text-white/40"}>{p.arrears > 0 ? `Arrears: ${rp(p.arrears)}` : "No arrears"}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Stat({ icon, label, value, unit, color, accent }: { icon: React.ReactNode; label: string; value: string; unit?: string; color: string; accent?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1 ${color}`}>{icon} {label}</span>
      <span className={`text-xl font-black tracking-tight ${accent ? color : "text-white"}`}>{value}{unit && <span className="text-xs font-bold text-white/40"> {unit}</span>}</span>
    </div>
  );
}

function Proof({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/60 flex items-center gap-2">
        {ok ? <CheckCircle2 size={14} className="text-emerald-400"/> : <AlertTriangle size={14} className="text-amber-400"/>}
        {label}
      </span>
      <span className={`text-sm font-semibold ${ok ? "text-emerald-400" : "text-amber-400"}`}>{value}</span>
    </div>
  );
}

function Health({ icon, label, value, bad }: { icon: React.ReactNode; label: string; value: string; bad: boolean }) {
  return (
    <div className="flex items-center justify-between group">
      <span className="text-sm text-white/60 flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors text-white/40">{icon}</div>
        {label}
      </span>
      <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${bad ? "text-rose-400 bg-rose-500/10" : "text-emerald-400 bg-emerald-500/10"}`}>{value}</span>
    </div>
  );
}
