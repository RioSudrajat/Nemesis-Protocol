"use client";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/layout/AppSidebar";
import type { NavItem } from "@/components/layout/AppSidebar";
import { Globe, LayoutDashboard, Trophy, Zap, ArrowLeftRight, Users } from "lucide-react";
import { DriverAuthGuard } from "@/components/depin/DriverAuthGuard";

const ConnectWalletButton = dynamic(
  () =>
    import("@/components/ui/ConnectWalletButton").then((m) => ({
      default: m.ConnectWalletButton,
    })),
  { ssr: false }
);

const NAV_ITEMS: NavItem[] = [
  { href: "/depin", label: "Network", icon: Globe },
  { href: "/depin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/depin/quests", label: "Quests", icon: Trophy },
  { href: "/depin/earn", label: "Earn", icon: Zap },
  { href: "/depin/transactions", label: "Points History", icon: ArrowLeftRight },
  { href: "/depin/referrals", label: "Referrals", icon: Users },
];

export default function DepinLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDriverRoute = pathname?.startsWith("/depin/driver");

  // Driver routes get their own mobile-first layout with auth guard
  if (isDriverRoute) {
    return <DriverAuthGuard>{children}</DriverAuthGuard>;
  }

  return (
    <div className="theme-light flex min-h-screen md:p-6 md:gap-6" style={{ background: "#F4F6F8" }}>
      <AppSidebar
        navItems={NAV_ITEMS}
        portalName="Nemesis DePIN"
        portalLabel="DePIN"
        theme="light"
        mobileNavCount={4}
      />
      <main className="flex-1 min-w-0 pt-16 md:pt-0 flex flex-col">
        {/* Wallet button for DePIN portal — top right, desktop only */}
        <header className="hidden md:flex justify-end p-4 pb-0">
          <ConnectWalletButton variant="depin" />
        </header>
        {children}
      </main>
    </div>
  );
}
