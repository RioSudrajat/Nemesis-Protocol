// src/components/landing/BentoStatsSection.tsx
// Server Component — purely static markup
import Image from "next/image";

export default function BentoStatsSection() {
  return (
    <section className="relative w-full bg-[#F4F4F4] py-24 md:py-32 overflow-hidden z-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="mb-6 font-[family-name:var(--font-fraunces)] text-[2.5rem] font-medium leading-tight tracking-tight text-[#111827] md:text-[3.5rem]">
            The Scale of the Opportunity
          </h2>
          <p className="text-[#6B7280] text-[16px] md:text-[18px] max-w-2xl font-medium leading-relaxed">
            NEMESIS Protocol is built to tokenize one of the largest physical infrastructure transitions in Southeast Asia.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:h-[500px]">

          {/* Left Column — Tall Card */}
          <div className="bg-white rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow lg:h-full min-h-[350px]">
            <p className="text-[#111827] text-[15px] font-medium leading-relaxed mb-8">
              NEMESIS provides the financial layer for millions of productive EV operators to access global liquidity, scaling the nation&apos;s fleet without traditional bank debt.
            </p>
            <div className="flex justify-between items-end mt-auto">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden hidden sm:block">
                <Image
                  src="/images/nemesis-vertical.png"
                  alt="Abstract"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="text-right">
                <h3 className="mb-2 font-[family-name:var(--font-fraunces)] text-[3.5rem] font-medium leading-none tracking-tighter text-[#111827]">4.3M</h3>
                <p className="text-[#6B7280] text-[13px] font-medium">Active Ojol Drivers</p>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="flex flex-col gap-6 lg:h-full">
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[#111827] text-[15px] font-medium leading-relaxed">
                Indonesia processes over 100 million e-commerce packages daily. Every single delivery depends on a physical vehicle making a trip.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col justify-between min-h-[250px]">
              <div>
                <h3 className="mb-2 font-[family-name:var(--font-fraunces)] text-[3.5rem] font-medium leading-none tracking-tighter text-[#111827]">13M</h3>
                <p className="text-[#6B7280] text-[13px] font-medium">Govt EV Target by 2030</p>
              </div>
              <h4 className="mt-8 font-[family-name:var(--font-fraunces)] text-[1.35rem] font-semibold leading-snug text-[#111827]">
                A massive transition requiring billions in decentralized capital.
              </h4>
            </div>
          </div>

          {/* Right Column — 3 Small Cards */}
          <div className="flex flex-col md:flex-row lg:flex-col gap-6 lg:h-full md:col-span-2 lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col justify-center">
              <h3 className="mb-2 font-[family-name:var(--font-fraunces)] text-[3.5rem] font-medium leading-none tracking-tighter text-[#111827]">41<span className="text-[2rem]">%</span></h3>
              <p className="text-[#6B7280] text-[13px] font-medium">Max Verifiable APY</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col justify-center">
              <h3 className="mb-2 font-[family-name:var(--font-fraunces)] text-[3.5rem] font-medium leading-none tracking-tighter text-[#111827]">$175<span className="text-[2rem]">M</span></h3>
              <p className="text-[#6B7280] text-[13px] font-medium">IDRX On-Chain Vol.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col justify-center">
              <h3 className="mb-2 font-[family-name:var(--font-fraunces)] text-[3.5rem] font-medium leading-none tracking-tighter text-[#111827]">30<span className="text-[2rem]">K</span></h3>
              <p className="text-[#6B7280] text-[13px] font-medium">Min. Share Price (IDR)</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
