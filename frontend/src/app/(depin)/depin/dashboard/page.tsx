"use client";

import Link from "next/link";
import { ConnectWalletButton } from "@/components/ui/ConnectWalletButton";
import { WorkshopRevenueChart } from "@/components/ui/WorkshopRevenueChart";
import { DepinStatsBar } from "@/components/ui/DepinStatsBar";
import {
  Trophy,
  Star,
  Zap,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Coins,
  Handshake,
  Medal,
  Send,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatNumber, truncateWallet } from "@/lib/yield";

const weeklyPoints = [
  { name: "W1", value: 280 },
  { name: "W2", value: 340 },
  { name: "W3", value: 520 },
  { name: "W4", value: 680 },
  { name: "W5", value: 520 },
];

interface Activity {
  Icon: LucideIcon;
  label: string;
  pts: number;
  time: string;
}

const recentActivity: Activity[] = [
  { Icon: CheckCircle2, label: "Quest selesai: Follow Twitter", pts: 100, time: "2 jam lalu" },
  { Icon: Coins, label: "Pool distribution minggu ini", pts: 200, time: "1 hari lalu" },
  { Icon: Handshake, label: "Bonus referral operator", pts: 500, time: "3 hari lalu" },
  { Icon: Medal, label: "Weekly top 500", pts: 150, time: "5 hari lalu" },
  { Icon: Send, label: "Quest selesai: Join Telegram", pts: 100, time: "6 hari lalu" },
];

const leaderboard = [
  { rank: 1, wallet: "NMS1abc9f2x", points: 12480, tier: "Diamond" },
  { rank: 2, wallet: "NMS4cde7k1m", points: 10230, tier: "Diamond" },
  { rank: 3, wallet: "NMS7efh3m2n", points: 9120, tier: "Gold" },
  { rank: 4, wallet: "NMSab2kq8pr", points: 7845, tier: "Gold" },
  { rank: 5, wallet: "NMSdf8rs2wq", points: 6210, tier: "Gold" },
  { rank: 6, wallet: "NMSpq4vv3ks", points: 5480, tier: "Silver" },
  { rank: 7, wallet: "NMSzx9n12mt", points: 4920, tier: "Silver" },
  { rank: 8, wallet: "NMSaa1bbccd", points: 3890, tier: "Silver" },
  { rank: 9, wallet: "NMSoo2mkkkl", points: 3210, tier: "Silver" },
  { rank: 10, wallet: "NMSxx9e1f9y", points: 2940, tier: "Silver" },
];

export default function PersonalDashboardPage() {
  const isConnected = true;

  if (!isConnected) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: "#FAFAFA", color: "#0A0A0B" }}
      >
        <div
          className="rounded-xl p-8 max-w-md w-full text-center"
          style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
        >
          <div
            className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(20,184,166,0.10)" }}
          >
            <Zap size={22} style={{ color: "#0F766E" }} />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 mb-2">Dashboard Personal</h1>
          <p className="text-sm text-zinc-500 mb-6">
            Hubungkan wallet untuk melihat poin, rank, dan aktivitas kamu.
          </p>
          <ConnectWalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="text-zinc-900 pb-8 w-full max-w-7xl mx-auto px-4 md:px-0">
      <DepinStatsBar />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-zinc-900">Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Overview poin, rank, dan aktivitas kamu di Nemesis DePIN.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">All Points</p>
            <p className="text-2xl font-bold text-zinc-900 mt-2">{formatNumber(2847392)}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-200">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">My Points</p>
            <p className="text-2xl font-bold text-teal-600 mt-2">
              {formatNumber(2340)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Rank</p>
            <p className="text-2xl font-bold text-zinc-900 mt-2">#127</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Tier</p>
            <p className="text-2xl font-bold text-zinc-900 mt-2 flex items-center gap-1.5">
              Silver <Star size={16} className="text-zinc-400 fill-zinc-300" />
            </p>
          </div>
        </div>

        {/* Points chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
          <h3 className="text-lg font-bold text-zinc-900 mb-1">Poin Mingguan</h3>
          <p className="text-sm text-zinc-500 mb-6">5 minggu terakhir</p>
          <div className="h-[250px]">
            <WorkshopRevenueChart data={weeklyPoints} suffix="poin" />
          </div>
        </div>

        {/* Recent activity + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex flex-col">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-2 flex-1">
              {recentActivity.map((a, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-teal-50">
                    <a.Icon size={18} className="text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{a.label}</p>
                    <p className="text-xs text-zinc-500">{a.time}</p>
                  </div>
                  <span className="text-sm font-bold text-teal-600">
                    +{formatNumber(a.pts)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex flex-col">
            <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-teal-500" />
              Leaderboard
            </h3>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="text-left py-3 px-3 font-semibold text-zinc-500">#</th>
                    <th className="text-left py-3 px-3 font-semibold text-zinc-500">Wallet</th>
                    <th className="text-right py-3 px-3 font-semibold text-zinc-500">Points</th>
                    <th className="text-right py-3 px-3 font-semibold text-zinc-500">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((row) => (
                    <tr
                      key={row.rank}
                      className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                    >
                      <td className="py-3 px-3 text-zinc-500 font-medium">{row.rank}</td>
                      <td className="py-3 px-3 font-mono font-medium text-zinc-900 text-xs">
                        {truncateWallet(row.wallet)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-900">
                        {formatNumber(row.points)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-zinc-100 text-zinc-600">
                          {row.tier}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick link cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/depin/quests"
            className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex items-center justify-between hover:border-teal-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 group-hover:bg-teal-100 transition-colors">
                <CheckCircle2 size={24} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Quests</p>
                <p className="text-base font-bold text-zinc-900 mt-0.5">Kumpulkan poin</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-zinc-300 group-hover:text-teal-500 transition-colors" />
          </Link>
          <Link
            href="/depin/earn"
            className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex items-center justify-between hover:border-teal-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 group-hover:bg-teal-100 transition-colors">
                <Trophy size={24} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Earn</p>
                <p className="text-base font-bold text-zinc-900 mt-0.5">Season Campaign</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-zinc-300 group-hover:text-teal-500 transition-colors" />
          </Link>
          <Link
            href="/fi/portfolio"
            className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex items-center justify-between hover:border-teal-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 group-hover:bg-teal-100 transition-colors">
                <Wallet size={24} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">FI Portfolio</p>
                <p className="text-base font-bold text-zinc-900 mt-0.5 flex items-center gap-1.5">
                  <TrendingUp size={16} className="text-teal-600" />
                  Lihat Investasi
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-zinc-300 group-hover:text-teal-500 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
