import type { BookingStatus } from "@/types/booking";

/** Booking status display config (workshop portal) */
export const BOOKING_STATUS_MAP: Record<BookingStatus, { bg: string; color: string; label: string }> = {
  PENDING:      { bg: "rgba(250,204,21,0.1)",   color: "#FCD34D",              label: "Menunggu" },
  ACCEPTED:     { bg: "rgba(94, 234, 212,0.1)",  color: "#5EEAD4",              label: "Diterima" },
  REJECTED:     { bg: "rgba(239,68,68,0.1)",     color: "#FCA5A5",              label: "Ditolak" },
  IN_SERVICE:   { bg: "rgba(20,209,255,0.1)",    color: "var(--solana-cyan)",    label: "Dalam Servis" },
  INVOICE_SENT: { bg: "rgba(94, 234, 212,0.1)",  color: "#5EEAD4",              label: "Invoice Terkirim" },
  PAID:         { bg: "rgba(94, 234, 212,0.1)",  color: "#5EEAD4",              label: "Dibayar" },
  ANCHORING:    { bg: "rgba(192,132,252,0.1)",   color: "#C084FC",              label: "Anchoring" },
  ANCHORED:     { bg: "rgba(134,239,172,0.1)",   color: "#86EFAC",              label: "Anchored" },
  COMPLETED:    { bg: "rgba(94, 234, 212,0.1)",  color: "#5EEAD4",              label: "Selesai" },
};

/** Dispute type labels */
export const DISPUTE_TYPE_LABELS: Record<string, string> = {
  payment: "Payment Dispute",
  service_quality: "Service Quality",
  part_authenticity: "Part Authenticity",
  warranty: "Warranty Claim",
};

/** Dispute status display config */
export const DISPUTE_STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  open:          { color: "#FCD34D", bg: "rgba(250,204,21,0.15)",  label: "Open" },
  investigating: { color: "#67E8F9", bg: "rgba(103,232,249,0.15)", label: "Investigating" },
  resolved:      { color: "#86EFAC", bg: "rgba(134,239,172,0.15)", label: "Resolved" },
  escalated:     { color: "#FCA5A5", bg: "rgba(252,165,165,0.15)", label: "Escalated" },
};

/** Warranty claim status display config */
export const WARRANTY_STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  Pending:  { color: "#FCD34D", bg: "rgba(252,211,77,0.15)" },
  Approved: { color: "#86EFAC", bg: "rgba(134,239,172,0.15)" },
  Rejected: { color: "#FCA5A5", bg: "rgba(252,165,165,0.15)" },
};
