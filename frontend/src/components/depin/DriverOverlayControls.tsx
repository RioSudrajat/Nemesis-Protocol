"use client";

import { Navigation } from "lucide-react";

interface DriverOverlayControlsProps {
  gpsEnabled: boolean;
  onToggleGps: () => void;
  isPaidToday: boolean;
  dailyFee: number;
}

export function DriverOverlayControls({
  gpsEnabled,
  onToggleGps,
  isPaidToday,
  dailyFee,
}: DriverOverlayControlsProps) {
  return (
    <>
      {/* GPS Toggle — top left */}
      <button
        onClick={onToggleGps}
        className="absolute top-16 left-4 z-10 flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all active:scale-95"
        style={{
          background: gpsEnabled
            ? "rgba(34, 197, 94, 0.2)"
            : "rgba(239, 68, 68, 0.2)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: gpsEnabled
            ? "1px solid rgba(34, 197, 94, 0.4)"
            : "1px solid rgba(239, 68, 68, 0.4)",
          boxShadow: gpsEnabled
            ? "0 4px 20px rgba(34, 197, 94, 0.2)"
            : "0 4px 20px rgba(239, 68, 68, 0.2)",
        }}
      >
        <Navigation
          size={16}
          style={{ color: gpsEnabled ? "#22C55E" : "#EF4444" }}
        />
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: gpsEnabled ? "#22C55E" : "#EF4444" }}
        >
          GPS {gpsEnabled ? "ON" : "OFF"}
        </span>
      </button>

      {/* Rental Fee Chip — top right */}
      <div
        className="absolute top-16 right-4 z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl"
        style={{
          background: "rgba(10, 14, 23, 0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold">
          Fee
        </span>
        <span className="text-xs font-bold text-white">
          Rp {dailyFee.toLocaleString("id-ID")}
        </span>
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: isPaidToday ? "#22C55E" : "#EF4444",
            boxShadow: isPaidToday
              ? "0 0 6px rgba(34,197,94,0.6)"
              : "0 0 6px rgba(239,68,68,0.6)",
          }}
        />
      </div>
    </>
  );
}
