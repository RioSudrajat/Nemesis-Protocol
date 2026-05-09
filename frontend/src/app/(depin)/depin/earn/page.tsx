"use client";

import { useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { Mail, TrendingUp, X } from "lucide-react";
import { DepinStatsBar } from "@/components/ui/DepinStatsBar";
import { PoolCampaignCard } from "@/components/pools/PoolCampaignCard";
import { formatIDRXFull } from "@/lib/yield";
import { getPublicPools, getPoolRegion } from "@/lib/poolCampaignViewModel";
import { selectAssetsByPool, selectDepinNetworkStats, useNemesisStore } from "@/store/useNemesisStore";
import type { StakingPool } from "@/types/fi";

const FleetMapLibreMap = dynamic(() => import("@/components/maps/FleetMapLibreMap"), { ssr: false });

export default function EarnPage() {
  const [waitlistPool, setWaitlistPool] = useState<StakingPool | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const nemesisState = useNemesisStore();
  const networkStats = selectDepinNetworkStats(nemesisState);
  const publicPools = getPublicPools(nemesisState.pools);
  const activePools = publicPools.filter((pool) => pool.status === "active" || pool.status === "filled");
  const upcomingPools = publicPools.filter((pool) => pool.status === "upcoming");
  const poolsForMap = publicPools.map((pool) => ({
    name: pool.name || "Untitled Pool",
    id: pool.id,
    region: getPoolRegion(pool.locationLabel),
    cashYield: `${pool.cashYieldPct ?? 0}%`,
    units: pool.unitCount ?? 0,
    status: pool.status === "active" || pool.status === "filled" ? "Active" : "Upcoming",
  }));

  const handleWaitlistSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistSubmitted(true);
  };

  const openWaitlist = (pool: StakingPool) => {
    setWaitlistPool(pool);
    setWaitlistSubmitted(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-8 text-zinc-900 md:px-0">
      <DepinStatsBar />

      <div className="space-y-12">
        <div className="flex flex-col items-center gap-8 py-8 md:flex-row md:gap-16">
          <div className="flex w-full flex-1 justify-center">
            <div className="relative z-0 h-[300px] w-full overflow-hidden rounded-3xl border border-zinc-100 shadow-sm md:h-[400px]">
              <FleetMapLibreMap pools={poolsForMap} />
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div>
              <h1 className="mb-4 text-3xl font-bold leading-tight text-zinc-900 md:text-5xl">
                Earn points from verified<br />EV infrastructure activity
              </h1>
              <p className="text-lg text-zinc-500">
                Participate in campaigns tied to fleet telemetry, charging sessions, depot energy proofs, operator onboarding, and verified infrastructure financing activity.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <Stat label="Tokenized Value" value={formatIDRXFull(networkStats.tokenizedValue)} />
              <Stat label="Infrastructure Return Layer" value="20-45%" />
              <Stat label="Total Supplied" value={formatIDRXFull(networkStats.totalSupplied)} />
              <Stat label="Total Pools" value={`${publicPools.length}`} />
            </div>

            <div className="pt-4">
              <p className="text-lg font-bold text-zinc-900">Season 1</p>
              <p className="text-sm font-medium text-zinc-500">10 Million Nemesis Points</p>
            </div>
          </div>
        </div>

        {upcomingPools.length > 0 && (
          <section>
            <h2 className="mb-6 text-xl font-bold text-zinc-900">Upcoming</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {upcomingPools.map((pool, index) => (
                <PoolCampaignCard
                  key={pool.id}
                  pool={pool}
                  mode="earn"
                  index={index}
                  linkedAssets={selectAssetsByPool(nemesisState, pool.id)}
                  onWaitlist={openWaitlist}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-zinc-900">
                Productive EV Infrastructure
                <span className="flex items-center gap-1 rounded border border-green-100 bg-green-50 px-2 py-1 text-xs font-bold text-green-600">
                  <TrendingUp size={12} /> Verified Pools
                </span>
              </h2>
              <p className="mt-1 text-sm text-zinc-500">Points are tied to verified utilization across financed fleets, charging assets, energy depots, and operator remittance pools.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {activePools.map((pool, index) => (
              <PoolCampaignCard
                key={pool.id}
                pool={pool}
                mode="earn"
                index={index}
                linkedAssets={selectAssetsByPool(nemesisState, pool.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {waitlistPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Pool waitlist</p>
                <h3 className="mt-2 text-2xl font-bold text-zinc-950">{waitlistPool.name}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">Drop your email and we will notify you when this FI campaign opens.</p>
              </div>
              <button onClick={() => setWaitlistPool(null)} className="rounded-full border border-zinc-950/10 p-2 text-zinc-500 hover:text-zinc-950" aria-label="Close waitlist">
                <X className="h-4 w-4" />
              </button>
            </div>
            {waitlistSubmitted ? (
              <div className="rounded-2xl bg-teal-50 p-5 text-sm font-semibold text-teal-800">
                You are on the waitlist. We will send updates to {waitlistEmail}.
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Email</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-zinc-950/10 bg-zinc-50 px-4 py-3">
                    <Mail className="h-4 w-4 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={waitlistEmail}
                      onChange={(event) => setWaitlistEmail(event.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </label>
                <button className="w-full rounded-2xl bg-teal-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-400">
                  Join waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xl font-bold text-zinc-900">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
    </div>
  );
}
