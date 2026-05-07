export type JavaClusterId =
  | 'jakarta'
  | 'tangerang'
  | 'bekasi'
  | 'depok_bogor'
  | 'bandung'
  | 'cirebon'
  | 'semarang'
  | 'yogyakarta'
  | 'surabaya'
  | 'malang'

export interface JavaCluster {
  id: JavaClusterId
  label: string
  center: { lat: number; lng: number }
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }
  weight: number
}

export const JAVA_CLUSTERS: JavaCluster[] = [
  {
    id: 'jakarta',
    label: 'Jakarta',
    center: { lat: -6.205, lng: 106.835 },
    bounds: { minLat: -6.34, maxLat: -6.09, minLng: 106.69, maxLng: 106.96 },
    weight: 24,
  },
  {
    id: 'tangerang',
    label: 'Tangerang',
    center: { lat: -6.2, lng: 106.63 },
    bounds: { minLat: -6.31, maxLat: -6.1, minLng: 106.5, maxLng: 106.75 },
    weight: 8,
  },
  {
    id: 'bekasi',
    label: 'Bekasi',
    center: { lat: -6.25, lng: 107.0 },
    bounds: { minLat: -6.38, maxLat: -6.14, minLng: 106.92, maxLng: 107.14 },
    weight: 8,
  },
  {
    id: 'depok_bogor',
    label: 'Depok/Bogor',
    center: { lat: -6.47, lng: 106.82 },
    bounds: { minLat: -6.65, maxLat: -6.32, minLng: 106.72, maxLng: 106.91 },
    weight: 5,
  },
  {
    id: 'bandung',
    label: 'Bandung',
    center: { lat: -6.92, lng: 107.61 },
    bounds: { minLat: -7.03, maxLat: -6.78, minLng: 107.48, maxLng: 107.75 },
    weight: 15,
  },
  {
    id: 'cirebon',
    label: 'Cirebon',
    center: { lat: -6.73, lng: 108.55 },
    bounds: { minLat: -6.83, maxLat: -6.62, minLng: 108.44, maxLng: 108.66 },
    weight: 7,
  },
  {
    id: 'semarang',
    label: 'Semarang',
    center: { lat: -6.99, lng: 110.42 },
    bounds: { minLat: -7.1, maxLat: -6.88, minLng: 110.28, maxLng: 110.55 },
    weight: 8,
  },
  {
    id: 'yogyakarta',
    label: 'Yogyakarta',
    center: { lat: -7.8, lng: 110.37 },
    bounds: { minLat: -7.92, maxLat: -7.68, minLng: 110.24, maxLng: 110.5 },
    weight: 7,
  },
  {
    id: 'surabaya',
    label: 'Surabaya',
    center: { lat: -7.25, lng: 112.75 },
    bounds: { minLat: -7.4, maxLat: -7.12, minLng: 112.62, maxLng: 112.9 },
    weight: 13,
  },
  {
    id: 'malang',
    label: 'Malang',
    center: { lat: -7.98, lng: 112.63 },
    bounds: { minLat: -8.1, maxLat: -7.84, minLng: 112.5, maxLng: 112.75 },
    weight: 5,
  },
]

const TOTAL_WEIGHT = JAVA_CLUSTERS.reduce((sum, cluster) => sum + cluster.weight, 0)

export function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function getJavaClusterForId(id: string, preferredRegion?: string): JavaCluster {
  const region = preferredRegion?.toLowerCase() ?? ''
  const explicit = JAVA_CLUSTERS.find((cluster) => region.includes(cluster.label.toLowerCase().split('/')[0]))
  if (explicit) return explicit
  if (region.includes('bogor') || region.includes('depok')) return JAVA_CLUSTERS.find((cluster) => cluster.id === 'depok_bogor')!

  const pick = hashString(id) % TOTAL_WEIGHT
  let cursor = 0
  for (const cluster of JAVA_CLUSTERS) {
    cursor += cluster.weight
    if (pick < cursor) return cluster
  }
  return JAVA_CLUSTERS[0]
}

export function getJavaFleetCoordinate(id: string, preferredRegion?: string) {
  const cluster = getJavaClusterForId(id, preferredRegion)
  const hash = hashString(`${id}:${cluster.id}`)
  const angle = ((hash % 3600) / 3600) * Math.PI * 2
  const ring = 0.18 + (((hash >>> 4) % 1000) / 1000) * 0.82
  const skew = (((hash >>> 14) % 1000) / 1000) * 2 - 1
  const latRadius = (cluster.bounds.maxLat - cluster.bounds.minLat) / 2
  const lngRadius = (cluster.bounds.maxLng - cluster.bounds.minLng) / 2

  const lat = clamp(
    cluster.center.lat + Math.sin(angle) * latRadius * ring + skew * latRadius * 0.12,
    cluster.bounds.minLat,
    cluster.bounds.maxLat
  )
  const lng = clamp(
    cluster.center.lng + Math.cos(angle) * lngRadius * ring - skew * lngRadius * 0.08,
    cluster.bounds.minLng,
    cluster.bounds.maxLng
  )

  return { lat, lng, cluster }
}

export function getCoordinateForRegion(region: string, id = region) {
  const cluster = getJavaClusterForId(id, region)
  return { ...cluster.center, cluster }
}
