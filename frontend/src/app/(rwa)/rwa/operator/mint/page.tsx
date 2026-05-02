'use client'

import { useState, type ReactNode } from 'react'
import { CheckCircle2, Cpu, FileSpreadsheet, Loader2, Plus, RadioTower, ShieldCheck, Trash2 } from 'lucide-react'

const FINANCED_COST_PER_UNIT = 25_000_000

type TabKey = 'single' | 'csv'

const VEHICLE_TYPES = ['Electric Motorcycle', 'Cargo Motorcycle', 'Electric Car', 'Electric Van', 'Electric Truck', 'Electric Bus']
const CONTRACT_TYPES = [
  { value: 'rent_to_own', label: 'Rent-to-own — Mobility Credit Pool' },
  { value: 'contracted_remittance', label: 'Contracted Remittance — Fleet Remittance Pool' },
]

interface RWAVehicleEntry {
  vin: string
  type: string
  year: string
  brand: string
  model: string
  gpsDeviceId: string
  contractType: string
  flatFeeDaily: string
}

const BLANK_VEHICLE: RWAVehicleEntry = {
  vin: '',
  type: '',
  year: '2025',
  brand: '',
  model: '',
  gpsDeviceId: '',
  contractType: 'rent_to_own',
  flatFeeDaily: '50000',
}

const fieldClass =
  'w-full rounded-2xl border border-white/[0.08] bg-[#050606] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-teal-200/40 focus:bg-[#080A0A] focus:ring-4 focus:ring-teal-200/[0.06]'

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

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
      {children}
    </label>
  )
}

function formatIDR(value: number) {
  return `Rp ${value.toLocaleString('id-ID')}`
}

export default function AssetOnboardingPage() {
  const [tab, setTab] = useState<TabKey>('single')
  const [vehicles, setVehicles] = useState<RWAVehicleEntry[]>([{ ...BLANK_VEHICLE }])
  const [submitting, setSubmitting] = useState(false)
  const [submitDone, setSubmitDone] = useState(false)
  const [csvFile, setCsvFile] = useState<string | null>(null)

  const totalCapex = vehicles.length * FINANCED_COST_PER_UNIT
  const selectedProduct = CONTRACT_TYPES.find((item) => item.value === vehicles[0]?.contractType)?.label ?? CONTRACT_TYPES[0].label
  const filledTelemetry = vehicles.filter((vehicle) => vehicle.gpsDeviceId.trim().length > 0).length

  function updateVehicle(i: number, patch: Partial<RWAVehicleEntry>) {
    setVehicles((prev) => prev.map((v, idx) => (idx === i ? { ...v, ...patch } : v)))
  }

  function addVehicle() {
    setVehicles((prev) => [...prev, { ...BLANK_VEHICLE }])
  }

  function removeVehicle(i: number) {
    setVehicles((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmitReadiness() {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 2000))
    setSubmitting(false)
    setSubmitDone(true)
  }

  if (submitDone) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center">
        <Panel className="w-full p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-200/20 bg-white/[0.035] text-teal-100">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <Eyebrow>Readiness submitted</Eyebrow>
          <h2
            className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white"
            style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}
          >
            Asset readiness is queued.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/52">
            {vehicles.length} unit{vehicles.length === 1 ? '' : 's'} entered the proof readiness queue.
            The operator can continue telemetry validation, revenue model review, and maintenance path checks.
          </p>
          <div className="mt-6 rounded-2xl border border-white/[0.075] bg-[#050606] p-4 text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Proof hash mock</p>
            <p className="break-all font-mono text-xs leading-6 text-teal-100/80">
              3xR7mNkP2vWqJzLfDhUiCbEtYsXaGpOnV5wM9jKcHrT1eAdNFBSQZul6oIvmyW4
            </p>
          </div>
          <button
            onClick={() => { setSubmitDone(false); setVehicles([{ ...BLANK_VEHICLE }]); setCsvFile(null); setTab('single') }}
            className="mt-6 inline-flex items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.035] px-5 py-3 text-sm font-bold text-white/72 transition hover:border-teal-200/35 hover:text-teal-100"
          >
            Submit Another Batch
          </button>
        </Panel>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Eyebrow>Operator onboarding</Eyebrow>
          <h1
            className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl"
            style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}
          >
            Asset Registration
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/52">
            Register productive EV assets, configure the revenue model, attach telemetry, and
            submit proof readiness before opening funding eligibility.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/54">
          <ShieldCheck className="h-4 w-4 text-teal-100/80" />
          4-proof onboarding rail
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-5">
          <div className="flex w-fit gap-1 rounded-[22px] border border-white/[0.07] bg-[#070808] p-1.5">
            {([['single', 'Single Entry'], ['csv', 'Batch CSV']] as [TabKey, string][]).map(([key, label]) => {
              const active = tab === key
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`relative rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
                    active ? 'bg-white/[0.06] text-white' : 'text-white/42 hover:bg-white/[0.035] hover:text-white/68'
                  }`}
                >
                  {active && (
                    <span className="absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-teal-300/85" />
                  )}
                  <span className={active ? 'pl-3' : ''}>{label}</span>
                </button>
              )
            })}
          </div>

          {tab === 'single' && (
            <>
              <div className="flex flex-col gap-4">
                {vehicles.map((vehicle, index) => (
                  <Panel key={index} className="p-5 sm:p-6">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <Eyebrow>Asset {index + 1}</Eyebrow>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                          Productive EV Unit
                        </h2>
                      </div>
                      {vehicles.length > 1 && (
                        <button
                          onClick={() => removeVehicle(index)}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200/15 bg-rose-200/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-200/15"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <FieldLabel>VIN / asset ID</FieldLabel>
                        <input
                          type="text"
                          className={`${fieldClass} font-mono uppercase`}
                          placeholder="NMS2026JKT0001"
                          maxLength={17}
                          value={vehicle.vin}
                          onChange={(event) => updateVehicle(index, { vin: event.target.value })}
                        />
                      </div>
                      <div>
                        <FieldLabel>Vehicle type</FieldLabel>
                        <select
                          className={fieldClass}
                          value={vehicle.type}
                          onChange={(event) => updateVehicle(index, { type: event.target.value })}
                        >
                          <option value="" disabled>Select type...</option>
                          {VEHICLE_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <FieldLabel>Brand</FieldLabel>
                        <input
                          type="text"
                          className={fieldClass}
                          placeholder="Gesits / Viar / Volta"
                          value={vehicle.brand}
                          onChange={(event) => updateVehicle(index, { brand: event.target.value })}
                        />
                      </div>
                      <div>
                        <FieldLabel>Model</FieldLabel>
                        <input
                          type="text"
                          className={fieldClass}
                          placeholder="G1 / Q1 / Charge"
                          value={vehicle.model}
                          onChange={(event) => updateVehicle(index, { model: event.target.value })}
                        />
                      </div>
                      <div>
                        <FieldLabel>Year</FieldLabel>
                        <input
                          type="number"
                          className={fieldClass}
                          min="2020"
                          max="2027"
                          value={vehicle.year}
                          onChange={(event) => updateVehicle(index, { year: event.target.value })}
                        />
                      </div>
                      <div>
                        <FieldLabel>GPS device ID</FieldLabel>
                        <input
                          type="text"
                          className={`${fieldClass} font-mono`}
                          placeholder="352999111234567"
                          value={vehicle.gpsDeviceId}
                          onChange={(event) => updateVehicle(index, { gpsDeviceId: event.target.value })}
                        />
                      </div>
                      <div>
                        <FieldLabel>Revenue model</FieldLabel>
                        <select
                          className={fieldClass}
                          value={vehicle.contractType}
                          onChange={(event) => updateVehicle(index, { contractType: event.target.value })}
                        >
                          {CONTRACT_TYPES.map((contractType) => (
                            <option key={contractType.value} value={contractType.value}>{contractType.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <FieldLabel>Daily flat fee (IDR)</FieldLabel>
                        <input
                          type="number"
                          className={fieldClass}
                          placeholder="50000"
                          value={vehicle.flatFeeDaily}
                          onChange={(event) => updateVehicle(index, { flatFeeDaily: event.target.value })}
                        />
                      </div>
                    </div>
                  </Panel>
                ))}
              </div>

              <button
                onClick={addVehicle}
                className="inline-flex items-center justify-center gap-2 rounded-[22px] border border-dashed border-white/[0.12] bg-white/[0.025] px-5 py-4 text-sm font-bold text-white/62 transition hover:border-teal-200/35 hover:text-teal-100"
              >
                <Plus className="h-4 w-4" />
                Add Another Unit
              </button>
            </>
          )}

          {tab === 'csv' && (
            <Panel className="flex flex-col items-center gap-5 border-dashed p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-teal-100">
                <FileSpreadsheet className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">Import Batch CSV</h3>
                <p className="mt-2 max-w-lg text-sm leading-7 text-white/48">
                  Upload a CSV with VIN, type, brand, model, year, GPS ID, revenue model, and flat fee.
                </p>
              </div>
              {csvFile ? (
                <div className="w-full rounded-2xl border border-white/[0.075] bg-[#050606] p-4 text-left">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-white">{csvFile}</p>
                      <p className="mt-0.5 text-xs text-white/42">Parsed 24 valid entries. 0 errors.</p>
                    </div>
                    <button onClick={() => setCsvFile(null)} className="text-xs font-semibold text-rose-200">
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-teal-200/30 bg-[#0B0F0E] px-5 py-3 text-sm font-bold text-teal-100 transition hover:border-teal-200/55 hover:bg-[#101817]">
                  <input type="file" accept=".csv" className="hidden" onChange={(event) => setCsvFile(event.target.files?.[0]?.name ?? null)} />
                  Upload CSV
                </label>
              )}
              {csvFile && (
                <button
                  onClick={handleSubmitReadiness}
                  disabled={submitting}
                  className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl border border-teal-200/30 bg-[#0B0F0E] px-5 py-3 text-sm font-bold text-teal-100 transition hover:border-teal-200/55 hover:bg-[#101817] disabled:opacity-50"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                  ) : (
                    <><Cpu className="h-4 w-4" /> Submit Batch Readiness</>
                  )}
                </button>
              )}
              <a href="#" className="text-xs font-semibold text-white/40 transition hover:text-teal-100">
                Download CSV template
              </a>
            </Panel>
          )}
        </div>

        <aside className="lg:sticky lg:top-10 lg:self-start">
          <Panel className="overflow-hidden">
            <div className="border-b border-white/[0.07] p-6">
              <Eyebrow>Readiness summary</Eyebrow>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Funding eligibility
              </h2>
            </div>
            <div className="space-y-4 p-6">
              {[
                ['Total units', `${vehicles.length}`],
                ['Capex assumption', `${formatIDR(FINANCED_COST_PER_UNIT)} / unit`],
                ['Total financed cost', formatIDR(totalCapex)],
                ['Product model', selectedProduct],
                ['Telemetry attached', `${filledTelemetry}/${vehicles.length} units`],
                ['Proof readiness', 'Pending review'],
                ['Funding eligibility', 'Locked until proofs pass'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-white/[0.06] pb-4 last:border-b-0 last:pb-0">
                  <span className="text-xs text-white/40">{label}</span>
                  <span className="max-w-[180px] text-right text-sm font-semibold text-white/76">{value}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.07] p-6">
              <div className="mb-5 space-y-3">
                {['Register Asset', 'Configure Revenue Model', 'Attach Telemetry', 'Submit Proof Readiness', 'Open Funding Eligibility'].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 text-sm text-white/56">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                      index < 3 ? 'border-teal-200/25 bg-teal-200/10 text-teal-100' : 'border-white/[0.08] bg-white/[0.035] text-white/42'
                    }`}>
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmitReadiness}
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-teal-200/30 bg-[#0B0F0E] px-5 py-3.5 text-sm font-bold text-teal-100 transition hover:border-teal-200/55 hover:bg-[#101817] disabled:opacity-50"
              >
                {submitting ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Submitting readiness...</>
                ) : (
                  <><RadioTower className="h-5 w-5" /> Submit Proof Readiness</>
                )}
              </button>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}
