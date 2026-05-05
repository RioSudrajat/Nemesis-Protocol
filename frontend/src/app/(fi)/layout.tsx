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
        {/* Wallet in top-right of FI portal (no stats bar here, so layout header is correct) */}
        <header className="hidden md:flex justify-end px-6 pt-6 pb-0">
          <ConnectWalletButton variant="fi" />
        </header>
        {children}
      </main>
    </div>
  );
}
