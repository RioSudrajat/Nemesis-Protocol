export const NEMESIS_PROTOCOL = {
  name: "Nemesis Protocol",
  positioning: "DePIN for productive EV infrastructure assets",
  thesis:
    "Nemesis turns productive EV infrastructure into investable, telemetry-verified, cashflow-generating on-chain products.",
  phaseOne:
    "36-month rent-to-own mobility credit pools for ride-hailing, delivery, and cargo EV bikes.",
  primaryCta: { label: "Explore FI Pools", href: "/fi" },
  operatorCta: { label: "Onboard Infrastructure", href: "/rwa/operator" },
} as const;

export const PHASE_ONE_FINANCIALS = {
  capexPerUnit: 25_000_000,
  monthlyGrossCollection: 1_500_000,
  principalRecoveryPct: 45,
  investorYieldPct: 20,
  maintenanceReservePct: 10,
  defaultReservePct: 5,
  operatorBaseFeePct: 8,
  operatorPerformanceFeePct: 2,
  protocolFeePct: 10,
  cashYieldPct: 14.4,
  annualPrincipalRecoveryPct: 32.4,
  totalAnnualCashDistributionPct: 46.8,
  tenorMonths: 36,
} as const;
