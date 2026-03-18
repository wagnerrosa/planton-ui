'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Button } from '@/components/primitives/Button'
import { Separator } from '@/components/shadcn/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('overlays', 'dropdown-menu')!

export default function DropdownMenuPage() {
  return (
    <ComponentPage
      category="Overlays"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Interativo - clique em Ações</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="primary">Ações</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Revogar voucher</DropdownMenuItem>
            <DropdownMenuItem>Reativar empresa</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Preview estático - estrutura do menu</h2>
        <div className="w-48 border border-border bg-popover shadow-md">
          <div className="px-2 py-1.5 text-sm text-foreground hover:bg-accent cursor-default">Ver detalhes</div>
          <div className="px-2 py-1.5 text-sm text-foreground hover:bg-accent cursor-default">Editar</div>
          <div className="px-2 py-1.5 text-sm text-foreground hover:bg-accent cursor-default">Revogar voucher</div>
          <div className="px-2 py-1.5 text-sm text-foreground hover:bg-accent cursor-default">Reativar empresa</div>
          <div className="my-1 h-px bg-border" />
          <div className="px-2 py-1.5 text-sm text-destructive hover:bg-accent cursor-default">Excluir</div>
        </div>
      </section>
    </ComponentPage>
  )
}
