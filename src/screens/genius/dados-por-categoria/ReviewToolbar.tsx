'use client'

import { ChevronLeft, ChevronRight, Check, X, Clock } from 'lucide-react'
import { REVIEW_CATEGORIES, type Periodo, type ReviewDecision } from './dados-data'

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
  onCategoria,
  periodos,
  periodoId,
  onPeriodo,
  periodoTipoLabel,
  decisions,
}: {
  categoriaId: string
  onCategoria: (id: string) => void
  periodos: Periodo[]
  periodoId: string
  onPeriodo: (id: string) => void
  periodoTipoLabel: string
  /** decisão por categoria → dot no chip */
  decisions: Record<string, ReviewDecision>
}) {
  const catIdx = REVIEW_CATEGORIES.findIndex((c) => c.id === categoriaId)
  const perIdx = periodos.findIndex((p) => p.id === periodoId)
  const periodo = periodos[perIdx]
  const decision = decisions[categoriaId] ?? 'pendente'
  const dm = DECISION_META[decision]

  function stepCat(dir: -1 | 1) {
    const next = (catIdx + dir + REVIEW_CATEGORIES.length) % REVIEW_CATEGORIES.length
    onCategoria(REVIEW_CATEGORIES[next].id)
  }
  function stepPer(dir: -1 | 1) {
    const next = perIdx + dir
    if (next < 0 || next >= periodos.length) return
    onPeriodo(periodos[next].id)
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border px-6 py-3">
      {/* Linha 1: categoria nav + período + decisão */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            onClick={() => stepCat(-1)}
            className="grid place-content-center h-7 w-7 rounded-md border border-border text-muted-foreground hover:bg-accent transition-colors"
            aria-label="Categoria anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => stepCat(1)}
            className="grid place-content-center h-7 w-7 rounded-md border border-border text-muted-foreground hover:bg-accent transition-colors"
            aria-label="Próxima categoria"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
            Escopo {REVIEW_CATEGORIES[catIdx]?.scope} · categoria {catIdx + 1}/{REVIEW_CATEGORIES.length}
          </span>
          <span className="text-[15px] font-sans text-foreground">
            {REVIEW_CATEGORIES[catIdx]?.label}
          </span>
        </div>

        <div className="flex-1" />

        {/* Período stepper */}
        <div className="flex items-center gap-1 rounded-md border border-border px-1 py-0.5">
          <button
            onClick={() => stepPer(-1)}
            disabled={perIdx <= 0}
            className="grid place-content-center h-6 w-6 rounded text-muted-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Período anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-col items-center min-w-[88px] px-1">
            <span className="text-[9px] font-heading uppercase tracking-wider text-muted-foreground/70">
              {periodoTipoLabel}
            </span>
            <span className="text-[13px] font-sans text-foreground">
              {periodo?.label}
            </span>
          </div>
          <button
            onClick={() => stepPer(1)}
            disabled={perIdx >= periodos.length - 1}
            className="grid place-content-center h-6 w-6 rounded text-muted-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Próximo período"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Decisão atual da categoria */}
        <span
          className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[11px] font-sans ${dm.cell}`}
        >
          <dm.Icon className="h-3 w-3" />
          {dm.label}
        </span>
      </div>

      {/* Linha 2: chips de todas as categorias com dot de decisão */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1">
        {REVIEW_CATEGORIES.map((c) => {
          const active = c.id === categoriaId
          const d = decisions[c.id] ?? 'pendente'
          return (
            <button
              key={c.id}
              onClick={() => onCategoria(c.id)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-sans transition-colors ${
                active
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:bg-accent'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DECISION_META[d].dot}`} />
              <c.icon className="h-3 w-3" />
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
