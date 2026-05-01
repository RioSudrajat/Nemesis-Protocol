import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, FileCheck2, Layers3, Route } from 'lucide-react'
import { RWA_ASSET_CATALOG } from '@/components/rwa/public/assetCatalog'
import { RwaPublicFooter } from '@/components/rwa/public/RwaPublicFooter'
import { RwaPublicNav } from '@/components/rwa/public/RwaPublicNav'

const CATEGORIES = ['All assets', 'Phase 1 eligible', 'Mobility', 'Charging', 'Energy']

export default function AssetsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF8] text-zinc-950">
      <RwaPublicNav />

      <section className="px-6 pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Link href="/rwa" className="mb-8 inline-flex rounded-full border border-zinc-950/10 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 shadow-sm hover:text-zinc-950">
            Back to RWA
          </Link>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Asset catalog</p>
              <h1 className="font-[family-name:var(--font-fraunces)] text-5xl font-medium tracking-tighter text-zinc-950 md:text-7xl">
                Asset classes for verified financing rails.
              </h1>
            </div>
            <p className="max-w-xl text-lg leading-8 text-zinc-600">
              Phase 1 focuses on mobility credit pools. Charging and energy are shown as future infrastructure classes so Nemesis stays larger than fleet financing alone.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {CATEGORIES.map((category, index) => (
              <span
                key={category}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  index === 0 ? 'bg-zinc-950 text-white' : 'border border-zinc-950/10 bg-white text-zinc-600'
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {RWA_ASSET_CATALOG.map((asset) => (
            <Link
              key={asset.id}
              href={`/rwa/assets/${asset.id}`}
              className="group overflow-hidden rounded-[2rem] border border-zinc-950/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-teal-600/25 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]"
            >
              <div className="relative aspect-[1.35] overflow-hidden bg-teal-50">
                <Image
                  src={asset.image}
                  alt={asset.name}
                  fill
                  sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 92vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(4,47,46,0.20))]" />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-teal-800 shadow-sm backdrop-blur">
                  {asset.segment}
                </span>
              </div>

              <div className="p-6">
                <p className="text-sm font-semibold text-teal-700">{asset.assetClass}</p>
                <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight text-zinc-950">{asset.name}</h2>
                <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-zinc-600">{asset.description}</p>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-zinc-950/[0.04] p-3">
                    <Layers3 className="mb-2 h-4 w-4 text-teal-700" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Pool model</p>
                    <p className="mt-1 font-[family-name:var(--font-fraunces)] font-bold text-zinc-950">{asset.poolModel}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-950/[0.04] p-3">
                    <Route className="mb-2 h-4 w-4 text-teal-700" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Revenue</p>
                    <p className="mt-1 font-[family-name:var(--font-fraunces)] font-bold text-zinc-950">{asset.revenueModel}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-950/[0.04] p-3">
                    <FileCheck2 className="mb-2 h-4 w-4 text-teal-700" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Proofs</p>
                    <p className="mt-1 font-[family-name:var(--font-fraunces)] font-bold text-zinc-950">4 required</p>
                  </div>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-zinc-950">
                  Details & requirements
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <RwaPublicFooter />
    </main>
  )
}
