'use client'

import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AcademyLogo } from '../AcademyLogo'
import { AuthCard } from '../AuthCard'
import { Button } from '@/components/primitives/Button'
import type { AuthStep } from '../LoginFlow'

type OnboardingStepProps = {
  onNavigate: (step: AuthStep) => void
}

export function OnboardingStep({ onNavigate }: OnboardingStepProps) {
  return (
    <AuthCard>
      <div className="flex flex-col gap-2">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">Bem-vindo ao Planton Academy</Heading>
      </div>

      <Body size="sm" muted>
        Veja um vídeo rápido sobre como funcionam as trilhas e a certificação.
      </Body>

      <iframe
        src="https://player.mux.com/WKpT00e9YdvWkU3IR7JzqLQaPtXhsfXDfhBXuHMyCrd8"
        title="Bem-vindo ao Planton Academy"
        style={{ width: '100%', border: 'none', aspectRatio: '16/9' }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />

      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={() => onNavigate('success')}
        >
          Ir para a plataforma
        </Button>
      </div>
    </AuthCard>
  )
}
