'use client'

import { useMemo, useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import type { SchemaRow, TableSchema } from '@/screens/genius/chat/mock-data'

export type ResumoValidationState = 'idle' | 'checking' | 'has-issues' | 'ready'

export type ResumoTabProps = {
  schemas: TableSchema[]
  validationState: ResumoValidationState
  onCellClick?: (schemaId: string) => void
  pendingUnidades?: string[]
}

type CellAgg = {
  errors: number
  warnings: number
  warningRows: number[]
  hasRows: boolean
}

type ResumoMatrix = {
  unidades: string[]
  matrix: Record<string, Record<string, CellAgg>>
  totals: Record<string, number>
}

function getUnidade(row: SchemaRow): string | undefined {
  const u = row.unidade_empresa ?? row['unidade-op']
  return typeof u === 'string' ? u : undefined
}

function emptyCell(): CellAgg {
  return { errors: 0, warnings: 0, warningRows: [], hasRows: false }
}

function aggregate(schemas: TableSchema[]): ResumoMatrix {
  const matrix: Record<string, Record<string, CellAgg>> = {}
  const unidadesSet = new Set<string>()

  for (const schema of schemas) {
    schema.rows.forEach((row, idx) => {
      const unidade = getUnidade(row)
      if (!unidade) return
      unidadesSet.add(unidade)
      matrix[unidade] ??= {}
      matrix[unidade][schema.id] ??= emptyCell()
      const cell = matrix[unidade][schema.id]
      cell.hasRows = true
      const cs = row._cellStatus
      if (cs) {
        for (const status of Object.values(cs)) {
          if (status === 'error') cell.errors++
          else if (status === 'warning') {
            cell.warnings++
            cell.warningRows.push(idx + 1)
          }
        }
      }
    })
  }

  const unidades = Array.from(unidadesSet).sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )

  const totals: Record<string, number> = {}
  for (const unidade of unidades) {
    let sum = 0
    for (const schema of schemas) {
      sum += matrix[unidade]?.[schema.id]?.errors ?? 0
    }
    totals[unidade] = sum
  }

  return { unidades, matrix, totals }
}

function pluralize(n: number, singular: string, plural: string) {
  return n === 1 ? singular : plural
}

const SCHEMA_COL_WIDTH = 180
const TOTAL_COL_WIDTH = 100
const FILIAL_COL_WIDTH = 200
const ROW_MARKER_WIDTH = 44
const ROW_HEIGHT = 40
const HEADER_HEIGHT = 36

export function ResumoTab({
  schemas,
  validationState,
  onCellClick,
  pendingUnidades = [],
}: ResumoTabProps) {
  const { unidades, matrix, totals } = useMemo(
    () => aggregate(schemas),
    [schemas],
  )

  const allUnidades = useMemo(() => {
    const pending = pendingUnidades.filter((u) => !unidades.includes(u))
    return [...unidades, ...pending]
  }, [unidades, pendingUnidades])

  const [monoFamily, setMonoFamily] = useState('ui-monospace, monospace')
  useEffect(() => {
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-mono')
      .trim()
    if (resolved) setMonoFamily(`${resolved}, ui-monospace, monospace`)
  }, [])

  const isIdle =
    validationState === 'idle' || validationState === 'checking'

  if (allUnidades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-muted-foreground p-6">
        <p className="text-sm font-sans">Sem filiais alocadas ainda.</p>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="resumo-grid h-full w-full overflow-auto bg-[var(--rg-bg-cell)] text-[var(--rg-text)]">
        <style>{`
          .resumo-grid {
            --rg-bg-cell: #ffffff;
            --rg-bg-header: #fafafa;
            --rg-bg-marker: #ffffff;
            --rg-text: #0A2D30;
            --rg-text-header: #5b5b5b;
            --rg-text-marker: #8a8a8a;
            --rg-border: rgba(0, 0, 0, 0.08);
            --rg-accent: #ADCF78;
          }
          :is(.dark) .resumo-grid {
            --rg-bg-cell: #0a0a0a;
            --rg-bg-header: #121212;
            --rg-bg-marker: #0a0a0a;
            --rg-text: #fafafa;
            --rg-text-header: #b4b4b4;
            --rg-text-marker: #8a8a8a;
            --rg-border: rgba(255, 255, 255, 0.08);
          }
        `}</style>
        <table
          className="w-full"
          style={{
            fontFamily: monoFamily,
            fontSize: '11px',
            borderCollapse: 'separate',
            borderSpacing: 0,
          }}
          aria-label="Resumo do respondente"
        >
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky top-0 left-0 z-30 text-center font-medium px-0"
                style={{
                  height: HEADER_HEIGHT,
                  width: ROW_MARKER_WIDTH,
                  minWidth: ROW_MARKER_WIDTH,
                  fontSize: '10px',
                  background: 'var(--rg-bg-header)',
                  color: 'var(--rg-text-header)',
                  borderRight: '1px solid var(--rg-border)',
                  borderBottom: '1px solid var(--rg-border)',
                }}
              />
              <th
                scope="col"
                className="sticky top-0 z-30 text-left font-medium"
                style={{
                  height: HEADER_HEIGHT,
                  left: ROW_MARKER_WIDTH,
                  width: FILIAL_COL_WIDTH,
                  minWidth: FILIAL_COL_WIDTH,
                  padding: '0 12px',
                  background: 'var(--rg-bg-header)',
                  color: 'var(--rg-text-header)',
                  borderRight: '1px solid var(--rg-border)',
                  borderBottom: '1px solid var(--rg-border)',
                }}
              >
                Unidade
              </th>
              {schemas.map((s) => (
                <th
                  key={s.id}
                  scope="col"
                  className="sticky top-0 z-20 text-left font-medium whitespace-nowrap"
                  style={{
                    height: HEADER_HEIGHT,
                    width: SCHEMA_COL_WIDTH,
                    minWidth: SCHEMA_COL_WIDTH,
                    padding: '0 12px',
                    background: 'var(--rg-bg-header)',
                    color: 'var(--rg-text-header)',
                    borderRight: '1px solid var(--rg-border)',
                    borderBottom: '1px solid var(--rg-border)',
                  }}
                >
                  {s.label}
                </th>
              ))}
              <th
                scope="col"
                className="sticky top-0 z-20 text-left font-medium"
                style={{
                  height: HEADER_HEIGHT,
                  width: TOTAL_COL_WIDTH,
                  minWidth: TOTAL_COL_WIDTH,
                  padding: '0 12px',
                  background: 'var(--rg-bg-header)',
                  color: 'var(--rg-text-header)',
                  borderRight: '1px solid var(--rg-border)',
                  borderBottom: '1px solid var(--rg-border)',
                }}
              >
                Total
              </th>
              <th
                scope="col"
                aria-hidden="true"
                className="sticky top-0 z-20"
                style={{
                  height: HEADER_HEIGHT,
                  width: 'auto',
                  background: 'var(--rg-bg-header)',
                  borderBottom: '1px solid var(--rg-border)',
                }}
              />
            </tr>
          </thead>
          <tbody>
            {allUnidades.map((unidade, rowIdx) => {
              const isPending = !unidades.includes(unidade)
              const totalErrors = totals[unidade]
              const rowBg = 'var(--rg-bg-cell)'
              return (
                <tr key={unidade}>
                  <td
                    className="sticky left-0 z-10 text-center"
                    style={{
                      height: ROW_HEIGHT,
                      width: ROW_MARKER_WIDTH,
                      minWidth: ROW_MARKER_WIDTH,
                      fontSize: '10px',
                      background: 'var(--rg-bg-marker)',
                      color: 'var(--rg-text-marker)',
                      borderRight: '1px solid var(--rg-border)',
                      borderBottom: '1px solid var(--rg-border)',
                    }}
                  >
                    {rowIdx + 1}
                  </td>
                  <th
                    scope="row"
                    className="sticky z-10 text-left font-normal"
                    style={{
                      height: ROW_HEIGHT,
                      left: ROW_MARKER_WIDTH,
                      width: FILIAL_COL_WIDTH,
                      minWidth: FILIAL_COL_WIDTH,
                      padding: '0 12px',
                      background: rowBg,
                      color: isPending ? 'var(--rg-text-marker)' : 'var(--rg-text)',
                      borderRight: '1px solid var(--rg-border)',
                      borderBottom: '1px solid var(--rg-border)',
                    }}
                  >
                    {unidade}
                  </th>
                  {schemas.map((s) => {
                    const cell = matrix[unidade]?.[s.id]
                    return (
                      <td
                        key={s.id}
                        className="text-left"
                        style={{
                          height: ROW_HEIGHT,
                          width: SCHEMA_COL_WIDTH,
                          minWidth: SCHEMA_COL_WIDTH,
                          padding: '0 12px',
                          background: rowBg,
                          color: 'var(--rg-text)',
                          borderRight: '1px solid var(--rg-border)',
                          borderBottom: '1px solid var(--rg-border)',
                        }}
                      >
                        {isPending
                          ? <span style={{ color: 'var(--rg-text-marker)' }}>—</span>
                          : <ResumoCell
                              cell={cell}
                              isIdle={isIdle}
                              onClick={onCellClick ? () => onCellClick(s.id) : undefined}
                            />
                        }
                      </td>
                    )
                  })}
                  <td
                    className="text-left font-medium"
                    style={{
                      height: ROW_HEIGHT,
                      width: TOTAL_COL_WIDTH,
                      minWidth: TOTAL_COL_WIDTH,
                      padding: '0 12px',
                      background: rowBg,
                      color:
                        !isPending && !isIdle && totalErrors > 0
                          ? '#b91c1c'
                          : 'var(--rg-text-marker)',
                      borderRight: '1px solid var(--rg-border)',
                      borderBottom: '1px solid var(--rg-border)',
                    }}
                  >
                    {isIdle ? '—' : totalErrors}
                  </td>
                  <td
                    aria-hidden="true"
                    style={{
                      height: ROW_HEIGHT,
                      width: 'auto',
                      background: rowBg,
                      borderBottom: '1px solid var(--rg-border)',
                    }}
                  />
                </tr>
              )
            })}
            <tr aria-hidden="true" style={{ height: '100%' }}>
              <td
                style={{
                  background: 'var(--rg-bg-marker)',
                  width: ROW_MARKER_WIDTH,
                  minWidth: ROW_MARKER_WIDTH,
                }}
                className="sticky left-0"
              />
              <td
                style={{
                  background: 'var(--rg-bg-cell)',
                  borderRight: '1px solid var(--rg-border)',
                  width: FILIAL_COL_WIDTH,
                  minWidth: FILIAL_COL_WIDTH,
                  left: ROW_MARKER_WIDTH,
                }}
                className="sticky"
              />
              {schemas.map((s) => (
                <td
                  key={s.id}
                  style={{
                    background: 'var(--rg-bg-cell)',
                    borderRight: '1px solid var(--rg-border)',
                    width: SCHEMA_COL_WIDTH,
                    minWidth: SCHEMA_COL_WIDTH,
                  }}
                />
              ))}
              <td
                style={{
                  background: 'var(--rg-bg-cell)',
                  borderRight: '1px solid var(--rg-border)',
                  width: TOTAL_COL_WIDTH,
                  minWidth: TOTAL_COL_WIDTH,
                }}
              />
              <td style={{ background: 'var(--rg-bg-cell)', width: 'auto' }} />
            </tr>
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  )
}


function ResumoCell({
  cell,
  isIdle,
  onClick,
}: {
  cell: CellAgg | undefined
  isIdle: boolean
  onClick?: () => void
}) {
  if (isIdle || !cell?.hasRows) {
    return <span style={{ color: 'var(--rg-text-marker)' }}>—</span>
  }

  if (cell.errors > 0) {
    const label = `${cell.errors} ${pluralize(cell.errors, 'erro', 'erros')}`
    const chip = (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 border border-destructive/60 text-destructive font-medium leading-none">
        <AlertCircle size={10} className="shrink-0" />
        {label}
      </span>
    )
    if (onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          className="hover:opacity-75 transition-opacity"
        >
          {chip}
        </button>
      )
    }
    return chip
  }

  if (cell.warnings > 0) {
    const tooltipText = `${cell.warnings} ${pluralize(
      cell.warnings,
      'alerta',
      'alertas',
    )}`
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="relative inline-flex items-center gap-1 cursor-help" style={{ color: 'var(--rg-accent)' }}>
            <CheckCircle2 size={14} className="shrink-0" />
            <span className="absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full bg-warning ring-1 ring-background" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-[10px] font-mono px-2 py-1">{tooltipText}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <span className="inline-flex items-center gap-1" style={{ color: 'var(--rg-accent)' }}>
      <CheckCircle2 size={14} className="shrink-0" />
    </span>
  )
}
