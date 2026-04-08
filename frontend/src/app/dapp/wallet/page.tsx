"use client";

import { motion } from "framer-motion";
import { Wallet, Rocket } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-24 h-24 rounded-2xl flex items-center justify-center" style={{ background: "rgba(94, 234, 212,0.1)", border: "1px solid rgba(94, 234, 212,0.2)" }}>
          <Wallet className="w-12 h-12" style={{ color: "rgba(94, 234, 212,0.4)" }} />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">Coming Soon</h1>
          <p className="text-sm max-w-md" style={{ color: "var(--solana-text-muted)" }}>
            Fitur $NOC Wallet sedang dalam pengembangan. Nantikan di update selanjutnya.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold" style={{ background: "rgba(94, 234, 212,0.1)", color: "var(--solana-purple)", border: "1px solid rgba(94, 234, 212,0.2)" }}>
          <Rocket className="w-3.5 h-3.5" />
          Coming in v2.0
        </div>

        <div className="glass-card-static p-6 max-w-sm w-full mt-4">
          <h3 className="font-semibold mb-3 text-sm">Yang akan datang:</h3>
          <ul className="text-xs text-left space-y-2" style={{ color: "var(--solana-text-muted)" }}>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--solana-purple)" }} />
              $NOC Token balance & staking
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--solana-green)" }} />
              Token rewards dari servis kendaraan
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--solana-cyan)" }} />
              Swap token via Jupiter Exchange
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--solana-pink)" }} />
              Riwayat transaksi on-chain
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
