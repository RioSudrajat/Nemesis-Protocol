import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const PROOFS = ['Proof of Asset', 'Proof of Activity', 'Proof of Revenue']

export function RwaHeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_70%_0%,rgba(45,212,191,0.22),transparent_34%),linear-gradient(180deg,#F5FFFA_0%,#F8FAF8_58%,#FFFFFF_100%)] px-6 pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="absolute inset-0 -z-10 opacity-[0.18] [background-image:radial-gradient(rgba(15,23,42,0.22)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <div className="mb-7 inline-flex rounded-full border border-teal-700/15 bg-white/70 px-4 py-2 text-sm font-medium text-teal-800 shadow-sm backdrop-blur">
            Nemesis RWA for physical asset tokenization
          </div>

          <h1 className="max-w-4xl font-[family-name:var(--font-fraunces)] text-6xl font-medium tracking-tighter text-zinc-950 sm:text-7xl lg:text-8xl">
            Tokenisasi Aset Infrastruktur Lo
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600 md:text-xl">
            Ubah armada produktif dan aset infrastruktur fisik menjadi aset on-chain yang dapat diverifikasi, didanai, dan menghasilkan distribusi IDRX dari revenue operasional nyata.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {PROOFS.map((proof) => (
              <span
                key={proof}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-950/10 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                {proof}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/rwa/operator"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-6 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition-transform hover:-translate-y-0.5"
            >
              Daftar Sebagai Operator
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/rwa/assets"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-950/10 bg-white px-6 py-4 text-sm font-bold text-zinc-950 shadow-sm transition-colors hover:bg-zinc-50"
            >
              Lihat Asset Catalog
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-[3.5rem] bg-teal-300/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white p-3 shadow-[0_30px_100px_rgba(15,23,42,0.14)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-zinc-950">
              <Image
                src="/ev_logistics_bandung_1777118107682.png"
                alt="Productive infrastructure operated by Nemesis RWA"
                fill
                sizes="(min-width: 1024px) 44vw, 92vw"
                className="object-cover opacity-90"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(4,47,46,0.38)),radial-gradient(circle_at_50%_20%,rgba(94,234,212,0.45),transparent_34%)]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/25 bg-white/[0.82] p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Verified pool template</p>
                    <p className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-zinc-950">1.000 shares</p>
                  </div>
                  <p className="rounded-full bg-teal-600 px-3 py-1 text-xs font-bold text-white">IDRX</p>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  {[
                    ['GPS', 'Active'],
                    ['KYC', 'Verified'],
                    ['Revenue', 'Weekly'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-zinc-950/[0.04] p-3">
                      <p className="text-xs text-zinc-500">{label}</p>
                      <p className="mt-1 font-semibold text-zinc-950">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
