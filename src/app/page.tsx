import { Globe } from '@/components/Globe'
import { HelicopterScrollSection } from '@/components/HelicopterScrollSection'
import { HeroScroll } from '@/components/HeroScroll'
import { ImmersiveShowcaseSection } from '@/components/ImmersiveShowcaseSection'
import { PlaneMorph } from '@/components/PlaneMorph'

export default function Home() {
  return (
    <main className="bg-[#050505]">
      <PlaneMorph />
      <HeroScroll />
      <HelicopterScrollSection />
      <Globe />
      <ImmersiveShowcaseSection />
    </main>
  )
}
