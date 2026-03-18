'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('data-display', 'avatar')!

export default function AvatarPage() {
  return (
    <ComponentPage
      category="Data Display"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Tamanhos e estados</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex flex-col gap-2 items-center">
            <Avatar>
              <AvatarImage src="https://placehold.co/40x40/png" alt="Colaborador" />
              <AvatarFallback>CO</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">Com imagem</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Avatar>
              <AvatarFallback>WR</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">Wagner Rosa</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg">SA</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">SA - maior</span>
          </div>
        </div>
      </section>
    </ComponentPage>
  )
}
