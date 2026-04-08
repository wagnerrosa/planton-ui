'use client'

import { useState, type ReactElement } from 'react'
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

type EmpresaStatusSelectProps = {
  currentStatus: EmpresaStatus
  tipo: 'empresa'
  onStatusChange: (status: EmpresaStatus) => void
}

type FornecedorStatusSelectProps = {
  currentStatus: FornecedorStatus
  tipo: 'fornecedor'
  onStatusChange: (status: FornecedorStatus) => void
}

type StatusSelectProps = EmpresaStatusSelectProps | FornecedorStatusSelectProps

export function StatusSelect(props: EmpresaStatusSelectProps): ReactElement
export function StatusSelect(props: FornecedorStatusSelectProps): ReactElement

export function StatusSelect(props: StatusSelectProps) {
  const [open, setOpen] = useState(false)

  if (props.tipo === 'fornecedor') {
    const statusOptions = Object.entries(FORNECEDOR_STATUS_CONFIG).map(([key, value]) => ({
      value: key as FornecedorStatus,
      label: value.label,
    }))

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm hover:bg-muted/50 transition-colors">
            <StatusBadge status={props.currentStatus} tipo={props.tipo} />
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
              checked={props.currentStatus === option.value}
              onCheckedChange={() => {
                props.onStatusChange(option.value)
                setOpen(false)
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <StatusBadge status={option.value} tipo={props.tipo} />
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const statusOptions = Object.entries(EMPRESA_STATUS_CONFIG).map(([key, value]) => ({
    value: key as EmpresaStatus,
    label: value.label,
  }))

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm hover:bg-muted/50 transition-colors">
          <StatusBadge status={props.currentStatus} tipo={props.tipo} />
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
            checked={props.currentStatus === option.value}
            onCheckedChange={() => {
              props.onStatusChange(option.value)
              setOpen(false)
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <StatusBadge status={option.value} tipo={props.tipo} />
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
