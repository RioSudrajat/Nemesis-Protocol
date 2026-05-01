"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/ui/ConnectWalletButton";
import { WorkshopRevenueChart } from "@/components/ui/WorkshopRevenueChart";
import { CheckCircle2, ExternalLink, Wallet } from "lucide-react";
import { formatIDRXFull } from "@/lib/yield";

const POSITIONS = [
  {
    poolId: "pool-batch-1",
    poolName: "Jakarta Ride-Hailing Credit Pool",
    invested: 1_000_000,
    cashYieldReceived: 12_000,
    principalRecovered: 27_000,
    outstandingPrincipal: 973_000,
    cashYieldPct: 14.4,
    tenorMonths: 36,
    maturity: "Mar 2029",
  },
  {
    poolId: "pool-batch-3",
    poolName: "Bandung Cargo Mobility Pool",
    invested: 750_000,
    cashYieldReceived: 9_000,
    principalRecovered: 20_250,
    outstandingPrincipal: 729_750,
    cashYieldPct: 14.4,
    tenorMonths: 36,
    maturity: "Jan 2029",
  },
];

const CASH_HISTORY = [
  { name: "Feb", value: 8_400 },
  { name: "Mar", value: 10_100 },
  { name: "Apr", value: 11_500 },
  { name: "May", value: 12_000 },
];

const PRINCIPAL_HISTORY = [
  { name: "Feb", value: 18_900 },
  { name: "Mar", value: 22_700 },
  { name: "Apr", value: 25_900 },
  { name: "May", value: 27_000 },
];

const TXS = [
  { date: "28 Mei 2026", type: "Cash yield", pool: "Jakarta", amount: 12_000, hash: "4xK9...mR2p" },
  { date: "28 Mei 2026", type: "Principal recovery", pool: "Jakarta", amount: 27_000, hash: "7yL3...nS4q" },
  { date: "28 Apr 2026", type: "Cash yield", pool: "Bandung", amount: 9_000, hash: "9zM5...pT6r" },
  { date: "15 Mar 2026", type: "Investment", pool: "Jakarta", amount: -1_000_000, hash: "5aB8...vW9t" },
];

const CARD_STYLE = {
  background: "#FFFFFF",
  border: "1px solid rgba(15,23,42,0.08)",
};

export default function PortfolioPage() {
  const [isConnected] = useState(true);

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

  const totalInvested = POSITIONS.reduce((sum, item) => sum + item.invested, 0);
  const totalCashYield = POSITIONS.reduce((sum, item) => sum + item.cashYieldReceived, 0);
  const totalPrincipalRecovered = POSITIONS.reduce((sum, item) => sum + item.principalRecovered, 0);
  const totalOutstanding = POSITIONS.reduce((sum, item) => sum + item.outstandingPrincipal, 0);

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
          {POSITIONS.map((position) => (
            <div key={position.poolId} className="rounded-2xl p-6 shadow-sm" style={CARD_STYLE}>
              <h3 className="mb-4 text-lg font-bold text-zinc-950">{position.poolName}</h3>
              <div className="mb-5 grid grid-cols-2 gap-4">
                <Summary label="Invested" value={formatIDRXFull(position.invested)} />
                <Summary label="Cash yield" value={`${position.cashYieldPct}%`} />
                <Summary label="Principal recovered" value={formatIDRXFull(position.principalRecovered)} />
                <Summary label="Outstanding principal" value={formatIDRXFull(position.outstandingPrincipal)} />
                <Summary label="Tenor" value={`${position.tenorMonths} months`} />
                <Summary label="Maturity" value={position.maturity} />
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
            <WorkshopRevenueChart data={CASH_HISTORY} suffix="IDRX" />
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={CARD_STYLE}>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Principal recovery history</h3>
            <p className="mb-2 text-sm text-zinc-500">Principal returned from pool collections.</p>
            <WorkshopRevenueChart data={PRINCIPAL_HISTORY} suffix="IDRX" />
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
                {TXS.map((tx) => {
                  const isIn = tx.amount >= 0;
                  return (
                    <tr key={`${tx.date}-${tx.type}`} className="border-t border-zinc-950/5">
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
