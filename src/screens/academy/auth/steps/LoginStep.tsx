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

type LoginStepProps = {
  onNavigate: (step: AuthStep) => void
  onUpdateContext: (updates: Partial<AuthContext>) => void
  onOpenEmailDialog: () => void
}

export function LoginStep({ onNavigate, onUpdateContext, onOpenEmailDialog }: LoginStepProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (email.includes('erro')) {
      setError('E-mail ou senha incorretos.')
      return
    }

    if (email.includes('semacesso')) {
      onUpdateContext({ email })
      onNavigate('access-denied')
      return
    }

    onUpdateContext({ email })
    onNavigate('success')
  }

  return (
    <AuthCard>
      <div className="flex flex-col gap-2">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">Entrar na plataforma</Heading>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
            E-mail
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate('forgot-password')}
            className="font-sans text-xs text-planton-accent underline-offset-2 hover:underline"
          >
            Esqueci minha senha
          </button>
        </div>

        <Button variant="primary" className="w-full justify-center">
          Entrar
        </Button>
      </form>

      <Body size="sm" muted>
        Não tem conta?{' '}
        <button
          type="button"
          onClick={onOpenEmailDialog}
          className="text-planton-accent underline-offset-2 hover:underline"
        >
          Criar novo cadastro
        </button>
      </Body>
    </AuthCard>
  )
}
