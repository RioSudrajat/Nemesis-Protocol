import type { RegisteredVehicle } from '@/types/rwa'
import type { AssetSubclass } from '@/types/rwa'

/* ── Distributions ── */

const BRANDS: { brand: string; model: string; weight: number }[] = [
  { brand: 'Gesits', model: 'G1', weight: 35 },
  { brand: 'Gesits', model: 'G2', weight: 25 },
  { brand: 'Viar', model: 'Q1', weight: 15 },
  { brand: 'Viar', model: 'Karya', weight: 15 },
  { brand: 'Honda', model: 'EM1 e:', weight: 10 },
]

const CATEGORIES: { category: string; type: string; subclass: AssetSubclass; weight: number }[] = [
  { category: 'ojol', type: 'motor_listrik', subclass: 'ev_ride_hailing_rental_bike', weight: 50 },
  { category: 'kurir', type: 'motor_listrik', subclass: 'delivery_bike', weight: 30 },
  { category: 'logistik', type: 'motor_kargo', subclass: 'cargo_bike', weight: 20 },
]


/**
 * Deterministic seeded random to ensure SSR/CSR consistency.
 * Simple mulberry32 PRNG.
 */
function createRng(seed: number) {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickWeighted<T extends { weight: number }>(items: T[], rand: number): T {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let acc = 0
  for (const item of items) {
    acc += item.weight / total
    if (rand < acc) return item
  }
  return items[items.length - 1]
}

/* ── Generator ── */

const FINANCED_COST = 25_000_000
const POOL_ID = 'pool-batch-1'

export function generateMockVehicles(count = 100): RegisteredVehicle[] {
  const rng = createRng(42) // deterministic seed

  // Pre-assign statuses: 75 active, 10 maintenance, 10 idle, 5 inactive
  const statusPool: RegisteredVehicle['status'][] = [
    ...Array(75).fill('active'),
    ...Array(10).fill('maintenance'),
    ...Array(10).fill('idle'),
    ...Array(5).fill('inactive'),
  ]
  // Shuffle with deterministic RNG
  for (let i = statusPool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [statusPool[i], statusPool[j]] = [statusPool[j], statusPool[i]]
  }

  // Keep exactly 17 non-inactive units without drivers so "83 assigned / 17 available"
  // stays true and every available unit can actually be assigned.
  const unassignedIndexes = new Set<number>()
  for (let i = count - 1; i >= 0 && unassignedIndexes.size < 17; i--) {
    if (statusPool[i] !== 'inactive') {
      unassignedIndexes.add(i)
    }
  }

  // Pre-assign drivers to every unit outside the available set.
  let driverIdx = 0

  const vehicles: RegisteredVehicle[] = []

  for (let i = 0; i < count; i++) {
    const idx = i + 1
    const paddedId = String(idx).padStart(4, '0')
    const { brand, model } = pickWeighted(BRANDS, rng())
    const { category, type, subclass } = pickWeighted(CATEGORIES, rng())
    const status = statusPool[i]

    const odometer = Math.round(rng() * 30000)
    const nodeScore = Math.round(65 + rng() * 34)
    const healthScore = Math.round(65 + rng() * 34)
    const flatFeeDaily = category === 'logistik' ? 60000 : category === 'kurir' ? 52000 : 50000

    // Service milestones
    const lastServiceKm = Math.floor(odometer / 2500) * 2500
    const nextServiceKm = lastServiceKm + 2500

    // Health breakdown
    const hb = (base: number) => Math.min(100, Math.max(60, Math.round(base + (rng() - 0.5) * 20)))
    const healthBreakdown = {
      rem: hb(healthScore),
      ban: hb(healthScore - 5),
      baterai: hb(healthScore + 3),
      lampu: hb(healthScore + 8),
    }

    // Maintenance fund: proportional to odometer
    const maintenanceFundBalance = Math.round(odometer * (3 + rng() * 12))

    // Registration date spread: Jan 2026 – Mar 2026
    const regMonth = Math.floor(rng() * 3) // 0=Jan, 1=Feb, 2=Mar
    const regDay = 1 + Math.floor(rng() * 28)
    const registeredAt = `2026-0${regMonth + 1}-${String(regDay).padStart(2, '0')}T00:00:00.000Z`

    // Assign drivers to all units outside the 17 available units.
    let driverId: string | undefined
    if (!unassignedIndexes.has(i) && driverIdx < 83) {
      driverId = `drv-${String(driverIdx + 1).padStart(3, '0')}`
      driverIdx++
    }

    vehicles.push({
      id: `vhc-${paddedId}`,
      assetClass: 'mobility',
      assetSubclass: subclass,
      vin: `NMS2026JKT${paddedId}`,
      unitId: `#NMS-${paddedId}`,
      type,
      category,
      brand,
      model,
      year: rng() > 0.15 ? 2025 : 2026,
      operatorId: 'op-nemesis-native',
      gpsDeviceId: `GPS-PHN-${paddedId}`,
      financedCost: FINANCED_COST,
      productModel: 'rent_to_own',
      poolProductType: 'mobility_credit',
      odometer,
      nodeScore,
      healthScore,
      healthBreakdown,
      status,
      maintenanceFundBalance,
      lastServiceKm,
      nextServiceKm,
      flatFeeDaily,
      poolId: status !== 'inactive' ? POOL_ID : undefined,
      registeredAt,
      driverId,
    })
  }

  return vehicles
}
