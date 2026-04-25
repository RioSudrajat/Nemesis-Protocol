// src/components/landing/ScaleSection.tsx
// Server Component — uses Motion wrappers for whileInView animations
import { MotionDiv } from "@/components/ui/motion";
import Link from "next/link";

export default function ScaleSection() {
  return (
    <section className="relative w-full bg-[linear-gradient(180deg,#D7F8EC_0%,#FFFFFF_30%,#FFFFFF_100%)] text-black pt-32 pb-48 z-10">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col xl:flex-row xl:items-center gap-16 xl:gap-8">

        {/* Left: Text Content */}
        <div className="w-full xl:w-5/12 flex flex-col items-start xl:pr-8">
          <h2 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-medium leading-[1.05] tracking-tighter text-[#111827] mb-8">
            Transforming productive EVs<br className="hidden md:block" />
            into yield-generating assets
          </h2>
          <p className="text-[#4B5563] text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-medium tracking-tight">
            NEMESIS is the universal protocol layer for Indonesia&apos;s EV infrastructure ecosystem. Any physical asset that generates revenue can be tokenized, invested in, and yield-distributed on-chain.
          </p>
          <Link
            href="/fi"
            className="bg-[#14B8A6] hover:bg-[#0D9488] text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-colors shadow-[0_10px_20px_rgba(20,184,166,0.3)] inline-flex items-center gap-2"
          >
            Explore Fleet Pools
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Right: Yield Progression Cards */}
        <div className="w-full xl:w-7/12 flex flex-row items-end gap-3 sm:gap-4 h-[350px] sm:h-[450px]">

          {/* Card 1 — 75% */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="w-1/4 bg-[#FAFAFA] rounded-t-[20px] sm:rounded-t-[32px] rounded-b-[12px] p-4 sm:p-6 lg:p-8 border border-gray-100 h-[55%] flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-gray-400 font-semibold tracking-tight text-[10px] sm:text-xs uppercase relative z-10">75% Util.</span>
            <div className="relative z-10">
              <div className="text-[#6B7280] text-[11px] sm:text-[13px] font-medium tracking-tight leading-tight mb-1">Base Fleet APY</div>
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tighter text-[#111827]">30.0%</h3>
            </div>
          </MotionDiv>

          {/* Card 2 — 80% */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="w-1/4 bg-[#FAFAFA] rounded-t-[20px] sm:rounded-t-[32px] rounded-b-[12px] p-4 sm:p-6 lg:p-8 border border-gray-100 h-[70%] flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-gray-400 font-semibold tracking-tight text-[10px] sm:text-xs uppercase relative z-10">80% Util.</span>
            <div className="relative z-10">
              <div className="text-[#6B7280] text-[11px] sm:text-[13px] font-medium tracking-tight leading-tight mb-1">Active Fleet</div>
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tighter text-[#111827]">33.3%</h3>
            </div>
          </MotionDiv>

          {/* Card 3 — 90% */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="w-1/4 bg-[#FAFAFA] rounded-t-[20px] sm:rounded-t-[32px] rounded-b-[12px] p-4 sm:p-6 lg:p-8 border border-gray-100 h-[85%] flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-gray-400 font-semibold tracking-tight text-[10px] sm:text-xs uppercase relative z-10">90% Util.</span>
            <div className="relative z-10">
              <div className="text-[#6B7280] text-[11px] sm:text-[13px] font-medium tracking-tight leading-tight mb-1">Optimized Fleet</div>
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tighter text-[#111827]">38.4%</h3>
            </div>
          </MotionDiv>

          {/* Card 4 — 100% (Target) */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className="w-1/4 bg-gradient-to-t from-[#0F766E] to-[#14B8A6] rounded-t-[20px] sm:rounded-t-[32px] rounded-b-[12px] p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-[0_20px_40px_rgba(20,184,166,0.3)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl translate-y-1/3 -translate-x-1/4" />
            <span className="text-teal-100 font-semibold tracking-tight text-[10px] sm:text-xs uppercase relative z-10">100% Util.</span>
            <div className="relative z-10">
              <div className="text-white/90 text-[11px] sm:text-[13px] font-medium tracking-tight leading-tight mb-1">Max Efficiency</div>
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-white">41.6%</h3>
            </div>
          </MotionDiv>

        </div>
      </div>
    </section>
  );
}
