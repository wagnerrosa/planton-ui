'use client'

import { useState } from 'react'
import { Copy, Check, Search, ExternalLink } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import type { LPRecord } from '../mock-data'

type LPHistoryTabProps = {
  records: LPRecord[]
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copiado!' : 'Copiar link'}
      className="group flex items-center gap-1.5 max-w-full min-w-0"
    >
      <span className="truncate text-xs font-mono text-planton-accent group-hover:underline">
        {url.replace('https://', '')}
      </span>
      <span className="shrink-0 text-muted-foreground group-hover:text-planton-accent transition-colors">
        {copied ? <Check size={13} className="text-planton-accent" /> : <Copy size={13} />}
      </span>
    </button>
  )
}

export function LPHistoryTab({ records }: LPHistoryTabProps) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? records.filter((r) => {
        const q = query.toLowerCase()
        return (
          r.clientName.toLowerCase().includes(q) ||
          r.cnpj.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
          r.cnpj.toLowerCase().includes(q)
        )
      })
    : records

  return (
    <div className="flex flex-col gap-0">
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar por nome ou CNPJ…"
          className="h-11 pl-9 text-base"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
          <Search size={28} className="opacity-30" />
          <span className="text-sm">Nenhum link enviado.</span>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-lg border border-border overflow-auto max-h-[480px]">
            <table className="min-w-[700px] w-full text-sm font-sans">
              <thead className="sticky top-0 z-10 bg-muted">
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Nome</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">CNPJ</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">E-mail(s)</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Link da LP</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Acessos</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Enviado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{r.clientName}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{r.cnpj}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        {r.emails.map((e) => (
                          <span key={e} className="text-xs text-muted-foreground truncate max-w-[200px]">{e}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <div className="flex items-center gap-1">
                        <CopyLinkButton url={r.lpUrl} />
                        <a
                          href={r.lpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-muted-foreground hover:text-planton-accent transition-colors"
                          aria-label="Abrir LP"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                      {r.accessCount}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(r.sentAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((r) => (
              <div key={r.id} className="rounded-lg border border-border bg-background p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-foreground truncate">{r.clientName}</span>
                    <span className="text-xs text-muted-foreground">{r.cnpj}</span>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-0.5">
                    <span className={`text-sm font-medium tabular-nums ${r.accessCount > 0 ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                      {r.accessCount} acessos
                    </span>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {formatDate(r.sentAt)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">E-mails</span>
                  {r.emails.map((e) => (
                    <span key={e} className="text-xs text-muted-foreground break-all">{e}</span>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Link da LP</span>
                  <div className="flex items-center gap-1">
                    <CopyLinkButton url={r.lpUrl} />
                    <a
                      href={r.lpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-muted-foreground hover:text-planton-accent transition-colors"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <span className="text-[11px] text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'link enviado' : 'links enviados'}
            {' · '}
            {filtered.reduce((sum, r) => sum + r.accessCount, 0).toLocaleString('pt-BR')} acessos
            {query && ` · filtrando por "${query}"`}
          </span>
        </>
      )}
    </div>
  )
}
