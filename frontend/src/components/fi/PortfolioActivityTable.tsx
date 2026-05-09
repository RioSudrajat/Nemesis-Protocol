import { ExternalLink } from "lucide-react";
import { formatIDRXFull } from "@/lib/yield";

export interface PortfolioActivity {
  date: string;
  type: string;
  pool: string;
  amount: number;
  hash: string;
}

export function PortfolioActivityTable({ transactions }: { transactions: PortfolioActivity[] }) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-zinc-950/10 bg-white shadow-sm">
      <div className="p-5 pb-3">
        <h2 className="text-lg font-black text-zinc-950">Activity</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 text-zinc-500">
              <th className="px-4 py-3 text-left font-bold">Date</th>
              <th className="px-4 py-3 text-left font-bold">Type</th>
              <th className="px-4 py-3 text-left font-bold">Pool</th>
              <th className="px-4 py-3 text-right font-bold">Amount</th>
              <th className="px-4 py-3 text-left font-bold">Proof</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isIn = tx.amount >= 0;
              return (
                <tr key={`${tx.date}-${tx.type}-${tx.pool}-${tx.hash}`} className="border-t border-zinc-950/5">
                  <td className="px-4 py-3 text-zinc-600">{tx.date}</td>
                  <td className="px-4 py-3 font-semibold text-zinc-950">{tx.type}</td>
                  <td className="px-4 py-3 text-zinc-600">{tx.pool}</td>
                  <td className={`whitespace-nowrap px-4 py-3 text-right font-black ${isIn ? "text-teal-700" : "text-zinc-950"}`}>
                    {isIn ? "+" : "-"}{formatIDRXFull(Math.abs(tx.amount))}
                  </td>
                  <td className="px-4 py-3">
                    <a href="#" className="inline-flex items-center gap-1 text-teal-700 hover:underline">
                      {tx.hash} <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-sm text-zinc-500" colSpan={5}>No portfolio activity yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
