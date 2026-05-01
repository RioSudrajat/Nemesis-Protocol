import Link from 'next/link'
import { BatteryCharging, CarFront, SunMedium } from 'lucide-react'

const MODULES = [
  {
    number: '01',
    title: 'Productive EV Fleets',
    status: 'Active',
    description: 'Motorbikes, cars, vans, and logistics fleets that generate revenue through daily operations.',
    details: ['Ride-hailing', 'Delivery', 'Logistics'],
    href: '/rwa/assets',
    Icon: CarFront,
  },
  {
    number: '02',
    title: 'EV Charging Networks',
    status: 'Next',
    description: 'Charging stations and battery swap infrastructure with revenue from usage fees.',
    details: ['SPKLU', 'Charging', 'Battery swap'],
    href: '/rwa/assets',
    Icon: BatteryCharging,
  },
  {
    number: '03',
    title: 'Solar + P2P Energy',
    status: 'Future',
    description: 'Solar and storage assets that unlock P2P energy trading for productive infrastructure.',
    details: ['Solar', 'Storage', 'P2P energy'],
    href: '/rwa/assets',
    Icon: SunMedium,
  },
]

export function RwaAssetModulesSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Asset modules</p>
          <h2 className="font-[family-name:var(--font-fraunces)] text-4xl font-medium tracking-tighter text-zinc-950 md:text-6xl">
            One protocol for infrastructure assets that actually work.
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {MODULES.map(({ Icon, ...module }) => (
            <Link
              key={module.number}
              href={module.href}
              className="group rounded-[2rem] border border-zinc-950/10 bg-[#F8FAF8] p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-teal-600/25 hover:shadow-[0_22px_60px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-500 shadow-sm">
                  {module.status}
                </span>
              </div>
              <p className="mt-8 text-sm font-semibold text-teal-700">Module {module.number}</p>
              <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight text-zinc-950">{module.title}</h3>
              <p className="mt-4 min-h-20 text-sm leading-6 text-zinc-600">{module.description}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {module.details.map((detail) => (
                  <span key={detail} className="rounded-full border border-zinc-950/10 bg-white px-3 py-1 text-xs font-semibold text-zinc-600">
                    {detail}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
