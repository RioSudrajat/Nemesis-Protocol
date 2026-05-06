'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronRight, LayoutDashboard, PlusCircle, Target, ArrowRight, ShieldCheck, FileText, AlertTriangle } from 'lucide-react'
import { useNemesisStore } from '@/store/useNemesisStore'

const fieldClass =
  'w-full rounded-2xl border border-white/[0.08] bg-[#050606] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/24 focus:border-teal-200/40 focus:bg-[#080A0A] focus:ring-4 focus:ring-teal-200/[0.06]'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">{children}</p>
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{children}</label>
}

export default function CreateCampaignWizard() {
  const router = useRouter()
  const { createPool, assets } = useNemesisStore()

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  // Step 1: Asset Class & Collateral
  const [poolType, setPoolType] = useState('mobility_credit')
  const [poolName, setPoolName] = useState('')
  const [operatorId, setOperatorId] = useState('nemesis_native')
  const [targetRaise, setTargetRaise] = useState('1000000000') // 1M IDR
  const [collateralDesc, setCollateralDesc] = useState('100 units of Mobility EVs')

  // Step 2: Deal Terms
  const [performanceTargetYield, setPerformanceTargetYield] = useState('15') // 15%
  const [performanceCurrentYield, setPerformanceCurrentYield] = useState('0')
  const [revenueSplitOperator, setRevenueSplitOperator] = useState('20')
  const [revenueSplitInvestor, setRevenueSplitInvestor] = useState('80')

  // Step 3: Performance Assumptions
  const [yieldAssumptionPerUnit, setYieldAssumptionPerUnit] = useState('50000') // 50k IDR/day
  const [impactEstCO2, setImpactEstCO2] = useState('5000') // kg
  const [impactUnitsFunded, setImpactUnitsFunded] = useState('100')

  // Step 4: Project & Risk Context
  const [overviewTitle, setOverviewTitle] = useState('Fleet Expansion in Jakarta')
  const [overviewContent, setOverviewContent] = useState('We are expanding the fleet to cover more areas.')
  const [riskDesc, setRiskDesc] = useState('Battery degradation, accident risk.')
  const [riskMitigation, setRiskMitigation] = useState('Comprehensive insurance and battery swap network.')

  // Step 5: Legal
  const [doc1Name, setDoc1Name] = useState('Offering Memorandum')
  const [doc1Url, setDoc1Url] = useState('https://example.com/om.pdf')
  
  const handleNext = () => setStep(prev => prev + 1)
  const handleBack = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    setSubmitting(true)
    
    // Construct the pool object
    const newPool = {
      id: `pool-${Date.now()}`,
      name: poolName,
      managedBy: operatorId,
      type: poolType as 'mobility_credit' | 'fleet_remittance' | 'charging_yield' | 'energy_yield',
      status: 'pending_approval' as const, // ReFiHub style moderation
      targetSupply: parseFloat(targetRaise),
      currentRaised: 0,
      minInvestment: 50000,
      maxInvestment: parseFloat(targetRaise) * 0.1, // 10% max
      collateralDescription: collateralDesc,

      performanceTargetYield: parseFloat(performanceTargetYield),
      operatorBaseFeePct: parseFloat(revenueSplitOperator),

      unitCount: parseInt(impactUnitsFunded),
      impactProjections: {
        co2SavedKg: parseFloat(impactEstCO2),
        treesPlanted: 0,
        evEquivalents: 0
      },

      projectOverview: overviewTitle + '\n' + overviewContent,
      riskDisclosure: riskDesc,

      documents: [
        {
          title: doc1Name,
          url: doc1Url,
          type: 'legal' as const
        }
      ]
    }

    // Save to global store
    createPool(newPool as any)

    await new Promise(r => setTimeout(r, 1500))
    setSubmitting(false)
    router.push('/admin/pools') // Redirect to admin or operator dashboard
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-12">
      <div>
        <Eyebrow>Pool Assembly</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Create New Campaign</h1>
        <p className="mt-2 text-sm text-white/50">Draft a new funding pool and submit it for compliance review.</p>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-white/40 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`flex items-center gap-2 ${step === s ? 'text-teal-200' : (step > s ? 'text-white/80' : '')}`}>
            <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${step === s ? 'border-teal-200/30 bg-teal-200/10' : (step > s ? 'border-white/20 bg-white/10' : 'border-white/10')}`}>
              {s}
            </div>
            {s < 5 && <ChevronRight className="h-3 w-3 opacity-50" />}
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-white/[0.08] bg-[#070808] p-6 shadow-2xl">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold text-white mb-6">Step 1: Asset Class & Collateral</h2>
            <div className="space-y-4">
              <div>
                <FieldLabel>Pool Name</FieldLabel>
                <input type="text" className={fieldClass} value={poolName} onChange={e => setPoolName(e.target.value)} placeholder="e.g. Jakarta E-Bike Expansion Q3" />
              </div>
              <div>
                <FieldLabel>Asset Class Type</FieldLabel>
                <select className={fieldClass} value={poolType} onChange={e => setPoolType(e.target.value)}>
                  <option value="mobility_credit">Mobility Credit (Rent-to-own EVs)</option>
                  <option value="fleet_remittance">Fleet Remittance (Delivery EVs)</option>
                  <option value="charging_yield">Charging Infrastructure Yield (Fast Charging/Swap)</option>
                  <option value="energy_yield">Energy Asset Yield (Solar/Storage)</option>
                </select>
              </div>
              <div>
                <FieldLabel>Target Raise (IDR)</FieldLabel>
                <input type="number" className={fieldClass} value={targetRaise} onChange={e => setTargetRaise(e.target.value)} />
              </div>
              <div>
                <FieldLabel>Collateral Description</FieldLabel>
                <input type="text" className={fieldClass} value={collateralDesc} onChange={e => setCollateralDesc(e.target.value)} placeholder="e.g. 100 units of Mobility EVs" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold text-white mb-6">Step 2: Deal Terms & Yield</h2>
            <div className="space-y-4">
              <div>
                <FieldLabel>Target Annual Yield (%)</FieldLabel>
                <input type="number" className={fieldClass} value={performanceTargetYield} onChange={e => setPerformanceTargetYield(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Operator Revenue Split (%)</FieldLabel>
                  <input type="number" className={fieldClass} value={revenueSplitOperator} onChange={e => setRevenueSplitOperator(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>Investor Revenue Split (%)</FieldLabel>
                  <input type="number" className={fieldClass} value={revenueSplitInvestor} onChange={e => setRevenueSplitInvestor(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold text-white mb-6">Step 3: Performance & Assumptions</h2>
            <div className="space-y-4">
              <div>
                <FieldLabel>Projected Yield Per Unit/Day (IDR)</FieldLabel>
                <input type="number" className={fieldClass} value={yieldAssumptionPerUnit} onChange={e => setYieldAssumptionPerUnit(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Est. CO2 Avoided (kg)</FieldLabel>
                  <input type="number" className={fieldClass} value={impactEstCO2} onChange={e => setImpactEstCO2(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>Units to be Funded</FieldLabel>
                  <input type="number" className={fieldClass} value={impactUnitsFunded} onChange={e => setImpactUnitsFunded(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold text-white mb-6">Step 4: Project Context & Risks</h2>
            <div className="space-y-4">
              <div>
                <FieldLabel>Overview Title</FieldLabel>
                <input type="text" className={fieldClass} value={overviewTitle} onChange={e => setOverviewTitle(e.target.value)} />
              </div>
              <div>
                <FieldLabel>Overview Description</FieldLabel>
                <textarea className={fieldClass} rows={3} value={overviewContent} onChange={e => setOverviewContent(e.target.value)} />
              </div>
              <div>
                <FieldLabel>Risk Factors</FieldLabel>
                <textarea className={fieldClass} rows={2} value={riskDesc} onChange={e => setRiskDesc(e.target.value)} />
              </div>
              <div>
                <FieldLabel>Risk Mitigation Strategy</FieldLabel>
                <textarea className={fieldClass} rows={2} value={riskMitigation} onChange={e => setRiskMitigation(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold text-white mb-6">Step 5: Legal & Documents</h2>
            <div className="space-y-4">
              <div>
                <FieldLabel>Document Title</FieldLabel>
                <input type="text" className={fieldClass} value={doc1Name} onChange={e => setDoc1Name(e.target.value)} />
              </div>
              <div>
                <FieldLabel>Document URL</FieldLabel>
                <input type="text" className={fieldClass} value={doc1Url} onChange={e => setDoc1Url(e.target.value)} />
              </div>
              
              <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-400">Compliance Review Required</h3>
                    <p className="mt-1 text-xs text-amber-400/80">
                      Upon submission, this campaign will be set to PENDING_APPROVAL. An administrator must review the legal documents and parameters before it becomes visible to investors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between border-t border-white/10 pt-6">
          <button
            onClick={handleBack}
            disabled={step === 1 || submitting}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white/50 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
          >
            Back
          </button>
          
          {step < 5 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-2.5 text-sm font-bold text-teal-950 transition hover:bg-teal-300"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-2.5 text-sm font-bold text-teal-950 transition hover:bg-teal-300 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit for Review'} <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
