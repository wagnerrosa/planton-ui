'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { PanelRightOpen, PanelRightClose, PanelLeftOpen, PanelLeftClose, ChevronDown, Download } from 'lucide-react'
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
  onExport,
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
  /** exporta todas as linhas da categoria como CSV */
  onExport?: () => void
}) {
  const cat = findReviewCategory(categoriaId)
  const [schemaId, setSchemaId] = useState(cat.schemas[0]?.id)

  const activeSchema = cat.schemas.find((s) => s.id === schemaId) ?? cat.schemas[0]

  // Colunas exclusivas da revisão, injetadas sobre o schema compartilhado do Chat:
  // Responsável (filtrável) à esquerda e procedência (ID do arquivo / Origem /
  // Alterações) à direita. Combustão móvel: litros, quilometragem e origem→destino.
  const isProcedenciaSchema =
    categoriaId === 'combustao-movel' &&
    ['litros', 'km', 'origem-destino'].includes(activeSchema.id)
  const augmentedColumns = useMemo(() => {
    if (!isProcedenciaSchema) return activeSchema.columns
    return [
      { id: 'responsavel', title: 'Responsável', width: 160, description: 'Responsável pela filial/unidade.' } as const,
      ...activeSchema.columns,
      { id: 'origem', title: 'Origem do dado', width: 200, type: 'bubble', description: 'Arquivo de origem do dado — clique para baixar. Vira "manual" quando algum valor da linha é alterado.' } as const,
      { id: 'alteracoes', title: 'Alterações', width: 200, description: 'Colunas alteradas na linha (separadas por ";"). Vazia para linhas não editadas e manuais.' } as const,
    ]
  }, [activeSchema.columns, isProcedenciaSchema])

  // Coluna "Unidade"/"Filial" do schema ativo (varia o id por formato: filial / unidade_empresa / unidade-op).
  const unidadeColIdx = useMemo(
    () => augmentedColumns.findIndex((c) => c.title === 'Unidade' || c.title === 'Filial'),
    [augmentedColumns],
  )
  const unidadeColId = unidadeColIdx >= 0 ? augmentedColumns[unidadeColIdx].id : undefined

  // Responsável: move para ANTES de Unidade — responsável é a 1ª coluna sticky,
  // unidade vem logo depois. Não altera o mock compartilhado.
  const reorderedColumns = useMemo(() => {
    const cols = [...augmentedColumns]
    const respIdx = cols.findIndex((c) => c.id === 'responsavel')
    if (respIdx < 0 || unidadeColIdx < 0) return cols
    const [respCol] = cols.splice(respIdx, 1)
    // Recalcula unidadeColIdx após remoção de respCol (se estava antes de unidade, índice cai 1).
    const adjustedUnidadeIdx = respIdx < unidadeColIdx ? unidadeColIdx - 1 : unidadeColIdx
    cols.splice(adjustedUnidadeIdx, 0, respCol)
    return cols
  }, [augmentedColumns, unidadeColIdx])

  const responsavelColId = useMemo(
    () => augmentedColumns.find((c) => c.id === 'responsavel')?.id,
    [augmentedColumns],
  )

  // Freeze até Unidade/Filial (inclusive) na ordem final do grid — Responsável,
  // quando existe, já foi movido para antes dela, então fica dentro do freeze.
  // Demais colunas (Mês de Emissão etc.) ficam livres para scroll.
  const freezeColumns = useMemo(() => {
    if (unidadeColIdx < 0) return 0
    const idx = reorderedColumns.findIndex((c) => c.id === unidadeColId)
    return idx >= 0 ? idx + 1 : 0
  }, [reorderedColumns, unidadeColId, unidadeColIdx])

  const gridColumns = useMemo(
    () =>
      drawerOpen
        ? [...reorderedColumns, { id: '__spacer', title: '', width: 440 }]
        : reorderedColumns,
    [reorderedColumns, drawerOpen],
  )

  const [sort, setSort] = useState<{ colId: string; dir: 'asc' | 'desc' } | null>(() =>
    unidadeColId ? { colId: unidadeColId, dir: 'asc' } : null,
  )

  const [filtroRespondente, setFiltroRespondente] = useState<string | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  // Posição X do dropdown relativa ao container do grid (px).
  const [filterX, setFilterX] = useState(0)
  const gridContainerRef = useRef<HTMLDivElement>(null)

  const respondentes = useMemo(
    () =>
      [...new Set(rows.filter((r) => r.schemaId === activeSchema.id).map((r) => r.respondente))].sort(),
    [rows, activeSchema.id],
  )

  // Índice da coluna responsável dentro das colunas reordenadas do grid.
  const responsavelGridIdx = useMemo(
    () => gridColumns.findIndex((c) => c.id === 'responsavel'),
    [gridColumns],
  )

  function cycleSort(colId: string) {
    if (colId === responsavelColId) {
      // Calcula posição X da coluna no grid: rowMarkerWidth(44) + soma das larguras anteriores.
      const ROW_MARKER = 44
      const colsBeforeResp = gridColumns.slice(0, responsavelGridIdx)
      const x = ROW_MARKER + colsBeforeResp.reduce((acc, c) => acc + (c.width ?? 150), 0)
      const containerRect = gridContainerRef.current?.getBoundingClientRect()
      // Clamp para não sair pela direita.
      const containerW = containerRect?.width ?? 800
      const dropdownW = 220
      setFilterX(Math.min(x, containerW - dropdownW - 8))
      setFilterOpen((v) => !v)
      return
    }
    setSort((s) => {
      if (!s || s.colId !== colId) return { colId, dir: 'asc' }
      if (s.dir === 'asc') return { colId, dir: 'desc' }
      return null
    })
  }

  // Linhas do schema ativo, na ordem do grid (índice = posição). Aplica ordenação
  // pela coluna escolhida (localeCompare pt-BR); sem sort = ordem original.
  // Filtra por respondente quando ativo.
  const schemaRows = useMemo(() => {
    const base = rows.filter((r) => r.schemaId === activeSchema.id)
    let sorted: ReviewRow[]
    if (!sort) {
      sorted = base
    } else {
      const get = (r: ReviewRow) => String(r.raw[sort.colId] ?? '')
      sorted = [...base].sort((a, b) =>
        get(a).localeCompare(get(b), 'pt-BR', { numeric: true, sensitivity: 'base' }),
      )
      if (sort.dir === 'desc') sorted.reverse()
    }
    return filtroRespondente ? sorted.filter((r) => r.respondente === filtroRespondente) : sorted
  }, [rows, activeSchema.id, sort, filtroRespondente])

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

  // Troca de aba zera a seleção transitória (o grid remonta e perde a sua),
  // volta a ordenação ao padrão (Unidade A→Z) e reseta o filtro de respondente.
  useEffect(() => {
    onClearSelection()
    setSort(unidadeColId ? { colId: unidadeColId, dir: 'asc' } : null)
    setFiltroRespondente(null)
    setFilterOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaId])

  function handleRowSelection(indexes: number[]) {
    onSetSelection(activeSchema.id, indexes.map((i) => idByIndex[i]).filter(Boolean))
  }

  // Download do arquivo de origem (mock): no produto real baixa o arquivo enviado
  // pelo respondente; aqui gera um placeholder com o mesmo nome.
  function handleDownloadFile(_rowIndex: number, fileName: string) {
    const blob = new Blob([`Arquivo de origem (mock): ${fileName}\n`], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
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
                {filtroRespondente && (
                  <>
                    <span className="text-muted-foreground/40 select-none">·</span>
                    <button
                      type="button"
                      onClick={() => setFiltroRespondente(null)}
                      className="flex items-center gap-1 text-[12px] font-medium text-planton-accent hover:text-planton-accent/70 shrink-0"
                    >
                      {filtroRespondente}
                      <ChevronDown className="h-3 w-3 -rotate-90" />
                    </button>
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
            {onExport && (
              <button
                onClick={onExport}
                className="grid place-content-center h-7 w-7 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Exportar CSV"
                title="Exportar categoria como CSV"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
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
          <div className="h-full" ref={gridContainerRef}>
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
              onAnyHeaderClicked={(colId) => {
                if (colId === responsavelColId) cycleSort(colId)
              }}
              filterColumnIds={responsavelColId ? [responsavelColId] : []}
              activeFilterColumnIds={filtroRespondente && responsavelColId ? [responsavelColId] : []}
              freezeColumns={freezeColumns}
              fileCellColumnIds={isProcedenciaSchema ? ['origem'] : undefined}
              onFileCellClick={isProcedenciaSchema ? handleDownloadFile : undefined}
            />
          </div>

          {/* Dropdown filtro responsável — posicionado sobre o header da coluna */}
          {filterOpen && responsavelColId && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
              <div
                className="absolute z-50 min-w-[200px] border border-border bg-background shadow-lg overflow-hidden"
                style={{ top: 36, left: filterX }}
              >
                <div className="px-3 py-1.5 border-b border-border/50 text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
                  Filtrar por responsável
                </div>
                <button
                  onClick={() => { setFiltroRespondente(null); setFilterOpen(false) }}
                  className={`w-full text-left px-3 py-2 text-[12px] hover:bg-muted flex items-center gap-2 ${!filtroRespondente ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                >
                  {!filtroRespondente && <span className="w-1.5 h-1.5 rounded-full bg-planton-accent shrink-0" />}
                  <span className={!filtroRespondente ? '' : 'pl-[18px]'}>Todos</span>
                </button>
                {respondentes.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setFiltroRespondente(r); setFilterOpen(false) }}
                    className={`w-full text-left px-3 py-2 text-[12px] hover:bg-muted flex items-center gap-2 ${filtroRespondente === r ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                  >
                    {filtroRespondente === r && <span className="w-1.5 h-1.5 rounded-full bg-planton-accent shrink-0" />}
                    <span className={filtroRespondente === r ? '' : 'pl-[18px]'}>{r}</span>
                  </button>
                ))}
              </div>
            </>
          )}

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
