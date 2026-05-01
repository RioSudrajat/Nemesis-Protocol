// Nemesis Protocol — global constants

export const NEMESIS = {
  name: 'Nemesis Protocol',
  tagline: 'DePIN for productive EV infrastructure assets',
  description: 'Protocol layer for productive EV infrastructure assets that generate measurable activity, verified cashflows, and financing-ready proof data.',
  chain: 'Solana',
  yieldCurrency: 'IDRX',
  protocolToken: '$NMS',
  tokenLaunchTarget: '2027',
  hackathon: 'Colosseum Frontier 2026',
  twitter: 'https://twitter.com/nemesisprotocol',
  telegram: 'https://t.me/nemesisprotocol',
  discord: 'https://discord.gg/nemesisprotocol',
} as const

export const SUB_PRODUCTS = {
  depin: {
    name: 'Nemesis DePIN',
    slug: 'depin',
    description: 'Lapisan data & aktivitas — GPS verifikasi on-chain untuk seluruh armada EV produktif',
    path: '/depin',
    color: '#5EEAD4',
    icon: 'Activity',
  },
  fi: {
    name: 'Nemesis FI',
    slug: 'fi',
    description: 'Financing layer for mobility credit pools, fleet remittance pools, and future infrastructure yield pools',
    path: '/fi',
    color: '#34D399',
    icon: 'TrendingUp',
  },
  rwa: {
    name: 'Nemesis RWA',
    slug: 'rwa',
    description: 'Asset onboarding layer for productive EV infrastructure and proof readiness',
    path: '/rwa',
    color: '#60A5FA',
    icon: 'Layers',
  },
} as const

export const FINANCED_COST_PER_EV_BIKE_IDRX = 25_000_000
export const FLAT_FEE_DAILY_IDR = 50_000            // IDR — default rent fee
export const MAINTENANCE_FUND_PCT = 0.10
export const DEFAULT_RESERVE_PCT = 0.05
export const PROTOCOL_FEE_PCT = 0.10
export const FLEET_MANAGER_FEE_PCT = 0.10

export const MAINTENANCE_THRESHOLDS_KM = [2500, 5000, 10000, 20000] as const

export const NODE_SCORE_TIERS = {
  premium: { min: 80, label: 'Premium', color: '#86EFAC' },
  standard: { min: 50, label: 'Standard', color: '#5EEAD4' },
  flagged: { min: 0, label: 'Ditandai', color: '#FCA5A5' },
} as const

export const POOL_OPERATOR_LABELS: Record<string, string> = {
  nemesis_native: 'Nemesis Native',
  verified_partner: 'Partner Terverifikasi',
  independent: 'Independent',
}

export const FLEET_CATEGORY_LABELS: Record<string, string> = {
  ojol: 'Ojol / Ride-hailing',
  kurir: 'Kurir / Delivery',
  logistik: 'Logistik Last-mile',
  korporat: 'Armada Korporat',
}

export const VEHICLE_TYPE_LABELS: Record<string, string> = {
  motor_listrik: 'Motor Listrik',
  motor_kargo: 'Motor Kargo Listrik',
  mobil_listrik: 'Mobil Listrik',
  van_listrik: 'Van Listrik',
  truk_listrik: 'Truk Listrik',
  bus_listrik: 'Bus Listrik',
  pikap_listrik: 'Pikap Listrik',
}

export const CITIES = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Yogyakarta'] as const

export const DISTRIBUTION_CADENCE = 'Periodic monthly distribution'

export const SOLANA_EXPLORER_BASE = 'https://explorer.solana.com/tx'
