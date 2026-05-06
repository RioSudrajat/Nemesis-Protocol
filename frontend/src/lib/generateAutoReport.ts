import { StakingPool, YieldDistribution, PoolReport } from "@/types/fi";
import { formatIDRXFull, formatNumber } from "./yield";

export function generateAutoReport(
  pool: StakingPool, 
  distribution: YieldDistribution, 
  period: string, // e.g. "2026-04"
  fleetStats: { totalKm: number; maintenanceEvents: number }
): PoolReport {
  
  const utilizationPct = Math.round((distribution.activeUnitsContributed / pool.unitCount) * 100);
  
  const [year, month] = period.split("-");
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
  const monthName = dateObj.toLocaleDateString("en-US", { month: "long" });

  const autoNarrative = `${monthName} ${year} — ${distribution.activeUnitsContributed} of ${pool.unitCount} units active (${utilizationPct}% utilization). Total fleet distance: ${formatNumber(fleetStats.totalKm)} km. Collection rate: ${distribution.collectionHealthPct.toFixed(1)}%. Investor distributions totaled ${formatIDRXFull(distribution.yieldDistributed)} in yield and ${formatIDRXFull(distribution.principalReturned)} in principal recovery. ${fleetStats.maintenanceEvents} units underwent scheduled maintenance.`;

  return {
    id: `rep-${pool.id}-${period}`,
    poolId: pool.id,
    period,
    type: "monthly",
    avgCollectionHealth: distribution.collectionHealthPct,
    yieldDistributed: distribution.yieldDistributed,
    principalReturned: distribution.principalReturned,
    reserveBalance: 0, // This would normally be calculated from previous reserve + reserveDelta
    activeUnits: distribution.activeUnitsContributed,
    totalKm: fleetStats.totalKm,
    maintenanceEvents: fleetStats.maintenanceEvents,
    autoNarrative,
    isPublished: false,
    editedByOperator: false,
    highlights: [],
    periodData: []
  };
}
