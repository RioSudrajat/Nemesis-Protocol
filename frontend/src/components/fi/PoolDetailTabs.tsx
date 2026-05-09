"use client";

import { useState } from "react";
import { ArrowRight, FileText, Leaf, Shield, WalletCards } from "lucide-react";
import type { PoolReport, StakingPool, YieldDistribution } from "@/types/fi";
import type { RegisteredVehicle } from "@/types/rwa";
import { calculateReturn, formatIDRXFull, formatNumber } from "@/lib/yield";
import { PoolDealFlow } from "@/components/fi/PoolDealFlow";
import { PoolDistributionTimeline } from "@/components/fi/PoolDistributionTimeline";
import { ReportsTab } from "@/components/fi/ReportsTab";
import { AvatarInitials } from "@/components/ui/AvatarInitials";

interface PoolDetailTabsProps {
  pool: StakingPool;
  poolAssets: RegisteredVehicle[];
  reports: PoolReport[];
  distributions: YieldDistribution[];
  teamMembers: { name: string; role: string; bio: string }[];
}

type TabKey = "overview" | "details" | "reports" | "impact" | "calculate";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "details", label: "Details" },
  { key: "reports", label: "Reports" },
  { key: "impact", label: "Impact" },
  { key: "calculate", label: "Calculate" },
];

export function PoolDetailTabs({
  pool,
  poolAssets,
  reports,
  distributions,
  teamMembers,
}: PoolDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [investAmount, setInvestAmount] = useState(1_000_000);
  const [performancePct, setPerformancePct] = useState(100);

  const calc = calculateReturn(pool, investAmount, performancePct);

  const resolvedTeamMembers =
    teamMembers.length > 0
      ? teamMembers
      : [
          {
            name: pool.managedBy,
            role: "Pool Operator",
            bio: pool.operatorHistory ?? "Verified Nemesis operator.",
          },
        ];

  return (
    <div className="min-w-0">
      {/* Tab bar */}
      <div className="mb-6 border-b border-zinc-950/10">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Pool detail tabs">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-bold transition-colors ${
                  active
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Single card per tab */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-950/10">
        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div>
            <p className="text-zinc-600 leading-7 text-sm">{pool.projectOverview || pool.description}</p>

            <hr className="my-6 border-zinc-100" />

            {/* Pool economics as definition list */}
            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
              Pool Economics
            </h3>
            <dl className="divide-y divide-zinc-100">
              <div className="flex justify-between py-3 text-sm">
                <dt className="text-zinc-500">Target APY</dt>
                <dd className="font-semibold text-zinc-950">{pool.performanceTargetYield}%</dd>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <dt className="text-zinc-500">Collateral</dt>
                <dd className="font-semibold text-zinc-950">
                  {pool.collateralDescription || "Revenue Contract"}
                </dd>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <dt className="text-zinc-500">Min investment</dt>
                <dd className="font-semibold text-zinc-950">
                  Rp {formatNumber(pool.minInvestment)}
                </dd>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <dt className="text-zinc-500">Units</dt>
                <dd className="font-semibold text-zinc-950">{pool.unitCount}</dd>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <dt className="text-zinc-500">Tenor</dt>
                <dd className="font-semibold text-zinc-950">{pool.tenorMonths} months</dd>
              </div>
            </dl>

            <hr className="my-6 border-zinc-100" />

            <PoolDealFlow pool={pool} />
          </div>
        )}

        {/* ── Details ── */}
        {activeTab === "details" && (
          <div>
            {/* Team members */}
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
              Core Team
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {resolvedTeamMembers.map((member, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl border border-zinc-100 bg-zinc-50"
                >
                  <AvatarInitials name={member.name} size="lg" />
                  <div>
                    <p className="font-bold text-zinc-950 text-sm">{member.name}</p>
                    <p className="text-xs font-semibold text-teal-700 mb-1">{member.role}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-6 border-zinc-100" />

            {/* Linked assets */}
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
              Linked Assets
            </h3>
            {poolAssets.length === 0 ? (
              <p className="text-sm text-zinc-400">No assets linked to this pool yet.</p>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {poolAssets.map((asset) => (
                  <li key={asset.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-semibold text-zinc-950">
                        {asset.brand} {asset.model} ({asset.year})
                      </p>
                      <p className="text-xs text-zinc-500">{asset.unitId}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        asset.status === "active"
                          ? "bg-teal-50 text-teal-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {asset.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {pool.documents && pool.documents.length > 0 && (
              <>
                <hr className="my-6 border-zinc-100" />
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                  Documents
                </h3>
                <ul className="space-y-3">
                  {pool.documents.map((doc, idx) => (
                    <li key={idx}>
                      <a
                        href={doc.url}
                        className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-teal-500/30 hover:text-teal-700"
                      >
                        <FileText className="h-4 w-4 shrink-0 text-teal-600" />
                        <span className="flex-1">{doc.title}</span>
                        <span className="text-xs text-zinc-400">
                          {doc.type} · {doc.size}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* ── Reports ── */}
        {activeTab === "reports" && (
          <div>
            <ReportsTab reports={reports} />
            <hr className="my-6 border-zinc-100" />
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
              Distribution History
            </h3>
            <PoolDistributionTimeline distributions={distributions} />
          </div>
        )}

        {/* ── Impact ── */}
        {activeTab === "impact" && (
          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
              Impact Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-emerald-50 p-5 border border-emerald-100">
                <Leaf className="h-5 w-5 text-emerald-600 mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-800/60 mb-1">
                  CO2 Avoided
                </p>
                <p className="text-2xl font-bold text-emerald-900">
                  {(pool.impactProjections?.co2SavedKg ?? 0).toLocaleString()}{" "}
                  <span className="text-sm font-semibold">kg</span>
                </p>
              </div>
              <div className="rounded-2xl bg-teal-50 p-5 border border-teal-100">
                <Leaf className="h-5 w-5 text-teal-600 mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest text-teal-800/60 mb-1">
                  Green Dist.
                </p>
                <p className="text-2xl font-bold text-teal-900">
                  {formatNumber(pool.impactProjections?.greenKm ?? 0)}{" "}
                  <span className="text-sm font-semibold">km</span>
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-5 border border-amber-100">
                <Leaf className="h-5 w-5 text-amber-600 mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest text-amber-800/60 mb-1">
                  Energy Saved
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {formatNumber(pool.impactProjections?.energySavedKwh ?? 0)}{" "}
                  <span className="text-sm font-semibold">kWh</span>
                </p>
              </div>
            </div>

            {pool.esgNarrative && (
              <>
                <hr className="my-6 border-zinc-100" />
                <p className="text-sm leading-7 text-zinc-600">{pool.esgNarrative}</p>
              </>
            )}

            <hr className="my-6 border-zinc-100" />

            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
              Risk Disclosure
            </h3>
            <p className="text-sm leading-7 text-zinc-600">
              {pool.riskDisclosure ||
                "This investment involves significant risk. The returns are tied directly to the operational performance of the underlying assets."}
            </p>

            <hr className="my-6 border-zinc-100" />

            <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
              Reserve Health
            </h3>
            <div className="flex items-center gap-3 rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3">
              <Shield className="h-4 w-4 text-teal-600 shrink-0" />
              <p className="text-sm text-zinc-700">{pool.reserveHealth}</p>
            </div>
          </div>
        )}

        {/* ── Calculate ── */}
        {activeTab === "calculate" && (
          <div>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              {/* Inputs */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <WalletCards className="h-5 w-5 text-teal-600" />
                  <h3 className="text-sm font-black text-zinc-950">Investment input</h3>
                </div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Investment amount
                </label>
                <input
                  type="number"
                  value={investAmount}
                  min={pool.minInvestment}
                  step={100_000}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  className="mb-5 w-full rounded-2xl border border-zinc-950/10 bg-white px-4 py-3 text-lg font-bold outline-none focus:border-teal-500"
                />
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  Collection / performance assumption
                </label>
                <input
                  type="range"
                  value={performancePct}
                  min={70}
                  max={110}
                  onChange={(e) => setPerformancePct(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <p className="mt-2 text-sm font-semibold text-teal-700">
                  {performancePct}% collection performance
                </p>
              </div>

              {/* Projected outputs */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <ArrowRight className="h-5 w-5 text-teal-600" />
                  <h3 className="text-sm font-black text-zinc-950">Projected cash distribution</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Metric
                    label="Monthly cash yield"
                    value={formatIDRXFull(calc.monthlyCashYieldIDRX)}
                  />
                  <Metric
                    label="Monthly principal"
                    value={formatIDRXFull(calc.monthlyPrincipalRecoveryIDRX)}
                  />
                  <Metric
                    label="Annual cash total"
                    value={formatIDRXFull(calc.annualCashDistributionIDRX)}
                  />
                  <Metric
                    label="Maturity settlement"
                    value={formatIDRXFull(calc.maturitySettlementIDRX)}
                  />
                </div>
                <p className="mt-5 rounded-xl bg-zinc-50 p-4 text-xs leading-5 text-zinc-500 border border-zinc-100">
                  The total cash distribution includes principal recovery. It should not be marketed
                  as pure yield.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
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
