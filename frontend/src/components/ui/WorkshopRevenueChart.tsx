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

export function WorkshopRevenueChart({
  data = defaultData,
  suffix = "",
  color = "#14B8A6",
}: WorkshopRevenueChartProps) {
  const normalized = data.map((d) => ({
    label: d.day ?? d.name ?? "",
    value: d.value ?? d.revenue ?? 0,
  }));

  const maxVal = Math.max(...normalized.map((d) => d.value)) || 1;

  return (
    <div className="flex items-end gap-2 h-40 mt-4 pt-4 w-full">
      {normalized.map((item, i) => {
        const heightPct = (item.value / maxVal) * 100;
        return (
          <div
            key={`${item.label}-${i}`}
            className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end"
          >
            <div
              className="w-full rounded-t-sm transition-colors"
              style={{ height: `${heightPct}%`, background: color, opacity: 0.85 }}
            />
            <span className="text-[11px] text-zinc-500">{item.label}</span>
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
