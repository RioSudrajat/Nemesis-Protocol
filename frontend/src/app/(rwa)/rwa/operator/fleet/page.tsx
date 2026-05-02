'use client'

import { useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { Activity, MapPinned, RadioTower, Route, Wrench, X } from 'lucide-react'
import { MOCK_VEHICLES } from '@/data/vehicles'
import { MOCK_OPERATOR_PROFILE } from '@/data/operators'
import { VehiclePreVisitBrief } from '@/components/rwa/VehiclePreVisitBrief'
import type { RegisteredVehicle } from '@/types/rwa'
import { formatKm } from '@/lib/yield'
import { getHealthColor } from '@/lib/health'

// Fleet map needs dynamic import because Leaflet depends on browser APIs.
const FleetLeafletMap = dynamic(() => import('@/components/ui/FleetLeafletMap'), { ssr: false })

type StatusFilter = 'all' | 'active' | 'maintenance' | 'idle' | 'offline'

const STATUS_LABEL: Record<string, { label: string; color: string; proof: string; risk: string }> = {
  active: { label: 'Active', color: '#5EEAD4', proof: 'Route proof live', risk: 'Low' },
  maintenance: { label: 'Maintenance', color: '#FCD34D', proof: 'Service proof pending', risk: 'High' },
  idle: { label: 'Idle', color: '#A1A1AA', proof: 'No route log', risk: 'Medium' },
  offline: { label: 'Offline', color: '#FCA5A5', proof: 'Telemetry offline', risk: 'High' },
}

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All units' },
  { key: 'active', label: 'Active' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'idle', label: 'Idle' },
  { key: 'offline', label: 'Offline' },
]

function toFleetVehicle(v: RegisteredVehicle) {
  return {
    id: v.id,
    vin: v.vin,
    name: `${v.brand} ${v.model} ${v.unitId}`,
    region: 'Jakarta',
    health: v.healthScore,
    odometer: v.odometer,
    lastService: `${v.lastServiceKm} km`,
    owner: v.operatorId,
    status: STATUS_LABEL[v.status]?.label ?? 'Offline',
    type: v.type,
    brand: v.brand,
    model: v.model,
  }
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

export default function FleetMapPage() {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [selectedVehicle, setSelectedVehicle] = useState<RegisteredVehicle | null>(null)

  const filtered = filter === 'all' ? MOCK_VEHICLES : MOCK_VEHICLES.filter((v) => v.status === filter)
  const maintenanceQueue = MOCK_VEHICLES.filter((v) => v.status === 'maintenance' || v.healthScore < 80).length
  const idleUnits = MOCK_VEHICLES.filter((v) => v.status === 'idle').length

  const stats = [
    {
      label: 'Registered units',
      value: `${MOCK_OPERATOR_PROFILE.totalVehicles}`,
      detail: `Pool ${MOCK_OPERATOR_PROFILE.poolId}`,
      icon: RadioTower,
    },
    {
      label: 'Active route logs',
      value: `${MOCK_OPERATOR_PROFILE.activeVehicles}`,
      detail: 'Synced in the last 24h',
      icon: Route,
    },
    {
      label: 'Maintenance queue',
      value: `${maintenanceQueue}`,
      detail: 'Requires operator review',
      icon: Wrench,
    },
    {
      label: 'Idle units',
      value: `${idleUnits}`,
      detail: 'No current route log',
      icon: Activity,
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Fleet operations</Eyebrow>
          <h1
            className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl"
            style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}
          >
            Fleet Operations
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/52">
            Monitor vehicle status, route-log coverage, health score, and maintenance risk across
            the operator fleet.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/54">
          <MapPinned className="h-4 w-4 text-teal-100/80" />
          Jakarta operations layer
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

      <Panel className="overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center lg:p-6">
          <div>
            <Eyebrow>Live fleet map</Eyebrow>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              Route and unit status
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/44">
            {['Active', 'Maintenance', 'Idle'].map((label) => {
              const color = label === 'Active' ? '#5EEAD4' : label === 'Maintenance' ? '#FCD34D' : '#A1A1AA'
              return (
                <span key={label} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              )
            })}
          </div>
        </div>
        <div className="h-[360px] border-b border-white/[0.07] bg-[#030404] sm:h-[460px]">
          <FleetLeafletMap vehicles={filtered.map(toFleetVehicle)} />
        </div>
      </Panel>

      <div className="flex flex-wrap gap-2 rounded-[24px] border border-white/[0.07] bg-[#070808] p-2">
        {FILTERS.map((f) => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`relative rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                active
                  ? 'bg-white/[0.06] text-white'
                  : 'text-white/42 hover:bg-white/[0.035] hover:text-white/68'
              }`}
            >
              {active && (
                <span className="absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-teal-300/85" />
              )}
              <span className={active ? 'pl-3' : ''}>{f.label}</span>
            </button>
          )
        })}
      </div>

      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] p-5 lg:p-6">
          <div>
            <Eyebrow>Unit registry</Eyebrow>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              Registered units ({filtered.length})
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto [scrollbar-color:rgba(148,163,184,0.28)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-white/[0.07] text-[11px] uppercase tracking-[0.18em] text-white/36">
              <tr>
                {['Unit', 'Type', 'Status', 'Node score', 'Health', 'Odometer', 'Proof signal', 'Action'].map((h) => (
                  <th key={h} className="px-5 py-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map((vehicle) => {
                const status = STATUS_LABEL[vehicle.status] ?? STATUS_LABEL.offline
                const healthColor = getHealthColor(vehicle.healthScore)
                return (
                  <tr key={vehicle.id} className="text-white/72 transition hover:bg-white/[0.035]">
                    <td className="px-5 py-4">
                      <div className="font-mono text-xs font-bold text-teal-100">{vehicle.unitId}</div>
                      <div className="mt-1 text-xs text-white/36">{vehicle.vin}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-white/76">
                        {vehicle.brand} {vehicle.model}
                      </div>
                      <div className="mt-1 text-xs text-white/36">{vehicle.type.replaceAll('_', ' ')}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                        style={{
                          borderColor: `${status.color}3D`,
                          background: `${status.color}12`,
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-white/70">{vehicle.nodeScore}</td>
                    <td className="px-5 py-4">
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
                    <td className="px-5 py-4 text-xs text-white/50">{formatKm(vehicle.odometer)}</td>
                    <td className="px-5 py-4 text-xs text-white/54">{status.proof}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedVehicle(vehicle)}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-white/66 transition hover:border-teal-200/35 hover:text-teal-100"
                      >
                        View Brief
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 backdrop-blur-md sm:p-4 md:items-center">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/[0.09] bg-[#050606] shadow-[0_30px_120px_rgba(0,0,0,0.64)] [scrollbar-color:rgba(148,163,184,0.28)_transparent] [scrollbar-width:thin]">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
              <div>
                <Eyebrow>Vehicle pre-visit brief</Eyebrow>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">
                  {selectedVehicle.unitId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-2 text-white/54 transition hover:text-white"
                aria-label="Close vehicle brief"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 sm:p-5">
              <VehiclePreVisitBrief vehicle={selectedVehicle} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
