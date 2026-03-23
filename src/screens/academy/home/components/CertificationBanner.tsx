import { GraduationCap } from 'lucide-react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'

export function CertificationBanner() {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-lg border border-border bg-card">
      <GraduationCap className="h-8 w-8 text-planton-accent" strokeWidth={1.5} />
      <div className="flex flex-col gap-1">
        <Heading as="h3" size="heading-md">Conclua trilhas e obtenha certificados</Heading>
        <Body size="sm" muted>Comprove seus conhecimentos em ESG e gestão de emissões.</Body>
      </div>
      <Button variant="primary" size="sm" href="/design-system/screens/academy/home" className="self-start">
        Explorar trilhas
      </Button>
    </div>
  )
}
