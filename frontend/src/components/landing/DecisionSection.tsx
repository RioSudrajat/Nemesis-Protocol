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
            A transparent way to finance productive EV infrastructure
          </h2>
          <div className="max-w-xs flex flex-col items-start text-left lg:mt-4">
            <p className="text-[#4B5563] text-[15px] leading-relaxed tracking-tight mb-6 font-medium">
              Productive EV infrastructure is underfinanced, even when its activity and collections can be measured every day.
            </p>
            <Link href="/fi" className="bg-[#111827] hover:bg-black text-white px-7 py-3 rounded-xl font-bold text-sm transition-colors text-center">
              Browse Fleet Pools
            </Link>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" style={{ gridAutoRows: "300px" }}>

          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer">
            <h3 className="font-[family-name:var(--font-fraunces)] text-[22px] font-semibold leading-snug tracking-tight text-[#111827]">Mobility Credit<br />Pools</h3>
            <p className="text-[#6B7280] text-[14px] font-medium leading-relaxed">
              Fund ride-hailing, delivery, and cargo EV bikes through 36-month rent-to-own pool products.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer">
            <p className="text-[#6B7280] text-[14px] font-medium leading-relaxed">
              Investors receive periodic cash yield and principal recovery from verified rental collections.
            </p>
            <h3 className="font-[family-name:var(--font-fraunces)] text-[22px] font-semibold leading-snug tracking-tight text-[#111827]">Cashflow<br />Products</h3>
          </div>

          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer">
            <h3 className="font-[family-name:var(--font-fraunces)] text-[22px] font-semibold leading-snug tracking-tight text-[#111827]">Proof of<br />Activity</h3>
            <p className="text-[#6B7280] text-[14px] font-medium leading-relaxed">
              Route logs, active usage hours, collection health, and maintenance events turn physical activity into proof data.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer">
            <p className="text-[#6B7280] text-[14px] font-medium leading-relaxed">
              The same proof rails can later expand from mobility into charging, swap, solar, and storage assets.
            </p>
            <h3 className="font-[family-name:var(--font-fraunces)] text-[22px] font-semibold leading-snug tracking-tight text-[#111827]">Infrastructure<br />Expansion</h3>
          </div>

        </div>
      </div>
    </section>
  );
}
