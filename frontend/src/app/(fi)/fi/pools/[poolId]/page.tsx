"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Shield, WalletCards } from "lucide-react";
import { MOCK_YIELD_DISTRIBUTIONS } from "@/data/pools";
import { calculateReturn, formatIDRXFull, formatNumber } from "@/lib/yield";
import { useNemesisStore } from "@/store/useNemesisStore";

type TabKey = "deal_terms" | "performance" | "risks" | "asset_operator" | "documents" | "calculator";

const TABS: { key: TabKey; label: string }[] = [
  { key: "deal_terms", label: "Deal Terms" },
  { key: "performance", label: "Performance" },
  { key: "risks", label: "Risks" },
  { key: "asset_operator", label: "Asset & Operator" },
  { key: "documents", label: "Documents" },
  { key: "calculator", label: "Calculator" },
];

export default function PoolDetailPage({ params }: { params: Promise<{ poolId: string }> }) {
  const { poolId } = use(params);
  const { pools } = useNemesisStore();
  const pool = pools.find((item) => item.id === poolId) ?? pools[0];
  const [activeTab, setActiveTab] = useState<TabKey>("deal_terms");
  const [investAmount, setInvestAmount] = useState(1_000_000);
  const [performancePct, setPerformancePct] = useState(100);

  const distributions = MOCK_YIELD_DISTRIBUTIONS[pool.id] ?? [];
  const pctFilled = Math.min(100, Math.round((pool.totalSupplied / pool.targetSupply) * 100));
  const calc = useMemo(
    () => calculateReturn(pool, investAmount, performancePct),
    [investAmount, performancePct, pool],
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 text-zinc-950 md:p-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm font-semibold text-zinc-500">
            <li>
              <Link href="/fi" className="hover:text-zinc-950">FI Earn</Link>
            </li>
            <li>
              <svg className="h-4 w-4 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <Link href="/fi" className="hover:text-zinc-950">Pools</Link>
            </li>
            <li>
              <svg className="h-4 w-4 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-zinc-900" aria-current="page">
              {pool.name}
            </li>
          </ol>
        </nav>

        <section className="mb-6 rounded-[2rem] border border-zinc-950/10 bg-white p-6 shadow-sm md:p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">{pool.productLabel}</p>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-zinc-950 md:text-6xl">{pool.name}</h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-600">{pool.description}</p>
            </div>
            <div className="rounded-3xl bg-teal-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800">Investor economics</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Metric label="Cash yield" value={`${pool.cashYieldPct}%`} />
                <Metric label="Principal" value={`${pool.principalRecoveryPct}%`} />
                <Metric label="Total cash" value={`${pool.totalAnnualCashDistributionPct}%`} />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Capital supplied", value: formatIDRXFull(pool.totalSupplied) },
            { label: "Target", value: formatIDRXFull(pool.targetSupply) },
            { label: "Filled", value: `${pctFilled}%` },
            { label: "Next distribution", value: new Date(pool.nextDistribution).toLocaleDateString("id-ID") },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-zinc-950/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">{stat.label}</p>
              <p className="mt-2 text-lg font-bold text-zinc-950">{stat.value}</p>
            </div>
          ))}
        </section>

        <div className="mb-8 border-b border-zinc-950/10">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold transition-colors
                    ${active 
                      ? "border-teal-600 text-teal-700" 
                      : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"}
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {activeTab === "deal_terms" && (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card title="Economics" icon={<WalletCards className="h-5 w-5" />}>
              <div className="space-y-4">
                <Info label="Target APY" value={`${pool.performanceTargetYield}%`} />
                <Info label="Revenue Split (Op/Inv)" value={`${100 - pool.protocolFeePct - pool.operatorBaseFeePct - pool.operatorPerformanceFeePct}% / ${pool.cashYieldPct + pool.principalRecoveryPct}%`} />
                <Info label="Min Investment" value={`Rp ${(pool.minInvestment || 50000).toLocaleString('id-ID')}`} />
                <Info label="Collateral Type" value={pool.collateralDescription || "Revenue Contract"} />
              </div>
            </Card>
            <Card title="Impact Projections" icon={<Shield className="h-5 w-5" />}>
              <div className="space-y-4">
                <Info label="Estimated CO2 Avoided" value={`${pool.impactProjections?.co2SavedKg?.toLocaleString() || 0} kg`} />
                <Info label="Units Funded" value={`${pool.unitCount || 0} units`} />
              </div>
            </Card>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="grid gap-6">
            <Card title="Recent distributions" icon={<FileText className="h-5 w-5" />}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 text-left text-xs uppercase tracking-[0.12em] text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Cash yield</th>
                      <th className="px-4 py-3">Principal returned</th>
                      <th className="px-4 py-3">Reserve delta</th>
                      <th className="px-4 py-3">Collection health</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributions.map((dist) => (
                      <tr key={dist.id} className="border-t border-zinc-950/5">
                        <td className="px-4 py-3 text-zinc-600">{new Date(dist.date).toLocaleDateString("id-ID")}</td>
                        <td className="px-4 py-3 font-semibold text-teal-700">{formatIDRXFull(dist.yieldDistributed)}</td>
                        <td className="px-4 py-3 font-semibold text-zinc-950">{formatIDRXFull(dist.principalReturned)}</td>
                        <td className="px-4 py-3 text-zinc-600">{formatIDRXFull(dist.reserveDelta)}</td>
                        <td className="px-4 py-3 text-zinc-600">{dist.collectionHealthPct.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card title="Periodic Performance Reports" icon={<FileText className="h-5 w-5" />}>
               <div className="grid gap-4 md:grid-cols-2">
                {(pool.documents || []).filter(d => d.type === 'report' || d.title.includes('Report')).map((doc, idx) => (
                  <a key={idx} href={doc.url} className="group flex flex-col rounded-2xl border border-zinc-950/10 bg-white p-6 shadow-sm transition hover:border-teal-500/30">
                    <FileText className="mb-4 h-6 w-6 text-teal-700" />
                    <h3 className="text-lg font-bold text-zinc-950 group-hover:text-teal-700 transition-colors">{doc.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1 capitalize">{doc.type} Document • {doc.size}</p>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "asset_operator" && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <Card title={"Project Overview"} icon={<CheckCircle2 className="h-5 w-5" />}>
                <p className="text-zinc-600 leading-7">{pool.projectOverview || pool.description}</p>
              </Card>
              <Card title={"Problem Statement"} icon={<Shield className="h-5 w-5" />}>
                <p className="text-zinc-600 leading-7">{pool.problemStatement}</p>
              </Card>
            </div>
            <div className="space-y-6">
               <Card title="Operator Information" icon={<Shield className="h-5 w-5" />}>
                <div className="space-y-4">
                  <Info label="Managed By" value={pool.managedBy} />
                  <Info label="Operator Type" value={pool.operatorType} />
                  <Info label="Location" value={pool.locationLabel} />
                </div>
              </Card>
              <Card title="Operator History" icon={<Shield className="h-5 w-5" />}>
                 <p className="text-zinc-600 leading-7">{pool.operatorHistory}</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "risks" && (
          <div className="grid gap-6">
            <Card title="Risk Disclosure" icon={<Shield className="h-5 w-5" />}>
              <p className="text-zinc-600 leading-7">{pool.riskDisclosure || "No risk factors listed."}</p>
            </Card>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="grid gap-4 md:grid-cols-2">
            {(pool.documents || []).map((doc, idx) => (
              <a key={idx} href={doc.url} className="group flex flex-col rounded-2xl border border-zinc-950/10 bg-white p-6 shadow-sm transition hover:border-teal-500/30">
                <FileText className="mb-4 h-6 w-6 text-teal-700" />
                <h3 className="text-lg font-bold text-zinc-950 group-hover:text-teal-700 transition-colors">{doc.title}</h3>
                <p className="text-sm text-zinc-500 mt-1 capitalize">{doc.type} Document • {doc.size}</p>
              </a>
            ))}
            {(!pool.documents || pool.documents.length === 0) && (
              <div className="col-span-full text-center text-zinc-500 py-8">
                No documents available.
              </div>
            )}
          </div>
        )}

        {activeTab === "calculator" && (
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <Card title="Investment input" icon={<WalletCards className="h-5 w-5" />}>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Investment amount</label>
              <input
                type="number"
                value={investAmount}
                min={pool.minInvestment}
                step={100_000}
                onChange={(event) => setInvestAmount(Number(event.target.value))}
                className="mb-5 w-full rounded-2xl border border-zinc-950/10 bg-white px-4 py-3 text-lg font-bold outline-none focus:border-teal-500"
              />
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">Collection / performance assumption</label>
              <input
                type="range"
                value={performancePct}
                min={70}
                max={110}
                onChange={(event) => setPerformancePct(Number(event.target.value))}
                className="w-full accent-teal-600"
              />
              <p className="mt-2 text-sm text-zinc-600">{performancePct}% collection performance</p>
            </Card>
            <Card title="Projected cash distribution" icon={<ArrowRight className="h-5 w-5" />}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Metric label="Monthly cash yield" value={formatIDRXFull(calc.monthlyCashYieldIDRX)} />
                <Metric label="Monthly principal recovery" value={formatIDRXFull(calc.monthlyPrincipalRecoveryIDRX)} />
                <Metric label="Annual cash distribution" value={formatIDRXFull(calc.annualCashDistributionIDRX)} />
                <Metric label="Year-1 remaining principal" value={formatIDRXFull(calc.remainingPrincipalAfterYearOne)} />
                <Metric label="Maturity settlement" value={formatIDRXFull(calc.maturitySettlementIDRX)} />
                <Metric label="Total annual cash" value={`${calc.totalAnnualCashDistributionPct}%`} />
              </div>
              <p className="mt-5 text-xs leading-5 text-zinc-500">
                The total cash distribution includes principal recovery. It should not be marketed as pure yield.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="rounded-[1.75rem] border border-zinc-950/10 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">{icon}</div>
        <h2 className="text-xl font-bold text-zinc-950">{title}</h2>
      </div>
      {children}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-zinc-950">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-950">{value}</p>
    </div>
  );
}
