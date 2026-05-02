import Link from 'next/link'
import { ArrowRight, Building2, UserRound } from 'lucide-react'

const OPERATOR_TYPES = [
  {
    title: 'Fleet Operator',
    label: 'PT / CV / UD',
    body: 'For operators with structured fleets, operational SLAs, and recurring revenue reporting.',
    requirements: ['Min. 10 units', 'Business KYC', '85%+ uptime SLA', 'Monthly investor reporting'],
    Icon: Building2,
  },
  {
    title: 'Individual Operator',
    label: 'Independent',
    body: 'For productive vehicle owners who want to join community pools with active GPS proof.',
    requirements: ['Min. 1 unit', 'Individual KYC', 'Active node score', 'Unit-level cashflow tracking'],
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
