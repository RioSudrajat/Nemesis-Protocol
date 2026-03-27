"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, Shield, Clock, Car, AlertTriangle, Download, Wrench } from "lucide-react";

const healthTrend = [78, 80, 79, 82, 84, 83, 85, 87, 86, 88, 87, 89];
const costData = [
  { month: "Oct", cost: 145 }, { month: "Nov", cost: 132 }, { month: "Dec", cost: 168 },
  { month: "Jan", cost: 121 }, { month: "Feb", cost: 115 }, { month: "Mar", cost: 108 },
];
const maxCost = Math.max(...costData.map(c => c.cost));

const failurePoints = [
  { part: "Suspension - Front Struts", count: 412, pct: 100, color: "#EF4444" },
  { part: "Brakes - Front Pads", count: 328, pct: 80, color: "#F97316" },
  { part: "Battery", count: 245, pct: 60, color: "#FACC15" },
  { part: "CVT Transmission Belt", count: 189, pct: 45, color: "var(--solana-pink)" },
  { part: "AC Compressor", count: 122, pct: 30, color: "var(--solana-cyan)" },
];

const compliance = [
  { category: "On-time Service", pct: 92, color: "var(--solana-green)" },
  { category: "OEM Parts Used", pct: 87, color: "var(--solana-purple)" },
  { category: "Warranty Coverage", pct: 78, color: "var(--solana-cyan)" },
  { category: "Digital Records", pct: 95, color: "#FACC15" },
];

export default function EnterpriseAnalyticsPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="page-header mb-0">
          <h1 className="flex items-center gap-3 font-bold text-2xl md:text-3xl">
            <BarChart3 className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
            Fleet Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>Macro patterns, component failures, and cost tracking.</p>
        </div>
        <button className="glow-btn-outline text-sm flex items-center gap-2 py-2 px-4 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20">
          <Download className="w-4 h-4" /> Export Report (PDF)
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: TrendingUp, label: "Avg Health Score", value: "87.4", change: "+2.1", color: "var(--solana-green)" },
          { icon: DollarSign, label: "Avg Cost/Vehicle", value: "$108", change: "-12%", color: "var(--solana-cyan)" },
          { icon: Shield, label: "Compliance Rate", value: "92%", change: "+3%", color: "var(--solana-purple)" },
          { icon: AlertTriangle, label: "Open Issues", value: "23", change: "-5", color: "#F97316" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-6 rounded-2xl border" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1" style={{ background: `${s.color}15`, color: s.color }}>
                {s.change.startsWith("+") ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />} {s.change}
              </span>
            </div>
            <p className="text-3xl font-bold mb-1">{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--solana-text-muted)" }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Most Common Failure Points */}
        <div className="glass-card-static p-8 rounded-2xl border border-white/5 order-2 lg:order-1 lg:row-span-2">
          <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-red-400" /> Top Failure Points
          </h3>
          <p className="text-sm mb-6 pb-4 border-b border-white/5" style={{ color: "var(--solana-text-muted)" }}>Components most frequently repaired or replaced across the fleet in the last 90 days.</p>
          
          <div className="flex flex-col gap-5">
            {failurePoints.map((f, i) => (
              <div key={i} className="group">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{f.part}</span>
                  <span className="mono text-gray-400">{f.count} incidents</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden bg-black/30 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${f.pct}%` }} 
                    transition={{ duration: 1, delay: i * 0.1 }} 
                    className="h-full rounded-full relative" 
                    style={{ background: f.color }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-0 group-hover:w-full transition-all duration-500 ease-out" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health trend */}
        <div className="glass-card-static p-8 rounded-2xl border border-white/5 order-1 lg:order-2">
          <h3 className="text-base font-semibold mb-6">Fleet Health Trend (12 Months)</h3>
          <div className="flex items-end gap-2" style={{ height: 160 }}>
            {healthTrend.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 flex rounded-md text-xs border border-white/10 z-10 pointer-events-none">
                  <span className="font-bold text-green-400">{h}</span>
                </div>
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${((h - 70) / 30) * 140}px` }} 
                  transition={{ duration: 0.5, delay: i * 0.05 }} 
                  className="w-full rounded-t-lg group-hover:brightness-125 transition-all" 
                  style={{ background: `rgba(34,197,94,${0.3 + (h - 70) / 60})`, minHeight: 4 }} 
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-500">Apr 2025</span>
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-500">Mar 2026</span>
          </div>
        </div>

        {/* Compliance */}
        <div className="glass-card-static p-8 rounded-2xl border border-white/5 order-3">
          <h3 className="text-base font-semibold mb-6">Service Compliance Overview</h3>
          <div className="grid grid-cols-1 gap-5">
            {compliance.map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm font-medium w-36" style={{ color: "var(--solana-text-muted)" }}>{c.category}</span>
                <div className="flex-1 h-3 rounded-full overflow-hidden bg-black/30 border border-white/5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.6, delay: i * 0.1 }} className="h-full rounded-full" style={{ background: c.color }} />
                </div>
                <span className="text-sm font-bold mono w-10 text-right">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
