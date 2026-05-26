'use client'

import dynamic from 'next/dynamic'

export const InventoryDataGrid = dynamic(
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
