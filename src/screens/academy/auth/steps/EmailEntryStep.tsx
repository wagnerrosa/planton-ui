'use client'

import { useState } from 'react'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Alert, AlertDescription } from '@/components/shadcn/alert'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import { AlertCircle } from 'lucide-react'
import type { AuthStep, AuthContext } from '../LoginFlow'

const BLOCKED_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com.br',
  'yahoo.com',
  'live.com',
  'bol.com.br',
  'uol.com.br',
  'terra.com.br',
  'ig.com.br',
  'icloud.com',
  'mac.com',
  'zoho.com',
]

type EmailEntryStepProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (step: AuthStep) => void
  onUpdateContext: (updates: Partial<AuthContext>) => void
}

export function EmailEntryStep({
  open,
  onOpenChange,
  onNavigate,
  onUpdateContext,
}: EmailEntryStepProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function getDomain(emailValue: string) {
    return emailValue.split('@')[1]?.toLowerCase() ?? ''
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const domain = getDomain(email)

    if (BLOCKED_DOMAINS.includes(domain)) {
      setError('Acesso exclusivo com e-mail corporativo. Utilize o e-mail da sua empresa.')
      return
    }

    onUpdateContext({ email })

    if (email.endsWith('@empresa.com')) {
      onUpdateContext({ scenario: 'A' })
      onNavigate('domain-active')
      return
    }

    if (email.endsWith('@inativo.com')) {
      onUpdateContext({ scenario: 'B' })
      onNavigate('domain-inactive')
      return
    }

    onUpdateContext({ scenario: 'C' })
    onNavigate('domain-unknown')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-[clamp(1.75rem,2.25vw,2.25rem)] tracking-[-0.02em] leading-[1.05] text-planton-forest">
            Criar cadastro
          </DialogTitle>
        </DialogHeader>

        <Body size="sm" muted>
          Informe seu e-mail corporativo para verificar o acesso.
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
              E-mail corporativo
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              className="border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
              placeholder="voce@suaempresa.com"
              required
            />
          </div>

          <Button variant="primary" className="w-full justify-center">
            Verificar
          </Button>
        </form>
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
