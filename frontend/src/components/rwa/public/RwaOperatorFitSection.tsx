import Link from 'next/link'
import { ArrowRight, Building2, UserRound } from 'lucide-react'

const OPERATOR_TYPES = [
  {
    title: 'Enterprise Fleet',
    label: 'PT / CV / UD',
    body: 'Untuk operator dengan armada terstruktur, SLA operasional, dan laporan revenue bulanan.',
    requirements: ['Min. 10 unit', 'KYC bisnis', 'SLA uptime 85%+', 'Laporan investor bulanan'],
    Icon: Building2,
  },
  {
    title: 'Individual Operator',
    label: 'Independent',
    body: 'Untuk pemilik kendaraan produktif yang ingin masuk ke pool komunitas dengan GPS aktif.',
    requirements: ['Min. 1 unit', 'KYC perorangan', 'Node score aktif', 'Yield proporsional per unit'],
    Icon: UserRound,
  },
]

export function RwaOperatorFitSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Operator fit</p>
            <h2 className="font-[family-name:var(--font-fraunces)] text-4xl font-medium tracking-tighter text-zinc-950 md:text-6xl">
              Built for fleet businesses, open for productive owners.
            </h2>
          </div>
          <Link href="/rwa/operator" className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white">
            Open portal
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {OPERATOR_TYPES.map(({ Icon, ...operator }) => (
            <article key={operator.title} className="rounded-[2.25rem] border border-zinc-950/10 bg-[#F8FAF8] p-7 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  {operator.label}
                </span>
              </div>
              <h3 className="mt-8 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-zinc-950">{operator.title}</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600">{operator.body}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {operator.requirements.map((item) => (
                  <div key={item} className="rounded-2xl border border-zinc-950/10 bg-white px-4 py-3 text-sm font-semibold text-zinc-700">
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
