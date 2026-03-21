'use client'

import { useState } from 'react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AcademyLogo } from '../AcademyLogo'
import { AuthCard } from '../AuthCard'
import { Button } from '@/components/primitives/Button'
import type { AuthStep, AuthContext } from '../LoginFlow'

type ForgotPasswordStepProps = {
  onNavigate: (step: AuthStep) => void
  onUpdateContext: (updates: Partial<AuthContext>) => void
}

export function ForgotPasswordStep({ onNavigate, onUpdateContext }: ForgotPasswordStepProps) {
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onUpdateContext({ email })
    onNavigate('reset-password-sent')
  }

  return (
    <AuthCard>
      <div className="flex flex-col items-center gap-6">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">Recuperar senha</Heading>
      </div>

      <Body size="sm" muted>
        Informe seu e-mail para receber o link de redefinição de senha.
      </Body>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
            placeholder="seu@email.com"
            required
          />
        </div>

        <Button variant="primary" className="w-full justify-center">
          Enviar link
        </Button>
      </form>

      <button
        type="button"
        onClick={() => onNavigate('login')}
        className="font-sans text-xs text-planton-accent underline-offset-2 hover:underline"
      >
        Voltar ao login
      </button>
    </AuthCard>
  )
}
