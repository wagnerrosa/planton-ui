'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/shadcn/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import type { Client } from '../mock-data'

type ClientComboboxProps = {
  clients: Client[]
  selectedCnpj: string | null
  onSelect: (cnpj: string) => void
}

export function ClientCombobox({ clients, selectedCnpj, onSelect }: ClientComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = clients.find((c) => c.cnpj === selectedCnpj) ?? null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full flex items-center justify-between gap-2',
            'h-12 px-4 rounded-md border border-border bg-background',
            'text-base text-left font-sans',
            'hover:border-planton-accent focus:outline-none focus:ring-2 focus:ring-planton-accent focus:border-transparent',
            'transition-colors',
          )}
        >
          {selected ? (
            <span className="flex flex-col min-w-0">
              <span className="truncate text-sm font-medium text-foreground">{selected.name}</span>
              <span className="truncate text-xs text-muted-foreground">{selected.cnpj}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Buscar cliente por nome ou CNPJ…</span>
          )}
          <ChevronsUpDown size={16} className="shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)]"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Digite nome ou CNPJ…" className="text-base" />
          <CommandList>
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {clients.map((client) => {
                const isActive = client.cnpj === selectedCnpj
                return (
                  <CommandItem
                    key={client.cnpj}
                    value={`${client.name} ${client.cnpj}`}
                    onSelect={() => {
                      onSelect(client.cnpj)
                      setOpen(false)
                    }}
                    className="py-3"
                  >
                    <Check
                      size={16}
                      className={cn('mr-2 shrink-0', isActive ? 'opacity-100 text-planton-accent' : 'opacity-0')}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-sm font-medium">{client.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {client.cnpj} · {client.sector}
                      </span>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
