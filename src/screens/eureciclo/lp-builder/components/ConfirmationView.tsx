'use client'

import { CheckCircle2, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/primitives/Button'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'

type ConfirmationViewProps = {
  emails: string[]
  clientName: string
  lpUrl: string
  onReset: () => void
}

export function ConfirmationView({ emails, clientName, lpUrl, onReset }: ConfirmationViewProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(lpUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col items-center text-center gap-6 py-10">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-planton-accent/10">
        <CheckCircle2 size={36} className="text-planton-accent" />
      </div>

      <div className="flex flex-col gap-2 max-w-md">
        <Heading as="h2" size="heading-md">
          LP enviada com sucesso
        </Heading>
        <Body size="sm" muted>
          A landing page de <span className="font-medium text-foreground">{clientName}</span>{' '}
          foi enviada para{' '}
          {emails.length === 1 ? (
            <span className="font-medium text-foreground break-all">{emails[0]}</span>
          ) : (
            <span className="font-medium text-foreground">
              {emails.length} destinatários
            </span>
          )}
          .
        </Body>
        {emails.length > 1 && (
          <div className="flex flex-col gap-1 mt-1">
            {emails.map((e) => (
              <span key={e} className="text-xs text-muted-foreground break-all">{e}</span>
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-md flex flex-col gap-2">
        <span className="text-xs font-medium text-foreground text-left">Link da LP gerada</span>
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2.5">
          <a
            href={lpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 text-xs font-mono text-planton-accent hover:underline truncate"
          >
            {lpUrl}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copiar link"
            className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy size={13} />
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
          <a
            href={lpUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir link"
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <Button variant="secondary" onClick={onReset} className="w-full sm:w-auto">
        Criar outra LP
      </Button>
    </div>
  )
}
