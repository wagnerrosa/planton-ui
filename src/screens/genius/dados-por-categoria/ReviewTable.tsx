'use client'

import { useState } from 'react'
import { AlertTriangle, AlertCircle, Plus } from 'lucide-react'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { findReviewCategory, type ReviewRow } from './dados-data'

export function ReviewTable({
  categoriaId,
  rows,
  selectedIds,
  onToggleRow,
  onToggleMany,
}: {
  categoriaId: string
  rows: ReviewRow[]
  selectedIds: Set<string>
  onToggleRow: (id: string) => void
  onToggleMany: (ids: string[], select: boolean) => void
}) {
  const cat = findReviewCategory(categoriaId)
  const [schemaId, setSchemaId] = useState(cat.schemas[0]?.id)

  const activeSchema = cat.schemas.find((s) => s.id === schemaId) ?? cat.schemas[0]
  const schemaRows = rows.filter((r) => r.schemaId === activeSchema.id)
  const cols = activeSchema.columns

  const allSelected = schemaRows.length > 0 && schemaRows.every((r) => selectedIds.has(r.id))
  const someSelected = schemaRows.some((r) => selectedIds.has(r.id))

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Tabs por schema (só quando há mais de um) */}
      {cat.schemas.length > 1 && (
        <div className="shrink-0 px-1 pb-2">
          <Tabs value={schemaId} onValueChange={setSchemaId}>
            <TabsList className="h-8">
              {cat.schemas.map((s) => {
                const errs = rows.filter((r) => r.schemaId === s.id).reduce((a, r) => a + r.errorCount, 0)
                return (
                  <TabsTrigger key={s.id} value={s.id} className="text-[12px] gap-1.5">
                    {s.label}
                    {errs > 0 && (
                      <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-destructive-surface text-destructive text-[10px]">
                        {errs}
                      </span>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Tabela com scroll */}
      <div className="flex-1 min-h-0 overflow-auto border border-border rounded-md">
        <table className="w-full border-collapse text-[12px]">
          <thead className="sticky top-0 z-10 bg-muted">
            <tr className="border-b border-border">
              <th className="sticky left-0 z-20 bg-muted w-9 px-2 py-2">
                <Checkbox
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={(c) => onToggleMany(schemaRows.map((r) => r.id), c === true)}
                  aria-label="Selecionar todas as linhas"
                />
              </th>
              {cols.map((col) => (
                <th
                  key={col.id}
                  className="text-left font-heading uppercase tracking-wide text-[10px] text-muted-foreground px-3 py-2 whitespace-nowrap"
                  style={{ minWidth: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schemaRows.map((row) => {
              const selected = selectedIds.has(row.id)
              const hasError = row.errorCount > 0
              return (
                <tr
                  key={row.id}
                  onClick={() => onToggleRow(row.id)}
                  className={`border-b border-border/60 cursor-pointer transition-colors ${
                    selected
                      ? 'bg-destructive-surface/60'
                      : hasError
                        ? 'bg-destructive-surface/20 hover:bg-destructive-surface/30'
                        : 'hover:bg-accent/50'
                  }`}
                >
                  <td
                    className={`sticky left-0 z-10 px-2 py-2 ${
                      selected ? 'bg-destructive-surface/60' : hasError ? 'bg-destructive-surface/20' : 'bg-background'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => onToggleRow(row.id)}
                      aria-label={`Selecionar linha ${row.unidade}`}
                    />
                  </td>
                  {cols.map((col) => {
                    const cell = row.cellStatus[col.id]
                    const value = (row.raw[col.id] as string | undefined) ?? ''
                    return (
                      <td
                        key={col.id}
                        className={`px-3 py-2 whitespace-nowrap ${
                          cell === 'error'
                            ? 'text-destructive'
                            : cell === 'warning'
                              ? 'text-warning'
                              : 'text-foreground/90'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {cell === 'error' && <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
                          {cell === 'warning' && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
                          {value === '' && cell ? (
                            <span className="italic opacity-70">vazio</span>
                          ) : (
                            value || <span className="text-muted-foreground/40">—</span>
                          )}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {schemaRows.length === 0 && (
              <tr>
                <td colSpan={cols.length + 1} className="px-3 py-12 text-center text-muted-foreground text-[13px]">
                  Nenhum dado enviado neste período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Rodapé: contagem + ação rápida "marcar linhas com erro" */}
      <div className="shrink-0 flex items-center justify-between gap-2 pt-2 text-[12px] text-muted-foreground">
        <span>
          {schemaRows.length} linha{schemaRows.length !== 1 ? 's' : ''}
          {someSelected && ` · ${schemaRows.filter((r) => selectedIds.has(r.id)).length} marcada(s) para recusa`}
        </span>
        {schemaRows.some((r) => r.errorCount > 0) && (
          <button
            onClick={() =>
              onToggleMany(
                schemaRows.filter((r) => r.errorCount > 0).map((r) => r.id),
                true,
              )
            }
            className="inline-flex items-center gap-1 text-destructive hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Marcar todas com erro
          </button>
        )}
      </div>
    </div>
  )
}
