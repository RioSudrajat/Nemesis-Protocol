'use client'

import type { ReactNode } from 'react'
import { CheckCircle2, Clock3, ExternalLink, ShieldCheck, Wrench } from 'lucide-react'
import { MaintenanceFundTracker } from '@/components/rwa/MaintenanceFundTracker'
import { MOCK_VEHICLES } from '@/data/vehicles'
import type { MaintenanceFundEntry } from '@/types/rwa'
import { formatIDRX } from '@/lib/yield'

const MOCK_FUND_LOG: MaintenanceFundEntry[] = [
  {
    id: 'mf-001', vehicleId: 'vhc-0042', unitId: '#NMS-0042',
    type: 'release', amount: 180000, triggeredAtKm: 7500,
    workshopId: 'ws-001', workshopName: 'Bengkel Mitra JKT-01',
    serviceProofHash: '4xPq2...mR9k', serviceType: 'Tire Replacement',
    status: 'released', timestamp: '2026-04-10T08:30:00.000Z',
  },
  {
    id: 'mf-002', vehicleId: 'vhc-0018', unitId: '#NMS-0018',
    type: 'release', amount: 150000, triggeredAtKm: 20000,
    workshopId: 'ws-002', workshopName: 'Workshop Nemesis',
    serviceProofHash: '7yRn5...vL2m', serviceType: 'Routine Service',
    status: 'released', timestamp: '2026-04-08T10:00:00.000Z',
  },
  {
    id: 'mf-003', vehicleId: 'vhc-0055', unitId: '#NMS-0055',
    type: 'release', amount: 95000, triggeredAtKm: 5000,
    workshopId: 'ws-001', workshopName: 'Bengkel Mitra JKT-01',
    serviceType: 'Routine Service',
    status: 'pending', timestamp: '2026-04-20T14:00:00.000Z',
  },
  {
    id: 'mf-004', vehicleId: 'vhc-0001', unitId: '#NMS-0001',
    type: 'release', amount: 210000, triggeredAtKm: 12500,
    serviceType: 'Brake Service',
    status: 'pending', timestamp: '2026-04-22T09:00:00.000Z',
  },
  {
    id: 'mf-005', vehicleId: 'vhc-0073', unitId: '#NMS-0073',
    type: 'deposit', amount: 18200,
    status: 'confirmed', timestamp: '2026-03-15T00:00:00.000Z',
  },
]

const SERVICE_PROOF_LOG = [
  { date: '2026-04-10', unit: '#NMS-0042', service: 'Tire Replacement', workshop: 'Bengkel Mitra JKT-01', cost: 180000, status: 'Released', hash: '4xPq2...mR9k' },
  { date: '2026-04-08', unit: '#NMS-0018', service: 'Routine Service', workshop: 'Workshop Nemesis', cost: 150000, status: 'Released', hash: '7yRn5...vL2m' },
  { date: '2026-04-20', unit: '#NMS-0055', service: 'Routine Service', workshop: 'Bengkel Mitra JKT-01', cost: 95000, status: 'Pending', hash: '—' },
  { date: '2026-04-22', unit: '#NMS-0001', service: 'Brake Service', workshop: 'TBD', cost: 210000, status: 'Pending', hash: '—' },
  { date: '2026-03-15', unit: '#NMS-0073', service: 'Reserve Deposit', workshop: '—', cost: 18200, status: 'Confirmed', hash: '2zA1p...xQ8w' },
]

const totalReserve = MOCK_VEHICLES.reduce((sum, vehicle) => sum + vehicle.maintenanceFundBalance, 0)
const pendingCount = MOCK_FUND_LOG.filter((entry) => entry.status === 'pending').length
const verifiedServices = MOCK_FUND_LOG.filter((entry) => entry.status === 'released').length
const overdueUnits = MOCK_VEHICLES.filter((vehicle) => vehicle.odometer >= vehicle.nextServiceKm).length

const STATUS_STYLE: Record<string, { className: string; dotClass: string; label: string }> = {
  Released: {
    className: 'border-white/[0.08] bg-white/[0.04] text-white/70',
    dotClass: 'bg-teal-300',
    label: 'Released',
  },
  Pending: {
    className: 'border-white/[0.08] bg-white/[0.04] text-amber-100/82',
    dotClass: 'bg-amber-300',
    label: 'Pending',
  },
  Confirmed: {
    className: 'border-white/[0.08] bg-white/[0.035] text-white/58',
    dotClass: 'bg-white/35',
    label: 'Confirmed',
  },
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-[28px] border border-white/[0.075] bg-[#070808]/88 shadow-[0_24px_80px_rgba(0,0,0,0.34)] ${className}`}
    >
      {children}
    </section>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
      {children}
    </p>
  )
}

export default function MaintenancePage() {
  const stats = [
    {
      label: 'Maintenance Reserve',
      value: formatIDRX(totalReserve),
      detail: `Across ${MOCK_VEHICLES.length} units`,
      icon: ShieldCheck,
    },
    {
      label: 'Pending Proof Releases',
      value: `${pendingCount}`,
      detail: 'Awaiting workshop confirmation',
      icon: Clock3,
    },
    {
      label: 'Verified Services',
      value: `${verifiedServices}`,
      detail: 'Released this cycle',
      icon: CheckCircle2,
    },
    {
      label: 'Overdue Units',
      value: `${overdueUnits}`,
      detail: 'Need return-to-service review',
      icon: Wrench,
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Proof of Maintenance</Eyebrow>
          <h1
            className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl"
            style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}
          >
            Maintenance & Proof Review
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/52">
            Review maintenance reserve coverage, workshop proof status, pending releases, and
            return-to-service readiness across the operator fleet.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/54">
          <ShieldCheck className="h-4 w-4 text-teal-100/80" />
          Reserve-backed service layer
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
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

      <Panel className="p-5 sm:p-6">
        <div className="mb-6">
          <Eyebrow>Reserve status</Eyebrow>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
            Unit maintenance coverage
          </h2>
        </div>
        <MaintenanceFundTracker vehicles={MOCK_VEHICLES} fundLog={MOCK_FUND_LOG} />
      </Panel>

      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] p-5 lg:p-6">
          <div>
            <Eyebrow>Service proof log</Eyebrow>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              Workshop proof and reserve releases
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto [scrollbar-color:rgba(148,163,184,0.28)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-white/[0.07] text-[11px] uppercase tracking-[0.18em] text-white/36">
              <tr>
                {['Date', 'Unit', 'Service', 'Workshop', 'Cost', 'Status', 'Proof hash'].map((header) => (
                  <th key={header} className="px-5 py-4 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {SERVICE_PROOF_LOG.map((row) => {
                const status = STATUS_STYLE[row.status] ?? STATUS_STYLE.Pending
                return (
                  <tr key={`${row.date}-${row.unit}-${row.service}`} className="text-white/72 transition hover:bg-white/[0.035]">
                    <td className="px-5 py-4 text-xs text-white/42">{row.date}</td>
                    <td className="px-5 py-4 font-mono text-xs font-bold text-teal-100">{row.unit}</td>
                    <td className="px-5 py-4 text-sm font-medium text-white/76">{row.service}</td>
                    <td className="px-5 py-4 text-xs text-white/48">{row.workshop}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-white/76">{formatIDRX(row.cost)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {row.hash !== '—' ? (
                        <button className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-teal-100/78 transition hover:text-teal-50">
                          {row.hash} <ExternalLink className="h-3 w-3" />
                        </button>
                      ) : (
                        <span className="text-xs text-white/30">Pending</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
