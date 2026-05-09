import Link from "next/link";
import type { InvestorPosition } from "@/types/fi";
import { formatIDRXFull } from "@/lib/yield";

export function PortfolioLiveProjects({ positions }: { positions: InvestorPosition[] }) {
  return (
    <section className="rounded-[1.5rem] border border-zinc-950/10 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-zinc-950">Live projects</h2>
      <div className="mt-5 space-y-3">
        {positions.map((position) => (
          <Link
            key={position.id ?? position.poolId}
            href={`/fi/pools/${position.poolId}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-950/10 p-4 transition hover:bg-zinc-50"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-zinc-950">{position.poolName}</p>
              <p className="mt-1 text-xs font-semibold text-zinc-500">{position.cashYieldPct}% cash yield · {position.tenorMonths} mo</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-zinc-950">{formatIDRXFull(position.invested)}</p>
              <p className="mt-1 text-xs text-zinc-500">Invested</p>
            </div>
          </Link>
        ))}
        {positions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-950/15 p-5 text-sm leading-6 text-zinc-500">
            No active positions yet. Published campaigns will appear after you invest.
          </div>
        )}
      </div>
    </section>
  );
}
