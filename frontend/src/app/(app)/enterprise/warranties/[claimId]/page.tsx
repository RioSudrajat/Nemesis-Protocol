"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Car, FileText, CheckCircle2, XCircle, Store, ImageIcon } from "lucide-react";
import { useBookingStore } from "@/store/useBookingStore";

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Pending: { color: "#FCD34D", bg: "rgba(252,211,77,0.15)" },
  Approved: { color: "#86EFAC", bg: "rgba(134,239,172,0.15)" },
  Rejected: { color: "#FCA5A5", bg: "rgba(252,165,165,0.15)" },
};

function formatIDR(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function WarrantyClaimDetailPage({ params }: { params: Promise<{ claimId: string }> }) {
  const { claimId } = use(params);
  const warrantyClaims = useBookingStore(s => s.warrantyClaims);

  const claim = useMemo(() => warrantyClaims.find(c => c.id === claimId) || null, [warrantyClaims, claimId]);

  if (!claim) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Shield className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-gray-400 mb-4">Warranty claim not found.</p>
        <Link href="/enterprise/warranties" className="text-sm underline" style={{ color: "#5EEAD4" }}>Back to Warranties</Link>
      </div>
    );
  }

  const st = STATUS_STYLE[claim.status] || STATUS_STYLE.Pending;

  return (
    <div>
      <Link href="/enterprise/warranties" className="inline-flex items-center gap-2 text-sm mb-6 hover:underline" style={{ color: "#5EEAD4" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Warranties
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <Shield className="w-7 h-7" style={{ color: "#5EEAD4" }} />
        <div>
          <h1 className="font-bold text-2xl">Claim {claim.id}</h1>
          <div className="flex gap-2 mt-1">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}40` }}>
              {claim.status}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(94,234,212,0.1)", color: "#5EEAD4" }}>
              {claim.category}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Car className="w-4 h-4" style={{ color: "#5EEAD4" }} /> Vehicle</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-400">Name:</span> <span className="font-medium">{claim.vehicleName}</span></div>
            <div><span className="text-gray-400">VIN:</span> <span className="mono text-xs">{claim.vin}</span></div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Store className="w-4 h-4" style={{ color: "#5EEAD4" }} /> Submitted By</h3>
          <div className="space-y-3 text-sm">
            <div><span className="text-gray-400">Workshop:</span> <span className="font-medium">{claim.submittedByWorkshopName}</span></div>
            <div><span className="text-gray-400">Workshop ID:</span> <span className="mono text-xs">{claim.submittedByWorkshopId}</span></div>
            <div><span className="text-gray-400">Submitted:</span> <span className="font-medium">{claim.submittedAt}</span></div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl mb-8">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><FileText className="w-4 h-4" style={{ color: "#5EEAD4" }} /> Description</h3>
        <p className="text-sm text-gray-300 leading-relaxed">{claim.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-xs text-gray-400 mb-1">Estimated Amount</p>
          <p className="text-xl font-bold" style={{ color: "#5EEAD4" }}>{formatIDR(claim.estimatedAmountIDR)}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-xs text-gray-400 mb-1">AI Pre-Score</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "rgba(20,20,40,0.5)" }}>
              <div className="h-full rounded-full" style={{ width: `${claim.aiPreScore}%`, background: claim.aiPreScore >= 70 ? "#86EFAC" : claim.aiPreScore >= 40 ? "#FCD34D" : "#FCA5A5" }} />
            </div>
            <span className="font-bold mono text-sm">{claim.aiPreScore}</span>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-xs text-gray-400 mb-1">Booking Ref</p>
          <p className="mono text-sm">{claim.bookingId}</p>
          {claim.resubmissionCount ? <p className="text-xs text-gray-500 mt-1">Resubmissions: {claim.resubmissionCount}</p> : null}
        </div>
      </div>

      {claim.status === "Approved" && claim.reimbursementIDR != null && (
        <div className="glass-card p-6 rounded-2xl mb-8 border" style={{ borderColor: "rgba(134,239,172,0.3)" }}>
          <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-5 h-5" style={{ color: "#86EFAC" }} /><h3 className="text-sm font-semibold">Approved</h3></div>
          <p className="text-sm text-gray-300">Reimbursement: <span className="font-bold" style={{ color: "#86EFAC" }}>{formatIDR(claim.reimbursementIDR)}</span></p>
        </div>
      )}

      {claim.status === "Rejected" && claim.rejectionReason && (
        <div className="glass-card p-6 rounded-2xl mb-8 border" style={{ borderColor: "rgba(252,165,165,0.3)" }}>
          <div className="flex items-center gap-2 mb-2"><XCircle className="w-5 h-5" style={{ color: "#FCA5A5" }} /><h3 className="text-sm font-semibold">Rejected</h3></div>
          <p className="text-sm text-gray-300">{claim.rejectionReason}</p>
        </div>
      )}

      {claim.evidencePhotos.length > 0 && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4" style={{ color: "#5EEAD4" }} /> Evidence Photos</h3>
          <div className="grid grid-cols-3 gap-3">
            {claim.evidencePhotos.map((_, i) => (
              <div key={i} className="aspect-square rounded-xl flex items-center justify-center" style={{ background: "rgba(20,20,40,0.5)", border: "1px solid rgba(94,234,212,0.1)" }}>
                <ImageIcon className="w-8 h-8 opacity-30" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
