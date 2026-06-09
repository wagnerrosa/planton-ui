'use client'

import dynamic from 'next/dynamic'
import type { SchemaColumn, SchemaRow } from '@/screens/genius/chat/mock-data'
import type { GridSelectionInfo } from './InventoryDataGridImpl'

export type { GridSelectionInfo }

const Impl = dynamic(
  () => import('./InventoryDataGridImpl').then((m) => m.InventoryDataGridImpl),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-xs text-muted-foreground font-sans">
        Carregando tabela...
      </div>
    ),
  }
)

import React from 'react'

type Props = {
  columns: SchemaColumn[]
  rows: SchemaRow[]
  readOnly?: boolean
  highlightedRows?: number[]
  onSelectionChange?: (info: GridSelectionInfo) => void
  onRowSelectionChange?: (rowIndexes: number[]) => void
  disabledRows?: number[]
  rowMarkerKind?: 'number' | 'checkbox' | 'both'
  rowSelectionMode?: 'auto' | 'multi'
  clearSelectionRef?: React.MutableRefObject<(() => void) | null>
  onEdit?: () => void
  /** id da coluna ordenada (desenha seta no header) */
  sortColumnId?: string
  sortDir?: 'asc' | 'desc'
  /** clique no header de uma coluna ordenável */
  onHeaderClicked?: (columnId: string) => void
  /** ids de colunas que podem ser ordenadas por clique no header */
  sortableColumnIds?: string[]
  /** clique no header de qualquer coluna (não filtra por sortable) */
  onAnyHeaderClicked?: (columnId: string) => void
  /** ids de colunas que exibem ícone de filtro no header */
  filterColumnIds?: string[]
  /** ids de colunas com filtro ativo — ícone preenchido */
  activeFilterColumnIds?: string[]
  /** nº de colunas iniciais congeladas (sticky) no scroll horizontal */
  freezeColumns?: number
  /** readOnly aplica aparência cinza (muted) por padrão; false = bloqueia edição mas mantém cor normal */
  mutedReadOnly?: boolean
  /** ids de colunas cujo valor é nome de arquivo — renderiza badge de tipo (XLS/PDF/CSV) */
  fileCellColumnIds?: string[]
  /** clique numa célula de arquivo com nome válido — ex: baixar */
  onFileCellClick?: (rowIndex: number, fileName: string) => void
}

export function InventoryDataGrid(props: Props) {
  return <Impl {...props} />
}

