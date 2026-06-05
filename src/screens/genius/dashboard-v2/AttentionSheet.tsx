'use client'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/shadcn/sheet'
import type { AttentionItem } from '../dashboard-gerencial/dashboard-data'
import { SEVERITY_META } from './v2-derive'


export function AttentionSheet({
  open,
  items,
  onOpenChange,
  onOpenItem,
}: {
  open: boolean
  items: AttentionItem[]
  onOpenChange: (open: boolean) => void
  onOpenItem: (filialId: string, categoriaId?: string) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col gap-0 overflow-hidden">
        <VisuallyHidden>
          <SheetTitle>Pendências que precisam de atenção</SheetTitle>
          <SheetDescription>Lista priorizada de combinações filial × categoria</SheetDescription>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border shrink-0">
          <div>
            <div className="font-heading text-base font-semibold text-foreground leading-tight">
              Precisa de atenção
            </div>
            <div className="text-[12px] font-sans text-muted-foreground mt-0.5">
              {items.length} {items.length === 1 ? 'pendência' : 'pendências'} priorizadas
            </div>
          </div>
        </div>

        {/* Lista completa */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {items.map((item) => {
            const sev = SEVERITY_META[item.severity]
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onOpenItem(item.filialId, item.categoriaId)
                  onOpenChange(false)
                }}
                className="group w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-muted/40 transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sev.dotClass}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-sans font-medium text-foreground truncate leading-snug">
                    {item.headline}
                  </p>
                  <p className="text-[11px] font-sans text-muted-foreground truncate mt-0.5">
                    {item.detail}
                  </p>
                </div>
                <ChevronRight size={13} className="text-muted-foreground/50 shrink-0 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
              </button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
