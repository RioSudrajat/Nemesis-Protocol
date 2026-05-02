"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ChartData {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface InteractiveDonutChartProps {
  data?: ChartData[];
  centerLabel?: string;
  centerValue?: string;
}

const defaultData: ChartData[] = [
  { id: "active", label: "Active", value: 71, color: "#5EEAD4" },
  { id: "maintenance", label: "Maintenance", value: 6, color: "#FCD34D" },
  { id: "idle", label: "Idle", value: 18, color: "#94A3B8" },
  { id: "offline", label: "Offline", value: 5, color: "#FDA4AF" },
];

export function InteractiveDonutChart({
  data = defaultData,
  centerValue,
}: InteractiveDonutChartProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const selected = data[selectedIndex] ?? data[0];
  const selectedPct = selected ? Math.round((selected.value / total) * 100) : 0;
  const unitTotal = Number(centerValue?.match(/\d+/)?.[0] ?? total);
  const selectedUnits = Math.max(1, Math.round((selectedPct / 100) * unitTotal));
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (selectedPct / 100) * circumference;

  return (
    <div className="relative flex w-full flex-col items-center pt-3">
      <div className="relative h-[268px] w-[268px]">
        <svg viewBox="0 0 268 268" className="h-full w-full overflow-visible">
          <circle
            cx="134"
            cy="134"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.045)"
            strokeWidth="16"
          />
          <circle
            cx="134"
            cy="134"
            r={radius - 34}
            fill="rgba(255,255,255,0.014)"
            stroke="rgba(255,255,255,0.045)"
            strokeWidth="1"
          />
          <motion.circle
            cx="134"
            cy="134"
            r={radius}
            fill="none"
            stroke={selected?.color ?? "#5EEAD4"}
            opacity="0.78"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeDashoffset={circumference * 0.25}
            initial={false}
            animate={{
              strokeDasharray: `${arcLength} ${circumference - arcLength}`,
              stroke: selected?.color ?? "#5EEAD4",
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            transform="rotate(-90 134 134)"
            style={{ filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.48))" }}
          />
        </svg>

        <div className="pointer-events-none absolute inset-0 flex translate-y-[2px] flex-col items-center justify-center px-12 text-center">
          <span
            className="max-w-[130px] truncate text-[10px] font-semibold uppercase leading-none tracking-[0.14em]"
            style={{ color: selected?.color ? `${selected.color}CC` : "rgba(255,255,255,0.44)" }}
          >
            {selected?.label ?? "Selected"}
          </span>
          <span className="mt-2 text-[40px] font-semibold leading-[0.9] tracking-[-0.06em] text-white">
            {selectedPct}%
          </span>
          <span className="mt-2 text-[11px] font-medium leading-none text-white/36">
            {selectedUnits} of {unitTotal} units
          </span>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-2">
        {data.map((item, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-left text-xs transition ${
                isSelected
                  ? "border-white/[0.1] bg-white/[0.045] text-white/74"
                  : "border-white/[0.06] bg-white/[0.018] text-white/42 hover:bg-white/[0.035] hover:text-white/62"
              }`}
            >
              <span className="h-2 w-2 shrink-0 rounded-full opacity-75" style={{ backgroundColor: item.color }} />
              <span className="min-w-0 truncate">{item.label}</span>
              <span className="ml-auto font-semibold text-white/62">{item.value}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
