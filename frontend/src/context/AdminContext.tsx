"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

/* ── Types ── */

export type PlatformRole = "superadmin" | "admin" | "enterprise" | "workshop" | "user";

export interface WalletEntry {
  wallet: string;
  role: PlatformRole;
  entityName: string;
  status: "active" | "suspended" | "pending";
  registeredAt: string;
  lastActive: string;
}

export interface PlatformConfig {
  platformFeePercent: number;
  gasSubsidyPercent: number;
  minServiceFee: number;
  maxServiceFee: number;
  nocTokenRate: number;   // IDR per NOC
  usdcRate: number;       // IDR per USDC
  maxBatchMintSize: number;
  qrExpirySeconds: number;
  features: {
    aiInsights: boolean;
    digitalTwin: boolean;
    copilot: boolean;
    walletPayments: boolean;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminWallet: string;
  action: string;
  targetEntity: string;
  details: string;
}

export interface DisputeEntry {
  id: string;
  type: "payment" | "service_quality" | "part_authenticity" | "warranty";
  userWallet: string;
  workshopId: string;
  workshopName: string;
  bookingId: string;
  amountIDR: number;
  status: "open" | "investigating" | "resolved" | "escalated";
  createdAt: string;
  resolvedAt: string | null;
  resolution: string | null;
  assignedAdmin: string | null;
}

interface AdminContextType {
  currentAdmin: { wallet: string; role: PlatformRole };
  // Wallet management
  whitelistedWallets: WalletEntry[];
  addWallet: (wallet: string, role: PlatformRole, entityName?: string) => void;
  removeWallet: (wallet: string) => void;
  updateRole: (wallet: string, newRole: PlatformRole) => void;
  suspendWallet: (wallet: string) => void;
  activateWallet: (wallet: string) => void;
  // Config
  platformConfig: PlatformConfig;
  updateConfig: (updates: Partial<PlatformConfig>) => void;
  // Audit
  auditLogs: AuditLogEntry[];
  // Disputes
  disputes: DisputeEntry[];
  fileDispute: (dispute: Omit<DisputeEntry, "id" | "createdAt" | "resolvedAt" | "resolution" | "assignedAdmin">) => void;
  resolveDispute: (id: string, resolution: string) => void;
}

/* ── Storage keys ── */
const WALLETS_KEY = "noc-admin-wallets";
const CONFIG_KEY = "noc-admin-config";
const AUDIT_KEY = "noc-admin-audit";
const DISPUTES_KEY = "noc-admin-disputes";

const AdminContext = createContext<AdminContextType | undefined>(undefined);

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

/* ── Default data ── */

const defaultConfig: PlatformConfig = {
  platformFeePercent: 2.5,
  gasSubsidyPercent: 0,
  minServiceFee: 50000,
  maxServiceFee: 50000000,
  nocTokenRate: 52,
  usdcRate: 16000,
  maxBatchMintSize: 10000,
  qrExpirySeconds: 300,
  features: {
    aiInsights: true,
    digitalTwin: true,
    copilot: true,
    walletPayments: false,
  },
};

const seedWallets: WalletEntry[] = [
  { wallet: "NOC1...adm1", role: "superadmin", entityName: "NOC ID Core", status: "active", registeredAt: "2025-01-15", lastActive: "2026-03-27" },
  { wallet: "AST1...ent1", role: "enterprise", entityName: "PT Astra Manufacturing", status: "active", registeredAt: "2025-06-01", lastActive: "2026-03-26" },
  { wallet: "HND1...ws01", role: "workshop", entityName: "Bengkel Hendra Motor", status: "active", registeredAt: "2025-08-10", lastActive: "2026-03-27" },
  { wallet: "MJY1...ws02", role: "workshop", entityName: "Maju Jaya Motor", status: "active", registeredAt: "2025-09-15", lastActive: "2026-03-25" },
  { wallet: "EUR1...ws03", role: "workshop", entityName: "EuroHaus M Performance", status: "active", registeredAt: "2025-10-01", lastActive: "2026-03-27" },
  { wallet: "AHS1...ws04", role: "workshop", entityName: "Ahass Sejahtera Motor", status: "active", registeredAt: "2025-10-20", lastActive: "2026-03-24" },
  { wallet: "MAB1...ws05", role: "workshop", entityName: "Mabua Harley Custom", status: "active", registeredAt: "2025-11-05", lastActive: "2026-03-26" },
  { wallet: "JAB1...ws06", role: "workshop", entityName: "Bengkel Jaya Abadi", status: "pending", registeredAt: "2026-03-01", lastActive: "2026-03-20" },
  { wallet: "BUD1...usr1", role: "user", entityName: "Pak Budi", status: "active", registeredAt: "2025-12-01", lastActive: "2026-03-27" },
  { wallet: "AND1...usr2", role: "user", entityName: "Andi Wijaya", status: "active", registeredAt: "2026-01-10", lastActive: "2026-03-26" },
];

const seedAuditLogs: AuditLogEntry[] = [
  { id: "AL-001", timestamp: "2026-03-27T09:00:00Z", adminWallet: "NOC1...adm1", action: "kyc_approval", targetEntity: "Mabua Harley Custom", details: "Workshop KYC approved. On-chain credential issued." },
  { id: "AL-002", timestamp: "2026-03-25T14:30:00Z", adminWallet: "NOC1...adm1", action: "config_change", targetEntity: "Platform", details: "Platform fee updated from 2.0% to 2.5%." },
  { id: "AL-003", timestamp: "2026-03-20T10:15:00Z", adminWallet: "NOC1...adm1", action: "wallet_whitelist", targetEntity: "Bengkel Jaya Abadi", details: "New workshop wallet registered. KYC status: pending." },
  { id: "AL-004", timestamp: "2026-03-15T16:00:00Z", adminWallet: "NOC1...adm1", action: "enterprise_onboard", targetEntity: "PT Astra Manufacturing", details: "Enterprise account created. Plan: Enterprise Tier." },
];

const seedDisputes: DisputeEntry[] = [
  { id: "DSP-001", type: "service_quality", userWallet: "BUD1...usr1", workshopId: "ws-6", workshopName: "Bengkel Jaya Abadi", bookingId: "BK-001", amountIDR: 450000, status: "open", createdAt: "2026-03-25", resolvedAt: null, resolution: null, assignedAdmin: null },
  { id: "DSP-002", type: "part_authenticity", userWallet: "AND1...usr2", workshopId: "ws-2", workshopName: "Maju Jaya Motor", bookingId: "BK-002", amountIDR: 1200000, status: "investigating", createdAt: "2026-03-20", resolvedAt: null, resolution: null, assignedAdmin: "NOC1...adm1" },
  { id: "DSP-003", type: "payment", userWallet: "BUD1...usr1", workshopId: "ws-1", workshopName: "Bengkel Hendra Motor", bookingId: "BK-003", amountIDR: 300000, status: "resolved", createdAt: "2026-03-10", resolvedAt: "2026-03-12", resolution: "Partial refund Rp 150,000 issued to user.", assignedAdmin: "NOC1...adm1" },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<WalletEntry[]>([]);
  const [config, setConfig] = useState<PlatformConfig>(defaultConfig);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [disputes, setDisputes] = useState<DisputeEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate
  useEffect(() => {
    setWallets(loadJSON(WALLETS_KEY, seedWallets));
    setConfig(loadJSON(CONFIG_KEY, defaultConfig));
    setAuditLogs(loadJSON(AUDIT_KEY, seedAuditLogs));
    setDisputes(loadJSON(DISPUTES_KEY, seedDisputes));
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => { if (hydrated) saveJSON(WALLETS_KEY, wallets); }, [wallets, hydrated]);
  useEffect(() => { if (hydrated) saveJSON(CONFIG_KEY, config); }, [config, hydrated]);
  useEffect(() => { if (hydrated) saveJSON(AUDIT_KEY, auditLogs); }, [auditLogs, hydrated]);
  useEffect(() => { if (hydrated) saveJSON(DISPUTES_KEY, disputes); }, [disputes, hydrated]);

  const addAuditLog = useCallback((action: string, targetEntity: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `AL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminWallet: "NOC1...adm1",
      action,
      targetEntity,
      details,
    };
    setAuditLogs(prev => [entry, ...prev]);
  }, []);

  const addWallet = useCallback((wallet: string, role: PlatformRole, entityName = "") => {
    const entry: WalletEntry = {
      wallet,
      role,
      entityName,
      status: role === "workshop" ? "pending" : "active",
      registeredAt: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
    };
    setWallets(prev => {
      if (prev.some(w => w.wallet === wallet)) return prev;
      return [entry, ...prev];
    });
    addAuditLog("wallet_whitelist", entityName || wallet, `Wallet ${wallet} registered as ${role}.`);
  }, [addAuditLog]);

  const removeWallet = useCallback((wallet: string) => {
    setWallets(prev => {
      const found = prev.find(w => w.wallet === wallet);
      if (found) addAuditLog("wallet_remove", found.entityName || wallet, `Wallet ${wallet} removed.`);
      return prev.filter(w => w.wallet !== wallet);
    });
  }, [addAuditLog]);

  const updateRole = useCallback((wallet: string, newRole: PlatformRole) => {
    setWallets(prev => prev.map(w => {
      if (w.wallet !== wallet) return w;
      addAuditLog("role_change", w.entityName || wallet, `Role changed from ${w.role} to ${newRole}.`);
      return { ...w, role: newRole };
    }));
  }, [addAuditLog]);

  const suspendWallet = useCallback((wallet: string) => {
    setWallets(prev => prev.map(w => {
      if (w.wallet !== wallet) return w;
      addAuditLog("wallet_suspend", w.entityName || wallet, `Wallet ${wallet} suspended.`);
      return { ...w, status: "suspended" };
    }));
  }, [addAuditLog]);

  const activateWallet = useCallback((wallet: string) => {
    setWallets(prev => prev.map(w => {
      if (w.wallet !== wallet) return w;
      addAuditLog("kyc_approval", w.entityName || wallet, `Wallet ${wallet} activated.`);
      return { ...w, status: "active" };
    }));
  }, [addAuditLog]);

  const updateConfig = useCallback((updates: Partial<PlatformConfig>) => {
    setConfig(prev => {
      const next = { ...prev, ...updates };
      addAuditLog("config_change", "Platform", `Config updated: ${Object.keys(updates).join(", ")}`);
      return next;
    });
  }, [addAuditLog]);

  const fileDispute = useCallback((dispute: Omit<DisputeEntry, "id" | "createdAt" | "resolvedAt" | "resolution" | "assignedAdmin">) => {
    const entry: DisputeEntry = {
      ...dispute,
      id: `DSP-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      resolvedAt: null,
      resolution: null,
      assignedAdmin: null,
    };
    setDisputes(prev => [entry, ...prev]);
    addAuditLog("dispute_filed", dispute.workshopName, `Dispute filed: ${dispute.type} — Rp ${dispute.amountIDR.toLocaleString("id-ID")}`);
  }, [addAuditLog]);

  const resolveDispute = useCallback((id: string, resolution: string) => {
    setDisputes(prev => prev.map(d => {
      if (d.id !== id) return d;
      addAuditLog("dispute_resolution", d.workshopName, `Dispute ${d.id} resolved: ${resolution}`);
      return { ...d, status: "resolved", resolvedAt: new Date().toISOString().split("T")[0], resolution, assignedAdmin: "NOC1...adm1" };
    }));
  }, [addAuditLog]);

  return (
    <AdminContext.Provider value={{
      currentAdmin: { wallet: "NOC1...adm1", role: "superadmin" },
      whitelistedWallets: wallets,
      addWallet,
      removeWallet,
      updateRole,
      suspendWallet,
      activateWallet,
      platformConfig: config,
      updateConfig,
      auditLogs,
      disputes,
      fileDispute,
      resolveDispute,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
