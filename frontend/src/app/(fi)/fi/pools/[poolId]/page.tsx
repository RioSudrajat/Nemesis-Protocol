"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Shield, WalletCards, Leaf, Activity } from "lucide-react";
import { MOCK_YIELD_DISTRIBUTIONS } from "@/data/pools";
import { calculateReturn, formatIDRXFull, formatNumber } from "@/lib/yield";
import { selectAssetsByPool, useNemesisStore } from "@/store/useNemesisStore";
import { PoolSidebar } from "@/components/fi/PoolSidebar";
import { AvatarInitials } from "@/components/ui/AvatarInitials";
import { ReportsTab } from "@/components/fi/ReportsTab";

type TabKey = "overview" | "reports" | "details" | "impact" | "calculate" | "documents";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "reports", label: "Reports" },
  { key: "details", label: "Details" },
  { key: "impact", label: "Impact" },
  { key: "calculate", label: "Calculate" },
  { key: "documents", label: "Documents" },
];

export default function PoolDetailPage({ params }: { params: Promise<{ poolId: string }> }) {
  const { poolId } = use(params);
  const nemesisState = useNemesisStore();
  const { pools, poolReports } = nemesisState;
  const pool = pools.find((item) => item.id === poolId);
  const poolAssets = pool ? selectAssetsByPool(nemesisState, pool.id) : [];
  const teamMembers = pool?.teamMembers?.length
    ? pool.teamMembers
    : [{ name: pool?.managedBy ?? "Nemesis Protocol", role: "Pool Operator", bio: pool?.operatorHistory ?? "Verified Nemesis operator." }];
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [investAmount, setInvestAmount] = useState(1_000_000);
  const [performancePct, setPerformancePct] = useState(100);

  const reports = pool
    ? poolReports
        .filter((report) => report.poolId === pool.id && report.isPublished)
        .sort((a, b) => b.period.localeCompare(a.period))
    : [];
  const distributions = pool ? MOCK_YIELD_DISTRIBUTIONS[pool.id] ?? [] : [];
  const calc = pool ? calculateReturn(pool, investAmount, performancePct) : null;

  if (!pool || !calc) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-6 text-zinc-950 md:p-8">
        <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-zinc-950/10 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Pool not found</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950">This financing pool does not exist.</h1>
          <Link href="/fi" className="mt-6 inline-flex rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white">
            Back to FI pools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 text-zinc-950 md:p-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm font-semibold text-zinc-500">
            <li><Link href="/fi" className="hover:text-zinc-950">FI Earn</Link></li>
            <li><svg className="h-4 w-4 text-zinc-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
            <li><Link href="/fi" className="hover:text-zinc-950">Pools</Link></li>
            <li><svg className="h-4 w-4 text-zinc-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></li>
            <li className="text-zinc-900" aria-current="page">{pool.name}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          {/* Main Content Area */}
          <div className="min-w-0">
            <div className="mb-8 border-b border-zinc-950/10">
              <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                {TABS.map((tab) => {
                  const active = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`
                        whitespace-nowrap border-b-2 py-4 px-1 text-sm font-bold transition-colors
                        ${active ? "border-teal-600 text-teal-700" : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"}
                      `}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-8">
              {activeTab === "overview" && (
                <>
                  <Card title="Economics Overview" icon={<WalletCards className="h-5 w-5" />}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <Metric label="Target APY" value={`${pool.performanceTargetYield}%`} />
                      <Metric label="Collateral" value={pool.collateralDescription || "Revenue Contract"} />
                      <Metric label="Min Invest" value={`Rp ${formatNumber(pool.minInvestment || 50000)}`} />
                      <Metric label="Units" value={`${pool.unitCount || 0}`} />
                    </div>
                    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Revenue Split (per unit/mo)</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Investor Cash Yield</span>
                          <span className="font-semibold text-teal-700">{pool.cashYieldPct}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Principal Recovery</span>
                          <span className="font-semibold text-teal-700">{pool.principalRecoveryPct}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Maintenance Reserve</span>
                          <span className="font-semibold text-zinc-950">{pool.maintenanceReservePct || 10}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Operator Fees</span>
                          <span className="font-semibold text-zinc-950">{pool.operatorBaseFeePct + pool.operatorPerformanceFeePct}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-600">Protocol Fee</span>
                          <span className="font-semibold text-zinc-950">{pool.protocolFeePct}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  <Card title={"Project Overview"} icon={<CheckCircle2 className="h-5 w-5" />}>
                    <p className="text-zinc-600 leading-8 text-base">{pool.projectOverview || pool.description}</p>
                  </Card>
                  
                  <Card title={"Delivery Timeline"} icon={<Activity className="h-5 w-5" />}>
                    <div className="relative pl-6 border-l-2 border-zinc-100 space-y-6 py-2">
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-teal-500 ring-4 ring-white" />
                        <h4 className="text-sm font-bold text-zinc-950">Capital Deployed</h4>
                        <p className="text-sm text-zinc-500 mt-1">{pool.deliveryTimeline?.startDate ?? "Funds locked and verified on-chain. Vehicles procured."}</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-teal-500 ring-4 ring-white" />
                        <h4 className="text-sm font-bold text-zinc-950">Assets Activated</h4>
                        <p className="text-sm text-zinc-500 mt-1">{poolAssets.length} assets locked to this pool.</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-zinc-200 ring-4 ring-white" />
                        <h4 className="text-sm font-bold text-zinc-400">First Yield Distribution</h4>
                        <p className="text-sm text-zinc-400 mt-1">Expected: {pool.deliveryTimeline?.firstPayoutDate ?? new Date(pool.nextDistribution).toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </Card>

                  <Card title="Asset Details" icon={<Activity className="h-5 w-5" />}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-zinc-50 text-left text-xs uppercase tracking-[0.12em] text-zinc-500">
                          <tr>
                            <th className="px-4 py-3">Unit</th>
                            <th className="px-4 py-3">Model</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Health</th>
                            <th className="px-4 py-3">Capex</th>
                          </tr>
                        </thead>
                        <tbody>
                          {poolAssets.slice(0, 12).map((asset) => (
                            <tr key={asset.id} className="border-t border-zinc-950/5">
                              <td className="px-4 py-3 font-mono text-xs font-bold text-teal-700">{asset.unitId}</td>
                              <td className="px-4 py-3 text-zinc-700">{asset.brand} {asset.model}</td>
                              <td className="px-4 py-3 capitalize text-zinc-600">{asset.status}</td>
                              <td className="px-4 py-3 font-semibold text-zinc-950">{asset.healthScore}/100</td>
                              <td className="px-4 py-3 text-zinc-600">{formatIDRXFull(asset.financedCost)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {poolAssets.length === 0 && <p className="py-8 text-center text-sm text-zinc-500">No assets are currently locked to this pool.</p>}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "reports" && (
                <div className="space-y-6">
                  <Card title="Distribution History" icon={<FileText className="h-5 w-5" />}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-zinc-50 text-left text-xs uppercase tracking-[0.12em] text-zinc-500">
                          <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Cash yield</th>
                            <th className="px-4 py-3">Principal returned</th>
                            <th className="px-4 py-3">Reserve delta</th>
                            <th className="px-4 py-3">Health</th>
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
                  
                  <ReportsTab reports={reports} />
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  <Card title="Problem Statement" icon={<Shield className="h-5 w-5" />}>
                    <p className="text-zinc-600 leading-8">{pool.problemStatement}</p>
                  </Card>
                  <Card title="Solution Strategy" icon={<CheckCircle2 className="h-5 w-5" />}>
                    <p className="text-zinc-600 leading-8">{pool.solutionStrategy || "Implementation of high-efficiency EV infrastructure with real-time telemetry."}</p>
                  </Card>
                  <Card title="Operator & Team" icon={<Shield className="h-5 w-5" />}>
                    <div className="mb-6 space-y-4 rounded-2xl bg-zinc-50 p-5">
                      <Info label="Managed By" value={pool.managedBy} />
                      <Info label="Operator Type" value={pool.operatorType} />
                      <Info label="Location" value={pool.locationLabel} />
                    </div>
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-zinc-950 mb-2">Operator History</h4>
                      <p className="text-zinc-600 leading-7 text-sm">{pool.operatorHistory}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-950 mb-4">Core Team</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {teamMembers.map((member, i) => (
                          <div key={i} className="flex gap-4 p-4 rounded-xl border border-zinc-100 bg-white">
                            <AvatarInitials name={member.name} size="lg" />
                            <div>
                              <p className="font-bold text-zinc-950 text-sm">{member.name}</p>
                              <p className="text-xs font-semibold text-teal-700 mb-1">{member.role}</p>
                              <p className="text-xs text-zinc-500 leading-relaxed">{member.bio}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                  <Card title="Risk Disclosure" icon={<Shield className="h-5 w-5" />}>
                    <p className="text-zinc-600 leading-8 text-sm">{pool.riskDisclosure || "This investment involves significant risk. The returns are tied directly to the operational performance of the underlying assets. Maintenance delays, driver defaults, or macroeconomic factors could adversely affect yields."}</p>
                  </Card>
                </div>
              )}

              {activeTab === "impact" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-2xl bg-emerald-50 p-5 border border-emerald-100">
                      <Leaf className="h-6 w-6 text-emerald-600 mb-3" />
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-800/60 mb-1">CO2 Avoided</p>
                      <p className="text-2xl font-bold text-emerald-900">{pool.impactProjections?.co2SavedKg?.toLocaleString() || 0} <span className="text-sm font-semibold">kg</span></p>
                    </div>
                    <div className="rounded-2xl bg-teal-50 p-5 border border-teal-100">
                      <Activity className="h-6 w-6 text-teal-600 mb-3" />
                      <p className="text-xs font-bold uppercase tracking-widest text-teal-800/60 mb-1">Green Dist.</p>
                      <p className="text-2xl font-bold text-teal-900">{formatNumber(pool.impactProjections?.greenKm ?? 0)} <span className="text-sm font-semibold">km</span></p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-5 border border-amber-100">
                      <Leaf className="h-6 w-6 text-amber-600 mb-3" />
                      <p className="text-xs font-bold uppercase tracking-widest text-amber-800/60 mb-1">Energy Saved</p>
                      <p className="text-2xl font-bold text-amber-900">{formatNumber(pool.impactProjections?.energySavedKwh ?? 0)} <span className="text-sm font-semibold">kWh</span></p>
                    </div>
                    <div className="rounded-2xl bg-green-50 p-5 border border-green-100">
                      <Leaf className="h-6 w-6 text-green-600 mb-3" />
                      <p className="text-xs font-bold uppercase tracking-widest text-green-800/60 mb-1">Tree Equivalent</p>
                      <p className="text-2xl font-bold text-green-900">{formatNumber(pool.impactProjections?.treesPlanted ?? 0)} <span className="text-sm font-semibold">trees</span></p>
                    </div>
                  </div>
                  <Card title="ESG Narrative" icon={<Leaf className="h-5 w-5" />}>
                    <p className="text-zinc-600 leading-8">
                      {pool.esgNarrative || "By funding this pool, investors directly contribute to the electrification of urban logistics. Each deployed vehicle replaces an ICE equivalent, leading to measurable reductions in urban air pollution and greenhouse gas emissions while providing independent operators with higher take-home pay."}
                    </p>
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
                    <div className="col-span-full rounded-2xl border border-dashed border-zinc-200 text-center text-zinc-500 p-12">
                      No documents available yet.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "calculate" && (
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
                    <p className="mt-2 text-sm font-semibold text-teal-700">{performancePct}% collection performance</p>
                  </Card>
                  <Card title="Projected cash distribution" icon={<ArrowRight className="h-5 w-5" />}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Metric label="Monthly cash yield" value={formatIDRXFull(calc.monthlyCashYieldIDRX)} />
                      <Metric label="Monthly principal" value={formatIDRXFull(calc.monthlyPrincipalRecoveryIDRX)} />
                      <Metric label="Annual cash total" value={formatIDRXFull(calc.annualCashDistributionIDRX)} />
                      <Metric label="Yr-1 remaining principal" value={formatIDRXFull(calc.remainingPrincipalAfterYearOne)} />
                      <Metric label="Maturity settlement" value={formatIDRXFull(calc.maturitySettlementIDRX)} />
                      <Metric label="Total annual cash" value={`${calc.totalAnnualCashDistributionPct}%`} />
                    </div>
                    <p className="mt-5 rounded-xl bg-zinc-50 p-4 text-xs leading-5 text-zinc-500 border border-zinc-100">
                      The total cash distribution includes principal recovery. It should not be marketed as pure yield.
                    </p>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div>
            <PoolSidebar pool={pool} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="rounded-[1.75rem] border border-zinc-950/10 bg-white p-6 md:p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-4 border-b border-zinc-100 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50/50 text-teal-600 border border-teal-100/50">{icon}</div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-950">{title}</h2>
      </div>
      {children}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-zinc-950 tracking-tight">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-zinc-100 last:border-0">
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="text-sm font-bold text-zinc-950 text-right max-w-[200px] truncate">{value}</p>
    </div>
  );
}
