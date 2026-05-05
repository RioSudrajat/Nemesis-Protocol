"use client";
import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/layout/AppSidebar";
import type { NavItem } from "@/components/layout/AppSidebar";
import { Layers, Wallet, Zap } from "lucide-react";

const ConnectWalletButton = dynamic(
  () =>
    import("@/components/ui/ConnectWalletButton").then((m) => ({
      default: m.ConnectWalletButton,
    })),
  { ssr: false }
);

const NAV_ITEMS: NavItem[] = [
  { href: "/fi", label: "Pools", icon: Layers },
  { href: "/fi/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/fi/stake", label: "Future $NMS", icon: Zap },
];

export default function FiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-light flex min-h-screen" style={{ background: "#FAFAFA" }}>
      <AppSidebar
        navItems={NAV_ITEMS}
        portalName="Nemesis FI"
        portalLabel="FI"
        theme="light"
        mobileNavCount={3}
      />
      <main className="flex-1 min-w-0 pt-16 md:pt-0 flex flex-col">
        {/* Wallet button for FI portal — top right, desktop only */}
        <header className="hidden md:flex justify-end p-4 pb-0">
          <ConnectWalletButton variant="depin" />
        </header>
        {children}
      </main>
    </div>
  );
}
