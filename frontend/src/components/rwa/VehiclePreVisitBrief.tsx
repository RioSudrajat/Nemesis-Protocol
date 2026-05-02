import type { RegisteredVehicle } from '@/types/rwa'
import { formatIDRX, formatKm } from '@/lib/yield'
import { getHealthColor, getHealthLabel } from '@/lib/health'
import { VEHICLE_TYPE_LABELS, FLEET_CATEGORY_LABELS } from '@/constants/nemesis'

interface ServiceHistoryItem {
  date: string
  type: string
  km: number
  cost: number
  workshop: string
}

interface VehiclePreVisitBriefProps {
  vehicle: RegisteredVehicle
  serviceHistory?: ServiceHistoryItem[]
}

const MOCK_PREDICTIONS = [
  { label: 'Rear tire', detail: 'Uneven wear detected', severity: 'critical' as const, eta: '14 days' },
  { label: 'Battery', detail: 'Efficiency down 8%', severity: 'warning' as const, eta: '30 days' },
  { label: 'Brake light', detail: 'Condition normal', severity: 'info' as const, eta: 'N/A' },
]

const SEV_COLOR = { critical: '#FCA5A5', warning: '#FCD34D', info: '#5EEAD4' }
const SEV_LABEL = { critical: 'Critical', warning: 'Watchlist', info: 'Normal' }

function HealthBar({ label, value }: { label: string; value: number }) {
  const color = getHealthColor(value)
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-20 shrink-0 capitalize" style={{ color: 'var(--solana-text-muted)' }}>
        {label === 'rem' ? 'Brake' : label === 'ban' ? 'Tires' : label === 'baterai' ? 'Battery' : 'Lights'}
      </span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: '#86EFAC' },
  maintenance: { label: 'Maintenance', color: '#FCD34D' },
  idle: { label: 'Idle', color: '#A1A1AA' },
  offline: { label: 'Offline', color: '#FCA5A5' },
}

export function VehiclePreVisitBrief({ vehicle: v, serviceHistory }: VehiclePreVisitBriefProps) {
  const healthColor = getHealthColor(v.healthScore)
  const statusCfg = STATUS_LABEL[v.status] ?? STATUS_LABEL.offline

  const mockHistory: ServiceHistoryItem[] = serviceHistory ?? [
    { date: '2026-03-10', type: 'Routine Service', km: v.lastServiceKm, cost: 150000, workshop: 'Bengkel Mitra JKT-01' },
    { date: '2026-01-22', type: 'Tire Replacement', km: Math.max(0, v.lastServiceKm - 3000), cost: 320000, workshop: 'Workshop Nemesis' },
    { date: '2025-12-05', type: 'Battery Check', km: Math.max(0, v.lastServiceKm - 6000), cost: 80000, workshop: 'Bengkel Mitra JKT-02' },
  ]

  const estServiceCost = 180000

  return (
    <div className="overflow-hidden rounded-[24px] border border-white/[0.075] bg-[#070808]">
      {/* Header */}
      <div
        className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.07] bg-white/[0.025] p-5"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xl font-bold text-teal-100">{v.unitId}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${statusCfg.color}20`, color: statusCfg.color, border: `1px solid ${statusCfg.color}40` }}
            >
              {statusCfg.label}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--solana-text-muted)' }}>
            {v.brand} {v.model} · {VEHICLE_TYPE_LABELS[v.type] ?? v.type} · {FLEET_CATEGORY_LABELS[v.category] ?? v.category}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs" style={{ color: 'var(--solana-text-muted)' }}>Odometer</div>
          <div className="font-bold text-lg">{formatKm(v.odometer)}</div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Score */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--solana-text-muted)' }}>
            Health Score
          </h4>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 font-bold text-2xl"
              style={{
                background: `${healthColor}15`,
                border: `2px solid ${healthColor}60`,
                color: healthColor,
                boxShadow: `0 0 20px ${healthColor}25`,
              }}
            >
              {v.healthScore}
            </div>
            <div>
              <div className="font-semibold" style={{ color: healthColor }}>{getHealthLabel(v.healthScore)}</div>
              <div className="text-xs" style={{ color: 'var(--solana-text-muted)' }}>Node Score: {v.nodeScore}/100</div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {Object.entries(v.healthBreakdown).map(([key, val]) => (
              <HealthBar key={key} label={key} value={val} />
            ))}
          </div>
        </div>

        {/* Predictive Maintenance */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--solana-text-muted)' }}>
            Predictive Maintenance
          </h4>
          <div className="flex flex-col gap-2">
            {MOCK_PREDICTIONS.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: `${SEV_COLOR[p.severity]}10`,
                  border: `1px solid ${SEV_COLOR[p.severity]}30`,
                }}
              >
                <div>
                  <div className="text-sm font-semibold">{p.label}</div>
                  <div className="text-xs" style={{ color: 'var(--solana-text-muted)' }}>{p.detail}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold" style={{ color: SEV_COLOR[p.severity] }}>{SEV_LABEL[p.severity]}</div>
                  <div className="text-xs" style={{ color: 'var(--solana-text-muted)' }}>ETA: {p.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service History */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--solana-text-muted)' }}>
            Service History
          </h4>
          <div className="flex flex-col gap-2">
            {mockHistory.slice(0, 3).map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                  style={{ background: i === 0 ? '#5EEAD4' : 'rgba(255,255,255,0.2)' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{s.type}</div>
                  <div className="text-xs" style={{ color: 'var(--solana-text-muted)' }}>
                    {s.date} · {formatKm(s.km)} · {s.workshop}
                  </div>
                </div>
                <div className="text-xs font-semibold shrink-0" style={{ color: '#5EEAD4' }}>
                  {formatIDRX(s.cost)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Reserve */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--solana-text-muted)' }}>
            Maintenance Reserve
          </h4>
          <div
            className="p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.075)' }}
          >
            <div className="flex justify-between mb-3">
              <span className="text-xs" style={{ color: 'var(--solana-text-muted)' }}>Reserve Balance</span>
              <span className="font-bold" style={{ color: '#5EEAD4' }}>{formatIDRX(v.maintenanceFundBalance)}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-xs" style={{ color: 'var(--solana-text-muted)' }}>Estimated Service Cost</span>
              <span className="font-semibold">{formatIDRX(estServiceCost)}</span>
            </div>
            <div className="h-px my-2" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <div className="flex justify-between">
              <span className="text-xs" style={{ color: 'var(--solana-text-muted)' }}>Balance After Service</span>
              <span
                className="font-bold"
                style={{ color: v.maintenanceFundBalance >= estServiceCost ? '#86EFAC' : '#FCA5A5' }}
              >
                {formatIDRX(v.maintenanceFundBalance - estServiceCost)}
              </span>
            </div>
          </div>

          <div className="mt-3 flex justify-between text-xs" style={{ color: 'var(--solana-text-muted)' }}>
            <span>Last service: {formatKm(v.lastServiceKm)}</span>
            <span>Next service: {formatKm(v.nextServiceKm)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
