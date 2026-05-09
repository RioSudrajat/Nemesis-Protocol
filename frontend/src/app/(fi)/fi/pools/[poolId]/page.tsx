"use client";

import { use } from "react";
import Link from "next/link";
import { MOCK_YIELD_DISTRIBUTIONS } from "@/data/pools";
import { selectAssetsByPool, useNemesisStore } from "@/store/useNemesisStore";
import { PoolDetailSummaryRail } from "@/components/fi/PoolDetailSummaryRail";
import { PoolDetailTabs } from "@/components/fi/PoolDetailTabs";
import { PoolOperatingAssetsTable } from "@/components/fi/PoolOperatingAssetsTable";

export default function PoolDetailPage({ params }: { params: Promise<{ poolId: string }> }) {
  const { poolId } = use(params);
  const nemesisState = useNemesisStore();
  const { pools, poolReports } = nemesisState;
  const pool = pools.find((item) => item.id === poolId);
  const poolAssets = pool ? selectAssetsByPool(nemesisState, pool.id) : [];
  const teamMembers = pool?.teamMembers ?? [];

  const reports = pool
    ? poolReports
        .filter((report) => report.poolId === pool.id && report.isPublished)
        .sort((a, b) => b.period.localeCompare(a.period))
    : [];
  const distributions = pool ? MOCK_YIELD_DISTRIBUTIONS[pool.id] ?? [] : [];

  if (!pool) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-6 text-zinc-950 md:p-8">
        <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-zinc-950/10 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Pool not found</p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950">This financing pool does not exist.</h1>
          <Link href="/fi/pools" className="mt-6 inline-flex rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white">
            Back to FI pools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 text-zinc-950 md:p-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm font-semibold text-zinc-500">
            <li><Link href="/fi" className="hover:text-zinc-950">FI Home</Link></li>
            <li>
              <svg className="h-4 w-4 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li><Link href="/fi/pools" className="hover:text-zinc-950">Pools</Link></li>
            <li>
              <svg className="h-4 w-4 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-zinc-900" aria-current="page">{pool.name}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          {/* Main Content Area */}
          <div className="min-w-0 space-y-8">
            <PoolDetailTabs
              pool={pool}
              poolAssets={poolAssets}
              reports={reports}
              distributions={distributions}
              teamMembers={teamMembers}
            />
            <PoolOperatingAssetsTable assets={poolAssets} />
          </div>

          {/* Sticky Sidebar */}
          <div>
            <PoolDetailSummaryRail pool={pool} />
          </div>
        </div>
      </div>
    </div>
  );
}
