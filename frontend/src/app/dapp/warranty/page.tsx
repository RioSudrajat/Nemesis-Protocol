"use client";

import { ShieldCheck, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { useActiveVehicle, vehicleData } from "@/context/ActiveVehicleContext";

const claims = [
  { id: "WC-2026-014", part: "AC Compressor", status: "Approved", date: "2026-03-02", coverage: "Full" },
  { id: "WC-2025-118", part: "Brake Pads (Front)", status: "Resolved", date: "2025-11-22", coverage: "Partial" },
  { id: "WC-2025-072", part: "Battery", status: "Resolved", date: "2025-08-04", coverage: "Full" },
];

export default function DappWarrantyPage() {
  const ctx = useActiveVehicle();
  const v = ctx?.currentVehicleData || vehicleData.avanza;

  return (
    <div>
      <div className="page-header">
        <h1 className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7" style={{ color: "var(--accent)" }} />
          Warranty Claims
        </h1>
        <p>All warranty activities for {v.model} ({v.vin})</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Active Coverage</p>
          <p className="text-2xl font-bold mt-2">3 yrs / 100k km</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Total Claims</p>
          <p className="text-2xl font-bold mt-2">{claims.length}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Approved</p>
          <p className="text-2xl font-bold mt-2" style={{ color: "var(--accent)" }}>
            {claims.filter(c => c.status !== "Pending").length}
          </p>
        </div>
      </div>

      <div className="glass-card-static overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Part</th>
              <th>Date</th>
              <th>Coverage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {claims.map(c => (
              <tr key={c.id}>
                <td className="font-mono text-sm">{c.id}</td>
                <td>{c.part}</td>
                <td className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />{c.date}</td>
                <td>{c.coverage}</td>
                <td>
                  <span className="badge badge-green inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" /> {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
        <FileText className="w-3.5 h-3.5" /> All claims are verified on-chain via the manufacturer registry.
      </p>
    </div>
  );
}
