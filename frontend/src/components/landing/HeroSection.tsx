// src/components/landing/HeroSection.tsx
import HeroVehicleBackground from "@/components/landing/HeroVehicleBackground";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F5FFF9] text-[#111827]">
      <HeroVehicleBackground />

      <div className="relative z-20 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 pb-16 pt-32 md:px-12 md:pb-20 md:pt-36">
        <div className="max-w-[760px]">
          <p className="mb-10 max-w-sm text-[15px] font-medium leading-relaxed tracking-tight text-[#4B5563] md:text-base">
            Real-world EV infrastructure, tokenized into transparent on-chain ownership.
          </p>
        </div>

        <div className="max-w-5xl">
          <h1 className="font-[family-name:var(--font-fraunces)] text-[3.85rem] font-medium leading-[0.95] tracking-tighter text-[#09111F] sm:text-[5.25rem] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[8.25rem]">
            <span className="block">Tokenized EV</span>
            <span className="block">Infrastructure</span>
          </h1>

          <div className="mt-9 max-w-2xl">
            <p className="text-base font-medium leading-relaxed tracking-tight text-[#374151] md:text-lg">
              Own revenue-generating EV infrastructure through a transparent protocol, settled in IDRX and verified by real-world activity.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/fi"
                className="inline-flex items-center justify-center rounded-[14px] bg-[#111827] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-colors hover:bg-black sm:min-w-44"
              >
                Start Investing
              </Link>
              <Link
                href="/rwa/onboard"
                className="inline-flex items-center justify-center rounded-[14px] bg-[#B9F8D7] px-8 py-3.5 text-sm font-bold text-[#07140F] shadow-[0_10px_22px_rgba(20,184,166,0.18)] transition-colors hover:bg-[#A7F3D0] sm:min-w-44"
              >
                Onboard Infrastructure
              </Link>
            </div>

            <p className="mt-6 text-sm font-medium tracking-tight text-[#6B7280]">
              IDRX settlement · GPS-verified activity · Revenue-backed pools
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
