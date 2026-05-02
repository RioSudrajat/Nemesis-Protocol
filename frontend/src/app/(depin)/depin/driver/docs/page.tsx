"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  Clock,
  Upload,
  Camera,
  AlertTriangle,
  Navigation,
  ClipboardList,
} from "lucide-react";

type DocStatus = "verified" | "pending" | "empty";

type Doc = {
  label: string;
  note: string;
  status: DocStatus;
  icon: React.ReactNode;
  action: string;
};

const docs: Doc[] = [
  {
    label: "KTP",
    note: "Diupload 5 hari lalu",
    status: "verified",
    icon: <FileText size={24} style={{ color: "#5EEAD4" }} />,
    action: "Lihat Dokumen",
  },
  {
    label: "SIM",
    note: "Uploaded 2 hari lalu",
    status: "pending",
    icon: <FileText size={24} style={{ color: "#F59E0B" }} />,
    action: "Lihat",
  },
  {
    label: "Selfie + KTP",
    note: "Foto kamu sambil pegang KTP",
    status: "empty",
    icon: <Camera size={24} style={{ color: "#888" }} />,
    action: "Upload",
  },
];

function StatusBadge({ status }: { status: DocStatus }) {
  if (status === "verified") {
    return (
      <span className="badge badge-green text-xs inline-flex items-center gap-1">
        <CheckCircle2 size={12} /> Terverifikasi
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span
        className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full"
        style={{
          background: "rgba(245,158,11,0.15)",
          color: "#F59E0B",
          border: "1px solid rgba(245,158,11,0.4)",
        }}
      >
        <Clock size={12} /> Pending
      </span>
    );
  }
  return (
    <span
      className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full"
      style={{
        background: "rgba(156,163,175,0.15)",
        color: "#9CA3AF",
        border: "1px solid rgba(156,163,175,0.4)",
      }}
    >
      <Upload size={12} /> Belum Upload
    </span>
  );
}

export default function DriverDocsPage() {
  const pathname = usePathname();

  const navItems = [
    { href: "/depin/driver", label: "Tracker", icon: Navigation },
    { href: "/depin/driver/routes", label: "Routes", icon: ClipboardList },
    { href: "/depin/driver/docs", label: "Docs", icon: FileText },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: "#0a0e17", color: "#E4E6EB" }}>
      <div className="max-w-[480px] mx-auto p-4">
        <h1 className="text-xl font-bold font-[family-name:var(--font-orbitron)] text-white mb-6 pt-4 flex items-center gap-2">
          <FileText size={22} style={{ color: "#5EEAD4" }} />
          KYC Documents
        </h1>

        {/* Overall status banner */}
        <div
          className="rounded-2xl p-4 mb-6 flex items-start gap-3"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
        >
          <AlertTriangle size={22} style={{ color: "#F59E0B" }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-100">Status: Pending Verification</p>
            <p className="text-xs text-amber-200/80 mt-1">
              1 of 3 documents still being processed.
            </p>
          </div>
        </div>

        {/* Document cards */}
        <div className="space-y-3 mb-6">
          {docs.map((d, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {d.icon}
                  <div>
                    <h3 className="text-base font-bold text-white">{d.label}</h3>
                    <p className="text-xs text-white/40 mt-0.5">{d.note}</p>
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>
              <button
                className={
                  d.status === "empty"
                    ? "glow-btn w-full text-sm py-2"
                    : "glow-btn-outline w-full text-sm py-2"
                }
              >
                {d.action}
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/30 text-center">
          Verification usually takes 1-2 business days
        </p>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto" style={{ background: "rgba(10,14,23,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(94,234,212,0.12)" }}>
        <div className="grid grid-cols-3 text-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="py-3 flex flex-col items-center gap-0.5">
                <Icon size={20} style={{ color: isActive ? "#5EEAD4" : "#71717A" }} />
                <span className="text-[10px] font-medium" style={{ color: isActive ? "#5EEAD4" : "#71717A" }}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
