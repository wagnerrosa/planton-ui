'use client'

import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AcademyLogo } from '../AcademyLogo'
import { AuthCard } from '../AuthCard'
import { Button } from '@/components/primitives/Button'
import { CheckCircle } from 'lucide-react'

export function SuccessStep() {
  return (
    <AuthCard>
      <div className="flex flex-col items-center gap-6">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">Acesso liberado!</Heading>
      </div>

      <div className="flex flex-col items-center gap-4 py-4">
        <CheckCircle className="h-10 w-10 text-planton-accent" />
        <Body size="sm" className="text-center">
          Sua conta foi criada com sucesso. Você já pode acessar todas as trilhas disponíveis para a sua empresa.
        </Body>
      </div>

      <Button
        variant="primary"
        className="w-full justify-center"
        href="/academy"
      >
        Ir para a plataforma →
      </Button>
    </AuthCard>
  )
}
