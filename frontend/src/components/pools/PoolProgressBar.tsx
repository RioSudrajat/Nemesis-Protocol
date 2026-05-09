import { formatIDRXFull } from "@/lib/yield";

export function PoolProgressBar({ supplied, target, fillPct }: { supplied: number; target: number; fillPct: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-500">Capital supplied</span>
        <span className="font-bold text-zinc-950">{fillPct}%</span>
      </div>
      <div className="mb-2 h-2 overflow-hidden rounded-full bg-zinc-100">
        <div className="h-full rounded-full bg-teal-500" style={{ width: `${fillPct}%` }} />
      </div>
      <p className="text-xs text-zinc-500">
        {formatIDRXFull(supplied)} of {formatIDRXFull(target)}
      </p>
    </div>
  );
}
