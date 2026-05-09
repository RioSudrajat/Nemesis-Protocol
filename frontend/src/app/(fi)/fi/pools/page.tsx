"use client";

import { useMemo, useState } from "react";
import { Banknote, CheckCircle2, Layers, Users } from "lucide-react";
import { PoolCampaignCard } from "@/components/pools/PoolCampaignCard";
import { getPublicPools } from "@/lib/poolCampaignViewModel";
import { formatIDRXFull, formatNumber } from "@/lib/yield";
import { selectAssetsByPool, useNemesisStore } from "@/store/useNemesisStore";

type FilterKey = "all" | "mobility_credit" | "fleet_remittance" | "charging_yield" | "energy_yield" | "native";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All products" },
  { key: "mobility_credit", label: "Mobility" },
  { key: "fleet_remittance", label: "Remittance" },
  { key: "charging_yield", label: "Charging" },
  { key: "energy_yield", label: "Depot energy" },
  { key: "native", label: "Nemesis Native" },
];

export default function FiPoolsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const nemesisState = useNemesisStore();
  const publicPools = useMemo(() => getPublicPools(nemesisState.pools), [nemesisState.pools]);

  const stats = useMemo(() => {
    const totalSupplied = publicPools.reduce((sum, pool) => sum + pool.totalSupplied, 0);
    const totalTarget = publicPools.reduce((sum, pool) => sum + pool.targetSupply, 0);
    const avgCashYield = publicPools.length
      ? publicPools.reduce((sum, pool) => sum + pool.cashYieldPct, 0) / publicPools.length
      : 0;
    return {
      totalSupplied,
      totalTarget,
      avgCashYield,
      activeCampaigns: publicPools.length,
    };
  }, [publicPools]);

  const visiblePools = useMemo(() => {
    if (activeFilter === "native") return publicPools.filter((pool) => pool.operatorType === "nemesis_native");
    if (activeFilter === "all") return publicPools;
    return publicPools.filter((pool) => pool.productType === activeFilter);
  }, [activeFilter, publicPools]);

  const headerStats = [
    { label: "Capital deployed", value: formatIDRXFull(stats.totalSupplied), Icon: Banknote },
    { label: "Open target", value: formatIDRXFull(stats.totalTarget), Icon: Layers },
    { label: "Avg cash yield", value: `${stats.avgCashYield.toFixed(1)}%`, Icon: CheckCircle2 },
    { label: "Campaigns", value: formatNumber(stats.activeCampaigns), Icon: Users },
  ];

  return (
    <div className="min-h-screen px-4 py-8 text-zinc-950 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">Nemesis FI · Financing</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight text-zinc-950 md:text-6xl">
            Deploy into productive EV infrastructure.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-500 md:text-lg">
            Browse verified financing campaigns across mobility fleets, charging assets, depot energy, and contracted operator remittance.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {headerStats.map(({ label, value, Icon }) => (
            <div key={label} className="rounded-[1.25rem] border border-zinc-950/10 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-zinc-400">{label}</p>
                <Icon className="h-4 w-4 text-teal-700" />
              </div>
              <p className="text-2xl font-black text-zinc-950">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap gap-2 rounded-[1.25rem] border border-zinc-950/10 bg-white p-2 shadow-sm md:inline-flex">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${active ? "bg-zinc-950 text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"}`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-zinc-950">Financing campaigns</h2>
              <p className="mt-1 text-sm text-zinc-500">Only admin-published pools appear here.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visiblePools.length === 0 && (
              <div className="rounded-[1.5rem] border border-dashed border-zinc-950/15 bg-white p-8 text-sm leading-6 text-zinc-500">
                No published financing campaigns match this filter yet.
              </div>
            )}
            {visiblePools.map((pool, index) => (
              <PoolCampaignCard
                key={pool.id}
                pool={pool}
                index={index}
                linkedAssets={selectAssetsByPool(nemesisState, pool.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
