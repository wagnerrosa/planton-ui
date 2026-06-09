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
  type RespStatus,
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

  // Status por respondente, escopado por categoria (mock). A revisão é granular:
  // recusar nega o envio inteiro de um respondente; aprovar registra o restante.
  // Sem entrada = pendente. A categoria nunca "fecha" (dado novo pode chegar).
  // Seed: Combustão móvel já entra com alguns respondentes resolvidos (2 aprovados,
  // 2 recusados) p/ demonstrar a aprovação parcial e os 3 estados do painel.
  const [respStatus, setRespStatus] = useState<Record<string, Record<string, RespStatus>>>({
    'combustao-movel': {
      'Carlos Mendes': 'aprovado',
      'Patrícia Souza': 'aprovado',
      'Diego Martins': 'recusado',
      'Fernando Alves': 'recusado',
    },
  })

  // Seleção transitória na tabela (ainda não no carrinho).
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  // Carrinho = grupos de recusa (motivo + N linhas), escopado por categoria.
  const [groups, setGroups] = useState<RejectionGroup[]>([])
  const groupSeq = useRef(0)

  // Drawer overlay (aprovar / carrinho) por cima da tabela. Abre nas ações que
  // ativam o carrinho (marcar linhas / criar grupo); engenheiro fecha/reabre pelo toggle.
  const [panelOpen, setPanelOpen] = useState(false)

  // Status dos respondentes da categoria atual (sub-mapa). Memoizado p/ ref
  // estável — entra como dep de vários useMemo abaixo.
  const statusCat = useMemo(() => respStatus[categoriaId] ?? {}, [respStatus, categoriaId])

  // Todas as linhas da categoria; depois filtra os respondentes recusados — o
  // envio recusado é negado por inteiro e sai da tabela/painel.
  const allRows = useMemo(() => getReviewRows(categoriaId), [categoriaId])
  const rows = useMemo(
    () => allRows.filter((r) => statusCat[r.respondente] !== 'recusado'),
    [allRows, statusCat],
  )
  const resumo = useMemo(
    () => getCategoriaResumo(categoriaId, statusCat),
    [categoriaId, statusCat],
  )
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

  // Respondentes alcançados pelo carrinho: o envio é atômico, então recusar
  // qualquer linha de um respondente nega TODAS as linhas/filiais dele.
  const affectedRespondentes = useMemo(() => {
    const set = new Set<string>()
    for (const id of groupedIds) {
      const resp = rowsById.get(id)?.respondente
      if (resp) set.add(resp)
    }
    return [...set]
  }, [groupedIds, rowsById])

  function recusar() {
    if (affectedRespondentes.length === 0) return
    setRespStatus((prev) => {
      const cur = { ...(prev[categoriaId] ?? {}) }
      for (const resp of affectedRespondentes) cur[resp] = 'recusado'
      return { ...prev, [categoriaId]: cur }
    })
    resetCart()
  }

  function aprovar() {
    // Aprova o que sobrou: respondentes ainda pendentes (visíveis e não recusados).
    setRespStatus((prev) => {
      const cur = { ...(prev[categoriaId] ?? {}) }
      for (const r of rows) {
        if (cur[r.respondente] !== 'recusado') cur[r.respondente] = 'aprovado'
      }
      return { ...prev, [categoriaId]: cur }
    })
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

  // Decisão derivada p/ a toolbar/sidebar: 'aprovado' quando há ao menos um
  // respondente aprovado e nenhum ainda pendente entre os visíveis; senão
  // 'pendente'. Não existe mais 'reprovado' global — recusa é por respondente.
  const decision: ReviewDecision = useMemo(() => {
    const respondentesVisiveis = new Set(rows.map((r) => r.respondente))
    const algumAprovado = [...respondentesVisiveis].some((r) => statusCat[r] === 'aprovado')
    const algumPendente = [...respondentesVisiveis].some((r) => statusCat[r] == null)
    return algumAprovado && !algumPendente ? 'aprovado' : 'pendente'
  }, [rows, statusCat])

  // Mapa categoria→decisão derivada, p/ toolbar/sidebar (badges por categoria).
  const decisions: Record<string, ReviewDecision> = useMemo(
    () => ({ [categoriaId]: decision }),
    [categoriaId, decision],
  )

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
                        affectedRespondentes={affectedRespondentes}
                        onRemoveGroup={removeGroup}
                        onRemoveRow={removeRowFromGroup}
                        onClear={resetCart}
                        onRecusar={recusar}
                      />
                    ) : (
                      <FilialOverviewPanel
                        key={categoriaId}
                        resumo={resumo}
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
