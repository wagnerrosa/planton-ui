'use client'

import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AcademyLogo } from '../AcademyLogo'
import { Button } from '@/components/primitives/Button'
import { Play } from 'lucide-react'
import type { AuthStep } from '../LoginFlow'

type OnboardingStepProps = {
  onNavigate: (step: AuthStep) => void
}

export function OnboardingStep({ onNavigate }: OnboardingStepProps) {
  return (
    <div className="w-full max-w-md border border-border p-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">Bem-vindo ao Planton Academy</Heading>
      </div>

      <Body size="sm" muted>
        Antes de começar, assista ao vídeo abaixo para entender como funcionam as trilhas e a certificação.
      </Body>

      <div className="flex items-center justify-center aspect-video border border-border bg-planton-forest/5">
        <Play className="h-12 w-12 text-planton-muted" />
      </div>

      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={() => onNavigate('success')}
        >
          Começar
        </Button>

        <button
          type="button"
          onClick={() => onNavigate('success')}
          className="font-sans text-xs text-planton-muted underline-offset-2 hover:underline text-center"
        >
          Pular
        </button>
      </div>
    </div>
  )
}
