'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/shadcn/hover-card'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('overlays', 'hover-card')!

export default function HoverCardPage() {
  return (
    <ComponentPage
      category="Overlays"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Preview ao passar o mouse</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Conteúdo vinculado:</span>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="text-sm text-foreground underline underline-offset-4 cursor-pointer hover:text-muted-foreground transition-colors">
                Gestão de Emissões de GEE
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-72">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-foreground">Gestão de Emissões de GEE</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Trilha completa sobre inventário e gestão de gases de efeito estufa seguindo o GHG Protocol.
                </p>
                <div className="flex gap-4 pt-1">
                  <span className="text-xs text-muted-foreground">Duração: 4h 30min</span>
                  <span className="text-xs text-muted-foreground">12 conteúdos</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </section>
    </ComponentPage>
  )
}
