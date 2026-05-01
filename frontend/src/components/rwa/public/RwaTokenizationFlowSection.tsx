const STEPS = [
  {
    number: '01',
    title: 'Register & KYC',
    body: 'Operators submit business identity, fleet documents, and operating revenue profiles.',
  },
  {
    number: '02',
    title: 'Attach GPS',
    body: 'Each unit connects to phone-based GPS or telematics for Proof of Activity.',
  },
  {
    number: '03',
    title: 'Submit proof readiness',
    body: 'Assets are packaged as pool candidates with auditable asset, activity, revenue, and maintenance proof.',
  },
  {
    number: '04',
    title: 'Open funding eligibility',
    body: 'Pools that pass readiness review can open on FI for cash yield and principal recovery distribution.',
  },
]

export function RwaTokenizationFlowSection() {
  return (
    <section className="bg-[#F8FAF8] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">How assets qualify</p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-4xl font-medium tracking-tighter text-zinc-950 md:text-6xl">
              From physical assets to funding-ready pools.
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              RWA is not just vehicle data upload. Every asset needs documents, activity trails, and revenue records that investors can verify.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {STEPS.map((step) => (
              <article key={step.number} className="rounded-[2rem] border border-zinc-950/10 bg-white p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-sm font-bold text-teal-700">
                  {step.number}
                </span>
                <h3 className="mt-8 font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight text-zinc-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
