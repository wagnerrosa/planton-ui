'use client'

import { useEffect } from 'react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AcademyLogo } from '../AcademyLogo'
import { AuthCard } from '../AuthCard'
import { CheckCircle } from 'lucide-react'
import type { AuthStep } from '../LoginFlow'

type DomainActiveStepProps = {
  onNavigate: (step: AuthStep) => void
}

export function DomainActiveStep({ onNavigate }: DomainActiveStepProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('profile-form')
    }, 2000)
    return () => clearTimeout(timer)
  }, [onNavigate])

  return (
    <AuthCard>
      <div className="flex flex-col gap-6">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">Empresa encontrada</Heading>
      </div>

      <div className="flex flex-col items-center gap-4 py-4">
        <CheckCircle className="h-10 w-10 text-planton-accent" />
        <Body size="sm" className="text-center">
          Encontramos sua empresa. Complete seu cadastro para acessar.
        </Body>
      </div>
    </AuthCard>
  )
}
