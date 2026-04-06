import { cn } from '@/lib/utils'
import {
  EMPRESA_STATUS_CONFIG,
  FORNECEDOR_STATUS_CONFIG,
  type EmpresaStatus,
  type FornecedorStatus,
} from '../mock-data'

type StatusBadgeProps = {
  status: EmpresaStatus | FornecedorStatus
  tipo?: 'empresa' | 'fornecedor'
}

export function StatusBadge({ status, tipo = 'empresa' }: StatusBadgeProps) {
  const config =
    tipo === 'fornecedor'
      ? FORNECEDOR_STATUS_CONFIG[status as FornecedorStatus]
      : EMPRESA_STATUS_CONFIG[status as EmpresaStatus]

  if (!config) return null

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em] font-medium',
        config.color
      )}
    >
      {config.label}
    </span>
  )
}
