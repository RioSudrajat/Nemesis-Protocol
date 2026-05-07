"use client";

import { useState } from "react";
import { DepinStatsBar } from "@/components/ui/DepinStatsBar";
import dynamic from "next/dynamic";
import { formatIDRXFull } from "@/lib/yield";
import { selectDepinNetworkStats, useNemesisStore } from "@/store/useNemesisStore";

const FleetMapLibreMap = dynamic(() => import("@/components/maps/FleetMapLibreMap"), { ssr: false });
import { Lock, Zap, TrendingUp } from "lucide-react";
import Image from "next/image";

const POOL_IMAGES = [
  "/ev_fleet_jakarta_1777118073477.png",
  "/ev_ridehailing_surabaya_1777118125456.png",
  "/ev_logistics_bandung_1777118107682.png",
  "/ev_fleet_tangerang_1777118150818.png",
];

function getPoolRegion(locationLabel?: string) {
  return locationLabel?.split(",")[0]?.trim() || "Jakarta";
}

function getFillPct(supplied = 0, target = 0) {
  if (target <= 0) return 0;
  return Math.min(100, (supplied / target) * 100);
}

export default function EarnPage() {
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [viewedPools, setViewedPools] = useState<string[]>([]);
  const nemesisState = useNemesisStore();
  const networkStats = selectDepinNetworkStats(nemesisState);
  const activePools = nemesisState.pools
    .filter((pool) => pool.status === "active" || pool.status === "filled")
    .map((pool, index) => ({ ...pool, image: POOL_IMAGES[index % POOL_IMAGES.length] }));
  const upcomingPools = nemesisState.pools
    .filter((pool) => pool.status === "upcoming" || pool.status === "pending_approval")
    .map((pool, index) => ({ ...pool, image: POOL_IMAGES[(index + activePools.length) % POOL_IMAGES.length] }));
  const upcomingPool = upcomingPools[0];
  const poolsForMap = nemesisState.pools.map((pool) => ({
    name: pool.name || "Untitled Pool",
    id: pool.id,
    region: getPoolRegion(pool.locationLabel),
    cashYield: `${pool.cashYieldPct ?? 0}%`,
    units: pool.unitCount ?? 0,
    status: pool.status === "active" || pool.status === "filled" ? "Active" : "Upcoming",
  }));

  const handlePoolDetails = (id: string) => {
    if (!viewedPools.includes(id)) {
      setViewedPools([...viewedPools, id]);
    }
  };
  return (
    <div className="text-zinc-900 pb-8 w-full max-w-7xl mx-auto px-4 md:px-0">
      <DepinStatsBar />
      
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 py-8">
          <div className="flex-1 w-full flex justify-center">
            {/* Map Container replacing Globe */}
            <div className="w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden border border-zinc-100 shadow-sm relative z-0">
              <FleetMapLibreMap pools={poolsForMap} />
            </div>
          </div>
          
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 leading-tight mb-4">
                Earn points from verified<br />EV infrastructure activity
              </h1>
              <p className="text-zinc-500 text-lg">
                Participate in campaigns tied to route logs, operator onboarding, and verified mobility credit pool activity.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-bold text-zinc-900 text-xl">{formatIDRXFull(networkStats.tokenizedValue)}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Tokenized Value</p>
              </div>
              <div>
                <p className="font-bold text-zinc-900 text-xl">20-45%</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Cash Yield Layer</p>
              </div>
              <div>
                <p className="font-bold text-zinc-900 text-xl">{formatIDRXFull(networkStats.totalSupplied)}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Total Supplied</p>
              </div>
              <div>
                <p className="font-bold text-zinc-900 text-xl">{networkStats.totalPools}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Total Pools</p>
              </div>
            </div>
            
            <div className="pt-4">
              <p className="font-bold text-zinc-900 text-lg">Season 1</p>
              <p className="text-sm text-zinc-500 font-medium">10 Million Nemesis Points</p>
            </div>
          </div>
        </div>

        {/* Upcoming Section */}
        {upcomingPool && (
        <div>
          <h2 className="text-xl font-bold text-zinc-900 mb-6">Upcoming</h2>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-100 flex flex-col md:flex-row relative">
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-zinc-900 flex items-center gap-2 z-10">
              <Lock size={14} className="text-zinc-500" /> Coming Soon
            </div>
            {/* Image Placeholder */}
            <div className="w-full md:w-[40%] h-48 md:h-auto relative overflow-hidden bg-zinc-100">
              <Image 
                src={upcomingPool.image} 
                alt="Upcoming Fleet" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            
            {/* Content */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                    <div className="flex gap-0.5">
                      <div className="w-1.5 h-3 bg-teal-400 rounded-full" />
                      <div className="w-1.5 h-5 bg-teal-600 rounded-full" />
                      <div className="w-1.5 h-4 bg-teal-300 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">{upcomingPool.name}</h3>
                    <p className="text-sm text-zinc-500">{upcomingPool.unitCount} EV Units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-zinc-900">{upcomingPool.cashYieldPct}% cash yield</p>
                  <p className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded mt-1 inline-flex items-center gap-1">
                    <Zap size={12} /> Nemesis Points Eligible
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-xs text-zinc-500 font-medium mb-1">Total Supplied</p>
                <p className="text-2xl font-bold text-zinc-900">{formatIDRXFull(upcomingPool.totalSupplied)}</p>
              </div>
              
              <div className="mb-6">
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden mb-2">
                  <div 
                    className="h-full bg-teal-600" 
                    style={{ width: `${getFillPct(upcomingPool.totalSupplied, upcomingPool.targetSupply)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-medium text-zinc-500">
                  <span>{getFillPct(upcomingPool.totalSupplied, upcomingPool.targetSupply).toFixed(0)}% filled</span>
                  <span>Target {formatIDRXFull(upcomingPool.targetSupply ?? 0)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setWaitlistJoined(!waitlistJoined)}
                className={`w-full py-3.5 rounded-xl transition-colors font-bold text-sm shadow-sm mb-6 ${waitlistJoined ? 'bg-zinc-100 text-teal-600 hover:bg-zinc-200' : 'bg-teal-500 hover:bg-teal-400 text-white'}`}
              >
                {waitlistJoined ? 'Joined Waitlist' : 'Waitlist'}
              </button>
              
              <div className="flex gap-2">
                {(upcomingPool.tags ?? []).map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-md bg-zinc-100 text-zinc-600 text-xs font-semibold">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Fast Charging Stations (Active Pools) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                EV Asset Pools
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100 flex items-center gap-1">
                  <TrendingUp size={12} /> Credit Pools
                </span>
              </h2>
              <p className="text-sm text-zinc-500 mt-1">Cash yield and principal recovery from verified productive EV infrastructure assets.</p>
            </div>
            <button className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              Cash Yield
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activePools.map((pool, idx) => (
              <div key={pool.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-100 flex flex-col">
                <div className="h-40 relative overflow-hidden bg-zinc-100">
                  <Image 
                    src={pool.image} 
                    alt={pool.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                        {idx === 2 ? (
                          <div className="w-4 h-4 bg-teal-500 rounded-sm" />
                        ) : (
                          <div className="flex gap-0.5">
                            <div className="w-1 h-2 bg-teal-400 rounded-full" />
                            <div className="w-1 h-4 bg-green-400 rounded-full" />
                            <div className="w-1 h-3 bg-teal-200 rounded-full" />
                          </div>
                        )}
                      </div>
                      <div>
                    <h3 className="font-bold text-zinc-900 text-sm">{pool.name}</h3>
                        <p className="text-xs text-zinc-500">{pool.unitCount} EV Units</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-sm">{pool.cashYieldPct}% cash yield</p>
                      <p className="text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded mt-1 inline-flex items-center gap-1">
                        <Zap size={10} /> Points Eligible
                      </p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-xs text-zinc-500 font-medium mb-1">Total Supplied</p>
                    <p className="text-xl font-bold text-zinc-900">{formatIDRXFull(pool.totalSupplied)}</p>
                  </div>
                  <div className="mb-6 mt-auto">
                    <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden mb-2">
                      <div 
                        className="h-full bg-teal-600" 
                        style={{ width: `${getFillPct(pool.totalSupplied, pool.targetSupply)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-medium text-zinc-500">
                      <span>{getFillPct(pool.totalSupplied, pool.targetSupply).toFixed(0)}% filled</span>
                      <span>Target {formatIDRXFull(pool.targetSupply ?? 0)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handlePoolDetails(pool.id)}
                    className={`w-full py-3 rounded-xl transition-colors font-bold text-sm shadow-sm mb-4 ${viewedPools.includes(pool.id) ? 'bg-zinc-100 text-teal-600' : 'bg-teal-500 hover:bg-teal-400 text-white'}`}
                  >
                    {viewedPools.includes(pool.id) ? 'Viewing Details...' : 'Pool Details'}
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {(pool.tags ?? []).map(tag => (
                      <span key={tag} className="px-2 py-1 rounded bg-zinc-100 text-zinc-600 text-[10px] font-semibold uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Income Pools */}
        <div className="pb-16">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Fixed Income Pools</h2>
          <p className="text-sm text-zinc-500 mb-6">Future fixed remittance products for partner operated EV pools.</p>
          
          <div className="bg-zinc-50/50 rounded-3xl border border-zinc-100 p-16 flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-bold text-zinc-900 mb-3">Coming Soon</h3>
            <p className="text-lg text-teal-600 font-semibold mb-2">Fixed Income Pool Investment Opportunities</p>
            <p className="text-sm text-zinc-500">Stay tuned for remittance-based infrastructure financing pools</p>
          </div>
        </div>

      </div>
    </div>
  );
}
