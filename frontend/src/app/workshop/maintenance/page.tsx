"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Trash2, Upload, Loader2, ScanLine, CheckCircle2, X, Camera, ShieldCheck, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useActiveVehicle, vehicleData } from "@/context/ActiveVehicleContext";
import { useBooking, type InvoiceData, type InvoicePart } from "@/context/BookingContext";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const serviceTypes = ["Oil Change", "Brake Pad Replacement", "Full Inspection", "CVT Fluid Replacement", "Tire Rotation", "Air Filter Replacement", "Coolant Flush", "Battery Replacement", "Spark Plug Replacement", "Timing Belt Replacement"];

// Mock OEM Part Catalog — simulates data pulled from on-chain NFT catalog after scanning
const oemCatalog = [
  { name: "Engine Oil 5W-30 (4L)", partNumber: "08880-83264", manufacturer: "Toyota Motor Corp", priceIDR: 380000 },
  { name: "Oil Filter", partNumber: "90915-YZZD4", manufacturer: "Denso Corp", priceIDR: 45000 },
  { name: "Front Brake Pad Set", partNumber: "04465-BZ010", manufacturer: "Aisin Corp", priceIDR: 450000 },
  { name: "Spark Plugs (Iridium x4)", partNumber: "90919-01253", manufacturer: "Denso Corp", priceIDR: 320000 },
  { name: "Air Filter", partNumber: "17801-BZ050", manufacturer: "Toyota Motor Corp", priceIDR: 85000 },
  { name: "CVT Grease", partNumber: "08C30-K59-600ML", manufacturer: "Honda Motor Co", priceIDR: 35000 },
  { name: "Brake Disc Rotor FL", partNumber: "43512-BZ130", manufacturer: "Toyota Motor Corp", priceIDR: 550000 },
  { name: "Coolant (1L)", partNumber: "08889-80100", manufacturer: "Toyota Motor Corp", priceIDR: 65000 },
  { name: "V-Belt", partNumber: "90916-02708", manufacturer: "Bando Chemical", priceIDR: 120000 },
  { name: "Battery 45B24L", partNumber: "28800-BZ050", manufacturer: "GS Yuasa", priceIDR: 850000 },
];

interface PartRow {
  name: string;
  partNumber: string;
  isOem: boolean;
  manufacturer: string;
  priceIDR: number | "";
  scanned: boolean;
}

const emptyPart = (): PartRow => ({ name: "", partNumber: "", isOem: false, manufacturer: "", priceIDR: "", scanned: false });

function MaintenanceContent() {
  const ctx = useActiveVehicle();
  const bookingCtx = useBooking();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vin = searchParams.get("vin");
  const fromBooking = searchParams.get("fromBooking") === "true";

  let currentVehicleData = ctx?.currentVehicleData || vehicleData.avanza;
  if (vin) {
    const v = Object.values(vehicleData).find(v => v.vin === vin);
    if (v) currentVehicleData = v;
  }

  // If from booking, show booking info
  const booking = fromBooking ? bookingCtx?.booking : null;

  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [parts, setParts] = useState<PartRow[]>([emptyPart()]);
  const [serviceType, setServiceType] = useState(serviceTypes[0]);
  const [serviceCost, setServiceCost] = useState<number | "">("");
  const [techNotes, setTechNotes] = useState(booking ? `Keluhan pelanggan: ${booking.form.complaint}` : "");
  const [scanningIndex, setScanningIndex] = useState<number | null>(null);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanModalScanning, setScanModalScanning] = useState(false);
  const scanVideoRef = useRef<HTMLVideoElement>(null);
  const scanStreamRef = useRef<MediaStream | null>(null);

  // Camera lifecycle for scan modal
  useEffect(() => {
    if (scanModalOpen && !scanModalScanning) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => { scanStreamRef.current = s; if (scanVideoRef.current) scanVideoRef.current.srcObject = s; })
        .catch(() => {/* Camera unavailable — simulate mode */});
    }
    return () => { if (scanStreamRef.current) { scanStreamRef.current.getTracks().forEach(t => t.stop()); scanStreamRef.current = null; } };
  }, [scanModalOpen, scanModalScanning]);

  const addPart = () => setParts([...parts, emptyPart()]);
  const removePart = (i: number) => setParts(parts.filter((_, idx) => idx !== i));

  const updatePart = (i: number, field: keyof PartRow, value: any) => {
    const newParts = [...parts];
    (newParts[i] as any)[field] = value;
    setParts(newParts);
  };

  // Open scan modal
  const handleOpenScanModal = () => {
    setScanModalOpen(true);
    setScanModalScanning(false);
  };

  // Execute scan from modal
  const handleScanPart = () => {
    setScanModalScanning(true);
    // Find first empty part row or add one
    let targetIdx = parts.findIndex(p => !p.name && !p.partNumber);
    if (targetIdx === -1) {
      setParts(prev => [...prev, emptyPart()]);
      targetIdx = parts.length;
    }
    setScanningIndex(targetIdx);

    const randomPart = oemCatalog[Math.floor(Math.random() * oemCatalog.length)];
    setTimeout(() => {
      setParts(prev => {
        const newParts = [...prev];
        const idx = targetIdx < newParts.length ? targetIdx : newParts.length - 1;
        newParts[idx] = {
          name: randomPart.name,
          partNumber: randomPart.partNumber,
          isOem: true,
          manufacturer: randomPart.manufacturer,
          priceIDR: randomPart.priceIDR,
          scanned: true,
        };
        return newParts;
      });
      setScanningIndex(null);
      setScanModalOpen(false);
      setScanModalScanning(false);
      showToast("success", "Part Verified ✅", `${randomPart.name} — OEM Verified by ${randomPart.manufacturer}`);
    }, 2000);
  };

  // Computed totals
  const partsTotal = parts.reduce((sum, p) => sum + (typeof p.priceIDR === "number" ? p.priceIDR : 0), 0);
  const serviceCostNum = typeof serviceCost === "number" ? serviceCost : 0;
  const GAS_FEE = 100; // Solana gas fee in IDR
  const grandTotal = partsTotal + serviceCostNum + GAS_FEE;

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);

      if (fromBooking && bookingCtx) {
        // Build InvoiceData and send through BookingContext
        const invoiceParts: InvoicePart[] = parts
          .filter(p => p.name.trim())
          .map(p => ({
            name: p.name,
            partNumber: p.partNumber,
            manufacturer: p.manufacturer,
            price: typeof p.priceIDR === "number" ? p.priceIDR : 0,
            isOEM: p.isOem,
          }));

        const invoice: InvoiceData = {
          parts: invoiceParts,
          serviceCost: serviceCostNum,
          gasFee: GAS_FEE,
          totalIDR: grandTotal,
          serviceType,
          mechanicNotes: techNotes,
        };

        bookingCtx.sendInvoice(invoice);
        showToast("success", "Invoice Terkirim! 📄", "Invoice telah dikirim ke pelanggan. Menunggu pembayaran.");
        router.push("/workshop/bookings");
      } else {
        // Standard (walk-in) flow
        setParts([emptyPart()]);
        setServiceCost("");
        setTechNotes("");
        showToast("success", "Invoice Sent to Customer!", "Awaiting payment. Service data will anchor to Solana once settled. 🕒");
      }
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="page-header">
        {fromBooking && (
          <Link href="/workshop/bookings" className="flex items-center gap-2 text-xs mb-4 hover:opacity-80 transition-opacity" style={{ color: "var(--solana-purple)" }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Bookings
          </Link>
        )}
        <h1 className="flex items-center gap-3">
          <FileText className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
          {fromBooking ? "Buat Invoice Booking" : "Add Maintenance"}
        </h1>
        <p>Record service details for {currentVehicleData.name} · VIN: {currentVehicleData.vin}</p>
      </div>

      {/* Booking context banner */}
      {fromBooking && booking && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 mb-8 border-l-4"
          style={{ borderLeftColor: "var(--solana-cyan)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4" style={{ color: "var(--solana-cyan)" }} />
            <h3 className="font-semibold text-sm" style={{ color: "var(--solana-cyan)" }}>Invoice untuk Booking #{booking.id}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" style={{ color: "var(--solana-text-muted)" }}>
            <p>📅 Jadwal: {booking.form.date} · {booking.form.time}</p>
            <p>🚗 Kendaraan: {currentVehicleData.name}</p>
            <p className="sm:col-span-2">💬 Keluhan: {booking.form.complaint}</p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-8">
        <div className="glass-card-static p-8">
          <label className="block text-base font-semibold mb-4">Service Type</label>
          <select className="input-field" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            {serviceTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card-static p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[10px] px-3 py-1 font-bold rounded-bl-xl border-b border-l flex gap-1 items-center" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", borderColor: "rgba(34,197,94,0.2)" }}>
              <CheckCircle2 className="w-3 h-3" /> IoT Oracle Synced
            </div>
            <label className="block text-base font-semibold mb-2 mt-2">Current Mileage</label>
            <p className="text-sm mb-4" style={{ color: "var(--solana-text-muted)" }}>Auto-fetched via vehicle telematics</p>
            <div className="text-2xl font-mono font-bold tracking-wider p-4 rounded-xl inline-block" style={{ background: "rgba(15,23,42,0.5)", color: "var(--solana-text)", border: "1px solid rgba(100,116,139,0.3)" }}>
              {currentVehicleData.mileage || "12,450"} <span className="text-sm text-slate-500">KM</span>
            </div>
          </div>
          <div className="glass-card-static p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[10px] px-3 py-1 font-bold rounded-bl-xl border-b border-l flex gap-1 items-center" style={{ background: "rgba(153,69,255,0.1)", color: "#c084fc", borderColor: "rgba(153,69,255,0.2)" }}>
              <ShieldCheck className="w-3 h-3" /> Blockchain Timestamp
            </div>
            <label className="block text-base font-semibold mb-2 mt-2">Service Execution Date</label>
            <p className="text-sm mb-4" style={{ color: "var(--solana-text-muted)" }}>Locked to absolute time of transaction</p>
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(15,23,42,0.5)", border: "1px dashed rgba(153,69,255,0.4)" }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--solana-purple)" }} />
              <span className="text-sm font-mono font-semibold" style={{ color: "var(--solana-purple)" }}>Pending Network Execution...</span>
            </div>
          </div>
        </div>

        {/* Parts Section */}
        <div className="glass-card-static p-8">
          <div className="flex justify-between items-center mb-6">
            <label className="text-base font-semibold">Parts Replaced</label>
            <div className="flex gap-2">
              <button onClick={handleOpenScanModal} disabled={scanningIndex !== null} className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-semibold cursor-pointer disabled:opacity-50" style={{ background: "rgba(0,209,255,0.1)", color: "var(--solana-cyan)", border: "1px solid rgba(0,209,255,0.3)" }}>
                {scanningIndex !== null ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                {scanningIndex !== null ? "Scanning..." : "Scan Part"}
              </button>
              <button onClick={addPart} className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors cursor-pointer text-sm" style={{ background: "rgba(153,69,255,0.1)", color: "var(--solana-purple)", border: "1px solid rgba(153,69,255,0.2)" }}>
                <Plus className="w-4 h-4" /> Add Part
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {parts.map((part, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl relative"
                style={{
                  background: part.scanned ? "rgba(0,209,255,0.05)" : "rgba(20,20,40,0.3)",
                  border: part.scanned ? "1px solid rgba(0,209,255,0.2)" : "1px solid rgba(153,69,255,0.1)",
                }}
              >
                {part.scanned && (
                  <div className="absolute top-2 right-2">
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(0,209,255,0.15)", color: "var(--solana-cyan)" }}>
                      <CheckCircle2 className="w-3 h-3" /> Auto-filled via Scan
                    </span>
                  </div>
                )}
                {scanningIndex === i && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl z-10" style={{ background: "rgba(14,14,26,0.8)", backdropFilter: "blur(4px)" }}>
                    <div className="flex items-center gap-3 text-sm" style={{ color: "var(--solana-cyan)" }}>
                      <Loader2 className="w-5 h-5 animate-spin" /> Verifying part on-chain...
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold mb-1 block" style={{ color: "var(--solana-text-muted)" }}>Part Name</label>
                    <input type="text" className="input-field text-sm" placeholder="e.g. Brake Pad" value={part.name} onChange={e => updatePart(i, "name", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold mb-1 block" style={{ color: "var(--solana-text-muted)" }}>OEM Part #</label>
                    <input type="text" className="input-field text-sm mono" placeholder="e.g. 04465-BZ010" value={part.partNumber} onChange={e => updatePart(i, "partNumber", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold mb-1 block" style={{ color: "var(--solana-text-muted)" }}>Manufacturer</label>
                    <input type="text" className="input-field text-sm" placeholder="e.g. Toyota Motor Corp" value={part.manufacturer} onChange={e => updatePart(i, "manufacturer", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-semibold mb-1 block" style={{ color: "var(--solana-text-muted)" }}>Price (Rp)</label>
                    <input type="number" className="input-field text-sm mono" placeholder="e.g. 450000" value={part.priceIDR} onChange={e => updatePart(i, "priceIDR", e.target.value ? Number(e.target.value) : "")} />
                  </div>
                  <div className="flex items-end gap-3">
                    <label className="flex items-center gap-2 text-xs cursor-pointer shrink-0 px-3 py-3 rounded-xl" style={{ background: part.isOem ? "rgba(20,241,149,0.08)" : "rgba(20,20,40,0.3)", color: part.isOem ? "var(--solana-green)" : "var(--solana-text-muted)" }}>
                      <input type="checkbox" checked={part.isOem} onChange={e => updatePart(i, "isOem", e.target.checked)} className="accent-green-500" /> OEM
                    </label>
                    {parts.length > 1 && (
                      <button onClick={() => removePart(i)} className="p-3 rounded-xl transition-colors cursor-pointer" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-card-static p-8">
          <label className="block text-base font-semibold mb-4">OBD-II Diagnostic Codes (optional)</label>
          <input type="text" className="input-field mono" placeholder="e.g. P0301, P0420 (comma separated)" />
        </div>

        {/* Service Cost */}
        <div className="glass-card-static p-8">
          <label className="block text-base font-semibold mb-4 text-white">Service Cost (Rp)</label>
          <input
            type="number"
            className="input-field font-semibold text-white"
            placeholder="e.g. 150000"
            value={serviceCost}
            onChange={e => setServiceCost(e.target.value ? Number(e.target.value) : "")}
          />
          <p className="text-xs mt-2" style={{ color: "var(--solana-text-muted)" }}>Workshop service & labor charge (excluding parts)</p>
        </div>

        {/* Auto-Computed Invoice Breakdown */}
        <div className="glass-card-static p-8 border" style={{ borderColor: "rgba(153,69,255,0.3)", background: "rgba(153,69,255,0.03)" }}>
          <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: "var(--solana-purple)" }}>
            <FileText className="w-5 h-5" /> Invoice Breakdown (Auto-Computed)
          </h3>
          <div className="space-y-3">
            {parts.filter(p => p.name).map((p, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-slate-300 flex items-center gap-2">
                  {p.isOem && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                  {p.name}
                  {p.isOem && <span className="text-[10px] text-green-400 font-medium">(OEM)</span>}
                </span>
                <span className="mono text-slate-300">Rp {(typeof p.priceIDR === "number" ? p.priceIDR : 0).toLocaleString("id-ID")}</span>
              </div>
            ))}
            {parts.filter(p => p.name).length > 0 && (
              <div className="border-t pt-2 mt-2" style={{ borderColor: "rgba(153,69,255,0.15)" }}>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: "var(--solana-text-muted)" }}>Subtotal Parts</span>
                  <span className="mono text-slate-300">Rp {partsTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: "var(--solana-text-muted)" }}>Service Cost</span>
              <span className="mono text-slate-300">Rp {serviceCostNum.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: "var(--solana-text-muted)" }}>Solana Gas Fee</span>
              <span className="mono text-slate-300">Rp {GAS_FEE.toLocaleString("id-ID")}</span>
            </div>
            <div className="mt-4 p-4 rounded-xl flex justify-between items-center" style={{ background: "rgba(153,69,255,0.1)", border: "1px solid rgba(153,69,255,0.3)" }}>
              <span className="font-bold text-white text-base">TOTAL INVOICE</span>
              <span className="text-2xl font-bold gradient-text">Rp {grandTotal.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        <div className="glass-card-static p-8">
          <label className="block text-base font-semibold mb-4">Technician Notes</label>
          <textarea className="input-field" rows={4} placeholder="Additional observations, recommendations..." value={techNotes} onChange={(e) => setTechNotes(e.target.value)} />
        </div>

        <div className="glass-card-static p-8">
          <label className="block text-base font-semibold mb-4">Photo Evidence</label>
          <div className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer" style={{ borderColor: "rgba(153,69,255,0.2)", background: "rgba(20,20,40,0.3)" }}>
            <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--solana-text-muted)" }} />
            <p className="text-base mb-2" style={{ color: "var(--solana-text-muted)" }}>Drop images here or click to upload</p>
            <p className="text-sm" style={{ color: "var(--solana-text-muted)" }}>JPEG, PNG, WebP · Max 5 files · 10MB each</p>
          </div>
        </div>

        {/* Scan Part Modal */}
        <AnimatePresence>
          {scanModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-8 max-w-md w-full flex flex-col items-center text-center relative">
                <button onClick={() => { setScanModalOpen(false); setScanModalScanning(false); }} className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"><X className="w-5 h-5 text-white" /></button>
                <Camera className="w-8 h-8 mb-3" style={{ color: "var(--solana-cyan)" }} />
                <h3 className="text-lg font-bold mb-1">Scan Part Barcode</h3>
                <p className="text-xs mb-6" style={{ color: "var(--solana-text-muted)" }}>Point your camera at the part&apos;s barcode or QR to auto-verify from OEM NFT catalog</p>
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6" style={{ background: "#111", border: "2px solid rgba(0,209,255,0.3)" }}>
                  <video ref={scanVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute inset-6 rounded-xl" style={{ border: "2px solid rgba(0,209,255,0.4)" }} />
                  <motion.div className="absolute left-6 right-6 h-[2px]" style={{ background: "var(--solana-cyan)", boxShadow: "0 0 10px rgba(0,209,255,0.8)" }} animate={{ top: ["20%", "80%", "20%"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                  <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: "var(--solana-cyan)" }} />
                  <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: "var(--solana-cyan)" }} />
                  <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: "var(--solana-cyan)" }} />
                  <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: "var(--solana-cyan)" }} />
                  {scanModalScanning && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
                      <div className="flex items-center gap-3" style={{ color: "var(--solana-cyan)" }}><Loader2 className="w-6 h-6 animate-spin" /> Verifying on-chain...</div>
                    </div>
                  )}
                </div>
                <button onClick={handleScanPart} disabled={scanModalScanning} className="glow-btn w-full gap-2 cursor-pointer disabled:opacity-50" style={{ padding: "14px 32px", background: "var(--solana-cyan)", color: "#0E0E1A" }}>
                  {scanModalScanning ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : <><ScanLine className="w-5 h-5" /> Simulate Scan</>}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={handleSubmit} disabled={submitting} className="glow-btn w-full text-base gap-3 disabled:opacity-50 cursor-pointer" style={{ padding: "16px 32px" }}>
          {submitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> {fromBooking ? "Mengirim Invoice..." : "Signing & Submitting to Solana..."}</>
          ) : (
            <>{fromBooking ? "Kirim Invoice ke Pelanggan" : "Submit On-Chain"}</>
          )}
        </button>
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Maintenance Form...</div>}>
      <MaintenanceContent />
    </Suspense>
  );
}
