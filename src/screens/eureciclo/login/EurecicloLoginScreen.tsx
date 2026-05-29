'use client'

import { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react'
import { Button } from '@/components/primitives/Button'

const PIN_LENGTH = 4

type EurecicloLoginScreenProps = {
  onLogin?: () => void
}

export function EurecicloLoginScreen({ onLogin }: EurecicloLoginScreenProps) {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''))
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    if (digit && index < PIN_LENGTH - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH)
    const next = Array(PIN_LENGTH).fill('')
    pasted.split('').forEach((d, i) => { next[i] = d })
    setDigits(next)
    const focusIndex = Math.min(pasted.length, PIN_LENGTH - 1)
    inputs.current[focusIndex]?.focus()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (digits.every(Boolean)) onLogin?.()
  }

  const pinComplete = digits.every(Boolean)

  return (
    <main className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-10">

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-2xl font-heading font-semibold tracking-tight text-foreground">
            Jornada de Descarbonização
          </p>
          <p className="text-sm text-muted-foreground font-sans">
            Digite seu PIN de acesso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center justify-center gap-3">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                className="w-14 h-16 rounded-xl border border-input bg-background text-center text-2xl font-semibold text-foreground shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 caret-transparent"
              />
            ))}
          </div>

          <Button
            variant="secondary"
            type="submit"
            className="w-full justify-center"
            disabled={!pinComplete}
          >
            Acessar
          </Button>
        </form>

        <div className="flex items-center justify-center gap-4 pt-2">
          <a href="https://eureciclo.com.br" target="_blank" rel="noopener noreferrer">
            <img src="/eureciclo.svg" alt="eureciclo" className="h-10 w-auto" />
          </a>
          <div className="h-8 w-px bg-border" />
          <a href="https://planton.eco.br" target="_blank" rel="noopener noreferrer">
            <img src="/Logo_Planton_forest.svg" alt="Planton" className="h-[26px] w-auto" />
          </a>
        </div>

      </div>
    </main>
  )
}
