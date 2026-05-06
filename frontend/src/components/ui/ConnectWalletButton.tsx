"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Loader2,
  LogOut,
  Wallet,
  Building2,
  Coins,
  Zap,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { useSolanaWallet } from "@/context/SolanaWalletContext";
import { truncateWallet } from "@/lib/yield";

type PortalVariant = "depin" | "fi" | "workshop" | "operator" | "admin";

import { useNemesisStore } from "@/store/useNemesisStore";

/** Mock role resolution — in production this comes from the backend */
interface WalletRole {
  key: string;
  label: string;
  detail: string;
  icon: typeof Building2;
  href: string;
  color: string;
}

function getMockRoles(role: 'investor' | 'operator' | 'super_operator' | null): WalletRole[] {
  const roles: WalletRole[] = [
    {
      key: "investor",
      label: "Investor",
      detail: "2 active pools",
      icon: Coins,
      href: "/fi/portfolio",
      color: "#FCD34D",
    },
    {
      key: "depin",
      label: "DePIN Member",
      detail: "1,250 pts",
      icon: Zap,
      href: "/depin/dashboard",
      color: "#86EFAC",
    },
  ];

  if (role === 'operator' || role === 'super_operator') {
    roles.unshift({
      key: "operator",
      label: role === 'super_operator' ? "Super Operator" : "Operator",
      detail: role === 'super_operator' ? "Nemesis Native" : "Verified Partner",
      icon: Building2,
      href: "/rwa/operator",
      color: "#5EEAD4",
    });
  }

  return roles;
}

const themeMap: Record<PortalVariant, { bg: string; border: string; text: string; dropBg: string; dropBorder: string }> = {
  depin: {
    bg: "rgba(20,184,166,1)",
    border: "rgba(20,184,166,0.3)",
    text: "#FFFFFF",
    dropBg: "rgba(255,255,255,0.97)",
    dropBorder: "rgba(0,0,0,0.08)",
  },
  fi: {
    bg: "rgba(20,184,166,1)",
    border: "rgba(20,184,166,0.3)",
    text: "#FFFFFF",
    dropBg: "rgba(255,255,255,0.97)",
    dropBorder: "rgba(0,0,0,0.08)",
  },
  workshop: {
    bg: "var(--solana-purple)",
    border: "var(--solana-purple)",
    text: "#FFFFFF",
    dropBg: "rgba(18,18,32,0.97)",
    dropBorder: "rgba(94,234,212,0.15)",
  },
  operator: {
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.12)",
    text: "rgba(255,255,255,0.85)",
    dropBg: "rgba(8,10,11,0.97)",
    dropBorder: "rgba(255,255,255,0.1)",
  },
  admin: {
    bg: "rgba(94,234,212,0.1)",
    border: "rgba(94,234,212,0.3)",
    text: "#5EEAD4",
    dropBg: "rgba(18,18,32,0.97)",
    dropBorder: "rgba(94,234,212,0.15)",
  },
};

const isLightVariant = (v: PortalVariant) => v === "depin" || v === "fi";

export function ConnectWalletButton({ variant = "depin" }: { variant?: PortalVariant }) {
  const theme = themeMap[variant];
  const light = isLightVariant(variant);
  const { address, connect, disconnect, isConnected, status } = useSolanaWallet();
  const isConnecting = status === "connecting";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const handleClick = () => {
    if (isConnected) {
      setDropdownOpen((prev) => !prev);
      return;
    }
    void connect().then(() => {
      // Mock setting role on connect
      if (!userRole) {
        setUserRole('super_operator');
      }
    });
  };

  const handleCopy = () => {
    if (address) {
      void navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    setDropdownOpen(false);
    void disconnect();
  };

  const { userRole, setUserRole } = useNemesisStore();
  const roles = getMockRoles(userRole);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Main Button ── */}
      <button
        onClick={handleClick}
        disabled={isConnecting}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl cursor-pointer transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: isConnected
            ? light ? "rgba(20,184,166,0.08)" : "rgba(255,255,255,0.06)"
            : theme.bg,
          border: `1px solid ${isConnected ? (light ? "rgba(20,184,166,0.25)" : "rgba(255,255,255,0.12)") : theme.border}`,
          color: isConnected
            ? light ? "#0F766E" : "rgba(255,255,255,0.85)"
            : theme.text,
          boxShadow: isConnected
            ? "none"
            : light ? "0 4px 14px rgba(20,184,166,0.25)" : "none",
        }}
        title={isConnected ? "Wallet menu" : "Connect Solana wallet"}
      >
        {isConnecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isConnected ? (
          <>
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: "#22C55E", boxShadow: "0 0 6px rgba(34,197,94,0.6)" }}
            />
            <span className="font-mono">{address ? truncateWallet(address) : "Connected"}</span>
            <ChevronDown
              className="w-3.5 h-3.5 transition-transform"
              style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </>
        )}
      </button>

      {/* ── Role-Based Dropdown ── */}
      {dropdownOpen && isConnected && (
        <div
          className="absolute right-0 top-full mt-2 w-[320px] rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{
            background: theme.dropBg,
            border: `1px solid ${theme.dropBorder}`,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Wallet address header */}
          <div
            className="px-4 pt-4 pb-3 border-b"
            style={{ borderColor: light ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: light ? "#94A3B8" : "rgba(255,255,255,0.35)" }}
              >
                Connected Wallet
              </span>
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: "rgba(34,197,94,0.12)",
                  color: "#22C55E",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="font-mono text-sm font-bold"
                style={{ color: light ? "#0F172A" : "#FFFFFF" }}
              >
                {address ? truncateWallet(address) : "—"}
              </span>
              <button
                onClick={handleCopy}
                className="p-1 rounded-md transition-colors"
                style={{
                  background: light ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)",
                  color: light ? "#64748B" : "rgba(255,255,255,0.45)",
                }}
                title="Copy full address"
              >
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          {/* Roles */}
          <div className="px-2 py-2">
            <div
              className="px-2 py-1.5 mb-1 text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: light ? "#94A3B8" : "rgba(255,255,255,0.3)" }}
            >
              Your Roles
            </div>
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Link
                  key={role.key}
                  href={role.href}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group"
                  style={{
                    color: light ? "#0F172A" : "rgba(255,255,255,0.82)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = light ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `${role.color}18`,
                      border: `1px solid ${role.color}30`,
                    }}
                  >
                    <Icon size={15} style={{ color: role.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{role.label}</p>
                    <p
                      className="text-xs"
                      style={{ color: light ? "#94A3B8" : "rgba(255,255,255,0.4)" }}
                    >
                      {role.detail}
                    </p>
                  </div>
                  <ExternalLink
                    size={13}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: light ? "#94A3B8" : "rgba(255,255,255,0.3)" }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Disconnect */}
          <div
            className="px-2 pb-2 pt-1 border-t"
            style={{ borderColor: light ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)" }}
          >
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                color: light ? "#EF4444" : "#FCA5A5",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = light ? "rgba(239,68,68,0.06)" : "rgba(239,68,68,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <LogOut size={15} />
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
