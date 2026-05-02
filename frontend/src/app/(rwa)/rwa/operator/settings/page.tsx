'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { CheckCircle2, Save, ShieldCheck, SlidersHorizontal, WalletCards } from 'lucide-react'
import { MOCK_OPERATOR_PROFILE } from '@/data/operators'
import { OperatorPoolBadge } from '@/components/rwa/OperatorPoolBadge'

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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/36">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-2xl border border-white/[0.075] bg-white/[0.035] px-4 py-3 text-sm text-white/78 outline-none transition placeholder:text-white/24 focus:border-teal-100/28 focus:bg-white/[0.05] focus:ring-2 focus:ring-teal-200/[0.08]'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const economics = [
    { label: 'Current Pool', value: 'Fleet Pool Batch #1' },
    { label: 'Protocol Fee', value: '10%' },
    { label: 'Operator Servicing Fee', value: '8% + 2% performance' },
    { label: 'Maintenance Reserve', value: '10%' },
  ]

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Operator controls</Eyebrow>
          <h1
            className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl"
            style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}
          >
            Operator Configuration
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/52">
            Manage operator identity, pool configuration, telemetry defaults, and protocol-defined
            settings for the active fleet.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/54">
          <ShieldCheck className="h-4 w-4 text-teal-100/74" />
          KYC verified operator
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel className="p-5 sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <Eyebrow>Operator identity</Eyebrow>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Business profile
              </h2>
            </div>
            <OperatorPoolBadge type={MOCK_OPERATOR_PROFILE.type} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Business Name">
              <input type="text" className={inputClass} defaultValue={MOCK_OPERATOR_PROFILE.businessName} />
            </Field>
            <Field label="City">
              <input type="text" className={inputClass} defaultValue={MOCK_OPERATOR_PROFILE.city} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Wallet Address">
                <input
                  type="text"
                  className={`${inputClass} font-mono text-xs text-white/48`}
                  defaultValue="NMSop1Xk7Rz9mP3dLvQ2wYfH8eT6sN5cBuA4gJ1xyz9"
                  readOnly
                />
              </Field>
            </div>
            <Field label="Contact Email">
              <input type="email" className={inputClass} defaultValue="ops@nemesisfleet.id" />
            </Field>
            <Field label="Phone Number">
              <input type="tel" className={inputClass} defaultValue="+62 812-3456-7890" />
            </Field>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.075] bg-white/[0.025] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/34">
                KYC Status
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs font-semibold text-teal-100/68">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.075] bg-white/[0.025] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/34">
                Operator Type
              </p>
              <p className="mt-3 text-sm font-semibold text-white/74">
                Nemesis native fleet operator
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <Eyebrow>Pool economics</Eyebrow>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Protocol-defined terms
              </h2>
            </div>
            <WalletCards className="h-5 w-5 text-teal-100/68" />
          </div>
          <div className="divide-y divide-white/[0.06]">
            {economics.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-white/42">{item.label}</span>
                <span className="text-right text-sm font-semibold text-white/72">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-white/[0.075] bg-white/[0.025] p-4 text-xs leading-5 text-white/42">
            Pool economics are defined by protocol policy and cannot be changed by an individual
            operator. Updates require governance approval and pool-level disclosure.
          </div>
        </Panel>
      </div>

      <Panel className="p-5 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Eyebrow>Telemetry defaults</Eyebrow>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              GPS and activity reporting
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-white/43">
              These defaults control how new units attach GPS evidence for Proof of Activity.
            </p>
          </div>
          <SlidersHorizontal className="h-5 w-5 text-teal-100/68" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Default GPS Type">
            <select className={inputClass} defaultValue="phone">
              <option value="phone">Phone-based GPS (MVP)</option>
              <option value="hardware">Hardware GPS Device</option>
              <option value="obd">OBD-II GPS Dongle</option>
            </select>
          </Field>
          <Field label="Reporting Interval">
            <select className={inputClass} defaultValue="60">
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
              <option value="120">2 minutes</option>
              <option value="300">5 minutes</option>
            </select>
          </Field>
          <Field label="Idle Threshold (minutes)">
            <input type="number" className={inputClass} defaultValue={15} min={5} max={60} />
          </Field>
          <Field label="Geofence Radius (km)">
            <input type="number" className={inputClass} defaultValue={50} min={1} max={500} />
          </Field>
        </div>
      </Panel>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-teal-100/18 bg-white/[0.055] px-5 py-3 text-sm font-semibold text-white/82 shadow-[0_18px_42px_rgba(0,0,0,0.22)] transition hover:bg-white/[0.075]"
        >
          <Save className="h-4 w-4 text-teal-100/76" />
          Save Changes
        </button>
        {saved && (
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-sm font-semibold text-teal-100/70">
            <CheckCircle2 className="h-4 w-4" />
            Settings saved
          </span>
        )}
      </div>
    </div>
  )
}
