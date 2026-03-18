'use client'

import { useState } from 'react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { AcademyLogo } from '../AcademyLogo'
import { Button } from '@/components/primitives/Button'
import { Alert, AlertDescription } from '@/components/shadcn/alert'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/shadcn/input-otp'
import { AlertCircle } from 'lucide-react'
import type { AuthStep } from '../LoginFlow'

type OTPVerificationStepProps = {
  email: string
  onNavigate: (step: AuthStep) => void
}

export function OTPVerificationStep({ email, onNavigate }: OTPVerificationStepProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [resent, setResent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (code === '123456') {
      onNavigate('onboarding')
      return
    }

    setError('Código incorreto. Tente novamente.')
  }

  function handleResend() {
    setResent(true)
    setTimeout(() => setResent(false), 3000)
  }

  return (
    <div className="w-full max-w-md border border-border p-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <AcademyLogo />
        <Heading as="h1" size="heading-lg">Verificar e-mail</Heading>
      </div>

      <Body size="sm">
        Enviamos um código de 6 dígitos para <strong>{email}</strong>. O código é válido por 15 minutos.
      </Body>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={(value) => {
              setCode(value)
              setError('')
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button variant="primary" className="w-full justify-center">
          Verificar
        </Button>
      </form>

      <div className="flex flex-col gap-2">
        {resent ? (
          <Body size="sm" muted className="text-center">
            Código reenviado com sucesso.
          </Body>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="font-sans text-xs text-planton-accent underline-offset-2 hover:underline"
          >
            Não recebi o código. Reenviar →
          </button>
        )}

        <button
          type="button"
          onClick={() => onNavigate('set-password')}
          className="font-sans text-xs text-planton-accent underline-offset-2 hover:underline"
        >
          Voltar
        </button>
      </div>
    </div>
  )
}
