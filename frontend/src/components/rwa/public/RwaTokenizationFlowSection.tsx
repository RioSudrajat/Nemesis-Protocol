const STEPS = [
  {
    number: '01',
    title: 'Daftar & KYC',
    body: 'Operator memasukkan identitas bisnis, dokumen armada, dan profil revenue operasional.',
  },
  {
    number: '02',
    title: 'Pasang GPS',
    body: 'Unit dihubungkan ke phone-based GPS atau telematics untuk Proof of Activity.',
  },
  {
    number: '03',
    title: 'Mint shares',
    body: 'Kendaraan dibuat menjadi pool dengan 1.000 SPL shares dan settlement IDRX.',
  },
  {
    number: '04',
    title: 'Terima modal',
    body: 'Investor mendanai pool, revenue dibaca on-chain, distribusi dilakukan otomatis.',
  },
]

export function RwaTokenizationFlowSection() {
  return (
    <section className="bg-[#F8FAF8] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">How it tokenizes</p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-4xl font-medium tracking-tighter text-zinc-950 md:text-6xl">
              Dari armada fisik ke pool yang siap didanai.
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              RWA bukan sekadar upload data kendaraan. Setiap asset harus punya dokumen, aktivitas, dan revenue trail yang bisa dipertanggungjawabkan.
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
