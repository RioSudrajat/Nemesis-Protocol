"use client";

import { Wallet } from "lucide-react";

type PortalVariant = "depin" | "workshop" | "operator" | "admin";

const accentMap: Record<PortalVariant, { dot: string; border?: string }> = {
  depin: { dot: "var(--solana-green)" },
  workshop: { dot: "var(--solana-purple)", border: "var(--solana-purple)" },
  operator: { dot: "var(--solana-purple)" },
  admin: { dot: "#5EEAD4", border: "rgba(94, 234, 212,0.5)" },
};

export function ConnectWalletButton({ variant = "depin" }: { variant?: PortalVariant }) {
  const accent = accentMap[variant];

  return (
    <button
      className="glow-btn-outline px-4 py-2 text-sm flex items-center gap-2 cursor-pointer transition-colors"
      style={accent.border ? { borderColor: accent.border } : undefined}
    >
      <Wallet className="w-4 h-4" />
      <span className="w-2 h-2 rounded-full" style={{ background: accent.dot }} />
      Connect Wallet
    </button>
  );
}
