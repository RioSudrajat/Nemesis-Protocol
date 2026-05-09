import type { YieldDistribution } from "@/types/fi";
import { formatIDRXFull } from "@/lib/yield";

interface PoolDistributionTimelineProps {
  distributions: YieldDistribution[];
}

export function PoolDistributionTimeline({ distributions }: PoolDistributionTimelineProps) {
  if (!distributions || distributions.length === 0) {
    return (
      <p className="text-sm text-zinc-400">No distributions recorded yet.</p>
    );
  }

  return (
    <ol className="relative border-l-2 border-zinc-100 space-y-6 pl-6 py-2">
      {distributions.map((dist) => (
        <li key={dist.id} className="relative">
          <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-teal-500 ring-4 ring-white" />
          <time className="text-xs font-bold text-zinc-400">
            {new Date(dist.date).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </time>
          <dl className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="text-zinc-500">Cash yield</dt>
              <dd className="font-semibold text-teal-700">{formatIDRXFull(dist.yieldDistributed)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-zinc-500">Principal</dt>
              <dd className="font-semibold text-zinc-950">{formatIDRXFull(dist.principalReturned)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-zinc-500">Health</dt>
              <dd className="font-semibold text-zinc-950">{dist.collectionHealthPct.toFixed(1)}%</dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}
