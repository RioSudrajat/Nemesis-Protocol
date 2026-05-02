"use client";

interface ChartPoint {
  day?: string;
  name?: string;
  value?: number;
  revenue?: number;
}

interface WorkshopRevenueChartProps {
  data?: ChartPoint[];
  /** Optional unit label shown after the value in the tooltip (e.g. "km", "tx"). Leave empty for plain numbers. */
  suffix?: string;
  /** Bar fill color (solid). Defaults to teal. */
  color?: string;
  variant?: "light" | "dark";
}

const defaultData: ChartPoint[] = [
  { day: "Sen", value: 120 },
  { day: "Sel", value: 450 },
  { day: "Rab", value: 300 },
  { day: "Kam", value: 600 },
  { day: "Jum", value: 250 },
  { day: "Sab", value: 800 },
  { day: "Min", value: 150 },
];

const formatNumber = (n: number) => new Intl.NumberFormat("id-ID").format(n);
const compactNumber = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

export function WorkshopRevenueChart({
  data = defaultData,
  suffix = "",
  color = "#14B8A6",
  variant = "light",
}: WorkshopRevenueChartProps) {
  const normalized = data.map((d) => ({
    label: d.day ?? d.name ?? "",
    value: d.value ?? d.revenue ?? 0,
  }));

  const maxVal = Math.max(...normalized.map((d) => d.value)) || 1;
  const total = normalized.reduce((sum, item) => sum + item.value, 0);
  const average = normalized.length ? total / normalized.length : 0;
  const peak = Math.max(...normalized.map((d) => d.value));

  if (variant === "dark") {
    return (
      <div className="mt-5">
        <div className="mb-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
          {[
            { label: "Total", value: compactNumber(total) },
            { label: "Average", value: compactNumber(average) },
            { label: "Peak", value: compactNumber(peak) },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">{item.label}</div>
              <div className="mt-1 text-sm font-semibold tracking-[-0.02em] text-white/76">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/[0.07] bg-[#050606] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] [scrollbar-color:rgba(148,163,184,0.28)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15">
          <div className="min-w-[360px]">
            <div className="grid grid-cols-[56px_1fr_82px_78px] gap-3 border-b border-white/[0.055] px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/26 sm:grid-cols-[64px_1fr_92px_86px] sm:gap-4 sm:px-4">
              <span>Day</span>
              <span>Settlement Rail</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Status</span>
            </div>

            <div className="divide-y divide-white/[0.055]">
              {normalized.map((item, index) => {
                const progress = Math.max((item.value / maxVal) * 100, 8);
                const isPeak = item.value === peak;
                const proofCount = 17 + index + Math.round((item.value / maxVal) * 8);
                const status = isPeak ? "Cleared" : index === normalized.length - 1 ? "Queued" : "Settled";
                return (
                  <div
                    key={`${item.label}-${index}`}
                    className="grid grid-cols-[56px_1fr_82px_78px] items-center gap-3 px-3 py-3 transition hover:bg-white/[0.025] sm:grid-cols-[64px_1fr_92px_86px] sm:gap-4 sm:px-4"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white/68">{item.label}</div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/24">
                        T+{index + 1}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <span className="truncate text-[11px] text-white/30">{proofCount} proofs matched</span>
                        <span className="text-[11px] text-white/24">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.035]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${progress}%`,
                            background: "linear-gradient(90deg, rgba(255,255,255,0.42) 0%, rgba(221,253,248,0.56) 38%, rgba(94,234,212,0.72) 100%)",
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-right text-xs font-semibold text-white/68 sm:text-sm">
                      {formatNumber(item.value)}
                      {suffix && <span className="ml-1 text-[10px] font-medium text-white/26">{suffix}</span>}
                    </div>

                    <div className="flex justify-end">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] sm:px-2.5 sm:text-[10px] ${
                          status === "Queued"
                            ? "border-amber-200/12 bg-white/[0.03] text-amber-100/62"
                            : "border-white/[0.07] bg-white/[0.028] text-white/50"
                        }`}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: status === "Queued" ? "rgba(252,211,77,0.68)" : "rgba(94,234,212,0.72)" }}
                        />
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex h-44 w-full items-end gap-2 pt-4">
      {normalized.map((item, i) => {
        const heightPct = (item.value / maxVal) * 100;
        return (
          <div
            key={`${item.label}-${i}`}
            className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end"
          >
            <div
              className="w-full rounded-t-md transition-opacity group-hover:opacity-100"
              style={{ height: `${heightPct}%`, background: color, opacity: 0.85 }}
            />
            <span className="text-[11px] text-zinc-500">
              {item.label}
            </span>
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-semibold px-2 py-1 rounded z-20 pointer-events-none"
              style={{
                background: "#FFFFFF",
                color: "#0F766E",
                border: "1px solid rgba(20,184,166,0.25)",
                boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
              }}
            >
              {formatNumber(item.value)}
              {suffix ? ` ${suffix}` : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}
