"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/ui/ConnectWalletButton";
import { WorkshopRevenueChart } from "@/components/ui/WorkshopRevenueChart";
import { Wallet, ExternalLink, CheckCircle2 } from "lucide-react";
import { formatNumber, formatIDRXFull } from "@/lib/yield";

const POSITIONS = [
  {
    poolId: "pool-batch-1",
    poolName: "Fleet Pool Batch #1 — Jakarta",
    shares: 10,
    value: 300_000,
    yieldEarned: 7_680,
    apy: 33.2,
  },
  {
    poolId: "pool-bandung",
    poolName: "Bandung Kurir Network",
    shares: 5,
    value: 150_000,
    yieldEarned: 2_410,
    apy: 30.5,
  },
];

const YIELD_HISTORY = [
  { name: "W1", value: 1680 },
  { name: "W2", value: 1760 },
  { name: "W3", value: 1840 },
  { name: "W4", value: 1920 },
];

interface Tx {
  date: string;
  type: string;
  pool: string;
  amount: number;
  hash: string;
}

const TXS: Tx[] = [
  { date: "28 Apr 2026", type: "Distribusi Yield", pool: "Batch #1", amount: 1920, hash: "4xK9...mR2p" },
  { date: "21 Apr 2026", type: "Distribusi Yield", pool: "Batch #1", amount: 1840, hash: "7yL3...nS4q" },
  { date: "14 Apr 2026", type: "Distribusi Yield", pool: "Batch #1", amount: 1970, hash: "9zM5...pT6r" },
  { date: "7 Apr 2026", type: "Distribusi Yield", pool: "Batch #1", amount: 1760, hash: "2wN7...qU8s" },
  { date: "15 Mar 2026", type: "Investment", pool: "Batch #1", amount: -300_000, hash: "5aB8...vW9t" },
  { date: "10 Mar 2026", type: "Investment", pool: "Bandung", amount: -150_000, hash: "6cD4...xY1u" },
];

const CARD_STYLE = {
  background: "#FFFFFF",
  border: "1px solid rgba(15,23,42,0.08)",
};

export default function PortfolioPage() {
  const [isConnected] = useState(true);

  if (!isConnected) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: "#FAFAFA", color: "#0A0A0B" }}
      >
        <div className="rounded-xl p-8 max-w-md w-full text-center" style={CARD_STYLE}>
          <div
            className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(20,184,166,0.10)" }}
          >
            <Wallet size={22} style={{ color: "#0F766E" }} />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Portfolio Investor</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Hubungkan wallet untuk melihat portfolio kamu.
          </p>
          <ConnectWalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: "#FAFAFA", color: "#0A0A0B" }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-1">Portfolio Investor</h1>
        <p className="text-sm text-zinc-500 mb-8">Ringkasan semua posisi investasi kamu di Nemesis FI.</p>

        {/* Portfolio summary hero */}
        <div className="rounded-xl p-6 md:p-8 mb-10" style={CARD_STYLE}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Saham Dimiliki</p>
              <p className="text-2xl font-bold text-zinc-900">{formatNumber(15)}</p>
              <p className="text-xs text-zinc-500">dari {formatNumber(100000)} saham total</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Diinvestasikan</p>
              <p className="text-xl font-bold text-zinc-900 break-all">
                {formatIDRXFull(450_000)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Yield Minggu Ini</p>
              <p className="text-xl font-bold break-all" style={{ color: "#0F766E" }}>
                {formatIDRXFull(1920)}
              </p>
              <p className="text-xs flex items-center gap-1 mt-1" style={{ color: "#0F766E" }}>
                <CheckCircle2 size={12} /> Diklaim otomatis
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Total Diperoleh</p>
              <p className="text-xl font-bold text-zinc-900 break-all">
                {formatIDRXFull(10_090)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">APY Saat Ini</p>
              <p className="text-2xl font-bold text-zinc-900">33,2%</p>
            </div>
          </div>
        </div>

        {/* Positions */}
        <h2 className="text-base font-semibold text-zinc-900 mb-4">Posisi Aktif</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {POSITIONS.map((pos) => (
            <div key={pos.poolId} className="rounded-xl p-6" style={CARD_STYLE}>
              <h3 className="text-base font-semibold text-zinc-900 mb-4">{pos.poolName}</h3>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Saham</p>
                  <p className="text-lg font-bold text-zinc-900">{formatNumber(pos.shares)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Nilai Sekarang</p>
                  <p className="text-lg font-bold text-zinc-900 break-all">
                    {formatIDRXFull(pos.value)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Yield Terkumpul</p>
                  <p className="text-lg font-bold break-all" style={{ color: "#0F766E" }}>
                    {formatIDRXFull(pos.yieldEarned)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">APY</p>
                  <p className="text-lg font-bold text-zinc-900">{pos.apy}%</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={`/fi/pools/${pos.poolId}`}
                  className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    background: "#14B8A6",
                    color: "#FFFFFF",
                  }}
                >
                  Lihat Detail
                </Link>
                <Link
                  href={`/depin/pool/${pos.poolId}`}
                  className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    background: "#FFFFFF",
                    color: "#0F766E",
                    border: "1px solid rgba(20,184,166,0.4)",
                  }}
                >
                  Lihat Aktivitas Fleet
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Yield chart */}
        <div className="rounded-xl p-5 mb-10" style={CARD_STYLE}>
          <h3 className="text-base font-semibold text-zinc-900 mb-1">Yield History</h3>
          <p className="text-sm text-zinc-500 mb-2">4 minggu terakhir (IDRX)</p>
          <WorkshopRevenueChart data={YIELD_HISTORY} suffix="IDRX" />
        </div>

        {/* TX history */}
        <div className="rounded-xl overflow-hidden" style={CARD_STYLE}>
          <div className="p-5 pb-3">
            <h3 className="text-base font-semibold text-zinc-900">Riwayat Transaksi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#F4F4F5", color: "#52525B" }}>
                  <th className="text-left py-3 px-4 font-medium">Tanggal</th>
                  <th className="text-left py-3 px-4 font-medium">Jenis</th>
                  <th className="text-left py-3 px-4 font-medium">Pool</th>
                  <th className="text-right py-3 px-4 font-medium">Jumlah</th>
                  <th className="text-left py-3 px-4 font-medium">Hash</th>
                </tr>
              </thead>
              <tbody>
                {TXS.map((tx, i) => {
                  const isIn = tx.amount >= 0;
                  return (
                    <tr key={i} style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}>
                      <td className="py-3 px-4 text-zinc-700">{tx.date}</td>
                      <td className="py-3 px-4 text-zinc-900">{tx.type}</td>
                      <td className="py-3 px-4 text-zinc-700">{tx.pool}</td>
                      <td
                        className="py-3 px-4 text-right font-semibold whitespace-nowrap"
                        style={{ color: isIn ? "#0F766E" : "#B91C1C" }}
                      >
                        {isIn ? "+" : "-"}
                        {formatIDRXFull(Math.abs(tx.amount))}
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href="#"
                          className="font-mono text-xs inline-flex items-center gap-1 hover:underline"
                          style={{ color: "#0F766E" }}
                        >
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
