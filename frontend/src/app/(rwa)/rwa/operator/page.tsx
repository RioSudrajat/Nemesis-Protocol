'use client'

import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Gauge,
  Map,
  Plus,
  RadioTower,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import { MOCK_VEHICLES } from '@/data/vehicles'
import { MOCK_OPERATOR_PROFILE } from '@/data/operators'
import { OperatorPoolBadge } from '@/components/rwa/OperatorPoolBadge'
import { formatKm } from '@/lib/yield'
import { getHealthColor } from '@/lib/health'

const PROOF_READINESS = [
  { label: 'Proof of Asset', value: '100%', detail: '100 registered units', status: 'Verified' },
  { label: 'Proof of Activity', value: '91%', detail: 'Route logs synced today', status: 'Live' },
  { label: 'Proof of Revenue', value: '88%', detail: 'IDRX remittance matched', status: 'Audited' },
  { label: 'Proof of Maintenance', value: '74%', detail: '2 units need review', status: 'Action needed' },
]

const OPERATION_EVENTS = [
  { label: 'Telemetry attached', detail: '#NMS-0073 joined the Jakarta mobility credit pool', time: '18 min ago' },
  { label: 'Maintenance flagged', detail: '#NMS-0042 tire wear exceeded the risk threshold', time: '2 hr ago' },
  { label: 'Cash distribution queued', detail: '192,000 IDRX scheduled for pool participants', time: '6 hr ago' },
  { label: 'Activity proof updated', detail: '#NMS-0018 submitted a verified route log hash', time: '1 day ago' },
]

const RISK_QUEUE = [
  {
    unitId: '#NMS-0042',
    severity: 'Critical',
    message: 'Uneven rear tire wear',
    action: 'Send to workshop within 14 days',
    confidence: 87,
  },
  {
    unitId: '#NMS-0018',
    severity: 'Watchlist',
    message: 'Battery efficiency down 12%',
    action: 'Monitor next 7 daily route logs',
    confidence: 72,
  },
]

const STATUS_LABEL: Record<string, { label: string; color: string; proof: string; risk: string }> = {
  active: { label: 'Active', color: '#5EEAD4', proof: 'Route proof live', risk: 'Low' },
  maintenance: { label: 'Maintenance', color: '#FCD34D', proof: 'Service proof pending', risk: 'High' },
  idle: { label: 'Idle', color: '#A1A1AA', proof: 'No route log', risk: 'Medium' },
  offline: { label: 'Offline', color: '#FCA5A5', proof: 'Telemetry offline', risk: 'High' },
}

function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-[28px] border border-white/[0.075] bg-[#070808]/88 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  )
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
      {children}
    </p>
  )
}

export default function OperatorOverviewPage() {
  const previewVehicles = MOCK_VEHICLES.slice(0, 5)
  const averageHealth = Math.round(
    MOCK_VEHICLES.reduce((total, vehicle) => total + vehicle.healthScore, 0) / MOCK_VEHICLES.length,
  )
  const maintenanceRiskCount = MOCK_VEHICLES.filter(
    (vehicle) => vehicle.status === 'maintenance' || vehicle.healthScore < 80,
  ).length

  const commandStats = [
    {
      label: 'Registered fleet',
      value: `${MOCK_OPERATOR_PROFILE.totalVehicles}`,
      detail: `Pool ${MOCK_OPERATOR_PROFILE.poolId}`,
      icon: RadioTower,
    },
    {
      label: 'Active today',
      value: `${MOCK_OPERATOR_PROFILE.activeVehicles}`,
      detail: '83% route-log coverage',
      icon: Activity,
    },
    {
      label: 'Proof readiness',
      value: '88%',
      detail: '4-proof framework',
      icon: ShieldCheck,
    },
    {
      label: 'Fleet health',
      value: `${averageHealth}/100`,
      detail: `${maintenanceRiskCount} unit${maintenanceRiskCount === 1 ? '' : 's'} need review`,
      icon: Gauge,
    },
  ]

  return (
    <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#020303] p-4 text-white shadow-[0_30px_120px_rgba(0,0,0,0.58)] sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(45,212,191,0.055),transparent_30%),radial-gradient(circle_at_86%_0%,rgba(45,212,191,0.04),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <OperatorPoolBadge type={MOCK_OPERATOR_PROFILE.type} />
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                KYC verified
              </span>
              <span className="text-xs text-white/45">{MOCK_OPERATOR_PROFILE.city}</span>
            </div>
            <SectionEyebrow>Operator command center</SectionEyebrow>
            <h1
              className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}
            >
              {MOCK_OPERATOR_PROFILE.businessName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              Monitor fleet readiness, proof coverage, maintenance risk, and funding eligibility
              from one operational control layer.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/rwa/operator/mint"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-200/30 bg-[#0B0F0E] px-5 py-3 text-sm font-bold text-teal-100 shadow-[0_18px_38px_rgba(0,0,0,0.28)] transition hover:border-teal-200/55 hover:bg-[#101817]"
            >
              <Plus className="h-4 w-4" />
              Register Asset
            </Link>
            <Link
              href="/rwa/operator/analytics"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/82 transition hover:border-teal-200/40 hover:text-teal-100"
            >
              Open Analytics
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {commandStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/[0.075] bg-[#080A0A] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">
                    {stat.label}
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.035] p-2 text-teal-200/80">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="text-3xl font-semibold tracking-[-0.045em] text-white">{stat.value}</div>
                <p className="mt-2 text-xs text-white/45">{stat.detail}</p>
              </div>
            )
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.35fr]">
          <Panel className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <SectionEyebrow>Funding readiness</SectionEyebrow>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Proof stack
                </h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-semibold text-teal-100/90">
                88% ready
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {PROOF_READINESS.map((proof) => (
                <div key={proof.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white/88">{proof.label}</p>
                      <p className="text-xs text-white/42">{proof.detail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white/82">{proof.value}</p>
                      <p className="text-[11px] text-white/36">{proof.status}</p>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-400/85 to-teal-200/65"
                      style={{ width: proof.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] p-6">
              <div>
                <SectionEyebrow>Fleet operations</SectionEyebrow>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Live unit preview
                </h2>
              </div>
              <Link
                href="/rwa/operator/fleet"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-100 transition hover:text-teal-50"
              >
                View Fleet <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto [scrollbar-color:rgba(148,163,184,0.28)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25">
              <table className="w-full min-w-[720px] text-left">
                <thead className="border-b border-white/[0.07] text-[11px] uppercase tracking-[0.18em] text-white/36">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Unit</th>
                    <th className="px-4 py-4 font-semibold">Status</th>
                    <th className="px-4 py-4 font-semibold">Health</th>
                    <th className="px-4 py-4 font-semibold">Odometer</th>
                    <th className="px-4 py-4 font-semibold">Proof signal</th>
                    <th className="px-6 py-4 font-semibold">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {previewVehicles.map((vehicle) => {
                    const status = STATUS_LABEL[vehicle.status] ?? STATUS_LABEL.offline
                    const healthColor = getHealthColor(vehicle.healthScore)
                    return (
                      <tr key={vehicle.id} className="text-sm text-white/72 transition hover:bg-white/[0.035]">
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs font-bold text-teal-100">{vehicle.unitId}</div>
                          <div className="mt-1 text-xs text-white/36">
                            {vehicle.brand} {vehicle.model}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                            style={{
                              borderColor: `${status.color}3D`,
                              background: `${status.color}14`,
                              color: status.color,
                            }}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-8 text-xs font-bold" style={{ color: healthColor }}>
                              {vehicle.healthScore}
                            </span>
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.08]">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${vehicle.healthScore}%`, background: healthColor }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs text-white/50">{formatKm(vehicle.odometer)}</td>
                        <td className="px-4 py-4 text-xs text-white/54">{status.proof}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-white/62">{status.risk}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Panel className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <SectionEyebrow>Operational timeline</SectionEyebrow>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Event stream
                </h2>
              </div>
              <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/45">
                Live mock
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {OPERATION_EVENTS.map((event) => (
                <div key={`${event.label}-${event.time}`} className="flex gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-teal-100/85">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 border-b border-white/[0.06] pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white/86">{event.label}</p>
                      <span className="text-xs text-white/36">{event.time}</span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-white/48">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <SectionEyebrow>Risk queue</SectionEyebrow>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                  Maintenance intelligence
                </h2>
              </div>
              <Link
                href="/rwa/operator/maintenance"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-100 transition hover:text-teal-50"
              >
                Review <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {RISK_QUEUE.map((risk) => (
                <div
                key={risk.unitId}
                  className="rounded-2xl border border-white/[0.075] bg-[#090B0B] p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CircleAlert className="h-4 w-4 text-amber-200" />
                      <span className="font-mono text-xs font-bold text-teal-100">{risk.unitId}</span>
                    </div>
                    <span className="rounded-full border border-amber-200/20 bg-amber-200/10 px-2.5 py-1 text-[11px] font-semibold text-amber-100">
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white/86">{risk.message}</p>
                  <p className="mt-1 text-xs leading-5 text-white/44">{risk.action}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-white/34">Model confidence</span>
                    <span className="font-semibold text-white/68">{risk.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel className="p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <SectionEyebrow>Command actions</SectionEyebrow>
              <p className="mt-2 text-sm text-white/52">
                Move from proof readiness into fleet operations, maintenance review, or pool analytics.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/rwa/operator/mint"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-200/30 bg-[#0B0F0E] px-4 py-3 text-sm font-bold text-teal-100 transition hover:border-teal-200/55 hover:bg-[#101817]"
              >
                <Plus className="h-4 w-4" />
                Register Asset
              </Link>
              <Link
                href="/rwa/operator/fleet"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/76 transition hover:border-teal-200/35 hover:text-teal-100"
              >
                <Map className="h-4 w-4" />
                View Fleet
              </Link>
              <Link
                href="/rwa/operator/maintenance"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/76 transition hover:border-teal-200/35 hover:text-teal-100"
              >
                <Wrench className="h-4 w-4" />
                Review Maintenance
              </Link>
              <Link
                href="/rwa/operator/analytics"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/76 transition hover:border-teal-200/35 hover:text-teal-100"
              >
                <TrendingUp className="h-4 w-4" />
                Open Analytics
              </Link>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
