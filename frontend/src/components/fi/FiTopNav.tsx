"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const ConnectWalletButton = dynamic(
  () => import("@/components/ui/ConnectWalletButton").then((m) => ({ default: m.ConnectWalletButton })),
  { ssr: false }
);

const NAV_ITEMS = [
  { href: "/fi/pools", label: "EV Assets" },
  { href: "/fi/portfolio", label: "Portfolio" },
  { href: "/fi/stake", label: "Future $NMS" },
];

export function FiTopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 px-4 py-4 md:px-8 bg-[#F4F5F6]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.5rem] border border-zinc-950/10 bg-white px-4 py-3 shadow-sm md:px-5">
        {/* Logo + wordmark */}
        <Link href="/fi" className="flex items-center gap-2.5" aria-label="Nemesis FI home">
          <Image
            src="/noc_logo.png"
            alt="Nemesis FI"
            width={36}
            height={36}
            className="rounded-xl"
            priority
          />
          <span className="text-sm font-black tracking-tight text-zinc-950">Nemesis FI</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href === "/fi/pools" && pathname.startsWith("/fi/pools"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Wallet button */}
        <div className="hidden md:block">
          <ConnectWalletButton variant="fi" />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-2xl border border-zinc-950/10 text-zinc-700 md:hidden"
          aria-label="Toggle FI navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-[1.5rem] border border-zinc-950/10 bg-white p-3 shadow-sm md:hidden">
          <div className="grid gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href === "/fi/pools" && pathname.startsWith("/fi/pools"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                    active ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-3 border-t border-zinc-950/10 pt-3">
            <ConnectWalletButton variant="fi" />
          </div>
        </div>
      )}
    </div>
  );
}
