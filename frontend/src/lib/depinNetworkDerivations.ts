import type { RegisteredVehicle } from '@/types/rwa'
import type { StakingPool, PoolReport } from '@/types/fi'
import type { FleetCategory } from '@/types/depin'
import { getJavaFleetCoordinate, hashString } from '@/lib/javaFleetCoordinates'

export interface DepinActivityRow {
  unit: string
  cat: string
  category: FleetCategory
  zone: string
  time: string
  km: number
  hash: string
  assetId: string
}

export function getAssetCategory(asset: RegisteredVehicle): FleetCategory {
  if (asset.category === 'kurir' || asset.assetSubclass === 'delivery_bike') return 'kurir'
  if (asset.category === 'logistik' || asset.assetSubclass === 'cargo_bike') return 'logistik'
  if (asset.category === 'korporat' || ['ev_taxi', 'ev_van', 'ev_shuttle', 'ev_bus'].includes(asset.assetSubclass)) return 'korporat'
  return 'ojol'
}

export function getCategoryLabel(category: FleetCategory) {
  if (category === 'kurir') return 'Kurir'
  if (category === 'logistik') return 'Logistik'
  if (category === 'korporat') return 'Korporat'
  return 'Ojol'
}

export function getDailyKm(asset: RegisteredVehicle) {
  const hash = hashString(asset.id)
  const base = Math.max(6, Math.round((asset.odometer ?? 0) / 240))
  return Math.min(96, base + (hash % 18))
}

export function getProofHash(asset: RegisteredVehicle) {
  const raw = hashString(`${asset.id}:${asset.iotDeviceId ?? asset.vin ?? asset.unitId}`).toString(36).padStart(8, '0')
  return `${raw.slice(0, 4)}...${raw.slice(-4)}`
}

export function getRecentTime(asset: RegisteredVehicle) {
  const hash = hashString(asset.id)
  const minutesAgo = 3 + (hash % 120)
  const date = new Date(Date.now() - minutesAgo * 60 * 1000)
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export function deriveDepinActivityRows(assets: RegisteredVehicle[], limit?: number): DepinActivityRow[] {
  const rows = assets
    .filter((asset) => asset.status !== 'inactive')
    .map((asset) => {
      const category = getAssetCategory(asset)
      const coordinate = getJavaFleetCoordinate(asset.id || asset.unitId)
      return {
        unit: asset.unitId,
        cat: getCategoryLabel(category),
        category,
        zone: coordinate.cluster.label,
        time: getRecentTime(asset),
        km: getDailyKm(asset),
        hash: getProofHash(asset),
        assetId: asset.id,
      }
    })
    .sort((a, b) => b.km - a.km)

  return typeof limit === 'number' ? rows.slice(0, limit) : rows
}

export function deriveFleetCategoryCards(assets: RegisteredVehicle[]) {
  const categories: { category: FleetCategory; label: string }[] = [
    { category: 'ojol', label: 'Ride-hailing' },
    { category: 'kurir', label: 'Delivery' },
    { category: 'logistik', label: 'Logistics' },
  ]

  return categories.map(({ category, label }) => {
    const categoryAssets = assets.filter((asset) => getAssetCategory(asset) === category)
    return {
      name: getCategoryLabel(category),
      label,
      category,
      units: categoryAssets.length,
      kmToday: categoryAssets.reduce((sum, asset) => sum + getDailyKm(asset), 0),
    }
  })
}

export function deriveTopZones(assets: RegisteredVehicle[], limit = 4) {
  const zoneCounts = new Map<string, number>()
  for (const asset of assets) {
    const { cluster } = getJavaFleetCoordinate(asset.id || asset.unitId)
    zoneCounts.set(cluster.label, (zoneCounts.get(cluster.label) ?? 0) + 1)
  }
  return Array.from(zoneCounts.entries())
    .map(([zone, count]) => ({ zone, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function deriveSevenDaySeries(assets: RegisteredVehicle[], reports: PoolReport[] = []) {
  const publishedKm = reports
    .filter((report) => report.isPublished)
    .slice(-7)
    .map((report) => ({ name: report.period.slice(5), value: Math.round(report.totalKm / 30) }))

  if (publishedKm.length >= 4) return publishedKm

  const todayKm = assets.reduce((sum, asset) => sum + getDailyKm(asset), 0)
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name, index) => {
    const factor = [0.9, 1.02, 0.97, 1, 1.08, 0.82, 0.76][index]
    return { name, value: Math.round(todayKm * factor) }
  })
}

export function deriveTxSeries(assets: RegisteredVehicle[]) {
  const base = assets.filter((asset) => asset.status !== 'inactive').length
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name, index) => ({
    name,
    value: Math.max(0, Math.round(base * [0.9, 1, 0.96, 1.08, 1.14, 0.78, 0.68][index])),
  }))
}

export function deriveNetworkMetrics(assets: RegisteredVehicle[], pools: StakingPool[]) {
  const total = assets.length
  const active = assets.filter((asset) => asset.status === 'active').length
  const inactive = assets.filter((asset) => asset.status === 'inactive' || asset.status === 'offline').length
  const inTransit = assets.filter((asset) => asset.status === 'active' && getDailyKm(asset) > 20).length
  const tokenizedValue = assets.reduce((sum, asset) => sum + asset.financedCost, 0)
  const totalSupplied = pools.reduce((sum, pool) => sum + pool.totalSupplied, 0)

  return {
    total,
    active,
    inactive,
    inTransit,
    uptimePct: total ? Math.round((active / total) * 1000) / 10 : 0,
    avgUptimePct: total ? Math.round(((total - inactive) / total) * 1000) / 10 : 0,
    blockchainSyncPct: total ? Math.round((assets.filter((asset) => asset.iotDeviceId || asset.onChainAddress).length / total) * 1000) / 10 : 0,
    txSuccessPct: 98.2,
    tokenizedValue,
    totalSupplied,
  }
}
