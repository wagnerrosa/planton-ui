'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { findReviewCategory, type Periodo, type ReviewDecision } from './dados-data'

export function ReviewToolbar({
  categoriaId,
  periodos,
  periodoId,
  onPeriodo,
  decision = 'pendente',
}: {
  categoriaId: string
  periodos: Periodo[]
  periodoId: string
  onPeriodo: (id: string) => void
  decisions: Record<string, ReviewDecision>
  decision?: ReviewDecision
}) {
  const perIdx = periodos.findIndex((p) => p.id === periodoId)
  const periodo = periodos[perIdx]
  const cat = findReviewCategory(categoriaId)

  function stepPer(dir: -1 | 1) {
    const next = perIdx + dir
    if (next < 0 || next >= periodos.length) return
    onPeriodo(periodos[next].id)
  }

  return (
    <div className="flex items-center gap-2 border-b border-border px-4 h-12 shrink-0 bg-background">
      <cat.icon size={16} className="text-muted-foreground shrink-0" />
      <h2 className="text-sm font-semibold font-sans text-foreground truncate min-w-0">
        {cat.label}
        <span className="text-muted-foreground font-normal ml-2 text-[12px]">· Escopo {cat.scope}</span>
      </h2>

      {/* Banner de decisão — inline no header, espelha aviso do ChatScreen */}
      {decision !== 'pendente' && (
        <span
          className={`flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium shrink-0 border ${
            decision === 'aprovado'
              ? 'bg-success-surface border-success-border text-success'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}
        >
          {decision === 'aprovado' ? 'Categoria aprovada' : 'Reprovada · devolvida ao respondente'}
        </span>
      )}

      <div className="flex-1" />

      {/* Período stepper */}
      <div className="flex items-center gap-1 h-7 border border-border/70 px-1 shrink-0">
        <button
          onClick={() => stepPer(-1)}
          disabled={perIdx <= 0}
          className="grid place-content-center h-5 w-5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Período anterior"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="text-[12px] font-sans tabular-nums text-foreground text-center min-w-[76px] px-1">
          {periodo?.label}
        </span>
        <button
          onClick={() => stepPer(1)}
          disabled={perIdx >= periodos.length - 1}
          className="grid place-content-center h-5 w-5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Próximo período"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
