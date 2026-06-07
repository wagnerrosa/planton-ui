'use client'

import { ChevronLeft, ChevronRight, Check, X, Clock } from 'lucide-react'
import { findReviewCategory, type Periodo, type ReviewDecision } from './dados-data'

const DECISION_META: Record<
  ReviewDecision,
  { label: string; dot: string; cell: string; Icon: typeof Check }
> = {
  pendente: {
    label: 'Em revisão',
    dot: 'bg-info',
    cell: 'bg-info-surface border-info-border text-info',
    Icon: Clock,
  },
  aprovado: {
    label: 'Aprovado',
    dot: 'bg-success',
    cell: 'bg-success-surface border-success-border text-success',
    Icon: Check,
  },
  reprovado: {
    label: 'Reprovado',
    dot: 'bg-destructive',
    cell: 'bg-destructive-surface border-destructive-border text-destructive',
    Icon: X,
  },
}

export function ReviewToolbar({
  categoriaId,
  periodos,
  periodoId,
  onPeriodo,
  decisions,
}: {
  categoriaId: string
  periodos: Periodo[]
  periodoId: string
  onPeriodo: (id: string) => void
  /** decisão por categoria → chip de status */
  decisions: Record<string, ReviewDecision>
}) {
  const perIdx = periodos.findIndex((p) => p.id === periodoId)
  const periodo = periodos[perIdx]
  const decision = decisions[categoriaId] ?? 'pendente'
  const dm = DECISION_META[decision]
  const cat = findReviewCategory(categoriaId)

  function stepPer(dir: -1 | 1) {
    const next = perIdx + dir
    if (next < 0 || next >= periodos.length) return
    onPeriodo(periodos[next].id)
  }

  return (
    <div className="flex items-center gap-4 border-b border-border/60 px-6 py-3.5 bg-background/80 backdrop-blur-sm">
      {/* Título da categoria ativa — a navegação vive na sidebar à esquerda */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="grid place-content-center h-8 w-8 shrink-0 bg-planton-accent/12 text-foreground">
          <cat.icon className="h-4 w-4" />
        </span>
        <span className="flex flex-col min-w-0">
          <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground/70">
            Escopo {cat.scope}
          </span>
          <span className="text-[14px] font-heading font-medium text-foreground truncate -mt-0.5">
            {cat.label}
          </span>
        </span>
      </div>

      <div className="flex-1" />

      {/* Período stepper */}
      <div className="flex items-center gap-1 h-8 border border-border/70 px-1 shrink-0">
        <button
          onClick={() => stepPer(-1)}
          disabled={perIdx <= 0}
          className="grid place-content-center h-6 w-6 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Período anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-[13px] font-heading font-medium tabular-nums text-foreground text-center min-w-[84px] px-1">
          {periodo?.label}
        </span>
        <button
          onClick={() => stepPer(1)}
          disabled={perIdx >= periodos.length - 1}
          className="grid place-content-center h-6 w-6 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Próximo período"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Decisão atual da categoria */}
      <span
        className={`inline-flex items-center gap-1.5 h-8 border px-2.5 text-[11px] font-sans shrink-0 ${dm.cell}`}
      >
        <dm.Icon className="h-3 w-3" />
        {dm.label}
      </span>
    </div>
  )
}
