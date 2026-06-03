import { AlertTriangle, X, RotateCcw, UserX, ArrowRight } from 'lucide-react'
import type { AttentionItem } from './dashboard-data'

const SEVERITY_ICON = {
  reprov: RotateCcw,
  crit: X,
  warn: UserX,
  info: AlertTriangle,
} as const

const SEVERITY_CLASS = {
  reprov: 'bg-destructive-surface text-destructive border-destructive-border',
  crit: 'bg-destructive-surface text-destructive border-destructive-border',
  warn: 'bg-warning-surface text-warning border-warning-border',
  info: 'bg-info-surface text-info border-info-border',
} as const

export function AttentionPanel({
  items,
  onOpen,
}: {
  items: AttentionItem[]
  onOpen: (filialId: string, categoriaId: string) => void
}) {
  if (items.length === 0) return null

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border">
        <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
          Precisa da sua atenção
          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-destructive-surface text-destructive text-[11px] font-sans font-semibold">
            {items.length}
          </span>
        </h2>
        <span className="text-[11px] font-sans text-muted-foreground">
          Priorizado por impacto · clique para ver detalhes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {items.map((item, i) => {
          const Icon = SEVERITY_ICON[item.severity]
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpen(item.filialId, item.categoriaId)}
              className={`group flex items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/40 border-border ${
                i % 2 === 0 ? 'md:border-r' : ''
              } ${i >= 2 ? 'border-t' : i >= 1 ? 'border-t md:border-t-0' : ''}`}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 shrink-0 border ${SEVERITY_CLASS[item.severity]}`}
              >
                <Icon size={15} />
              </span>
              <span className="flex flex-col min-w-0 flex-1 gap-0.5">
                <span className="text-[13px] font-sans font-medium text-foreground leading-snug">
                  {item.headline}
                </span>
                <span className="text-[11px] font-sans text-muted-foreground leading-snug">
                  {item.detail}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-sans font-medium text-planton-accent">
                  {item.action}
                  <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
