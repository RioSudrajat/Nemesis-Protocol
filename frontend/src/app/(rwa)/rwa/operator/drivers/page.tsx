'use client'

import { useState } from 'react'
import {
  Users,
  Plus,
  Phone,
  User,
  Bike,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  X,
  Copy,
  Check,
} from 'lucide-react'
import { useDriverAuthStore, type RegisteredDriver } from '@/store/driverAuthStore'
import { MOCK_VEHICLES } from '@/data/vehicles'

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-[28px] border border-white/[0.075] bg-[#070808]/88 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  )
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
      {children}
    </p>
  )
}

const KYC_BADGE: Record<string, { label: string; color: string; Icon: typeof CheckCircle2 }> = {
  verified: { label: 'Verified', color: '#5EEAD4', Icon: CheckCircle2 },
  pending: { label: 'Pending', color: '#FCD34D', Icon: Clock },
  rejected: { label: 'Rejected', color: '#FCA5A5', Icon: XCircle },
}

export default function OperatorDriversPage() {
  const { registeredDrivers, registerDriver } = useDriverAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Form state
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formVehicle, setFormVehicle] = useState('')
  const [formContract, setFormContract] = useState<'rent' | 'rent_to_own'>('rent_to_own')
  const [formFee, setFormFee] = useState('50000')

  const filtered = registeredDrivers.filter(
    (d) =>
      d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.assignedVehicleId.toLowerCase().includes(search.toLowerCase())
  )

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    let normalizedPhone = formPhone.replace(/\s/g, '')
    if (normalizedPhone.startsWith('08')) normalizedPhone = '+62' + normalizedPhone.slice(1)
    else if (normalizedPhone.startsWith('62')) normalizedPhone = '+' + normalizedPhone
    else if (!normalizedPhone.startsWith('+62')) normalizedPhone = '+62' + normalizedPhone

    const vehicle = MOCK_VEHICLES.find((v) => v.unitId === formVehicle) || MOCK_VEHICLES[0]

    registerDriver({
      phone: normalizedPhone,
      fullName: formName,
      kycStatus: 'pending',
      assignedVehicleId: formVehicle || vehicle.unitId,
      assignedVehicleName: `${vehicle.brand} ${vehicle.model}`,
      contractType: formContract,
      dailyFee: parseInt(formFee) || 50000,
    })

    // Reset form
    setFormName('')
    setFormPhone('')
    setFormVehicle('')
    setFormFee('50000')
    setShowForm(false)
  }

  const handleCopyPhone = (driver: RegisteredDriver) => {
    void navigator.clipboard.writeText(driver.phone)
    setCopiedId(driver.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="relative mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SectionEyebrow>Fleet workforce</SectionEyebrow>
          <h1
            className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl"
            style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}
          >
            Driver Management
          </h1>
          <p className="mt-2 text-sm text-white/48">
            Register drivers, assign vehicles, and manage access to the driver portal.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-200/30 bg-[#0B0F0E] px-5 py-3 text-sm font-bold text-teal-100 shadow-[0_18px_38px_rgba(0,0,0,0.28)] transition hover:border-teal-200/55 hover:bg-[#101817]"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Register Driver'}
        </button>
      </div>

      {/* Registration form */}
      {showForm && (
        <Panel className="p-6 animate-in slide-in-from-top-2">
          <SectionEyebrow>New driver registration</SectionEyebrow>
          <h2 className="mt-2 mb-6 text-xl font-semibold text-white">Register a new driver</h2>

          <form onSubmit={handleRegister} className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/42">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Budi Santoso"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:border-teal-400/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/42">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="0812 3456 7890"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:border-teal-400/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/42">
                Assign Vehicle
              </label>
              <div className="relative">
                <Bike size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <select
                  value={formVehicle}
                  onChange={(e) => setFormVehicle(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pl-10 pr-4 text-sm text-white focus:border-teal-400/50 focus:outline-none transition-colors"
                >
                  <option value="" className="bg-[#080A0B]">Select vehicle...</option>
                  {MOCK_VEHICLES.slice(0, 10).map((v) => (
                    <option key={v.id} value={v.unitId} className="bg-[#080A0B]">
                      {v.unitId} — {v.brand} {v.model}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/42">
                  Contract
                </label>
                <select
                  value={formContract}
                  onChange={(e) => setFormContract(e.target.value as 'rent' | 'rent_to_own')}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] py-3.5 px-4 text-sm text-white focus:border-teal-400/50 focus:outline-none transition-colors"
                >
                  <option value="rent_to_own" className="bg-[#080A0B]">Rent to Own</option>
                  <option value="rent" className="bg-[#080A0B]">Rent Only</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/42">
                  Daily Fee (IDR)
                </label>
                <input
                  type="number"
                  min="10000"
                  value={formFee}
                  onChange={(e) => setFormFee(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 px-4 text-sm text-white placeholder:text-white/20 focus:border-teal-400/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="sm:col-span-2 flex flex-col gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-500/6 border border-teal-500/15">
                <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                <p className="text-xs text-teal-200/70">
                  After registration, the driver can log in at{' '}
                  <span className="font-mono font-bold text-teal-100">nemesis.id/driver</span> using their
                  phone number + OTP.
                </p>
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl py-4 font-bold text-sm text-white transition-all active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                  boxShadow: '0 8px 32px rgba(20,184,166,0.25)',
                }}
              >
                Register Driver
              </button>
            </div>
          </form>
        </Panel>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Drivers', value: registeredDrivers.length },
          { label: 'KYC Verified', value: registeredDrivers.filter((d) => d.kycStatus === 'verified').length },
          { label: 'Pending KYC', value: registeredDrivers.filter((d) => d.kycStatus === 'pending').length },
          { label: 'Rent to Own', value: registeredDrivers.filter((d) => d.contractType === 'rent_to_own').length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/[0.075] bg-[#080A0A] p-4"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
              {stat.label}
            </span>
            <div className="mt-2 text-2xl font-semibold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or vehicle ID..."
          className="w-full rounded-2xl border border-white/[0.075] bg-[#070808]/88 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/25 focus:border-teal-400/40 focus:outline-none transition-colors"
        />
      </div>

      {/* Driver list */}
      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-teal-200/80" />
            <h2 className="text-lg font-semibold text-white">Registered Drivers</h2>
          </div>
          <span className="text-xs text-white/36">{filtered.length} driver{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="overflow-x-auto [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.28)_transparent]">
          <table className="w-full min-w-[780px] text-left">
            <thead className="border-b border-white/[0.07] text-[11px] uppercase tracking-[0.18em] text-white/36">
              <tr>
                <th className="px-5 py-4 font-semibold">Driver</th>
                <th className="px-4 py-4 font-semibold">Phone</th>
                <th className="px-4 py-4 font-semibold">Vehicle</th>
                <th className="px-4 py-4 font-semibold">Contract</th>
                <th className="px-4 py-4 font-semibold">Daily Fee</th>
                <th className="px-4 py-4 font-semibold">KYC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-white/30">
                    No drivers found.
                  </td>
                </tr>
              )}
              {filtered.map((driver) => {
                const kyc = KYC_BADGE[driver.kycStatus] ?? KYC_BADGE.pending
                const KycIcon = kyc.Icon
                return (
                  <tr key={driver.id} className="text-sm text-white/72 transition hover:bg-white/[0.035]">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white/90">{driver.fullName}</div>
                      <div className="mt-0.5 text-xs text-white/36">{driver.id}</div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleCopyPhone(driver)}
                        className="group inline-flex items-center gap-1.5 font-mono text-xs text-white/60 hover:text-teal-200 transition-colors"
                        title="Copy phone number"
                      >
                        {driver.phone}
                        {copiedId === driver.id ? (
                          <Check size={12} className="text-teal-400" />
                        ) : (
                          <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-mono text-xs font-bold text-teal-100">{driver.assignedVehicleId}</div>
                      <div className="mt-0.5 text-xs text-white/36">{driver.assignedVehicleName}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                        style={{
                          borderColor: driver.contractType === 'rent_to_own' ? 'rgba(94,234,212,0.25)' : 'rgba(255,255,255,0.15)',
                          background: driver.contractType === 'rent_to_own' ? 'rgba(94,234,212,0.08)' : 'rgba(255,255,255,0.04)',
                          color: driver.contractType === 'rent_to_own' ? '#5EEAD4' : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {driver.contractType === 'rent_to_own' ? 'Rent to Own' : 'Rent'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-white/60">
                      Rp {driver.dailyFee.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
                        style={{
                          borderColor: `${kyc.color}3D`,
                          background: `${kyc.color}14`,
                          color: kyc.color,
                        }}
                      >
                        <KycIcon size={12} />
                        {kyc.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
