"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, Search, Plus, Calendar, CheckCircle2, ShieldAlert, ArrowUpRight } from "lucide-react";

const recallCampaigns = [
  { id: "RC-2026-001", title: "Avanza CVT Software Update", status: "Active", completion: 68, affected: 15200, date: "2026-02-15" },
  { id: "RC-2025-088", title: "Innova Airbag Sensor Bracket", status: "Active", completion: 82, affected: 8400, date: "2025-11-10" },
  { id: "RC-2025-042", title: "Fortuner Brake Booster Line", status: "Closed", completion: 97, affected: 4200, date: "2025-06-22" },
];

export default function RecallsPage() {
  const [filter, setFilter] = useState("active");

  const filtered = filter === "all" ? recallCampaigns : recallCampaigns.filter(r => r.status.toLowerCase() === filter);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="flex items-center gap-3 font-bold text-2xl md:text-3xl">
            <AlertOctagon className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
            Recall Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>Target specific VIN ranges and track recall compliance on-chain.</p>
        </div>
        <button className="glow-btn text-sm flex items-center gap-2" style={{ padding: "10px 20px" }}>
          <Plus className="w-4 h-4" /> Issue New Recall
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card-static p-6 rounded-2xl">
          <p className="text-sm mb-2" style={{ color: "var(--solana-text-muted)" }}>Active Campaigns</p>
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-orange-500" />
            <span className="text-3xl font-bold">2</span>
          </div>
        </div>
        <div className="glass-card-static p-6 rounded-2xl">
          <p className="text-sm mb-2" style={{ color: "var(--solana-text-muted)" }}>Total Affected Vehicles (Active)</p>
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6" style={{ color: "var(--solana-purple)" }} />
            <span className="text-3xl font-bold">23,600</span>
          </div>
        </div>
        <div className="glass-card-static p-6 rounded-2xl">
          <p className="text-sm mb-2" style={{ color: "var(--solana-text-muted)" }}>Global Compliance Rate</p>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" style={{ color: "var(--solana-green)" }} />
            <span className="text-3xl font-bold text-green-500">74%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2">
          {["all", "active", "closed"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all" style={{ background: filter === f ? "rgba(153,69,255,0.15)" : "transparent", color: filter === f ? "var(--solana-purple)" : "var(--solana-text-muted)", border: filter === f ? "1px solid var(--solana-purple)" : "1px solid rgba(255,255,255,0.1)" }}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--solana-text-muted)" }} />
          <input type="text" placeholder="Search Campaign ID or Title" className="input-field pl-9 text-sm w-full sm:w-64" />
        </div>
      </div>

      <div className="glass-card-static overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(153,69,255,0.2)" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Campaign ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Completion</th>
              <th>Affected</th>
              <th>Issue Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map((c, i) => (
              <motion.tr key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-white/5 transition-colors">
                <td className="mono font-medium text-sm text-purple-400">{c.id}</td>
                <td className="font-medium">{c.title}</td>
                <td>
                  <span className="badge" style={{ background: c.status === "Active" ? "rgba(249,115,22,0.15)" : "rgba(34,197,94,0.15)", color: c.status === "Active" ? "#F97316" : "#22C55E", border: `1px solid ${c.status === "Active" ? "#F97316" : "#22C55E"}40` }}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${c.completion}%`, background: c.completion > 80 ? "var(--solana-green)" : c.completion > 50 ? "#FACC15" : "var(--solana-purple)" }} />
                    </div>
                    <span className="text-sm font-semibold">{c.completion}%</span>
                  </div>
                </td>
                <td className="mono text-sm">{c.affected.toLocaleString()}</td>
                <td>
                  <span className="flex items-center gap-1 text-sm" style={{ color: "var(--solana-text-muted)" }}>
                    <Calendar className="w-3 h-3" /> {c.date}
                  </span>
                </td>
                <td>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-purple-400">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  <AlertOctagon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No campaigns found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
