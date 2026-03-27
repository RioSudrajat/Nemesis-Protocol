"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Star, Shield, CheckCircle2, MapPin, Phone, ExternalLink, ShieldAlert, BadgeCheck, Search, Filter, Settings2, Download, Clock } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const initialWorkshops = [
  { id: 1, name: "Bengkel Hendra Motor", location: "Jakarta Selatan", rating: 4.9, services: 1284, verified: true, oem: true, phone: "0812-XXXX-XXXX", specialization: "Toyota, Daihatsu" },
  { id: 2, name: "Jaya Motor Service", location: "Jakarta Timur", rating: 4.8, services: 968, verified: true, oem: true, phone: "0813-XXXX-XXXX", specialization: "All Brands" },
  { id: 3, name: "AutoCare Express", location: "Surabaya", rating: 4.7, services: 756, verified: true, oem: false, phone: "0821-XXXX-XXXX", specialization: "Honda, Suzuki" },
  { id: 4, name: "Mitra Servis Bandung", location: "Bandung", rating: 4.6, services: 542, verified: true, oem: true, phone: "0856-XXXX-XXXX", specialization: "Toyota, Mitsubishi" },
  { id: 5, name: "Bengkel Mandiri", location: "Medan", rating: 0, services: 421, verified: false, oem: false, phone: "0822-XXXX-XXXX", specialization: "General Service", pendingRef: true },
  { id: 6, name: "Prima Auto Workshop", location: "Semarang", rating: 4.4, services: 318, verified: true, oem: true, phone: "0811-XXXX-XXXX", specialization: "Toyota, Honda" },
];

export default function WorkshopDirectoryPage() {
  const { showToast } = useToast();
  const [workshops, setWorkshops] = useState(initialWorkshops);
  const [filter, setFilter] = useState("all");

  const filtered = workshops.filter(w => {
    if (filter === "verified") return w.verified;
    if (filter === "oem") return w.oem;
    if (filter === "pending") return !w.verified;
    return true;
  });

  const handleVerify = (id: number) => {
    setWorkshops(ws => ws.map(w => w.id === id ? { ...w, verified: true, pendingRef: false } : w));
    showToast("success", "Workshop Verified", "Cryptographic credential issued on-chain to the workshop.");
  };

  const handleRevoke = (id: number) => {
    setWorkshops(ws => ws.map(w => w.id === id ? { ...w, verified: false, oem: false } : w));
    showToast("error", "Credential Revoked", "Workshop can no longer sign verified service logs.");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="page-header mb-0">
          <h1 className="flex items-center gap-3 font-bold text-2xl md:text-3xl">
            <Wrench className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
            Partner Workshops
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>Manage verified mechanic identities and network credentials.</p>
        </div>
        <button className="glow-btn-outline text-sm flex items-center gap-2 py-2 px-4 shadow-lg shadow-purple-500/10">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Network", value: "86", color: "var(--solana-purple)", icon: Wrench },
          { label: "Officially Verified", value: workshops.filter(w => w.verified).length, color: "var(--solana-green)", icon: CheckCircle2 },
          { label: "OEM Certified", value: workshops.filter(w => w.oem).length, color: "var(--solana-cyan)", icon: Shield },
          { label: "Pending KYC", value: workshops.filter(w => !w.verified).length, color: "#FACC15", icon: ShieldAlert },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
            <s.icon className="w-6 h-6 mb-2" style={{ color: s.color }} />
            <p className="text-3xl font-bold mb-1">{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex bg-black/30 p-1 rounded-xl border border-white/5">
          {[
            { id: "all", label: "All Network" },
            { id: "verified", label: "Verified Only" },
            { id: "oem", label: "OEM Certified" },
            { id: "pending", label: "Pending KYC" },
          ].map(f => (
            <button 
              key={f.id} 
              onClick={() => setFilter(f.id)} 
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all" 
              style={{ 
                background: filter === f.id ? "rgba(153,69,255,0.2)" : "transparent", 
                color: filter === f.id ? "#fff" : "var(--solana-text-muted)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search Workshop Name..." className="input-field pl-9 text-sm w-full" />
          </div>
          <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Workshop cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filtered.map((w, i) => (
            <motion.div layout key={w.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }} className="glass-card-static p-6 rounded-2xl border border-white/5 group relative overflow-hidden">
              {/* Management overlay acts on hover */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/50 p-1 rounded-xl backdrop-blur-md border border-white/10">
                {!w.verified ? (
                  <button onClick={() => handleVerify(w.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 bg-green-500/20 text-green-400 hover:bg-green-500/40 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve KYC
                  </button>
                ) : (
                  <button onClick={() => handleRevoke(w.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors">
                    <ShieldAlert className="w-3.5 h-3.5" /> Revoke Credential
                  </button>
                )}
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="font-bold text-lg mb-1">{w.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <MapPin className="w-3.5 h-3.5" /> {w.location}
                  </div>
                </div>
                {w.rating > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full border" style={{ background: "rgba(250,204,21,0.1)", borderColor: "rgba(250,204,21,0.25)" }}>
                    <Star className="w-3.5 h-3.5 text-yellow-400" fill="#FACC15" />
                    <span className="text-sm font-bold text-yellow-400">{w.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {w.verified ? (
                  <span className="badge badge-green flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5" /> Verified Signer</span>
                ) : (
                  <span className="badge flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border-yellow-500/30"><Clock className="w-3.5 h-3.5" /> Pending Approval</span>
                )}
                {w.oem && (
                  <span className="badge badge-purple flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> OEM Certified</span>
                )}
                <span className="badge flex items-center gap-1" style={{ background: "rgba(20,20,40,0.5)", color: "var(--solana-text-muted)", border: "1px solid rgba(153,69,255,0.1)" }}>{w.specialization}</span>
              </div>

              <div className="flex justify-between items-center pt-5 mt-auto border-t border-white/5">
                <div className="flex flex-col">
                  <span className="mono text-lg font-bold text-purple-400 leading-none">{w.services.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Logs Signed</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center justify-center p-2.5 rounded-xl transition-colors hover:bg-white/10" style={{ background: "rgba(255,255,255,0.05)", color: "var(--solana-text-muted)" }}>
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl font-medium transition-colors" style={{ background: "rgba(153,69,255,0.1)", color: "var(--solana-purple)" }}>
                    <ExternalLink className="w-4 h-4" /> View Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-20 px-4 border border-dashed rounded-3xl border-white/20 glass-card-static">
          <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No workshops found</h3>
          <p className="text-gray-400 text-sm">Adjust your filters or search query to find partners.</p>
        </div>
      )}
    </div>
  );
}
