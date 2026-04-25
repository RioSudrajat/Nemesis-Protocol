// src/components/landing/FinalCtaSection.tsx
// Server Component — purely static markup
import Image from "next/image";
import Link from "next/link";

export default function FinalCtaSection() {
  return (
    <section className="relative w-full bg-white py-24 md:py-32 z-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        <div className="relative w-full bg-[#050505] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden p-10 md:p-16 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 border border-white/5 shadow-2xl">

          {/* Background blobs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2DD4BF] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#3B82F6] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

          <div className="absolute top-0 right-0 w-64 h-64 opacity-40 mix-blend-screen pointer-events-none translate-x-1/4 -translate-y-1/4 hidden md:block">
            <Image src="/images/nemesis-horizontal.png" alt="Glass Decor" fill sizes="256px" className="object-cover" />
          </div>

          {/* Left Content */}
          <div className="relative z-10 flex flex-col items-start w-full lg:w-3/5">
            <h2 className="text-[3rem] md:text-[4.5rem] font-medium leading-[1.05] tracking-tight text-white mb-8 max-w-2xl">
              Own a Share of <br />
              Indonesia&apos;s Electric <br />
              Future.
            </h2>
            <p className="text-gray-400 text-[15px] md:text-[17px] max-w-xl leading-relaxed mb-10 font-medium">
              Join the first DePIN protocol in Southeast Asia providing direct weekly yield from physical EV infrastructure.
            </p>
            <Link href="/fi" className="bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#050505] px-8 py-4 rounded-[14px] font-bold text-sm md:text-base transition-colors shadow-[0_0_20px_rgba(45,212,191,0.3)] inline-block text-center">
              Invest in Fleet Pools
            </Link>
          </div>

          {/* Right Content — Floating Card */}
          <div className="relative z-10 w-full lg:w-2/5 flex justify-center lg:justify-end">
            <div className="bg-white rounded-3xl p-3 shadow-2xl md:rotate-2 hover:rotate-0 transition-transform duration-500 w-full sm:w-[320px] md:w-[360px]">
              <div className="relative w-full h-[220px] md:h-[260px] rounded-2xl overflow-hidden mb-4 bg-black">
                <Image
                  src="/images/nemesis-glass-cube.png"
                  alt="NEMESIS Protocol Cube"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="px-3 pb-3">
                <p className="text-[#111827] text-base font-semibold tracking-tight">NEMESIS Protocol</p>
                <p className="text-gray-500 text-[13px] leading-relaxed mt-1">Bridging RWA and DePIN to create a new dimension of utility.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
