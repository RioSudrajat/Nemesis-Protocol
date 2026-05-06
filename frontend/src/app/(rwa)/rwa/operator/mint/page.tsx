'use client'

import { useState, type ReactNode } from 'react'
import { CheckCircle2, Cpu, FileSpreadsheet, Loader2, Plus, RadioTower, ShieldCheck, Trash2 } from 'lucide-react'
import { useNemesisStore } from '@/store/useNemesisStore'

const ASSET_CLASSES = [
  { value: 'mobility', label: 'Mobility Fleet (EVs)' },
  { value: 'charging', label: 'EV Charging Station' },
  { value: 'energy', label: 'Energy Asset (Solar/Storage)' },
]

const ASSET_SUBCLASSES: Record<string, { value: string, label: string }[]> = {
  mobility: [
    { value: 'ev_ride_hailing_rental_bike', label: 'EV Ride-Hailing Rental Bike' },
    { value: 'delivery_bike', label: 'Delivery Bike' },
    { value: 'cargo_bike', label: 'Cargo Bike' },
    { value: 'ev_taxi', label: 'EV Taxi' },
    { value: 'ev_van', label: 'EV Van' },
    { value: 'ev_shuttle', label: 'EV Shuttle' },
    { value: 'ev_bus', label: 'EV Bus' },
  ],
  charging: [
    { value: 'depot_charger', label: 'Depot Charger' },
    { value: 'public_fast_charger', label: 'Public Fast Charger' },
    { value: 'swap_station', label: 'Battery Swap Station' },
    { value: 'corridor_charging_hub', label: 'Corridor Charging Hub' },
  ],
  energy: [
    { value: 'solar_ev_depot', label: 'Solar EV Depot' },
    { value: 'battery_storage', label: 'Battery Storage' },
    { value: 'exportable_surplus_electricity', label: 'Exportable Surplus Electricity' },
  ]
}

const CONTRACT_TYPES = [
  { value: 'rent_to_own', label: 'Rent-to-own — Mobility Credit Pool' },
  { value: 'contracted_remittance', label: 'Contracted Remittance — Fixed Return Pool' },
  { value: 'revenue_share', label: 'Revenue Share — Realized Yield Pool' },
]

interface RWAAssetEntry {
  assetClass: string
  assetSubclass: string
  identifier: string // VIN for mobility, Station ID for charging, Serial for energy
  telemetryId: string // GPS ID or IoT Hub ID
  year: string
  brand: string
  model: string
  contractType: string
  flatFeeDaily: string
  financedCost: string
}

const BLANK_ASSET: RWAAssetEntry = {
  assetClass: 'mobility',
  assetSubclass: 'ev_ride_hailing_rental_bike',
  identifier: '',
  telemetryId: '',
  year: '2025',
  brand: '',
  model: '',
  contractType: 'rent_to_own',
  flatFeeDaily: '50000',
  financedCost: '25000000',
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
  type TabKey = 'single' | 'csv'
  const [tab, setTab] = useState<TabKey>('single')
  const [assets, setAssets] = useState<RWAAssetEntry[]>([{ ...BLANK_ASSET }])
  const [submitting, setSubmitting] = useState(false)
  const { registerAsset } = useNemesisStore()
  const [submitDone, setSubmitDone] = useState(false)
  const [csvFile, setCsvFile] = useState<string | null>(null)

  const totalCapex = assets.reduce((sum, v) => sum + (Number(v.financedCost) || 0), 0)
  const selectedProduct = CONTRACT_TYPES.find((item) => item.value === assets[0]?.contractType)?.label ?? CONTRACT_TYPES[0].label
  const filledTelemetry = assets.filter((asset) => asset.telemetryId.trim().length > 0).length

  function updateAsset(i: number, patch: Partial<RWAAssetEntry>) {
    setAssets((prev) => prev.map((v, idx) => {
      if (idx === i) {
        const updated = { ...v, ...patch }
        // Auto-update subclass if class changes
        if (patch.assetClass && patch.assetClass !== v.assetClass) {
          updated.assetSubclass = ASSET_SUBCLASSES[patch.assetClass][0].value
          // Auto-adjust default capex assumptions based on class
          if (patch.assetClass === 'charging') updated.financedCost = '75000000'
          else if (patch.assetClass === 'energy') updated.financedCost = '200000000'
          else updated.financedCost = '25000000'
        }
        return updated
      }
      return v
    }))
  }

  function addAsset() {
    setAssets((prev) => [...prev, { ...BLANK_ASSET }])
  }

  function removeAsset(i: number) {
    setAssets((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmitReadiness() {
    setSubmitting(true)
    
    // Save to global store
    assets.forEach((v, idx) => {
      registerAsset({
        id: `asset-${Date.now()}-${idx}`,
        unitId: `#NMS-${Math.floor(Math.random() * 10000)}`,
        assetClass: v.assetClass as any,
        assetSubclass: v.assetSubclass as any,
        vin: v.assetClass === 'mobility' ? v.identifier || `MOCK-VIN-${idx}` : undefined,
        stationId: v.assetClass !== 'mobility' ? v.identifier || `STATION-${idx}` : undefined,
        iotDeviceId: v.telemetryId || `IOT-${idx}`,
        brand: v.brand || 'MockBrand',
        model: v.model || 'MockModel',
        year: parseInt(v.year) || 2025,
        operatorId: 'nemesis_native',
        financedCost: parseFloat(v.financedCost) || 25000000,
        productModel: v.contractType as any,
        poolProductType: v.assetClass === 'mobility' ? 'mobility_credit' : 'yield_pool',
        nodeScore: 100,
        healthScore: 100,
        healthBreakdown: { rem: 100, ban: 100, baterai: 100, koneksi_iot: 100 },
        status: 'idle', // Idle before assigned
        maintenanceFundBalance: 0,
        flatFeeDaily: parseFloat(v.flatFeeDaily) || 50000,
        registeredAt: new Date().toISOString(),
      })
    })

    // Simulate Hardware Readlines / Telemetry check
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
          <Eyebrow>Proof hash generated</Eyebrow>
          <h2
            className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white"
            style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}
          >
            Hardware validated. Asset minted.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/52">
            {assets.length} infrastructure unit{assets.length === 1 ? '' : 's'} successfully submitted hardware readlines. The protocol has generated an on-chain verification hash, placing these assets into the pool queue.
          </p>
          <div className="mt-6 rounded-2xl border border-white/[0.075] bg-[#050606] p-4 text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">Readlines Signature Hash</p>
            <p className="break-all font-mono text-xs leading-6 text-teal-100/80">
              3xR7mNkP2vWqJzLfDhUiCbEtYsXaGpOnV5wM9jKcHrT1eAdNFBSQZul6oIvmyW4
            </p>
          </div>
          <button
            onClick={() => { setSubmitDone(false); setAssets([{ ...BLANK_ASSET }]); setCsvFile(null); setTab('single') }}
            className="mt-6 inline-flex items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.035] px-5 py-3 text-sm font-bold text-white/72 transition hover:border-teal-200/35 hover:text-teal-100"
          >
            Register More Assets
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
            Register productive EV infrastructure, specify the classification (Mobility, Charging, Energy), attach telemetry IoT, and submit hardware proofs to mint the asset on-chain.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/54">
          <ShieldCheck className="h-4 w-4 text-teal-100/80" />
          Hardware Verified
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
                {assets.map((asset, index) => (
                  <Panel key={index} className="p-5 sm:p-6">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <Eyebrow>Asset {index + 1}</Eyebrow>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                          Infrastructure Unit
                        </h2>
                      </div>
                      {assets.length > 1 && (
                        <button
                          onClick={() => removeAsset(index)}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200/15 bg-rose-200/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-200/15"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <FieldLabel>Asset Class</FieldLabel>
                        <select
                          className={fieldClass}
                          value={asset.assetClass}
                          onChange={(event) => updateAsset(index, { assetClass: event.target.value })}
                        >
                          {ASSET_CLASSES.map((cls) => (
                            <option key={cls.value} value={cls.value}>{cls.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <FieldLabel>Subclass / Type</FieldLabel>
                        <select
                          className={fieldClass}
                          value={asset.assetSubclass}
                          onChange={(event) => updateAsset(index, { assetSubclass: event.target.value })}
                        >
                          {ASSET_SUBCLASSES[asset.assetClass]?.map((sub) => (
                            <option key={sub.value} value={sub.value}>{sub.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <FieldLabel>
                          {asset.assetClass === 'mobility' ? 'VIN Number' : 'Station / Serial ID'}
                        </FieldLabel>
                        <input
                          type="text"
                          className={`${fieldClass} font-mono uppercase`}
                          placeholder={asset.assetClass === 'mobility' ? "NMS2026JKT0001" : "STN-ID-001"}
                          value={asset.identifier}
                          onChange={(event) => updateAsset(index, { identifier: event.target.value })}
                        />
                      </div>
                      <div>
                        <FieldLabel>Telemetry (GPS / IoT ID)</FieldLabel>
                        <input
                          type="text"
                          className={`${fieldClass} font-mono`}
                          placeholder="352999111234567"
                          value={asset.telemetryId}
                          onChange={(event) => updateAsset(index, { telemetryId: event.target.value })}
                        />
                      </div>

                      <div>
                        <FieldLabel>Brand / Manufacturer</FieldLabel>
                        <input
                          type="text"
                          className={fieldClass}
                          placeholder={asset.assetClass === 'mobility' ? "Gesits / Viar" : "StarCharge / Huawei"}
                          value={asset.brand}
                          onChange={(event) => updateAsset(index, { brand: event.target.value })}
                        />
                      </div>
                      <div>
                        <FieldLabel>Model Details</FieldLabel>
                        <input
                          type="text"
                          className={fieldClass}
                          placeholder={asset.assetClass === 'mobility' ? "G1 / Q1" : "DC Fast 120kW"}
                          value={asset.model}
                          onChange={(event) => updateAsset(index, { model: event.target.value })}
                        />
                      </div>

                      <div>
                        <FieldLabel>Year of Manufacture</FieldLabel>
                        <input
                          type="number"
                          className={fieldClass}
                          min="2020"
                          max="2027"
                          value={asset.year}
                          onChange={(event) => updateAsset(index, { year: event.target.value })}
                        />
                      </div>
                      <div>
                        <FieldLabel>Capex / Financed Cost (IDR)</FieldLabel>
                        <input
                          type="number"
                          className={fieldClass}
                          placeholder="25000000"
                          value={asset.financedCost}
                          onChange={(event) => updateAsset(index, { financedCost: event.target.value })}
                        />
                      </div>

                      <div>
                        <FieldLabel>Revenue Model</FieldLabel>
                        <select
                          className={fieldClass}
                          value={asset.contractType}
                          onChange={(event) => updateAsset(index, { contractType: event.target.value })}
                        >
                          {CONTRACT_TYPES.map((contractType) => (
                            <option key={contractType.value} value={contractType.value}>{contractType.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <FieldLabel>Daily Flat / Fixed Target (IDR)</FieldLabel>
                        <input
                          type="number"
                          className={fieldClass}
                          placeholder="50000"
                          value={asset.flatFeeDaily}
                          onChange={(event) => updateAsset(index, { flatFeeDaily: event.target.value })}
                        />
                      </div>
                    </div>
                  </Panel>
                ))}
              </div>

              <button
                onClick={addAsset}
                className="inline-flex items-center justify-center gap-2 rounded-[22px] border border-dashed border-white/[0.12] bg-white/[0.025] px-5 py-4 text-sm font-bold text-white/62 transition hover:border-teal-200/35 hover:text-teal-100"
              >
                <Plus className="h-4 w-4" />
                Add Another Asset
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
                  Upload a CSV mapping with Asset Class, Subclass, ID, Telemetry, and Capex fields.
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
                    <><Cpu className="h-4 w-4" /> Validate & Mint Assets</>
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
              <Eyebrow>Registration summary</Eyebrow>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Pending Verification
              </h2>
            </div>
            <div className="space-y-4 p-6">
              {[
                ['Total assets', `${assets.length}`],
                ['Total capex', formatIDR(totalCapex)],
                ['Revenue model', selectedProduct],
                ['IoT telemetry', `${filledTelemetry}/${assets.length} linked`],
                ['Hardware readlines', 'Pending proof fetch'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-white/[0.06] pb-4 last:border-b-0 last:pb-0">
                  <span className="text-xs text-white/40">{label}</span>
                  <span className="max-w-[180px] text-right text-sm font-semibold text-white/76">{value}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.07] p-6">
              <div className="mb-5 space-y-3">
                {['Select Infrastructure Type', 'Configure Financial Metrics', 'Attach IoT Telemetry', 'Fetch Hardware Readlines', 'Mint On-chain Proof'].map((step, index) => (
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
                  <><Loader2 className="h-5 w-5 animate-spin" /> Fetching readlines...</>
                ) : (
                  <><RadioTower className="h-5 w-5" /> Submit Proof (Fetch Readlines)</>
                )}
              </button>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}
