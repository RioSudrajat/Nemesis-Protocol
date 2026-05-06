import { create } from "zustand";
import type { RegisteredDriver } from "@/store/useNemesisStore";

// Re-export for backward compatibility
export type { RegisteredDriver } from "@/store/useNemesisStore";

interface DriverAuthState {
  // Auth state
  isAuthenticated: boolean;
  currentDriver: RegisteredDriver | null;
  /** Phone entered on login screen */
  loginPhone: string;
  /** Generated OTP for mock verification */
  generatedOtp: string;
  /** Whether OTP has been sent */
  otpSent: boolean;
  /** Error message */
  error: string;
  /** Loading state */
  isLoading: boolean;

  // Actions
  setLoginPhone: (phone: string) => void;
  sendOtp: () => void;
  verifyOtp: (otp: string) => void;
  logout: () => void;
  checkSession: () => void;
  clearError: () => void;
}

const SESSION_KEY = "nemesis_driver_session";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function loadSession(): RegisteredDriver | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Check expiry (30 days)
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed.driver as RegisteredDriver;
  } catch {
    return null;
  }
}

function saveSession(driver: RegisteredDriver): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      driver,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    })
  );
}

function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Helper to get drivers from NemesisStore.
 * We lazily import to avoid circular dependency issues.
 */
function getDriversFromNemesisStore(): RegisteredDriver[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useNemesisStore } = require("@/store/useNemesisStore");
    return useNemesisStore.getState().drivers ?? [];
  } catch {
    return [];
  }
}

export const useDriverAuthStore = create<DriverAuthState>((set, get) => ({
  isAuthenticated: false,
  currentDriver: null,
  loginPhone: "",
  generatedOtp: "",
  otpSent: false,
  error: "",
  isLoading: false,

  setLoginPhone: (phone) => set({ loginPhone: phone, error: "" }),

  sendOtp: () => {
    const { loginPhone } = get();

    // Normalize phone: allow user to enter without +62 prefix
    let normalized = loginPhone.replace(/\s/g, "");
    if (normalized.startsWith("08")) {
      normalized = "+62" + normalized.slice(1);
    } else if (normalized.startsWith("62")) {
      normalized = "+" + normalized;
    } else if (!normalized.startsWith("+62")) {
      normalized = "+62" + normalized;
    }

    // Read drivers from the unified NemesisStore
    const registeredDrivers = getDriversFromNemesisStore();
    const driver = registeredDrivers.find((d) => d.phone === normalized);
    if (!driver) {
      set({ error: "This phone number is not registered. Contact your operator." });
      return;
    }

    const otp = generateOtp();
    // In a real app, send SMS. For demo, we log it.
    console.log(`[Nemesis OTP] Code for ${normalized}: ${otp}`);

    set({
      generatedOtp: otp,
      otpSent: true,
      loginPhone: normalized,
      error: "",
      isLoading: false,
    });
  },

  verifyOtp: (otp) => {
    const { generatedOtp, loginPhone } = get();
    set({ isLoading: true });

    // Simulate network delay
    setTimeout(() => {
      if (otp !== generatedOtp) {
        set({ error: "Invalid OTP code. Please try again.", isLoading: false });
        return;
      }

      // Read drivers from the unified NemesisStore
      const registeredDrivers = getDriversFromNemesisStore();
      const driver = registeredDrivers.find((d) => d.phone === loginPhone);
      if (!driver) {
        set({ error: "Driver not found.", isLoading: false });
        return;
      }

      saveSession(driver);
      set({
        isAuthenticated: true,
        currentDriver: driver,
        otpSent: false,
        generatedOtp: "",
        error: "",
        isLoading: false,
      });
    }, 800);
  },

  logout: () => {
    clearSession();
    set({
      isAuthenticated: false,
      currentDriver: null,
      loginPhone: "",
      generatedOtp: "",
      otpSent: false,
      error: "",
    });
  },

  checkSession: () => {
    const driver = loadSession();
    if (driver) {
      set({ isAuthenticated: true, currentDriver: driver });
    }
  },

  clearError: () => set({ error: "" }),
}));
