"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

/* ── Types ── */

export interface CatalogPart {
  id: string;
  name: string;
  partNumber: string;
  manufacturer: string;
  compatibleModels: string[];
  priceIDR: number;
  isOEM: boolean;
  mintedAt: string;
  txSig: string;
  status: "active" | "recalled" | "discontinued";
}

interface PartCatalogContextType {
  catalog: CatalogPart[];
  addPart: (part: Omit<CatalogPart, "id" | "mintedAt" | "txSig" | "status">) => void;
  addBatch: (parts: Omit<CatalogPart, "id" | "mintedAt" | "txSig" | "status">[]) => void;
  recallPart: (id: string) => void;
  discontinuePart: (id: string) => void;
  verifyPart: (partNumber: string) => CatalogPart | null;
}

/* ── Storage ── */
const CATALOG_KEY = "noc-part-catalog";

const PartCatalogContext = createContext<PartCatalogContextType | undefined>(undefined);

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

/* ── Seed data ── */

const seedCatalog: CatalogPart[] = [
  { id: "PT-001", name: "Engine Oil 10W-40 (4L)", partNumber: "08880-83461", manufacturer: "Toyota Motor Corp", compatibleModels: ["Avanza", "Rush", "Innova", "Veloz"], priceIDR: 350000, isOEM: true, mintedAt: "2026-01-15", txSig: "9kMt...pQ2r", status: "active" },
  { id: "PT-002", name: "Oil Filter", partNumber: "90915-YZZD4", manufacturer: "Denso Corp", compatibleModels: ["Avanza", "Rush", "Innova", "Veloz", "Yaris"], priceIDR: 45000, isOEM: true, mintedAt: "2026-01-15", txSig: "3fA9...mZ1p", status: "active" },
  { id: "PT-003", name: "Brake Pad Set (Front)", partNumber: "04465-BZ010", manufacturer: "Toyota Motor Corp", compatibleModels: ["Avanza", "Rush", "Calya"], priceIDR: 285000, isOEM: true, mintedAt: "2026-01-20", txSig: "7nRq...kL4s", status: "active" },
  { id: "PT-004", name: "CVT Belt", partNumber: "23100-KVB-T01", manufacturer: "Honda Genuine Parts", compatibleModels: ["Beat", "Vario", "Scoopy"], priceIDR: 180000, isOEM: true, mintedAt: "2026-02-01", txSig: "1xBv...nM8w", status: "active" },
  { id: "PT-005", name: "V-Belt Drive", partNumber: "23100-K1A-F11", manufacturer: "Honda Genuine Parts", compatibleModels: ["Beat", "Vario 160"], priceIDR: 165000, isOEM: true, mintedAt: "2026-02-01", txSig: "5tYp...qR3j", status: "active" },
  { id: "PT-006", name: "Spark Plug Iridium", partNumber: "90919-01275", manufacturer: "Denso Corp", compatibleModels: ["Avanza", "Rush", "Innova", "Fortuner"], priceIDR: 95000, isOEM: true, mintedAt: "2026-02-10", txSig: "8gHn...bK6m", status: "active" },
  { id: "PT-007", name: "Primary Chain Kit", partNumber: "40037-09", manufacturer: "Harley-Davidson Motor Co", compatibleModels: ["Sportster S", "Nightster"], priceIDR: 2800000, isOEM: true, mintedAt: "2026-02-15", txSig: "2wFx...jN5t", status: "active" },
  { id: "PT-008", name: "BMW M Performance Brake Kit", partNumber: "34-11-2-284-869", manufacturer: "BMW AG", compatibleModels: ["M4 G82", "M3 G80", "M340i"], priceIDR: 18500000, isOEM: true, mintedAt: "2026-02-20", txSig: "6cDr...hP9v", status: "active" },
  { id: "PT-009", name: "Air Filter (Aftermarket)", partNumber: "AF-AVZ-001", manufacturer: "Sakura Filter", compatibleModels: ["Avanza", "Xenia"], priceIDR: 35000, isOEM: false, mintedAt: "2026-03-01", txSig: "4eLs...mW2k", status: "active" },
  { id: "PT-010", name: "Roller Set CVT (Aftermarket)", partNumber: "RS-BT-006", manufacturer: "TDR Racing", compatibleModels: ["Beat", "Vario", "Scoopy"], priceIDR: 75000, isOEM: false, mintedAt: "2026-03-05", txSig: "0aQz...fU7n", status: "active" },
];

export function PartCatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogPart[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCatalog(loadJSON(CATALOG_KEY, seedCatalog));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveJSON(CATALOG_KEY, catalog);
  }, [catalog, hydrated]);

  const addPart = useCallback((part: Omit<CatalogPart, "id" | "mintedAt" | "txSig" | "status">) => {
    const entry: CatalogPart = {
      ...part,
      id: `PT-${Date.now()}`,
      mintedAt: new Date().toISOString().split("T")[0],
      txSig: `${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`,
      status: "active",
    };
    setCatalog(prev => [entry, ...prev]);
  }, []);

  const addBatch = useCallback((parts: Omit<CatalogPart, "id" | "mintedAt" | "txSig" | "status">[]) => {
    const now = new Date().toISOString().split("T")[0];
    const entries: CatalogPart[] = parts.map((p, i) => ({
      ...p,
      id: `PT-${Date.now()}-${i}`,
      mintedAt: now,
      txSig: `${Math.random().toString(36).slice(2, 6)}...${Math.random().toString(36).slice(2, 6)}`,
      status: "active" as const,
    }));
    setCatalog(prev => [...entries, ...prev]);
  }, []);

  const recallPart = useCallback((id: string) => {
    setCatalog(prev => prev.map(p => p.id === id ? { ...p, status: "recalled" as const } : p));
  }, []);

  const discontinuePart = useCallback((id: string) => {
    setCatalog(prev => prev.map(p => p.id === id ? { ...p, status: "discontinued" as const } : p));
  }, []);

  const verifyPart = useCallback((partNumber: string): CatalogPart | null => {
    return catalog.find(p => p.partNumber.toLowerCase() === partNumber.toLowerCase()) || null;
  }, [catalog]);

  return (
    <PartCatalogContext.Provider value={{ catalog, addPart, addBatch, recallPart, discontinuePart, verifyPart }}>
      {children}
    </PartCatalogContext.Provider>
  );
}

export function usePartCatalog() {
  return useContext(PartCatalogContext);
}
