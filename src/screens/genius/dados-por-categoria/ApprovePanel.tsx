'use client'

import { Check, Users, Building2, AlertCircle, Lock } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import type { CategoriaResumo } from './dados-data'

export function FilialOverviewPanel({
  resumo,
  categoriaLabel,
  locked,
  onAprovar,
}: {
  resumo: CategoriaResumo
  categoriaLabel: string
  locked?: boolean
  onAprovar: () => void
}) {
  if (locked) {
    return (
      <div className="flex flex-col h-full min-h-0 border border-border/50 rounded-md bg-transparent">
        <div className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-b border-border/50">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-[13px] font-sans text-muted-foreground">Aprovação bloqueada</span>
        </div>
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center gap-3 px-4 py-8">
          <div className="grid place-content-center h-12 w-12 rounded-full bg-destructive-surface">
            <Lock className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-[13px] text-foreground max-w-[240px]">
            {categoriaLabel} foi reprovada e devolvida ao respondente.
          </p>
          <p className="text-[12px] text-muted-foreground max-w-[240px]">
            A aprovação só fica disponível depois que o respondente corrigir e reenviar as linhas recusadas.
          </p>
        </div>
      </div>
    )
  }

  const totalFiliais = resumo.porRespondente.reduce((a, r) => a + r.filiais.length, 0)
  const semDados = resumo.porRespondente.reduce((a, r) => a + r.filiais.filter((f) => !f.temDados).length, 0)

  return (
    <div className="flex flex-col h-full min-h-0 border border-success-border/50 rounded-md bg-transparent">
      <div className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-b border-success-border/50">
        <Check className="h-4 w-4 text-success" />
        <span className="text-[13px] font-sans text-success">Aprovar categoria</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Filiais" value={String(totalFiliais)} />
          <Stat label="Sem dados" value={String(semDados)} warn={semDados > 0} />
        </div>

        {semDados > 0 && (
          <div className="flex items-start gap-2 rounded-md border border-warning-border bg-warning-surface px-2.5 py-2 text-[11px] text-warning">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{semDados} filial(ais) sem dados enviados. Serão marcadas como pendentes.</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {resumo.porRespondente.map((resp) => (
            <div key={resp.respondente} className="rounded-md border border-border/60 bg-background/40 overflow-hidden">
              <div className="flex items-center gap-2 px-2.5 py-2 border-b border-border/40">
                <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-[12px] font-medium text-foreground truncate">{resp.respondente}</span>
                <span className="ml-auto text-[10px] text-muted-foreground tabular-nums shrink-0">
                  {resp.filiais.length} filial(ais)
                </span>
              </div>
              <ul className="flex flex-col divide-y divide-border/30">
                {resp.filiais.map((f) => (
                  <li key={f.unidade} className="flex items-center gap-2 px-2.5 py-1.5">
                    <Building2 className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                    <span className="text-[11px] text-foreground truncate flex-1">{f.unidade}</span>
                    {f.temDados ? (
                      <span className="text-[10px] text-success shrink-0">
                        {f.linhas} linha{f.linhas !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-[10px] text-warning shrink-0 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        sem dados
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-success-border px-3 py-2.5">
        <Button
          className="w-full bg-success text-success-foreground hover:bg-success/90"
          onClick={onAprovar}
        >
          <Check className="h-4 w-4" />
          Aprovar {categoriaLabel}
        </Button>
      </div>
    </div>
  )
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-md border border-border/60 bg-background/40 px-2.5 py-2">
      <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-[16px] font-sans tabular-nums ${warn ? 'text-warning' : 'text-foreground'}`}>{value}</div>
    </div>
  )
}
