"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Navigation,
  Clock,
  ClipboardList,
  FileText,
  Gauge,
  Zap,
  Activity,
  Battery,
  X,
} from "lucide-react";
import { useDriverStore, type RouteLog } from "@/store/driverStore";

// Lazy-load the route detail map
const RouteDetailMap = dynamic(
  () => import("@/components/depin/RouteDetailMap").then((m) => m.RouteDetailMap),
  { ssr: false }
);

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const dayMs = 86400000;
  if (diff < dayMs) return `Today, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  if (diff < 2 * dayMs) return `Yesterday, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}

export default function DriverRoutesPage() {
  const pathname = usePathname();
  const routeLogs = useDriverStore((s) => s.routeLogs);
  const [selectedLog, setSelectedLog] = useState<RouteLog | null>(null);

  const navItems = [
    { href: "/depin/driver", label: "Tracker", icon: Navigation },
    { href: "/depin/driver/routes", label: "Routes", icon: ClipboardList },
    { href: "/depin/driver/docs", label: "Docs", icon: FileText },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: "#0a0e17", color: "#E4E6EB" }}>
      <div className="max-w-[480px] mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pt-2">
          <Link href="/depin/driver" className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <h1 className="text-xl font-bold text-white font-[family-name:var(--font-orbitron)]">
            Daily Route Logs
          </h1>
        </div>

        {/* Info */}
        <p className="text-xs text-white/30 mb-4 px-1">
          Routes reset at midnight. Past routes are saved here automatically.
        </p>

        {/* Route Log List */}
        <div className="space-y-3">
          {routeLogs.length === 0 && (
            <div className="text-center py-16">
              <ClipboardList size={40} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No route logs yet.</p>
              <p className="text-white/20 text-xs mt-1">
                Routes will appear here after daily GPS tracking resets.
              </p>
            </div>
          )}

          {routeLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className="rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Accent glow */}
              <div className="absolute right-0 top-0 w-32 h-32 bg-[#14B8A6]/5 rounded-full blur-2xl group-hover:bg-[#14B8A6]/10 transition-colors" />

              <div className="flex justify-between items-start mb-3 relative z-10">
                <div>
                  <p className="text-white font-bold text-base">{log.title}</p>
                  <p className="text-xs text-white/30 mt-0.5">{formatDate(log.date)}</p>
                </div>
                <div className="bg-[#14B8A6]/10 text-[#14B8A6] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#14B8A6]/20 uppercase tracking-wider">
                  +{log.regenPercent}% Regen
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-white/30 uppercase font-bold flex items-center gap-1">
                    <Navigation size={11} /> Dist
                  </span>
                  <span className="text-sm font-semibold text-white">{log.distance.toFixed(1)} km</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-white/30 uppercase font-bold flex items-center gap-1">
                    <Clock size={11} /> Time
                  </span>
                  <span className="text-sm font-semibold text-white">{formatDuration(log.duration)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-[#14B8A6] uppercase font-bold flex items-center gap-1">
                    <Gauge size={11} /> Speed
                  </span>
                  <span className="text-sm font-semibold text-white group-hover:text-[#14B8A6] transition-colors">
                    {log.avgSpeed.toFixed(0)} km/h
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-6">
          <div className="relative w-full h-[95vh] sm:h-[800px] max-w-[480px] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-10" style={{ background: "#0a0e17" }}>
            {/* Close */}
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 z-[1000] p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Map */}
            <div className="relative h-[45%] w-full shrink-0">
              <RouteDetailMap route={selectedLog.route} />
              <div className="absolute bottom-0 left-0 right-0 h-10 z-[500]" style={{ background: "linear-gradient(to top, #0a0e17 0%, transparent 100%)" }} />
            </div>

            {/* Details */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h2 className="text-xl font-black text-white font-[family-name:var(--font-orbitron)] tracking-tight mb-1">
                {selectedLog.title}
              </h2>
              <p className="text-sm text-white/40 font-medium mb-6">{formatDate(selectedLog.date)}</p>

              <div className="grid grid-cols-3 gap-y-6 gap-x-3 mb-8">
                <StatItem icon={<Navigation size={12} />} label="Distance" value={`${selectedLog.distance.toFixed(1)}`} unit="km" color="text-sky-400" />
                <StatItem icon={<Clock size={12} />} label="Time" value={formatDuration(selectedLog.duration)} color="text-amber-400" />
                <StatItem icon={<Gauge size={12} />} label="Coverage" value={`${selectedLog.routeCoverage}`} unit="%" color="text-rose-400" />
                <StatItem icon={<Activity size={12} />} label="Segments" value={`${selectedLog.segments}`} color="text-white/50" />
                <StatItem icon={<Zap size={12} />} label="Energy" value={`${selectedLog.energy.toFixed(1)}`} unit="kWh" color="text-yellow-400" />
                <StatItem icon={<Battery size={12} />} label="Regen" value={`+${selectedLog.regenPercent}%`} color="text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto" style={{ background: "rgba(10,14,23,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(94,234,212,0.12)" }}>
        <div className="grid grid-cols-3 text-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="py-3 flex flex-col items-center gap-0.5">
                <Icon size={20} style={{ color: isActive ? "#5EEAD4" : "#71717A" }} />
                <span className="text-[10px] font-medium" style={{ color: isActive ? "#5EEAD4" : "#71717A" }}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function StatItem({ icon, label, value, unit, color }: { icon: React.ReactNode; label: string; value: string; unit?: string; color: string }) {
  return (
    <div className="flex flex-col">
      <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1 ${color}`}>{icon} {label}</span>
      <span className="text-xl font-black text-white tracking-tight">{value}{unit && <span className="text-xs font-bold text-white/40"> {unit}</span>}</span>
    </div>
  );
}
