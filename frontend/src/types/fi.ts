import { FleetCategory } from './depin'

export type OperatorType = 'nemesis_native' | 'verified_partner' | 'independent'
export type PoolStatus = 'upcoming' | 'active' | 'filled' | 'closed'
export type PoolProductType = 'mobility_credit' | 'fleet_remittance' | 'charging_yield' | 'energy_yield'
export type ProofStatus = 'pending' | 'partial' | 'verified'

export interface StakingPool {
  id: string
  name: string
  slug: string
  description: string
  productType: PoolProductType
  productLabel: string
  revenueModel: string
  operatorType: OperatorType
  managedBy: string
  category: FleetCategory[]
  unitCount: number
  cashYieldPct: number
  principalRecoveryPct: number
  totalAnnualCashDistributionPct: number
  tenorMonths: number
  totalSupplied: number
  targetSupply: number
  minInvestment: number
  defaultReservePct: number
  maintenanceReservePct: number
  operatorBaseFeePct: number
  operatorPerformanceFeePct: number
  protocolFeePct: number
  proofStatus: ProofStatus
  reserveHealth: string
  status: PoolStatus
  energyPointsEligible: boolean
  imageUrl: string
  locationLabel: string
  nextDistribution: string
  createdAt: string
  tags: string[]
  unitBreakdown: { category: FleetCategory; label: string; count: number }[]
  activeUnits: number
  idleUnits: number
  maintenanceUnits: number
}

export interface YieldDistribution {
  id: string
  poolId: string
  date: string
  yieldDistributed: number
  principalReturned: number
  reserveDelta: number
  onChainHash: string
  activeUnitsContributed: number
  collectionHealthPct: number
}

export interface InvestorPosition {
  poolId: string
  poolName: string
  invested: number
  cashYieldReceived: number
  principalRecovered: number
  outstandingPrincipal: number
  cashYieldPct: number
  tenorMonths: number
  maturityDate: string
  investedAt: string
  nextDistribution: string
}

export interface PoolReport {
  poolId: string
  period: string
  type: 'monthly' | 'quarterly'
  avgCollectionHealth: number
  yieldDistributed: number
  principalReturned: number
  reserveBalance: number
  highlights: string[]
  downloadUrl?: string
  periodData: { period: string; yield: number; principal: number; reserve: number }[]
}

export interface PoolImpact {
  poolId: string
  co2SavedKg: number
  petrolEquivalentLiters: number
  totalKmEV: number
  driversSupported: number
  economicValueIDR: number
}

export interface ReturnCalculation {
  investedIDRX: number
  performancePct: number
  tenorMonths: number
  monthlyCashYieldIDRX: number
  monthlyPrincipalRecoveryIDRX: number
  annualCashYieldIDRX: number
  annualPrincipalRecoveryIDRX: number
  annualCashDistributionIDRX: number
  remainingPrincipalAfterYearOne: number
  maturitySettlementIDRX: number
  cashYieldPct: number
  principalRecoveryPct: number
  totalAnnualCashDistributionPct: number
  principalSchedule: { month: number; outstandingPrincipal: number }[]
}
