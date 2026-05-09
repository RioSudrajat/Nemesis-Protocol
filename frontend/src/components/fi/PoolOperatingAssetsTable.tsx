import type { RegisteredVehicle } from "@/types/rwa";
import { formatIDRXFull } from "@/lib/yield";

export function PoolOperatingAssetsTable({ assets }: { assets: RegisteredVehicle[] }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-black text-zinc-950">Live operating assets</h2>
      <div className="overflow-hidden rounded-[1.5rem] border border-zinc-950/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-[0.12em] text-zinc-400">
              <tr>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Health</th>
                <th className="px-4 py-3">Capex</th>
              </tr>
            </thead>
            <tbody>
              {assets.slice(0, 12).map((asset) => (
                <tr key={asset.id} className="border-t border-zinc-950/5">
                  <td className="px-4 py-3 font-mono text-xs font-black text-teal-700">{asset.unitId}</td>
                  <td className="px-4 py-3 text-zinc-700">{asset.brand} {asset.model}</td>
                  <td className="px-4 py-3 capitalize text-zinc-600">{asset.status}</td>
                  <td className="px-4 py-3 font-black text-zinc-950">{asset.healthScore}/100</td>
                  <td className="px-4 py-3 text-zinc-600">{formatIDRXFull(asset.financedCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {assets.length === 0 && <p className="py-8 text-center text-sm text-zinc-500">No assets are currently locked to this pool.</p>}
        </div>
      </div>
    </section>
  );
}
