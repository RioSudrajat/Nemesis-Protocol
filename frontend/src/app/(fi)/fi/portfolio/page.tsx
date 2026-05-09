"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/ui/ConnectWalletButton";
import { PortfolioActivityTable, type PortfolioActivity } from "@/components/fi/PortfolioActivityTable";
import { PortfolioClaimPanel } from "@/components/fi/PortfolioClaimPanel";
import { PortfolioLiveProjects } from "@/components/fi/PortfolioLiveProjects";
import { PortfolioYieldAreaChart, type PortfolioYieldPoint } from "@/components/fi/PortfolioYieldAreaChart";
import { useSolanaWallet } from "@/context/SolanaWalletContext";
import { ArrowRight, Wallet } from "lucide-react";
import { formatIDRXFull } from "@/lib/yield";
import { selectInvestorPortfolio, useNemesisStore } from "@/store/useNemesisStore";

export default function PortfolioPage() {
  const { isConnected } = useSolanaWallet();
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

  const cashChartData = useMemo<PortfolioYieldPoint[]>(() => {
    return publishedReports.reduce<PortfolioYieldPoint[]>((acc, report) => {
      const previous = acc.at(-1)?.value ?? 0;
      const nextValue = previous + Math.round(report.yieldDistributed * (ownershipByPool.get(report.poolId) ?? 0));
      return [...acc, { label: report.period.slice(5), value: nextValue }];
    }, []);
  }, [ownershipByPool, publishedReports]);

  const transactions: PortfolioActivity[] = [
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
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-zinc-950">
        <div className="w-full max-w-md rounded-[1.5rem] border border-zinc-950/10 bg-white p-8 text-center shadow-sm">
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

  const totalCashYield = positions.reduce((sum, item) => sum + item.cashYieldReceived, 0);
  const avgYield = positions.length ? positions.reduce((sum, item) => sum + item.cashYieldPct, 0) / positions.length : 0;
  const nextPayout = positions.map((item) => item.nextDistribution).sort()[0];

  return (
    <div className="min-h-screen px-4 py-8 text-zinc-950 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">Portfolio</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">Yield and positions</h1>
          <p className="mt-2 text-sm text-zinc-500">Cash yield, active financing exposure, and distribution activity from your FI positions.</p>
        </div>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Summary label="Avg annualized yield" value={`${avgYield.toFixed(1)}%`} />
          <Summary label="Total yield earned" value={formatIDRXFull(totalCashYield)} accent />
          <Summary label="Next payout" value={nextPayout ? new Date(nextPayout).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) : "N/A"} />
          <Summary label="Active positions" value={`${positions.length}`} />
        </section>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[1.5rem] border border-zinc-950/10 bg-white p-5 shadow-sm md:p-6">
            <PortfolioYieldAreaChart data={cashChartData} />
          </section>
          <div className="space-y-5">
            <PortfolioLiveProjects positions={positions} />
            <PortfolioClaimPanel amount={totalCashYield} />
          </div>
        </div>

        <section className="rounded-[1.5rem] bg-gradient-to-br from-zinc-950 to-teal-900 p-6 text-white md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Deploy capital into operating EV infrastructure</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">Evaluate campaign terms, operator records, and distribution mechanics in one place.</p>
            </div>
            <Link href="/fi/pools" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-zinc-950">
              View pools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <PortfolioActivityTable transactions={transactions} />
      </div>
    </div>
  );
}

function Summary({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-[1.25rem] border border-zinc-950/10 bg-white p-5 shadow-sm">
      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-zinc-400">{label}</p>
      <p className={`break-words text-2xl font-black ${accent ? "text-teal-700" : "text-zinc-950"}`}>
        {value}
      </p>
    </div>
  );
}
