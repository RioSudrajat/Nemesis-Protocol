"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Key, Server, Copy, RefreshCw, EyeOff, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("success", "Copied to clipboard", "API Key copied successfully.");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="flex items-center gap-3 font-bold text-2xl md:text-3xl">
          <Settings className="w-7 h-7" style={{ color: "var(--solana-purple)" }} />
          API & Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--solana-text-muted)" }}>Manage API integrations, ERP/SAP webhooks, and enterprise profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* API Keys */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static p-6 rounded-2xl">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-purple-400" /> API Keys
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--solana-text-muted)" }}>Use these keys to authenticate your existing ERP/SAP systems with the NOC ID protocol.</p>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl border" style={{ borderColor: "rgba(153,69,255,0.2)", background: "rgba(0,0,0,0.2)" }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Production Key</span>
                  <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type={apiKeyVisible ? "text" : "password"} 
                    readOnly 
                    value="pk_live_51MxxxxxNxOcKxxxTz..." 
                    className="flex-1 bg-transparent border-none text-sm mono focus:outline-none" 
                    style={{ color: "var(--solana-text-muted)" }}
                  />
                  <button onClick={() => setApiKeyVisible(!apiKeyVisible)} className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 transition-colors">
                    <EyeOff className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleCopy("pk_live_51MxxxxxNxOcKxxxTz")} className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <button className="mt-4 text-sm font-medium flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
              <RefreshCw className="w-4 h-4" /> Roll API Key
            </button>
          </motion.div>

          {/* Webhooks */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static p-6 rounded-2xl">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-cyan-400" /> Webhooks
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--solana-text-muted)" }}>Configure endpoints to receive real-time updates when vehicles in your fleet get serviced.</p>
            
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--solana-text-muted)" }}>Endpoint URL</label>
              <div className="flex gap-2">
                <input type="url" placeholder="https://api.yourcompany.com/noc-webhooks" className="input-field flex-1" defaultValue="https://api.astra.com/v1/noc-webhooks" />
                <button className="glow-btn-outline px-4">Save</button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-6 rounded-2xl">
            <h3 className="font-semibold mb-4 text-center">Enterprise Profile</h3>
            <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-purple-500/20 border border-purple-500/50 shadow-lg shadow-purple-500/20">
              <span className="text-3xl font-bold text-white">AM</span>
            </div>
            <h4 className="text-center font-bold text-lg">PT Astra Manufacturing</h4>
            <p className="text-center text-sm mb-6" style={{ color: "var(--solana-text-muted)" }}>ID: OEM-10029</p>
            
            <div className="space-y-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--solana-text-muted)" }}>Role</span>
                <span className="flex items-center gap-1 font-medium text-green-400"><ShieldCheck className="w-4 h-4" /> Genesis Minter</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--solana-text-muted)" }}>Plan</span>
                <span className="font-medium text-white">Enterprise Tier</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--solana-text-muted)" }}>Quota Reset</span>
                <span className="font-medium text-white">1st of Month</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
