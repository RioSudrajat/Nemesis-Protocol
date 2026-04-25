"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { WorkshopRevenueChart } from "@/components/ui/WorkshopRevenueChart";
import { DepinStatsBar } from "@/components/ui/DepinStatsBar";
import { formatNumber } from "@/lib/yield";
import {
  Activity,
  MapPin,
  ExternalLink,
  ChevronRight,
  Bike,
  Package,
  Truck,
} from "lucide-react";

const fleetCategories = [
  { name: "Ojol", label: "Ride-hailing", units: 412, kmToday: 21847, Icon: Bike },
  { name: "Kurir", label: "Delivery", units: 289, kmToday: 14203, Icon: Package },
  { name: "Logistik", label: "Logistics", units: 146, kmToday: 6341, Icon: Truck },
];

const kmData = [
  { name: "Mon", value: 38291 },
  { name: "Tue", value: 41023 },
  { name: "Wed", value: 39847 },
  { name: "Thu", value: 42391 },
  { name: "Fri", value: 44129 },
  { name: "Sat", value: 36412 },
  { name: "Sun", value: 31284 },
];

const txData = [
  { name: "Mon", value: 847 },
  { name: "Tue", value: 923 },
  { name: "Wed", value: 891 },
  { name: "Thu", value: 952 },
  { name: "Fri", value: 1012 },
  { name: "Sat", value: 734 },
  { name: "Sun", value: 612 },
];

const activityRows = [
  { unit: "#NMS-0**", zone: "Jakarta Selatan", time: "14:23", km: 47, hash: "4xK9...mR2p" },
  { unit: "#NMS-1**", zone: "Jakarta Barat", time: "14:21", km: 23, hash: "7yL3...nS4q" },
  { unit: "#NMS-2**", zone: "Surabaya", time: "14:19", km: 61, hash: "9zM5...pT6r" },
  { unit: "#NMS-0**", zone: "Bandung", time: "14:17", km: 34, hash: "2wN7...qU8s" },
  { unit: "#NMS-3**", zone: "Jakarta Timur", time: "14:15", km: 18, hash: "5aB8...vW9t" },
  { unit: "#NMS-1**", zone: "Bekasi", time: "14:13", km: 52, hash: "6cD2...xY1u" },
  { unit: "#NMS-2**", zone: "Tangerang", time: "14:11", km: 29, hash: "3eF4...zA2v" },
  { unit: "#NMS-0**", zone: "Jakarta Pusat", time: "14:09", km: 41, hash: "8gH6...bC3w" },
];

const mockVehicles = [
  { name: "Unit 01", vin: "NMS-001", health: 95, region: "Jakarta", odometer: 12000, owner: "4xK9...mR2p" },
  { name: "Unit 02", vin: "NMS-002", health: 88, region: "Bandung", odometer: 14000, owner: "7yL3...nS4q" },
  { name: "Unit 03", vin: "NMS-003", health: 92, region: "Surabaya", odometer: 8000, owner: "9zM5...pT6r" },
  { name: "Unit 04", vin: "NMS-004", health: 65, region: "Tangerang", odometer: 25000, owner: "2wN7...qU8s" },
  { name: "Unit 05", vin: "NMS-005", health: 78, region: "Jakarta", odometer: 18000, owner: "5aB8...vW9t" },
  { name: "Unit 06", vin: "NMS-006", health: 90, region: "Medan", odometer: 9500, owner: "6cD2...xY1u" },
  { name: "Unit 07", vin: "NMS-007", health: 82, region: "Semarang", odometer: 16000, owner: "3eF4...zA2v" },
  { name: "Unit 08", vin: "NMS-008", health: 45, region: "Jakarta", odometer: 32000, owner: "8gH6...bC3w" },
] as any[];

const FleetLeafletMap = dynamic(() => import("@/components/ui/FleetLeafletMap"), { ssr: false });

export default function NetworkDashboardPage() {
  return (
    <div className="text-zinc-900 pb-8 w-full max-w-7xl mx-auto">
      {/* Sticky Stats Bar */}
      <DepinStatsBar />

      <div className="space-y-6">
        {/* Page header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-zinc-900">Network DePIN</h1>
            <p className="text-sm text-zinc-500">
              On-chain verified EV fleet activity — real-time, anonymized.
            </p>
          </div>
        </div>

        {/* Fleet Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fleetCategories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <cat.Icon size={20} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">{cat.name}</h3>
                  <p className="text-xs text-zinc-500">{cat.label}</p>
                </div>
              </div>
              <div className="flex items-end justify-between pt-2 border-t border-zinc-50">
                <div>
                  <p className="text-xs text-zinc-500 mb-1 font-medium uppercase tracking-wider">Registered Units</p>
                  <p className="text-2xl font-bold text-zinc-900">
                    {formatNumber(cat.units)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 mb-1 font-medium uppercase tracking-wider">Km Today</p>
                  <p className="text-xl font-bold text-teal-600">
                    {formatNumber(cat.kmToday)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full Width Map */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <MapPin size={20} className="text-teal-500" />
              Fleet Activity Map
            </h2>
            <div className="text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Live Node Updates
            </div>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden border border-zinc-200 relative z-0">
            <FleetLeafletMap vehicles={mockVehicles} />
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-zinc-900">Driving Distance</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Period</p>
                  <p className="text-2xl font-bold text-zinc-900 mt-1">
                    {formatNumber(1247832)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">km</p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Yesterday</p>
                  <p className="text-2xl font-bold text-zinc-900 mt-1">
                    {formatNumber(38291)}
                  </p>
                  <p className="text-xs text-teal-600 font-medium mt-1">
                    +8.2% vs 2 days ago
                  </p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">30 Days</p>
                  <p className="text-2xl font-bold text-zinc-900 mt-1">
                    {formatNumber(1012847)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">km</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 mb-4">Km Last 7 Days</p>
                <div className="h-[250px]">
                  <WorkshopRevenueChart data={kmData} suffix="km" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <Activity size={20} className="text-teal-500" />
                  Real-Time Activity
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className="text-left py-3 px-4 font-semibold text-zinc-500">Unit</th>
                      <th className="text-left py-3 px-4 font-semibold text-zinc-500">Zone</th>
                      <th className="text-left py-3 px-4 font-semibold text-zinc-500">Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-zinc-500">Km</th>
                      <th className="text-left py-3 px-4 font-semibold text-zinc-500">On-chain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-medium text-zinc-900">{row.unit}</td>
                        <td className="py-3 px-4 text-zinc-600">{row.zone}</td>
                        <td className="py-3 px-4 text-zinc-500">{row.time}</td>
                        <td className="py-3 px-4 font-medium text-zinc-900">{formatNumber(row.km)} km</td>
                        <td className="py-3 px-4">
                          <a
                            href="#"
                            className="font-mono text-xs flex items-center gap-1 text-teal-600 hover:text-teal-700 hover:underline bg-teal-50 px-2 py-1 rounded-md w-fit"
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
              <div className="mt-4 text-center">
                <button className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center justify-center gap-1 w-full py-2 hover:bg-teal-50 rounded-xl transition-colors">
                  View more
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Transaction Count Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex flex-col">
              <h3 className="text-lg font-bold text-zinc-900 mb-1">On-chain Submissions</h3>
              <p className="text-sm text-zinc-500 mb-6">Last 7 days</p>
              <div className="flex-1 h-[200px]">
                <WorkshopRevenueChart data={txData} />
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-200 bg-gradient-to-br from-white to-teal-50 flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-1">
                  Want to invest in this fleet?
                </h3>
                <p className="text-sm text-zinc-600">
                  View open pools in Nemesis FI.
                </p>
              </div>
              <Link
                href="/fi"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-teal-500 hover:bg-teal-400 transition-colors shadow-sm"
              >
                Go to Nemesis FI
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
