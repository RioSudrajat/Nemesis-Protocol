"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Shield } from "lucide-react";
import type { StakingPool } from "@/types/fi";
import { getPoolFillPct, getPoolImage } from "@/lib/poolCampaignViewModel";
import { formatIDRXFull } from "@/lib/yield";
import { InvestModal } from "./InvestModal";

export function PoolDetailSummaryRail({ pool }: { pool: StakingPool }) {
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const pctFilled = getPoolFillPct(pool);

  return (
    <>
      <aside className="sticky top-28 overflow-hidden rounded-[1.5rem] border border-zinc-950/10 bg-white shadow-sm">
        <div className="relative h-56 overflow-hidden bg-zinc-900">
          <Image src={getPoolImage(pool)} alt={pool.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              {pool.status.replaceAll("_", " ")}
            </span>
            <h1 className="text-2xl font-black leading-tight">{pool.name}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white/70">
              <MapPin className="h-4 w-4" /> {pool.locationLabel}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="mb-2 flex items-end justify-between">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-zinc-400">Amount raised</span>
              <span className="text-sm font-black text-zinc-950">{formatIDRXFull(pool.totalSupplied)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full rounded-full bg-teal-500" style={{ width: `${pctFilled}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-bold">
              <span className="text-teal-700">{pctFilled}% filled</span>
              <span className="text-zinc-500">Target {formatIDRXFull(pool.targetSupply)}</span>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-2">
            <RailMetric label="Cash" value={`${pool.cashYieldPct}%`} />
            <RailMetric label="Principal" value={`${pool.principalRecoveryPct}%`} />
            <RailMetric label="Tenor" value={`${pool.tenorMonths} mo`} />
          </div>

          <div className="mb-6 rounded-2xl bg-zinc-950 p-5 text-white">
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-white/40">Next distribution</span>
              <Calendar className="h-4 w-4 text-teal-300" />
            </div>
            <p className="text-lg font-black">
              {new Date(pool.nextDistribution).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
            <button
              onClick={() => setIsInvestModalOpen(true)}
              className="mt-5 w-full rounded-2xl bg-teal-400 px-5 py-3 text-sm font-black text-teal-950 transition hover:bg-teal-300"
            >
              Connect & invest
            </button>
          </div>

          <p className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-400">
            <Shield className="h-3 w-3" /> USDC & IDRX supported
          </p>
        </div>
      </aside>

      <InvestModal pool={pool} isOpen={isInvestModalOpen} onClose={() => setIsInvestModalOpen(false)} />
    </>
  );
}

function RailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-zinc-400">{label}</p>
      <p className="mt-1 text-lg font-black text-zinc-950">{value}</p>
    </div>
  );
}
