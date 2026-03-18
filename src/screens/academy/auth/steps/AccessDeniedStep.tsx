'use client'

import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Button } from '@/components/primitives/Button'
import type { AuthStep } from '../LoginFlow'

type AccessDeniedStepProps = {
  onNavigate: (step: AuthStep) => void
}

export function AccessDeniedStep({ onNavigate }: AccessDeniedStepProps) {
  return (
    <div className="w-full max-w-sm border border-border p-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Eyebrow>Planton</Eyebrow>
        <Heading as="h1" size="heading-lg">Acesso negado</Heading>
      </div>

      <Body size="sm">
        Não encontramos seu login em nossa plataforma.
      </Body>

      <Button
        variant="primary"
        className="w-full justify-center"
        onClick={() => onNavigate('login')}
      >
        Tentar com outro e-mail
      </Button>

      <Body size="sm" muted>
        <a
          href="https://planton.eco.br"
          target="_blank"
          rel="noopener noreferrer"
          className="text-planton-accent underline-offset-2 hover:underline"
        >
          Quero conhecer o Planton Academy →
        </a>
      </Body>
    </div>
  )
}
