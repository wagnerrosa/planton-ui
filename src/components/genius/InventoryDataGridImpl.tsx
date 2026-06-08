'use client'

import '@glideapps/glide-data-grid/dist/index.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import {
  DataEditor,
  CompactSelection,
  GridCellKind,
  type GridColumn,
  type Item,
  type GridCell,
  type Theme,
  type GridMouseEventArgs,
  type Highlight,
  type DrawCellCallback,
  type DrawHeaderCallback,
  type GridSelection,
  type CellClickedEventArgs,
} from '@glideapps/glide-data-grid'
import type { SchemaColumn, SchemaRow } from '@/screens/genius/chat/mock-data'

const BUBBLE_STROKE_LIGHT = 'rgba(0, 0, 0, 0.18)'
const BUBBLE_STROKE_DARK = 'rgba(255, 255, 255, 0.28)'
const BUBBLE_RADIUS = 4
const BUBBLE_HEIGHT = 22
const BUBBLE_PAD_X = 8
const BUBBLE_MARGIN = 4

function drawBubbleStroke(
  ctx: CanvasRenderingContext2D,
  data: readonly string[],
  rect: { x: number; y: number; width: number; height: number },
  theme: { cellHorizontalPadding: number; baseFontFull: string },
  strokeColor: string,
) {
  const { x, y, width: w, height: h } = rect
  let renderX = x + theme.cellHorizontalPadding
  ctx.save()
  ctx.font = theme.baseFontFull
  ctx.lineWidth = 1
  ctx.strokeStyle = strokeColor
  for (const s of data) {
    if (renderX > x + w) break
    const textWidth = ctx.measureText(s).width
    const bw = textWidth + BUBBLE_PAD_X * 2
    const bh = BUBBLE_HEIGHT
    const bx = renderX + 0.5
    const by = y + (h - bh) / 2 + 0.5
    const r = BUBBLE_RADIUS
    ctx.beginPath()
    ctx.moveTo(bx + r, by)
    ctx.lineTo(bx + bw - r, by)
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r)
    ctx.lineTo(bx + bw, by + bh - r)
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh)
    ctx.lineTo(bx + r, by + bh)
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r)
    ctx.lineTo(bx, by + r)
    ctx.quadraticCurveTo(bx, by, bx + r, by)
    ctx.closePath()
    ctx.stroke()
    renderX += bw + BUBBLE_MARGIN
  }
  ctx.restore()
}

const LIGHT_THEME: Partial<Theme> = {
  accentColor: '#ADCF78',
  accentLight: 'rgba(173, 207, 120, 0.15)',
  textDark: '#0A2D30',
  textMedium: '#5b5b5b',
  textLight: '#8a8a8a',
  textBubble: '#0A2D30',
  textHeader: '#5b5b5b',
  textHeaderSelected: '#0A2D30',
  bgCell: '#ffffff',
  bgCellMedium: '#f7f7f7',
  bgHeader: '#fafafa',
  bgHeaderHasFocus: '#f0f0f0',
  bgHeaderHovered: '#f4f4f4',
  bgBubble: 'rgba(0,0,0,0)',
  bgBubbleSelected: 'rgba(0,0,0,0)',
  roundingRadius: BUBBLE_RADIUS,
  borderColor: 'rgba(0, 0, 0, 0.08)',
  drilldownBorder: 'rgba(0, 0, 0, 0.1)',
  linkColor: '#ADCF78',
  cellHorizontalPadding: 12,
  cellVerticalPadding: 10,
  headerFontStyle: '500 11px',
  baseFontStyle: '11px',
  fontFamily: 'var(--font-mono), ui-monospace, monospace',
}

const DARK_THEME: Partial<Theme> = {
  accentColor: '#ADCF78',
  accentLight: 'rgba(173, 207, 120, 0.2)',
  textDark: '#fafafa',
  textMedium: '#b4b4b4',
  textLight: '#8a8a8a',
  textBubble: '#fafafa',
  textHeader: '#b4b4b4',
  textHeaderSelected: '#fafafa',
  bgCell: '#0a0a0a',
  bgCellMedium: '#161616',
  bgHeader: '#121212',
  bgHeaderHasFocus: '#1c1c1c',
  bgHeaderHovered: '#181818',
  bgBubble: '#222222',
  bgBubbleSelected: '#2a2a2a',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  drilldownBorder: 'rgba(255, 255, 255, 0.12)',
  linkColor: '#ADCF78',
  cellHorizontalPadding: 12,
  cellVerticalPadding: 10,
  headerFontStyle: '500 11px',
  baseFontStyle: '11px',
  fontFamily: 'var(--font-mono), ui-monospace, monospace',
}

export type GridSelectionInfo = {
  type: 'cells' | 'rows' | 'columns'
  count: number
}

type Props = {
  columns: SchemaColumn[]
  rows: SchemaRow[]
  readOnly?: boolean
  highlightedRows?: number[]
  onSelectionChange?: (info: GridSelectionInfo) => void
  /** índices das linhas marcadas (via row markers) — para fluxos de revisão/seleção */
  onRowSelectionChange?: (rowIndexes: number[]) => void
  /** linhas que não podem ser selecionadas (ex: já no carrinho) */
  disabledRows?: number[]
  /** tipo do row marker: 'number' (default) ou 'both' (número + checkbox de seleção) */
  rowMarkerKind?: 'number' | 'checkbox' | 'both'
  /** 'multi' = clique simples no marker acumula (sem segurar shift) */
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
  /** clique no header de qualquer coluna (não filtra por sortable) — para filtros custom */
  onAnyHeaderClicked?: (columnId: string) => void
  /** ids de colunas que exibem ícone de filtro (funil) no header */
  filterColumnIds?: string[]
  /** ids de colunas com filtro ativo — funil preenchido */
  activeFilterColumnIds?: string[]
  /** nº de colunas iniciais congeladas (sticky) no scroll horizontal */
  freezeColumns?: number
  /** readOnly aplica aparência cinza (muted) por padrão; false = bloqueia edição mas mantém cor normal */
  mutedReadOnly?: boolean
}

function getSelectionInfo(sel: GridSelection, totalCols: number, totalRows: number): GridSelectionInfo {
  const colCount = sel.columns.length
  const rowCount = sel.rows.length

  if (colCount > 0 && rowCount === 0 && !sel.current) {
    return { type: 'columns', count: colCount }
  }
  if (rowCount > 0 && colCount === 0 && !sel.current) {
    return { type: 'rows', count: rowCount }
  }

  let cellCount = 0
  if (sel.current) {
    const { range, rangeStack = [] } = sel.current
    for (const r of [range, ...rangeStack]) cellCount += r.width * r.height
  }
  cellCount += rowCount * totalCols
  cellCount += colCount * totalRows
  return { type: 'cells', count: cellCount }
}

type DropdownState = {
  colIdx: number
  rowIdx: number
  options: string[]
  x: number
  y: number
}

export function InventoryDataGridImpl({ columns, rows: initialRows, readOnly = false, highlightedRows, onSelectionChange, onRowSelectionChange, disabledRows, rowMarkerKind = 'number', rowSelectionMode = 'auto', clearSelectionRef, onEdit, sortColumnId, sortDir, onHeaderClicked, sortableColumnIds, onAnyHeaderClicked, filterColumnIds, activeFilterColumnIds, freezeColumns, mutedReadOnly = true }: Props) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [monoFamily, setMonoFamily] = useState<string>('ui-monospace, monospace')
  const [hoveredCell, setHoveredCell] = useState<Item | undefined>(undefined)
  const [gridSelection, setGridSelection] = useState<GridSelection>({ columns: CompactSelection.empty(), rows: CompactSelection.empty() })
  const [localRows, setLocalRows] = useState<SchemaRow[]>(initialRows)
  const [dropdown, setDropdown] = useState<DropdownState | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rows = localRows

  // reset when parent swaps to different schema/category
  useEffect(() => {
    setLocalRows(initialRows)
    setDropdown(null)
  }, [initialRows])

  const clearSelection = useCallback(() => {
    const empty: GridSelection = { columns: CompactSelection.empty(), rows: CompactSelection.empty() }
    setGridSelection(empty)
    onSelectionChange?.({ type: 'cells', count: 0 })
    onRowSelectionChange?.([])
  }, [onSelectionChange, onRowSelectionChange])

  useEffect(() => {
    if (clearSelectionRef) clearSelectionRef.current = clearSelection
  }, [clearSelectionRef, clearSelection])

  const handleGridSelectionChange = useCallback((sel: GridSelection) => {
    // Impede marcar linhas desabilitadas (ex: já no carrinho).
    let rowSel = sel.rows
    if (disabledRows && disabledRows.length > 0) {
      for (const d of disabledRows) rowSel = rowSel.remove(d)
    }
    const next = { ...sel, rows: rowSel }
    setGridSelection(next)
    onSelectionChange?.(getSelectionInfo(next, columns.length, rows.length))
    onRowSelectionChange?.(rowSel.toArray())
  }, [onSelectionChange, onRowSelectionChange, disabledRows, columns.length, rows.length])

  const onItemHovered = useCallback((args: GridMouseEventArgs) => {
    if (args.kind === 'cell') {
      setHoveredCell(args.location)
    } else {
      setHoveredCell(undefined)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-mono')
      .trim()
    if (resolved) {
      setMonoFamily(`${resolved}, ui-monospace, monospace`)
    }
  }, [])

  useEffect(() => {
    if (!dropdown) return
    const close = () => setDropdown(null)
    window.addEventListener('scroll', close, true)
    return () => window.removeEventListener('scroll', close, true)
  }, [dropdown])

  const gridColumns: GridColumn[] = columns.map((c) => ({
    id: c.id,
    title: c.title,
    width: c.width,
  }))

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const r = rows[row]
      const colId = columns[col].id
      const rawVal = r[colId]
      const val = typeof rawVal === 'string' ? rawVal : ''
      const cellStatus = r._cellStatus?.[colId]

      // Em readOnly (revisão) erros já foram corrigidos numa etapa anterior —
      // a tabela só carrega avisos (amarelo) p/ o engenheiro analisar. O vermelho
      // fica reservado p/ a decisão dele (linha enviada ao carrinho de recusa).
      const effectiveStatus = readOnly && cellStatus === 'error' ? 'warning' : cellStatus

      const errorOverride: Partial<Theme> | undefined =
        effectiveStatus === 'error'
          ? { bgCell: 'rgba(239, 68, 68, 0.10)', textDark: '#b91c1c' }
          : effectiveStatus === 'warning'
            ? { bgCell: 'rgba(234, 179, 8, 0.12)', textDark: '#a16207' }
            : undefined

      const colType = columns[col].type
      if (colType === 'bubble' || colId === 'status') {
        return {
          kind: GridCellKind.Bubble,
          data: val ? [val] : [],
          allowOverlay: false,
          themeOverride: errorOverride,
        }
      }

      return {
        kind: GridCellKind.Text,
        data: val,
        displayData: val,
        allowOverlay: !readOnly,
        readonly: readOnly,
        themeOverride: errorOverride,
      }
    },
    [columns, rows, readOnly]
  )

  const handleCellClicked = useCallback(([colIdx, rowIdx]: Item, event: CellClickedEventArgs) => {
    if (readOnly) return
    if (event.shiftKey || event.ctrlKey || event.metaKey) return
    const col = columns[colIdx]
    if (!col || !col.options || col.options.length === 0) return
    // glide bounds already in viewport coords (includes canvas getBoundingClientRect offset)
    const cellBounds = event.bounds
    setDropdown({
      colIdx,
      rowIdx,
      options: col.options,
      x: cellBounds.x,
      y: cellBounds.y + cellBounds.height,
    })
  }, [readOnly, columns])

  const handleSelectOption = useCallback((option: string) => {
    if (!dropdown) return
    const { colIdx, rowIdx } = dropdown
    const colId = columns[colIdx].id
    setLocalRows((prev) => prev.map((r, i) => i === rowIdx ? { ...r, [colId]: option } : r))
    setDropdown(null)
    onEdit?.()
  }, [dropdown, columns, onEdit])

  if (!mounted) return null

  const baseTheme = resolvedTheme === 'dark' ? DARK_THEME : LIGHT_THEME
  const theme: Partial<Theme> = { ...baseTheme, fontFamily: monoFamily }

  const strokeColor = readOnly && mutedReadOnly
    ? resolvedTheme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'
    : resolvedTheme === 'dark' ? BUBBLE_STROKE_DARK : BUBBLE_STROKE_LIGHT

  const getRowThemeOverride = (row: number): Partial<Theme> | undefined => {
    // Linha destacada = enviada ao carrinho de recusa. Vermelho suave = "vai ser
    // devolvida". No editável (Chat) segue verde — ali destaque é neutro/positivo.
    if (highlightedRows?.includes(row)) {
      return readOnly
        ? {
            bgCell: 'rgba(239, 68, 68, 0.07)',
            bgCellMedium: 'rgba(239, 68, 68, 0.10)',
          }
        : {
            bgCell: 'rgba(74, 153, 120, 0.08)',
            bgCellMedium: 'rgba(74, 153, 120, 0.12)',
          }
    }
    const r = rows[row]
    if (!r?._cellStatus) return undefined
    let worst: 'error' | 'warning' | undefined
    for (const status of Object.values(r._cellStatus)) {
      if (status === 'error') {
        worst = 'error'
        break
      }
      if (status === 'warning') worst = 'warning'
    }
    // Em revisão (readOnly) não há erro bloqueante — erro entra como aviso.
    const effectiveWorst = readOnly && worst === 'error' ? 'warning' : worst
    if (effectiveWorst === 'error') {
      return {
        bgCell: 'rgba(239, 68, 68, 0.04)',
        bgCellMedium: 'rgba(239, 68, 68, 0.06)',
      }
    }
    if (effectiveWorst === 'warning') {
      return {
        bgCell: 'rgba(234, 179, 8, 0.04)',
        bgCellMedium: 'rgba(234, 179, 8, 0.06)',
      }
    }
    return undefined
  }

  const drawCell: DrawCellCallback = (args, draw) => {
    draw()
    const cell = args.cell
    if (cell.kind === GridCellKind.Bubble) {
      const data = (cell as { data: readonly string[] }).data
      if (data && data.length > 0) {
        drawBubbleStroke(args.ctx, data, args.rect, args.theme as never, strokeColor)
      }
    }
  }

  // Ícones no header: seta de sort (▲/▼) na coluna ordenada; funil nas colunas filtráveis.
  const hasHeaderIcons = onHeaderClicked || (filterColumnIds && filterColumnIds.length > 0)
  const drawHeader: DrawHeaderCallback | undefined = hasHeaderIcons
    ? (args, draw) => {
        draw()
        const colId = columns[args.columnIndex]?.id
        if (!colId) return
        const { ctx, rect, theme: t } = args
        const iconColor = (t.textHeaderSelected as string) || (t.textHeader as string) || '#5b5b5b'
        const cx = rect.x + rect.width - 14
        const cy = rect.y + rect.height / 2

        if (colId === sortColumnId) {
          // Seta de sort
          const up = sortDir !== 'desc'
          ctx.save()
          ctx.fillStyle = iconColor
          ctx.beginPath()
          if (up) {
            ctx.moveTo(cx, cy - 3)
            ctx.lineTo(cx + 5, cy + 3)
            ctx.lineTo(cx - 5, cy + 3)
          } else {
            ctx.moveTo(cx, cy + 3)
            ctx.lineTo(cx + 5, cy - 3)
            ctx.lineTo(cx - 5, cy - 3)
          }
          ctx.closePath()
          ctx.fill()
          ctx.restore()
        } else if (filterColumnIds?.includes(colId)) {
          const isActive = activeFilterColumnIds?.includes(colId) ?? false
          ctx.save()
          const fillColor = isActive ? '#5f8f3a' : iconColor
          ctx.fillStyle = fillColor
          ctx.beginPath()
          ctx.moveTo(cx - 3.5, cy - 3.5)
          ctx.lineTo(cx + 3.5, cy - 3.5)
          ctx.lineTo(cx + 1,   cy + 0.5)
          ctx.lineTo(cx + 1,   cy + 3.5)
          ctx.lineTo(cx - 1,   cy + 3.5)
          ctx.lineTo(cx - 1,   cy + 0.5)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
        }
      }
    : undefined

  const handleHeaderClicked = (colIndex: number) => {
    const colId = columns[colIndex]?.id
    if (!colId) return
    onAnyHeaderClicked?.(colId)
    if (sortableColumnIds && !sortableColumnIds.includes(colId)) return
    onHeaderClicked?.(colId)
  }

  const hoverColor = resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(10, 45, 48, 0.35)'
  const highlightRegions: Highlight[] | undefined =
    hoveredCell && hoveredCell[0] >= 0 && hoveredCell[1] >= 0
      ? [
          {
            color: hoverColor,
            range: { x: hoveredCell[0], y: hoveredCell[1], width: 1, height: 1 },
            style: 'solid-outline',
          },
        ]
      : undefined

  const readOnlyTheme: Partial<Theme> = readOnly && mutedReadOnly
    ? {
        bgCell: resolvedTheme === 'dark' ? '#0d0d0d' : '#fafafa',
        bgCellMedium: resolvedTheme === 'dark' ? '#111111' : '#f7f7f7',
        bgHeader: resolvedTheme === 'dark' ? '#0f0f0f' : '#f5f5f5',
        bgHeaderHasFocus: resolvedTheme === 'dark' ? '#0f0f0f' : '#f5f5f5',
        bgHeaderHovered: resolvedTheme === 'dark' ? '#0f0f0f' : '#f5f5f5',
        textDark: resolvedTheme === 'dark' ? '#6b6b6b' : '#8a8a8a',
        textMedium: resolvedTheme === 'dark' ? '#555555' : '#aaaaaa',
        textHeader: resolvedTheme === 'dark' ? '#555555' : '#aaaaaa',
        textBubble: resolvedTheme === 'dark' ? '#6b6b6b' : '#8a8a8a',
        borderColor: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        drilldownBorder: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      }
    : {}

  const finalTheme: Partial<Theme> = { ...theme, ...readOnlyTheme }

  return (
    <div ref={containerRef} className="h-full w-full relative">
      {readOnly && (
        <div className="absolute top-2 right-3 z-10 flex items-center gap-1.5 px-2 py-1 text-[10px] font-sans font-medium text-muted-foreground bg-background/80 backdrop-blur-sm border border-border rounded pointer-events-none select-none">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Somente leitura
        </div>
      )}
      <DataEditor
        columns={gridColumns}
        rows={rows.length}
        getCellContent={getCellContent}
        width="100%"
        height="100%"
        theme={finalTheme}
        smoothScrollX
        smoothScrollY
        rowHeight={40}
        headerHeight={36}
        rowMarkers={{ kind: rowMarkerKind, theme: { fontFamily: monoFamily, baseFontStyle: '11px' } }}
        rowMarkerWidth={44}
        freezeColumns={freezeColumns}
        fixedShadowX={false}
        gridSelection={gridSelection}
        onGridSelectionChange={handleGridSelectionChange}
        rowSelect="multi"
        rowSelectionMode={rowSelectionMode}
        rowSelectionBlending="mixed"
        rangeSelect="multi-rect"
        rangeSelectionBlending="mixed"
        onItemHovered={onItemHovered}
        highlightRegions={highlightRegions}
        drawCell={drawCell}
        drawHeader={drawHeader}
        onHeaderClicked={onHeaderClicked ? handleHeaderClicked : undefined}
        getRowThemeOverride={getRowThemeOverride}
        onCellClicked={handleCellClicked}
        onRowAppended={readOnly ? undefined : () => { onEdit?.() }}
        trailingRowOptions={readOnly ? undefined : { hint: '', sticky: false, tint: false }}
        getCellsForSelection
      />
      {dropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setDropdown(null)} />
          <div
            className="fixed z-50 min-w-[140px] bg-background border border-border shadow-md py-1 rounded-md overflow-hidden"
            style={{ left: dropdown.x, top: dropdown.y }}
          >
            {dropdown.options.map((opt) => {
              const current = localRows[dropdown.rowIdx][columns[dropdown.colIdx].id]
              const isSelected = current === opt
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors flex items-center gap-2 ${
                    isSelected
                      ? 'bg-planton-accent/10 text-planton-accent font-medium'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-planton-accent shrink-0" />}
                  {!isSelected && <span className="w-1.5 h-1.5 shrink-0" />}
                  {opt}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
