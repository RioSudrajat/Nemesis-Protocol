'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RegisteredVehicle } from '@/types/rwa'
import type { OperatorProfile } from '@/types/rwa'
import type { StakingPool, InvestorPosition, PoolReport } from '@/types/fi'

import { MOCK_VEHICLES } from '@/data/vehicles'
import { MOCK_POOLS } from '@/data/pools'
import { MOCK_OPERATOR_PROFILE, MOCK_PARTNER_OPERATORS } from '@/data/operators'
import { MOCK_POOL_REPORTS } from '@/data/reports'

/* ── Driver type (canonical definition — re-exported for backward compat) ── */

export interface RegisteredDriver {
  id: string
  phone: string
  fullName: string
  kycStatus: 'pending' | 'verified' | 'rejected'
  assignedVehicleId: string
  assignedVehicleName: string
  /** @deprecated Contract terms now come from the asset, kept for backward compat */
  contractType?: 'rent' | 'rent_to_own'
  /** @deprecated Daily fee now comes from the asset, kept for backward compat */
  dailyFee?: number
  registeredAt: string
}

/* ── Seed drivers (moved from driverAuthStore) ── */

const BASE_SEED_DRIVERS: RegisteredDriver[] = [
  {
    id: 'drv-001',
    phone: '+6281234567890',
    fullName: 'Budi Santoso',
    kycStatus: 'verified',
    assignedVehicleId: '#NMS-0001',
    assignedVehicleName: 'Honda EM1 e:',
    contractType: 'rent_to_own',
    dailyFee: 50000,
    registeredAt: '2026-03-15T08:00:00Z',
  },
  {
    id: 'drv-002',
    phone: '+6281298765432',
    fullName: 'Agus Pratama',
    kycStatus: 'verified',
    assignedVehicleId: '#NMS-0002',
    assignedVehicleName: 'Viar Q1',
    contractType: 'rent_to_own',
    dailyFee: 45000,
    registeredAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'drv-003',
    phone: '+6287700001111',
    fullName: 'Dewi Lestari',
    kycStatus: 'pending',
    assignedVehicleId: '#NMS-0003',
    assignedVehicleName: 'Gesits G1',
    contractType: 'rent_to_own',
    dailyFee: 50000,
    registeredAt: '2026-04-20T14:00:00Z',
  },
]

const DRIVER_NAMES = [
  'Budi Santoso',
  'Agus Pratama',
  'Dewi Lestari',
  'Rio Sudrajat',
  'Siti Rahma',
  'Andi Wijaya',
  'Maya Kartika',
  'Fajar Nugroho',
  'Rina Safitri',
  'Dimas Saputra',
]

const BASE_SEED_DRIVER_BY_ID = new Map(BASE_SEED_DRIVERS.map((driver) => [driver.id, driver]))

const SEED_DRIVERS: RegisteredDriver[] = MOCK_VEHICLES
  .filter((vehicle) => vehicle.driverId)
  .map((vehicle, index) => {
    const existing = BASE_SEED_DRIVER_BY_ID.get(vehicle.driverId!)
    if (existing) return existing

    const name = `${DRIVER_NAMES[index % DRIVER_NAMES.length]} ${String(index + 1).padStart(2, '0')}`
    return {
      id: vehicle.driverId!,
      phone: `+62877${String(index + 1).padStart(8, '0')}`,
      fullName: name,
      kycStatus: index % 11 === 0 ? 'pending' : 'verified',
      assignedVehicleId: vehicle.unitId,
      assignedVehicleName: `${vehicle.brand} ${vehicle.model}`,
      registeredAt: vehicle.registeredAt,
    }
  })

/* ── State shape ── */

interface NemesisState {
  assets: RegisteredVehicle[]
  pools: StakingPool[]
  drivers: RegisteredDriver[]
  operators: OperatorProfile[]
  investments: InvestorPosition[]
  poolReports: PoolReport[]
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

  // Driver Management
  registerDriver: (driver: Omit<RegisteredDriver, 'id' | 'registeredAt'>) => void
  assignVehicleToDriver: (driverId: string, vehicleUnitId: string) => void

  // Investment actions
  investInPool: (poolId: string, amount: number, currency: 'IDRX' | 'USDC') => void

  // Reports
  addPoolReport: (report: PoolReport) => void
  updatePoolReport: (reportId: string, updates: Partial<PoolReport>) => void

  // User Management
  setUserRole: (role: NemesisState['userRole']) => void
  setHydrated: () => void
}

/* ── Computed selectors (use these in components) ── */

export function selectAvailableVehicles(state: NemesisState): RegisteredVehicle[] {
  const assignedIds = new Set(state.drivers.map(d => d.assignedVehicleId))
  return state.assets.filter(a => !a.driverId && !assignedIds.has(a.unitId) && a.status !== 'inactive')
}

export function selectUnpooledAssets(state: NemesisState): RegisteredVehicle[] {
  return state.assets.filter(a => !a.poolId && a.status !== 'inactive')
}

export function selectFleetStats(state: NemesisState) {
  const total = state.assets.length
  const active = state.assets.filter(a => a.status === 'active').length
  const maintenance = state.assets.filter(a => a.status === 'maintenance').length
  const idle = state.assets.filter(a => a.status === 'idle').length
  const inactive = state.assets.filter(a => a.status === 'inactive').length
  const withDriver = state.assets.filter(a => a.driverId).length
  return { total, active, maintenance, idle, inactive, withDriver }
}

/* ── Store ── */

export const useNemesisStore = create<NemesisState & NemesisActions>()(
  persist(
    (set, get) => ({
      assets: MOCK_VEHICLES,
      pools: MOCK_POOLS,
      drivers: SEED_DRIVERS,
      operators: [MOCK_OPERATOR_PROFILE, ...MOCK_PARTNER_OPERATORS],
      investments: [],
      poolReports: Object.values(MOCK_POOL_REPORTS).flat(),
      userRole: null,
      _hydrated: false,

      // ─── Asset ───
      registerAsset: (asset) =>
        set((state) => ({ assets: [...state.assets, asset] })),

      updateAssetStatus: (assetId, status) =>
        set((state) => ({
          assets: state.assets.map((a) => (a.id === assetId ? { ...a, status } : a)),
        })),

      // ─── Pool ───
      createPool: (pool) =>
        set((state) => ({ pools: [...state.pools, pool] })),

      updatePoolStatus: (poolId, status) =>
        set((state) => ({
          pools: state.pools.map((p) => (p.id === poolId ? { ...p, status } : p)),
        })),

      // ─── Driver ───
      registerDriver: (driverData) =>
        set((state) => {
          const newDriver: RegisteredDriver = {
            ...driverData,
            id: `drv-${Date.now()}`,
            registeredAt: new Date().toISOString(),
          }
          // Also mark the asset as having this driver
          const assets = state.assets.map((a) =>
            a.unitId === driverData.assignedVehicleId
              ? { ...a, driverId: newDriver.id }
              : a
          )
          return { drivers: [...state.drivers, newDriver], assets }
        }),

      assignVehicleToDriver: (driverId, vehicleUnitId) =>
        set((state) => {
          const vehicle = state.assets.find(a => a.unitId === vehicleUnitId)
          const drivers = state.drivers.map((d) =>
            d.id === driverId
              ? {
                  ...d,
                  assignedVehicleId: vehicleUnitId,
                  assignedVehicleName: vehicle ? `${vehicle.brand} ${vehicle.model}` : vehicleUnitId,
                }
              : d
          )
          const assets = state.assets.map((a) => {
            if (a.driverId === driverId && a.unitId !== vehicleUnitId) {
              return { ...a, driverId: undefined }
            }
            return a.unitId === vehicleUnitId ? { ...a, driverId } : a
          })
          return { drivers, assets }
        }),

      // ─── Investment ───
      investInPool: (poolId, amount, currency) =>
        set((state) => {
          const pool = state.pools.find(p => p.id === poolId)
          if (!pool) return state

          const position: InvestorPosition = {
            poolId,
            poolName: pool.name,
            invested: amount,
            cashYieldReceived: 0,
            principalRecovered: 0,
            outstandingPrincipal: amount,
            cashYieldPct: pool.cashYieldPct,
            tenorMonths: pool.tenorMonths,
            maturityDate: new Date(Date.now() + pool.tenorMonths * 30 * 24 * 60 * 60 * 1000).toISOString(),
            investedAt: new Date().toISOString(),
            nextDistribution: pool.nextDistribution,
          }

          // Update pool's totalSupplied
          const pools = state.pools.map(p =>
            p.id === poolId ? { ...p, totalSupplied: p.totalSupplied + amount } : p
          )

          return { investments: [...state.investments, position], pools }
        }),

      // ─── Reports ───
      addPoolReport: (report) =>
        set((state) => ({ poolReports: [...state.poolReports, report] })),

      updatePoolReport: (reportId, updates) =>
        set((state) => ({
          poolReports: state.poolReports.map(r =>
            r.id === reportId ? { ...r, ...updates } : r
          ),
        })),

      // ─── User ───
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
