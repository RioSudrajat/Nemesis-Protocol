"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Banknote, Bike, CheckCircle2, Clock, Layers3, Shield, Users } from "lucide-react";
import { MOCK_POOLS } from "@/data/pools";
import { formatIDRXFull, formatNumber } from "@/lib/yield";

type FilterKey = "all" | "mobility_credit" | "fleet_remittance" | "future" | "native";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All products" },
  { key: "mobility_credit", label: "Mobility Credit" },
  { key: "fleet_remittance", label: "Fleet Remittance" },
  { key: "future", label: "Charging / Energy" },
  { key: "native", label: "Nemesis Native" },
];

const HEADER_STATS = [
  { label: "Total Capital Deployed", value: formatIDRXFull(5_875_000_000), Icon: Banknote },
  { label: "Avg Cash Yield", value: "14.4%", Icon: CheckCircle2 },
  { label: "Principal Recovered", value: formatIDRXFull(243_000_000), Icon: Shield },
  { label: "Verified Investors", value: formatNumber(342), Icon: Users },
];

const UPCOMING_PRODUCTS = [
  {
    title: "Charging Yield Pools",
    copy: "Metered charger sessions, uptime, and kWh delivery for future infrastructure yield pools.",
  },
  {
    title: "Energy Yield Pools",
    copy: "Solar, storage, and exportable depot energy assets after phase-1 mobility underwriting is proven.",
  },
];

export default function FiPoolsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const visiblePools = useMemo(() => {
    if (activeFilter === "native") return MOCK_POOLS.filter((p) => p.operatorType === "nemesis_native");
    if (activeFilter === "future") return [];
    if (activeFilter === "all") return MOCK_POOLS;
    return MOCK_POOLS.filter((p) => p.productType === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 text-zinc-950 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Nemesis FI</p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-950 md:text-6xl">
              Financing products for productive EV infrastructure.
            </h1>
          </div>
          <p className="text-base leading-7 text-zinc-600 md:text-lg">
            Phase 1 focuses on 36-month mobility credit pools: investors fund productive EV assets and receive cash yield plus principal recovery from verified collections.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {HEADER_STATS.map(({ label, value, Icon }) => (
            <div key={label} className="rounded-2xl border border-zinc-950/10 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{label}</p>
                <Icon className="h-4 w-4 text-teal-700" />
              </div>
              <p className="text-2xl font-bold text-zinc-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
                style={{
                  background: active ? "#14B8A6" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#52525B",
                  border: active ? "1px solid #14B8A6" : "1px solid rgba(15,23,42,0.08)",
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <section className="mb-12">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-bold text-zinc-950">Active financing pools</h2>
              <p className="mt-1 text-sm text-zinc-500">Cash yield and principal recovery are shown separately.</p>
            </div>
            <p className="rounded-full bg-teal-50 px-4 py-2 text-xs font-bold text-teal-800">
              14.4% cash yield + 32.4% principal recovery/year
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visiblePools.map((pool) => {
              const pct = Math.min(100, Math.round((pool.totalSupplied / pool.targetSupply) * 100));
              return (
                <Link
                  key={pool.id}
                  href={`/fi/pools/${pool.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-zinc-950/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50">
                        <Bike className="h-5 w-5 text-teal-700" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">{pool.productLabel}</p>
                        <h3 className="mt-1 text-lg font-bold leading-tight text-zinc-950">{pool.name}</h3>
                      </div>
                    </div>
                  </div>

                  <p className="mb-5 min-h-[4.5rem] text-sm leading-6 text-zinc-600">{pool.description}</p>

                  <div className="mb-5 grid grid-cols-3 gap-2">
                    <Metric label="Cash yield" value={`${pool.cashYieldPct}%`} />
                    <Metric label="Principal" value={`${pool.principalRecoveryPct}%`} />
                    <Metric label="Tenor" value={`${pool.tenorMonths} mo`} />
                  </div>

                  <div className="mb-5 rounded-2xl bg-zinc-950/[0.04] p-4">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-500">Capital supplied</span>
                      <span className="font-bold text-zinc-950">{pct}%</span>
                    </div>
                    <div className="mb-2 h-2 overflow-hidden rounded-full bg-white">
                      <div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-zinc-500">
                      {formatIDRXFull(pool.totalSupplied)} of {formatIDRXFull(pool.targetSupply)}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2">
                    <Badge>{pool.managedBy}</Badge>
                    <Badge>{pool.proofStatus === "verified" ? "Proof verified" : "Proof review"}</Badge>
                    <Badge>{pool.reserveHealth}</Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          {UPCOMING_PRODUCTS.map((product) => (
            <article key={product.title} className="rounded-[1.75rem] border border-dashed border-zinc-950/15 bg-white p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                <Layers3 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-zinc-950">{product.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{product.copy}</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
                <Clock className="h-3.5 w-3.5" />
                Future asset class
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-zinc-950/[0.04] p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-zinc-950">{value}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">{children}</span>;
}
