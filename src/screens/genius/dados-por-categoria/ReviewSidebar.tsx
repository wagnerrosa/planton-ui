'use client'

import { REVIEW_CATEGORIES, type ReviewDecision } from './dados-data'

export function ReviewSidebar({
  categoriaId,
  onCategoria,
  decisions,
  open,
}: {
  categoriaId: string
  onCategoria: (id: string) => void
  decisions: Record<string, ReviewDecision>
  open: boolean
}) {
  return (
    <div
      className={`${open ? 'w-56' : 'w-12'} shrink-0 flex flex-col border-r border-border bg-muted/20 transition-[width] duration-200 overflow-y-auto overflow-x-hidden py-2`}
    >
      {([1, 2, 3] as const).map((scope) => {
        const scopeCats = REVIEW_CATEGORIES.filter((c) => c.scope === scope)
        if (scopeCats.length === 0) return null
        return (
          <div key={scope} className="flex flex-col">
            {open ? (
              <div className="px-3 pt-3 pb-1 text-[9px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                Escopo {scope}
              </div>
            ) : (
              scope > 1 && <div className="mx-3 my-1 border-t border-border/40" />
            )}
            <ul className="flex flex-col">
              {scopeCats.map((cat) => {
                const Icon = cat.icon
                const isActive = cat.id === categoriaId
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => onCategoria(cat.id)}
                      title={cat.label}
                      className={`w-full flex items-center py-2 text-xs font-sans transition-colors ${
                        open ? 'gap-2.5 px-3 justify-start' : 'justify-center px-0'
                      } ${
                        isActive
                          ? 'bg-planton-accent/12 text-foreground font-semibold'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      <Icon size={15} className="shrink-0" />
                      {open && <span className="truncate text-left">{cat.label}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
