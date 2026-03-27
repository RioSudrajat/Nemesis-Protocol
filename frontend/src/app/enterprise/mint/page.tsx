"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Plus, Trash2, Loader2, Car, UploadCloud, FileText, CheckCircle2, Package, Tag } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const vehicleModels = ["Avanza", "Rush", "Innova", "Fortuner", "Yaris", "Agya", "Calya", "Raize", "Veloz"];

export default function MintPage() {
  const { showToast } = useToast();
  const [minting, setMinting] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "batch" | "parts">("manual");
  const [vehicles, setVehicles] = useState([{ vin: "", model: "", year: "2025", color: "" }]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [partEntries, setPartEntries] = useState([{ name: "", partNumber: "", manufacturer: "", models: [] as string[], batchQty: "", priceIDR: "" }]);

  const addVehicle = () => setVehicles([...vehicles, { vin: "", model: "", year: "2025", color: "" }]);
  const removeVehicle = (i: number) => setVehicles(vehicles.filter((_, idx) => idx !== i));

  const handleMint = () => {
    const count = activeTab === "manual" ? vehicles.length : activeTab === "batch" ? 1250 : partEntries.length;
    setMinting(true);
    setTimeout(() => {
      setMinting(false);
      if (activeTab === "manual") {
        setVehicles([{ vin: "", model: "", year: "2025", color: "" }]);
      } else if (activeTab === "batch") {
        setFileUploaded(false);
      } else {
        setPartEntries([{ name: "", partNumber: "", manufacturer: "", models: [], batchQty: "", priceIDR: "" }]);
      }
      const msg = activeTab === "parts" 
        ? `${count} part catalog(s) minted as NFTs on Solana`
        : `${count} vehicle(s) minted as cNFTs on Solana · ~$${(count * 0.005).toFixed(3)}`;
      showToast("success", activeTab === "parts" ? "Part Catalog Minted!" : "Genesis Mint Complete!", msg);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="flex items-center gap-3 font-bold text-2xl md:text-3xl">
          <Cpu className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
          Mint Console
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>Mint Compressed NFT vehicle passports and OEM part catalogs on Solana</p>
      </div>

      <div className="flex gap-4 mb-6 border-b" style={{ borderColor: "rgba(153,69,255,0.2)" }}>
        <button 
          onClick={() => setActiveTab("manual")} 
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2`}
          style={{ 
            borderColor: activeTab === "manual" ? "var(--solana-purple)" : "transparent",
            color: activeTab === "manual" ? "var(--solana-purple)" : "var(--solana-text-muted)"
          }}
        >
          Manual Entry
        </button>
        <button 
          onClick={() => setActiveTab("batch")} 
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2`}
          style={{ 
            borderColor: activeTab === "batch" ? "var(--solana-purple)" : "transparent",
            color: activeTab === "batch" ? "var(--solana-purple)" : "var(--solana-text-muted)"
          }}
        >
          Batch CSV Upload
        </button>
        <button 
          onClick={() => setActiveTab("parts")} 
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2`}
          style={{ 
            borderColor: activeTab === "parts" ? "var(--solana-cyan, #00D1FF)" : "transparent",
            color: activeTab === "parts" ? "var(--solana-cyan, #00D1FF)" : "var(--solana-text-muted)"
          }}
        >
          Part Catalog Mint
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "manual" ? (
          <motion.div key="manual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4 mb-6">
            {vehicles.map((_, i) => (
              <div key={i} className="glass-card-static p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Car className="w-4 h-4" style={{ color: "var(--solana-purple)" }} />
                    Vehicle #{i + 1}
                  </span>
                  {vehicles.length > 1 && (
                    <button onClick={() => removeVehicle(i)} className="p-2 rounded-lg transition-colors hover:bg-red-500/20" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>VIN (17 chars)</label>
                    <input type="text" className="input-field mono uppercase" placeholder="MHKA1BA1JFK000001" maxLength={17} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Model</label>
                    <select className="input-field" defaultValue="">
                      <option value="" disabled>Select model...</option>
                      {vehicleModels.map((m, j) => <option key={j} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Year</label>
                    <input type="number" className="input-field" defaultValue="2025" min="2020" max="2027" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Color</label>
                    <input type="text" className="input-field" placeholder="e.g. Silver Metallic" />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-4">
              <button onClick={addVehicle} className="glow-btn-outline flex-1 gap-2 border-dashed py-4" style={{ border: "2px dashed rgba(153,69,255,0.3)" }}>
                <Plus className="w-5 h-5" /> Add Another Vehicle
              </button>
            </div>
          </motion.div>
        ) : activeTab === "batch" ? (
          <motion.div key="batch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6">
            {!fileUploaded ? (
              <div 
                className="glass-card-static border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors"
                style={{ borderColor: "rgba(153,69,255,0.4)", minHeight: "300px" }}
                onClick={() => setFileUploaded(true)}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(153,69,255,0.1)" }}>
                  <UploadCloud className="w-8 h-8" style={{ color: "var(--solana-purple)" }} />
                </div>
                <h3 className="text-lg font-bold mb-2">Drag & Drop CSV File</h3>
                <p className="text-sm max-w-sm" style={{ color: "var(--solana-text-muted)" }}>Upload an ERP-generated CSV containing VINs and initial factory specs. Maximum 10,000 rows per file.</p>
                <button className="glow-btn-outline mt-6 px-6 py-2 text-sm">Browse Files</button>
              </div>
            ) : (
              <div className="glass-card-static rounded-3xl p-8 border" style={{ borderColor: "rgba(34,197,94,0.3)" }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/20">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">astra_production_batch_08.csv</h3>
                    <p className="text-sm" style={{ color: "var(--solana-text-muted)" }}>Parsed 1,250 valid entries. 0 errors found.</p>
                  </div>
                  <button onClick={() => setFileUploaded(false)} className="ml-auto text-sm text-red-400 hover:text-red-300 transition-colors p-2">Remove</button>
                </div>
                
                <div className="bg-black/20 rounded-xl p-4 overflow-x-auto border border-white/5">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="text-xs uppercase tracking-wider" style={{ color: "var(--solana-text-muted)" }}>
                        <th className="pb-3 pr-6">#</th>
                        <th className="pb-3 pr-6">VIN</th>
                        <th className="pb-3 pr-6">Model</th>
                        <th className="pb-3 pr-6">Year</th>
                        <th className="pb-3">Engine Type</th>
                      </tr>
                    </thead>
                    <tbody className="mono">
                      <tr><td className="py-1">1</td><td className="pr-6">MHKA1BA1JFK000001</td><td className="pr-6 font-sans">Avanza</td><td className="pr-6">2025</td><td>1.5L 2NR-VE</td></tr>
                      <tr><td className="py-1">2</td><td className="pr-6">MHKA1BA1JFK000002</td><td className="pr-6 font-sans">Avanza</td><td className="pr-6">2025</td><td>1.5L 2NR-VE</td></tr>
                      <tr><td className="py-1">3</td><td className="pr-6">MHKA1BA1JFK000003</td><td className="pr-6 font-sans">Avanza</td><td className="pr-6">2025</td><td>1.5L 2NR-VE</td></tr>
                      <tr><td colSpan={5} className="py-2 text-center italic" style={{ color: "var(--solana-text-muted)" }}>... and 1,247 more rows</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="parts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4 mb-6">
            {partEntries.map((entry, i) => (
              <div key={i} className="glass-card-static p-6 rounded-2xl" style={{ borderLeft: "3px solid var(--solana-cyan, #00D1FF)" }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Package className="w-4 h-4" style={{ color: "var(--solana-cyan, #00D1FF)" }} />
                    Part Catalog #{i + 1}
                  </span>
                  {partEntries.length > 1 && (
                    <button onClick={() => setPartEntries(partEntries.filter((_, idx) => idx !== i))} className="p-2 rounded-lg transition-colors hover:bg-red-500/20 cursor-pointer" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Part Name</label>
                    <input type="text" className="input-field" placeholder="e.g. Front Brake Pad Set" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Part Number / SKU</label>
                    <input type="text" className="input-field mono" placeholder="e.g. 04465-BZ010" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Manufacturer</label>
                    <input type="text" className="input-field" placeholder="e.g. Toyota Motor Corp" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Compatible Models</label>
                    <select className="input-field" multiple defaultValue={[]}>
                      {vehicleModels.map((m, j) => <option key={j} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Batch Quantity</label>
                    <input type="number" className="input-field" placeholder="e.g. 500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Unit Price MSRP (Rp)</label>
                    <input type="number" className="input-field mono" placeholder="e.g. 450000" />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-4">
              <button onClick={() => setPartEntries([...partEntries, { name: "", partNumber: "", manufacturer: "", models: [], batchQty: "", priceIDR: "" }])} className="glow-btn-outline flex-1 gap-2 border-dashed py-4 cursor-pointer" style={{ border: "2px dashed rgba(0,209,255,0.3)", color: "var(--solana-cyan, #00D1FF)" }}>
                <Plus className="w-5 h-5" /> Add Another Part Catalog
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card-static p-6 mb-6 rounded-2xl">
        <h3 className="text-sm font-semibold mb-4">Minting Summary</h3>
        <div className="flex justify-between items-center">
          <span style={{ color: "var(--solana-text-muted)" }}>Total Vehicles:</span>
          <span className="text-xl font-bold">{activeTab === "manual" ? vehicles.length : activeTab === "batch" ? (fileUploaded ? 1250 : 0) : partEntries.length}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span style={{ color: "var(--solana-text-muted)" }}>Estimated Compute Cost:</span>
          <span className="text-xl font-bold gradient-text">~${((activeTab === "manual" ? vehicles.length : activeTab === "batch" ? (fileUploaded ? 1250 : 0) : partEntries.length) * 0.005).toFixed(3)}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span style={{ color: "var(--solana-text-muted)" }}>Technology:</span>
          <span className="text-xs px-2 py-1 rounded-md font-medium" style={{ background: "rgba(153,69,255,0.15)", color: "var(--solana-purple)", border: "1px solid rgba(153,69,255,0.3)" }}>cNFT (Bubblegum)</span>
        </div>
      </div>

      <button onClick={handleMint} disabled={minting} className="glow-btn w-full text-base font-bold gap-3 rounded-2xl disabled:opacity-50 transition-all hover:scale-[1.02] cursor-pointer" style={{ padding: "16px 32px" }}>
        {minting ? <><Loader2 className="w-5 h-5 animate-spin" /> {activeTab === "parts" ? "Minting Part NFTs on Solana..." : "Anchoring to Solana Merkle Tree..."}</> : <><Cpu className="w-5 h-5" /> {activeTab === "parts" ? "Mint Part Catalog" : "Execute Mint Protocol"}</>}
      </button>
    </div>
  );
}
