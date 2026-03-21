'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Button } from '@/components/primitives/Button'
import { Separator } from '@/components/shadcn/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/shadcn/sheet'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('overlays', 'sheet')!

export default function SheetPage() {
  return (
    <ComponentPage
      category="Overlays"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Sheet pela direita (padrão)</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="primary">Abrir menu</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu lateral</SheetTitle>
              <SheetDescription>
                Painel deslizante usado para navegação, filtros ou configurações secundárias.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-3 mt-6">
              <div className="px-2 py-2 text-sm text-foreground hover:bg-accent rounded cursor-default">Meu perfil</div>
              <div className="px-2 py-2 text-sm text-foreground hover:bg-accent rounded cursor-default">Configurações</div>
              <div className="px-2 py-2 text-sm text-foreground hover:bg-accent rounded cursor-default">Trilhas</div>
              <div className="px-2 py-2 text-sm text-foreground hover:bg-accent rounded cursor-default">Suporte</div>
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Sheet pela esquerda</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Abrir sidebar</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Navegação</SheetTitle>
              <SheetDescription>
                Usado no mobile para exibir a sidebar do Academy como overlay.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-3 mt-6">
              <div className="px-2 py-2 text-sm text-foreground hover:bg-accent rounded cursor-default">Home</div>
              <div className="px-2 py-2 text-sm text-foreground hover:bg-accent rounded cursor-default">Trilhas</div>
              <div className="px-2 py-2 text-sm text-foreground hover:bg-accent rounded cursor-default">Conteúdos</div>
            </div>
          </SheetContent>
        </Sheet>
      </section>
    </ComponentPage>
  )
}
