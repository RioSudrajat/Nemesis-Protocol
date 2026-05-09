"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, FileText, Trash2, X } from "lucide-react";
import { PoolCampaignCard } from "@/components/pools/PoolCampaignCard";
import { formatIDRXFull } from "@/lib/yield";
import { selectAssetsByPool, useNemesisStore } from "@/store/useNemesisStore";
import type { PoolStatus, StakingPool } from "@/types/fi";

const STATUS_OPTIONS: PoolStatus[] = ["pending_approval", "upcoming", "active", "filled", "closed"];

function formatStatus(status: PoolStatus) {
  return status.replaceAll("_", " ");
}

export default function AdminPoolsPage() {
  const nemesisState = useNemesisStore();
  const { pools, approvePool, rejectPool, updatePoolStatus, deletePool } = nemesisState;
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);

  const pendingPools = pools.filter((pool) => pool.status === "pending_approval");
  const listedPools = pools.filter((pool) => pool.status !== "pending_approval");

  const handleDelete = (poolId: string) => {
    const ok = window.confirm("Delete this campaign and release its linked assets?");
    if (!ok) return;
    deletePool(poolId);
    setSelectedPool((pool) => (pool?.id === poolId ? null : pool));
  };

  const adminActions = {
    onView: setSelectedPool,
    onApprove: approvePool,
    onReject: rejectPool,
    onDelete: handleDelete,
    onStatusChange: updatePoolStatus,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Pool Moderation</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--solana-text-muted)" }}>
          Review, publish, update status, or delete submitted Operator campaigns.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-amber-400">Needs Review ({pendingPools.length})</h2>
        {pendingPools.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-teal-400/50" />
            <p className="font-medium text-white/50">All caught up. No pools pending approval.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pendingPools.map((pool, index) => (
              <PoolCampaignCard
                key={pool.id}
                pool={pool}
                mode="admin"
                index={index}
                linkedAssets={selectAssetsByPool(nemesisState, pool.id)}
                adminActions={adminActions}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">Published & Archived Pools ({listedPools.length})</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listedPools.map((pool, index) => (
            <PoolCampaignCard
              key={pool.id}
              pool={pool}
              mode="admin"
              index={index}
              linkedAssets={selectAssetsByPool(nemesisState, pool.id)}
              adminActions={adminActions}
            />
          ))}
        </div>
      </section>

      {selectedPool && (
        <PoolDetailsModal
          pool={selectedPool}
          onClose={() => setSelectedPool(null)}
          onStatusChange={(status) => updatePoolStatus(selectedPool.id, status)}
          onDelete={() => handleDelete(selectedPool.id)}
        />
      )}
    </div>
  );
}

function PoolDetailsModal({
  pool,
  onClose,
  onStatusChange,
  onDelete,
}: {
  pool: StakingPool;
  onClose: () => void;
  onStatusChange: (status: PoolStatus) => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-md md:items-center">
      <div className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/10 bg-[#070808] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#070808]/95 p-6 backdrop-blur">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-300">Campaign Details</p>
            <h2 className="text-2xl font-bold text-white">{pool.name}</h2>
            <p className="mt-1 text-sm text-white/45">{pool.id} · {pool.managedBy}</p>
          </div>
          <button onClick={onClose} className="rounded-xl border border-white/10 p-2 text-white/60 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Metric label="Status" value={formatStatus(pool.status)} />
            <Metric label="Target" value={formatIDRXFull(pool.targetSupply)} />
            <Metric label="Supplied" value={formatIDRXFull(pool.totalSupplied)} />
            <Metric label="Units" value={`${pool.unitCount}`} />
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/40">Change campaign status</span>
              <select
                value={pool.status}
                onChange={(event) => onStatusChange(event.target.value as PoolStatus)}
                className="w-full rounded-xl border border-white/10 bg-[#050606] px-4 py-3 text-sm font-semibold text-white outline-none md:max-w-sm"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{formatStatus(status)}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-white/50">Description</h3>
            <p className="text-sm leading-7 text-white/70">{pool.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Detail label="Cash Yield" value={`${pool.cashYieldPct}%`} />
            <Detail label="Principal Recovery" value={`${pool.principalRecoveryPct}%`} />
            <Detail label="Tenor" value={`${pool.tenorMonths} months`} />
            <Detail label="Product Type" value={pool.productLabel} />
            <Detail label="Revenue Model" value={pool.revenueModel} />
            <Detail label="Location" value={pool.locationLabel} />
            <Detail label="Proof Status" value={pool.proofStatus} />
            <Detail label="Reserve Health" value={pool.reserveHealth} />
            <Detail label="Next Distribution" value={new Date(pool.nextDistribution).toLocaleDateString("id-ID")} />
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
            <Link href={`/fi/pools/${pool.id}`} className="rounded-xl bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-200 hover:bg-blue-400/20">
              Open FI Preview
            </Link>
            <button onClick={onDelete} className="inline-flex items-center gap-2 rounded-xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/25">
              <Trash2 className="h-4 w-4" /> Delete Campaign
            </button>
          </div>

          {pool.documents?.length > 0 && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">Documents</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {pool.documents.map((doc) => (
                  <a key={doc.title} href={doc.url} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 text-sm font-semibold text-blue-200 hover:bg-white/[0.05]">
                    <FileText className="h-4 w-4" /> {doc.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">{label}</p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white/75">{value}</p>
    </div>
  );
}
