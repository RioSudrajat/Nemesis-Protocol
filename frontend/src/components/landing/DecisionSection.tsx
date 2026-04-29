// src/components/landing/DecisionSection.tsx
// Server Component — purely static markup, no client JS needed
import Link from "next/link";

export default function DecisionSection() {
  return (
    <section className="relative w-full text-black py-32 z-10" style={{ backgroundColor: "#F4F4F4" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
          <h2 className="max-w-xl font-[family-name:var(--font-fraunces)] text-[3rem] font-medium leading-[1.05] tracking-tighter text-[#111827] md:text-[4rem]">
            A transparent new way to invest in physical infrastructure
          </h2>
          <div className="max-w-xs flex flex-col items-start text-left lg:mt-4">
            <p className="text-[#4B5563] text-[15px] leading-relaxed tracking-tight mb-6 font-medium">
              There is no accessible, asset-backed investment product tied to productive EVs in Indonesia. Until now.
            </p>
            <Link href="/fi" className="bg-[#111827] hover:bg-black text-white px-7 py-3 rounded-xl font-bold text-sm transition-colors text-center">
              Browse Fleet Pools
            </Link>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" style={{ gridAutoRows: "300px" }}>

          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer">
            <h3 className="font-[family-name:var(--font-fraunces)] text-[22px] font-semibold leading-snug tracking-tight text-[#111827]">Fractional<br />Ownership</h3>
            <p className="text-[#6B7280] text-[14px] font-medium leading-relaxed">
              Purchase shares of revenue-generating EV fleets using IDRX. Minimum 30,000 IDRX per share.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer">
            <p className="text-[#6B7280] text-[14px] font-medium leading-relaxed">
              Earn 30–41.6% APY in weekly passive income directly from real operational revenue.
            </p>
            <h3 className="font-[family-name:var(--font-fraunces)] text-[22px] font-semibold leading-snug tracking-tight text-[#111827]">Verifiable<br />Yield</h3>
          </div>

          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer">
            <h3 className="font-[family-name:var(--font-fraunces)] text-[22px] font-semibold leading-snug tracking-tight text-[#111827]">Proof of<br />Activity</h3>
            <p className="text-[#6B7280] text-[14px] font-medium leading-relaxed">
              Every trip, kilometer, and maintenance event is anchored on-chain by GPS nodes. No trust required.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer">
            <p className="text-[#6B7280] text-[14px] font-medium leading-relaxed">
              Automated 70/20/7/3 distribution logic via Anchor smart contracts on Solana. Zero middlemen.
            </p>
            <h3 className="font-[family-name:var(--font-fraunces)] text-[22px] font-semibold leading-snug tracking-tight text-[#111827]">Smart Contract<br />Automation</h3>
          </div>

        </div>
      </div>
    </section>
  );
}
