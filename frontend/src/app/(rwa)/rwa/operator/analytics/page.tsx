'use client'

import type { ReactNode } from 'react'
import {
  Activity,
  BrainCircuit,
  CircleDollarSign,
  Gauge,
  Route,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from 'lucide-react'
import { AIFleetInsights } from '@/components/rwa/AIFleetInsights'
import { InteractiveDonutChart } from '@/components/ui/InteractiveDonutChart'
import { WorkshopRevenueChart } from '@/components/ui/WorkshopRevenueChart'
import type { AIFleetInsight } from '@/types/rwa'

const AI_INSIGHTS: AIFleetInsight[] = [
  {
    unitId: '#NMS-0042',
    severity: 'critical',
    message: 'Rear tire wear is uneven across the latest service interval.',
    prediction: 'Schedule tire replacement within 14 days to keep maintenance proof valid.',
    confidence: 87,
    category: 'maintenance',
  },
  {
    unitId: '#NMS-0018',
    severity: 'warning',
    message: 'Battery efficiency is 12% below the fleet baseline.',
    prediction: 'Monitor route load and charging behavior over the next 7 days.',
    confidence: 72,
    category: 'battery',
  },
  {
    severity: 'info',
    message: '3 units are above the average idle-rate band this week.',
    prediction: 'Review driver assignment and route coverage before the next pool report.',
    confidence: 65,
    category: 'utilization',
  },
]

const DONUT_DATA = [
  { id: 'active', label: 'Active', value: 71, color: '#5EEAD4' },
  { id: 'maintenance', label: 'Maintenance', value: 6, color: '#FCD34D' },
  { id: 'idle', label: 'Idle', value: 18, color: '#94A3B8' },
  { id: 'offline', label: 'Offline', value: 5, color: '#FDA4AF' },
]

const CASH_DISTRIBUTION_DATA = [
  { day: 'Mon', value: 540000 },
  { day: 'Tue', value: 610000 },
  { day: 'Wed', value: 580000 },
  { day: 'Thu', value: 760000 },
  { day: 'Fri', value: 690000 },
  { day: 'Sat', value: 830000 },
  { day: 'Sun', value: 520000 },
]

const STATS_ROW = [
  {
    label: 'Avg Fleet Health',
    value: '83/100',
    detail: '2 units require review',
    Icon: Gauge,
    tone: 'text-emerald-200',
  },
  {
    label: 'Route Utilization',
    value: '85.5%',
    detail: 'Daily route-log coverage',
    Icon: Activity,
    tone: 'text-teal-100',
  },
  {
    label: 'Km / Unit / Day',
    value: '72 km',
    detail: 'Median productive movement',
    Icon: Route,
    tone: 'text-amber-100',
  },
  {
    label: 'Cash Distributed',
    value: 'Rp 4.2M',
    detail: 'IDRX settled this month',
    Icon: WalletCards,
    tone: 'text-white/82',
  },
]

const SEGMENT_PERFORMANCE = [
  {
    segment: 'Ride-hailing',
    units: 38,
    health: 87,
    km: 78,
    utilization: '89%',
    cash: 'Rp 48,000',
    status: 'Strong',
  },
  {
    segment: 'Delivery',
    units: 31,
    health: 81,
    km: 65,
    utilization: '83%',
    cash: 'Rp 42,000',
    status: 'Stable',
  },
  {
    segment: 'Cargo',
    units: 14,
    health: 79,
    km: 58,
    utilization: '79%',
    cash: 'Rp 55,000',
    status: 'Watch',
  },
]

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

export default function AnalyticsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Operator analytics</Eyebrow>
          <h1
            className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl"
            style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}
          >
            Fleet Intelligence
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/52">
            Monitor fleet health, route utilization, cash distribution, and predictive maintenance
            signals from one operator intelligence layer.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/54">
          <BrainCircuit className="h-4 w-4 text-teal-100/80" />
          AI health insights active
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STATS_ROW.map((stat) => {
          const Icon = stat.Icon
          return (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/[0.075] bg-[#080A0A] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">
                  {stat.label}
                </span>
                <span className={`rounded-full border border-white/[0.08] bg-white/[0.035] p-2 ${stat.tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="text-3xl font-semibold tracking-[-0.045em] text-white">{stat.value}</div>
              <p className="mt-2 text-xs text-white/45">{stat.detail}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Panel className="p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <Eyebrow>Fleet status</Eyebrow>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Unit distribution
              </h2>
              <p className="mt-2 text-xs leading-5 text-white/43">
                Current operating state across 83 registered units.
              </p>
            </div>
            <ShieldCheck className="h-5 w-5 text-teal-100/70" />
          </div>
          <InteractiveDonutChart data={DONUT_DATA} centerLabel="Fleet state" centerValue="83 units" />
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Eyebrow>Predictive layer</Eyebrow>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Maintenance intelligence
              </h2>
              <p className="mt-2 text-xs leading-5 text-white/43">
                AI-assisted signals from GPS activity, usage behavior, and service history.
              </p>
            </div>
            <BrainCircuit className="h-5 w-5 text-teal-100/70" />
          </div>
          <AIFleetInsights insights={AI_INSIGHTS} />
        </Panel>
      </div>

      <Panel className="p-5 sm:p-6">
        <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <Eyebrow>Settlement trend</Eyebrow>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              IDRX Cash Distribution
            </h2>
            <p className="mt-2 text-xs leading-5 text-white/43">
              Daily cash distributed from verified fleet operations over the last 7 days.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/54">
            <CircleDollarSign className="h-4 w-4 text-teal-100/80" />
            Rp 4.2M month-to-date
          </div>
        </div>
        <WorkshopRevenueChart data={CASH_DISTRIBUTION_DATA} suffix="IDRX" color="#5EEAD4" variant="dark" />
      </Panel>

      <Panel className="overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] p-5 lg:p-6">
          <div>
            <Eyebrow>Segment performance</Eyebrow>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              Productive mobility segments
            </h2>
          </div>
          <TrendingUp className="h-5 w-5 text-teal-100/70" />
        </div>
        <div className="overflow-x-auto [scrollbar-color:rgba(148,163,184,0.28)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-white/[0.07] text-[11px] uppercase tracking-[0.18em] text-white/36">
              <tr>
                {['Segment', 'Units', 'Avg Health', 'Km / Day', 'Utilization', 'Cash / Unit / Week', 'State'].map((header) => (
                  <th key={header} className="px-5 py-4 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {SEGMENT_PERFORMANCE.map((row) => (
                <tr key={row.segment} className="text-white/72 transition hover:bg-white/[0.035]">
                  <td className="px-5 py-4 text-sm font-semibold text-white/82">{row.segment}</td>
                  <td className="px-5 py-4 text-sm text-white/62">{row.units}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-emerald-100/82">{row.health}/100</td>
                  <td className="px-5 py-4 text-sm text-white/62">{row.km} km</td>
                  <td className="px-5 py-4 text-sm font-semibold text-teal-100/82">{row.utilization}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-white/78">{row.cash}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-white/62">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-300/80" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
