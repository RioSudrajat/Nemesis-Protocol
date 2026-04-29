// src/components/landing/TokenomicsSection.tsx
// Server Component — CSS animation defined in globals.css, no client APIs needed.
import Image from "next/image";
import Link from "next/link";

export default function TokenomicsSection() {
  return (
    <section id="tokenomics" className="relative w-full bg-[#F1F1F1] overflow-hidden z-10 min-h-[700px] md:min-h-[780px]">

      {/* 3D Background Image — Static to prevent GPU repaint lag */}
      <div
        className="absolute top-0 right-[-5%] md:right-0 w-[75%] md:w-[55%] h-full pointer-events-none"
      >
        <Image
          src="/images/nms-node-3d.png"
          alt="$NMS 3D Node"
          fill
          sizes="(max-width: 768px) 75vw, 55vw"
          className="object-contain object-right"
          priority
        />
      </div>

      {/* Floating overlay text — top right, only desktop */}
      <div className="absolute top-10 right-[6%] text-right z-20 hidden lg:block">
        <p className="max-w-[250px] font-[family-name:var(--font-fraunces)] text-[1.6rem] font-light leading-[1.15] tracking-tight text-[#BDBDBD]">
          Governance.<br />Yield Multipliers.<br />Data Marketplace.
        </p>
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 h-full flex flex-col justify-between py-24 md:py-32 min-h-[700px] md:min-h-[780px]">

        {/* Top: body text + CTA */}
        <div className="max-w-[340px]">
          <p className="text-[#6B7280] text-[15px] leading-relaxed mb-8 font-medium">
            The native $NMS token enables protocol governance, unlocks 2.0x IDRX yield multipliers, provides enterprise fleet data access, and ensures economic alignment through continuous buybacks.
          </p>
          <Link href="#tokenomics" className="bg-[#111827] hover:bg-black text-white px-8 py-3.5 rounded-[14px] font-bold text-sm transition-colors shadow-lg shadow-black/10 inline-block cursor-pointer">
            Learn Tokenomics
          </Link>
        </div>

        {/* Bottom: big heading */}
        <div className="pt-16">
          <h2 className="font-[family-name:var(--font-fraunces)] text-[2.75rem] font-medium leading-[1.0] tracking-[-0.04em] text-[#111827] md:text-[4.5rem] lg:text-[5.5rem]">
            $NMS aligns<br />incentives across<br />
            <span className="text-[#BDBDBD]">the entire network.</span>
          </h2>
        </div>

      </div>
    </section>
  );
}
