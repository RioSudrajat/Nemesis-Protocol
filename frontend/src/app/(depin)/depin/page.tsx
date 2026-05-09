"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { WorkshopRevenueChart } from "@/components/ui/WorkshopRevenueChart";
import { DepinStatsBar } from "@/components/ui/DepinStatsBar";
import { formatNumber } from "@/lib/yield";
import { useNemesisStore } from "@/store/useNemesisStore";
import {
  deriveDepinActivityRows,
  deriveFleetCategoryCards,
  deriveSevenDaySeries,
  deriveTxSeries,
} from "@/lib/depinNetworkDerivations";
import {
  Activity,
  MapPin,
  ExternalLink,
  ChevronRight,
  Bike,
  Package,
  Truck,
} from "lucide-react";

const CATEGORY_ICONS = { Ojol: Bike, Kurir: Package, Logistik: Truck, Korporat: Truck };

const FleetMapLibreMap = dynamic(() => import("@/components/maps/FleetMapLibreMap"), { ssr: false });

export default function NetworkDashboardPage() {
  const { assets, poolReports } = useNemesisStore();
  const fleetCategories = deriveFleetCategoryCards(assets).map((category) => ({
    ...category,
    Icon: CATEGORY_ICONS[category.name as keyof typeof CATEGORY_ICONS] ?? Bike,
  }));
  const kmData = deriveSevenDaySeries(assets, poolReports);
  const txData = deriveTxSeries(assets);
  const activityRows = deriveDepinActivityRows(assets, 8);
  const mapVehicles = assets.map((asset) => ({
    id: asset.id,
    name: `${asset.brand} ${asset.model} ${asset.unitId}`,
    vin: asset.vin ?? asset.unitId,
    health: asset.healthScore,
    odometer: asset.odometer ?? 0,
    owner: asset.operatorId,
    status: asset.status,
  }));

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
              On-chain verified EV infrastructure asset activity — real-time, anonymized.
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
              EV Infrastructure Activity Map
            </h2>
            <div className="text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Live Node Updates
            </div>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden border border-zinc-200 relative z-0">
            <FleetMapLibreMap vehicles={mapVehicles} />
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
                  Want to invest in these EV infrastructure assets?
                </h3>
                <p className="text-sm text-zinc-600">
                  View open pools in Nemesis FI.
                </p>
              </div>
              <Link
                href="/fi/pools"
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
