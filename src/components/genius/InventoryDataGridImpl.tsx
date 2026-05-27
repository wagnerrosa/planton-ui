'use client'

import '@glideapps/glide-data-grid/dist/index.css'
import { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import {
  DataEditor,
  GridCellKind,
  type GridColumn,
  type Item,
  type GridCell,
  type Theme,
  type GridMouseEventArgs,
  type Highlight,
  type DrawCellCallback,
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
  headerFontStyle: '600 12px',
  baseFontStyle: '13px',
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
  headerFontStyle: '600 12px',
  baseFontStyle: '13px',
  fontFamily: 'var(--font-mono), ui-monospace, monospace',
}

type Props = {
  columns: SchemaColumn[]
  rows: SchemaRow[]
  readOnly?: boolean
}

export function InventoryDataGridImpl({ columns, rows, readOnly = false }: Props) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [monoFamily, setMonoFamily] = useState<string>('ui-monospace, monospace')
  const [hoveredCell, setHoveredCell] = useState<Item | undefined>(undefined)

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

      const errorOverride: Partial<Theme> | undefined =
        cellStatus === 'error'
          ? { bgCell: 'rgba(239, 68, 68, 0.10)', textDark: '#b91c1c' }
          : cellStatus === 'warning'
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

  if (!mounted) return null

  const baseTheme = resolvedTheme === 'dark' ? DARK_THEME : LIGHT_THEME
  const theme: Partial<Theme> = { ...baseTheme, fontFamily: monoFamily }

  const strokeColor = resolvedTheme === 'dark' ? BUBBLE_STROKE_DARK : BUBBLE_STROKE_LIGHT

  const getRowThemeOverride = (row: number): Partial<Theme> | undefined => {
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
    if (worst === 'error') {
      return {
        bgCell: 'rgba(239, 68, 68, 0.04)',
        bgCellMedium: 'rgba(239, 68, 68, 0.06)',
      }
    }
    if (worst === 'warning') {
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

  return (
    <div className="h-full w-full">
      <DataEditor
        columns={gridColumns}
        rows={rows.length}
        getCellContent={getCellContent}
        width="100%"
        height="100%"
        theme={theme}
        smoothScrollX
        smoothScrollY
        rowHeight={40}
        headerHeight={36}
        rowMarkers={{ kind: 'number', theme: { fontFamily: monoFamily, baseFontStyle: '11px' } }}
        rowMarkerWidth={44}
        fixedShadowX={false}
        onItemHovered={onItemHovered}
        highlightRegions={highlightRegions}
        drawCell={drawCell}
        getRowThemeOverride={getRowThemeOverride}
        onRowAppended={readOnly ? undefined : () => {}}
        trailingRowOptions={readOnly ? undefined : { hint: '', sticky: false, tint: false }}
        getCellsForSelection
      />
    </div>
  )
}
