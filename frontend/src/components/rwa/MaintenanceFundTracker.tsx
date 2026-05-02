import type { RegisteredVehicle, MaintenanceFundEntry } from '@/types/rwa'
import { formatIDRX, formatKm } from '@/lib/yield'

interface MaintenanceFundTrackerProps {
  vehicles: RegisteredVehicle[]
  fundLog: MaintenanceFundEntry[]
}

function getServiceStatus(v: RegisteredVehicle): { label: string; className: string; dotClass: string; overdue: boolean } {
  const remaining = v.nextServiceKm - v.odometer
  if (remaining <= 0) {
    return {
      label: 'Action Needed',
      className: 'border-rose-200/18 bg-white/[0.045] text-rose-100/92',
      dotClass: 'bg-rose-300',
      overdue: true,
    }
  }
  if (remaining <= 300) {
    return {
      label: 'Due Soon',
      className: 'border-white/[0.08] bg-white/[0.035] text-orange-100/68',
      dotClass: 'bg-orange-200/65',
      overdue: false,
    }
  }
  return {
    label: 'Normal',
    className: 'border-white/[0.08] bg-white/[0.04] text-white/64',
    dotClass: 'bg-emerald-300/80',
    overdue: false,
  }
}

export function MaintenanceFundTracker({ vehicles, fundLog }: MaintenanceFundTrackerProps) {
  const overdueVehicles = vehicles.filter((v) => v.odometer >= v.nextServiceKm)

  return (
    <div className="flex flex-col gap-4">
      {overdueVehicles.length > 0 && (
        <div className="rounded-2xl border border-white/[0.075] bg-[#0B0C0B] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
          <div className="flex items-start gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.28)]" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-white/86">
                  {overdueVehicles.length} unit{overdueVehicles.length === 1 ? '' : 's'} past service threshold
                </p>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-100/76">
                  Review needed
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-white/42">
                {overdueVehicles.map((v) => v.unitId).join(', ')} need service scheduling before return-to-service proof can pass.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/[0.075] [scrollbar-color:rgba(148,163,184,0.28)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 hover:[&::-webkit-scrollbar-thumb]:bg-white/25">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-white/[0.07] bg-white/[0.02] text-[11px] uppercase tracking-[0.18em] text-white/36">
            <tr>
              <th className="px-5 py-4 font-semibold">Unit</th>
              <th className="px-5 py-4 font-semibold">Reserve Balance</th>
              <th className="px-5 py-4 font-semibold">Last Service</th>
              <th className="px-5 py-4 font-semibold">Next Service</th>
              <th className="px-5 py-4 font-semibold">Proof Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {vehicles.map((vehicle) => {
              const serviceStatus = getServiceStatus(vehicle)
              const lastEntry = fundLog
                .filter((entry) => entry.vehicleId === vehicle.id && entry.type === 'release')
                .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]

              return (
                <tr
                  key={vehicle.id}
                  className={`text-white/72 transition hover:bg-white/[0.035] ${serviceStatus.overdue ? 'bg-white/[0.018]' : ''}`}
                >
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-bold text-teal-100">{vehicle.unitId}</span>
                    <div className="mt-1 text-xs text-white/36">{vehicle.brand} {vehicle.model}</div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-white/76">{formatIDRX(vehicle.maintenanceFundBalance)}</td>
                  <td className="px-5 py-4">
                    <div className="text-sm text-white/70">{formatKm(vehicle.lastServiceKm)}</div>
                    {lastEntry && (
                      <div className="mt-1 text-xs text-white/36">
                        {lastEntry.serviceType ?? 'General service'}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm text-white/70">{formatKm(vehicle.nextServiceKm)}</div>
                    <div className="mt-1 text-xs text-white/36">
                      Odometer: {formatKm(vehicle.odometer)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${serviceStatus.className}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${serviceStatus.dotClass}`} />
                      {serviceStatus.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
