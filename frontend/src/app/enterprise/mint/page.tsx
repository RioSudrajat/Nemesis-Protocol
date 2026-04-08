"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu, Plus, Trash2, Loader2, Car, UploadCloud, CheckCircle2,
  Package, ChevronDown, ChevronUp, Shield, Sparkles, X, FileSpreadsheet,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import {
  ENTERPRISE_NAME,
  SEED_ENTERPRISE_MODELS,
  ENTERPRISE_MODEL_LABELS,
  EnterpriseModelKey,
  PART_CATEGORIES,
  PartCategory,
  CATEGORY_COLORS,
} from "../_shared";

// ─── Types ───────────────────────────────────────────────────────────────
interface ManifestPart {
  id: string;
  name: string;
  partNumber: string;
  category: PartCategory;
}

interface VehicleEntry {
  vin: string;
  modelKey: EnterpriseModelKey | "";
  year: string;
  color: string;
  manifest: ManifestPart[];
  manifestOpen: boolean;
}

interface PartCatalogEntry {
  name: string;
  partNumber: string;
  category: PartCategory;
  models: EnterpriseModelKey[];
  batchQty: string;
  priceIDR: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────
const newPartRow = (): ManifestPart => ({
  id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: "",
  partNumber: "",
  category: "Exterior",
});

const emptyVehicle = (): VehicleEntry => ({
  vin: "",
  modelKey: "",
  year: "2025",
  color: "",
  manifest: [],
  manifestOpen: false,
});

const emptyPartCatalog = (): PartCatalogEntry => ({
  name: "",
  partNumber: "",
  category: "Brakes",
  models: [],
  batchQty: "",
  priceIDR: "",
});

// ─── Mock Data Generators ────────────────────────────────────────────────
const MOCK_VIN_PREFIX = "MHKA1BA1JFK";
const MOCK_COLORS = ["Silver Metallic", "Midnight Black", "Pearl White", "Nebula Blue", "Phantom Brown"];
const MOCK_MANIFEST_SAMPLES: Omit<ManifestPart, "id">[] = [
  { name: "Body Shell",         partNumber: "61001-OEM", category: "Exterior" },
  { name: "Headlights (Pair)",  partNumber: "81110-OEM", category: "Exterior" },
  { name: "Dashboard Assembly", partNumber: "55301-OEM", category: "Interior" },
  { name: "Engine Block",       partNumber: "11001-OEM", category: "Engine" },
  { name: "Front Brake Pads",   partNumber: "04465-OEM", category: "Brakes" },
];

function mockVehicles(n = 3): VehicleEntry[] {
  const keys = Object.keys(ENTERPRISE_MODEL_LABELS) as EnterpriseModelKey[];
  return Array.from({ length: n }).map((_, i) => ({
    vin: `${MOCK_VIN_PREFIX}${String(Math.floor(100000 + Math.random() * 899999))}`,
    modelKey: keys[i % keys.length],
    year: "2025",
    color: MOCK_COLORS[i % MOCK_COLORS.length],
    manifest: MOCK_MANIFEST_SAMPLES.map(p => ({ ...p, id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` })),
    manifestOpen: true,
  }));
}

function mockPartCatalog(): PartCatalogEntry {
  return {
    name: "Front Brake Pad Set",
    partNumber: "04465-AZ-001",
    category: "Brakes",
    models: ["avanza", "bmw_m4"],
    batchQty: "500",
    priceIDR: "450000",
  };
}

// ─── Component ───────────────────────────────────────────────────────────
export default function MintPage() {
  const { showToast } = useToast();
  const [minting, setMinting] = useState(false);
  const [activeTab, setActiveTab] = useState<"vehicle" | "parts">("vehicle");

  const [vehicles, setVehicles] = useState<VehicleEntry[]>([emptyVehicle()]);
  const [partEntries, setPartEntries] = useState<PartCatalogEntry[]>([emptyPartCatalog()]);

  // CSV import modal
  const [csvOpen, setCsvOpen] = useState(false);
  const [csvUploaded, setCsvUploaded] = useState(false);

  const modelKeys = Object.keys(ENTERPRISE_MODEL_LABELS) as EnterpriseModelKey[];

  // ─── Vehicle handlers ──────────────────────────────────────────────────
  const updateVehicle = (i: number, patch: Partial<VehicleEntry>) =>
    setVehicles(prev => prev.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));

  const addVehicle = () => setVehicles(v => [...v, emptyVehicle()]);
  const removeVehicle = (i: number) =>
    setVehicles(v => v.filter((_, idx) => idx !== i));

  const addPartRow = (vIdx: number) =>
    updateVehicle(vIdx, { manifest: [...vehicles[vIdx].manifest, newPartRow()], manifestOpen: true });

  const updatePartRow = (vIdx: number, pIdx: number, patch: Partial<ManifestPart>) => {
    const manifest = vehicles[vIdx].manifest.map((p, i) => (i === pIdx ? { ...p, ...patch } : p));
    updateVehicle(vIdx, { manifest });
  };

  const removePartRow = (vIdx: number, pIdx: number) => {
    const manifest = vehicles[vIdx].manifest.filter((_, i) => i !== pIdx);
    updateVehicle(vIdx, { manifest });
  };

  // ─── Part catalog handlers ─────────────────────────────────────────────
  const updatePart = (i: number, patch: Partial<PartCatalogEntry>) =>
    setPartEntries(prev => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const togglePartModel = (i: number, key: EnterpriseModelKey) => {
    const current = partEntries[i].models;
    const models = current.includes(key) ? current.filter(k => k !== key) : [...current, key];
    updatePart(i, { models });
  };

  // ─── Simulate buttons ──────────────────────────────────────────────────
  const simulateVehicles = () => {
    setVehicles(mockVehicles(3));
    showToast("success", "Mock Data Loaded", "3 kendaraan + manifest contoh sudah terisi.");
  };

  const simulatePartCatalog = () => {
    setPartEntries([mockPartCatalog()]);
    showToast("success", "Mock Data Loaded", "Contoh part catalog terisi otomatis.");
  };

  const simulateCsv = () => {
    setCsvOpen(true);
    setCsvUploaded(true);
    showToast("success", "Mock CSV Loaded", "File CSV mock sudah ter-parse.");
  };

  // ─── Mint ──────────────────────────────────────────────────────────────
  const handleMint = () => {
    const count =
      activeTab === "vehicle"
        ? (csvUploaded ? 1250 : vehicles.length)
        : partEntries.length;
    setMinting(true);
    setTimeout(() => {
      setMinting(false);
      if (activeTab === "vehicle") {
        setVehicles([emptyVehicle()]);
        setCsvUploaded(false);
        setCsvOpen(false);
      } else {
        setPartEntries([emptyPartCatalog()]);
      }
      const msg =
        activeTab === "parts"
          ? `${count} part catalog(s) minted as NFTs on Solana`
          : `${count} vehicle(s) minted as cNFTs on Solana · ~$${(count * 0.005).toFixed(3)}`;
      showToast(
        "success",
        activeTab === "parts" ? "Part Catalog Minted!" : "Genesis Mint Complete!",
        msg
      );
    }, 4000);
  };

  const totalCount =
    activeTab === "vehicle"
      ? (csvUploaded ? 1250 : vehicles.length)
      : partEntries.length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="flex items-center gap-3 font-bold text-2xl md:text-3xl">
          <Cpu className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
          Mint Console
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>
          Mint Compressed NFT vehicle passports and OEM part catalogs on Solana
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b" style={{ borderColor: "rgba(94, 234, 212,0.2)" }}>
        <button
          onClick={() => setActiveTab("vehicle")}
          className="pb-3 px-4 text-sm font-semibold transition-colors border-b-2"
          style={{
            borderColor: activeTab === "vehicle" ? "var(--solana-purple)" : "transparent",
            color: activeTab === "vehicle" ? "var(--solana-purple)" : "var(--solana-text-muted)",
          }}
        >
          Vehicle Genesis Mint
        </button>
        <button
          onClick={() => setActiveTab("parts")}
          className="pb-3 px-4 text-sm font-semibold transition-colors border-b-2"
          style={{
            borderColor: activeTab === "parts" ? "var(--solana-cyan, #2DD4BF)" : "transparent",
            color: activeTab === "parts" ? "var(--solana-cyan, #2DD4BF)" : "var(--solana-text-muted)",
          }}
        >
          Part Catalog Mint
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "vehicle" ? (
          <motion.div
            key="vehicle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4 mb-6"
          >
            {/* Action bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>
                Tambahkan kendaraan satu per satu, atau import batch CSV dari sistem ERP.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={simulateVehicles}
                  className="glow-btn-outline gap-2 text-xs px-3 py-1.5"
                  style={{ borderColor: "rgba(250,204,21,0.4)", color: "#FCD34D" }}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Simulate Mock Data
                </button>
                <button
                  onClick={() => setCsvOpen(true)}
                  className="glow-btn-outline gap-2 text-xs px-3 py-1.5"
                  style={{ borderColor: "rgba(94, 234, 212,0.4)", color: "var(--solana-cyan, #2DD4BF)" }}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Import CSV
                </button>
              </div>
            </div>

            {csvUploaded && (
              <div className="glass-card-static rounded-2xl p-5 border" style={{ borderColor: "rgba(34,197,94,0.3)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-teal-500/20">
                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">astra_production_batch_08.csv</p>
                    <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>
                      Parsed 1,250 valid entries. 0 errors found.
                    </p>
                  </div>
                  <button
                    onClick={() => setCsvUploaded(false)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors p-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {vehicles.map((v, i) => (
              <div key={i} className="glass-card-static p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Car className="w-4 h-4" style={{ color: "var(--solana-purple)" }} />
                    Vehicle #{i + 1}
                  </span>
                  {vehicles.length > 1 && (
                    <button
                      onClick={() => removeVehicle(i)}
                      className="p-2 rounded-lg transition-colors hover:bg-red-500/20"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#FCA5A5" }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>
                      VIN (17 chars)
                    </label>
                    <input
                      type="text"
                      className="input-field mono uppercase"
                      placeholder="MHKA1BA1JFK000001"
                      maxLength={17}
                      value={v.vin}
                      onChange={e => updateVehicle(i, { vin: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>
                      Model
                    </label>
                    <select
                      className="input-field"
                      value={v.modelKey}
                      onChange={e => updateVehicle(i, { modelKey: e.target.value as EnterpriseModelKey })}
                    >
                      <option value="" disabled>Select model...</option>
                      {modelKeys.map(k => (
                        <option key={k} value={k}>{ENTERPRISE_MODEL_LABELS[k]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>
                      Year
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      min="2020"
                      max="2027"
                      value={v.year}
                      onChange={e => updateVehicle(i, { year: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>
                      Color
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Silver Metallic"
                      value={v.color}
                      onChange={e => updateVehicle(i, { color: e.target.value })}
                    />
                  </div>
                </div>

                {/* OEM Manifest — operator-authored */}
                <div className="mt-5 border-t pt-4" style={{ borderColor: "rgba(94, 234, 212,0.15)" }}>
                  <button
                    type="button"
                    onClick={() => updateVehicle(i, { manifestOpen: !v.manifestOpen })}
                    className="flex items-center justify-between w-full text-left group"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--solana-purple)" }}>
                      <Shield className="w-4 h-4" />
                      OEM Parts Manifest
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(94, 234, 212,0.15)", color: "var(--solana-purple)" }}>
                        {v.manifest.length} part{v.manifest.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    {v.manifestOpen
                      ? <ChevronUp className="w-4 h-4" style={{ color: "var(--solana-text-muted)" }} />
                      : <ChevronDown className="w-4 h-4" style={{ color: "var(--solana-text-muted)" }} />}
                  </button>

                  <AnimatePresence>
                    {v.manifestOpen && (
                      <motion.div
                        key={`manifest-${i}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs mt-3 mb-3" style={{ color: "var(--solana-text-muted)" }}>
                          Daftarkan part OEM original untuk unit ini. Isi nama, nomor part, dan kategori.
                        </p>

                        {v.manifest.length === 0 && (
                          <div className="text-center py-6 rounded-xl border border-dashed" style={{ borderColor: "rgba(94, 234, 212,0.2)" }}>
                            <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>
                              Belum ada part ditambahkan
                            </p>
                          </div>
                        )}

                        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                          {v.manifest.map((p, pIdx) => (
                            <div
                              key={p.id}
                              className="grid grid-cols-12 gap-2 items-center rounded-xl p-2"
                              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                            >
                              <input
                                type="text"
                                className="input-field col-span-4 text-xs"
                                placeholder="Part name"
                                value={p.name}
                                onChange={e => updatePartRow(i, pIdx, { name: e.target.value })}
                              />
                              <input
                                type="text"
                                className="input-field col-span-3 text-xs mono"
                                placeholder="Part No."
                                value={p.partNumber}
                                onChange={e => updatePartRow(i, pIdx, { partNumber: e.target.value })}
                              />
                              <select
                                className="input-field col-span-4 text-xs"
                                value={p.category}
                                style={{ color: CATEGORY_COLORS[p.category] }}
                                onChange={e => updatePartRow(i, pIdx, { category: e.target.value as PartCategory })}
                              >
                                {PART_CATEGORIES.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => removePartRow(i, pIdx)}
                                className="col-span-1 p-2 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center"
                                style={{ background: "rgba(239,68,68,0.1)", color: "#FCA5A5" }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => addPartRow(i)}
                          className="glow-btn-outline w-full mt-3 gap-2 text-xs py-2 border-dashed"
                          style={{ border: "1.5px dashed rgba(94, 234, 212,0.35)" }}
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Part
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}

            <button
              onClick={addVehicle}
              className="glow-btn-outline gap-2 border-dashed py-4"
              style={{ border: "2px dashed rgba(94, 234, 212,0.3)" }}
            >
              <Plus className="w-5 h-5" /> Add Another Vehicle
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="parts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-4 mb-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>
                Manufacturer otomatis ter-set ke enterprise yang sedang login.
              </p>
              <button
                onClick={simulatePartCatalog}
                className="glow-btn-outline gap-2 text-xs px-3 py-1.5"
                style={{ borderColor: "rgba(250,204,21,0.4)", color: "#FCD34D" }}
              >
                <Sparkles className="w-3.5 h-3.5" /> Simulate Mock Data
              </button>
            </div>

            {partEntries.map((entry, i) => (
              <div
                key={i}
                className="glass-card-static p-6 rounded-2xl"
                style={{ borderLeft: "3px solid var(--solana-cyan, #2DD4BF)" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Package className="w-4 h-4" style={{ color: "var(--solana-cyan, #2DD4BF)" }} />
                    Part Catalog #{i + 1}
                  </span>
                  {partEntries.length > 1 && (
                    <button
                      onClick={() => setPartEntries(partEntries.filter((_, idx) => idx !== i))}
                      className="p-2 rounded-lg hover:bg-red-500/20"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#FCA5A5" }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>
                      Part Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Front Brake Pad Set"
                      value={entry.name}
                      onChange={e => updatePart(i, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>
                      Part Number / SKU
                    </label>
                    <input
                      type="text"
                      className="input-field mono"
                      placeholder="e.g. 04465-BZ010"
                      value={entry.partNumber}
                      onChange={e => updatePart(i, { partNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>
                      Manufacturer
                    </label>
                    <div
                      className="input-field flex items-center gap-2 cursor-not-allowed"
                      style={{ opacity: 0.85, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)" }}
                    >
                      <Shield className="w-3.5 h-3.5" style={{ color: "#86EFAC" }} />
                      <span className="text-sm font-semibold">{ENTERPRISE_NAME}</span>
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#86EFAC" }}>
                        AUTO
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>
                      Category
                    </label>
                    <select
                      className="input-field"
                      value={entry.category}
                      style={{ color: CATEGORY_COLORS[entry.category] }}
                      onChange={e => updatePart(i, { category: e.target.value as PartCategory })}
                    >
                      {PART_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>
                      Compatible Models
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {modelKeys.map(k => {
                        const active = entry.models.includes(k);
                        return (
                          <button
                            key={k}
                            type="button"
                            onClick={() => togglePartModel(i, k)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                            style={{
                              background: active ? "rgba(94, 234, 212,0.18)" : "rgba(255,255,255,0.04)",
                              border: `1px solid ${active ? "rgba(94, 234, 212,0.5)" : "rgba(255,255,255,0.08)"}`,
                              color: active ? "var(--solana-cyan, #2DD4BF)" : "var(--solana-text-muted)",
                            }}
                          >
                            {active && "✓ "}{ENTERPRISE_MODEL_LABELS[k]}
                          </button>
                        );
                      })}
                    </div>
                    {entry.models.length === 0 && (
                      <p className="text-[11px] mt-2" style={{ color: "var(--solana-text-muted)" }}>
                        Pilih satu atau lebih model yang kompatibel dengan part ini.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>
                      Batch Quantity
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="e.g. 500"
                      value={entry.batchQty}
                      onChange={e => updatePart(i, { batchQty: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>
                      Unit Price MSRP (Rp)
                    </label>
                    <input
                      type="number"
                      className="input-field mono"
                      placeholder="e.g. 450000"
                      value={entry.priceIDR}
                      onChange={e => updatePart(i, { priceIDR: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setPartEntries([...partEntries, emptyPartCatalog()])}
              className="glow-btn-outline gap-2 border-dashed py-4"
              style={{ border: "2px dashed rgba(94, 234, 212,0.3)", color: "var(--solana-cyan, #2DD4BF)" }}
            >
              <Plus className="w-5 h-5" /> Add Another Part Catalog
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      <div className="glass-card-static p-6 mb-6 rounded-2xl">
        <h3 className="text-sm font-semibold mb-4">Minting Summary</h3>
        <div className="flex justify-between items-center">
          <span style={{ color: "var(--solana-text-muted)" }}>
            Total {activeTab === "parts" ? "Parts" : "Vehicles"}:
          </span>
          <span className="text-xl font-bold">{totalCount}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span style={{ color: "var(--solana-text-muted)" }}>Estimated Compute Cost:</span>
          <span className="text-xl font-bold gradient-text">~${(totalCount * 0.005).toFixed(3)}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span style={{ color: "var(--solana-text-muted)" }}>Technology:</span>
          <span
            className="text-xs px-2 py-1 rounded-md font-medium"
            style={{ background: "rgba(94, 234, 212,0.15)", color: "var(--solana-purple)", border: "1px solid rgba(94, 234, 212,0.3)" }}
          >
            cNFT (Bubblegum)
          </span>
        </div>
      </div>

      <button
        onClick={handleMint}
        disabled={minting}
        className="glow-btn w-full text-base font-bold gap-3 rounded-2xl disabled:opacity-50 transition-all hover:scale-[1.02] cursor-pointer"
        style={{ padding: "16px 32px" }}
      >
        {minting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {activeTab === "parts" ? "Minting Part NFTs on Solana..." : "Anchoring to Solana Merkle Tree..."}
          </>
        ) : (
          <>
            <Cpu className="w-5 h-5" />
            {activeTab === "parts" ? "Mint Part Catalog" : "Execute Mint Protocol"}
          </>
        )}
      </button>

      {/* CSV Import Modal */}
      <AnimatePresence>
        {csvOpen && (
          <motion.div
            key="csv-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={e => e.target === e.currentTarget && setCsvOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card rounded-3xl p-8 w-full max-w-lg"
              style={{ border: "1px solid rgba(94, 234, 212,0.2)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" style={{ color: "var(--solana-cyan, #2DD4BF)" }} />
                  Import CSV Batch
                </h2>
                <button
                  onClick={() => setCsvOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!csvUploaded ? (
                <div
                  className="border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors"
                  style={{ borderColor: "rgba(94, 234, 212,0.4)", minHeight: "220px" }}
                  onClick={() => setCsvUploaded(true)}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(94, 234, 212,0.1)" }}>
                    <UploadCloud className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
                  </div>
                  <p className="font-bold mb-1">Drag & Drop CSV File</p>
                  <p className="text-xs max-w-xs" style={{ color: "var(--solana-text-muted)" }}>
                    Upload ERP-generated CSV (VIN, Model, Year, Engine). Max 10.000 rows.
                  </p>
                  <button className="glow-btn-outline mt-5 px-5 py-2 text-xs">Browse Files</button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
                    <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">astra_production_batch_08.csv</p>
                      <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>
                        1,250 valid entries · 0 errors
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCsvOpen(false)}
                    className="glow-btn w-full gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Use This Batch
                  </button>
                </div>
              )}

              <button
                onClick={simulateCsv}
                className="glow-btn-outline w-full gap-2 text-xs mt-4"
                style={{ borderColor: "rgba(250,204,21,0.4)", color: "#FCD34D" }}
              >
                <Sparkles className="w-3.5 h-3.5" /> Simulate Mock CSV
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
