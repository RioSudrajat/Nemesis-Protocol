export type FleetCategory = 'ojol' | 'kurir' | 'logistik' | 'korporat'
export type NodeStatus = 'active' | 'idle' | 'maintenance' | 'offline'

export interface NetworkStats {
  totalFleet: number
  activeNodes: number
  kmToday: number
  onChainSubmissions: number
  sessionStartTime: string
}

export interface FleetCategoryStat {
  category: FleetCategory
  label: string
  unitCount: number
  kmToday: number
  imageUrl: string
}

export interface DrivingDistanceStat {
  totalPeriodKm: number
  yesterdayKm: number
  last30DaysKm: number
  chartData: { date: string; km: number }[]
}

export interface AnonymizedActivityEntry {
  unitAnonymId: string
  zonaKota: string
  timestamp: string
  kmLifetime: number
  activeHours: number
  routeLogHash: string
  onChainHash: string
  category: FleetCategory
}

export interface QuestItem {
  id: string
  title: string
  description: string
  reward: number
  actionUrl: string
  actionLabel: string
  completed: boolean
  icon: string
}

export interface PointCampaign {
  id: string
  season: number
  title: string
  subtitle: string
  totalPoints: number
  distributedPoints: number
  endDate: string
  active: boolean
  rewards: CampaignReward[]
}

export interface CampaignReward {
  id: string
  label: string
  description: string
  pointCost: number
  available: boolean
}

export interface LeaderboardEntry {
  rank: number
  walletAddress: string
  points: number
  change: number
}

export interface PointActivity {
  id: string
  walletAddress: string
  points: number
  reason: string
  timestamp: string
}

export interface PoolUnit {
  unitId: string
  vehicleType: string
  category: FleetCategory
  status: NodeStatus
  kmLifetime: number
  kmToday: number
  activeHoursToday: number
  nodeScore: number
  healthScore: number
  nextServiceKm: number
  imageUrl?: string
  dailyRouteCoords: RoutePoint[][]
  dailyRouteLogs: RouteLogEntry[]
}

export interface RoutePoint {
  lat: number
  lng: number
}

export interface RouteLogEntry {
  timestamp: string
  zone: string
  km: number
  activeHours: number
  onChainHash: string
}

export interface PoolActivitySummary {
  poolId: string
  activeUnits: number
  idleUnits: number
  maintenanceUnits: number
  offlineUnits: number
  totalKmToday: number
  activeHoursToday: number
  routeLogsToday: number
  movementSegments: number
  utilizationPct: number
  proofHashStatus: 'pending' | 'anchored' | 'failed'
}

export interface DriverGPSState {
  isActive: boolean
  activeMinutesToday: number
  kmToday: number
  routeLogsToday: number
  movementSegments: number
  lastCoords?: { lat: number; lng: number }
}
