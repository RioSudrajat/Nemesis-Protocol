'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RegisteredVehicle } from '@/types/rwa'
import type { StakingPool } from '@/types/fi'

import { MOCK_VEHICLES } from '@/data/vehicles'
import { MOCK_POOLS } from '@/data/pools'

interface NemesisState {
  assets: RegisteredVehicle[]
  pools: StakingPool[]
  userRole: 'investor' | 'operator' | 'super_operator' | null
  _hydrated: boolean
}

interface NemesisActions {
  // Asset Management
  registerAsset: (asset: RegisteredVehicle) => void
  updateAssetStatus: (assetId: string, status: RegisteredVehicle['status']) => void
  
  // Pool Management
  createPool: (pool: StakingPool) => void
  updatePoolStatus: (poolId: string, status: StakingPool['status']) => void
  
  // User Management
  setUserRole: (role: 'investor' | 'operator' | 'super_operator' | null) => void

  setHydrated: () => void
}

export const useNemesisStore = create<NemesisState & NemesisActions>()(
  persist(
    (set, get) => ({
      assets: MOCK_VEHICLES,
      pools: MOCK_POOLS,
      userRole: null,
      _hydrated: false,

      registerAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
      updateAssetStatus: (assetId, status) =>
        set((state) => ({
          assets: state.assets.map((a) => (a.id === assetId ? { ...a, status } : a)),
        })),

      createPool: (pool) => set((state) => ({ pools: [...state.pools, pool] })),
      updatePoolStatus: (poolId, status) =>
        set((state) => ({
          pools: state.pools.map((p) => (p.id === poolId ? { ...p, status } : p)),
        })),

      setUserRole: (role) => set({ userRole: role }),
      
      setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: 'nemesis-global-store',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
