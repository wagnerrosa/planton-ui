'use client'

import { useState } from 'react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AcademyLogo } from '../AcademyLogo'
import { AuthCard } from '../AuthCard'
import { Button } from '@/components/primitives/Button'
import { Alert, AlertDescription } from '@/components/shadcn/alert'
import { AlertCircle } from 'lucide-react'
import type { AuthStep, AuthContext } from '../LoginFlow'

type DomainInactiveStepProps = {
  onNavigate: (step: AuthStep) => void
  onUpdateContext: (updates: Partial<AuthContext>) => void
}

export function DomainInactiveStep({ onNavigate, onUpdateContext }: DomainInactiveStepProps) {
  const [voucher, setVoucher] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (voucher === 'PLANTON-2026-ATIVO') {
      onUpdateContext({ voucherCode: voucher })
      onNavigate('profile-form')
      return
    }

    if (voucher === 'PLANTON-2026-EXPIRADO') {
      setError('Código inválido ou expirado. Verifique o código ou entre em contato com nosso time.')
      return
    }

    setError('Este código não está associado ao domínio do seu e-mail. Verifique o código ou entre em contato com nosso time.')
  }

  return (
    <AuthCard>
      <div className="flex flex-col items-center gap-6">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">Ativar acesso</Heading>
      </div>

      <Body size="sm">
        Sua empresa ainda não tem acesso ativo ao Planton Academy.
      </Body>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
            Código do voucher
          </label>
          <input
            type="text"
            value={voucher}
            onChange={(e) => {
              setVoucher(e.target.value)
              setError('')
            }}
            className="border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
            placeholder="PLANTON-XXXX-XXXX"
            required
          />
          <a
            href="https://planton.eco.br"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs text-planton-accent underline-offset-2 hover:underline mt-1"
          >
            Não tem um voucher? Entre em contato com nosso time comercial →
          </a>
        </div>

        <Button variant="primary" className="w-full justify-center">
          Continuar
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
