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
} from '@glideapps/glide-data-grid'
import type { SchemaColumn, SchemaRow } from '@/screens/genius/chat/mock-data'

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
  bgBubble: '#f0f0f0',
  bgBubbleSelected: '#e6e6e6',
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
}

export function InventoryDataGridImpl({ columns, rows }: Props) {
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

      if (colId === 'status') {
        return {
          kind: GridCellKind.Bubble,
          data: [val],
          allowOverlay: false,
          themeOverride: errorOverride,
        }
      }

      return {
        kind: GridCellKind.Text,
        data: val,
        displayData: val,
        allowOverlay: true,
        readonly: false,
        themeOverride: errorOverride,
      }
    },
    [columns, rows]
  )

  if (!mounted) return null

  const baseTheme = resolvedTheme === 'dark' ? DARK_THEME : LIGHT_THEME
  const theme: Partial<Theme> = { ...baseTheme, fontFamily: monoFamily }

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
        getCellsForSelection
      />
    </div>
  )
}
