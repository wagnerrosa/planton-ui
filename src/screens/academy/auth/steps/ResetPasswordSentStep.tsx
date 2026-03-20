'use client'

import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AcademyLogo } from '../AcademyLogo'
import { AuthCard } from '../AuthCard'
import { Button } from '@/components/primitives/Button'
import { Mail } from 'lucide-react'
import type { AuthStep } from '../LoginFlow'

type ResetPasswordSentStepProps = {
  email: string
  onNavigate: (step: AuthStep) => void
}

export function ResetPasswordSentStep({ email, onNavigate }: ResetPasswordSentStepProps) {
  return (
    <AuthCard>
      <div className="flex flex-col gap-2">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">E-mail enviado</Heading>
      </div>

      <div className="flex flex-col items-center gap-4 py-4">
        <Mail className="h-10 w-10 text-planton-accent" />
        <Body size="sm" className="text-center">
          Enviamos um link de redefinição para <strong>{email}</strong>. Verifique sua caixa de entrada.
        </Body>
      </div>

      <Button
        variant="primary"
        className="w-full justify-center"
        onClick={() => onNavigate('login')}
      >
        Voltar ao login
      </Button>
    </AuthCard>
  )
}
