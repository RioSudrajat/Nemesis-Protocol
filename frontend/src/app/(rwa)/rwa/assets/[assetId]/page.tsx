import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, CheckCircle2, FileCheck2, Layers3, Route } from 'lucide-react'
import { RWA_ASSET_CATALOG } from '@/components/rwa/public/assetCatalog'
import { RwaPublicFooter } from '@/components/rwa/public/RwaPublicFooter'
import { RwaPublicNav } from '@/components/rwa/public/RwaPublicNav'

export function generateStaticParams() {
  return RWA_ASSET_CATALOG.map((asset) => ({ assetId: asset.id }))
}

export default function AssetDetailPage({ params }: { params: { assetId: string } }) {
  const asset = RWA_ASSET_CATALOG.find((item) => item.id === params.assetId)

  if (!asset) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#F8FAF8] text-zinc-950">
      <RwaPublicNav />

      <section className="px-6 pb-20 pt-32 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Link href="/rwa/assets" className="mb-8 inline-flex rounded-full border border-zinc-950/10 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 shadow-sm hover:text-zinc-950">
            Back to asset catalog
          </Link>

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">{asset.segment}</p>
              <h1 className="font-[family-name:var(--font-fraunces)] text-5xl font-medium tracking-tighter text-zinc-950 md:text-7xl">
                {asset.name}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">{asset.description}</p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-zinc-950/10 bg-white p-4 shadow-sm">
                  <Layers3 className="mb-3 h-5 w-5 text-teal-700" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Pool model</p>
                  <p className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-zinc-950">{asset.poolModel}</p>
                </div>
                <div className="rounded-2xl border border-zinc-950/10 bg-white p-4 shadow-sm">
                  <Route className="mb-3 h-5 w-5 text-teal-700" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Revenue model</p>
                  <p className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-zinc-950">{asset.revenueModel}</p>
                </div>
                <div className="rounded-2xl border border-zinc-950/10 bg-white p-4 shadow-sm">
                  <FileCheck2 className="mb-3 h-5 w-5 text-teal-700" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">Minimum deployment</p>
                  <p className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-zinc-950">{asset.minimumDeployment}</p>
                </div>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/rwa/operator/mint"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-6 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
                >
                  Start eligibility flow
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/rwa/operator"
                  className="inline-flex items-center justify-center rounded-2xl border border-zinc-950/10 bg-white px-6 py-4 text-sm font-bold text-zinc-950"
                >
                  Enter Operator Portal
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-3 shadow-[0_28px_90px_rgba(15,23,42,0.12)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
                <Image
                  src={asset.image}
                  alt={asset.name}
                  fill
                  sizes="(min-width: 1024px) 48vw, 92vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(4,47,46,0.24))]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2rem] border border-zinc-950/10 bg-[#F8FAF8] p-7 shadow-sm">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Specifications</p>
            <div className="grid gap-3">
              {asset.specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                  <span className="text-sm text-zinc-500">{spec.label}</span>
                  <span className="text-right text-sm font-semibold text-zinc-950">{spec.value}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-zinc-950/10 bg-[#F8FAF8] p-7 shadow-sm">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Proof requirements</p>
            <div className="grid gap-3">
              {asset.requirements.map((requirement) => (
                <div key={requirement} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-700" />
                  {requirement}
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[#F8FAF8] px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-zinc-950 p-8 text-white shadow-[0_28px_90px_rgba(15,23,42,0.18)] md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-300">Ready for funding review</p>
              <h2 className="max-w-3xl font-[family-name:var(--font-fraunces)] text-4xl font-medium tracking-tighter md:text-6xl">
                Bring this asset into the operator portal.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-300">
                Technical data, KYC, route proof, revenue model, and maintenance readiness are validated in the operator flow before the asset opens to investors.
              </p>
            </div>
            <Link
              href="/rwa/operator/mint"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-300 px-6 py-4 text-sm font-bold text-zinc-950"
            >
              Start onboarding flow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <RwaPublicFooter />
    </main>
  )
}
