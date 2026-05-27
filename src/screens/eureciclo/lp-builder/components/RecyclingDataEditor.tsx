'use client'

import { Plus, AlertTriangle } from 'lucide-react'
import { RecyclingRow, type RecyclingRowData } from './RecyclingRow'

type RecyclingDataEditorProps = {
  rows: RecyclingRowData[]
  duplicateIds: Set<string>
  error?: string
  onChange: (rows: RecyclingRowData[]) => void
}

export function RecyclingDataEditor({ rows, duplicateIds, error, onChange }: RecyclingDataEditorProps) {
  function updateRow(id: string, next: RecyclingRowData) {
    onChange(rows.map((r) => (r.id === id ? next : r)))
  }

  function removeRow(id: string) {
    onChange(rows.filter((r) => r.id !== id))
  }

  function addRow() {
    onChange([
      ...rows,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, year: null, material: null, tons: '' },
    ])
  }

  const hasDuplicates = duplicateIds.size > 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-foreground font-sans">
          Dados de reciclagem por ano
        </span>
        <span className="text-[11px] text-muted-foreground">
          {rows.length} {rows.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <RecyclingRow
            key={row.id}
            data={row}
            duplicate={duplicateIds.has(row.id)}
            canRemove={rows.length > 1}
            onChange={(next) => updateRow(row.id, next)}
            onRemove={() => removeRow(row.id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="flex items-center justify-center gap-2 h-11 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:border-planton-accent hover:text-planton-accent transition-colors"
      >
        <Plus size={16} />
        Adicionar registro
      </button>

      {hasDuplicates && (
        <div className="flex items-start gap-2 text-xs text-warning">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>Existem combinações duplicadas de ano e material. Ajuste antes de enviar.</span>
        </div>
      )}

      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}
