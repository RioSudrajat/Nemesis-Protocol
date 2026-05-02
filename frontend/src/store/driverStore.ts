import { create } from "zustand";

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface RouteLog {
  id: string;
  date: string; // ISO date string
  title: string;
  distance: number; // km
  duration: number; // seconds
  avgSpeed: number; // km/h
  energy: number; // kWh
  regenPercent: number;
  routeCoverage: number; // %
  segments: number;
  route: RoutePoint[];
}

interface DriverState {
  // GPS
  gpsEnabled: boolean;
  currentPosition: { lat: number; lng: number } | null;

  // Today's tracking
  todayRoute: RoutePoint[];
  todayStartTime: number | null;
  todayDistance: number;
  todayActiveTime: number;
  todayAvgSpeed: number;
  todayEnergy: number;
  todayRegenPercent: number;
  todayRouteCoverage: number;
  todaySegments: number;

  // Vehicle info
  vehicleId: string;
  vehicleName: string;
  vehicleModel: string;
  batteryLevel: number;

  // Rental
  dailyFee: number;
  isPaidToday: boolean;
  monthPaidDays: number;
  monthTotalDays: number;
  arrears: number;

  // Component health
  batteryHealthDelta: number;
  tireTreadDelta: number;
  brakePadStatus: string;
  nextServiceKm: number;

  // Route log history
  routeLogs: RouteLog[];

  // Bottom sheet
  sheetExpanded: boolean;

  // Actions
  toggleGps: () => void;
  setSheetExpanded: (expanded: boolean) => void;
  updatePosition: (lat: number, lng: number) => void;
  resetDaily: () => void;
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const useDriverStore = create<DriverState>((set, get) => ({
  // GPS
  gpsEnabled: false,
  currentPosition: null,

  // Today's tracking
  todayRoute: [],
  todayStartTime: null,
  todayDistance: 0,
  todayActiveTime: 0,
  todayAvgSpeed: 0,
  todayEnergy: 0,
  todayRegenPercent: 3.2,
  todayRouteCoverage: 0,
  todaySegments: 0,

  // Vehicle — mock defaults
  vehicleId: "NMS-0001",
  vehicleName: "Unit Alpha",
  vehicleModel: "Honda EM1 e:",
  batteryLevel: 78,

  // Rental — mock defaults
  dailyFee: 50000,
  isPaidToday: true,
  monthPaidDays: 28,
  monthTotalDays: 30,
  arrears: 0,

  // Component health
  batteryHealthDelta: -0.01,
  tireTreadDelta: -0.12,
  brakePadStatus: "Minimal (Regen)",
  nextServiceKm: 280,

  // Route logs — seed with mock history
  routeLogs: [
    {
      id: "log-001",
      date: new Date(Date.now() - 86400000).toISOString(),
      title: "Central Jakarta route coverage",
      distance: 14.7,
      duration: 2535,
      avgSpeed: 28,
      energy: 1.8,
      regenPercent: 4.2,
      routeCoverage: 92,
      segments: 7,
      route: [
        { lat: -6.225, lng: 106.81, timestamp: Date.now() - 86400000 },
        { lat: -6.23, lng: 106.812, timestamp: Date.now() - 86400000 + 300000 },
        { lat: -6.235, lng: 106.815, timestamp: Date.now() - 86400000 + 600000 },
        { lat: -6.242, lng: 106.812, timestamp: Date.now() - 86400000 + 900000 },
        { lat: -6.25, lng: 106.814, timestamp: Date.now() - 86400000 + 1200000 },
        { lat: -6.255, lng: 106.818, timestamp: Date.now() - 86400000 + 1500000 },
        { lat: -6.262, lng: 106.816, timestamp: Date.now() - 86400000 + 1800000 },
      ],
    },
    {
      id: "log-002",
      date: new Date(Date.now() - 172800000).toISOString(),
      title: "South Jakarta movement segment",
      distance: 8.5,
      duration: 1530,
      avgSpeed: 22,
      energy: 1.1,
      regenPercent: 2.8,
      routeCoverage: 76,
      segments: 4,
      route: [
        { lat: -6.28, lng: 106.8, timestamp: Date.now() - 172800000 },
        { lat: -6.285, lng: 106.805, timestamp: Date.now() - 172800000 + 400000 },
        { lat: -6.29, lng: 106.81, timestamp: Date.now() - 172800000 + 800000 },
        { lat: -6.295, lng: 106.808, timestamp: Date.now() - 172800000 + 1200000 },
      ],
    },
  ],

  // Bottom sheet
  sheetExpanded: false,

  // Actions
  toggleGps: () => {
    const state = get();
    const newEnabled = !state.gpsEnabled;
    set({
      gpsEnabled: newEnabled,
      todayStartTime: newEnabled && !state.todayStartTime ? Date.now() : state.todayStartTime,
    });
  },

  setSheetExpanded: (expanded) => set({ sheetExpanded: expanded }),

  updatePosition: (lat, lng) => {
    const state = get();
    if (!state.gpsEnabled) return;

    const now = Date.now();
    const newPoint: RoutePoint = { lat, lng, timestamp: now };
    const route = [...state.todayRoute, newPoint];

    // Calculate incremental distance
    let addedDist = 0;
    if (state.todayRoute.length > 0) {
      const last = state.todayRoute[state.todayRoute.length - 1];
      addedDist = haversineDistance(last.lat, last.lng, lat, lng);
    }

    const totalDist = state.todayDistance + addedDist;
    const activeTime = state.todayStartTime
      ? (now - state.todayStartTime) / 1000
      : 0;
    const avgSpeed = activeTime > 0 ? (totalDist / activeTime) * 3600 : 0;
    // Mock energy: ~0.12 kWh per km for an e-bike
    const energy = totalDist * 0.12;
    // Mock route coverage based on distance
    const coverage = Math.min(95, Math.round((totalDist / 20) * 100));
    // Segments = direction changes (simplified: every 5 route points)
    const segments = Math.max(1, Math.floor(route.length / 5));

    set({
      currentPosition: { lat, lng },
      todayRoute: route,
      todayDistance: totalDist,
      todayActiveTime: activeTime,
      todayAvgSpeed: avgSpeed,
      todayEnergy: energy,
      todayRouteCoverage: coverage,
      todaySegments: segments,
    });
  },

  resetDaily: () => {
    const state = get();
    // Save today's route as a log entry
    if (state.todayRoute.length > 1) {
      const newLog: RouteLog = {
        id: `log-${Date.now()}`,
        date: new Date().toISOString(),
        title: `Daily route — ${state.todayDistance.toFixed(1)} km`,
        distance: state.todayDistance,
        duration: state.todayActiveTime,
        avgSpeed: state.todayAvgSpeed,
        energy: state.todayEnergy,
        regenPercent: state.todayRegenPercent,
        routeCoverage: state.todayRouteCoverage,
        segments: state.todaySegments,
        route: state.todayRoute,
      };
      set({ routeLogs: [newLog, ...state.routeLogs] });
    }

    // Reset today
    set({
      todayRoute: [],
      todayStartTime: null,
      todayDistance: 0,
      todayActiveTime: 0,
      todayAvgSpeed: 0,
      todayEnergy: 0,
      todayRouteCoverage: 0,
      todaySegments: 0,
    });
  },
}));
