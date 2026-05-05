import { create } from "zustand";

export interface RegisteredDriver {
  id: string;
  phone: string;
  fullName: string;
  kycStatus: "pending" | "verified" | "rejected";
  assignedVehicleId: string;
  assignedVehicleName: string;
  contractType: "rent" | "rent_to_own";
  dailyFee: number; // IDR
  registeredAt: string;
}

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

  // Registered drivers (mock database — seeded + operator can add)
  registeredDrivers: RegisteredDriver[];

  // Actions
  setLoginPhone: (phone: string) => void;
  sendOtp: () => void;
  verifyOtp: (otp: string) => void;
  logout: () => void;
  checkSession: () => void;
  registerDriver: (driver: Omit<RegisteredDriver, "id" | "registeredAt">) => void;
  clearError: () => void;
}

/** Mock seed: pre-registered drivers so demo works out of the box */
const SEED_DRIVERS: RegisteredDriver[] = [
  {
    id: "drv-001",
    phone: "+6281234567890",
    fullName: "Budi Santoso",
    kycStatus: "verified",
    assignedVehicleId: "NMS-0001",
    assignedVehicleName: "Honda EM1 e:",
    contractType: "rent_to_own",
    dailyFee: 50000,
    registeredAt: "2026-03-15T08:00:00Z",
  },
  {
    id: "drv-002",
    phone: "+6281298765432",
    fullName: "Agus Pratama",
    kycStatus: "verified",
    assignedVehicleId: "NMS-0002",
    assignedVehicleName: "Viar Q1",
    contractType: "rent",
    dailyFee: 45000,
    registeredAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "drv-003",
    phone: "+6287700001111",
    fullName: "Dewi Lestari",
    kycStatus: "pending",
    assignedVehicleId: "NMS-0003",
    assignedVehicleName: "Gesits G1",
    contractType: "rent_to_own",
    dailyFee: 50000,
    registeredAt: "2026-04-20T14:00:00Z",
  },
];

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

export const useDriverAuthStore = create<DriverAuthState>((set, get) => ({
  isAuthenticated: false,
  currentDriver: null,
  loginPhone: "",
  generatedOtp: "",
  otpSent: false,
  error: "",
  isLoading: false,
  registeredDrivers: [...SEED_DRIVERS],

  setLoginPhone: (phone) => set({ loginPhone: phone, error: "" }),

  sendOtp: () => {
    const { loginPhone, registeredDrivers } = get();

    // Normalize phone: allow user to enter without +62 prefix
    let normalized = loginPhone.replace(/\s/g, "");
    if (normalized.startsWith("08")) {
      normalized = "+62" + normalized.slice(1);
    } else if (normalized.startsWith("62")) {
      normalized = "+" + normalized;
    } else if (!normalized.startsWith("+62")) {
      normalized = "+62" + normalized;
    }

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
    const { generatedOtp, loginPhone, registeredDrivers } = get();
    set({ isLoading: true });

    // Simulate network delay
    setTimeout(() => {
      if (otp !== generatedOtp) {
        set({ error: "Invalid OTP code. Please try again.", isLoading: false });
        return;
      }

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

  registerDriver: (driverData) => {
    const { registeredDrivers } = get();
    const newDriver: RegisteredDriver = {
      ...driverData,
      id: `drv-${Date.now()}`,
      registeredAt: new Date().toISOString(),
    };
    set({ registeredDrivers: [...registeredDrivers, newDriver] });
  },

  clearError: () => set({ error: "" }),
}));
