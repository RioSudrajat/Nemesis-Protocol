import { ArrowRight } from "lucide-react";
import type { StakingPool } from "@/types/fi";

export function PoolDealFlow({ pool }: { pool: StakingPool }) {
  const steps = [
    { title: "Assets operate", detail: `${pool.unitCount} productive units generate verified activity.` },
    { title: "Collections verified", detail: pool.revenueModel },
    { title: "Reserve routed", detail: `${pool.maintenanceReservePct}% maintenance reserve and ${pool.defaultReservePct}% default reserve.` },
    { title: "Investor paid", detail: `${pool.cashYieldPct}% cash yield plus scheduled principal recovery.` },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch">
      {steps.map((step, index) => (
        <div key={step.title} className="contents">
          <div className="rounded-2xl border border-zinc-950/10 bg-zinc-50 p-4">
            <span className="mb-3 grid h-7 w-7 place-items-center rounded-full bg-zinc-950 text-xs font-black text-white">{index + 1}</span>
            <h3 className="text-sm font-black text-zinc-950">{step.title}</h3>
            <p className="mt-2 text-xs leading-5 text-zinc-500">{step.detail}</p>
          </div>
          {index < steps.length - 1 && (
            <div className="hidden items-center px-1 text-zinc-300 md:flex">
              <ArrowRight className="h-5 w-5" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
