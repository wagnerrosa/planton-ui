'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { PanelRightOpen, PanelRightClose, PanelLeftOpen, PanelLeftClose } from 'lucide-react'
import { InventoryDataGrid } from '@/components/genius/InventoryDataGrid'
import { SelectionActionBar } from './SelectionActionBar'
import { findReviewCategory, type ReviewRow } from './dados-data'

export function ReviewTable({
  categoriaId,
  rows,
  selectedIds,
  groupedIds,
  onSetSelection,
  onClearSelection,
  onAddGroup,
  sidebarOpen = true,
  onToggleSidebar,
  panelOpen = false,
  onTogglePanel,
  hasCart = false,
  drawer,
  drawerOpen = false,
}: {
  categoriaId: string
  rows: ReviewRow[]
  /** seleção transitória (ainda não no carrinho) */
  selectedIds: Set<string>
  /** linhas já dentro de algum grupo do carrinho */
  groupedIds: Set<string>
  /** substitui a seleção transitória pelo conjunto de rowIds do schema ativo */
  onSetSelection: (schemaId: string, rowIds: string[]) => void
  onClearSelection: () => void
  onAddGroup: (motivoId: string, texto: string) => void
  /** sidebar de categorias (à esquerda) aberta */
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
  /** drawer de aprovar/carrinho aberto */
  panelOpen?: boolean
  onTogglePanel?: () => void
  /** há seleção/grupos → badge no toggle quando fechado */
  hasCart?: boolean
  /** drawer overlay (aprovar/carrinho) renderizado sobre a área do grid */
  drawer?: ReactNode
  /** drawer aberto → reserva largura no grid p/ habilitar scroll-x das colunas escondidas */
  drawerOpen?: boolean
}) {
  const cat = findReviewCategory(categoriaId)
  const [schemaId, setSchemaId] = useState(cat.schemas[0]?.id)

  const activeSchema = cat.schemas.find((s) => s.id === schemaId) ?? cat.schemas[0]

  // Coluna "Unidade" do schema ativo (varia o id por formato: unidade_empresa / unidade-op).
  const unidadeColIdx = useMemo(
    () => activeSchema.columns.findIndex((c) => c.title === 'Unidade'),
    [activeSchema],
  )
  const unidadeColId = unidadeColIdx >= 0 ? activeSchema.columns[unidadeColIdx].id : undefined

  // Congela do início até a coluna Unidade (inclusive) — fica sticky no scroll-x,
  // junto da coluna de números. Se não houver Unidade, não congela nada.
  const freezeColumns = unidadeColIdx >= 0 ? unidadeColIdx + 1 : 0

  // Com o drawer aberto, anexa uma coluna-spacer vazia (≈ largura do painel) ao
  // fim do grid. Dá folga de scroll-x p/ trazer todas as colunas reais p/ a
  // esquerda do vidro sem encolher a tabela (preserva o efeito glass).
  const gridColumns = useMemo(
    () =>
      drawerOpen
        ? [...activeSchema.columns, { id: '__spacer', title: '', width: 440 }]
        : activeSchema.columns,
    [activeSchema.columns, drawerOpen],
  )

  // Ordenação por clique no header. null = ordem original (como veio do respondente).
  // Default: já ordenada por Unidade (A→Z) ao abrir a tela.
  const [sort, setSort] = useState<{ colId: string; dir: 'asc' | 'desc' } | null>(() =>
    unidadeColId ? { colId: unidadeColId, dir: 'asc' } : null,
  )

  // Troca de aba → volta à ordem original.
  function cycleSort(colId: string) {
    setSort((s) => {
      if (!s || s.colId !== colId) return { colId, dir: 'asc' }
      if (s.dir === 'asc') return { colId, dir: 'desc' }
      return null
    })
  }

  // Linhas do schema ativo, na ordem do grid (índice = posição). Aplica ordenação
  // pela coluna escolhida (localeCompare pt-BR); sem sort = ordem original.
  const schemaRows = useMemo(() => {
    const base = rows.filter((r) => r.schemaId === activeSchema.id)
    if (!sort) return base
    const get = (r: ReviewRow) => String(r.raw[sort.colId] ?? '')
    const sorted = [...base].sort((a, b) =>
      get(a).localeCompare(get(b), 'pt-BR', { numeric: true, sensitivity: 'base' }),
    )
    if (sort.dir === 'desc') sorted.reverse()
    return sorted
  }, [rows, activeSchema.id, sort])

  // Índice no grid → rowId.
  const idByIndex = useMemo(() => schemaRows.map((r) => r.id), [schemaRows])

  // Estado da seleção/carrinho projetado em índices do grid.
  const selectedIndexes = useMemo(
    () => schemaRows.map((r, i) => (selectedIds.has(r.id) ? i : -1)).filter((i) => i >= 0),
    [schemaRows, selectedIds],
  )
  const groupedIndexes = useMemo(
    () => schemaRows.map((r, i) => (groupedIds.has(r.id) ? i : -1)).filter((i) => i >= 0),
    [schemaRows, groupedIds],
  )

  // Linhas com aviso ainda não enviadas ao carrinho — alvo do atalho "N avisos".
  const alertaRows = useMemo(
    () => schemaRows.filter((r) => r.warningCount > 0 && !groupedIds.has(r.id)),
    [schemaRows, groupedIds],
  )

  const selCount = selectedIndexes.length

  // Troca de aba zera a seleção transitória (o grid remonta e perde a sua) e
  // volta a ordenação ao padrão (Unidade A→Z).
  useEffect(() => {
    onClearSelection()
    setSort(unidadeColId ? { colId: unidadeColId, dir: 'asc' } : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaId])

  function handleRowSelection(indexes: number[]) {
    onSetSelection(activeSchema.id, indexes.map((i) => idByIndex[i]).filter(Boolean))
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Planilha integrada: barra superior + grid + abas de schema (espelha o Chat).
          Sem borda própria — vive dentro do canvas (sidebar + tabela). */}
      <div className="flex-1 min-h-0 flex flex-col bg-background overflow-hidden">
        {/* Barra superior — contagem/atalho (leitura) ou seletor de motivo (com seleção).
            Toggle do drawer (aprovar/carrinho) fica sempre ancorado à direita. */}
        <div className="flex items-center gap-2 px-3 h-9 border-b border-border bg-muted/20 shrink-0">
          <div className="flex-1 min-w-0">
            {selCount > 0 ? (
              <SelectionActionBar count={selCount} onClear={onClearSelection} onAdd={onAddGroup} />
            ) : (
              <div className="flex items-center gap-2.5 text-[12px] font-sans text-muted-foreground min-w-0">
                <span className="shrink-0">
                  {schemaRows.length} linha{schemaRows.length !== 1 ? 's' : ''}
                </span>
                {alertaRows.length > 0 && (
                  <>
                    <span className="text-muted-foreground/40 select-none">·</span>
                    <button
                      type="button"
                      onClick={() => onSetSelection(activeSchema.id, alertaRows.map((r) => r.id))}
                      className="shrink-0 font-medium text-warning underline-offset-2 hover:underline"
                    >
                      {alertaRows.length} aviso{alertaRows.length !== 1 ? 's' : ''}
                    </button>
                  </>
                )}
                {groupedIndexes.length > 0 && (
                  <>
                    <span className="text-muted-foreground/40 select-none">·</span>
                    <span className="shrink-0">{groupedIndexes.length} no carrinho</span>
                  </>
                )}
                <span className="text-muted-foreground/40 select-none">·</span>
                <span className="text-muted-foreground/60 truncate">marque pelos números à esquerda</span>
              </div>
            )}
          </div>

          {/* Toggles dos painéis — sidebar de categorias (esq) e aprovar/carrinho
              (dir), juntos à direita (espelha o Chat). */}
          <div className="flex items-center gap-0.5 shrink-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="grid place-content-center h-7 w-7 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label={sidebarOpen ? 'Recolher categorias' : 'Expandir categorias'}
                title={sidebarOpen ? 'Recolher categorias' : 'Expandir categorias'}
              >
                {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              </button>
            )}
            {onTogglePanel && (
              <button
                onClick={onTogglePanel}
                className="relative grid place-content-center h-7 w-7 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label={panelOpen ? 'Recolher painel' : 'Expandir painel'}
                title={panelOpen ? 'Recolher painel' : 'Expandir painel'}
              >
                {panelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                {hasCart && !panelOpen && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive ring-1 ring-background" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="relative flex-1 min-h-0">
          {/* Grid full-width — o drawer overlay (glass) fica POR CIMA da tabela,
              então o backdrop-blur capta as linhas atrás dele durante o scroll.
              Com o drawer aberto, o grid ganha colunas-spacer vazias à direita
              (≈ largura do painel) p/ que o scroll-x interno consiga trazer todas
              as colunas reais p/ a esquerda do vidro. */}
          <div className="h-full">
            <InventoryDataGrid
              key={`${categoriaId}:${activeSchema.id}`}
              columns={gridColumns}
              rows={schemaRows.map((r) => r.raw)}
              readOnly
              mutedReadOnly={false}
              rowMarkerKind="both"
              rowSelectionMode="multi"
              highlightedRows={groupedIndexes}
              disabledRows={groupedIndexes}
              onRowSelectionChange={handleRowSelection}
              sortColumnId={sort?.colId}
              sortDir={sort?.dir}
              sortableColumnIds={unidadeColId ? [unidadeColId] : []}
              onHeaderClicked={cycleSort}
              freezeColumns={freezeColumns}
            />
          </div>

          {/* Drawer overlay — sobre a área do grid apenas (não cobre barra/abas) */}
          {drawer}
        </div>

        {/* Abas de schema — estilo Excel, ancoradas ao grid */}
        <div className="flex items-stretch h-9 border-t border-border bg-muted/30 shrink-0 overflow-x-auto">
          {cat.schemas.map((schema) => {
            const isActive = schema.id === activeSchema.id
            const warns = rows
              .filter((r) => r.schemaId === schema.id)
              .reduce((a, r) => a + r.warningCount, 0)
            return (
              <button
                key={schema.id}
                onClick={() => setSchemaId(schema.id)}
                className={`px-4 text-xs font-sans whitespace-nowrap transition-colors border-r border-border flex items-center gap-2 ${
                  isActive
                    ? 'bg-background text-foreground font-medium border-t-2 border-t-planton-accent -mt-px'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {warns > 0 && <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-warning" />}
                {schema.label}
                {warns > 0 && <span className="text-warning/80 tabular-nums">{warns}</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
