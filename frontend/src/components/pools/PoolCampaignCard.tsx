"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Trash2, Zap } from "lucide-react";
import type { PoolStatus, StakingPool } from "@/types/fi";
import type { RegisteredVehicle } from "@/types/rwa";
import { buildPoolCampaignViewModel, type PoolCampaignMode } from "@/lib/poolCampaignViewModel";
import { PoolProgressBar } from "./PoolProgressBar";
import { PoolStatusBadge } from "./PoolStatusBadge";

type AdminActions = {
  onView?: (pool: StakingPool) => void;
  onApprove?: (poolId: string) => void;
  onReject?: (poolId: string) => void;
  onDelete?: (poolId: string) => void;
  onStatusChange?: (poolId: string, status: PoolStatus) => void;
};

const STATUS_OPTIONS: PoolStatus[] = ["pending_approval", "upcoming", "active", "filled", "closed"];

export function PoolCampaignCard({
  pool,
  mode = "fi",
  index = 0,
  linkedAssets = [],
  onWaitlist,
  adminActions,
}: {
  pool: StakingPool;
  mode?: PoolCampaignMode;
  index?: number;
  linkedAssets?: RegisteredVehicle[];
  onWaitlist?: (pool: StakingPool) => void;
  adminActions?: AdminActions;
}) {
  const vm = buildPoolCampaignViewModel(pool, { index, linkedAssets });
  const isAdmin = mode === "admin";
  const isEarn = mode === "earn";
  const primaryLabel = pool.status === "upcoming" && !isAdmin ? "Join waitlist" : isEarn ? "View FI campaign" : "View campaign";
  const primaryHref = vm.href;

  const handlePrimary = () => {
    if (pool.status === "upcoming" && onWaitlist) onWaitlist(pool);
  };

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-[1.5rem] border shadow-sm transition ${isAdmin ? "border-white/10 bg-white/[0.03]" : "border-zinc-950/10 bg-white hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]"}`}>
      <div className="relative h-44 overflow-hidden bg-zinc-100">
        <Image src={vm.image} alt={vm.name} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4">
          <PoolStatusBadge status={pool.status} label={vm.statusLabel} />
        </div>
        {vm.energyPointsEligible && (
          <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-teal-700 backdrop-blur">
            <Zap className="h-3 w-3" /> Points
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">{vm.productLabel}</p>
          <h3 className="mt-1 text-xl font-bold leading-tight">{vm.name}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className={`text-sm font-semibold ${isAdmin ? "text-white/72" : "text-zinc-600"}`}>{vm.operator}</p>
            <p className={`mt-1 text-xs ${isAdmin ? "text-white/42" : "text-zinc-500"}`}>{vm.region} · {vm.unitCount} units</p>
          </div>
          <p className={`text-right text-sm font-bold ${isAdmin ? "text-teal-200" : "text-teal-700"}`}>{vm.cashYield} cash yield</p>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          <Metric label="Cash" value={vm.cashYield} dark={isAdmin} />
          <Metric label="Principal" value={vm.principalRecovery} dark={isAdmin} />
          <Metric label="Tenor" value={vm.tenor} dark={isAdmin} />
        </div>

        <div className={`mb-5 rounded-2xl p-4 ${isAdmin ? "bg-black/20" : "bg-zinc-50"}`}>
          <PoolProgressBar supplied={vm.supplied} target={vm.target} fillPct={vm.fillPct} />
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {[vm.proofLabel, ...vm.tags].slice(0, 3).map((tag) => (
            <span key={tag} className={`rounded-full px-3 py-1 text-[11px] font-bold ${isAdmin ? "bg-white/8 text-white/58" : "bg-teal-50 text-teal-800"}`}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-3">
          {isAdmin && (
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">Status</span>
              <select
                value={pool.status}
                onChange={(event) => adminActions?.onStatusChange?.(pool.id, event.target.value as PoolStatus)}
                className="w-full rounded-xl border border-white/10 bg-[#050606] px-3 py-2 text-xs font-semibold text-white outline-none"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                ))}
              </select>
            </label>
          )}

          <div className="flex flex-wrap gap-2">
            {pool.status === "upcoming" && onWaitlist && !isAdmin ? (
              <button onClick={handlePrimary} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-400">
                {primaryLabel} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Link href={primaryHref} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${isAdmin ? "bg-teal-400/12 text-teal-100 hover:bg-teal-400/18" : "bg-teal-500 text-white hover:bg-teal-400"}`}>
                {primaryLabel} <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            {isAdmin && (
              <>
                <button onClick={() => adminActions?.onView?.(pool)} className="rounded-xl bg-blue-400/10 px-3 text-blue-200 hover:bg-blue-400/20" title="View details">
                  <Eye className="h-4 w-4" />
                </button>
                <button onClick={() => adminActions?.onDelete?.(pool.id)} className="rounded-xl bg-rose-500/12 px-3 text-rose-200 hover:bg-rose-500/20" title="Delete campaign">
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {isAdmin && pool.status === "pending_approval" && (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => adminActions?.onReject?.(pool.id)} className="rounded-xl bg-rose-500/12 px-4 py-2 text-xs font-bold text-rose-200 hover:bg-rose-500/20">
                Reject
              </button>
              <button onClick={() => adminActions?.onApprove?.(pool.id)} className="rounded-xl bg-teal-400 px-4 py-2 text-xs font-bold text-teal-950 hover:bg-teal-300">
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className={`rounded-2xl p-3 ${dark ? "bg-black/20" : "bg-zinc-50"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-[0.12em] ${dark ? "text-white/35" : "text-zinc-500"}`}>{label}</p>
      <p className={`mt-1 text-lg font-bold ${dark ? "text-white" : "text-zinc-950"}`}>{value}</p>
    </div>
  );
}
