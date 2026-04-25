"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import { WorkshopRevenueChart } from "@/components/ui/WorkshopRevenueChart";
import {
  ExternalLink,
  FileText,
  Leaf,
  MapPin,
  ArrowRight,
  Download,
  Bike,
  Package,
  Truck,
  Shield,
  Star,
  Zap,
  Car,
  Users,
  DollarSign,
} from "lucide-react";
import { formatNumber, formatIDRXFull, formatRupiah } from "@/lib/yield";

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

type TabKey = "overview" | "report" | "impact" | "calculator";

const DISTRIBUTIONS = [
  { date: "28 Apr 2026", total: 192000, per: 1920, hash: "4xK9...mR2p" },
  { date: "21 Apr 2026", total: 184000, per: 1840, hash: "7yL3...nS4q" },
  { date: "14 Apr 2026", total: 197000, per: 1970, hash: "9zM5...pT6r" },
  { date: "7 Apr 2026", total: 176000, per: 1760, hash: "2wN7...qU8s" },
];

const YIELD_HISTORY = [
  { name: "W1", value: 176000 },
  { name: "W2", value: 184000 },
  { name: "W3", value: 191000 },
  { name: "W4", value: 197000 },
  { name: "W5", value: 202000 },
  { name: "W6", value: 185000 },
  { name: "W7", value: 188000 },
  { name: "W8", value: 192000 },
];

const UTILIZATION = [
  { name: "Sen", value: 73 },
  { name: "Sel", value: 71 },
  { name: "Rab", value: 78 },
  { name: "Kam", value: 75 },
  { name: "Jum", value: 82 },
  { name: "Sab", value: 68 },
  { name: "Min", value: 62 },
];

const REVENUE_LOG = [
  { week: "W1", revenue: 280_000, expenses: 104_000, net: 176_000, distributed: 176_000 },
  { week: "W2", revenue: 294_000, expenses: 110_000, net: 184_000, distributed: 184_000 },
  { week: "W3", revenue: 305_000, expenses: 114_000, net: 191_000, distributed: 191_000 },
  { week: "W4", revenue: 315_000, expenses: 118_000, net: 197_000, distributed: 197_000 },
  { week: "W5", revenue: 322_000, expenses: 120_000, net: 202_000, distributed: 202_000 },
  { week: "W6", revenue: 295_000, expenses: 110_000, net: 185_000, distributed: 185_000 },
  { week: "W7", revenue: 300_000, expenses: 112_000, net: 188_000, distributed: 188_000 },
  { week: "W8", revenue: 307_000, expenses: 115_000, net: 192_000, distributed: 192_000 },
];

const CARD_STYLE = {
  background: "#FFFFFF",
  border: "1px solid rgba(15,23,42,0.08)",
};

export default function PoolDetailPage({
  params,
}: {
  params: Promise<{ poolId: string }>;
}) {
  const { poolId } = use(params);
  const pool = POOLS.find((p) => p.id === poolId) ?? POOLS[0];
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [investAmount, setInvestAmount] = useState<number>(300_000);
  const [utilizationPct, setUtilizationPct] = useState<number>(75);
  const [lockMonths, setLockMonths] = useState<number | null>(null);

  const pctFilled = Math.round((pool.totalSupplied / pool.targetSupply) * 100);

  const calc = useMemo(() => {
    const apyBase =
      pool.apyMin + ((utilizationPct - 60) / 40) * (pool.apyMax - pool.apyMin);
    const lockBonus =
      lockMonths === 3 ? 2 : lockMonths === 6 ? 4 : lockMonths === 12 ? 6 : 0;
    const effectiveApy = apyBase + lockBonus;
    const annualYield = (investAmount * effectiveApy) / 100;
    const monthlyYield = annualYield / 12;
    const breakEvenMonths = monthlyYield > 0 ? investAmount / monthlyYield : 0;
    return { effectiveApy, annualYield, monthlyYield, breakEvenMonths };
  }, [investAmount, utilizationPct, lockMonths, pool.apyMin, pool.apyMax]);

  const sharesPreview = Math.floor(investAmount / 30_000);
  const yieldPerWeekPreview = sharesPreview * 1920;

  const TABS: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "report", label: "Report" },
    { key: "impact", label: "Dampak" },
    { key: "calculator", label: "Kalkulator" },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: "#FAFAFA", color: "#0A0A0B" }}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Link
          href="/fi"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 mb-4"
        >
          ← Kembali ke Pools
        </Link>

        {/* Pool header card */}
        <div className="rounded-xl p-6 mb-6" style={CARD_STYLE}>
          <p className="text-xs text-zinc-500 flex items-center gap-1 mb-2">
            <MapPin size={12} /> {pool.city}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">{pool.name}</h1>

          <div className="flex flex-wrap gap-2 mb-5">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
              style={
                pool.status === "filled"
                  ? { background: "#F4F4F5", color: "#52525B" }
                  : { background: "rgba(20,184,166,0.10)", color: "#0F766E" }
              }
            >
              {pool.status === "filled" ? "Pool Penuh" : "Aktif"}
            </span>
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
                <Star size={11} /> Partner — {pool.managedBy}
              </span>
            )}
            {pool.energyPointsEligible && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                style={{ background: "rgba(20,184,166,0.10)", color: "#0F766E" }}
              >
                <Zap size={11} /> Energy Points Eligible
              </span>
            )}
          </div>

          <div>
            <p className="text-xs text-zinc-500 mb-1">APY Range</p>
            <p className="text-4xl md:text-5xl font-bold" style={{ color: "#0F766E" }}>
              {pool.apyMin}–{pool.apyMax}%
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Tersuplai", value: formatIDRXFull(pool.totalSupplied) },
            { label: "Target", value: formatIDRXFull(pool.targetSupply) },
            { label: "Persentase Terisi", value: `${pctFilled}%` },
            { label: "Distribusi Berikutnya", value: pool.nextDistribution },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-5" style={CARD_STYLE}>
              <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
              <p className="text-base md:text-lg font-bold text-zinc-900 break-all">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => {
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: active ? "#14B8A6" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#52525B",
                  border: active ? "1px solid #14B8A6" : "1px solid rgba(15,23,42,0.08)",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Fleet health bar */}
            <div className="rounded-xl p-6" style={CARD_STYLE}>
              <h3 className="text-base font-semibold text-zinc-900 mb-3">Kesehatan Fleet</h3>
              <div
                className="w-full h-3 rounded-full overflow-hidden flex"
                style={{ background: "#F4F4F5" }}
              >
                <div style={{ width: "71%", background: "#14B8A6" }} />
                <div style={{ width: "18%", background: "#A1A1AA" }} />
                <div style={{ width: "11%", background: "#F59E0B" }} />
              </div>
              <div className="flex gap-4 mt-3 text-sm flex-wrap">
                <span className="flex items-center gap-1.5 text-zinc-700">
                  <span className="w-2 h-2 rounded-full" style={{ background: "#14B8A6" }} />
                  Aktif 71%
                </span>
                <span className="flex items-center gap-1.5 text-zinc-700">
                  <span className="w-2 h-2 rounded-full" style={{ background: "#A1A1AA" }} />
                  Idle 18%
                </span>
                <span className="flex items-center gap-1.5 text-zinc-700">
                  <span className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
                  Servis 11%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t" style={{ borderColor: "rgba(15,23,42,0.06)" }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(20,184,166,0.10)" }}
                  >
                    <Bike size={16} style={{ color: "#0F766E" }} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Ojol</p>
                    <p className="text-sm font-semibold text-zinc-900">
                      {formatNumber(pool.unitBreakdown.ojol)} unit
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(20,184,166,0.10)" }}
                  >
                    <Package size={16} style={{ color: "#0F766E" }} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Kurir</p>
                    <p className="text-sm font-semibold text-zinc-900">
                      {formatNumber(pool.unitBreakdown.kurir)} unit
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(20,184,166,0.10)" }}
                  >
                    <Truck size={16} style={{ color: "#0F766E" }} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Logistik</p>
                    <p className="text-sm font-semibold text-zinc-900">
                      {formatNumber(pool.unitBreakdown.logistik)} unit
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent distributions */}
            <div className="rounded-xl overflow-hidden" style={CARD_STYLE}>
              <div className="p-5 pb-3">
                <h3 className="text-base font-semibold text-zinc-900">Distribusi Terbaru</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#F4F4F5", color: "#52525B" }}>
                      <th className="text-left py-3 px-4 font-medium">Tanggal</th>
                      <th className="text-right py-3 px-4 font-medium">Total</th>
                      <th className="text-right py-3 px-4 font-medium">Per Saham</th>
                      <th className="text-left py-3 px-4 font-medium">Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DISTRIBUTIONS.map((d) => (
                      <tr key={d.date} style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}>
                        <td className="py-3 px-4 text-zinc-700">{d.date}</td>
                        <td className="py-3 px-4 text-right text-zinc-900">
                          {formatIDRXFull(d.total)}
                        </td>
                        <td className="py-3 px-4 text-right text-zinc-900">
                          {formatIDRXFull(d.per)}
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href="#"
                            className="font-mono text-xs inline-flex items-center gap-1 hover:underline"
                            style={{ color: "#0F766E" }}
                          >
                            {d.hash} <ExternalLink size={12} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invest section */}
            <div
              className="rounded-xl p-6"
              style={{ background: "#FFFFFF", border: "1px solid rgba(20,184,166,0.4)" }}
            >
              <h3 className="text-base font-semibold text-zinc-900 mb-4">Invest di Pool Ini</h3>
              <div className="mb-4">
                <label className="text-xs text-zinc-500 mb-1 block">Jumlah (IDRX)</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg text-base"
                  style={{
                    background: "#FAFAFA",
                    border: "1px solid rgba(15,23,42,0.08)",
                    color: "#0A0A0B",
                  }}
                />
                <p className="text-xs text-zinc-500 mt-2">
                  {formatNumber(sharesPreview)} saham · estimasi{" "}
                  <span className="font-semibold text-zinc-900">
                    {formatIDRXFull(yieldPerWeekPreview)}
                  </span>{" "}
                  per minggu
                </p>
              </div>
              <button
                onClick={() => alert("Wallet integration coming soon")}
                className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ background: "#14B8A6" }}
              >
                Invest Sekarang
              </button>
            </div>

            <Link
              href={`/depin/pool/${pool.id}`}
              className="inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: "#0F766E" }}
            >
              Lihat Aktivitas Fleet <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* REPORT */}
        {activeTab === "report" && (
          <div className="space-y-6">
            <div className="rounded-xl p-5" style={CARD_STYLE}>
              <h3 className="text-base font-semibold text-zinc-900 mb-1">Yield History</h3>
              <p className="text-sm text-zinc-500 mb-2">8 minggu terakhir (IDRX)</p>
              <WorkshopRevenueChart data={YIELD_HISTORY} suffix="IDRX" />
            </div>

            <div className="rounded-xl p-5" style={CARD_STYLE}>
              <h3 className="text-base font-semibold text-zinc-900 mb-1">Utilization Rate</h3>
              <p className="text-sm text-zinc-500 mb-2">Persentase unit aktif (harian)</p>
              <WorkshopRevenueChart data={UTILIZATION} suffix="%" />
            </div>

            <div className="rounded-xl overflow-hidden" style={CARD_STYLE}>
              <div className="p-5 pb-3">
                <h3 className="text-base font-semibold text-zinc-900">Revenue Log</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#F4F4F5", color: "#52525B" }}>
                      <th className="text-left py-3 px-4 font-medium">Minggu</th>
                      <th className="text-right py-3 px-4 font-medium">Revenue</th>
                      <th className="text-right py-3 px-4 font-medium">Expenses</th>
                      <th className="text-right py-3 px-4 font-medium">Net</th>
                      <th className="text-right py-3 px-4 font-medium">Distributed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REVENUE_LOG.map((r) => (
                      <tr key={r.week} style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}>
                        <td className="py-3 px-4 text-zinc-700">{r.week}</td>
                        <td className="py-3 px-4 text-right text-zinc-900">
                          {formatIDRXFull(r.revenue)}
                        </td>
                        <td className="py-3 px-4 text-right text-zinc-700">
                          {formatIDRXFull(r.expenses)}
                        </td>
                        <td className="py-3 px-4 text-right text-zinc-900 font-semibold">
                          {formatIDRXFull(r.net)}
                        </td>
                        <td className="py-3 px-4 text-right" style={{ color: "#0F766E" }}>
                          {formatIDRXFull(r.distributed)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              className="rounded-xl p-5 flex items-center justify-between flex-wrap gap-4"
              style={CARD_STYLE}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(20,184,166,0.10)" }}
                >
                  <FileText size={18} style={{ color: "#0F766E" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Laporan Bulan Maret 2026</p>
                  <p className="text-xs text-zinc-500">PDF · 2,4 MB</p>
                </div>
              </div>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  background: "#FFFFFF",
                  color: "#0F766E",
                  border: "1px solid rgba(20,184,166,0.4)",
                }}
              >
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        )}

        {/* IMPACT */}
        {activeTab === "impact" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  Icon: Leaf,
                  value: `${formatNumber(47200)} kg`,
                  label: "CO2 Dikurangi",
                  sub: `Setara dengan ${formatNumber(3200)} pohon dewasa`,
                },
                {
                  Icon: Car,
                  value: `${formatNumber(1247832)} km`,
                  label: "Total Km EV",
                  sub: "Dalam pool ini",
                },
                {
                  Icon: Users,
                  value: `${formatNumber(94)} pengemudi`,
                  label: "Driver Didukung",
                  sub: "Pendapatan harian aktif",
                },
                {
                  Icon: DollarSign,
                  value: formatRupiah(892_000_000),
                  label: "Nilai Ekonomi",
                  sub: "Total economic value generated",
                },
              ].map((c) => (
                <div key={c.label} className="rounded-xl p-6" style={CARD_STYLE}>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: "rgba(20,184,166,0.10)" }}
                  >
                    <c.Icon size={18} style={{ color: "#0F766E" }} />
                  </div>
                  <p className="text-xs text-zinc-500 mb-1">{c.label}</p>
                  <p className="text-2xl font-bold text-zinc-900 mb-1 break-all">{c.value}</p>
                  <p className="text-xs text-zinc-500">{c.sub}</p>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl p-5 flex items-start gap-3"
              style={{ background: "#FFFFFF", border: "1px solid rgba(20,184,166,0.25)" }}
            >
              <Leaf size={20} style={{ color: "#0F766E" }} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-zinc-700">
                Setiap 1 km EV setara dengan {formatNumber(87)} gram CO2 yang dihindari vs motor BBM
                equivalent. Pool ini berkontribusi pada target Net Zero Indonesia 2060.
              </p>
            </div>
          </div>
        )}

        {/* CALCULATOR */}
        {activeTab === "calculator" && (
          <div className="space-y-6">
            <div className="rounded-xl p-6" style={CARD_STYLE}>
              <h3 className="text-base font-semibold text-zinc-900 mb-5">Parameter Investasi</h3>

              <div className="mb-5">
                <label className="text-xs text-zinc-500 mb-1 block">
                  Jumlah Investasi (IDRX)
                </label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg text-base font-semibold"
                  style={{
                    background: "#FAFAFA",
                    border: "1px solid rgba(15,23,42,0.08)",
                    color: "#0A0A0B",
                  }}
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Harga 1 saham = {formatIDRXFull(30000)} · kamu akan mendapat{" "}
                  <span className="font-semibold text-zinc-900">
                    {formatNumber(Math.floor(investAmount / 30_000))}
                  </span>{" "}
                  saham
                </p>
              </div>

              <div className="mb-5">
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-zinc-500">Utilisasi Fleet</label>
                  <span className="text-sm font-semibold" style={{ color: "#0F766E" }}>
                    {utilizationPct}%
                  </span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={100}
                  value={utilizationPct}
                  onChange={(e) => setUtilizationPct(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 mb-2 block">Periode Lock</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Fleksibel", val: null },
                    { label: "3 Bulan", val: 3 },
                    { label: "6 Bulan", val: 6 },
                    { label: "12 Bulan", val: 12 },
                  ].map((opt) => {
                    const active = lockMonths === opt.val;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => setLockMonths(opt.val)}
                        className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                        style={{
                          background: active ? "#14B8A6" : "#FFFFFF",
                          color: active ? "#FFFFFF" : "#52525B",
                          border: active ? "1px solid #14B8A6" : "1px solid rgba(15,23,42,0.08)",
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-zinc-500 mt-2">Lock lebih lama → APY lebih tinggi</p>
              </div>
            </div>

            {/* Output cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Estimasi Yield Bulanan",
                  value: formatIDRXFull(Math.round(calc.monthlyYield)),
                },
                {
                  label: "Estimasi Yield Tahunan",
                  value: formatIDRXFull(Math.round(calc.annualYield)),
                },
                {
                  label: "APY Efektif",
                  value: `${calc.effectiveApy.toFixed(1)}%`,
                },
                {
                  label: "Break-even",
                  value: `${calc.breakEvenMonths.toFixed(1)} bulan`,
                },
              ].map((c) => (
                <div key={c.label} className="rounded-xl p-5" style={CARD_STYLE}>
                  <p className="text-xs text-zinc-500 mb-1">{c.label}</p>
                  <p className="text-2xl font-bold break-all" style={{ color: "#0F766E" }}>
                    {c.value}
                  </p>
                </div>
              ))}
            </div>

            {/* 5-Year Projection */}
            <div className="rounded-xl overflow-hidden" style={CARD_STYLE}>
              <div className="p-5 pb-3">
                <h3 className="text-base font-semibold text-zinc-900">Proyeksi 5 Tahun</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#F4F4F5", color: "#52525B" }}>
                      <th className="text-left py-3 px-4 font-medium">Tahun</th>
                      <th className="text-right py-3 px-4 font-medium">Yield Tahunan</th>
                      <th className="text-right py-3 px-4 font-medium">Kumulatif</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((yr) => (
                      <tr key={yr} style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}>
                        <td className="py-3 px-4 text-zinc-700">Tahun {yr}</td>
                        <td className="py-3 px-4 text-right text-zinc-900">
                          {formatIDRXFull(Math.round(calc.annualYield))}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold" style={{ color: "#0F766E" }}>
                          {formatIDRXFull(Math.round(calc.annualYield * yr))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-zinc-500 p-5 pt-3">
                * Asumsi APY konstan. Kondisi pasar dapat mempengaruhi hasil aktual.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
