"use client";

import { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { DepinStatsBar } from "@/components/ui/DepinStatsBar";
import { formatNumber } from "@/lib/yield";

const filters = [
  { id: "all", label: "All" },
  { id: "Social", label: "Social" },
  { id: "Operator", label: "Operator" },
  { id: "Investor", label: "Investor" },
  { id: "Referral", label: "Referral" },
];

type Row = {
  date: string;
  activity: string;
  category: string;
  points: number;
  status: "Confirmed" | "Pending";
};

const rows: Row[] = [
  { date: "24 Apr 2026 14:23", activity: "Quest: Follow Twitter", category: "Social", points: 100, status: "Confirmed" },
  { date: "24 Apr 2026 13:10", activity: "Quest: Join Telegram", category: "Social", points: 100, status: "Confirmed" },
  { date: "23 Apr 2026 09:42", activity: "Pool distribution", category: "Investor", points: 200, status: "Confirmed" },
  { date: "22 Apr 2026 16:00", activity: "Connect Wallet", category: "Social", points: 100, status: "Confirmed" },
  { date: "20 Apr 2026 11:15", activity: "New operator referral", category: "Referral", points: 500, status: "Pending" },
  { date: "18 Apr 2026 10:00", activity: "30-day hold bonus", category: "Social", points: 200, status: "Confirmed" },
  { date: "15 Apr 2026 14:20", activity: "Season top 500", category: "Social", points: 150, status: "Confirmed" },
  { date: "12 Apr 2026 08:45", activity: "Pool distribution", category: "Investor", points: 200, status: "Confirmed" },
  { date: "10 Apr 2026 16:30", activity: "New operator referral", category: "Referral", points: 500, status: "Confirmed" },
  { date: "5 Apr 2026 09:00", activity: "Quest: Join Discord", category: "Social", points: 100, status: "Confirmed" },
];

export default function TransactionsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? rows
      : rows.filter((r) => r.category === activeFilter);

  return (
    <div className="text-zinc-900 pb-8 w-full max-w-7xl mx-auto px-4 md:px-0">
      <DepinStatsBar />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900">Points History</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Transparent — every point added is recorded on-chain.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  active
                    ? "bg-teal-500 text-white border border-teal-500 shadow-sm"
                    : "bg-white text-zinc-600 border border-zinc-100 hover:border-teal-200 hover:text-teal-600 shadow-sm"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="text-left py-4 px-6 font-semibold text-zinc-500">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-zinc-500">Activity</th>
                  <th className="text-left py-4 px-6 font-semibold text-zinc-500">Category</th>
                  <th className="text-right py-4 px-6 font-semibold text-zinc-500">Points</th>
                  <th className="text-left py-4 px-6 font-semibold text-zinc-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0"
                  >
                    <td className="py-4 px-6 text-zinc-500 font-medium">{row.date}</td>
                    <td className="py-4 px-6 font-bold text-zinc-900">{row.activity}</td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-zinc-100 text-zinc-600">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-teal-600">
                      +{formatNumber(row.points)}
                    </td>
                    <td className="py-4 px-6">
                      {row.status === "Confirmed" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                          <CheckCircle2 size={14} /> Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                          <Clock size={14} /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm bg-white rounded-2xl p-4 shadow-sm border border-zinc-100">
          <span className="text-zinc-500 font-medium px-2">Page 1 of 3</span>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-50 text-zinc-400 border border-zinc-100 cursor-not-allowed"
              disabled
            >
              Prev
            </button>
            <button
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-teal-600 border border-zinc-100 hover:border-teal-200 hover:bg-teal-50 transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
