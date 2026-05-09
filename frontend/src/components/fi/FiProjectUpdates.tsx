import Link from "next/link";
import type { PoolReport, StakingPool } from "@/types/fi";

export function FiProjectUpdates({ reports, pools }: { reports: PoolReport[]; pools: StakingPool[] }) {
  const poolById = new Map(pools.map((pool) => [pool.id, pool]));
  const latest = reports
    .filter((report) => report.isPublished)
    .sort((a, b) => b.period.localeCompare(a.period))
    .slice(0, 3);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-zinc-950">Project updates</h2>
        <Link href="/fi/pools" className="text-sm font-bold text-zinc-500 hover:text-zinc-950">View pools</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {latest.map((report) => {
          const pool = poolById.get(report.poolId);
          return (
            <Link key={report.id} href={`/fi/pools/${report.poolId}`} className="rounded-[1.25rem] border border-zinc-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">{report.period}</p>
              <h3 className="text-base font-black text-zinc-950">{report.operatorHeadline || pool?.name || report.poolId}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">{report.operatorNarrative || report.autoNarrative}</p>
            </Link>
          );
        })}
        {latest.length === 0 && (
          <div className="rounded-[1.25rem] border border-dashed border-zinc-950/15 bg-white p-5 text-sm text-zinc-500">
            Published pool reports will appear here.
          </div>
        )}
      </div>
    </section>
  );
}
