// src/components/landing/DecisionEasySection.tsx
// Server Component — purely static markup
import Image from "next/image";
import Link from "next/link";

export default function DecisionEasySection() {
  return (
    <section className="relative w-full bg-[#FAFAFA] py-24 md:py-32 overflow-hidden z-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Left Content */}
          <div className="flex flex-col pr-0 lg:pr-12">
            <h2 className="mb-12 max-w-lg font-[family-name:var(--font-fraunces)] text-[3rem] font-medium leading-[1.05] tracking-tight text-[#111827] md:text-[4rem]">
              Bridging the EV financing gap
            </h2>

            <div className="w-full h-[1px] bg-gray-200 mb-12"></div>

            <p className="text-[#6B7280] text-[15px] leading-relaxed mb-10 max-w-md font-medium">
              NEMESIS Protocol connects retail capital directly to productive physical infrastructure, bypassing traditional banking bottlenecks to accelerate Indonesia&apos;s EV transition.
            </p>

            <div>
              <Link href="/fi" className="bg-[#111827] hover:bg-black text-white px-8 py-3.5 rounded-[14px] font-bold text-sm transition-colors shadow-lg shadow-black/10 inline-block text-center">
                Start Investing
              </Link>
            </div>
          </div>

          {/* Right Content (Visuals & Features) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 h-auto sm:h-[600px]">

            {/* Vertical Image Card */}
            <div className="relative w-full h-[400px] sm:h-full rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src="/images/nemesis-vertical.png"
                alt="Abstract Teal Waves"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Text Blocks & Horizontal Image */}
            <div className="flex flex-col justify-between h-full py-2 sm:py-4 gap-8 sm:gap-0">

              {/* Feature 1 */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-[1px] bg-gray-400"></div>
                  <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[#111827]">Fleet Operators</h3>
                </div>
                <p className="text-[#6B7280] text-[13px] md:text-sm leading-relaxed pl-7">
                  Register productive EV assets, attach telemetry, and qualify for verified financing rails without defaulting to bank debt.
                </p>
              </div>

              {/* Feature 2 */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-[1px] bg-gray-400"></div>
                  <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[#111827]">Retail Investors</h3>
                </div>
                <p className="text-[#6B7280] text-[13px] md:text-sm leading-relaxed pl-7">
                  Back verified cashflow products with clear monthly cash yield, principal recovery, and reserve protection.
                </p>
              </div>

              {/* Horizontal Image Card */}
              <div className="relative w-full h-[180px] rounded-[1.5rem] overflow-hidden shadow-xl mt-auto">
                <Image
                  src="/images/nemesis-horizontal.png"
                  alt="Abstract Glass Flow"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
