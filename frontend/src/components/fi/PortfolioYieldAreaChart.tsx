"use client";

import { formatIDRXFull } from "@/lib/yield";

export interface PortfolioYieldPoint {
  label: string;
  value: number;
}

export function PortfolioYieldAreaChart({ data }: { data: PortfolioYieldPoint[] }) {
  const points = data.length ? data : [{ label: "-", value: 0 }];
  const width = 720;
  const height = 300;
  const padding = { top: 24, right: 24, bottom: 36, left: 54 };
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const xStep = points.length > 1 ? (width - padding.left - padding.right) / (points.length - 1) : 0;
  const coords = points.map((point, index) => {
    const x = padding.left + index * xStep;
    const y = padding.top + (1 - point.value / maxValue) * (height - padding.top - padding.bottom);
    return { ...point, x, y };
  });
  const linePath = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${coords.at(-1)?.x ?? padding.left} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;
  const total = points.at(-1)?.value ?? 0;

  return (
    <div>
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-zinc-500">Yield earned over time</p>
          <p className="mt-1 text-4xl font-black tracking-tight text-zinc-950">{formatIDRXFull(total)}</p>
        </div>
        <div className="inline-flex rounded-2xl bg-zinc-100 p-1 text-xs font-bold text-zinc-500">
          <span className="rounded-xl bg-white px-3 py-2 text-zinc-950 shadow-sm">Earnings</span>
          <span className="px-3 py-2">Allocation</span>
        </div>
      </div>
      <div className="overflow-hidden rounded-[1.25rem] bg-white">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[280px] w-full" role="img" aria-label="Portfolio yield area chart">
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = padding.top + tick * (height - padding.top - padding.bottom);
            return (
              <g key={tick}>
                <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="rgba(15,23,42,0.08)" />
                <text x={padding.left - 14} y={y + 4} textAnchor="end" className="fill-zinc-400 text-[11px] font-semibold">
                  {Math.round(maxValue * (1 - tick) / 1_000_000)}M
                </text>
              </g>
            );
          })}
          <defs>
            <linearGradient id="portfolioYieldArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#portfolioYieldArea)" />
          <path d={linePath} fill="none" stroke="#14B8A6" strokeLinecap="round" strokeWidth="4" />
          {coords.map((point) => (
            <g key={`${point.label}-${point.x}`}>
              <circle cx={point.x} cy={point.y} r="4" fill="#14B8A6" stroke="white" strokeWidth="3" />
              <text x={point.x} y={height - 12} textAnchor="middle" className="fill-zinc-500 text-[11px] font-semibold">
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
