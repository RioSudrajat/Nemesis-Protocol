"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ExternalLink, Activity } from "lucide-react";
import { formatNumber } from "@/lib/yield";
import { useNemesisStore } from "@/store/useNemesisStore";
import {
  deriveDepinActivityRows,
  deriveNetworkMetrics,
  deriveTopZones,
  getAssetCategory,
} from "@/lib/depinNetworkDerivations";
import type { FleetCategory } from "@/types/depin";

const filters = ["Semua", "Ojol", "Kurir", "Logistik"];
const FleetMapLibreMap = dynamic(() => import("@/components/maps/FleetMapLibreMap"), { ssr: false });

function filterToCategory(filter: string): FleetCategory | null {
  if (filter === "Kurir") return "kurir";
  if (filter === "Logistik") return "logistik";
  if (filter === "Ojol") return "ojol";
  return null;
}

export default function NetworkDetailPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const { assets, pools } = useNemesisStore();
  const selectedCategory = filterToCategory(activeFilter);
  const filteredAssets = selectedCategory
    ? assets.filter((asset) => getAssetCategory(asset) === selectedCategory)
    : assets;
  const metrics = deriveNetworkMetrics(assets, pools);
  const filteredRows = deriveDepinActivityRows(filteredAssets);
  const topZones = deriveTopZones(filteredAssets);
  const mapVehicles = filteredAssets.map((asset) => ({
    id: asset.id,
    name: `${asset.brand} ${asset.model} ${asset.unitId}`,
    vin: asset.vin ?? asset.unitId,
    health: asset.healthScore,
    odometer: asset.odometer ?? 0,
    owner: asset.operatorId,
    status: asset.status,
  }));

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: "#FAFAFA", color: "#0A0A0B" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-1">Network Detail</h1>
            <p className="text-sm text-zinc-500">
              Monitor status fleet, konektivitas, dan aktivitas on-chain dari canonical Nemesis store.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background: active ? "#14B8A6" : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#52525B",
                    border: active ? "1px solid #14B8A6" : "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Online" value={formatNumber(metrics.active)} />
          <StatCard label="Offline" value={formatNumber(metrics.inactive)} />
          <StatCard label="In Transit" value={formatNumber(metrics.inTransit)} />
          <StatCard label="Uptime" value={`${metrics.uptimePct.toLocaleString("id-ID")}%`} accent />
        </div>

        <div className="mb-8 overflow-hidden rounded-xl border border-zinc-950/10 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900">Peta Fleet Network</h2>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              {formatNumber(filteredAssets.length)} nodes
            </span>
          </div>
          <div className="h-[420px] overflow-hidden rounded-xl">
            <FleetMapLibreMap vehicles={mapVehicles} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
          >
            <h3 className="text-base font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Activity size={16} style={{ color: "#0F766E" }} />
              Konektivitas
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Metric label="Avg Uptime" value={`${metrics.avgUptimePct.toLocaleString("id-ID")}%`} />
              <Metric label="Data Lag" value="2,1 detik" />
              <Metric label="Blockchain Sync" value={`${metrics.blockchainSyncPct.toLocaleString("id-ID")}%`} accent />
              <Metric label="Tx Success" value={`${metrics.txSuccessPct.toLocaleString("id-ID")}%`} />
            </div>
            <div className="mt-6 pt-4 border-t" style={{ borderColor: "rgba(15,23,42,0.06)" }}>
              <p className="text-xs text-zinc-500 mb-3">Zona Teratas</p>
              <div className="space-y-2 text-sm">
                {topZones.map((zone) => (
                  <div key={zone.zone} className="flex justify-between">
                    <span className="text-zinc-700">{zone.zone}</span>
                    <span className="text-zinc-900 font-medium">{formatNumber(zone.count)} unit</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="lg:col-span-2 rounded-xl overflow-hidden"
            style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#F4F4F5", color: "#52525B" }}>
                    <th className="text-left py-3 px-4 font-medium">Unit</th>
                    <th className="text-left py-3 px-4 font-medium">Kategori</th>
                    <th className="text-left py-3 px-4 font-medium">Zona</th>
                    <th className="text-left py-3 px-4 font-medium">Waktu</th>
                    <th className="text-left py-3 px-4 font-medium">Km</th>
                    <th className="text-left py-3 px-4 font-medium">On-chain</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, idx) => (
                    <tr
                      key={`${row.assetId}-${idx}`}
                      className="hover:bg-zinc-50"
                      style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}
                    >
                      <td className="py-3 px-4 font-mono text-zinc-900">{row.unit}</td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                          style={{ background: "#F4F4F5", color: "#52525B" }}
                        >
                          {row.cat}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-700">{row.zone}</td>
                      <td className="py-3 px-4 text-zinc-500">{row.time}</td>
                      <td className="py-3 px-4 text-zinc-900">{formatNumber(row.km)} km</td>
                      <td className="py-3 px-4">
                        <a
                          href="#"
                          className="font-mono text-xs flex items-center gap-1 hover:underline"
                          style={{ color: "#0F766E" }}
                        >
                          {row.hash}
                          <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: accent ? "#0F766E" : "#18181B" }}>
        {value}
      </p>
    </div>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-lg font-bold" style={{ color: accent ? "#0F766E" : "#18181B" }}>
        {value}
      </p>
    </div>
  );
}
