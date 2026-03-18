'use client'

import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Button } from '@/components/primitives/Button'

export function LoginScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-default p-6">
      <div className="w-full max-w-sm border border-border p-10 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Eyebrow>Planton</Eyebrow>
          <Heading as="h1" size="heading-lg">Entrar na plataforma</Heading>
        </div>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
              E-mail
            </label>
            <input
              type="email"
              className="border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-xs uppercase tracking-[0.05em] text-planton-muted">
              Senha
            </label>
            <input
              type="password"
              className="border-b border-border bg-transparent py-2 font-sans text-sm text-planton-forest outline-none focus:border-planton-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button variant="primary" className="mt-2 w-full justify-center">
            Entrar
          </Button>
        </form>

        <Body size="sm" muted>
          Não tem conta?{' '}
          <a href="#" className="text-planton-accent underline-offset-2 hover:underline">
            Solicitar acesso
          </a>
        </Body>
      </div>
    </div>
  )
}
