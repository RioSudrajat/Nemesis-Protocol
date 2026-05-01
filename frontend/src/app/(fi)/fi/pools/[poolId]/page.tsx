"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Shield, WalletCards } from "lucide-react";
import { MOCK_POOLS, MOCK_YIELD_DISTRIBUTIONS } from "@/data/pools";
import { calculateReturn, formatIDRXFull, formatNumber } from "@/lib/yield";

type TabKey = "overview" | "report" | "proofs" | "calculator";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "report", label: "Report" },
  { key: "proofs", label: "Proofs" },
  { key: "calculator", label: "Calculator" },
];

export default function PoolDetailPage({ params }: { params: Promise<{ poolId: string }> }) {
  const { poolId } = use(params);
  const pool = MOCK_POOLS.find((item) => item.id === poolId) ?? MOCK_POOLS[0];
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
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
        <Link href="/fi" className="mb-5 inline-flex text-sm font-semibold text-zinc-500 hover:text-zinc-950">
          ← Back to FI pools
        </Link>

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

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
                style={{
                  background: active ? "#14B8A6" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#52525B",
                  border: active ? "1px solid #14B8A6" : "1px solid rgba(15,23,42,0.08)",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card title="Pool model" icon={<WalletCards className="h-5 w-5" />}>
              <div className="space-y-4">
                <Info label="Revenue model" value={pool.revenueModel} />
                <Info label="Tenor" value={`${pool.tenorMonths} months`} />
                <Info label="Operator" value={pool.managedBy} />
                <Info label="Reserve health" value={pool.reserveHealth} />
              </div>
            </Card>
            <Card title="Unit composition" icon={<Shield className="h-5 w-5" />}>
              <div className="grid gap-3">
                {pool.unitBreakdown.map((unit) => (
                  <div key={unit.label} className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
                    <span className="text-sm text-zinc-600">{unit.label}</span>
                    <span className="font-bold text-zinc-950">{formatNumber(unit.count)} units</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "report" && (
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
        )}

        {activeTab === "proofs" && (
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Proof of Asset", "VIN/serial mapping, operator identity, and deployment status verified."],
              ["Proof of Activity", "GPS daily route logs, active usage hours, route coverage, and movement segments."],
              ["Proof of Revenue", "Expected collection, actual payment, lateness, and arrears are tracked."],
              ["Proof of Maintenance", "Service events, reserve usage, and workshop proof keep assets productive."],
            ].map(([title, copy]) => (
              <article key={title} className="rounded-2xl border border-zinc-950/10 bg-white p-6 shadow-sm">
                <CheckCircle2 className="mb-5 h-6 w-6 text-teal-700" />
                <h3 className="text-xl font-bold text-zinc-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{copy}</p>
              </article>
            ))}
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
