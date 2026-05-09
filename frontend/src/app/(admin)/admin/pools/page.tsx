'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useNemesisStore } from '@/store/useNemesisStore'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, FileText, Leaf, DollarSign, Trash2, X } from 'lucide-react'
import type { StakingPool, PoolStatus } from '@/types/fi'

const STATUS_OPTIONS: PoolStatus[] = ['pending_approval', 'upcoming', 'active', 'filled', 'closed']

const statusTone: Record<PoolStatus, string> = {
  pending_approval: 'bg-amber-500/20 text-amber-300 border-amber-500/20',
  upcoming: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  active: 'bg-teal-500/20 text-teal-300 border-teal-500/20',
  filled: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
  closed: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
}

function formatStatus(status: PoolStatus) {
  return status.replaceAll('_', ' ')
}

export default function AdminPoolsPage() {
  const { pools, approvePool, rejectPool, updatePoolStatus, deletePool } = useNemesisStore()
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null)
  
  const pendingPools = pools.filter(p => p.status === 'pending_approval')
  const listedPools = pools.filter(p => p.status !== 'pending_approval')

  const handleApprove = (poolId: string) => {
    approvePool(poolId)
  }

  const handleReject = (poolId: string) => {
    rejectPool(poolId)
  }

  const handleDelete = (poolId: string) => {
    const ok = window.confirm('Delete this campaign and release its linked assets?')
    if (!ok) return
    deletePool(poolId)
    setSelectedPool((pool) => (pool?.id === poolId ? null : pool))
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Pool Moderation</h1>
        <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>
          Review, publish, update status, or delete submitted Operator campaigns.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-amber-400">Needs Review ({pendingPools.length})</h2>
        {pendingPools.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl">
            <CheckCircle2 className="h-12 w-12 mx-auto text-teal-400/50 mb-4" />
            <p className="text-white/50 font-medium">All caught up! No pools pending approval.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingPools.map((pool) => (
              <PendingPoolCard
                key={pool.id}
                pool={pool}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                onView={setSelectedPool}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">Published & Archived Pools ({listedPools.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listedPools.map((pool) => (
            <div key={pool.id} className="glass-card p-5 rounded-2xl border border-teal-500/20">
              <div className="flex justify-between items-start mb-4 gap-3">
                <h3 className="font-bold text-white text-lg leading-tight">{pool.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border shrink-0 ${statusTone[pool.status]}`}>
                  {formatStatus(pool.status)}
                </span>
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-xs text-white/50">Target Raise</p>
                <p className="font-mono text-sm font-semibold text-white">Rp {pool.targetSupply?.toLocaleString('id-ID') || 0}</p>
              </div>
              <label className="mb-4 block">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-white/40">Status</span>
                <select
                  value={pool.status}
                  onChange={(event) => updatePoolStatus(pool.id, event.target.value as PoolStatus)}
                  className="w-full rounded-xl border border-white/10 bg-[#050606] px-3 py-2 text-xs font-semibold text-white outline-none"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{formatStatus(status)}</option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedPool(pool)}
                  className="text-xs text-teal-200 hover:text-teal-100 flex items-center gap-1 rounded-lg bg-teal-400/10 px-3 py-2"
                >
                  View Details <ChevronRight className="h-3 w-3" />
                </button>
                <Link
                  href={`/fi/pools/${pool.id}`}
                  className="text-xs text-blue-200 hover:text-blue-100 rounded-lg bg-blue-400/10 px-3 py-2"
                >
                  FI preview
                </Link>
                <button
                  onClick={() => handleDelete(pool.id)}
                  className="text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1 rounded-lg bg-rose-400/10 px-3 py-2"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPool && (
        <PoolDetailsModal
          pool={selectedPool}
          onClose={() => setSelectedPool(null)}
          onStatusChange={(status) => updatePoolStatus(selectedPool.id, status)}
          onDelete={() => handleDelete(selectedPool.id)}
        />
      )}
    </div>
  )
}

function PendingPoolCard({
  pool,
  onApprove,
  onReject,
  onDelete,
  onView,
}: {
  pool: StakingPool
  onApprove: (poolId: string) => void
  onReject: (poolId: string) => void
  onDelete: (poolId: string) => void
  onView: (pool: StakingPool) => void
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-amber-500/20 bg-[#070808] overflow-hidden"
    >
      <div className="p-6 border-b border-white/5">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/20">
                Pending Approval
              </span>
              <span className="text-xs text-white/40">{pool.id}</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{pool.name}</h3>
            <p className="text-sm text-teal-200 mt-1">Operator: {pool.managedBy}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Target Raise</p>
            <p className="text-2xl font-mono text-white font-bold">
              Rp {pool.targetSupply?.toLocaleString('id-ID') || 0}
            </p>
          </div>
        </div>
      </div>

      <PoolSummaryGrid pool={pool} />

      <div className="p-4 bg-[#050606] flex flex-wrap justify-end gap-3 border-t border-white/5">
        <button 
          onClick={() => onView(pool)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-300 bg-blue-400/10 hover:bg-blue-400/20 transition"
        >
          View Details
        </button>
        <button 
          onClick={() => onReject(pool.id)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-rose-400 bg-rose-400/10 hover:bg-rose-400/20 transition"
        >
          Reject
        </button>
        <button 
          onClick={() => onDelete(pool.id)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-rose-200 bg-rose-500/15 hover:bg-rose-500/25 transition flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
        <button 
          onClick={() => onApprove(pool.id)}
          className="px-6 py-2 rounded-lg text-sm font-bold text-teal-950 bg-teal-400 hover:bg-teal-300 transition flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" /> Approve & Publish
        </button>
      </div>
    </motion.div>
  )
}

function PoolSummaryGrid({ pool }: { pool: StakingPool }) {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/[0.02]">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2 text-white/70">
          <DollarSign className="h-4 w-4 text-amber-400" /> Economics
        </h4>
        <div className="space-y-2">
          <Info label="Target Yield" value={`${pool.performanceTargetYield}% APY`} />
          <Info label="Cash Yield" value={`${pool.cashYieldPct}%`} />
          <Info label="Principal Recovery" value={`${pool.principalRecoveryPct}%`} />
          <Info label="Collateral" value={pool.collateralDescription || 'None'} />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2 text-white/70">
          <Leaf className="h-4 w-4 text-green-400" /> Impact Projections
        </h4>
        <div className="space-y-2">
          <Info label="Est. CO2 Avoided" value={`${pool.impactProjections?.co2SavedKg?.toLocaleString() ?? 0} kg`} />
          <Info label="Units Funded" value={`${pool.unitCount} units`} />
          <Info label="Asset Class" value={pool.assetClass} />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2 text-white/70">
          <FileText className="h-4 w-4 text-blue-400" /> Documents & Context
        </h4>
        <div className="space-y-2">
          <div className="text-xs text-white/70">
            <span className="text-white/40 block mb-1">Risk Factors</span>
            {pool.riskDisclosure || "None provided"}
          </div>
          {pool.documents?.map((doc, i) => (
            <a key={i} href={doc.url} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              <FileText className="h-3 w-3" /> {doc.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function PoolDetailsModal({
  pool,
  onClose,
  onStatusChange,
  onDelete,
}: {
  pool: StakingPool
  onClose: () => void
  onStatusChange: (status: PoolStatus) => void
  onDelete: () => void
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
            <Metric label="Target" value={`Rp ${pool.targetSupply.toLocaleString('id-ID')}`} />
            <Metric label="Supplied" value={`Rp ${pool.totalSupplied.toLocaleString('id-ID')}`} />
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

          <PoolSummaryGrid pool={pool} />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Detail label="Product Type" value={pool.productLabel} />
            <Detail label="Revenue Model" value={pool.revenueModel} />
            <Detail label="Location" value={pool.locationLabel} />
            <Detail label="Proof Status" value={pool.proofStatus} />
            <Detail label="Reserve Health" value={pool.reserveHealth} />
            <Detail label="Next Distribution" value={new Date(pool.nextDistribution).toLocaleDateString('id-ID')} />
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
            <Link href={`/fi/pools/${pool.id}`} className="rounded-xl bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-200 hover:bg-blue-400/20">
              Open FI Preview
            </Link>
            <button onClick={onDelete} className="rounded-xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/25">
              Delete Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-white/50">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">{label}</p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white/75">{value}</p>
    </div>
  )
}
