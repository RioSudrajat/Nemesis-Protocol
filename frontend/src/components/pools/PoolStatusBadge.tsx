import type { PoolStatus } from "@/types/fi";
import { getStatusTone } from "@/lib/poolCampaignViewModel";

export function PoolStatusBadge({ status, label }: { status: PoolStatus; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusTone(status)}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
