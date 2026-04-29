"use client";

import { use } from "react";
import Link from "next/link";
import { Lock, MapPin, ChevronRight } from "lucide-react";
import { formatNumber } from "@/lib/yield";

type UnitStatus = "Active" | "Idle" | "Maintenance" | "Offline";

interface Unit {
  unit: string;
  status: UnitStatus;
  nodeScore: number;
  kmToday: number;
  health: number;
}

const STATUS_COLOR: Record<UnitStatus, string> = {
  Active: "#14B8A6",
  Idle: "#A1A1AA",
  Maintenance: "#F59E0B",
  Offline: "#EF4444",
};

const units: Unit[] = [
  { unit: "#NMS-0001", status: "Active", nodeScore: 94, kmToday: 127, health: 91 },
  { unit: "#NMS-0042", status: "Maintenance", nodeScore: 72, kmToday: 0, health: 72 },
  { unit: "#NMS-0018", status: "Active", nodeScore: 81, kmToday: 94, health: 79 },
  { unit: "#NMS-0055", status: "Active", nodeScore: 88, kmToday: 156, health: 92 },
  { unit: "#NMS-0073", status: "Active", nodeScore: 95, kmToday: 73, health: 98 },
];

export default function PoolFleetMapPage({
  params,
}: {
  params: Promise<{ poolId: string }>;
}) {
  const { poolId } = use(params);
  const isInvestor = true;

  if (!isInvestor) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{ background: "#FAFAFA", color: "#0A0A0B" }}
      >
        <div
          className="rounded-xl p-8 max-w-md w-full text-center"
          style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
        >
          <div
            className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.10)" }}
          >
            <Lock size={22} style={{ color: "#B45309" }} />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 mb-2">Access Locked</h1>
          <p className="text-sm text-zinc-500 mb-6">
            This page is restricted to pool shareholders. Invest in Nemesis FI first to unlock access.
          </p>
          <Link
            href="/fi"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-colors"
            style={{ background: "#14B8A6" }}
          >
            Go to Nemesis FI <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: "#FAFAFA", color: "#0A0A0B" }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-1">
          Fleet Pool {poolId} — Jakarta
        </h1>
        <p className="text-sm text-zinc-500 mb-6">
          Real-time monitoring for your pool's assets.
        </p>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
          >
            <p className="text-xs text-zinc-500">Total Units</p>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{formatNumber(100)}</p>
          </div>
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
          >
            <p className="text-xs text-zinc-500">Km Today</p>
            <p className="text-2xl font-bold text-zinc-900 mt-1">
              {formatNumber(47291)} km
            </p>
          </div>
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
          >
            <p className="text-xs text-zinc-500">Utilization</p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#0F766E" }}>
              71%
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          {(
            [
              { label: "Active", count: 71, color: STATUS_COLOR.Active },
              { label: "Idle", count: 12, color: STATUS_COLOR.Idle },
              { label: "Maintenance", count: 5, color: STATUS_COLOR.Maintenance },
              { label: "Offline", count: 12, color: STATUS_COLOR.Offline },
            ] as const
          ).map((s) => (
            <span
              key={s.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: s.color }}
              />
              <span className="text-zinc-700 font-medium">{s.label}</span>
              <span className="text-zinc-500">({formatNumber(s.count)})</span>
            </span>
          ))}
        </div>

        {/* Map placeholder */}
        <div
          className="rounded-xl mb-6 flex flex-col items-center justify-center text-center p-6"
          style={{
            height: "420px",
            background: "#FFFFFF",
            border: "1px dashed rgba(20,184,166,0.4)",
          }}
        >
          <MapPin size={48} style={{ color: "#14B8A6" }} className="mb-3" />
          <p className="text-base font-semibold text-zinc-900">Pool Asset Map</p>
          <p className="text-sm text-zinc-500 mt-2">Real-time — Jakarta Region</p>
        </div>

        {/* Unit detail table */}
        <h3 className="text-base font-semibold text-zinc-900 mb-4">Asset Details</h3>
        <div
          className="rounded-xl overflow-hidden mb-6"
          style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F4F4F5", color: "#52525B" }}>
                <th className="text-left py-3 px-4 font-medium">Asset</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Node Score</th>
                <th className="text-right py-3 px-4 font-medium">Km Today</th>
                <th className="text-right py-3 px-4 font-medium">Health</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u, idx) => (
                <tr key={idx} style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}>
                  <td className="py-3 px-4 font-mono text-zinc-900">{u.unit}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-700">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: STATUS_COLOR[u.status] }}
                      />
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-zinc-900">{u.nodeScore}</td>
                  <td className="py-3 px-4 text-right text-zinc-700">
                    {formatNumber(u.kmToday)} km
                  </td>
                  <td className="py-3 px-4 text-right font-semibold" style={{ color: "#0F766E" }}>
                    {u.health}/100
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Aggregate */}
        <div
          className="rounded-xl p-6"
          style={{ background: "#FFFFFF", border: "1px solid rgba(20,184,166,0.25)" }}
        >
          <p className="text-xs text-zinc-500">Estimated Yield</p>
          <p className="text-2xl md:text-3xl font-bold mt-1" style={{ color: "#0F766E" }}>
            {formatNumber(192000)} IDRX{" "}
            <span className="text-sm text-zinc-500 font-normal">this week</span>
          </p>
        </div>
      </div>
    </div>
  );
}
