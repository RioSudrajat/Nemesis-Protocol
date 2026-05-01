import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/', label: 'Protocol' },
  { href: '/rwa/assets', label: 'Assets' },
  { href: '/fi', label: 'FI Pools' },
  { href: '/rwa/operator', label: 'Operators' },
]

export function RwaPublicNav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-black/5 bg-white/75 px-4 py-3 font-[family-name:var(--font-plus-jakarta)] shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:px-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5">
            <Image src="/noc_logo.png" alt="Nemesis Protocol" width={26} height={26} className="h-7 w-7 object-contain" priority />
          </span>
          <span className="leading-none">
            <span className="block text-sm font-semibold tracking-tight text-zinc-950">Nemesis</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.24em] text-teal-700">RWA</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-950/[0.04] hover:text-zinc-950"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/rwa/operator"
          className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition-transform hover:-translate-y-0.5 md:px-5"
        >
          Onboard Assets
        </Link>
      </nav>
    </header>
  )
}
