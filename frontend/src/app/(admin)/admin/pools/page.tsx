'use client'

import { useNemesisStore } from '@/store/useNemesisStore'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, ChevronRight, FileText, Leaf, DollarSign, Activity } from 'lucide-react'

export default function AdminPoolsPage() {
  const { pools, updatePoolStatus } = useNemesisStore()
  
  const pendingPools = pools.filter(p => p.status === 'pending_approval')
  const activePools = pools.filter(p => p.status === 'active')

  const handleApprove = (poolId: string) => {
    updatePoolStatus(poolId, 'active')
  }

  const handleReject = (poolId: string) => {
    // For demo purposes, we just mark it inactive or remove it.
    // Let's set it to some "REJECTED" status or back to "DRAFT"
    updatePoolStatus(poolId, 'closed')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Pool Moderation</h1>
        <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>
          Review and approve submitted Operator campaigns.
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
              <motion.div 
                key={pool.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-amber-500/20 bg-[#070808] overflow-hidden"
              >
                <div className="p-6 border-b border-white/5">
                  <div className="flex justify-between items-start">
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

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/[0.02]">
                  {/* Economics */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-white/70">
                      <DollarSign className="h-4 w-4 text-amber-400" /> Economics
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-white/50">Target Yield</span>
                        <span className="text-sm font-mono text-white">{pool.performanceTargetYield}% APY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-white/50">Revenue Split (Op/Inv)</span>
                        <span className="text-sm font-mono text-white">{pool.operatorBaseFeePct || 20}% / {100 - (pool.operatorBaseFeePct || 20)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-white/50">Collateral</span>
                        <span className="text-sm font-medium text-white">{pool.collateralDescription || 'None'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-white/70">
                      <Leaf className="h-4 w-4 text-green-400" /> Impact Projections
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-white/50">Est. CO2 Avoided</span>
                        <span className="text-sm font-mono text-white">{pool.impactProjections?.co2SavedKg?.toLocaleString()} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-white/50">Units Funded</span>
                        <span className="text-sm font-mono text-white">{pool.unitCount} units</span>
                      </div>
                    </div>
                  </div>

                  {/* Documents & Context */}
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

                <div className="p-4 bg-[#050606] flex justify-end gap-3 border-t border-white/5">
                  <button 
                    onClick={() => handleReject(pool.id)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-rose-400 bg-rose-400/10 hover:bg-rose-400/20 transition"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(pool.id)}
                    className="px-6 py-2 rounded-lg text-sm font-bold text-teal-950 bg-teal-400 hover:bg-teal-300 transition flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve & Publish
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">Active Pools ({activePools.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePools.map((pool) => (
            <div key={pool.id} className="glass-card p-5 rounded-2xl border border-teal-500/20">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-white text-lg leading-tight">{pool.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/20 shrink-0">
                  Active
                </span>
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-xs text-white/50">Target Raise</p>
                <p className="font-mono text-sm font-semibold text-white">Rp {pool.targetSupply?.toLocaleString('id-ID') || 0}</p>
              </div>
              <button className="text-xs text-teal-200 hover:text-teal-100 flex items-center gap-1">
                View Details <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
