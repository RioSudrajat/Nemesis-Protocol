"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface AppSidebarProps {
  navItems: NavItem[];
  portalName: ReactNode;
  portalLabel: ReactNode;
  infoCard?: ReactNode;
  collapsedIcon?: ReactNode;
  /** Number of nav items to show in mobile header (default: 4) */
  mobileNavCount?: number;
  /**
   * When true, uses inline Tailwind classes for active nav links
   * instead of the .sidebar-link.active CSS class.
   */
  useInlineActiveStyle?: boolean;
  /** Visual theme — 'dark' (default) uses dark surfaces, 'light' uses white surfaces with CSS scope hooks */
  theme?: "dark" | "light";
}

export function AppSidebar({
  navItems,
  portalName,
  portalLabel,
  infoCard,
  collapsedIcon,
  mobileNavCount = 4,
  useInlineActiveStyle = false,
  theme = "dark",
}: AppSidebarProps) {
  const pathname = usePathname();
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);

  const isLight = theme === "light";

  const isNavActive = (item: NavItem) => {
    if (useInlineActiveStyle || isLight) {
      return pathname === item.href || (item.href !== navItems[0]?.href && pathname.startsWith(item.href));
    }
    return pathname === item.href;
  };

  // Style hook: dark keeps the old inline styles; light relies on .theme-light CSS scope in globals.css
  const asideStyle = isLight
    ? undefined
    : {
        background: "var(--solana-dark-2)",
        borderColor: "rgba(94, 234, 212,0.4)",
        boxShadow: "2px 0 20px rgba(0,0,0,0.4)",
        zIndex: 40,
      };

  const mobileHeaderStyle = isLight
    ? undefined
    : {
        background: "rgba(14,14,26,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(94, 234, 212,0.1)",
      };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`app-sidebar hidden md:flex flex-col p-5 relative transition-all duration-300 ease-in-out shrink-0 ${
          isLight ? "h-[calc(100vh-3rem)] sticky top-6 bg-white rounded-2xl shadow-sm border border-zinc-100" : "min-h-screen border-r"
        } ${isLeftCollapsed ? "w-20 items-center" : "w-64"}`}
        style={asideStyle}
      >
        <button
          onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
          className={`app-sidebar-toggle absolute -right-3 top-8 rounded-full p-1.5 z-10 transition-transform hover:scale-110 shadow-md cursor-pointer ${
            isLight ? "" : "text-white"
          }`}
          style={isLight ? undefined : { background: "var(--solana-purple)" }}
        >
          {isLeftCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className={`flex items-center gap-3 mb-8 ${isLeftCollapsed ? "justify-center" : ""}`}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
            <Image src="/noc_logo.png" alt="Nemesis Protocol" width={36} height={36} className="object-contain" />
          </div>
          {!isLeftCollapsed && (
            <span className={`font-bold text-lg whitespace-nowrap overflow-hidden transition-opacity ${isLight ? "text-zinc-900" : ""}`}>
              {portalName}
            </span>
          )}
        </Link>

        {/* Info card / collapsed icon */}
        {!isLeftCollapsed ? (
          infoCard && <div className="mb-6">{infoCard}</div>
        ) : (
          collapsedIcon && <div className="mb-6">{collapsedIcon}</div>
        )}

        {/* Nav links */}
        <nav className={`flex flex-col ${useInlineActiveStyle || isLight ? "gap-1" : "gap-2"} flex-1 w-full`}>
          {navItems.map((item) => {
            const active = isNavActive(item);

            // Light theme: use CSS classes (.app-sidebar-link) scoped via .theme-light
            if (isLight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-colors text-sm ${
                    active ? "bg-teal-50 text-teal-600 font-semibold" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium"
                  } ${isLeftCollapsed ? "justify-center px-0" : "gap-3"}`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!isLeftCollapsed && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );
            }

            if (useInlineActiveStyle) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center p-3 rounded-xl transition-colors ${
                    active
                      ? "bg-teal-500/10 text-teal-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  } ${isLeftCollapsed ? "justify-center" : "gap-3"}`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!isLeftCollapsed && (
                    <span className="whitespace-nowrap text-sm">{item.label}</span>
                  )}
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link flex items-center p-3 rounded-xl transition-colors ${
                  active ? "active" : ""
                } ${isLeftCollapsed ? "justify-center" : "gap-3"}`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isLeftCollapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back link */}
        <Link
          href="/"
          className={`mt-4 flex items-center p-3 rounded-xl transition-colors ${
            isLight
              ? "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 text-sm font-medium"
              : useInlineActiveStyle
              ? "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              : "sidebar-link"
          } ${isLeftCollapsed ? "justify-center" : "gap-3"}`}
        >
          <ChevronLeft className="w-5 h-5 shrink-0" />
          {!isLeftCollapsed && (
            <span className="whitespace-nowrap">
              Back to Home
            </span>
          )}
        </Link>

        {/* Footer links */}
        {isLight && !isLeftCollapsed && (
          <div className="mt-auto pt-6 border-t border-zinc-100 flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-between">
              <Link href="#" className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors">
                <div className="w-5 h-5 bg-[#1DA1F2] rounded-full text-white flex items-center justify-center text-[10px]">𝕏</div>
                Twitter
              </Link>
              <Link href="#" className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 rounded-lg transition-colors">
                <div className="w-5 h-5 bg-[#0088cc] rounded-full text-white flex items-center justify-center text-[10px] pl-[1px]">✈</div>
                Telegram
              </Link>
            </div>
            <div className="flex items-center gap-2 justify-between mt-1 px-1">
              <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">Litepaper</Link>
              <Link href="#" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">ToC</Link>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile header */}
      <div
        className="app-sidebar-mobile md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4"
        style={mobileHeaderStyle}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            <Image src="/noc_logo.png" alt="Nemesis Protocol" width={32} height={32} className="object-contain" />
          </div>
          <span className={`font-bold text-sm ${isLight ? "text-zinc-900" : ""}`}>{portalLabel}</span>
        </Link>
        <div className="flex items-center gap-2">
          {navItems.slice(0, mobileNavCount).map((item) => {
            const active = pathname === item.href;
            if (isLight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`app-sidebar-link p-2 rounded-lg transition-colors ${active ? "active" : ""}`}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="p-2 rounded-lg transition-colors"
                style={{
                  background: active ? "rgba(94, 234, 212,0.15)" : "transparent",
                  color: active ? "var(--solana-green)" : "var(--solana-text-muted)",
                }}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
