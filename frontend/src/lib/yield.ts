import type { StakingPool, ReturnCalculation } from '@/types/fi'

/**
 * Calculate projected cash distribution for a Nemesis FI pool.
 * This is intentionally split between yield and principal recovery so it is
 * never presented as pure yield.
 */
export function calculateReturn(
  pool: StakingPool,
  investedIDRX: number,
  performancePct: number
): ReturnCalculation {
  const performanceFactor = Math.max(0, Math.min(performancePct, 120)) / 100
  const monthlyCashYieldIDRX = Math.round((investedIDRX * (pool.cashYieldPct / 100) * performanceFactor) / 12)
  const monthlyPrincipalRecoveryIDRX = Math.round((investedIDRX * (pool.principalRecoveryPct / 100) * performanceFactor) / 12)
  const annualCashYieldIDRX = monthlyCashYieldIDRX * 12
  const annualPrincipalRecoveryIDRX = monthlyPrincipalRecoveryIDRX * 12
  const annualCashDistributionIDRX = annualCashYieldIDRX + annualPrincipalRecoveryIDRX
  const remainingPrincipalAfterYearOne = Math.max(0, investedIDRX - annualPrincipalRecoveryIDRX)

  const principalSchedule = Array.from({ length: Math.min(pool.tenorMonths, 36) }, (_, i) => {
    const month = i + 1
    return {
      month,
      outstandingPrincipal: Math.max(0, investedIDRX - monthlyPrincipalRecoveryIDRX * month),
    }
  })

  return {
    investedIDRX,
    performancePct,
    tenorMonths: pool.tenorMonths,
    monthlyCashYieldIDRX,
    monthlyPrincipalRecoveryIDRX,
    annualCashYieldIDRX,
    annualPrincipalRecoveryIDRX,
    annualCashDistributionIDRX,
    remainingPrincipalAfterYearOne,
    maturitySettlementIDRX: principalSchedule.at(-1)?.outstandingPrincipal ?? investedIDRX,
    cashYieldPct: Math.round(pool.cashYieldPct * performanceFactor * 10) / 10,
    principalRecoveryPct: Math.round(pool.principalRecoveryPct * performanceFactor * 10) / 10,
    totalAnnualCashDistributionPct: Math.round(pool.totalAnnualCashDistributionPct * performanceFactor * 10) / 10,
    principalSchedule,
  }
}

/** Format IDRX number as Rupiah string */
export function formatIDRX(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('IDR', 'IDRX')
}

/** Format number with Indonesian locale */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('id-ID').format(n)
}

/** Format km — full number, no abbreviations */
export function formatKm(km: number): string {
  return `${formatNumber(km)} km`
}

/** Format IDRX amount — full number, no abbreviations. Example: 2.400.000.000 IDRX */
export function formatIDRXFull(amount: number): string {
  return `${formatNumber(amount)} IDRX`
}

/** Format Rupiah amount — full, no abbreviation. Example: Rp 50.000 */
export function formatRupiah(amount: number): string {
  return `Rp ${formatNumber(amount)}`
}

/** Truncate wallet address */
export function truncateWallet(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 3) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}
