import { FleetCategory, NodeStatus } from './depin'
import { OperatorType, PoolProductType } from './fi'

export type AssetClass = 'mobility' | 'charging' | 'energy'

export type MobilitySubclass =
  | 'ev_ride_hailing_rental_bike'
  | 'delivery_bike'
  | 'cargo_bike'
  | 'ev_taxi'
  | 'ev_van'
  | 'ev_shuttle'
  | 'ev_bus'

export type ChargingSubclass =
  | 'depot_charger'
  | 'public_fast_charger'
  | 'swap_station'
  | 'corridor_charging_hub'

export type EnergySubclass =
  | 'solar_ev_depot'
  | 'battery_storage'
  | 'exportable_surplus_electricity'

export type AssetSubclass = MobilitySubclass | ChargingSubclass | EnergySubclass

export type ContractType = 'rent' | 'rent_to_own' | 'contracted_remittance' | 'revenue_share'
export type AssetModuleStatus = 'active' | 'coming_soon' | 'future'

export interface RegisteredAsset {
  id: string
  assetClass: AssetClass
  assetSubclass: AssetSubclass
  
  // Identifiers (Adaptable based on asset class)
  vin?: string // For mobility
  iotDeviceId?: string // Generic IoT ID or GPS ID
  stationId?: string // For charging
  gpsDeviceId?: string // GPS device for vehicles
  
  unitId: string
  brand: string
  model: string
  year: number
  
  // Backwards-compatible vehicle fields
  type?: string // e.g. 'motor_listrik', 'motor_kargo'
  category?: string // e.g. 'ojol', 'kurir', 'logistik'
  odometer?: number // km driven (mobility assets)
  
  operatorId: string
  financedCost: number
  productModel: ContractType
  poolProductType: PoolProductType
  
  // Health & Metrics
  nodeScore: number
  healthScore: number
  healthBreakdown: AssetHealthBreakdown
  status: NodeStatus
  
  // Operations
  maintenanceFundBalance: number
  lastServiceKm?: number // Optional for non-mobility
  nextServiceKm?: number // Optional for non-mobility
  flatFeeDaily?: number // Optional for revenue-share models
  
  poolId?: string
  onChainAddress?: string
  imageUrl?: string
  registeredAt: string
  driverId?: string
}

export type RegisteredVehicle = RegisteredAsset // Alias for backwards compatibility

export interface AssetHealthBreakdown {
  rem?: number
  ban?: number
  baterai?: number
  lampu?: number
  mesin?: number
  koneksi_iot?: number
  power_output?: number
}

export interface MaintenanceFundEntry {
  id: string
  assetId?: string // Used to be vehicleId
  vehicleId?: string // Backwards compat
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
  assetId?: string // Used to be vehicleId
  vehicleId?: string // Backwards compat
  unitId: string
  severity: 'info' | 'warning' | 'critical'
  type: 'scheduled' | 'predictive'
  message: string
  dueSinceKm?: number
  component?: string
}

export interface AIAssetInsight { // Used to be AIFleetInsight
  assetId?: string // Used to be vehicleId
  unitId?: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  prediction: string
  confidence: number
  category: 'maintenance' | 'performance' | 'utilization' | 'battery' | 'grid_sync'
}

export type AIFleetInsight = AIAssetInsight // Backwards compatibility alias

export interface AssetModule {
  id: string
  moduleNumber: number
  title: string
  subtitle: string
  description: string
  status: AssetModuleStatus
  statusLabel: string
  icon: string
  assetSubclasses?: string[] // Replaced vehicleTypes
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
  totalAssets: number // Used to be totalVehicles
  activeAssets: number // Used to be activeVehicles
  poolId?: string
  joinedAt: string
}
