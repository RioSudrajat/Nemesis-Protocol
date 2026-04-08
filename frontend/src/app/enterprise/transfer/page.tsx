"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightLeft, Car, Search, CheckCircle2, QrCode, Loader2,
  AlertTriangle, ChevronRight, User, Wallet, FileText, ClipboardList, Shield, Sparkles,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

// Generate a fake but plausible Solana-looking tx signature
function mockTxSig() {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let s = "";
  for (let i = 0; i < 44; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `${s.slice(0, 8)}...${s.slice(-8)}`;
}

const MOCK_BUYERS = [
  { name: "Andi Pratama", wallet: "5YNmS1R5yjLezYFqP8tHnQxDv9WkXcR2bB7JmVhTuA3L", nik: "3201012509870001" },
  { name: "Siti Rahayu",  wallet: "8ZpQrTvK2cLmNbWxYuJ4HdGe6RfS9A1oP3iVnEzMqBsD", nik: "3271054407900002" },
  { name: "Budi Wijaya",  wallet: "3XkLmRvB9tYjH2nQpC8wD4uFsG7KaZ1iVoP6eNxMqJrT", nik: "3173061102950003" },
];

const MOCK_FLEET = [
  { vin: "MHKA1BA1JFK000099", model: "Toyota Avanza", year: 2025, color: "Silver Metallic", status: "Ready to Transfer" },
  { vin: "MHKA1BA1JFK000100", model: "Toyota Rush", year: 2025, color: "Midnight Black", status: "Ready to Transfer" },
  { vin: "MHKA1BA1JFK000101", model: "Toyota Innova", year: 2025, color: "Pearl White", status: "Ready to Transfer" },
  { vin: "MHKA1BA1JFK000102", model: "Toyota Fortuner", year: 2024, color: "Phantom Brown", status: "Ready to Transfer" },
  { vin: "MHKA1BA1JFK000103", model: "Toyota Yaris", year: 2025, color: "Nebula Blue", status: "Ready to Transfer" },
];

type Step = 1 | 2 | 3 | 4;

export default function TransferPage() {
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<(typeof MOCK_FLEET)[0] | null>(null);
  const [saleData, setSaleData] = useState({ invoice: "", price: "", date: "", salesperson: "" });
  const [buyerData, setBuyerData] = useState({ name: "", wallet: "", nik: "" });
  const [buyerMode, setBuyerMode] = useState<"manual" | "qr">("manual");
  const [transferring, setTransferring] = useState(false);
  const [done, setDone] = useState(false);
  const [txSig, setTxSig] = useState("");

  const filteredFleet = MOCK_FLEET.filter(v =>
    v.vin.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase())
  );

  const handleTransfer = () => {
    setTransferring(true);
    setTxSig(mockTxSig());
    setTimeout(() => {
      setTransferring(false);
      setDone(true);
      const target = buyerData.wallet ? `${buyerData.wallet.slice(0, 8)}...` : "QR claim";
      showToast("success", "Transfer Complete!", `cNFT transferred to ${target}`);
    }, 3500);
  };

  const simulateMockBuyer = () => {
    const mock = MOCK_BUYERS[Math.floor(Math.random() * MOCK_BUYERS.length)];
    setBuyerMode("manual");
    setBuyerData(mock);
    showToast("success", "Mock Buyer Loaded", `${mock.name} siap untuk di-transfer.`);
  };

  const simulateFullTransfer = () => {
    if (!selectedVehicle) setSelectedVehicle(MOCK_FLEET[0]);
    setSaleData({
      invoice: `INV-2026-${Math.floor(10000 + Math.random() * 89999)}`,
      price: "285000000",
      date: new Date().toISOString().split("T")[0],
      salesperson: "Budi Santoso",
    });
    const mock = MOCK_BUYERS[Math.floor(Math.random() * MOCK_BUYERS.length)];
    setBuyerMode("manual");
    setBuyerData(mock);
    setStep(4);
    showToast("success", "Mock Data Loaded", "Form terisi otomatis. Tekan Konfirmasi untuk melanjutkan.");
  };

  const steps = [
    { n: 1, label: "Select Vehicle" },
    { n: 2, label: "Verify Sale" },
    { n: 3, label: "Buyer Info" },
    { n: 4, label: "Confirm" },
  ];

  if (done) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 rounded-3xl text-center"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(34,197,94,0.15)" }}>
            <CheckCircle2 className="w-10 h-10 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Transfer Successful</h2>
          <p className="text-sm mb-6" style={{ color: "var(--solana-text-muted)" }}>
            Vehicle NFT has been transferred on Solana. The buyer can now view their vehicle in NOC ID dApp.
          </p>

          <div className="glass-card-static rounded-2xl p-6 text-left mb-6 space-y-3">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: "var(--solana-green)" }} />
              Vehicle Digital Certificate
            </h3>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--solana-text-muted)" }}>VIN</span>
              <span className="mono font-semibold">{selectedVehicle?.vin}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--solana-text-muted)" }}>Model</span>
              <span className="font-semibold">{selectedVehicle?.model} {selectedVehicle?.year}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--solana-text-muted)" }}>Owner</span>
              <span className="font-semibold">{buyerData.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--solana-text-muted)" }}>Wallet</span>
              <span className="mono text-xs">{buyerData.wallet}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--solana-text-muted)" }}>Sale Price</span>
              <span className="font-semibold">Rp {Number(saleData.price).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--solana-text-muted)" }}>Invoice</span>
              <span className="mono">{saleData.invoice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--solana-text-muted)" }}>Tx Signature</span>
              <span className="mono text-xs" style={{ color: "var(--solana-cyan, #2DD4BF)" }}>{txSig}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--solana-text-muted)" }}>Network Fee</span>
              <span>~0.00001 SOL</span>
            </div>
          </div>

          <button
            onClick={() => { setDone(false); setStep(1); setSelectedVehicle(null); setSaleData({ invoice: "", price: "", date: "", salesperson: "" }); setBuyerData({ name: "", wallet: "", nik: "" }); }}
            className="glow-btn w-full"
          >
            Transfer Another Vehicle
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="page-header mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 font-bold text-2xl md:text-3xl">
            <ArrowRightLeft className="w-7 h-7" style={{ color: "var(--solana-green)" }} />
            Transfer Kepemilikan
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>
            Transfer NFT kendaraan ke pembeli setelah transaksi showroom selesai
          </p>
        </div>
        <button
          onClick={simulateFullTransfer}
          className="glow-btn-outline gap-2 text-xs px-4 py-2 shrink-0"
          style={{ borderColor: "rgba(250,204,21,0.4)", color: "#FCD34D" }}
        >
          <Sparkles className="w-3.5 h-3.5" /> Simulate Mock Data
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, idx) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: step >= s.n ? "var(--solana-gradient)" : "rgba(255,255,255,0.05)",
                  color: step >= s.n ? "white" : "var(--solana-text-muted)",
                  border: step === s.n ? "2px solid var(--solana-green)" : "none",
                }}
              >
                {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
              </div>
              <span className="text-xs font-medium hidden sm:block" style={{ color: step >= s.n ? "white" : "var(--solana-text-muted)" }}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 flex-1 opacity-30" />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select Vehicle */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Car className="w-5 h-5" style={{ color: "var(--solana-purple)" }} />
                Pilih Kendaraan
              </h2>
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--solana-text-muted)" }} />
                <input
                  type="text"
                  className="input-field pl-9 w-full"
                  placeholder="Cari VIN atau model..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                {filteredFleet.map(v => (
                  <button
                    key={v.vin}
                    onClick={() => setSelectedVehicle(v)}
                    className="flex items-center justify-between p-4 rounded-xl text-left transition-all"
                    style={{
                      background: selectedVehicle?.vin === v.vin ? "rgba(94, 234, 212,0.15)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${selectedVehicle?.vin === v.vin ? "rgba(94, 234, 212,0.5)" : "rgba(255,255,255,0.05)"}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(94, 234, 212,0.1)" }}>
                        <Car className="w-5 h-5" style={{ color: "var(--solana-purple)" }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{v.model} {v.year}</p>
                        <p className="mono text-xs" style={{ color: "var(--solana-text-muted)" }}>{v.vin}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>{v.color}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(34,197,94,0.12)", color: "#86EFAC" }}>
                        {v.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!selectedVehicle}
              className="glow-btn w-full mt-4 disabled:opacity-40"
            >
              Lanjut: Verifikasi Penjualan
            </button>
          </motion.div>
        )}

        {/* Step 2: Verify Sale */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-base font-semibold mb-1 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" style={{ color: "var(--solana-cyan, #2DD4BF)" }} />
                Verifikasi Data Penjualan
              </h2>
              <p className="text-xs mb-5" style={{ color: "var(--solana-text-muted)" }}>
                Kendaraan: <span className="font-semibold text-white">{selectedVehicle?.model} {selectedVehicle?.year}</span>
                <span className="mono ml-2" style={{ color: "var(--solana-text-muted)" }}>({selectedVehicle?.vin})</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Nomor Invoice</label>
                  <input type="text" className="input-field mono" placeholder="INV-2026-XXXXX" value={saleData.invoice} onChange={e => setSaleData(s => ({ ...s, invoice: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Harga Jual (Rp)</label>
                  <input type="number" className="input-field mono" placeholder="e.g. 280000000" value={saleData.price} onChange={e => setSaleData(s => ({ ...s, price: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Tanggal Penjualan</label>
                  <input type="date" className="input-field" value={saleData.date} onChange={e => setSaleData(s => ({ ...s, date: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Nama Sales</label>
                  <input type="text" className="input-field" placeholder="e.g. Budi Santoso" value={saleData.salesperson} onChange={e => setSaleData(s => ({ ...s, salesperson: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1)} className="glow-btn-outline flex-1">Kembali</button>
              <button
                onClick={() => setStep(3)}
                disabled={!saleData.invoice || !saleData.price || !saleData.date || !saleData.salesperson}
                className="glow-btn flex-1 disabled:opacity-40"
              >
                Lanjut: Data Pembeli
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Buyer Info */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" style={{ color: "#FCD34D" }} />
                Data Pembeli & Wallet
              </h2>

              <div className="mb-4">
                <button
                  onClick={simulateMockBuyer}
                  className="glow-btn-outline gap-2 text-xs px-3 py-1.5"
                  style={{ borderColor: "rgba(250,204,21,0.4)", color: "#FCD34D" }}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Simulate Mock Buyer
                </button>
              </div>

              {/* Mode toggle */}
              <div className="flex gap-2 mb-5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <button
                  onClick={() => setBuyerMode("manual")}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: buyerMode === "manual" ? "rgba(94, 234, 212,0.2)" : "transparent",
                    color: buyerMode === "manual" ? "var(--solana-purple)" : "var(--solana-text-muted)",
                  }}
                >
                  <Wallet className="w-4 h-4" /> Input Manual
                </button>
                <button
                  onClick={() => setBuyerMode("qr")}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: buyerMode === "qr" ? "rgba(94, 234, 212,0.2)" : "transparent",
                    color: buyerMode === "qr" ? "var(--solana-cyan, #2DD4BF)" : "var(--solana-text-muted)",
                  }}
                >
                  <QrCode className="w-4 h-4" /> Generate QR Showroom
                </button>
              </div>

              {buyerMode === "manual" ? (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Nama Pembeli</label>
                    <input type="text" className="input-field" placeholder="e.g. John Doe" value={buyerData.name} onChange={e => setBuyerData(b => ({ ...b, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>Solana Wallet Address</label>
                    <input type="text" className="input-field mono" placeholder="e.g. 5YNmS1R5yjLezYF..." value={buyerData.wallet} onChange={e => setBuyerData(b => ({ ...b, wallet: e.target.value }))} />
                    <p className="text-xs mt-1" style={{ color: "var(--solana-text-muted)" }}>Alamat wallet Phantom / Solflare pembeli</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--solana-text-muted)" }}>NIK / ID Pembeli</label>
                    <input type="text" className="input-field mono" placeholder="16 digit NIK" maxLength={16} value={buyerData.nik} onChange={e => setBuyerData(b => ({ ...b, nik: e.target.value }))} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 gap-5">
                  {/* Mock QR visual */}
                  <div className="relative">
                    <div
                      className="w-48 h-48 rounded-2xl p-3 flex items-center justify-center"
                      style={{ background: "white" }}
                    >
                      <div className="grid grid-cols-7 gap-0.5 w-full h-full">
                        {Array.from({ length: 49 }).map((_, idx) => {
                          const corners = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48];
                          const inner = [8,9,10,11,12,15,16,17,18,19,22,23,24,25,26,29,30,31,32,33,36,37,38,39,40];
                          return (
                            <div
                              key={idx}
                              className="rounded-sm"
                              style={{
                                background: corners.includes(idx) ? "#1a1a2e"
                                  : inner.includes(idx) && idx % 3 !== 0 ? "#1a1a2e"
                                  : "transparent",
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--solana-gradient)" }}>
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm mb-1">Scan untuk Claim NFT</p>
                    <p className="text-xs max-w-xs" style={{ color: "var(--solana-text-muted)" }}>
                      Tampilkan QR code ini ke pembeli. Mereka scan menggunakan Phantom atau Solflare, connect wallet, lalu approve transfer.
                    </p>
                  </div>
                  <div className="glass-card-static rounded-xl p-3 w-full text-center">
                    <p className="mono text-xs" style={{ color: "var(--solana-cyan, #2DD4BF)" }}>
                      nocid.app/claim/{selectedVehicle?.vin}?sale={saleData.invoice}
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>
                    QR expires in <strong className="text-white">30 minutes</strong>. Data pembeli akan otomatis ter-capture saat mereka approve.
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(2)} className="glow-btn-outline flex-1">Kembali</button>
              <button
                onClick={() => setStep(4)}
                disabled={buyerMode === "manual" && (!buyerData.name || !buyerData.wallet)}
                className="glow-btn flex-1 disabled:opacity-40"
              >
                Lanjut: Konfirmasi
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" style={{ color: "var(--solana-green)" }} />
                Konfirmasi Transfer
              </h2>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Kendaraan", value: `${selectedVehicle?.model} ${selectedVehicle?.year} — ${selectedVehicle?.color}` },
                  { label: "VIN", value: selectedVehicle?.vin, mono: true },
                  { label: "Invoice", value: saleData.invoice, mono: true },
                  { label: "Harga Jual", value: `Rp ${Number(saleData.price).toLocaleString("id-ID")}` },
                  { label: "Tanggal", value: saleData.date },
                  { label: "Sales", value: saleData.salesperson },
                  ...(buyerMode === "manual" ? [
                    { label: "Pembeli", value: buyerData.name },
                    { label: "Wallet Tujuan", value: buyerData.wallet, mono: true },
                    { label: "NIK", value: buyerData.nik, mono: true },
                  ] : [
                    { label: "Mode Transfer", value: "QR Showroom (buyer self-claim)" },
                  ]),
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <span className="text-sm" style={{ color: "var(--solana-text-muted)" }}>{row.label}</span>
                    <span className={`text-sm font-semibold max-w-[55%] text-right truncate ${row.mono ? "mono text-xs" : ""}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl mb-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">
                  Transfer NFT bersifat <strong>irreversible</strong>. Pastikan VIN dan alamat wallet pembeli sudah benar sebelum melanjutkan. Transaksi ini akan tercatat permanen di Solana blockchain.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(3)} disabled={transferring} className="glow-btn-outline flex-1">Kembali</button>
              <button
                onClick={handleTransfer}
                disabled={transferring}
                className="glow-btn flex-1 gap-2 disabled:opacity-60"
                style={{ background: transferring ? undefined : "linear-gradient(135deg, #86EFAC, #16A34A)" }}
              >
                {transferring
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses Transfer...</>
                  : <><ArrowRightLeft className="w-4 h-4" /> Konfirmasi & Transfer NFT</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
