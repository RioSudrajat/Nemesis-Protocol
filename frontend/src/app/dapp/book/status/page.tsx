"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, XCircle, Clock, Loader2, Lock, LockOpen, ShieldCheck,
  Star, MapPin, Calendar, MessageSquare, Car, Search, Wrench, FileText,
  Receipt, Bell, WifiIcon,
} from "lucide-react";
import Link from "next/link";
import { useBooking, type BookingStatus, type SessionType } from "@/context/BookingContext";
import { vehicleData } from "@/context/ActiveVehicleContext";
import { PaymentModal } from "@/components/ui/PaymentModal";

// Steps for each session type
const bookingSteps: { key: BookingStatus[]; label: string; desc: string }[] = [
  { key: ["PENDING"],       label: "Dikirim",  desc: "Menunggu konfirmasi bengkel" },
  { key: ["ACCEPTED"],      label: "Diterima", desc: "Bengkel mengkonfirmasi" },
  { key: ["IN_SERVICE"],    label: "Servis",   desc: "Kendaraan sedang dikerjakan" },
  { key: ["INVOICE_SENT"],  label: "Invoice",  desc: "Invoice diterima" },
  { key: ["PAID", "ANCHORING"], label: "Anchor", desc: "Bengkel menandatangani log on-chain" },
  { key: ["ANCHORED"],      label: "Review",   desc: "Beri ulasan Anda" },
  { key: ["COMPLETED"],     label: "Selesai",  desc: "Servis selesai & tercatat" },
];

const walkinSteps: { key: BookingStatus[]; label: string; desc: string }[] = [
  { key: ["ACCEPTED"],      label: "Tiba",     desc: "Kendaraan terdaftar di bengkel" },
  { key: ["IN_SERVICE"],    label: "Servis",   desc: "Kendaraan sedang dikerjakan" },
  { key: ["INVOICE_SENT"],  label: "Invoice",  desc: "Invoice diterima" },
  { key: ["PAID", "ANCHORING"], label: "Anchor", desc: "Bengkel menandatangani log on-chain" },
  { key: ["ANCHORED"],      label: "Review",   desc: "Beri ulasan Anda" },
  { key: ["COMPLETED"],     label: "Selesai",  desc: "Servis selesai & tercatat" },
];

function getSteps(type: SessionType) {
  return type === "walkin" ? walkinSteps : bookingSteps;
}

function getStepIndex(status: BookingStatus, type: SessionType): number {
  if (status === "REJECTED") return -1;
  return getSteps(type).findIndex(s => s.key.includes(status));
}

// Left sidebar panel
function StatusSidebarPanel({
  status,
  type,
  workshopName,
  workshopAddress,
  bookingDate,
  bookingTime,
  sessionId,
}: {
  status: BookingStatus;
  type: SessionType;
  workshopName: string;
  workshopAddress: string;
  bookingDate: string;
  bookingTime: string;
  sessionId: string;
}) {
  const steps = getSteps(type);
  const stepIndex = getStepIndex(status, type);
  const isRejected = status === "REJECTED";
  const isActive = status !== "COMPLETED" && status !== "REJECTED";

  return (
    <div
      className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 rounded-2xl p-5"
      style={{ background: "rgba(94, 234, 212,0.04)", border: "1px solid rgba(94, 234, 212,0.12)" }}
    >
      {/* Live badge */}
      <div className="flex items-center gap-2 mb-6">
        {isActive ? (
          <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: "rgba(94, 234, 212,0.1)", color: "var(--solana-green)", border: "1px solid rgba(94, 234, 212,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            LIVE
          </span>
        ) : (
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: "rgba(94, 234, 212,0.1)", color: "var(--solana-purple)" }}>
            {isRejected ? "DITOLAK" : "SELESAI"}
          </span>
        )}
        <span className="text-[9px] mono" style={{ color: "var(--solana-text-muted)" }}>
          {type === "walkin" ? "Walk-In" : "Booking"}
        </span>
      </div>

      {/* Vertical stepper */}
      {!isRejected && (
        <div className="flex flex-col gap-0 relative flex-1">
          {steps.map((step, i) => {
            const isDone = i < stepIndex;
            const isCurrent = i === stepIndex;
            const isFuture = i > stepIndex;
            return (
              <div key={step.label} className="flex gap-3">
                {/* Line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10"
                    style={{
                      background: isDone
                        ? "rgba(94, 234, 212,0.15)"
                        : isCurrent
                        ? "var(--solana-gradient)"
                        : "rgba(94, 234, 212,0.06)",
                      border: `2px solid ${isDone ? "var(--solana-green)" : isCurrent ? "transparent" : "rgba(94, 234, 212,0.15)"}`,
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--solana-green)" }} />
                    ) : isCurrent ? (
                      status === "PENDING" ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                          <Loader2 className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )
                    ) : (
                      <span className="text-[9px] font-bold" style={{ color: "rgba(94, 234, 212,0.4)" }}>{i + 1}</span>
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="w-0.5 flex-1 min-h-[28px]"
                      style={{ background: isDone ? "var(--solana-green)" : "rgba(94, 234, 212,0.1)" }}
                    />
                  )}
                </div>
                {/* Label */}
                <div className="pb-6">
                  <p
                    className="text-xs font-semibold leading-tight"
                    style={{ color: isFuture ? "rgba(94, 234, 212,0.3)" : isCurrent ? "white" : "var(--solana-green)" }}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--solana-text-muted)" }}>
                      {step.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isRejected && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
          <XCircle className="w-10 h-10 mb-3" style={{ color: "#FCA5A5" }} />
          <p className="text-sm font-semibold" style={{ color: "#FCA5A5" }}>Booking Ditolak</p>
          <p className="text-[10px] mt-1" style={{ color: "var(--solana-text-muted)" }}>Data kendaraan tidak dibagikan</p>
        </div>
      )}

      {/* Workshop info */}
      <div className="pt-4 border-t" style={{ borderColor: "rgba(94, 234, 212,0.1)" }}>
        <p className="text-[10px] mb-1 font-medium" style={{ color: "var(--solana-text-muted)" }}>Bengkel</p>
        <p className="text-xs font-semibold leading-tight">{workshopName}</p>
        {bookingDate && (
          <p className="text-[10px] mt-1 mono" style={{ color: "var(--solana-purple)" }}>
            {bookingDate} · {bookingTime}
          </p>
        )}
        <p className="text-[10px] mono mt-2" style={{ color: "rgba(94, 234, 212,0.4)" }}>
          #{sessionId.slice(-8)}
        </p>
      </div>
    </div>
  );
}

export default function BookingStatusPage() {
  const ctx = useBooking();
  const booking = ctx?.booking;
  const unreadNotifCount = (ctx?.bookingNotifications || []).filter(n => n.targetRole === "user" && !n.read).length;
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Clock className="w-12 h-12 mb-4 opacity-30" />
        <h2 className="text-xl font-bold mb-2">Belum Ada Sesi Servis</h2>
        <p className="text-sm mb-6" style={{ color: "var(--solana-text-muted)" }}>
          Booking atau tunjukkan QR/NFC ke bengkel untuk memulai
        </p>
        <div className="flex gap-3">
          <Link href="/dapp/book" className="glow-btn px-6 py-2.5 text-sm">Booking Bengkel</Link>
          <Link href="/dapp/qr" className="px-6 py-2.5 text-sm rounded-xl cursor-pointer" style={{ background: "rgba(94, 234, 212,0.1)", color: "var(--solana-purple)", border: "1px solid rgba(94, 234, 212,0.2)" }}>
            <WifiIcon className="w-4 h-4 inline mr-1.5" />QR / NFC
          </Link>
        </div>
      </div>
    );
  }

  const vehicle = vehicleData[booking.form.vehicleKey];
  const stepIndex = getStepIndex(booking.status, booking.type);
  const isRejected = booking.status === "REJECTED";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Status Servis</h1>
          <p className="text-xs mono mt-1" style={{ color: "var(--solana-text-muted)" }}>
            {booking.type === "walkin" ? "Walk-In" : "Booking"} · {booking.id}
          </p>
        </div>
        <Link href="/dapp/notifications" className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors" style={{ color: "var(--solana-text-muted)", border: "1px solid rgba(94, 234, 212,0.15)" }}>
          <Bell className="w-5 h-5" />
          {unreadNotifCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: "var(--solana-purple)", color: "#fff" }}>
              {unreadNotifCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile stepper (horizontal, compact) */}
      {!isRejected && (
        <div className="lg:hidden glass-card p-4 mb-6 overflow-x-auto">
          <div className="flex items-center min-w-max">
            {getSteps(booking.type).map((step, i) => {
              const isDone = i < stepIndex;
              const isCurrent = i === stepIndex;
              return (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: isDone ? "rgba(94, 234, 212,0.15)" : isCurrent ? "var(--solana-gradient)" : "rgba(94, 234, 212,0.06)", border: `2px solid ${isDone ? "var(--solana-green)" : isCurrent ? "transparent" : "rgba(94, 234, 212,0.1)"}` }}>
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--solana-green)" }} /> : isCurrent ? <span className="w-2 h-2 rounded-full bg-white" /> : <span className="text-[9px]" style={{ color: "rgba(94, 234, 212,0.3)" }}>{i+1}</span>}
                    </div>
                    <span className="text-[9px] mt-1 font-medium" style={{ color: i <= stepIndex ? "var(--solana-text)" : "rgba(94, 234, 212,0.3)" }}>{step.label}</span>
                  </div>
                  {i < getSteps(booking.type).length - 1 && (
                    <div className="w-8 h-0.5 mx-1 -mt-4" style={{ background: isDone ? "var(--solana-green)" : "rgba(94, 234, 212,0.1)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main layout: sidebar + content */}
      <div className="flex gap-6">
        {/* Left sidebar (desktop only) */}
        <StatusSidebarPanel
          status={booking.status}
          type={booking.type}
          workshopName={booking.workshop.name}
          workshopAddress={booking.workshop.address}
          bookingDate={booking.form.date}
          bookingTime={booking.form.time}
          sessionId={booking.id}
        />

        {/* Right: main content */}
        <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Status card (spans 3 cols) */}
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* PENDING (booking only) */}
              {booking.status === "PENDING" && booking.type === "booking" && (
                <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: "#FCD34D" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                      <Loader2 className="w-6 h-6" style={{ color: "#FCD34D" }} />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold">Menunggu Konfirmasi</h3>
                      <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Bengkel sedang meninjau permintaan Anda</p>
                    </div>
                  </div>
                  <p className="text-xs mb-4" style={{ color: "var(--solana-text-muted)" }}>
                    Notifikasi akan muncul otomatis saat bengkel mengkonfirmasi atau menolak.
                  </p>
                  <Link href="/dapp/notifications" className="text-xs flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-lg" style={{ background: "rgba(250,204,21,0.05)", color: "#FCD34D", border: "1px solid rgba(250,204,21,0.2)" }}>
                    <Bell className="w-3.5 h-3.5" /> Lihat Notifikasi
                  </Link>
                </div>
              )}

              {/* ACCEPTED */}
              {booking.status === "ACCEPTED" && (
                <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: "var(--solana-green)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6" style={{ color: "var(--solana-green)" }} />
                    <div>
                      <h3 className="font-semibold">
                        {booking.type === "walkin" ? "Kendaraan Terdaftar di Bengkel" : "Booking Diterima!"}
                      </h3>
                      <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>
                        {booking.type === "walkin"
                          ? "Menunggu mekanik tersedia. Anda akan dipanggil saat giliran tiba."
                          : "Bengkel sedang melakukan pre-analisis kendaraan Anda."}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: "rgba(94, 234, 212,0.05)", border: "1px solid rgba(94, 234, 212,0.15)" }}>
                    <p className="text-xs" style={{ color: "var(--solana-green)" }}>
                      {booking.type === "walkin"
                        ? `Data kendaraan Anda telah dibagikan ke ${booking.workshop.name} untuk keperluan servis.`
                        : (booking.form.shareHistory || booking.form.shareDigitalTwin)
                        ? "Bengkel sedang pre-analisis data kendaraan Anda. Datang sesuai jadwal."
                        : `Datang tepat waktu pada ${booking.form.date} pukul ${booking.form.time}`}
                    </p>
                  </div>
                </div>
              )}

              {/* IN_SERVICE */}
              {booking.status === "IN_SERVICE" && (
                <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: "var(--solana-cyan)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Wrench className="w-6 h-6 animate-bounce" style={{ color: "var(--solana-cyan)" }} />
                    <div>
                      <h3 className="font-semibold">Kendaraan Sedang Diservis</h3>
                      <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Mekanik sedang mengerjakan kendaraan Anda</p>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>
                    Invoice akan dikirim setelah servis selesai. Harap menunggu di area bengkel.
                  </p>
                </div>
              )}

              {/* INVOICE_SENT */}
              {booking.status === "INVOICE_SENT" && booking.invoice && (
                <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: "#5EEAD4" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Receipt className="w-6 h-6" style={{ color: "#5EEAD4" }} />
                    <div>
                      <h3 className="font-semibold">Invoice Diterima</h3>
                      <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>{booking.invoice.serviceType} — {booking.workshop.name}</p>
                    </div>
                  </div>
                  <div className="rounded-xl p-4 mb-4 space-y-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(94, 234, 212,0.1)" }}>
                    {booking.invoice.parts.map((part, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span style={{ color: "var(--solana-text-muted)" }}>
                          {part.name} {part.isOEM && <span className="text-[9px] px-1 rounded" style={{ background: "rgba(94, 234, 212,0.1)", color: "var(--solana-green)" }}>OEM</span>}
                        </span>
                        <span className="mono">Rp {part.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2" style={{ borderColor: "rgba(94, 234, 212,0.1)" }}>
                      <div className="flex justify-between text-xs"><span style={{ color: "var(--solana-text-muted)" }}>Biaya Servis</span><span className="mono">Rp {booking.invoice.serviceCost.toLocaleString()}</span></div>
                    </div>
                    <div className="border-t pt-2" style={{ borderColor: "rgba(94, 234, 212,0.1)" }}>
                      <div className="flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span className="gradient-text">Rp {booking.invoice.totalIDR.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  {booking.invoice.mechanicNotes && (
                    <div className="rounded-xl p-3 mb-4 text-xs" style={{ background: "rgba(94, 234, 212,0.05)", border: "1px solid rgba(94, 234, 212,0.1)" }}>
                      <p className="font-medium mb-1">Catatan Mekanik:</p>
                      <p style={{ color: "var(--solana-text-muted)" }}>{booking.invoice.mechanicNotes}</p>
                    </div>
                  )}
                  <button onClick={() => setPaymentOpen(true)} className="glow-btn w-full py-3 text-sm font-semibold cursor-pointer">
                    Bayar Sekarang
                  </button>
                </div>
              )}

              {/* PAID - waiting for workshop sign anchoring */}
              {booking.status === "PAID" && (
                <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: "var(--solana-cyan)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                      <Loader2 className="w-6 h-6" style={{ color: "var(--solana-cyan)" }} />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold">Pembayaran Berhasil ✅</h3>
                      <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Menunggu bengkel menandatangani transaksi anchoring on-chain.</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(0,194,255,0.05)", border: "1px solid rgba(0,194,255,0.15)", color: "var(--solana-cyan)" }}>
                    Bengkel akan menandatangani pembaruan cNFT pada tree enterprise. Setelah selesai, riwayat servis muncul di Service Timeline Anda.
                  </div>
                </div>
              )}

              {/* ANCHORING - in progress */}
              {booking.status === "ANCHORING" && (
                <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: "var(--solana-purple)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                      <Loader2 className="w-6 h-6" style={{ color: "var(--solana-purple)" }} />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold">Anchoring Log Servis ⏳</h3>
                      <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Bengkel sedang menandatangani transaksi pada Solana.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ANCHORED - Review form */}
              {booking.status === "ANCHORED" && !reviewSubmitted && (
                <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: "var(--solana-purple)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-6 h-6" style={{ color: "var(--solana-purple)" }} />
                    <div>
                      <h3 className="font-semibold">Anchoring Selesai ✅</h3>
                      <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Beri review untuk {booking.workshop.name}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs mb-2" style={{ color: "var(--solana-text-muted)" }}>Rating</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} onClick={() => setRating(s)} className="cursor-pointer p-0.5">
                          <Star className="w-7 h-7 transition-colors" style={{ color: s <= rating ? "#FCD34D" : "rgba(94, 234, 212,0.2)", fill: s <= rating ? "#FCD34D" : "none" }} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs mb-2" style={{ color: "var(--solana-text-muted)" }}>Komentar (opsional)</p>
                    <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Ceritakan pengalaman servis Anda..." rows={3} className="w-full px-3 py-2.5 rounded-xl bg-white/5 text-sm outline-none resize-none" style={{ border: "1px solid rgba(94, 234, 212,0.15)", color: "var(--solana-text)" }} />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] mb-4" style={{ color: "var(--solana-green)" }}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Review + service record di-anchor ke Solana dalam 1 transaksi (gas fee sudah termasuk)</span>
                  </div>
                  <button onClick={() => { if (rating > 0) { ctx?.submitReview({ rating, comment: reviewComment, onChainVerified: true }); setReviewSubmitted(true); } }} disabled={rating === 0} className="glow-btn w-full py-2.5 text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    Kirim Review & Selesaikan
                  </button>
                </div>
              )}

              {/* REJECTED */}
              {isRejected && (
                <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: "#FCA5A5" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <XCircle className="w-6 h-6" style={{ color: "#FCA5A5" }} />
                    <div>
                      <h3 className="font-semibold">Booking Ditolak</h3>
                      <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Bengkel tidak dapat menerima booking pada waktu yang dipilih</p>
                    </div>
                  </div>
                  <p className="text-xs mb-4" style={{ color: "var(--solana-text-muted)" }}>Data kendaraan Anda tidak dibagikan kepada bengkel ini.</p>
                  <Link href="/dapp/book" className="glow-btn px-4 py-2 text-xs text-center block cursor-pointer" onClick={() => ctx?.reset()}>
                    <Search className="w-3.5 h-3.5 inline mr-1.5" /> Cari Bengkel Lain
                  </Link>
                </div>
              )}

              {/* COMPLETED */}
              {(booking.status === "COMPLETED" || reviewSubmitted) && (
                <div className="glass-card p-6 border-l-4" style={{ borderLeftColor: "var(--solana-green)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6" style={{ color: "var(--solana-green)" }} />
                    <div>
                      <h3 className="font-semibold">Servis Selesai!</h3>
                      <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>Riwayat servis tercatat di Service Timeline</p>
                    </div>
                  </div>
                  {booking.review && (
                    <div className="p-3 rounded-xl mb-4 flex items-center gap-2" style={{ background: "rgba(94, 234, 212,0.05)", border: "1px solid rgba(94, 234, 212,0.15)" }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--solana-green)" }} />
                      <p className="text-xs" style={{ color: "var(--solana-green)" }}>Review ({booking.review.rating}/5 ⭐) — On-chain anchored ✓</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link href="/dapp/timeline" className="flex-1 py-2 text-xs text-center rounded-xl flex items-center justify-center gap-1.5 cursor-pointer" style={{ background: "rgba(94, 234, 212,0.1)", color: "var(--solana-green)", border: "1px solid rgba(94, 234, 212,0.2)" }}>
                      <FileText className="w-3.5 h-3.5" /> Lihat Timeline
                    </Link>
                    <Link href="/dapp/book" className="flex-1 glow-btn py-2 text-xs text-center block cursor-pointer" onClick={() => ctx?.reset()}>
                      Booking Baru
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Detail panel (spans 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Booking details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
              <h3 className="font-semibold text-sm mb-4">Detail Servis</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--solana-purple)" }} />
                  <div>
                    <p className="text-xs font-medium">{booking.workshop.name}</p>
                    <p className="text-[10px]" style={{ color: "var(--solana-text-muted)" }}>{booking.workshop.address}</p>
                  </div>
                </div>
                {booking.type === "booking" && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 shrink-0" style={{ color: "var(--solana-purple)" }} />
                    <p className="text-xs">{booking.form.date} · {booking.form.time}</p>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Car className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--solana-purple)" }} />
                  <div>
                    <p className="text-xs font-medium">{vehicle.name}</p>
                    <p className="text-[10px] mono" style={{ color: "var(--solana-text-muted)" }}>{vehicle.vin}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--solana-purple)" }} />
                  <p className="text-xs" style={{ color: "var(--solana-text-muted)" }}>{booking.form.complaint}</p>
                </div>
                {booking.type === "booking" && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 shrink-0" style={{ color: "var(--solana-purple)" }} />
                    <div className="text-xs" style={{ color: "var(--solana-text-muted)" }}>
                      Data dibagikan: {booking.form.shareHistory ? "Riwayat " : ""}{booking.form.shareDigitalTwin ? "3D Twin " : ""}{!booking.form.shareHistory && !booking.form.shareDigitalTwin ? "Tidak ada" : ""}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Data access indicator */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {ctx?.dataAccessActive || (booking.type === "walkin" && booking.status !== "COMPLETED" && booking.status !== "PAID") ? (
                <div className="glass-card p-4 border-l-4" style={{ borderLeftColor: "var(--solana-green)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <LockOpen className="w-4 h-4" style={{ color: "var(--solana-green)" }} />
                    <h3 className="text-sm font-semibold" style={{ color: "var(--solana-green)" }}>Akses Data Aktif</h3>
                  </div>
                  <p className="text-[10px]" style={{ color: "var(--solana-text-muted)" }}>
                    Bengkel dapat melihat data kendaraan. Dicabut otomatis setelah servis selesai.
                  </p>
                </div>
              ) : (
                <div className="glass-card p-4 border-l-4" style={{ borderLeftColor: isRejected ? "#FCA5A5" : "rgba(94, 234, 212,0.3)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4" style={{ color: isRejected ? "#FCA5A5" : "var(--solana-text-muted)" }} />
                    <h3 className="text-sm font-semibold" style={{ color: isRejected ? "#FCA5A5" : "var(--solana-text-muted)" }}>
                      {isRejected ? "Akses Ditolak" : "Akses Dicabut"}
                    </h3>
                  </div>
                  <p className="text-[10px]" style={{ color: "var(--solana-text-muted)" }}>
                    {isRejected ? "Data tidak pernah dibagikan ke bengkel." : "Data kendaraan tidak lagi dapat diakses bengkel."}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {booking.invoice && (
        <PaymentModal
          isOpen={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          serviceDetails={{
            serviceName: booking.invoice.serviceType,
            description: `Servis di ${booking.workshop.name}`,
            amountIDR: booking.invoice.totalIDR,
            amountUSDC: Math.round(booking.invoice.totalIDR / 16000 * 100) / 100,
            amountNOC: Math.round(booking.invoice.totalIDR / 52),
            parts: booking.invoice.parts.map((p) => ({
              name: p.name,
              partNumber: p.partNumber,
              manufacturer: p.manufacturer,
              priceIDR: p.price,
              isOem: p.isOEM,
            })),
            serviceCost: booking.invoice.serviceCost,
          }}
          onPaymentComplete={() => { ctx?.payInvoice(); setPaymentOpen(false); }}
        />
      )}
    </div>
  );
}
