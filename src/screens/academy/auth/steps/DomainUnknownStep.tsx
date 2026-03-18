'use client'

import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AcademyLogo } from '../AcademyLogo'
import { Button } from '@/components/primitives/Button'
import type { AuthStep } from '../LoginFlow'

type DomainUnknownStepProps = {
  onNavigate: (step: AuthStep) => void
}

export function DomainUnknownStep({ onNavigate }: DomainUnknownStepProps) {
  return (
    <div className="w-full max-w-md border border-border p-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">Empresa não encontrada</Heading>
      </div>

      <Body size="sm">
        Não encontramos sua empresa em nossa plataforma.
      </Body>

      <Button
        variant="primary"
        className="w-full justify-center"
        href="https://planton.eco.br"
      >
        Quero conhecer o Planton Academy
      </Button>

      <button
        type="button"
        onClick={() => onNavigate('login')}
        className="font-sans text-xs text-planton-accent underline-offset-2 hover:underline"
      >
        Voltar
      </button>
    </div>
  )
}
