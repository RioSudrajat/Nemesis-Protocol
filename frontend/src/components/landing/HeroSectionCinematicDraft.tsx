// Preserved draft of the more cyber/cinematic hero variant.
import { MotionDiv, MotionH1 } from "@/components/ui/motion";
import HeroVehicleBackground from "@/components/landing/HeroVehicleBackground";
import Link from "next/link";

const proofChips = [
  "Proof of Asset",
  "Proof of Activity",
  "Proof of Revenue",
];

const heroMetrics = [
  { label: "Target APY", value: "30-41%" },
  { label: "Settlement", value: "IDRX" },
  { label: "Verification", value: "GPS" },
];

export default function HeroSectionCinematicDraft() {
  return (
    <section className="relative min-h-[96svh] overflow-hidden bg-black text-white">
      <HeroVehicleBackground />

      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.08)_45%,rgba(0,0,0,0.94)_100%)]" />

      <div className="relative z-20 mx-auto flex min-h-[96svh] max-w-[1400px] flex-col px-6 pb-8 pt-32 md:px-12 md:pb-10 md:pt-40">
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap items-center gap-3"
        >
          <span className="h-2 w-2 rounded-full bg-[#5EEAD4] shadow-[0_0_24px_rgba(94,234,212,0.9)]" />
          <span className="font-mono text-xs uppercase text-white/70">
            Live infrastructure finance layer
          </span>
          <span className="hidden h-px w-24 bg-gradient-to-r from-[#5EEAD4] to-transparent md:block" />
        </MotionDiv>

        <div className="mt-auto grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <MotionH1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="max-w-6xl text-[4.25rem] font-medium leading-[0.92] tracking-tighter text-white sm:text-[5.8rem] md:text-[7rem] lg:text-[8.5rem] xl:text-[9.5rem]"
            >
              <span className="block">Tokenized EV</span>
              <span className="block bg-gradient-to-r from-white via-[#CCFBF1] to-[#2DD4BF] bg-clip-text text-transparent">
                Infrastructure
              </span>
            </MotionH1>

            <MotionDiv
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-7 max-w-2xl"
            >
              <p className="text-base font-medium leading-relaxed text-white/80 md:text-lg">
                Fractional shares of real revenue-generating EV infrastructure. Settled in IDRX on Solana, verified by GPS activity, and designed for Indonesia&apos;s productive infrastructure economy.
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                {proofChips.map((chip) => (
                  <span
                    key={chip}
                    className="border border-[#5EEAD4]/25 bg-[#5EEAD4]/10 px-3.5 py-2 font-mono text-[11px] uppercase text-[#CCFBF1] backdrop-blur-md"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/fi"
                  className="inline-flex items-center justify-center bg-white px-6 py-3.5 text-sm font-bold text-black transition-colors hover:bg-[#CCFBF1] sm:min-w-40"
                >
                  Invest Now
                </Link>
                <Link
                  href="/rwa/onboard"
                  className="inline-flex items-center justify-center border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-colors hover:border-[#5EEAD4]/60 hover:bg-[#5EEAD4]/10 sm:min-w-40"
                >
                  Onboard Infrastructure
                </Link>
              </div>
            </MotionDiv>
          </div>

          <MotionDiv
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.35 }}
            className="relative border border-white/15 bg-black/35 p-4 backdrop-blur-xl lg:p-5"
          >
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs uppercase text-white/50">
                Nemesis network
              </span>
              <span className="font-mono text-xs text-[#5EEAD4]">online</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {heroMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="border border-white/10 bg-white/[0.06] p-3"
                >
                  <p className="font-mono text-[10px] uppercase leading-tight text-white/40">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-xl font-black text-white md:text-2xl">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
              <div className="h-10 w-10 rounded-full border border-[#5EEAD4]/30 bg-[#5EEAD4]/10 shadow-[0_0_26px_rgba(94,234,212,0.2)]" />
              <p className="text-sm leading-relaxed text-white/60">
                Three trustless proofs connect the physical EV asset, daily activity, and revenue distribution.
              </p>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
