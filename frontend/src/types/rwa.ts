import { FleetCategory, NodeStatus } from './depin'
import { OperatorType, PoolProductType } from './fi'

export type VehicleType =
  | 'motor_listrik'
  | 'motor_kargo'
  | 'mobil_listrik'
  | 'van_listrik'
  | 'truk_listrik'
  | 'bus_listrik'
  | 'pikap_listrik'

export type ContractType = 'rent' | 'rent_to_own' | 'contracted_remittance'
export type AssetModuleStatus = 'active' | 'coming_soon' | 'future'

export interface RegisteredVehicle {
  id: string
  vin: string
  unitId: string
  type: VehicleType
  category: FleetCategory
  brand: string
  model: string
  year: number
  operatorId: string
  gpsDeviceId: string
  financedCost: number
  productModel: ContractType
  poolProductType: PoolProductType
  odometer: number
  nodeScore: number
  healthScore: number
  healthBreakdown: VehicleHealthBreakdown
  status: NodeStatus
  maintenanceFundBalance: number
  lastServiceKm: number
  nextServiceKm: number
  flatFeeDaily: number
  poolId?: string
  onChainAddress?: string
  imageUrl?: string
  registeredAt: string
  driverId?: string
}

export interface VehicleHealthBreakdown {
  rem: number
  ban: number
  baterai: number
  lampu: number
  mesin?: number
}

export interface MaintenanceFundEntry {
  id: string
  vehicleId: string
  unitId: string
  type: 'deposit' | 'release'
  amount: number
  triggeredAtKm?: number
  workshopId?: string
  workshopName?: string
  serviceProofHash?: string
  serviceType?: string
  status: 'pending' | 'confirmed' | 'released'
  timestamp: string
}

export interface MaintenanceAlert {
  vehicleId: string
  unitId: string
  severity: 'info' | 'warning' | 'critical'
  type: 'scheduled' | 'predictive'
  message: string
  dueSinceKm?: number
  component?: string
}

export interface AIFleetInsight {
  vehicleId?: string
  unitId?: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  prediction: string
  confidence: number
  category: 'maintenance' | 'performance' | 'utilization' | 'battery'
}

export interface AssetModule {
  id: string
  moduleNumber: number
  title: string
  subtitle: string
  description: string
  status: AssetModuleStatus
  statusLabel: string
  icon: string
  vehicleTypes?: string[]
  revenueSource?: string
  proofMechanism?: string
}

export interface OperatorProfile {
  id: string
  walletAddress: string
  name: string
  type: OperatorType
  businessName?: string
  city: string
  kycStatus: 'pending' | 'verified' | 'rejected'
  totalVehicles: number
  activeVehicles: number
  poolId?: string
  joinedAt: string
}
