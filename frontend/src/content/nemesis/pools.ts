import { PHASE_ONE_FINANCIALS } from "./protocol";

export const POOL_PRODUCTS = [
  {
    id: "mobility_credit",
    label: "Mobility Credit Pool",
    phase: "Phase 1",
    description:
      "36-month rent-to-own pool for productive ride-hailing, delivery, and cargo EV bikes.",
  },
  {
    id: "fleet_remittance",
    label: "Fleet Remittance Pool",
    phase: "Phase 1B",
    description:
      "Contracted remittance pool for taxis, vans, shuttles, buses, and larger B2B fleets.",
  },
  {
    id: "charging_yield",
    label: "Charging Yield Pool",
    phase: "Future",
    description: "Metered infrastructure yield model for charging and swap station assets.",
  },
  {
    id: "energy_yield",
    label: "Energy Yield Pool",
    phase: "Future",
    description: "Revenue-share model for solar, storage, and exportable depot energy assets.",
  },
] as const;

export const PHASE_ONE_POOL_ASSUMPTIONS = {
  ...PHASE_ONE_FINANCIALS,
  monthlyInvestorYieldPerUnit: 300_000,
  monthlyPrincipalRecoveryPerUnit: 675_000,
  monthlyMaintenanceReservePerUnit: 150_000,
  monthlyDefaultReservePerUnit: 75_000,
  monthlyOperatorBaseFeePerUnit: 120_000,
  monthlyOperatorPerformanceFeePerUnit: 30_000,
  monthlyProtocolFeePerUnit: 150_000,
} as const;
