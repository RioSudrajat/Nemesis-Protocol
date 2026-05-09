import { formatIDRXFull } from "@/lib/yield";

export function PortfolioClaimPanel({ amount }: { amount: number }) {
  return (
    <section className="rounded-[1.5rem] border border-zinc-950/10 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-zinc-950">Unclaimed yield</h2>
      <div className="mt-5 rounded-2xl border border-zinc-950/10 bg-zinc-50 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">IDRX</p>
        <p className="mt-1 text-2xl font-black text-zinc-950">{formatIDRXFull(amount)}</p>
      </div>
      <button
        disabled={amount <= 0}
        className="mt-4 w-full rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition enabled:hover:bg-black disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        Claim yield
      </button>
    </section>
  );
}
