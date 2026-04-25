"use client";

import { useState } from "react";
import { Globe, ExternalLink, Activity } from "lucide-react";
import { formatNumber } from "@/lib/yield";

const filters = ["Semua", "Ojol", "Kurir", "Logistik"];

const activityRows = [
  { unit: "#NMS-0**", cat: "Ojol", zone: "Jakarta Selatan", time: "14:23", km: 47, hash: "4xK9...mR2p" },
  { unit: "#NMS-1**", cat: "Kurir", zone: "Jakarta Barat", time: "14:21", km: 23, hash: "7yL3...nS4q" },
  { unit: "#NMS-2**", cat: "Logistik", zone: "Surabaya", time: "14:19", km: 61, hash: "9zM5...pT6r" },
  { unit: "#NMS-0**", cat: "Ojol", zone: "Bandung", time: "14:17", km: 34, hash: "2wN7...qU8s" },
  { unit: "#NMS-3**", cat: "Ojol", zone: "Jakarta Timur", time: "14:15", km: 18, hash: "5aB8...vW9t" },
  { unit: "#NMS-1**", cat: "Kurir", zone: "Bekasi", time: "14:13", km: 52, hash: "6cD2...xY1u" },
  { unit: "#NMS-2**", cat: "Logistik", zone: "Tangerang", time: "14:11", km: 29, hash: "3eF4...zA2v" },
  { unit: "#NMS-0**", cat: "Ojol", zone: "Jakarta Pusat", time: "14:09", km: 41, hash: "8gH6...bC3w" },
  { unit: "#NMS-1**", cat: "Kurir", zone: "Depok", time: "14:07", km: 37, hash: "1iJ8...dE4x" },
  { unit: "#NMS-2**", cat: "Logistik", zone: "Jakarta Utara", time: "14:05", km: 24, hash: "4kL0...fG5y" },
];

export default function NetworkDetailPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filtered =
    activeFilter === "Semua"
      ? activityRows
      : activityRows.filter((r) => r.cat === activeFilter);

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: "#FAFAFA", color: "#0A0A0B" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-1">Network Detail</h1>
            <p className="text-sm text-zinc-500">
              Monitor status fleet, konektivitas, dan aktivitas on-chain.
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

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
          >
            <p className="text-xs text-zinc-500">Online</p>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{formatNumber(623)}</p>
          </div>
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
          >
            <p className="text-xs text-zinc-500">Offline</p>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{formatNumber(224)}</p>
          </div>
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
          >
            <p className="text-xs text-zinc-500">In Transit</p>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{formatNumber(412)}</p>
          </div>
          <div
            className="rounded-xl p-5"
            style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
          >
            <p className="text-xs text-zinc-500">Uptime</p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#0F766E" }}>
              73,6%
            </p>
          </div>
        </div>

        {/* Map placeholder */}
        <div
          className="rounded-xl mb-8 flex flex-col items-center justify-center text-center p-6"
          style={{
            height: "420px",
            background: "#FFFFFF",
            border: "1px dashed rgba(20,184,166,0.4)",
          }}
        >
          <Globe size={56} style={{ color: "#14B8A6" }} className="mb-3" />
          <h3 className="text-base font-semibold text-zinc-900">Peta Fleet Network</h3>
          <p className="text-sm text-zinc-500 mt-2 max-w-sm">
            Sebaran unit aktif di lebih dari 10 kota di Indonesia. Data teranonimisasi — hanya
            agregat per zona.
          </p>
        </div>

        {/* Connectivity + Activity */}
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
              <div>
                <p className="text-xs text-zinc-500">Avg Uptime</p>
                <p className="text-lg font-bold text-zinc-900">96,4%</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Data Lag</p>
                <p className="text-lg font-bold text-zinc-900">2,1 detik</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Blockchain Sync</p>
                <p className="text-lg font-bold" style={{ color: "#0F766E" }}>
                  99,8%
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Tx Success</p>
                <p className="text-lg font-bold text-zinc-900">98,2%</p>
              </div>
            </div>
            <div
              className="mt-6 pt-4 border-t"
              style={{ borderColor: "rgba(15,23,42,0.06)" }}
            >
              <p className="text-xs text-zinc-500 mb-3">Zona Teratas</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-700">Jakarta Selatan</span>
                  <span className="text-zinc-900 font-medium">{formatNumber(147)} unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-700">Jakarta Pusat</span>
                  <span className="text-zinc-900 font-medium">{formatNumber(121)} unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-700">Bandung</span>
                  <span className="text-zinc-900 font-medium">{formatNumber(94)} unit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-700">Surabaya</span>
                  <span className="text-zinc-900 font-medium">{formatNumber(88)} unit</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="lg:col-span-2 rounded-xl overflow-hidden"
            style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}
          >
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
                {filtered.map((row, idx) => (
                  <tr
                    key={idx}
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
  );
}
