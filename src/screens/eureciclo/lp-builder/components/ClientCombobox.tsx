'use client'

import React, { useState } from 'react'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/shadcn/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import type { Client } from '../mock-data'

type ClientComboboxProps = {
  clients: Client[]
  selectedCnpj: string | null
  onSelect: (cnpj: string) => void
}

function ClientList({
  clients,
  selectedCnpj,
  onSelect,
}: {
  clients: Client[]
  selectedCnpj: string | null
  onSelect: (cnpj: string) => void
}) {
  return (
    <Command className="flex flex-col h-full">
      <CommandInput placeholder="Digite nome ou CNPJ…" className="text-base md:text-sm shrink-0" />
      <CommandList className="flex-1 overflow-y-auto">
        <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
        <CommandGroup>
          {clients.map((client) => {
            const isActive = client.cnpj === selectedCnpj
            return (
              <CommandItem
                key={client.cnpj}
                value={`${client.name} ${client.cnpj}`}
                onSelect={() => onSelect(client.cnpj)}
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
  )
}

function TriggerButton({ selected, onClick, ...props }: { selected: Client | null; onClick?: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      onClick={onClick}
      {...props}
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
        <span className="text-muted-foreground text-base md:text-sm">Buscar cliente por nome ou CNPJ…</span>
      )}
      <ChevronsUpDown size={16} className="shrink-0 text-muted-foreground" />
    </button>
  )
}

export function ClientCombobox({ clients, selectedCnpj, onSelect }: ClientComboboxProps) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const selected = clients.find((c) => c.cnpj === selectedCnpj) ?? null

  const handleSelect = (cnpj: string) => {
    onSelect(cnpj)
    setOpen(false)
  }

  if (isMobile) {
    return (
      <>
        <TriggerButton selected={selected} onClick={() => setOpen(true)} />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="top" className="p-0 rounded-b-xl flex flex-col max-h-[55%]">
            <SheetHeader className="px-4 pt-4 pb-2 shrink-0">
              <SheetTitle className="text-base">Selecionar cliente</SheetTitle>
            </SheetHeader>
            <div className="flex-1 min-h-0 overflow-hidden">
              <ClientList clients={clients} selectedCnpj={selectedCnpj} onSelect={handleSelect} />
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TriggerButton selected={selected} />
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)]"
        align="start"
      >
        <ClientList clients={clients} selectedCnpj={selectedCnpj} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  )
}
