// src/components/landing/ProtocolSurfacesSection.tsx
import { BatteryCharging, CircleDollarSign, Network, Route } from "lucide-react";
import Link from "next/link";

const surfaces = [
  {
    href: "/rwa",
    label: "RWA",
    eyebrow: "Asset rails",
    title: "Onboard productive EV infrastructure assets.",
    body: "Register mobility, charging, and energy infrastructure into financing-ready proof rails.",
    accent: "from-[#D7F8EC] to-white",
    Icon: BatteryCharging,
  },
  {
    href: "/fi",
    label: "FI",
    eyebrow: "Cashflow products",
    title: "Access credit pools backed by verified activity.",
    body: "Explore IDRX products built around cash yield, principal recovery, and operator performance.",
    accent: "from-[#ECFEFF] to-white",
    Icon: CircleDollarSign,
  },
  {
    href: "/depin",
    label: "DePIN",
    eyebrow: "Proof network",
    title: "Verify real-world mobility and infrastructure activity.",
    body: "Turn route logs, telemetry, maintenance, and revenue records into protocol-grade proof.",
    accent: "from-[#F0FDFA] to-white",
    Icon: Network,
  },
  {
    href: "/rwa/operator",
    label: "Operators",
    eyebrow: "Fleet control",
    title: "Manage proof, settlement, and maintenance readiness.",
    body: "Run registered fleets through the operator workspace for asset proof and funding eligibility.",
    accent: "from-[#F8FAFC] to-white",
    Icon: Route,
  },
];

export default function ProtocolSurfacesSection() {
  return (
    <section
      id="protocol-surfaces"
      className="relative z-10 w-full scroll-mt-28 overflow-hidden bg-[linear-gradient(180deg,#F5FFF9_0%,#E5FAF2_100%)] py-24 text-[#111827] md:py-32"
    >
      <div className="absolute left-1/2 top-0 h-72 w-[70vw] -translate-x-1/2 rounded-full bg-white/55 blur-3xl" />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#0F766E]">
              Protocol surfaces
            </p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-[2.75rem] font-medium leading-[1.02] tracking-tighter text-[#09111F] md:text-[4.4rem]">
              Explore the Nemesis protocol
            </h2>
          </div>
          <p className="max-w-md text-base font-medium leading-relaxed tracking-tight text-[#4B5563] md:text-lg">
            Product routes now live as intentional entry points, not top-level navbar clutter.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {surfaces.map((surface) => (
            <Link
              key={surface.href}
              href={surface.href}
              className="group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-black/5 bg-white/78 p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#14B8A6]/20 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]"
            >
              <div
                className={`absolute inset-x-0 top-0 h-36 bg-gradient-to-b ${surface.accent} opacity-90 transition-opacity group-hover:opacity-100`}
              />
              <div className="pointer-events-none absolute right-8 top-28 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/35 text-[#0F766E]/10 ring-1 ring-[#0F766E]/5 transition-all duration-300 group-hover:scale-105 group-hover:text-[#0F766E]/15">
                <surface.Icon className="h-9 w-9" strokeWidth={1.6} aria-hidden="true" />
              </div>
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <span className="rounded-full border border-black/5 bg-white/65 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748B]">
                      {surface.eyebrow}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F172A] text-white shadow-lg shadow-black/10 transition-transform group-hover:translate-x-1">
                      <surface.Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-fraunces)] text-[2rem] font-medium leading-[1.05] tracking-tighter text-[#111827]">
                    {surface.title}
                  </h3>
                </div>
                <div>
                  <p className="mb-7 text-[15px] font-medium leading-relaxed tracking-tight text-[#64748B]">
                    {surface.body}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-[#0F766E]">
                    Open {surface.label}
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
