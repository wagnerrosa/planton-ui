'use client'

import { Building2 } from 'lucide-react'
import type { Client, MaterialType } from '../mock-data'
import { MATERIALS, YEAR_OPTIONS, getMaterialLabel } from '../mock-data'

type ExistingClientSummaryProps = {
  client: Client
}

export function ExistingClientSummary({ client }: ExistingClientSummaryProps) {
  const byYearMaterial = new Map<string, number>()
  for (const entry of client.recycling) {
    byYearMaterial.set(`${entry.year}-${entry.material}`, entry.tons)
  }

  const years = [...YEAR_OPTIONS].sort((a, b) => b - a)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-planton-accent/10">
            <Building2 size={18} className="text-planton-accent" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-foreground truncate">{client.name}</span>
            <span className="text-xs text-muted-foreground font-mono">{client.cnpj}</span>
            <span className="mt-1 inline-flex w-fit items-center rounded-full bg-background border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
              {client.sector}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="px-3 py-2 bg-muted/40 border-b border-border">
          <span className="text-xs font-medium text-foreground">Histórico de reciclagem (toneladas)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Ano</th>
                {MATERIALS.map((m) => (
                  <th key={m.value} className="text-right px-3 py-2 font-medium text-muted-foreground">
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {years.map((year) => (
                <tr key={year} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 font-medium text-foreground">{year}</td>
                  {MATERIALS.map((m) => {
                    const tons = byYearMaterial.get(`${year}-${m.value as MaterialType}`)
                    return (
                      <td key={m.value} className="px-3 py-2 text-right text-foreground tabular-nums">
                        {tons ? `${tons} t` : <span className="text-muted-foreground/60">—</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Dados pré-cadastrados de <span className="font-medium text-foreground">{getMaterialLabel('plastico')}, {getMaterialLabel('papel')}, {getMaterialLabel('vidro')} e {getMaterialLabel('metal')}</span> serão usados na LP.
      </p>
    </div>
  )
}
