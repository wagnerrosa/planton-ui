'use client'

import { useState } from 'react'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/primitives/Button'

type EurecicloLoginScreenProps = {
  onLogin?: () => void
}

export function EurecicloLoginScreen({ onLogin }: EurecicloLoginScreenProps) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onLogin?.()
  }

  return (
    <main className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-10">

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-2xl font-heading font-semibold tracking-tight text-foreground">
            Jornada de Descarbonização
          </p>
          <p className="text-sm text-muted-foreground font-sans">
            Acesse sua conta para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-user" className="text-xs font-medium text-foreground font-sans">
              Usuário
            </label>
            <Input
              id="login-user"
              type="text"
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="seu@email.com.br"
              className="h-12 text-base"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-pass" className="text-xs font-medium text-foreground font-sans">
              Senha
            </label>
            <Input
              id="login-pass"
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className="h-12 text-base"
            />
          </div>

          <Button variant="secondary" type="submit" className="w-full justify-center mt-2">
            Acessar
          </Button>
        </form>

        <div className="flex items-center justify-center gap-4 pt-2">
          <a href="https://eureciclo.com.br" target="_blank" rel="noopener noreferrer">
            <img src="/eureciclo.svg" alt="eureciclo" className="h-10 w-auto" />
          </a>
          <div className="h-8 w-px bg-border" />
          <a href="https://planton.eco.br" target="_blank" rel="noopener noreferrer">
            <img src="/Logo_Planton_01.svg" alt="Planton" className="h-[26px] w-auto" />
          </a>
        </div>

      </div>
    </main>
  )
}
