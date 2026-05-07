'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Leaf,
  Plus,
  Trash2,
} from 'lucide-react'
import type { FleetCategory } from '@/types/depin'
import type { PoolProductType, StakingPool } from '@/types/fi'
import { MOCK_OPERATOR_PROFILE } from '@/data/operators'
import { selectCampaignEligibleAssets, useNemesisStore } from '@/store/useNemesisStore'
import { AvatarInitials } from '@/components/ui/AvatarInitials'
import { formatIDRXFull } from '@/lib/yield'

type SplitKey =
  | 'principalRecoveryPct'
  | 'cashYieldPct'
  | 'maintenanceReservePct'
  | 'defaultReservePct'
  | 'operatorBaseFeePct'
  | 'operatorPerformanceFeePct'
  | 'protocolFeePct'

interface TeamMember {
  name: string
  role: string
  bio: string
}

interface LegalDoc {
  title: string
  url: string
  type: 'PDF' | 'legal' | 'report'
}

const PRODUCT_LABELS: Record<PoolProductType, string> = {
  mobility_credit: 'Mobility Credit Pool',
  fleet_remittance: 'Fleet Remittance Pool',
  charging_yield: 'Charging Yield Pool',
  energy_yield: 'Energy Yield Pool',
}

const SPLIT_LABELS: Record<SplitKey, string> = {
  principalRecoveryPct: 'Principal Recovery',
  cashYieldPct: 'Investor Cash Yield',
  maintenanceReservePct: 'Maintenance Reserve',
  defaultReservePct: 'Default Reserve',
  operatorBaseFeePct: 'Operator Base Fee',
  operatorPerformanceFeePct: 'Operator Performance Fee',
  protocolFeePct: 'Protocol Fee',
}

const fieldClass =
  'w-full rounded-2xl border border-white/[0.08] bg-[#050606] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-teal-200/40 focus:bg-[#080A0A] focus:ring-4 focus:ring-teal-200/[0.06]'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">{children}</p>
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{children}</label>
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[24px] border border-white/[0.08] bg-[#070808] p-6 shadow-2xl ${className}`}>{children}</section>
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function CreateCampaignWizard() {
  const router = useRouter()
  const store = useNemesisStore()
  const availableAssets = selectCampaignEligibleAssets(store)

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([])

  const [poolName, setPoolName] = useState('Jakarta E-Bike Expansion Q3')
  const [location, setLocation] = useState(MOCK_OPERATOR_PROFILE.city)
  const [productType, setProductType] = useState<PoolProductType>('mobility_credit')

  const [split, setSplit] = useState<Record<SplitKey, number>>({
    principalRecoveryPct: 45,
    cashYieldPct: 20,
    maintenanceReservePct: 10,
    defaultReservePct: 5,
    operatorBaseFeePct: 8,
    operatorPerformanceFeePct: 2,
    protocolFeePct: 10,
  })
  const [tenorMonths, setTenorMonths] = useState(36)
  const [monthlyCollectionPerUnit, setMonthlyCollectionPerUnit] = useState(1_500_000)

  const [overviewTitle, setOverviewTitle] = useState('Fleet Expansion in Jakarta')
  const [overviewDescription, setOverviewDescription] = useState('Deployment of high-utility electric vehicles for ride-hailing and last-mile delivery, transitioning ICE drivers to EVs.')
  const [problemStatement, setProblemStatement] = useState('High fuel and maintenance costs for ICE vehicles reduce driver take-home pay and worsen urban emissions.')
  const [solutionStrategy, setSolutionStrategy] = useState('Provide affordable rent-to-own EV schemes with telemetry-linked proof, maintenance reserves, and monthly investor distributions.')
  const [startDate, setStartDate] = useState('2026-06-01')
  const [firstPayoutDate, setFirstPayoutDate] = useState('2026-07-01')
  const [completionDate, setCompletionDate] = useState('2029-06-01')

  const [operatorHistory, setOperatorHistory] = useState('Nemesis Protocol native fleet operations with verified route, revenue, and maintenance proof across Jakarta mobility deployments.')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: 'Rio Sudrajat', role: 'Fleet Lead', bio: 'Leads EV fleet deployment, driver onboarding, and daily collection operations.' },
    { name: 'Win Armendal', role: 'Capital Markets Lead', bio: 'Owns investor reporting, pool economics, and capital partner coordination.' },
    { name: 'Fatih Maulana', role: 'Operations Engineer', bio: 'Coordinates telemetry readiness, maintenance proof, and asset activation.' },
  ])

  const [co2AvoidedKg, setCo2AvoidedKg] = useState(0)
  const [greenKm, setGreenKm] = useState(0)
  const [treesEquivalent, setTreesEquivalent] = useState(0)
  const [energySavedKwh, setEnergySavedKwh] = useState(0)
  const [esgNarrative, setEsgNarrative] = useState('This pool accelerates EV adoption for productive urban transport while reducing fuel dependency and operational emissions.')

  const [riskFactors, setRiskFactors] = useState('Driver default on daily payments, maintenance delays, battery degradation, and gig-economy policy changes.')
  const [riskMitigations, setRiskMitigations] = useState('Default reserve, active repossession workflow, preventive maintenance schedule, and telemetry-backed utilization monitoring.')
  const [legalDocs, setLegalDocs] = useState<LegalDoc[]>([
    { title: 'Offering Memorandum', url: 'https://example.com/om.pdf', type: 'legal' },
  ])

  const selectedAssets = useMemo(
    () => availableAssets.filter((asset) => selectedAssetIds.includes(asset.id)),
    [availableAssets, selectedAssetIds],
  )
  const unitCount = selectedAssets.length
  const totalCapex = selectedAssets.reduce((sum, asset) => sum + asset.financedCost, 0)
  const unitCost = unitCount > 0 ? Math.round(totalCapex / unitCount) : 25_000_000
  const targetSupply = totalCapex || unitCost
  const minInvestment = Math.max(100_000, Math.round(unitCost * 0.01))
  const maxInvestment = Math.max(minInvestment, Math.round(targetSupply * 0.1))
  const collateralDescription = unitCount > 0
    ? `${unitCount} productive EV assets selected from registered Nemesis fleet`
    : 'Select registered unpooled assets to auto-generate collateral description'
  const splitTotal = Object.values(split).reduce((sum, value) => sum + value, 0)
  const annualGrossCollection = unitCount * monthlyCollectionPerUnit * 12
  const cashYieldApy = targetSupply > 0 ? Math.round(((annualGrossCollection * (split.cashYieldPct / 100)) / targetSupply) * 1000) / 10 : 0
  const annualPrincipalRecovery = tenorMonths > 0 ? Math.round((split.principalRecoveryPct / 100) * (targetSupply / tenorMonths) * 12) : 0
  const totalAnnualDistribution = Math.round(annualGrossCollection * (split.cashYieldPct / 100) + annualPrincipalRecovery)
  const projectedOneMillion = Math.round(1_000_000 * ((cashYieldApy + split.principalRecoveryPct) / 100))

  const updateSplit = (key: SplitKey, value: number) => {
    if (key === 'protocolFeePct') return
    setSplit((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : 0 }))
  }

  const toggleAsset = (assetId: string) => {
    setSelectedAssetIds((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId],
    )
  }

  const toggleAllAssets = () => {
    setSelectedAssetIds((prev) => prev.length === availableAssets.length ? [] : availableAssets.map((asset) => asset.id))
  }

  const updateTeamMember = (index: number, patch: Partial<TeamMember>) => {
    setTeamMembers((prev) => prev.map((member, i) => i === index ? { ...member, ...patch } : member))
  }

  const updateLegalDoc = (index: number, patch: Partial<LegalDoc>) => {
    setLegalDocs((prev) => prev.map((doc, i) => i === index ? { ...doc, ...patch } : doc))
  }

  const handleSubmit = async () => {
    if (splitTotal !== 100 || unitCount === 0) return
    setSubmitting(true)

    const poolSeed = slugify(poolName) || 'campaign'
    const poolId = `pool-${poolSeed}-${unitCount}-${Math.round(targetSupply)}`
    const newPool: StakingPool = {
      id: poolId,
      name: poolName,
      slug: poolSeed,
      description: overviewTitle,
      productType,
      productLabel: PRODUCT_LABELS[productType],
      revenueModel: 'Monthly collections split into principal recovery, investor yield, reserves, operator fees, and protocol fees.',
      operatorType: MOCK_OPERATOR_PROFILE.type,
      managedBy: MOCK_OPERATOR_PROFILE.name,
      category: ['ojol', 'kurir'] as FleetCategory[],
      unitCount,
      assetClass: productType === 'charging_yield' ? 'charging' : productType === 'energy_yield' ? 'energy' : 'mobility',
      cashYieldPct: cashYieldApy,
      principalRecoveryPct: split.principalRecoveryPct,
      totalAnnualCashDistributionPct: Math.round(((totalAnnualDistribution / targetSupply) * 100) * 10) / 10,
      tenorMonths,
      totalSupplied: 0,
      targetSupply,
      minInvestment,
      maxInvestment,
      defaultReservePct: split.defaultReservePct,
      maintenanceReservePct: split.maintenanceReservePct,
      operatorBaseFeePct: split.operatorBaseFeePct,
      operatorPerformanceFeePct: split.operatorPerformanceFeePct,
      protocolFeePct: split.protocolFeePct,
      settlementCurrency: 'IDRX / USDC',
      collateralDescription,
      performanceTargetYield: cashYieldApy,
      locationLabel: `${location}, Indonesia`,
      projectOverview: `${overviewTitle}\n${overviewDescription}`,
      problemStatement,
      solutionStrategy,
      operatorHistory,
      riskDisclosure: `${riskFactors}\n\nMitigations: ${riskMitigations}`,
      documents: legalDocs.map((doc) => ({ ...doc, size: 'External' })),
      impactProjections: {
        co2SavedKg: co2AvoidedKg,
        treesPlanted: treesEquivalent,
        evEquivalents: unitCount,
        greenKm,
        energySavedKwh,
      },
      esgNarrative,
      teamMembers,
      deliveryTimeline: { startDate, firstPayoutDate, completionDate },
      selectedAssetIds,
      monthlyCollectionAssumption: monthlyCollectionPerUnit,
      proofStatus: 'pending',
      reserveHealth: 'Reserve terms pending approval',
      status: 'pending_approval',
      energyPointsEligible: productType !== 'fleet_remittance',
      imageUrl: '/images/pool-placeholder.png',
      nextDistribution: `${firstPayoutDate}T00:00:00.000Z`,
      createdAt: `${startDate}T00:00:00.000Z`,
      tags: [PRODUCT_LABELS[productType], `${tenorMonths} months`, 'Pending approval'],
      unitBreakdown: [
        { category: 'ojol', label: 'Selected registered assets', count: unitCount },
      ],
      activeUnits: 0,
      idleUnits: unitCount,
      maintenanceUnits: 0,
    }

    store.createPool(newPool)
    await new Promise((resolve) => setTimeout(resolve, 900))
    router.push('/rwa/operator')
  }

  const canContinue = step !== 1 || unitCount > 0

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-10">
      <div>
        <Eyebrow>Pool assembly</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Create New Campaign</h1>
        <p className="mt-2 text-sm text-white/50">Build a V2 Blueprint-compliant financing pool from registered assets.</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold text-white/40">
        {['Assets', 'Split', 'Narrative', 'Team', 'Impact', 'Risk', 'Review'].map((label, index) => {
          const itemStep = index + 1
          return (
            <div key={label} className={`flex shrink-0 items-center gap-2 ${step === itemStep ? 'text-teal-200' : step > itemStep ? 'text-white/80' : ''}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${step === itemStep ? 'border-teal-200/40 bg-teal-200/10' : step > itemStep ? 'border-teal-300/20 bg-teal-300/10' : 'border-white/10'}`}>
                {step > itemStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : itemStep}
              </span>
              <span>{label}</span>
              {itemStep < 7 && <ChevronRight className="h-3 w-3 opacity-50" />}
            </div>
          )
        })}
      </div>

      <Panel>
        {step === 1 && (
          <div className="space-y-6">
            <StepTitle title="Pool Identity & Assets" />
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Pool Name"><input className={fieldClass} value={poolName} onChange={(event) => setPoolName(event.target.value)} /></Field>
              <Field label="Location"><input className={fieldClass} value={location} onChange={(event) => setLocation(event.target.value)} /></Field>
              <Field label="Asset Class Type">
                <select className={fieldClass} value={productType} onChange={(event) => setProductType(event.target.value as PoolProductType)}>
                  {Object.entries(PRODUCT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025]">
              <div className="flex flex-col gap-3 border-b border-white/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Registered unpooled assets</p>
                  <p className="mt-1 text-xs text-white/42">{unitCount} selected from {availableAssets.length} available assets</p>
                </div>
                <button type="button" onClick={toggleAllAssets} className="rounded-xl border border-teal-200/30 px-4 py-2 text-xs font-bold text-teal-100">
                  {selectedAssetIds.length === availableAssets.length ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <div className="max-h-[360px] overflow-y-auto p-3">
                {availableAssets.length === 0 ? (
                  <p className="p-8 text-center text-sm text-white/36">No unpooled assets available. Register or free assets before creating a new campaign.</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {availableAssets.map((asset) => {
                      const selected = selectedAssetIds.includes(asset.id)
                      return (
                        <button key={asset.id} type="button" onClick={() => toggleAsset(asset.id)} className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-teal-300/45 bg-teal-300/10' : 'border-white/[0.08] bg-[#050606] hover:border-white/20'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-mono text-xs font-bold text-teal-100">{asset.unitId}</p>
                              <p className="mt-1 text-sm font-semibold text-white">{asset.brand} {asset.model}</p>
                            </div>
                            <span className={`flex h-5 w-5 items-center justify-center rounded border ${selected ? 'border-teal-300 bg-teal-300 text-teal-950' : 'border-white/20'}`}>
                              {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
                            </span>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/48">
                            <span>{formatIDRXFull(asset.financedCost)}</span>
                            <span>Health {asset.healthScore}/100</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <SummaryGrid items={[
              ['Unit count', String(unitCount)],
              ['Total capex', formatIDRXFull(totalCapex)],
              ['Collateral', collateralDescription],
            ]} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <StepTitle title="Revenue Model & Split" />
            <div className="grid gap-3 md:grid-cols-2">
              {(Object.keys(SPLIT_LABELS) as SplitKey[]).map((key) => (
                <Field key={key} label={`${SPLIT_LABELS[key]} %`}>
                  <input
                    type="number"
                    className={fieldClass}
                    value={split[key]}
                    disabled={key === 'protocolFeePct'}
                    onChange={(event) => updateSplit(key, Number(event.target.value))}
                  />
                </Field>
              ))}
            </div>
            <div className={`rounded-2xl border p-4 text-sm font-semibold ${splitTotal === 100 ? 'border-teal-300/20 bg-teal-300/8 text-teal-100' : 'border-amber-300/20 bg-amber-300/8 text-amber-100'}`}>
              Split total: {splitTotal}% {splitTotal !== 100 && '(must equal 100%)'}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Tenor (months)"><input type="number" className={fieldClass} value={tenorMonths} onChange={(event) => setTenorMonths(Number(event.target.value))} /></Field>
              <Field label="Monthly collection / unit"><input type="number" className={fieldClass} value={monthlyCollectionPerUnit} onChange={(event) => setMonthlyCollectionPerUnit(Number(event.target.value))} /></Field>
            </div>
            <SummaryGrid items={[
              ['Cash Yield APY', `${cashYieldApy}%`],
              ['Annual principal recovery', formatIDRXFull(annualPrincipalRecovery)],
              ['Annual cash distribution', formatIDRXFull(totalAnnualDistribution)],
              ['Min / Max investment', `${formatIDRXFull(minInvestment)} / ${formatIDRXFull(maxInvestment)}`],
            ]} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <StepTitle title="Project Narrative" />
            <Field label="Overview title"><input className={fieldClass} value={overviewTitle} onChange={(event) => setOverviewTitle(event.target.value)} /></Field>
            <Field label="Overview description"><textarea className={fieldClass} rows={4} value={overviewDescription} onChange={(event) => setOverviewDescription(event.target.value)} /></Field>
            <Field label="Problem statement"><textarea className={fieldClass} rows={3} value={problemStatement} onChange={(event) => setProblemStatement(event.target.value)} /></Field>
            <Field label="Solution strategy"><textarea className={fieldClass} rows={3} value={solutionStrategy} onChange={(event) => setSolutionStrategy(event.target.value)} /></Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Start date"><input type="date" className={fieldClass} value={startDate} onChange={(event) => setStartDate(event.target.value)} /></Field>
              <Field label="Expected first payout"><input type="date" className={fieldClass} value={firstPayoutDate} onChange={(event) => setFirstPayoutDate(event.target.value)} /></Field>
              <Field label="Completion date"><input type="date" className={fieldClass} value={completionDate} onChange={(event) => setCompletionDate(event.target.value)} /></Field>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <StepTitle title="Team & Operator" />
            <SummaryGrid items={[
              ['Operator', MOCK_OPERATOR_PROFILE.name],
              ['Operator type', MOCK_OPERATOR_PROFILE.type],
              ['Base location', MOCK_OPERATOR_PROFILE.city],
            ]} />
            <Field label="Operator track record"><textarea className={fieldClass} rows={4} value={operatorHistory} onChange={(event) => setOperatorHistory(event.target.value)} /></Field>
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <AvatarInitials name={member.name || 'Team Member'} />
                      <p className="text-sm font-semibold text-white">Team member {index + 1}</p>
                    </div>
                    {teamMembers.length > 1 && (
                      <button type="button" onClick={() => setTeamMembers((prev) => prev.filter((_, i) => i !== index))} className="text-rose-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Name"><input className={fieldClass} value={member.name} onChange={(event) => updateTeamMember(index, { name: event.target.value })} /></Field>
                    <Field label="Role"><input className={fieldClass} value={member.role} onChange={(event) => updateTeamMember(index, { role: event.target.value })} /></Field>
                    <div className="md:col-span-2"><Field label="Bio"><textarea className={fieldClass} rows={2} value={member.bio} onChange={(event) => updateTeamMember(index, { bio: event.target.value })} /></Field></div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setTeamMembers((prev) => [...prev, { name: '', role: '', bio: '' }])} className="inline-flex items-center gap-2 rounded-xl border border-teal-200/30 px-4 py-2 text-sm font-bold text-teal-100">
                <Plus className="h-4 w-4" /> Add team member
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <StepTitle title="Impact & ESG" />
            <button
              type="button"
              onClick={() => {
                setCo2AvoidedKg(unitCount * 1250)
                setGreenKm(unitCount * 15000)
                setTreesEquivalent(unitCount * 50)
                setEnergySavedKwh(unitCount * 420)
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200/30 px-4 py-2 text-sm font-bold text-emerald-100"
            >
              <Leaf className="h-4 w-4" /> Auto-suggest from selected units
            </button>
            <div className="grid gap-4 md:grid-cols-4">
              <Field label="CO2 avoided (kg)"><input type="number" className={fieldClass} value={co2AvoidedKg} onChange={(event) => setCo2AvoidedKg(Number(event.target.value))} /></Field>
              <Field label="Green km equivalent"><input type="number" className={fieldClass} value={greenKm} onChange={(event) => setGreenKm(Number(event.target.value))} /></Field>
              <Field label="Trees equivalent"><input type="number" className={fieldClass} value={treesEquivalent} onChange={(event) => setTreesEquivalent(Number(event.target.value))} /></Field>
              <Field label="Energy saved (kWh)"><input type="number" className={fieldClass} value={energySavedKwh} onChange={(event) => setEnergySavedKwh(Number(event.target.value))} /></Field>
            </div>
            <Field label="ESG narrative"><textarea className={fieldClass} rows={4} value={esgNarrative} onChange={(event) => setEsgNarrative(event.target.value)} /></Field>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <StepTitle title="Risk & Legal" />
            <Field label="Risk factors"><textarea className={fieldClass} rows={3} value={riskFactors} onChange={(event) => setRiskFactors(event.target.value)} /></Field>
            <Field label="Risk mitigations"><textarea className={fieldClass} rows={3} value={riskMitigations} onChange={(event) => setRiskMitigations(event.target.value)} /></Field>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <p className="text-sm leading-6 text-amber-100/82">Compliance review is required before this pool can be shown as approved to investors.</p>
              </div>
            </div>
            <div className="space-y-3">
              {legalDocs.map((doc, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 md:grid-cols-[1fr_1fr_150px_auto]">
                  <input className={fieldClass} value={doc.title} onChange={(event) => updateLegalDoc(index, { title: event.target.value })} placeholder="Document title" />
                  <input className={fieldClass} value={doc.url} onChange={(event) => updateLegalDoc(index, { url: event.target.value })} placeholder="URL" />
                  <select className={fieldClass} value={doc.type} onChange={(event) => updateLegalDoc(index, { type: event.target.value as LegalDoc['type'] })}>
                    <option value="PDF">PDF</option>
                    <option value="legal">Legal</option>
                    <option value="report">Report</option>
                  </select>
                  <button type="button" onClick={() => setLegalDocs((prev) => prev.filter((_, i) => i !== index))} className="rounded-xl border border-rose-200/20 px-3 text-rose-200">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setLegalDocs((prev) => [...prev, { title: '', url: '', type: 'PDF' }])} className="inline-flex items-center gap-2 rounded-xl border border-teal-200/30 px-4 py-2 text-sm font-bold text-teal-100">
                <FileText className="h-4 w-4" /> Add document
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <StepTitle title="Review & Submit" />
            <SummaryGrid items={[
              ['Pool', poolName],
              ['Product', PRODUCT_LABELS[productType]],
              ['Assets', `${unitCount} units`],
              ['Target raise', formatIDRXFull(targetSupply)],
              ['Cash yield APY', `${cashYieldApy}%`],
              ['Projected Rp 1M annual cash', formatIDRXFull(projectedOneMillion)],
              ['Status after submit', 'pending_approval'],
            ]} />
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <p className="mb-3 text-sm font-semibold text-white">Split breakdown</p>
              <div className="space-y-2">
                {(Object.keys(SPLIT_LABELS) as SplitKey[]).map((key) => (
                  <div key={key} className="grid grid-cols-[180px_1fr_52px] items-center gap-3 text-xs text-white/60">
                    <span>{SPLIT_LABELS[key]}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-white/[0.08]"><span className="block h-full rounded-full bg-teal-300" style={{ width: `${split[key]}%` }} /></span>
                    <span className="text-right font-semibold text-white">{split[key]}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <p className="mb-3 text-sm font-semibold text-white">Asset list summary</p>
              <div className="grid gap-2 md:grid-cols-2">
                {selectedAssets.slice(0, 8).map((asset) => (
                  <p key={asset.id} className="rounded-xl bg-[#050606] px-3 py-2 font-mono text-xs text-teal-100">{asset.unitId} - {asset.brand} {asset.model}</p>
                ))}
              </div>
              {selectedAssets.length > 8 && <p className="mt-3 text-xs text-white/42">+{selectedAssets.length - 8} more assets</p>}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between border-t border-white/10 pt-6">
          <button type="button" onClick={() => setStep((prev) => Math.max(1, prev - 1))} disabled={step === 1 || submitting} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white/50 transition hover:bg-white/5 hover:text-white disabled:opacity-30">
            Back
          </button>
          {step < 7 ? (
            <button type="button" onClick={() => setStep((prev) => Math.min(7, prev + 1))} disabled={!canContinue} className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-2.5 text-sm font-bold text-teal-950 transition hover:bg-teal-300 disabled:opacity-40">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting || splitTotal !== 100 || unitCount === 0} className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-2.5 text-sm font-bold text-teal-950 transition hover:bg-teal-300 disabled:opacity-40">
              {submitting ? 'Submitting...' : 'Submit for Review'} <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </Panel>
    </div>
  )
}

function StepTitle({ title }: { title: string }) {
  return (
    <div>
      <Eyebrow>Blueprint step</Eyebrow>
      <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  )
}

function SummaryGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/36">{label}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-white">{value}</p>
        </div>
      ))}
    </div>
  )
}
