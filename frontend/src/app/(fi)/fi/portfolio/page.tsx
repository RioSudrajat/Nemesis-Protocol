"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/ui/ConnectWalletButton";
import { WorkshopRevenueChart } from "@/components/ui/WorkshopRevenueChart";
import { CheckCircle2, ExternalLink, Wallet } from "lucide-react";
import { formatIDRXFull } from "@/lib/yield";
import { selectInvestorPortfolio, useNemesisStore } from "@/store/useNemesisStore";

const CARD_STYLE = {
  background: "#FFFFFF",
  border: "1px solid rgba(15,23,42,0.08)",
};

export default function PortfolioPage() {
  const [isConnected] = useState(true);
  const nemesisState = useNemesisStore();
  const positions = selectInvestorPortfolio(nemesisState);
  const investedPoolIds = new Set(positions.map((position) => position.poolId));
  const publishedReports = nemesisState.poolReports
    .filter((report) => report.isPublished && investedPoolIds.has(report.poolId))
    .sort((a, b) => a.period.localeCompare(b.period));

  const poolById = useMemo(
    () => new Map(nemesisState.pools.map((pool) => [pool.id, pool])),
    [nemesisState.pools]
  );

  const ownershipByPool = useMemo(
    () =>
      new Map(
        positions.map((position) => {
          const pool = poolById.get(position.poolId);
          return [position.poolId, pool?.totalSupplied ? position.invested / pool.totalSupplied : 0];
        })
      ),
    [positions, poolById]
  );

  const cashHistory = publishedReports.map((report) => ({
    name: report.period.slice(5),
    value: Math.round(report.yieldDistributed * (ownershipByPool.get(report.poolId) ?? 0)),
  }));

  const principalHistory = publishedReports.map((report) => ({
    name: report.period.slice(5),
    value: Math.round(report.principalReturned * (ownershipByPool.get(report.poolId) ?? 0)),
  }));
  const cashChartData = cashHistory.length ? cashHistory : [{ name: "-", value: 0 }];
  const principalChartData = principalHistory.length ? principalHistory : [{ name: "-", value: 0 }];

  const transactions = [
    ...positions.map((position) => ({
      date: new Date(position.investedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      type: "Investment",
      pool: position.poolName,
      amount: -position.invested,
      hash: position.id ? `${position.id.slice(0, 10)}...` : "pending...",
    })),
    ...publishedReports.flatMap((report) => {
      const pool = poolById.get(report.poolId);
      const ownership = ownershipByPool.get(report.poolId) ?? 0;
      return [
        {
          date: `${report.period}-28`,
          type: "Cash yield",
          pool: pool?.name ?? report.poolId,
          amount: Math.round(report.yieldDistributed * ownership),
          hash: report.id,
        },
        {
          date: `${report.period}-28`,
          type: "Principal recovery",
          pool: pool?.name ?? report.poolId,
          amount: Math.round(report.principalReturned * ownership),
          hash: report.id,
        },
      ];
    }),
  ];

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] p-8 text-zinc-950">
        <div className="w-full max-w-md rounded-xl p-8 text-center" style={CARD_STYLE}>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
            <Wallet size={22} className="text-teal-700" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-zinc-900">Portfolio Investor</h2>
          <p className="mb-6 text-sm text-zinc-500">Hubungkan wallet untuk melihat portfolio kamu.</p>
          <ConnectWalletButton />
        </div>
      </div>
    );
  }

  const totalInvested = positions.reduce((sum, item) => sum + item.invested, 0);
  const totalCashYield = positions.reduce((sum, item) => sum + item.cashYieldReceived, 0);
  const totalPrincipalRecovered = positions.reduce((sum, item) => sum + item.principalRecovered, 0);
  const totalOutstanding = positions.reduce((sum, item) => sum + item.outstandingPrincipal, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 text-zinc-950 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-1 text-3xl font-bold text-zinc-950">Investor Portfolio</h1>
        <p className="mb-8 text-sm text-zinc-500">Position size, cash yield received, and remaining principal exposure.</p>

        <section className="mb-10 rounded-2xl p-6 shadow-sm md:p-8" style={CARD_STYLE}>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            <Summary label="Position size" value={formatIDRXFull(totalInvested)} />
            <Summary label="Cash yield received" value={formatIDRXFull(totalCashYield)} accent />
            <Summary label="Principal recovered" value={formatIDRXFull(totalPrincipalRecovered)} />
            <Summary label="Remaining exposure" value={formatIDRXFull(totalOutstanding)} />
          </div>
        </section>

        <h2 className="mb-4 text-base font-semibold text-zinc-900">Active positions</h2>
        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {positions.length === 0 && (
            <div className="rounded-2xl p-6 text-sm text-zinc-500 shadow-sm" style={CARD_STYLE}>
              Belum ada posisi aktif. Investasi yang dibuat dari staking pools akan otomatis muncul di sini.
            </div>
          )}
          {positions.map((position) => (
            <div key={position.id ?? position.poolId} className="rounded-2xl p-6 shadow-sm" style={CARD_STYLE}>
              <h3 className="mb-4 text-lg font-bold text-zinc-950">{position.poolName}</h3>
              <div className="mb-5 grid grid-cols-2 gap-4">
                <Summary label="Invested" value={formatIDRXFull(position.invested)} />
                <Summary label="Cash yield" value={`${position.cashYieldPct}%`} />
                <Summary label="Principal recovered" value={formatIDRXFull(position.principalRecovered)} />
                <Summary label="Outstanding principal" value={formatIDRXFull(position.outstandingPrincipal)} />
                <Summary label="Tenor" value={`${position.tenorMonths} months`} />
                <Summary label="Maturity" value={new Date(position.maturityDate).toLocaleDateString("id-ID", { month: "short", year: "numeric" })} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/fi/pools/${position.poolId}`} className="rounded-lg bg-teal-500 px-4 py-2 text-xs font-semibold text-white">
                  Pool detail
                </Link>
                <Link href={`/depin/pool/${position.poolId}`} className="rounded-lg border border-teal-500/40 bg-white px-4 py-2 text-xs font-semibold text-teal-700">
                  View route proofs
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl p-5 shadow-sm" style={CARD_STYLE}>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Cash yield history</h3>
            <p className="mb-2 text-sm text-zinc-500">Monthly IDRX yield only, excluding returned principal.</p>
            <WorkshopRevenueChart data={cashChartData} suffix="IDRX" />
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={CARD_STYLE}>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Principal recovery history</h3>
            <p className="mb-2 text-sm text-zinc-500">Principal returned from pool collections.</p>
            <WorkshopRevenueChart data={principalChartData} suffix="IDRX" />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-sm" style={CARD_STYLE}>
          <div className="p-5 pb-3">
            <h3 className="text-base font-semibold text-zinc-900">Transaction history</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-100 text-zinc-600">
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Pool</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Hash</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const isIn = tx.amount >= 0;
                  return (
                    <tr key={`${tx.date}-${tx.type}-${tx.pool}`} className="border-t border-zinc-950/5">
                      <td className="px-4 py-3 text-zinc-700">{tx.date}</td>
                      <td className="px-4 py-3 text-zinc-900">{tx.type}</td>
                      <td className="px-4 py-3 text-zinc-700">{tx.pool}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold" style={{ color: isIn ? "#0F766E" : "#B91C1C" }}>
                        {isIn ? "+" : "-"}{formatIDRXFull(Math.abs(tx.amount))}
                      </td>
                      <td className="px-4 py-3">
                        <a href="#" className="inline-flex items-center gap-1 text-teal-700 hover:underline">
                          {tx.hash} <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Summary({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className="break-all text-xl font-bold" style={{ color: accent ? "#0F766E" : "#18181B" }}>
        {value}
      </p>
      {accent && (
        <p className="mt-1 flex items-center gap-1 text-xs text-teal-700">
          <CheckCircle2 size={12} /> separated from principal recovery
        </p>
      )}
    </div>
  );
}
