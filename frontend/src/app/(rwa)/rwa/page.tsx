import { RwaAssetModulesSection } from '@/components/rwa/public/RwaAssetModulesSection'
import { RwaFinalCtaSection } from '@/components/rwa/public/RwaFinalCtaSection'
import { RwaHeroSection } from '@/components/rwa/public/RwaHeroSection'
import { RwaOperatorFitSection } from '@/components/rwa/public/RwaOperatorFitSection'
import { RwaPublicFooter } from '@/components/rwa/public/RwaPublicFooter'
import { RwaPublicNav } from '@/components/rwa/public/RwaPublicNav'
import { RwaTokenizationFlowSection } from '@/components/rwa/public/RwaTokenizationFlowSection'
import { RwaTrustRequirementsSection } from '@/components/rwa/public/RwaTrustRequirementsSection'

export default function RWALandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8FAF8] text-zinc-950">
      <RwaPublicNav />
      <RwaHeroSection />
      <RwaAssetModulesSection />
      <RwaTokenizationFlowSection />
      <RwaOperatorFitSection />
      <RwaTrustRequirementsSection />
      <RwaFinalCtaSection />
      <RwaPublicFooter />
    </main>
  )
}
