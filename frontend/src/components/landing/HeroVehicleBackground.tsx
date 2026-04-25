import Image from "next/image";

export default function HeroVehicleBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden bg-[linear-gradient(180deg,#F6FFF9_0%,#F1FFF9_54%,#E6FBF3_100%)]">
      <div className="absolute -left-[18vw] top-[12vh] h-[48vh] w-[48vh] rounded-full bg-[#B9F8D7]/70 blur-[120px]" />
      <div className="absolute right-[4vw] top-[4vh] h-[58vh] w-[58vh] rounded-full bg-[#CFFAFE]/70 blur-[140px]" />

      <div className="hero-scene-drift absolute -right-[44vw] top-[13vh] h-[70vh] w-[126vw] opacity-45 sm:-right-[30vw] sm:w-[104vw] md:-right-[18vw] md:top-[7vh] md:h-[82vh] md:w-[82vw] md:opacity-60 lg:-right-[9vw] lg:w-[68vw] xl:-right-[5vw] xl:w-[62vw]">
        <Image
          src="/ev_logistics_bandung_1777118107682.png"
          alt="Electric logistics fleet charging at a Nemesis infrastructure hub"
          fill
          priority
          className="object-cover saturate-[0.92] contrast-[0.96]"
          sizes="(max-width: 768px) 126vw, (max-width: 1280px) 82vw, 62vw"
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_34%,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.44)_26%,transparent_54%),linear-gradient(90deg,#F6FFF9_0%,rgba(246,255,249,0.94)_30%,rgba(246,255,249,0.28)_64%,rgba(246,255,249,0.82)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[28vh] bg-gradient-to-t from-[#D7F8EC] via-[#EFFFF8]/90 to-transparent" />
      <div className="hero-breathe absolute right-[12vw] top-[18vh] h-[42vh] w-[42vh] rounded-full bg-[#5EEAD4]/25 blur-[110px] md:right-[18vw] md:top-[14vh]" />
      <div className="absolute inset-0 opacity-[0.018] hero-grain" />

      <style>{`
        @keyframes heroSceneDrift {
          0%, 100% { transform: scale(1.02) translate3d(0, 0, 0); }
          50% { transform: scale(1.055) translate3d(-1.2%, -0.6%, 0); }
        }

        @keyframes heroBreathe {
          0%, 100% { opacity: 0.2; transform: scale(0.96); }
          50% { opacity: 0.36; transform: scale(1.08); }
        }

        .hero-scene-drift {
          animation: heroSceneDrift 22s ease-in-out infinite;
          mask-image: linear-gradient(90deg, transparent 0%, black 14%, black 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 14%, black 100%);
          transform-origin: center;
          will-change: transform;
        }

        .hero-breathe {
          animation: heroBreathe 9s ease-in-out infinite;
          will-change: opacity, transform;
        }

        .hero-grain {
          background-image: radial-gradient(circle at 30% 20%, #0f172a 0 1px, transparent 1px);
          background-size: 8px 8px;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-scene-drift,
          .hero-breathe {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
