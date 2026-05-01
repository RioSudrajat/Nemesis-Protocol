import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function RwaFinalCtaSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.75rem] bg-[radial-gradient(circle_at_80%_10%,rgba(45,212,191,0.32),transparent_30%),linear-gradient(135deg,#F4FFFA_0%,#FFFFFF_48%,#EFFDF8_100%)] p-8 shadow-[0_26px_90px_rgba(15,23,42,0.10)] md:p-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Operator onboarding</p>
          <h2 className="font-[family-name:var(--font-fraunces)] text-4xl font-medium tracking-tighter text-zinc-950 md:text-6xl">
            Prepare your productive assets for financing eligibility.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Move from operator registration to unit validation, telemetry attachment, and proof readiness without exposing the full dashboard workflow on the public page.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/rwa/operator"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-6 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
            >
              Apply as Operator
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/fi"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-950/10 bg-white px-6 py-4 text-sm font-bold text-zinc-950"
            >
              View FI Pools
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
