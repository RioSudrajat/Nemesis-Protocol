// src/components/landing/Footer.tsx
// Server Component — purely static markup
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden pt-24 lg:pt-32 bg-white flex flex-col justify-between min-h-[600px] md:min-h-[700px] z-10">

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-[140%] bg-gradient-to-b from-transparent via-[#0D9488]/20 to-[#0F766E] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-[80%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#042F2E]/80 via-transparent to-transparent pointer-events-none z-0"></div>

      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 mb-20 lg:mb-32">

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 w-full lg:w-3/5">

            <div className="flex flex-col gap-4">
              <span className="text-[#111827] font-semibold text-[15px]">Protocol</span>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">Marketplace</a>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">Nodes & Data</a>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">Yield Tracking</a>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">Governance</a>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[#111827] font-semibold text-[15px]">Resources</span>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">Whitepaper</a>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">Documentation</a>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">GitHub</a>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">Contracts</a>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[#111827] font-semibold text-[15px]">Company</span>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">About Us</a>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">Careers</a>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">Contact</a>
              <a href="#" className="text-[#4B5563] hover:text-[#050505] text-[14px] transition-colors">Press Kit</a>
            </div>

          </div>

          {/* Right Side */}
          <div className="w-full lg:w-1/3 flex flex-col items-start lg:ml-auto">
            <p className="text-[#111827] text-[15px] font-medium leading-relaxed mb-6 max-w-xs">
              Introducing NEMESIS Protocol, the universal financial layer for Indonesia&apos;s EV infrastructure ecosystem.
            </p>
            <Link
              href="/fi"
              className="bg-[#111827] hover:bg-black text-white px-8 py-3.5 rounded-[12px] font-bold text-sm transition-colors shadow-lg inline-block text-center"
            >
              Launch App
            </Link>
          </div>

        </div>
      </div>

      {/* Huge Bottom Branding Text */}
      <div className="w-full flex justify-center items-end mt-auto pointer-events-none select-none relative z-10">
        <h2 className="translate-y-[12%] font-[family-name:var(--font-fraunces)] text-[28vw] font-semibold leading-[0.75] tracking-tighter text-white opacity-95 md:text-[23vw]">
          NEMESIS
        </h2>
      </div>
    </footer>
  );
}
