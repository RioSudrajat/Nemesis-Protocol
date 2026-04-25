"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Lock,
  Bike,
  Zap,
  Star,
  Shield,
} from "lucide-react";
import { formatNumber, formatIDRXFull } from "@/lib/yield";

const POOLS = [
  {
    id: "pool-batch-1",
    name: "Fleet Pool Batch #1 — Jakarta",
    operatorType: "nemesis_native",
    apyMin: 35,
    apyMax: 41,
    totalSupplied: 2_400_000_000,
    targetSupply: 3_000_000_000,
    unitCount: 100,
    lockPeriodMonths: null as number | null,
    status: "active",
    energyPointsEligible: true,
    unitBreakdown: { ojol: 60, kurir: 30, logistik: 10 },
    nextDistribution: "28 Apr 2026",
    managedBy: "Nemesis Protocol",
    city: "Jakarta",
  },
  {
    id: "pool-batch-2",
    name: "Fleet Pool Batch #2 — Surabaya",
    operatorType: "verified_partner",
    apyMin: 30,
    apyMax: 36,
    totalSupplied: 3_000_000_000,
    targetSupply: 3_000_000_000,
    unitCount: 100,
    lockPeriodMonths: 36 as number | null,
    status: "filled",
    energyPointsEligible: true,
    unitBreakdown: { ojol: 50, kurir: 35, logistik: 15 },
    nextDistribution: "28 Apr 2026",
    managedBy: "PT SurabayaExpress Logistics",
    city: "Surabaya",
  },
  {
    id: "pool-bandung",
    name: "Bandung Kurir Network",
    operatorType: "verified_partner",
    apyMin: 28,
    apyMax: 33,
    totalSupplied: 1_800_000_000,
    targetSupply: 1_800_000_000,
    unitCount: 60,
    lockPeriodMonths: 12 as number | null,
    status: "filled",
    energyPointsEligible: false,
    unitBreakdown: { ojol: 10, kurir: 45, logistik: 5 },
    nextDistribution: "28 Apr 2026",
    managedBy: "PT Bandung Kurir Utama",
    city: "Bandung",
  },
  {
    id: "pool-medan",
    name: "Medan Expansion Pool",
    operatorType: "nemesis_native",
    apyMin: 32,
    apyMax: 38,
    totalSupplied: 0,
    targetSupply: 2_000_000_000,
    unitCount: 80,
    lockPeriodMonths: 6 as number | null,
    status: "upcoming",
    energyPointsEligible: true,
    unitBreakdown: { ojol: 40, kurir: 30, logistik: 10 },
    nextDistribution: "TBA",
    managedBy: "Nemesis Protocol",
    city: "Medan",
  },
];

type FilterKey = "all" | "highest" | "flex" | "locked" | "native";

const HEADER_STATS: { label: string; value: string; Icon: typeof DollarSign }[] = [
  { label: "Total Value Locked", value: `${formatIDRXFull(8_700_000_000)}`, Icon: DollarSign },
  { label: "Avg APY", value: "35,2%", Icon: TrendingUp },
  { label: "Total Investor", value: formatNumber(342), Icon: Users },
  { label: "Total Yield Terdistribusi", value: formatIDRXFull(124_000_000), Icon: CheckCircle2 },
];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "highest", label: "APY Tertinggi" },
  { key: "flex", label: "Fleksibel" },
  { key: "locked", label: "Terkunci" },
  { key: "native", label: "Nemesis Native" },
];

export default function FiPoolsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const activePools = useMemo(() => {
    let pools = POOLS.filter((p) => p.status === "active" || p.status === "filled");
    if (activeFilter === "native") pools = pools.filter((p) => p.operatorType === "nemesis_native");
    else if (activeFilter === "flex") pools = pools.filter((p) => p.lockPeriodMonths === null);
    else if (activeFilter === "locked") pools = pools.filter((p) => p.lockPeriodMonths !== null);
    else if (activeFilter === "highest") pools = [...pools].sort((a, b) => b.apyMax - a.apyMax);
    return pools;
  }, [activeFilter]);

  const upcomingPools = POOLS.filter((p) => p.status === "upcoming");

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: "#FAFAFA", color: "#0A0A0B" }}>
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-1">
            Nemesis FI — Investment Pools
          </h1>
          <p className="text-sm text-zinc-500">
            Invest di infrastruktur EV produktif Indonesia. Yield otomatis terdistribusi setiap Senin.
          </p>
        </div>

        {/* Header stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {HEADER_STATS.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="rounded-xl p-5"
              style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-zinc-500">{label}</p>
                <Icon size={16} style={{ color: "#0F766E" }} />
              </div>
              <p className="text-xl md:text-2xl font-bold text-zinc-900 break-all">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => {
            const active = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: active ? "#14B8A6" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#52525B",
                  border: active ? "1px solid #14B8A6" : "1px solid rgba(15,23,42,0.08)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Pool Aktif */}
        <h2 className="text-base font-semibold text-zinc-900 mb-4">Pool Aktif</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {activePools.map((pool) => {
            const pct = (pool.totalSupplied / pool.targetSupply) * 100;
            const isFilled = pool.status === "filled";
            return (
              <Link key={pool.id} href={`/fi/pools/${pool.id}`}>
                <div
                  className="rounded-xl overflow-hidden cursor-pointer transition-colors h-full flex flex-col"
                  style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
                >
                  {/* Header */}
                  <div className="p-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(20,184,166,0.10)" }}
                      >
                        <Bike size={18} style={{ color: "#0F766E" }} />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">{pool.city}</p>
                        <h3 className="text-sm font-semibold text-zinc-900 leading-tight">
                          {pool.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="px-5 flex flex-wrap gap-1.5 mb-3">
                    {pool.operatorType === "nemesis_native" ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: "rgba(20,184,166,0.10)", color: "#0F766E" }}
                      >
                        <Shield size={11} /> Nemesis Native
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: "#F4F4F5", color: "#52525B" }}
                      >
                        <Star size={11} /> Partner
                      </span>
                    )}
                    {pool.energyPointsEligible && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: "rgba(20,184,166,0.10)", color: "#0F766E" }}
                      >
                        <Zap size={11} /> Points Eligible
                      </span>
                    )}
                  </div>

                  {/* APY */}
                  <div className="px-5 mb-4">
                    <p className="text-xs text-zinc-500 mb-1">APY</p>
                    <p className="text-2xl font-bold" style={{ color: "#0F766E" }}>
                      {pool.apyMin}–{pool.apyMax}%
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="px-5 mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-500">Tersuplai</span>
                      <span className="text-zinc-900 font-medium">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden mb-2"
                      style={{ background: "#F4F4F5" }}
                    >
                      <div
                        className="h-full"
                        style={{ width: `${pct}%`, background: "#14B8A6" }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 break-all">
                      {formatIDRXFull(pool.totalSupplied)}
                      <span className="text-zinc-400"> dari </span>
                      {formatIDRXFull(pool.targetSupply)}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="px-5 flex items-center gap-3 text-xs text-zinc-500 mb-5 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Lock size={11} />
                      {pool.lockPeriodMonths === null
                        ? "Fleksibel"
                        : `Kunci ${pool.lockPeriodMonths} bulan`}
                    </span>
                    <span>·</span>
                    <span>{formatNumber(pool.unitCount)} unit</span>
                  </div>

                  {/* CTA */}
                  <div className="px-5 pb-5 mt-auto">
                    <button
                      className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors"
                      style={
                        isFilled
                          ? {
                              background: "#F4F4F5",
                              color: "#A1A1AA",
                              cursor: "not-allowed",
                            }
                          : {
                              background: "#14B8A6",
                              color: "#FFFFFF",
                            }
                      }
                    >
                      {isFilled ? "Pool Penuh" : "Lihat Detail"}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pool Segera Hadir */}
        <h2 className="text-base font-semibold text-zinc-900 mb-4">Pool Segera Hadir</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {upcomingPools.map((pool) => (
            <div
              key={pool.id}
              className="rounded-xl overflow-hidden h-full flex flex-col"
              style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
            >
              <div className="p-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(20,184,166,0.10)" }}
                  >
                    <Bike size={18} style={{ color: "#0F766E" }} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">{pool.city}</p>
                    <h3 className="text-sm font-semibold text-zinc-900 leading-tight">
                      {pool.name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="px-5 flex flex-wrap gap-1.5 mb-3">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                  style={{ background: "#FEF3C7", color: "#B45309" }}
                >
                  <Clock size={11} /> Segera
                </span>
                {pool.operatorType === "nemesis_native" && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                    style={{ background: "rgba(20,184,166,0.10)", color: "#0F766E" }}
                  >
                    <Shield size={11} /> Nemesis Native
                  </span>
                )}
              </div>

              <div className="px-5 mb-4">
                <p className="text-xs text-zinc-500 mb-1">Target APY</p>
                <p className="text-2xl font-bold" style={{ color: "#0F766E" }}>
                  {pool.apyMin}–{pool.apyMax}%
                </p>
              </div>

              <div className="px-5 flex items-center gap-3 text-xs text-zinc-500 mb-5 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Lock size={11} />
                  {pool.lockPeriodMonths === null
                    ? "Fleksibel"
                    : `Kunci ${pool.lockPeriodMonths} bulan`}
                </span>
                <span>·</span>
                <span>{formatNumber(pool.unitCount)} unit</span>
                <span>·</span>
                <span>Target {formatIDRXFull(pool.targetSupply)}</span>
              </div>

              <div className="px-5 pb-5 mt-auto">
                <button
                  className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    background: "#FFFFFF",
                    color: "#0F766E",
                    border: "1px solid rgba(20,184,166,0.4)",
                  }}
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Income — Coming Soon */}
        <h2 className="text-base font-semibold text-zinc-900 mb-4">Fixed Income</h2>
        <div
          className="rounded-xl p-10 text-center"
          style={{ background: "#FFFFFF", border: "1px dashed rgba(20,184,166,0.4)" }}
        >
          <Clock size={40} style={{ color: "#14B8A6" }} className="mx-auto mb-3" />
          <h3 className="text-base font-semibold text-zinc-900 mb-2">Segera Hadir</h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Pool dengan return tetap untuk investor konservatif yang ingin exposure ke EV fleet
            tanpa volatilitas utilisasi.
          </p>
        </div>
      </div>
    </div>
  );
}
