import type { PoolReport, StakingPool } from "@/types/fi";
import { formatIDRXFull } from "@/lib/yield";

export function FiNotificationsPanel({ reports, pools }: { reports: PoolReport[]; pools: StakingPool[] }) {
  const notifications = [
    ...reports
      .filter((report) => report.isPublished)
      .slice(0, 2)
      .map((report) => ({
        title: "Report published",
        detail: `${report.period} report is available`,
      })),
    ...pools
      .filter((pool) => pool.status === "upcoming")
      .slice(0, 2)
      .map((pool) => ({
        title: "Waitlist open",
        detail: `${pool.name} targets ${formatIDRXFull(pool.targetSupply)}`,
      })),
  ].slice(0, 4);

  return (
    <aside className="rounded-[1.5rem] border border-zinc-950/10 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-zinc-950">Recent notifications</h2>
      <div className="mt-5 space-y-3">
        {notifications.map((item, index) => (
          <div key={`${item.title}-${index}`} className="rounded-2xl bg-zinc-50 p-4">
            <p className="text-sm font-bold text-zinc-950">{item.title}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">{item.detail}</p>
          </div>
        ))}
        {notifications.length === 0 && <p className="text-sm text-zinc-500">No notifications yet.</p>}
      </div>
    </aside>
  );
}
