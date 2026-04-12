"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, CheckCircle2, User, Store } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  open: { color: "#FCD34D", label: "Open" },
  investigating: { color: "#67E8F9", label: "Investigating" },
  resolved: { color: "#86EFAC", label: "Resolved" },
  escalated: { color: "#FCA5A5", label: "Escalated" },
};

const TYPE_LABELS: Record<string, string> = {
  payment: "Payment",
  service_quality: "Service Quality",
  part_authenticity: "Part Authenticity",
  warranty: "Warranty",
};

function formatIDR(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function EnterpriseDisputeDetailPage({ params }: { params: Promise<{ disputeId: string }> }) {
  const { disputeId } = use(params);
  const admin = useAdmin();

  const dispute = useMemo(() => (admin?.disputes || []).find(d => d.id === disputeId) || null, [admin?.disputes, disputeId]);

  if (!dispute) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Scale className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-gray-400 mb-4">Dispute not found.</p>
        <Link href="/enterprise/disputes" className="text-sm underline" style={{ color: "#5EEAD4" }}>Back to Disputes</Link>
      </div>
    );
  }

  const st = STATUS_STYLE[dispute.status] || STATUS_STYLE.open;

  return (
    <div>
      <Link href="/enterprise/disputes" className="inline-flex items-center gap-2 text-sm mb-6 hover:underline" style={{ color: "#5EEAD4" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Disputes
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <Scale className="w-7 h-7" style={{ color: "#5EEAD4" }} />
        <div>
          <h1 className="font-bold text-2xl">Dispute {dispute.id}</h1>
          <div className="flex gap-2 mt-1">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${st.color}15`, color: st.color, border: `1px solid ${st.color}40` }}>
              {st.label}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(94,234,212,0.1)", color: "#5EEAD4" }}>
              {TYPE_LABELS[dispute.type] || dispute.type}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-xs text-gray-400 mb-1">Disputed Amount</p>
          <p className="text-2xl font-bold" style={{ color: "#5EEAD4" }}>{formatIDR(dispute.amountIDR)}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-xs text-gray-400 mb-1">Filed</p>
          <p className="text-lg font-bold">{dispute.createdAt}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-xs text-gray-400 mb-1">Booking Ref</p>
          <p className="mono text-sm">{dispute.bookingId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><User className="w-4 h-4" style={{ color: "#5EEAD4" }} /> User</h3>
          <p className="mono text-xs text-gray-300">{dispute.userWallet}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Store className="w-4 h-4" style={{ color: "#5EEAD4" }} /> Workshop</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-400">Name:</span> <span className="font-medium">{dispute.workshopName}</span></div>
            <div><span className="text-gray-400">ID:</span> <span className="mono text-xs">{dispute.workshopId}</span></div>
          </div>
        </div>
      </div>

      {dispute.status === "resolved" && dispute.resolution && (
        <div className="glass-card p-6 rounded-2xl border" style={{ borderColor: "rgba(134,239,172,0.3)" }}>
          <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-5 h-5" style={{ color: "#86EFAC" }} /><h3 className="text-sm font-semibold">Resolution</h3></div>
          <p className="text-sm text-gray-300">{dispute.resolution}</p>
          {dispute.resolvedAt && <p className="text-xs text-gray-500 mt-2">Resolved: {dispute.resolvedAt}</p>}
        </div>
      )}
    </div>
  );
}
