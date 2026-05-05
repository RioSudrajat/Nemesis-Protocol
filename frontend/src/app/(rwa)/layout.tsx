'use client'

import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import { LayoutDashboard, Map, Plus, Wrench, BarChart2, ArrowLeftRight, Settings, Users } from 'lucide-react'
import { AppSidebar, type NavItem } from '@/components/layout/AppSidebar'

const ConnectWalletButton = dynamic(
  () =>
    import('@/components/ui/ConnectWalletButton').then((m) => ({
      default: m.ConnectWalletButton,
    })),
  { ssr: false }
)

const OPERATOR_NAV: NavItem[] = [
  { href: '/rwa/operator', label: 'Overview', icon: LayoutDashboard },
  { href: '/rwa/operator/fleet', label: 'Fleet', icon: Map },
  { href: '/rwa/operator/mint', label: 'Onboard', icon: Plus },
  { href: '/rwa/operator/drivers', label: 'Drivers', icon: Users },
  { href: '/rwa/operator/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/rwa/operator/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/rwa/operator/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/rwa/operator/settings', label: 'Settings', icon: Settings },
]

export default function RWALayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isOperatorPortal = pathname?.startsWith('/rwa/operator')

  if (isOperatorPortal) {
    return (
      <div className="min-h-screen flex bg-[#080A0B]">
        <AppSidebar
          navItems={OPERATOR_NAV}
          portalName="Nemesis RWA"
          portalLabel="RWA"
          useInlineActiveStyle
          shellTone="executive"
          mobileNavCount={4}
        />
        <main
          className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.035),transparent_28%),linear-gradient(180deg,#090B0C_0%,#050606_100%)] pt-24 sm:p-6 md:p-10 md:pt-10"
          style={{ maxHeight: '100dvh' }}
        >
          {/* Wallet button for RWA Operator — top right, desktop only */}
          <header className="hidden md:flex justify-end mb-0 -mt-2 pb-4">
            <ConnectWalletButton variant="operator" />
          </header>
          {children}
        </main>
      </div>
    )
  }

  // Public pages use the light product-marketing surface. Operator portal stays dark.
  return (
    <div className="theme-light min-h-screen font-[family-name:var(--font-plus-jakarta)]" style={{ background: '#F8FAF8', color: '#0A0A0B' }}>
      {children}
    </div>
  )
}
