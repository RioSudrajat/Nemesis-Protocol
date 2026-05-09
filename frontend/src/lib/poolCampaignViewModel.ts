import type { RegisteredVehicle } from "@/types/rwa";
import type { PoolStatus, StakingPool } from "@/types/fi";

const FALLBACK_POOL_IMAGES = [
  "/ev_fleet_jakarta_1777118073477.png",
  "/ev_ridehailing_surabaya_1777118125456.png",
  "/ev_logistics_bandung_1777118107682.png",
  "/ev_fleet_tangerang_1777118150818.png",
];

const STATUS_LABEL: Record<PoolStatus, string> = {
  pending_approval: "Needs review",
  upcoming: "Coming soon",
  active: "Open",
  filled: "Filled",
  closed: "Closed",
};

export type PoolCampaignMode = "fi" | "earn" | "admin";

export interface PoolCampaignViewModel {
  id: string;
  href: string;
  image: string;
  name: string;
  productLabel: string;
  operator: string;
  region: string;
  status: PoolStatus;
  statusLabel: string;
  description: string;
  cashYield: string;
  principalRecovery: string;
  tenor: string;
  unitCount: number;
  supplied: number;
  target: number;
  fillPct: number;
  minInvestment: number;
  tags: string[];
  proofLabel: string;
  energyPointsEligible: boolean;
}

export function getPublicPools(pools: StakingPool[]) {
  return pools.filter((pool) => pool.status === "active" || pool.status === "filled" || pool.status === "upcoming");
}

export function getPoolImage(pool: StakingPool, index = 0) {
  if (pool.imageUrl && !pool.imageUrl.startsWith("/images/pool-")) return pool.imageUrl;
  return FALLBACK_POOL_IMAGES[index % FALLBACK_POOL_IMAGES.length];
}

export function getPoolRegion(locationLabel?: string) {
  return locationLabel?.split(",")[0]?.trim() || "Indonesia";
}

export function getPoolFillPct(pool: Pick<StakingPool, "totalSupplied" | "targetSupply">) {
  if (!pool.targetSupply) return 0;
  return Math.min(100, Math.round((pool.totalSupplied / pool.targetSupply) * 100));
}

export function buildPoolCampaignViewModel(
  pool: StakingPool,
  options?: { index?: number; linkedAssets?: RegisteredVehicle[] }
): PoolCampaignViewModel {
  const linkedAssets = options?.linkedAssets ?? [];
  const unitCount = linkedAssets.length || pool.unitCount || 0;
  return {
    id: pool.id,
    href: `/fi/pools/${pool.id}`,
    image: getPoolImage(pool, options?.index ?? 0),
    name: pool.name,
    productLabel: pool.productLabel,
    operator: pool.managedBy,
    region: getPoolRegion(pool.locationLabel),
    status: pool.status,
    statusLabel: STATUS_LABEL[pool.status],
    description: pool.description,
    cashYield: `${pool.cashYieldPct}%`,
    principalRecovery: `${pool.principalRecoveryPct}%`,
    tenor: `${pool.tenorMonths} mo`,
    unitCount,
    supplied: pool.totalSupplied,
    target: pool.targetSupply,
    fillPct: getPoolFillPct(pool),
    minInvestment: pool.minInvestment,
    tags: pool.tags ?? [],
    proofLabel: pool.proofStatus === "verified" ? "Proof verified" : "Proof review",
    energyPointsEligible: pool.energyPointsEligible,
  };
}

export function getStatusTone(status: PoolStatus) {
  if (status === "active") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (status === "filled") return "bg-zinc-950 text-white border-zinc-950";
  if (status === "upcoming") return "bg-amber-50 text-amber-700 border-amber-100";
  if (status === "pending_approval") return "bg-blue-50 text-blue-700 border-blue-100";
  return "bg-zinc-100 text-zinc-600 border-zinc-200";
}
