// src/components/landing/ProtocolResourcesSection.tsx
const resources = [
  {
    id: "news",
    label: "News",
    title: "Protocol updates",
    body: "Milestones, operator onboarding notes, pool launches, and product announcements will live here.",
    detail: "Coming soon",
  },
  {
    id: "docs",
    label: "Docs",
    title: "Technical materials",
    body: "A concise home for protocol architecture, proof requirements, asset onboarding, and integration references.",
    detail: "Docs hub pending",
  },
  {
    id: "community",
    label: "Community",
    title: "Nemesis network",
    body: "Community channels, contributor updates, and ecosystem links will be connected once official destinations are finalized.",
    detail: "Channels pending",
  },
];

export default function ProtocolResourcesSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-white py-24 text-[#111827] md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#14B8A6]/35 to-transparent" />
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#0F766E]">
              Resources
            </p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-[2.5rem] font-medium leading-[1.04] tracking-tighter text-[#111827] md:text-[4rem]">
              Follow the protocol as it opens up.
            </h2>
          </div>
          <p className="max-w-md text-base font-medium leading-relaxed tracking-tight text-[#64748B]">
            These anchors are ready for official links later, without blocking the current landing flow.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <article
              key={resource.id}
              id={resource.id}
              className="scroll-mt-28 rounded-[2rem] border border-black/5 bg-[#F8FAFC] p-7 shadow-[0_18px_50px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
            >
              <div className="mb-14 flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748B] ring-1 ring-black/5">
                  {resource.label}
                </span>
                <span className="font-[family-name:var(--font-fraunces)] text-5xl font-medium tracking-tighter text-[#CBD5E1]">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mb-4 font-[family-name:var(--font-fraunces)] text-[2rem] font-medium leading-tight tracking-tighter text-[#111827]">
                {resource.title}
              </h3>
              <p className="mb-8 text-[15px] font-medium leading-relaxed tracking-tight text-[#64748B]">
                {resource.body}
              </p>
              <div className="inline-flex rounded-full border border-[#14B8A6]/20 bg-[#ECFEFF] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0F766E]">
                {resource.detail}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
