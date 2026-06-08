'use client'

import { useMemo, useRef, useState } from 'react'
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import { EMPRESA, ANO_BASE as DASH_ANO } from '../dashboard-v2/dashboard-data'
import {
  REVIEW_CATEGORIES,
  findReviewCategory,
  getReviewRows,
  getCategoriaResumo,
  getPeriodos,
  type ReviewDecision,
  type RejectionGroup,
} from './dados-data'
import { ReviewSidebar } from './ReviewSidebar'
import { ReviewToolbar } from './ReviewToolbar'
import { ReviewTable } from './ReviewTable'
import { ErrorCart } from './ErrorCart'
import { FilialOverviewPanel } from './ApprovePanel'

export function DadosPorCategoriaScreen() {
  const periodos = useMemo(() => getPeriodos(), [])

  const [categoriaId, setCategoriaId] = useState(REVIEW_CATEGORIES[0].id)
  const [periodoId, setPeriodoId] = useState(periodos[0].id)
  // Sidebar de categorias colapsável (espelha o Chat).
  const [categoriesOpen, setCategoriesOpen] = useState(true)

  // Decisão por categoria (mock — no produto real flipa o ciclo no dashboard-v2)
  const [decisions, setDecisions] = useState<Record<string, ReviewDecision>>({})

  // Seleção transitória na tabela (ainda não no carrinho).
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  // Carrinho = grupos de recusa (motivo + N linhas), escopado por categoria.
  const [groups, setGroups] = useState<RejectionGroup[]>([])
  const groupSeq = useRef(0)

  // Drawer overlay (aprovar / carrinho) por cima da tabela. Abre nas ações que
  // ativam o carrinho (marcar linhas / criar grupo); engenheiro fecha/reabre pelo toggle.
  const [panelOpen, setPanelOpen] = useState(false)

  const cat = findReviewCategory(categoriaId)
  const rows = useMemo(() => getReviewRows(categoriaId), [categoriaId])
  const resumo = useMemo(() => getCategoriaResumo(categoriaId), [categoriaId])
  const rowsById = useMemo(() => new Map(rows.map((r) => [r.id, r])), [rows])

  // Linhas já dentro de algum grupo (não selecionáveis na tabela).
  const groupedIds = useMemo(
    () => new Set(groups.flatMap((g) => g.rowIds)),
    [groups],
  )

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function resetCart() {
    setSelectedIds(new Set())
    setGroups([])
  }

  function changeCategoria(id: string) {
    setCategoriaId(id)
    resetCart()
  }

  // Define a seleção transitória = linhas marcadas no schema ativo do grid
  // (ignora as já no carrinho). A seleção vive sempre num único schema por vez.
  function setSelection(_schemaId: string, rowIds: string[]) {
    const next = new Set(rowIds.filter((id) => !groupedIds.has(id)))
    setSelectedIds(next)
    if (next.size > 0) setPanelOpen(true)
  }

  // Seleção atual → grupo de recusa, agrupado por motivo: o mesmo motivo cai
  // sempre no mesmo grupo (linhas se acumulam, sem duplicar). Exceção: 'outro'
  // (texto livre) — cada justificativa é um grupo próprio.
  function addGroup(motivoId: string, texto: string) {
    const rowIds = [...selectedIds]
    if (rowIds.length === 0) return
    setGroups((g) => {
      const alvo =
        motivoId !== 'outro' ? g.find((x) => x.motivoId === motivoId) : undefined
      if (alvo) {
        const merged = [...new Set([...alvo.rowIds, ...rowIds])]
        return g.map((x) => (x.id === alvo.id ? { ...x, rowIds: merged } : x))
      }
      groupSeq.current += 1
      return [...g, { id: `g${groupSeq.current}`, motivoId, texto, rowIds }]
    })
    setSelectedIds(new Set())
    setPanelOpen(true)
  }

  function removeGroup(groupId: string) {
    setGroups((g) => g.filter((x) => x.id !== groupId))
  }

  function removeRowFromGroup(groupId: string, rowId: string) {
    setGroups((g) =>
      g
        .map((x) => (x.id === groupId ? { ...x, rowIds: x.rowIds.filter((r) => r !== rowId) } : x))
        .filter((x) => x.rowIds.length > 0),
    )
  }

  function recusar() {
    setDecisions((d) => ({ ...d, [categoriaId]: 'reprovado' }))
    resetCart()
    setPanelOpen(false)
  }

  function aprovar() {
    setDecisions((d) => ({ ...d, [categoriaId]: 'aprovado' }))
    resetCart()
    setPanelOpen(false)
  }

  function exportCSV() {
    const cat = findReviewCategory(categoriaId)
    // Une todas as colunas de todos os schemas, deduplicando por id.
    const allColIds: string[] = []
    const colLabels: Record<string, string> = {}
    for (const schema of cat.schemas) {
      for (const col of schema.columns) {
        if (!allColIds.includes(col.id)) {
          allColIds.push(col.id)
          colLabels[col.id] = col.title
        }
      }
    }
    const header = ['Schema', ...allColIds.map((id) => colLabels[id])].join(',')
    const bodyLines = rows.map((r) => {
      const schema = cat.schemas.find((s) => s.id === r.schemaId)?.label ?? r.schemaId
      const cells = allColIds.map((id) => {
        const v = String(r.raw[id] ?? '')
        return v.includes(',') || v.includes('"') || v.includes('\n')
          ? `"${v.replace(/"/g, '""')}"`
          : v
      })
      return [schema, ...cells].join(',')
    })
    const csv = [header, ...bodyLines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${cat.label.replace(/\s+/g, '_')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const decision = decisions[categoriaId] ?? 'pendente'
  const hasCart = groups.length > 0 || selectedIds.size > 0

  return (
    <div className="flex flex-col h-full">
      <GeniusNavbarSync
        breadcrumbs={[
          { label: EMPRESA },
          { label: `Inventário GEE ${DASH_ANO}`, variant: 'pill', dot: true },
          { label: 'Revisão de dados por categoria' },
        ]}
      />

      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        {/* Canvas — toolbar + sidebar + tabela numa moldura (border + shadow) */}
        <div className="flex-1 min-h-0 flex px-6 py-4 bg-muted">
          <div className="flex flex-col flex-1 min-h-0 min-w-0 border border-border bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))] overflow-hidden">
            <ReviewToolbar
              categoriaId={categoriaId}
              periodos={periodos}
              periodoId={periodoId}
              onPeriodo={setPeriodoId}
              decisions={decisions}
              decision={decision}
            />
            <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
            <ReviewSidebar
              categoriaId={categoriaId}
              onCategoria={changeCategoria}
              decisions={decisions}
              open={categoriesOpen}
            />

            {/* Corpo: tabela; drawer overlay vive dentro da ReviewTable,
                sobre a área do grid (não cobre barra/abas) e reserva scroll-x. */}
            <div className="flex-1 min-h-0 min-w-0 flex flex-col">
          <ReviewTable
            key={`${categoriaId}:${periodoId}`}
            categoriaId={categoriaId}
            rows={rows}
            selectedIds={selectedIds}
            groupedIds={groupedIds}
            onSetSelection={setSelection}
            onClearSelection={clearSelection}
            onAddGroup={addGroup}
            sidebarOpen={categoriesOpen}
            onToggleSidebar={() => setCategoriesOpen((v) => !v)}
            panelOpen={panelOpen}
            onTogglePanel={() => setPanelOpen((v) => !v)}
            hasCart={hasCart}
            drawerOpen={panelOpen}
            onExport={exportCSV}
            drawer={
              <aside
                className={`absolute inset-y-0 right-0 z-30 w-[420px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  panelOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
                }`}
              >
                {/* Leito de vidro — translúcido p/ ver a tabela borrada atrás durante o scroll.
                    Fechar é pelo toggle na barra superior (sem X redundante aqui). */}
                <div className="relative h-full flex flex-col bg-background/35 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-border/40 overflow-hidden">
                  <div className="flex-1 min-h-0 p-1.5">
                    {hasCart ? (
                      <ErrorCart
                        groups={groups}
                        rowsById={rowsById}
                        onRemoveGroup={removeGroup}
                        onRemoveRow={removeRowFromGroup}
                        onClear={resetCart}
                        onRecusar={recusar}
                      />
                    ) : (
                      <FilialOverviewPanel
                        key={categoriaId}
                        resumo={resumo}
                        categoriaLabel={cat.label}
                        locked={decision === 'reprovado'}
                        onAprovar={aprovar}
                      />
                    )}
                  </div>
                </div>
              </aside>
            }
          />

            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
