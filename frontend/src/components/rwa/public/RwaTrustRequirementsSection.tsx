import { CircleDollarSign, FileCheck2, MapPinned } from 'lucide-react'

const REQUIREMENTS = [
  {
    title: 'Physical asset registry',
    body: 'VIN, registration, ownership, insurance, and operator identity are captured before tokenization.',
    metric: 'Proof of Asset',
    Icon: FileCheck2,
  },
  {
    title: 'GPS activity stream',
    body: 'Daily utilization, location proofs, and node health become the operating trail behind every pool.',
    metric: 'Proof of Activity',
    Icon: MapPinned,
  },
  {
    title: 'Revenue settlement',
    body: 'Revenue inputs are mapped into IDRX settlement and investor distribution logic.',
    metric: 'Proof of Revenue',
    Icon: CircleDollarSign,
  },
]

export function RwaTrustRequirementsSection() {
  return (
    <section className="bg-[#F8FAF8] px-6 py-24">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-zinc-950 p-6 text-white shadow-[0_30px_100px_rgba(15,23,42,0.20)] md:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-300">Trust requirements</p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-4xl font-medium tracking-tighter md:text-6xl">
              Investor trust starts before minting.
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              RWA assets only matter when the protocol can prove the asset exists, works, and produces revenue.
            </p>
          </div>
          <div className="grid gap-3">
            {REQUIREMENTS.map(({ Icon, ...item }) => (
              <article key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-300 text-zinc-950">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-200">{item.metric}</p>
                    <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{item.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
