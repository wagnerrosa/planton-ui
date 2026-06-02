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
  clearSelectionRef?: React.MutableRefObject<(() => void) | null>
  onEdit?: () => void
}

export function InventoryDataGrid(props: Props) {
  return <Impl {...props} />
}

