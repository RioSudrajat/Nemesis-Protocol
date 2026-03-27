"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Car, Shield, AlertTriangle, CheckCircle2, MapPin, Search, Filter, Download, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const regions = [
  { name: "Jakarta", vehicles: 1240, healthy: 1050, warning: 150, critical: 40, color: "var(--solana-purple)" },
  { name: "Surabaya", vehicles: 860, healthy: 720, warning: 110, critical: 30, color: "var(--solana-green)" },
  { name: "Bandung", vehicles: 620, healthy: 530, warning: 70, critical: 20, color: "var(--solana-cyan)" },
  { name: "Medan", vehicles: 380, healthy: 320, warning: 45, critical: 15, color: "#FACC15" },
  { name: "Semarang", vehicles: 290, healthy: 255, warning: 25, critical: 10, color: "#F97316" },
  { name: "Makassar", vehicles: 210, healthy: 185, warning: 20, critical: 5, color: "var(--solana-pink)" },
];

const vehicleList = [
  { vin: "MHKA1BA1JFK000001", model: "Avanza 2025", region: "Jakarta", health: 87, status: "Good" },
  { vin: "MHKA1BA1JFK000042", model: "Rush 2024", region: "Jakarta", health: 45, status: "Critical" },
  { vin: "MHKA1BA1JFK000108", model: "Innova 2025", region: "Surabaya", health: 92, status: "Excellent" },
  { vin: "MHKA1BA1JFK000215", model: "Fortuner 2024", region: "Bandung", health: 68, status: "Warning" },
  { vin: "MHKA1BA1JFK000330", model: "Yaris 2025", region: "Medan", health: 95, status: "Excellent" },
  { vin: "MHKA1BA1JFK000411", model: "Calya 2024", region: "Semarang", health: 55, status: "Warning" },
];

function getHealthColor(health: number) {
  if (health >= 90) return "#22C55E";
  if (health >= 70) return "#A3E635";
  if (health >= 50) return "#FACC15";
  if (health >= 30) return "#F97316";
  return "#EF4444";
}

export default function FleetPage() {
  const totalVehicles = regions.reduce((a, r) => a + r.vehicles, 0);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="page-header mb-0">
          <h1 className="flex items-center gap-3 font-bold text-2xl md:text-3xl">
            <Map className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
            Fleet Map
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>Vehicle distribution across regions</p>
        </div>
        <button className="glow-btn-outline text-sm flex items-center gap-2 py-2 px-4">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Car, label: "Total Vehicles", value: totalVehicles.toLocaleString(), color: "var(--solana-purple)" },
          { icon: CheckCircle2, label: "Healthy", value: "3,060", color: "#22C55E" },
          { icon: AlertTriangle, label: "Warnings", value: "420", color: "#FACC15" },
          { icon: Shield, label: "Critical", value: "120", color: "#EF4444" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-6 rounded-2xl">
            <s.icon className="w-6 h-6 mb-3" style={{ color: s.color }} />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Region breakdown & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="glass-card-static p-6 rounded-2xl col-span-1 border" style={{ borderColor: "rgba(153,69,255,0.2)" }}>
          <h3 className="text-base font-semibold mb-6">Regional Distribution</h3>
          <div className="flex flex-col gap-6">
            {regions.map((r, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <MapPin className="w-4 h-4 shrink-0 transition-transform group-hover:scale-125" style={{ color: r.color }} />
                <span className="text-sm w-20">{r.name}</span>
                <div className="flex-1 h-3 rounded-full overflow-hidden flex" style={{ background: "rgba(20,20,40,0.5)" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(r.healthy / r.vehicles) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.08 }} className="h-full" style={{ background: "#22C55E", opacity: 0.8 }} />
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(r.warning / r.vehicles) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.08 + 0.1 }} className="h-full" style={{ background: "#FACC15", opacity: 0.8 }} />
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(r.critical / r.vehicles) * 100}%` }} transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }} className="h-full" style={{ background: "#EF4444", opacity: 0.8 }} />
                </div>
                <span className="text-xs font-semibold mono w-12 text-right">{r.vehicles}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="glass-card-static p-8 flex items-center justify-center rounded-2xl col-span-1 lg:col-span-2 relative overflow-hidden group border" style={{ borderColor: "rgba(153,69,255,0.1)", minHeight: 400 }}>
          <div className="absolute inset-0 bg-[url('https://i.ibb.co/3sZ8X9k/map-bg.png')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-1000 grayscale"></div>
          <div className="text-center relative z-10">
            <Map className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--solana-purple)", opacity: 0.5 }} />
            <p className="text-sm font-semibold mb-2">Interactive Fleet Map View</p>
            <p className="text-xs max-w-xs mx-auto mb-4" style={{ color: "var(--solana-text-muted)" }}>Connecting to geospatial data grid. Will display live locations and density maps.</p>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Coming in v1.2</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--solana-text-muted)" }} />
          <input type="text" placeholder="Search by VIN or Model..." className="input-field pl-9 w-full text-sm" />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--solana-text-muted)" }} />
            <select className="input-field pl-9 text-sm w-40 appearance-none bg-transparent">
              <option value="">All Regions</option>
              {regions.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
            </select>
          </div>
          <div className="relative">
            <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--solana-text-muted)" }} />
            <select className="input-field pl-9 text-sm w-40 appearance-none bg-transparent">
              <option value="">Status: All</option>
              <option value="good">Good / Excellent</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical / Danger</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle list */}
      <div className="glass-card-static overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(153,69,255,0.2)" }}>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-black/20 border-b border-white/5">
            <tr className="text-xs uppercase tracking-wider text-gray-400">
              <th className="py-4 px-6 font-medium">VIN</th>
              <th className="py-4 px-6 font-medium">Model</th>
              <th className="py-4 px-6 font-medium">Region</th>
              <th className="py-4 px-6 font-medium">Health Score</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {vehicleList.map((v, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group cursor-pointer">
                <td className="py-4 px-6"><span className="mono text-xs">{v.vin}</span></td>
                <td className="py-4 px-6 font-medium">{v.model}</td>
                <td className="py-4 px-6 text-gray-400">{v.region}</td>
                <td className="py-4 px-6">
                  <span className="font-bold mono px-2 py-1 rounded-md" style={{ color: getHealthColor(v.health), background: `${getHealthColor(v.health)}15` }}>
                    {v.health}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${getHealthColor(v.health)}15`, color: getHealthColor(v.health), border: `1px solid ${getHealthColor(v.health)}40` }}>
                    {v.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t border-white/5 bg-black/10">
          <span className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Showing 1 to 6 of 3,600 entries</span>
          <div className="flex gap-1 border border-white/10 rounded-lg overflow-hidden bg-black/20">
            <button className="p-2 hover:bg-white/10 transition-colors disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
            <button className="px-3 py-1 text-sm bg-purple-500/20 text-purple-400 font-medium border-x border-white/5">1</button>
            <button className="px-3 py-1 text-sm hover:bg-white/10 transition-colors font-medium border-r border-white/5">2</button>
            <button className="px-3 py-1 text-sm hover:bg-white/10 transition-colors font-medium border-r border-white/5">3</button>
            <span className="px-2 py-1 text-sm text-gray-500">...</span>
            <button className="px-3 py-1 text-sm hover:bg-white/10 transition-colors font-medium border-l border-white/5">600</button>
            <button className="p-2 hover:bg-white/10 transition-colors border-l border-white/5"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
