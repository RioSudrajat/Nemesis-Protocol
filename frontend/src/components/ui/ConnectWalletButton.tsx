"use client";

import { Loader2, LogOut, Wallet } from "lucide-react";
import { useSolanaWallet } from "@/context/SolanaWalletContext";
import { truncateWallet } from "@/lib/yield";

type PortalVariant = "depin" | "workshop" | "operator" | "admin";

const accentMap: Record<PortalVariant, { dot: string; border?: string }> = {
  depin: { dot: "var(--solana-green)" },
  workshop: { dot: "var(--solana-purple)", border: "var(--solana-purple)" },
  operator: { dot: "var(--solana-purple)" },
  admin: { dot: "#5EEAD4", border: "rgba(94, 234, 212,0.5)" },
};

export function ConnectWalletButton({ variant = "depin" }: { variant?: PortalVariant }) {
  const accent = accentMap[variant];
  const { address, connect, disconnect, isConnected, status } = useSolanaWallet();
  const isConnecting = status === "connecting";

  const handleClick = () => {
    if (isConnected) {
      void disconnect();
      return;
    }

    void connect();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className="glow-btn-outline px-4 py-2 text-sm flex items-center gap-2 cursor-pointer transition-colors"
      style={accent.border ? { borderColor: accent.border } : undefined}
      title={isConnected ? "Disconnect wallet" : "Connect Solana wallet"}
    >
      {isConnecting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isConnected ? (
        <LogOut className="w-4 h-4" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: isConnected ? "#86EFAC" : accent.dot }}
      />
      {isConnecting ? "Connecting" : address ? truncateWallet(address) : "Connect Wallet"}
    </button>
  );
}
