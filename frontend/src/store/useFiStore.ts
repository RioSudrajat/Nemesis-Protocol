'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  StakingPool,
  YieldDistribution,
  InvestorPosition,
  PoolReport,
  PoolImpact,
  ReturnCalculation,
} from '@/types/fi'
import { MOCK_POOLS, MOCK_YIELD_DISTRIBUTIONS } from '@/data/pools'
import { calculateReturn } from '@/lib/yield'

interface FiState {
  pools: StakingPool[]
  yieldDistributions: Record<string, YieldDistribution[]>   // keyed by poolId
  myPositions: InvestorPosition[]
  poolReports: Record<string, PoolReport[]>
  poolImpacts: Record<string, PoolImpact>
  _hydrated: boolean
}

interface FiActions {
  investInPool: (poolId: string, investedIDRX: number, walletAddress: string) => void
  calculatePoolReturn: (poolId: string, investedIDRX: number, performancePct: number) => ReturnCalculation | null
  setHydrated: () => void
}

export const useFiStore = create<FiState & FiActions>()(
  persist(
    (set, get) => ({
      pools: MOCK_POOLS,
      yieldDistributions: MOCK_YIELD_DISTRIBUTIONS,
      myPositions: [],
      poolReports: {},
      poolImpacts: {},
      _hydrated: false,

      investInPool: (poolId, investedIDRX) => {
        const { pools, myPositions } = get()
        const pool = pools.find((p) => p.id === poolId)
        if (!pool) return

        const calc = calculateReturn(pool, investedIDRX, 100)
        const existing = myPositions.find((p) => p.poolId === poolId)
        if (existing) {
          set({
            myPositions: myPositions.map((p) =>
              p.poolId === poolId
                ? {
                    ...p,
                    invested: p.invested + investedIDRX,
                    outstandingPrincipal: p.outstandingPrincipal + investedIDRX,
                  }
                : p
            ),
          })
        } else {
          const newPosition: InvestorPosition = {
            poolId,
            poolName: pool.name,
            invested: investedIDRX,
            cashYieldReceived: 0,
            principalRecovered: 0,
            outstandingPrincipal: investedIDRX,
            cashYieldPct: calc.cashYieldPct,
            tenorMonths: pool.tenorMonths,
            maturityDate: new Date(Date.now() + pool.tenorMonths * 30 * 24 * 3600 * 1000).toISOString(),
            investedAt: new Date().toISOString(),
            nextDistribution: pool.nextDistribution,
          }
          set({ myPositions: [...myPositions, newPosition] })
        }

        // Update pool supplied amount
        set({
          pools: pools.map((p) =>
            p.id === poolId
              ? { ...p, totalSupplied: p.totalSupplied + investedIDRX }
              : p
          ),
        })
      },

      calculatePoolReturn: (poolId, investedIDRX, performancePct) => {
        const { pools } = get()
        const pool = pools.find((p) => p.id === poolId)
        if (!pool) return null
        return calculateReturn(pool, investedIDRX, performancePct)
      },

      setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: 'nemesis-fi',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
