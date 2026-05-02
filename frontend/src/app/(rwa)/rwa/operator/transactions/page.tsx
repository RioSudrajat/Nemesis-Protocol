'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { ArrowDownToLine, CircleDollarSign, ExternalLink, ReceiptText, ShieldCheck } from 'lucide-react'
import { formatIDRX } from '@/lib/yield'

type TxFilter = 'all' | 'daily_remittance' | 'cash_distribution' | 'maintenance_reserve'

const FILTER_ITEMS: { key: TxFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'daily_remittance', label: 'Daily Remittance' },
  { key: 'cash_distribution', label: 'Cash Distribution' },
  { key: 'maintenance_reserve', label: 'Maintenance Reserve' },
]

interface TxRow {
  date: string
  type: TxFilter
  typeLabel: string
  unitPool: string
  amount: number
  status: 'Confirmed' | 'Distributed' | 'Released' | 'Pending'
  hash: string
}

const MOCK_TXS: TxRow[] = [
  { date: '2026-04-22', type: 'daily_remittance', typeLabel: 'Daily Remittance', unitPool: '#NMS-0001', amount: 50000, status: 'Confirmed', hash: '9aKd3...pW7n' },
  { date: '2026-04-22', type: 'daily_remittance', typeLabel: 'Daily Remittance', unitPool: '#NMS-0018', amount: 50000, status: 'Confirmed', hash: '2bLm8...qX4o' },
  { date: '2026-04-21', type: 'cash_distribution', typeLabel: 'Cash Distribution', unitPool: 'Fleet Pool Batch #1', amount: 192000, status: 'Distributed', hash: '5cNp1...rY5p' },
  { date: '2026-04-20', type: 'daily_remittance', typeLabel: 'Daily Remittance', unitPool: '#NMS-0055', amount: 60000, status: 'Confirmed', hash: '7dOq4...sZ6q' },
  { date: '2026-04-20', type: 'maintenance_reserve', typeLabel: 'Maintenance Reserve', unitPool: '#NMS-0042', amount: 180000, status: 'Released', hash: '4xPq2...mR9k' },
  { date: '2026-04-18', type: 'cash_distribution', typeLabel: 'Cash Distribution', unitPool: 'Fleet Pool Batch #1', amount: 188000, status: 'Distributed', hash: '3ePr7...tA7r' },
  { date: '2026-04-17', type: 'daily_remittance', typeLabel: 'Daily Remittance', unitPool: '#NMS-0073', amount: 55000, status: 'Confirmed', hash: '6fQs9...uB8s' },
  { date: '2026-04-15', type: 'cash_distribution', typeLabel: 'Cash Distribution', unitPool: 'Fleet Pool Batch #1', amount: 196000, status: 'Distributed', hash: '1gRt2...vC9t' },
  { date: '2026-04-10', type: 'maintenance_reserve', typeLabel: 'Maintenance Reserve', unitPool: '#NMS-0018', amount: 150000, status: 'Released', hash: '7yRn5...vL2m' },
  { date: '2026-04-08', type: 'daily_remittance', typeLabel: 'Daily Remittance', unitPool: '#NMS-0001', amount: 50000, status: 'Confirmed', hash: '8hSu5...wD0u' },
]

const STATUS_STYLE: Record<TxRow['status'], { className: string; dotClass: string }> = {
  Confirmed: {
    className: 'border-white/[0.07] bg-white/[0.028] text-white/52',
    dotClass: 'bg-teal-300/70',
  },
  Distributed: {
    className: 'border-white/[0.08] bg-white/[0.035] text-teal-100/62',
    dotClass: 'bg-teal-300/72',
  },
  Released: {
    className: 'border-white/[0.08] bg-white/[0.035] text-amber-100/62',
    dotClass: 'bg-amber-300/68',
  },
  Pending: {
    className: 'border-white/[0.07] bg-white/[0.025] text-white/42',
    dotClass: 'bg-white/35',
  },
}

const TYPE_STYLE: Record<TxFilter, { className: string; dotClass: string }> = {
  all: {
    className: 'border-white/[0.07] bg-white/[0.03] text-white/52',
    dotClass: 'bg-white/38',
  },
  daily_remittance: {
    className: 'border-white/[0.08] bg-white/[0.035] text-teal-100/66',
    dotClass: 'bg-teal-300/70',
  },
  cash_distribution: {
    className: 'border-white/[0.08] bg-white/[0.035] text-white/62',
    dotClass: 'bg-white/58',
  },
  maintenance_reserve: {
    className: 'border-white/[0.08] bg-white/[0.035] text-amber-100/64',
    dotClass: 'bg-amber-300/66',
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

export default function TransactionsPage() {
  const [filter, setFilter] = useState<TxFilter>('all')

  const filtered = filter === 'all' ? MOCK_TXS : MOCK_TXS.filter((tx) => tx.type === filter)
  const filteredVolume = filtered.reduce((sum, tx) => sum + tx.amount, 0)
  const cashDistributed = MOCK_TXS
    .filter((tx) => tx.type === 'cash_distribution')
    .reduce((sum, tx) => sum + tx.amount, 0)
  const reserveReleased = MOCK_TXS
    .filter((tx) => tx.type === 'maintenance_reserve')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const stats = [
    { label: 'Visible Transactions', value: filtered.length.toString(), detail: `${FILTER_ITEMS.find((item) => item.key === filter)?.label ?? 'All'} view`, Icon: ReceiptText },
    { label: 'Filtered Volume', value: formatIDRX(filteredVolume), detail: 'IDRX in current filter', Icon: ArrowDownToLine },
    { label: 'Cash Distributed', value: formatIDRX(cashDistributed), detail: 'Pool participant settlement', Icon: CircleDollarSign },
    { label: 'Reserve Released', value: formatIDRX(reserveReleased), detail: 'Maintenance proof releases', Icon: ShieldCheck },
  ]

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>IDRX settlement</Eyebrow>
          <h1
            className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl"
            style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}
          >
            Settlement Ledger
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/52">
            Review operator remittance, pool cash distribution, maintenance reserve releases, and
            on-chain settlement references from one ledger.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/54">
          <ShieldCheck className="h-4 w-4 text-teal-100/74" />
          On-chain references attached
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
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
                <span className="rounded-full border border-white/[0.08] bg-white/[0.035] p-2 text-teal-100/72">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="text-2xl font-semibold tracking-[-0.045em] text-white">{stat.value}</div>
              <p className="mt-2 text-xs text-white/45">{stat.detail}</p>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_ITEMS.map((item) => {
          const active = filter === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                active
                  ? 'border-white/[0.12] bg-white/[0.055] text-white/78'
                  : 'border-white/[0.065] bg-white/[0.018] text-white/42 hover:bg-white/[0.035] hover:text-white/62'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-teal-300/72' : 'bg-white/28'}`} />
              {item.label}
            </button>
          )
        })}
      </div>

      <Panel className="overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] p-5 lg:p-6">
          <div>
            <Eyebrow>Ledger entries</Eyebrow>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              Settlement activity
            </h2>
          </div>
          <div className="hidden rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/44 sm:block">
            {filtered.length} records
          </div>
        </div>
        <div className="overflow-x-auto [scrollbar-color:rgba(148,163,184,0.28)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="border-b border-white/[0.07] text-[11px] uppercase tracking-[0.18em] text-white/36">
              <tr>
                {['Date', 'Type', 'Unit / Pool', 'Amount', 'Status', 'Hash'].map((header) => (
                  <th key={header} className="px-5 py-4 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map((tx) => {
                const typeStyle = TYPE_STYLE[tx.type]
                const statusStyle = STATUS_STYLE[tx.status]
                return (
                  <tr key={`${tx.date}-${tx.hash}`} className="text-white/72 transition hover:bg-white/[0.035]">
                    <td className="px-5 py-4 text-xs text-white/42">{tx.date}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${typeStyle.className}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${typeStyle.dotClass}`} />
                        {tx.typeLabel}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs font-bold text-teal-100/74">{tx.unitPool}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-white/76">{formatIDRX(tx.amount)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle.className}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dotClass}`} />
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-teal-100/66 transition hover:text-teal-50">
                        {tx.hash} <ExternalLink className="h-3 w-3" />
                      </button>
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
