import type { OperatorType } from '@/types/fi'

interface OperatorPoolBadgeProps {
  type: OperatorType
  className?: string
}

const BADGE_CONFIG: Record<OperatorType, { label: string }> = {
  nemesis_native: {
    label: 'Native Operator',
  },
  verified_partner: {
    label: 'Verified Partner',
  },
  independent: {
    label: 'Independent',
  },
}

export function OperatorPoolBadge({ type, className = '' }: OperatorPoolBadgeProps) {
  const cfg = BADGE_CONFIG[type]
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/62 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-teal-300/80 shadow-[0_0_10px_rgba(94,234,212,0.28)]" />
      {cfg.label}
    </span>
  )
}
