"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Twitter, Send, MessageCircle, Wallet, Handshake, Trophy, PiggyBank, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatNumber } from "@/lib/yield";
import { DepinStatsBar } from "@/components/ui/DepinStatsBar";
import { WorkshopRevenueChart } from "@/components/ui/WorkshopRevenueChart";

interface Quest {
  id: string;
  title: string;
  desc: string;
  reward: number;
  Icon: LucideIcon;
  cta: string;
}

const quests: Quest[] = [
  { id: "q1", title: "Follow Twitter @NemesisProtocol", desc: "Follow our official account", reward: 100, Icon: Twitter, cta: "Follow" },
  { id: "q2", title: "Join Telegram Nemesis", desc: "Join Telegram community", reward: 100, Icon: Send, cta: "Join" },
  { id: "q3", title: "Join Discord", desc: "Join our Discord server", reward: 100, Icon: MessageCircle, cta: "Join" },
  { id: "q4", title: "Connect Wallet", desc: "Connect Solana wallet", reward: 100, Icon: Wallet, cta: "Connect" },
  { id: "q5", title: "Refer 1 New Operator", desc: "Invite fleet operator to join", reward: 500, Icon: Handshake, cta: "Start" },
  { id: "q6", title: "Join Pool Batch #1", desc: "Invest min 30,000 IDRX", reward: 1000, Icon: PiggyBank, cta: "View Pool" },
  { id: "q7", title: "Hold 1,000 points for 30 days", desc: "Maintain your points balance", reward: 200, Icon: Trophy, cta: "Start" },
];

const weeklyPoints = [
  { name: "Apr 1", value: 100 },
  { name: "Apr 5", value: 240 },
  { name: "Apr 10", value: 380 },
  { name: "Apr 15", value: 520 },
  { name: "Apr 20", value: 780 },
  { name: "Apr 25", value: 940 },
];

const initialRecentActivity = [
  { avatar: "B", wallet: "BLo...1Tu", action: "100.0000 Nemesis points", pts: "+100.0000", time: "just now" },
  { avatar: "3", wallet: "39G...cNj", action: "120.0000 Nemesis points", pts: "+120.0000", time: "1m ago" },
  { avatar: "K", wallet: "kryptdou_", action: "60.0000 Nemesis points", pts: "+60.0000", time: "2m ago" },
];

const leaderboard = [
  { rank: 1, wallet: "8EM.....peC", points: 1942861747 },
  { rank: 2, wallet: "Ht5.....EpE", points: 1021850 },
  { rank: 3, wallet: "91h.....PDi", points: 1017030 },
  { rank: 4, wallet: "EnE.....hQC", points: 503160 },
  { rank: 5, wallet: "4EK.....b7u", points: 502950 },
  { rank: 6, wallet: "2xw.....A4m", points: 407400 },
];

export default function QuestsPage() {
  const [completedIds, setCompletedIds] = useState<string[]>(["q4", "q1", "q2"]);
  const [activities, setActivities] = useState(initialRecentActivity);

  useEffect(() => {
    const interval = setInterval(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
      const wallet = `${randomChar()}${randomChar()}${randomChar()}...${randomChar()}${randomChar()}${randomChar()}`;
      const ptsVal = Math.floor(Math.random() * 50) * 10 + 50;
      const newActivity = {
        avatar: wallet[0].toUpperCase(),
        wallet: wallet,
        action: `${ptsVal}.0000 Nemesis points`,
        pts: `+${ptsVal}.0000`,
        time: "just now",
      };
      
      setActivities(prev => {
        const updated = [newActivity, ...prev].slice(0, 4);
        return updated.map((a, i) => i === 0 ? a : { ...a, time: i === 1 ? "1m ago" : i === 2 ? "3m ago" : "5m ago" });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleStart = (id: string) => {
    setCompletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const completedCount = completedIds.length;
  const total = quests.length;

  return (
    <div className="text-zinc-900 pb-8 w-full max-w-7xl mx-auto px-4 md:px-0">
      <DepinStatsBar />
      <div className="space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 relative overflow-hidden">
            <p className="text-xs text-zinc-500 font-semibold mb-2 flex items-center gap-2">
              <Trophy size={16} className="text-teal-600" /> All Points
            </p>
            <p className="text-3xl font-bold text-zinc-900">{formatNumber(18077472)}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <p className="text-xs text-zinc-500 font-semibold mb-2 flex items-center gap-2">
              <Wallet size={16} className="text-teal-600" /> My Points
            </p>
            <p className="text-3xl font-bold text-zinc-900">50</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <p className="text-xs text-zinc-500 font-semibold mb-2 flex items-center gap-2">
              <Star size={16} className="text-teal-600" /> Global Rank
            </p>
            <p className="text-3xl font-bold text-zinc-900">#5,394</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <p className="text-xs text-zinc-500 font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-600" /> Progress
            </p>
            <p className="text-3xl font-bold text-zinc-900">{completedCount}/{total}</p>
          </div>
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-zinc-900">Points</h3>
              <div className="flex bg-zinc-100 rounded-lg p-1">
                <button className="px-3 py-1.5 text-xs font-semibold bg-white shadow-sm rounded-md text-zinc-900">All Points</button>
                <button className="px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900">Your Points</button>
              </div>
            </div>
            <div className="h-[250px]">
              <WorkshopRevenueChart data={weeklyPoints} suffix="" />
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <h3 className="text-lg font-bold text-zinc-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map((a, idx) => (
                <div key={a.wallet + idx} className="flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
                      {a.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{a.wallet}</p>
                      <p className="text-xs text-zinc-500">{a.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-500">{a.pts}</p>
                    <p className="text-xs text-zinc-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quest Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {quests.slice(0, 4).map((q) => {
              const done = completedIds.includes(q.id);
              return (
                <div key={q.id} className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm flex flex-col justify-between h-[160px]">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                        <q.Icon size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 text-sm">{q.title}</h4>
                        <p className="text-xs text-zinc-500">{q.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-500">+{q.reward} pts</p>
                      <p className="text-[10px] text-zinc-400 font-semibold uppercase">Reward</p>
                    </div>
                  </div>
                  
                  {done ? (
                    <button disabled className="w-full py-2.5 rounded-xl bg-zinc-100 text-zinc-500 font-bold text-sm flex justify-center items-center gap-2">
                      <CheckCircle2 size={16} /> Completed
                    </button>
                  ) : (
                    <button onClick={() => handleStart(q.id)} className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 transition-colors text-white font-bold text-sm shadow-sm">
                      {q.cta}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Leaderboard</h3>
            <div className="space-y-4">
              {leaderboard.map((row) => (
                <div key={row.rank} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {row.rank === 1 ? (
                      <span className="text-xl">🏆</span>
                    ) : row.rank === 2 ? (
                      <span className="text-xl">🥈</span>
                    ) : row.rank === 3 ? (
                      <span className="text-xl">🥉</span>
                    ) : (
                      <span className="text-xs font-semibold text-zinc-400 w-5 text-center">#{row.rank}</span>
                    )}
                    <div className="w-8 h-8 rounded-full bg-teal-900 text-white flex items-center justify-center font-bold text-xs">
                      {row.wallet.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-zinc-900 text-sm">{row.wallet}</span>
                  </div>
                  <span className="text-sm font-bold text-green-500">+{formatNumber(row.points)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
