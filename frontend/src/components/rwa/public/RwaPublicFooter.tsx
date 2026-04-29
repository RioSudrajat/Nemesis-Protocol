import Link from 'next/link'

export function RwaPublicFooter() {
  return (
    <footer className="border-t border-zinc-950/5 bg-[#F8FAF8] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Nemesis Protocol. Productive EV infrastructure on Solana.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/" className="hover:text-zinc-950">
            Protocol
          </Link>
          <Link href="/depin" className="hover:text-zinc-950">
            DePIN
          </Link>
          <Link href="/fi" className="hover:text-zinc-950">
            FI
          </Link>
          <Link href="/rwa/operator" className="hover:text-zinc-950">
            Operator Portal
          </Link>
        </div>
      </div>
    </footer>
  )
}
