'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { StatusBadge } from './StatusBadge'
import {
  EMPRESA_STATUS_CONFIG,
  FORNECEDOR_STATUS_CONFIG,
  type EmpresaStatus,
  type FornecedorStatus,
} from '../mock-data'

type StatusSelectProps = {
  currentStatus: EmpresaStatus | FornecedorStatus
  tipo: 'empresa' | 'fornecedor'
  onStatusChange: (status: EmpresaStatus | FornecedorStatus) => void
}

export function StatusSelect({ currentStatus, tipo, onStatusChange }: StatusSelectProps) {
  const [open, setOpen] = useState(false)

  const statusConfig = tipo === 'fornecedor' ? FORNECEDOR_STATUS_CONFIG : EMPRESA_STATUS_CONFIG
  const statusOptions = Object.entries(statusConfig).map(([key, value]) => ({
    value: key as EmpresaStatus | FornecedorStatus,
    label: value.label,
  }))

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm hover:bg-muted/50 transition-colors">
          <StatusBadge status={currentStatus} tipo={tipo} />
          <ChevronDown size={14} className="opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <div className="px-2 py-1.5 text-xs text-muted-foreground uppercase tracking-wider font-sans">
          Alterar Status
        </div>
        <DropdownMenuSeparator />
        {statusOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={currentStatus === option.value}
            onCheckedChange={() => {
              onStatusChange(option.value)
              setOpen(false)
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <StatusBadge status={option.value} tipo={tipo} />
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
