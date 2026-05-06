import React, { useState } from 'react';
import { StakingPool } from '@/types/fi';
import { InvestModal } from './InvestModal';
import { formatIDRXFull, formatNumber } from '@/lib/yield';
import { MOCK_YIELD_DISTRIBUTIONS } from '@/data/pools';
import { CheckCircle2, ChevronRight, MapPin, TrendingUp, Calendar, Shield } from 'lucide-react';

export function PoolSidebar({ pool }: { pool: StakingPool }) {
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const distributions = MOCK_YIELD_DISTRIBUTIONS[pool.id] || [];
  const pctFilled = Math.min(100, Math.round((pool.totalSupplied / pool.targetSupply) * 100));
  
  return (
    <>
      <div className="sticky top-8 flex flex-col gap-6">
        <div className="rounded-[2rem] border border-zinc-950/10 bg-white shadow-sm overflow-hidden flex flex-col">
          {/* Header Image Area */}
          <div className="relative h-48 bg-teal-900 w-full overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-2.5 py-1 text-xs font-bold text-teal-100 backdrop-blur-md mb-3 border border-teal-400/30">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                Distributing
              </span>
              <h2 className="text-2xl font-bold text-white leading-tight">{pool.name}</h2>
              <p className="flex items-center gap-1.5 text-sm text-teal-100/70 mt-1.5 font-medium">
                <MapPin className="h-4 w-4" /> {pool.locationLabel}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 flex-grow flex flex-col">
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Capital Raised</span>
                <span className="text-sm font-bold text-zinc-950">{formatIDRXFull(pool.totalSupplied)}</span>
              </div>
              <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full transition-all duration-1000" style={{ width: `${pctFilled}%` }}></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-semibold text-teal-700">{pctFilled}% Filled</span>
                <span className="text-xs font-semibold text-zinc-500">Target: {formatIDRXFull(pool.targetSupply)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 mb-1"><TrendingUp className="h-3 w-3" /> Cash Yield</span>
                <span className="text-lg font-bold text-teal-700">{pool.cashYieldPct}%</span>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 mb-1"><Calendar className="h-3 w-3" /> Tenor</span>
                <span className="text-lg font-bold text-zinc-950">{pool.tenorMonths} mo</span>
              </div>
            </div>

            <div className="mb-8 rounded-2xl bg-[#050606] p-6 text-white shadow-xl shadow-teal-900/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">Next Distribution</span>
                <span className="text-sm font-bold text-teal-300">{new Date(pool.nextDistribution).toLocaleDateString("id-ID", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <button 
                onClick={() => setIsInvestModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-3.5 font-bold text-teal-950 transition hover:bg-teal-400"
              >
                Connect & Invest
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-medium text-white/40">
                <Shield className="h-3 w-3" /> USDC & IDRX Supported
              </div>
            </div>

            {distributions.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950">Recent Distributions</h3>
                  <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center">View all <ChevronRight className="h-3 w-3" /></button>
                </div>
                <div className="space-y-3">
                  {distributions.slice(0, 3).map((dist) => (
                    <div key={dist.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-950">{new Date(dist.date).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })}</p>
                          <p className="text-[10px] font-semibold text-zinc-500">Yield + Principal</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-teal-700">{formatNumber((dist.yieldDistributed + dist.principalReturned) / 1000000)}M</p>
                        <p className="text-[10px] font-semibold text-zinc-400">IDRX</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <InvestModal 
        pool={pool} 
        isOpen={isInvestModalOpen} 
        onClose={() => setIsInvestModalOpen(false)} 
      />
    </>
  );
}
