"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "#news", label: "News" },
  { href: "#docs", label: "Docs" },
  { href: "#community", label: "Community" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4 font-[family-name:var(--font-plus-jakarta)] md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between rounded-full border border-black/5 bg-[#F8FFFC]/75 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:px-5">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            onClick={() => setMobileOpen(false)}
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5">
              <Image
                src="/noc_logo.png"
                alt="Nemesis Protocol"
                width={30}
                height={31}
                priority
                className="object-contain"
              />
            </span>
            <span className="font-[family-name:var(--font-plus-jakarta)] text-xl font-semibold tracking-tight text-[#111827] transition-colors group-hover:text-black md:text-2xl">
              NEMESIS<span className="text-[#14B8A6]">×</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-tight text-[#374151] transition-colors hover:text-[#0D9488]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="#protocol-surfaces"
              className="hidden rounded-full bg-[#111827] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-colors hover:bg-black sm:inline-flex"
              onClick={() => setMobileOpen(false)}
            >
              Explore Products
            </Link>
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-controls="marketing-mobile-nav"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/80 text-[#111827] shadow-sm transition-colors hover:bg-white lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div
          id="marketing-mobile-nav"
          className={`mt-3 overflow-hidden rounded-[28px] border border-black/5 bg-[#F8FFFC]/90 shadow-[0_18px_50px_rgba(15,23,42,0.1)] backdrop-blur-xl transition-all duration-300 lg:hidden ${
            mobileOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <div className="grid gap-1 p-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold tracking-tight text-[#374151] transition-colors hover:bg-white hover:text-[#0D9488]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#protocol-surfaces"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-2xl bg-[#111827] px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-black sm:hidden"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
