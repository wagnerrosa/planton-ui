'use client'

import { useState } from 'react'
import { AlertTriangle, ChevronRight, Check } from 'lucide-react'
import type { AttentionItem } from '../dashboard-gerencial/dashboard-data'
import { SEVERITY_META } from './v2-derive'

const PREVIEW_COUNT = 3

export function AttentionList({
  items,
  onOpen,
}: {
  items: AttentionItem[]
  onOpen: (filialId: string, categoriaId?: string) => void
}) {
  const [expanded, setExpanded] = useState(false)

  // Tudo em dia → estado positivo enxuto.
  if (items.length === 0) {
    return (
      <div className="bg-card border border-border p-4 flex items-center gap-2.5">
        <span className="flex items-center justify-center w-7 h-7 bg-success-surface text-success shrink-0">
          <Check size={15} />
        </span>
        <div>
          <p className="text-[13px] font-sans font-medium text-foreground">Tudo em dia</p>
          <p className="text-[11px] font-sans text-muted-foreground">
            Nenhuma pendência requer atenção no momento.
          </p>
        </div>
      </div>
    )
  }

  const visible = expanded ? items : items.slice(0, PREVIEW_COUNT)
  const hidden = items.length - PREVIEW_COUNT

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-1.5 font-heading text-[13px] font-semibold text-foreground">
          <AlertTriangle size={14} className="text-warning" />
          Precisa de atenção
          <span className="px-1.5 py-0.5 bg-destructive-surface text-destructive text-[10px] font-sans font-semibold tabular-nums">
            {items.length}
          </span>
        </h2>
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-[11px] font-sans font-medium text-planton-accent hover:underline"
          >
            {expanded ? 'Mostrar menos' : `Ver tudo (${items.length})`}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {visible.map((item) => {
          const sev = SEVERITY_META[item.severity]
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpen(item.filialId, item.categoriaId)}
              className={`group flex items-center gap-3 bg-card border border-border border-l-2 ${sev.surfaceClass} px-3.5 py-2.5 text-left hover:bg-muted/30 transition-colors`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sev.dotClass}`} />
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-sans font-medium text-foreground truncate">
                  {item.headline}
                </p>
                <p className="text-[11px] font-sans text-muted-foreground truncate mt-0.5">
                  {item.detail}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-sans font-medium shrink-0 ${sev.accentClass}`}
              >
                {item.action}
                <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
