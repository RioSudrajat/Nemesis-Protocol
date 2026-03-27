"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Search, CheckCircle2, ShieldCheck, ChevronLeft, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { workshopsData, Workshop } from "@/context/BookingContext";

const LeafletMap = dynamic(() => import("@/components/ui/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full rounded-2xl" style={{ background: "var(--solana-dark-2)" }}>
      <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--solana-purple)" }} />
    </div>
  ),
});

const cities = ["Semua", "Jakarta", "Surabaya", "Tangerang", "Bandung", "Semarang"];
const filters = ["Semua", "Terverifikasi", "OEM Certified"];

export default function BookServicePage() {
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState("Semua");
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filtered = workshopsData.filter((ws) => {
    const matchSearch = ws.name.toLowerCase().includes(search.toLowerCase()) || ws.specialization.toLowerCase().includes(search.toLowerCase());
    const matchCity = activeCity === "Semua" || ws.city === activeCity;
    const matchFilter = activeFilter === "Semua" || (activeFilter === "Terverifikasi" && ws.verified) || (activeFilter === "OEM Certified" && ws.oem);
    return matchSearch && matchCity && matchFilter;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dapp" className="p-2 rounded-xl hover:bg-white/5 transition-colors" style={{ color: "var(--solana-text-muted)" }}>
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Cari Bengkel</h1>
          <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>Temukan bengkel terverifikasi di jaringan NOC ID</p>
        </div>
      </div>

      {/* Real Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-2xl overflow-hidden"
        style={{ height: "400px" }}
      >
        <LeafletMap workshops={filtered} />
      </motion.div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--solana-text-muted)" }} />
          <input
            type="text"
            placeholder="Cari bengkel atau spesialisasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 text-sm outline-none transition-colors"
            style={{ border: "1px solid rgba(153,69,255,0.15)", color: "var(--solana-text)" }}
          />
        </div>
        <select
          value={activeCity}
          onChange={(e) => setActiveCity(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 text-sm outline-none cursor-pointer"
          style={{ border: "1px solid rgba(153,69,255,0.15)", color: "var(--solana-text)" }}
        >
          {cities.map((c) => (
            <option key={c} value={c} style={{ background: "var(--solana-dark-2)" }}>{c}</option>
          ))}
        </select>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            style={{
              background: activeFilter === f ? "rgba(153,69,255,0.15)" : "rgba(255,255,255,0.03)",
              color: activeFilter === f ? "var(--solana-purple)" : "var(--solana-text-muted)",
              border: `1px solid ${activeFilter === f ? "rgba(153,69,255,0.3)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Workshop cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ws, i) => (
          <WorkshopCard key={ws.id} workshop={ws} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12" style={{ color: "var(--solana-text-muted)" }}>
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Tidak ada bengkel ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}

function WorkshopCard({ workshop: ws, index }: { workshop: Workshop; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-6 flex flex-col justify-between group hover:bg-white/[0.03] transition-colors"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-sm">{ws.name}</h3>
          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#FACC15" }}>
            <Star className="w-3.5 h-3.5 fill-current" />
            {ws.rating}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: "var(--solana-text-muted)" }}>
          <MapPin className="w-3.5 h-3.5" />
          {ws.address}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {ws.badges.map((badge) => (
            <span
              key={badge}
              className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{
                background: badge === "Pending KYC" ? "rgba(250,204,21,0.1)" : "rgba(20,241,149,0.1)",
                color: badge === "Pending KYC" ? "#FACC15" : "var(--solana-green)",
                border: `1px solid ${badge === "Pending KYC" ? "rgba(250,204,21,0.2)" : "rgba(20,241,149,0.2)"}`,
              }}
            >
              {badge === "Pending KYC" ? null : <CheckCircle2 className="w-2.5 h-2.5" />}
              {badge === "OEM Certified" ? <ShieldCheck className="w-2.5 h-2.5" /> : null}
              {badge}
            </span>
          ))}
        </div>

        <p className="text-xs mb-1" style={{ color: "var(--solana-text-muted)" }}>Spesialisasi</p>
        <p className="text-xs font-medium mb-3">{ws.specialization}</p>

        <div className="flex gap-4 text-[10px]" style={{ color: "var(--solana-text-muted)" }}>
          <span>{ws.totalServices.toLocaleString()} servis</span>
          <span>{ws.totalReviews} review</span>
        </div>
      </div>

      <Link
        href={`/dapp/book/${ws.id}`}
        className="glow-btn w-full text-xs py-2.5 text-center mt-5 block cursor-pointer"
      >
        Lihat Profil
      </Link>
    </motion.div>
  );
}
