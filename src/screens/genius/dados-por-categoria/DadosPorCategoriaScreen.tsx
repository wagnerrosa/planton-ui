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
import { ApprovePanel } from './ApprovePanel'

export function DadosPorCategoriaScreen() {
  const periodos = useMemo(() => getPeriodos(), [])

  const [categoriaId, setCategoriaId] = useState(REVIEW_CATEGORIES[0].id)
  const [periodoId, setPeriodoId] = useState(periodos[0].id)
  // Sidebar de categorias colapsável (espelha o Chat).
  const [categoriesOpen, setCategoriesOpen] = useState(true)

  // Decisão por categoria (mock — no produto real flipa o ciclo no dashboard-v2)
  const [decisions, setDecisions] = useState<Record<string, ReviewDecision>>({})
  // Resultados aprovados: categoriaId → tCO₂e confirmado
  const [aprovados, setAprovados] = useState<Record<string, number>>({})

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
    setAprovados((a) => {
      const next = { ...a }
      delete next[categoriaId]
      return next
    })
    resetCart()
    setPanelOpen(false)
  }

  function aprovar(tco2e: number) {
    setDecisions((d) => ({ ...d, [categoriaId]: 'aprovado' }))
    setAprovados((a) => ({ ...a, [categoriaId]: tco2e }))
    resetCart()
    setPanelOpen(false)
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
        {/* Topo: contexto da categoria ativa + período + decisão (full-width) */}
        <ReviewToolbar
          categoriaId={categoriaId}
          periodos={periodos}
          periodoId={periodoId}
          onPeriodo={setPeriodoId}
          decisions={decisions}
        />

        {/* Canvas — sidebar de categorias + tabela vivem juntos numa moldura
            (border + shadow), espelhando o canvas do Chat. */}
        <div className="flex-1 min-h-0 flex px-6 py-4">
          <div className="flex flex-1 min-h-0 min-w-0 border border-border bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))] overflow-hidden">
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
                      <ApprovePanel
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

              {/* Faixa de resultado da decisão */}
              {decision !== 'pendente' && (
                <div
                  className={`shrink-0 px-6 py-2 text-[12px] border-t ${
                    decision === 'aprovado'
                      ? 'bg-success-surface border-success-border text-success'
                      : 'bg-destructive-surface border-destructive-border text-destructive'
                  }`}
                >
                  {decision === 'aprovado'
                    ? `${cat.label} aprovada · ${(aprovados[categoriaId] ?? 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} tCO₂e consolidado.`
                    : `${cat.label} reprovada e devolvida ao respondente. O ciclo de coleta volta para correção.`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
