"use client";

import { useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navigation, ClipboardList, FileText } from "lucide-react";
import { useDriverStore } from "@/store/driverStore";
import { DriverOverlayControls } from "@/components/depin/DriverOverlayControls";
import { DriverBottomSheet } from "@/components/depin/DriverBottomSheet";

// Dynamic import for the map to avoid SSR issues with MapLibre
const DriverMap = dynamic(
  () => import("@/components/depin/DriverMap").then((m) => m.DriverMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 w-full h-full" style={{ background: "#0a0e17" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
        </div>
      </div>
    ),
  }
);

export default function DriverHomePage() {
  const pathname = usePathname();
  const watchIdRef = useRef<number | null>(null);

  const {
    gpsEnabled,
    currentPosition,
    todayRoute,
    todayDistance,
    todayActiveTime,
    todayAvgSpeed,
    todayEnergy,
    todayRegenPercent,
    todayRouteCoverage,
    todaySegments,
    vehicleId,
    vehicleName,
    vehicleModel,
    batteryLevel,
    dailyFee,
    isPaidToday,
    monthPaidDays,
    monthTotalDays,
    arrears,
    batteryHealthDelta,
    tireTreadDelta,
    brakePadStatus,
    nextServiceKm,
    sheetExpanded,
    toggleGps,
    setSheetExpanded,
    updatePosition,
  } = useDriverStore();

  // Geolocation watch effect
  const startWatching = useCallback(() => {
    if (!navigator.geolocation) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        updatePosition(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  }, [updatePosition]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (gpsEnabled) {
      startWatching();
    } else {
      stopWatching();
    }
    return () => stopWatching();
  }, [gpsEnabled, startWatching, stopWatching]);

  // Nav items
  const navItems = [
    { href: "/depin/driver", label: "Tracker", icon: Navigation },
    { href: "/depin/driver/routes", label: "Routes", icon: ClipboardList },
    { href: "/depin/driver/docs", label: "Docs", icon: FileText },
  ];

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden" style={{ background: "#0a0e17" }}>
      {/* Full-screen map */}
      <DriverMap
        currentPosition={currentPosition}
        todayRoute={todayRoute}
        gpsEnabled={gpsEnabled}
      />

      {/* Overlay controls */}
      <DriverOverlayControls
        gpsEnabled={gpsEnabled}
        onToggleGps={toggleGps}
        isPaidToday={isPaidToday}
        dailyFee={dailyFee}
      />

      {/* Bottom sheet */}
      <DriverBottomSheet
        expanded={sheetExpanded}
        onToggle={setSheetExpanded}
        vehicleId={vehicleId}
        vehicleName={vehicleName}
        vehicleModel={vehicleModel}
        gpsEnabled={gpsEnabled}
        todayDistance={todayDistance}
        todayActiveTime={todayActiveTime}
        todayAvgSpeed={todayAvgSpeed}
        todayEnergy={todayEnergy}
        todayRegenPercent={todayRegenPercent}
        todayRouteCoverage={todayRouteCoverage}
        todaySegments={todaySegments}
        batteryLevel={batteryLevel}
        dailyFee={dailyFee}
        isPaidToday={isPaidToday}
        monthPaidDays={monthPaidDays}
        monthTotalDays={monthTotalDays}
        arrears={arrears}
        batteryHealthDelta={batteryHealthDelta}
        tireTreadDelta={tireTreadDelta}
        brakePadStatus={brakePadStatus}
        nextServiceKm={nextServiceKm}
      />

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto"
        style={{
          background: "rgba(10, 14, 23, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(94, 234, 212, 0.12)",
        }}
      >
        <div className="grid grid-cols-3 text-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 flex flex-col items-center gap-0.5 transition-colors"
              >
                <Icon
                  size={20}
                  style={{ color: isActive ? "#5EEAD4" : "#71717A" }}
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? "#5EEAD4" : "#71717A" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
