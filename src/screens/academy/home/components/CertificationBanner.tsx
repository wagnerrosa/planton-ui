import { GraduationCap } from 'lucide-react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'

type CertificationBannerProps = {
  onExploreTrails?: () => void
}

export function CertificationBanner({ onExploreTrails }: CertificationBannerProps) {
  return (
    <div className="flex flex-col gap-4 p-8 rounded-lg border border-planton-accent/30 bg-card">
      <GraduationCap className="h-9 w-9 text-planton-accent" strokeWidth={1.5} />
      <div className="flex flex-col gap-1.5">
        <Heading as="h3" size="heading-md">Avance com trilhas estruturadas</Heading>
        <Body size="sm" muted>Complete cursos e conquiste seu certificado</Body>
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={onExploreTrails}
        className="self-start"
      >
        Explorar trilhas
      </Button>
    </div>
  )
}
