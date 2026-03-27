"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarCheck, CheckCircle2, XCircle, Clock, Loader2, Car,
  MessageSquare, Eye, Box, Wrench, Receipt, Star, FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBooking, type BookingStatus } from "@/context/BookingContext";
import { vehicleData } from "@/context/ActiveVehicleContext";

// Static past bookings for display filler
const pastBookings = [
  { id: "BK-HIST-001", vehicleName: "Honda Beat 2024", complaint: "Suara kasar saat akselerasi", date: "2026-03-10", time: "09:00", status: "COMPLETED" as BookingStatus, rating: 5 },
  { id: "BK-HIST-002", vehicleName: "Toyota Avanza 2023", complaint: "AC tidak dingin", date: "2026-03-05", time: "10:00", status: "COMPLETED" as BookingStatus, rating: 4 },
  { id: "BK-HIST-003", vehicleName: "Suzuki Ertiga 2025", complaint: "Rem berderit", date: "2026-02-28", time: "14:00", status: "REJECTED" as BookingStatus, rating: 0 },
];

export default function WorkshopBookingsPage() {
  const ctx = useBooking();
  const booking = ctx?.booking;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Semua");
  const [rejectConfirm, setRejectConfirm] = useState(false);

  const tabs = ["Semua", "Menunggu", "Diterima", "Dalam Servis", "Selesai"];

  const getTabStatus = (tab: string): BookingStatus[] => {
    switch (tab) {
      case "Menunggu": return ["PENDING"];
      case "Diterima": return ["ACCEPTED"];
      case "Dalam Servis": return ["IN_SERVICE", "INVOICE_SENT", "PAID"];
      case "Selesai": return ["COMPLETED", "REJECTED"];
      default: return [];
    }
  };

  const matchesTab = (status: BookingStatus) => {
    if (activeTab === "Semua") return true;
    return getTabStatus(activeTab).includes(status);
  };

  const vehicle = booking ? vehicleData[booking.form.vehicleKey] : null;

  const statusBadge = (status: BookingStatus) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      PENDING: { bg: "rgba(250,204,21,0.1)", color: "#FACC15", label: "Menunggu" },
      ACCEPTED: { bg: "rgba(20,241,149,0.1)", color: "#14F195", label: "Diterima" },
      REJECTED: { bg: "rgba(239,68,68,0.1)", color: "#EF4444", label: "Ditolak" },
      IN_SERVICE: { bg: "rgba(20,209,255,0.1)", color: "var(--solana-cyan)", label: "Dalam Servis" },
      INVOICE_SENT: { bg: "rgba(249,115,22,0.1)", color: "#F97316", label: "Invoice Terkirim" },
      PAID: { bg: "rgba(20,241,149,0.1)", color: "#14F195", label: "Dibayar" },
      COMPLETED: { bg: "rgba(153,69,255,0.1)", color: "#9945FF", label: "Selesai" },
    };
    const s = map[status] || map.PENDING;
    return (
      <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}22` }}>
        {s.label}
      </span>
    );
  };

  const handleSendInvoice = () => {
    if (!vehicle) return;
    // Redirect to maintenance page with booking context
    router.push(`/workshop/maintenance?fromBooking=true&vin=${vehicle.vin}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <CalendarCheck className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
          Booking Requests
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>Kelola permintaan booking dari pelanggan</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            style={{
              background: activeTab === tab ? "rgba(153,69,255,0.15)" : "rgba(255,255,255,0.03)",
              color: activeTab === tab ? "var(--solana-purple)" : "var(--solana-text-muted)",
              border: `1px solid ${activeTab === tab ? "rgba(153,69,255,0.3)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active booking card */}
      {booking && matchesTab(booking.status) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
          style={{ borderLeft: `4px solid ${booking.status === "PENDING" ? "#FACC15" : booking.status === "REJECTED" ? "#EF4444" : "#14F195"}` }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-sm">Booking Baru</h3>
                {statusBadge(booking.status)}
              </div>
              <p className="text-[10px] mono" style={{ color: "var(--solana-text-muted)" }}>{booking.id}</p>
            </div>
            <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>
              {new Date(booking.createdAt).toLocaleDateString("id-ID")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3.5 h-3.5" style={{ color: "var(--solana-purple)" }} />
              <span>{booking.form.date} · {booking.form.time}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Car className="w-3.5 h-3.5" style={{ color: "var(--solana-purple)" }} />
              <span>
                {vehicle?.name}
                {/* Only show VIN after accepted + data shared */}
                {booking.status !== "PENDING" && booking.status !== "REJECTED" && (booking.form.shareHistory || booking.form.shareDigitalTwin) && (
                  <span className="mono ml-1 text-[10px]" style={{ color: "var(--solana-text-muted)" }}>({vehicle?.vin})</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs mb-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(153,69,255,0.08)" }}>
            <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "var(--solana-text-muted)" }} />
            <p style={{ color: "var(--solana-text-muted)" }}>{booking.form.complaint}</p>
          </div>

          {/* Data access links - only when accepted and data shared */}
          {ctx?.dataAccessActive && (
            <div className="flex flex-wrap gap-2 mb-4">
              {booking.form.shareHistory && (
                <Link href={`/workshop/vehicle/${vehicle?.vin}`} className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors hover:bg-white/5" style={{ background: "rgba(20,241,149,0.05)", color: "var(--solana-green)", border: "1px solid rgba(20,241,149,0.15)" }}>
                  <Eye className="w-3.5 h-3.5" /> Lihat Riwayat Servis
                </Link>
              )}
              {booking.form.shareDigitalTwin && (
                <Link href={`/workshop/viewer?vin=${vehicle?.vin}`} className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors hover:bg-white/5" style={{ background: "rgba(20,209,255,0.05)", color: "var(--solana-cyan)", border: "1px solid rgba(20,209,255,0.15)" }}>
                  <Box className="w-3.5 h-3.5" /> Lihat 3D Digital Twin
                </Link>
              )}
            </div>
          )}

          {/* Actions based on status */}
          {booking.status === "PENDING" && (
            <div className="flex gap-3">
              {!rejectConfirm ? (
                <>
                  <button onClick={() => ctx?.acceptBooking()} className="glow-btn px-5 py-2 text-xs cursor-pointer flex-1 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terima Booking
                  </button>
                  <button onClick={() => setRejectConfirm(true)} className="px-5 py-2 text-xs rounded-xl cursor-pointer flex-1 flex items-center justify-center gap-1.5" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <XCircle className="w-3.5 h-3.5" /> Tolak
                  </button>
                </>
              ) : (
                <div className="w-full p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <p className="text-xs mb-3" style={{ color: "#EF4444" }}>Yakin ingin menolak booking ini?</p>
                  <div className="flex gap-2">
                    <button onClick={() => { ctx?.rejectBooking(); setRejectConfirm(false); }} className="px-4 py-1.5 text-xs rounded-lg cursor-pointer" style={{ background: "#EF4444", color: "#fff" }}>Ya, Tolak</button>
                    <button onClick={() => setRejectConfirm(false)} className="px-4 py-1.5 text-xs rounded-lg cursor-pointer" style={{ background: "rgba(255,255,255,0.05)", color: "var(--solana-text-muted)" }}>Batal</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {booking.status === "ACCEPTED" && (
            <button onClick={() => ctx?.startService()} className="glow-btn px-5 py-2 text-xs cursor-pointer flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" /> Mulai Servis
            </button>
          )}

          {booking.status === "IN_SERVICE" && (
            <button onClick={handleSendInvoice} className="glow-btn px-5 py-2 text-xs cursor-pointer flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5" /> Buat & Kirim Invoice
            </button>
          )}

          {booking.status === "INVOICE_SENT" && (
            <div className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl" style={{ background: "rgba(249,115,22,0.05)", color: "#F97316", border: "1px solid rgba(249,115,22,0.15)" }}>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Menunggu pembayaran dari pelanggan...
            </div>
          )}

          {booking.status === "PAID" && (
            <div className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl" style={{ background: "rgba(20,241,149,0.05)", color: "var(--solana-green)", border: "1px solid rgba(20,241,149,0.15)" }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Pembayaran diterima. Menunggu review dari pelanggan.
            </div>
          )}

          {booking.status === "COMPLETED" && booking.review && (
            <div className="p-3 rounded-xl" style={{ background: "rgba(153,69,255,0.05)", border: "1px solid rgba(153,69,255,0.15)" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5" style={{ color: s <= booking.review!.rating ? "#FACC15" : "rgba(153,69,255,0.15)", fill: s <= booking.review!.rating ? "#FACC15" : "none" }} />
                  ))}
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(20,241,149,0.1)", color: "var(--solana-green)" }}>On-Chain Verified</span>
              </div>
              {booking.review.comment && (
                <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>{booking.review.comment}</p>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Past bookings (static filler) */}
      <div className="space-y-4">
        {pastBookings
          .filter((pb) => activeTab === "Semua" || getTabStatus(activeTab).includes(pb.status))
          .map((pb, i) => (
            <motion.div
              key={pb.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 opacity-60"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{pb.vehicleName}</h3>
                  {statusBadge(pb.status)}
                </div>
                <p className="text-[10px] mono" style={{ color: "var(--solana-text-muted)" }}>{pb.date}</p>
              </div>
              <p className="text-xs mb-2" style={{ color: "var(--solana-text-muted)" }}>{pb.complaint}</p>
              {pb.status === "COMPLETED" && pb.rating > 0 && (
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3" style={{ color: s <= pb.rating ? "#FACC15" : "rgba(153,69,255,0.15)", fill: s <= pb.rating ? "#FACC15" : "none" }} />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
      </div>

      {/* Empty state */}
      {!booking && pastBookings.filter((pb) => activeTab === "Semua" || getTabStatus(activeTab).includes(pb.status)).length === 0 && (
        <div className="text-center py-16" style={{ color: "var(--solana-text-muted)" }}>
          <CalendarCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm">Belum ada permintaan booking</p>
        </div>
      )}
    </div>
  );
}
