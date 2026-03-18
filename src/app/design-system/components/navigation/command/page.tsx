'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/shadcn/command'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('navigation', 'command')!

export default function CommandPage() {
  return (
    <ComponentPage
      category="Navigation"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Paleta de comandos</h2>
        <div className="border border-border max-w-sm">
          <Command>
            <CommandInput placeholder="Buscar conteúdo ou trilha..." />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup heading="Trilhas">
                <CommandItem>Gestão de Emissões de GEE</CommandItem>
                <CommandItem>Fundamentos ESG</CommandItem>
                <CommandItem>GHG Protocol Avançado</CommandItem>
              </CommandGroup>
              <CommandGroup heading="Conteúdos">
                <CommandItem>Introdução ao Inventário de GEE</CommandItem>
                <CommandItem>Relatórios GRI 404 na Prática</CommandItem>
                <CommandItem>Escopo 1, 2 e 3 - Diferenças</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </section>
    </ComponentPage>
  )
}
