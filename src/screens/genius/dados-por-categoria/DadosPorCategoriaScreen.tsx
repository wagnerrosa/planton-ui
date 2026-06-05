'use client'

import { useMemo, useState } from 'react'
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import { EMPRESA, ANO_BASE as DASH_ANO } from '../dashboard-v2/dashboard-data'
import {
  REVIEW_CATEGORIES,
  findReviewCategory,
  getReviewRows,
  getCategoriaResumo,
  getPeriodos,
  PERIODICIDADE,
  type ReviewDecision,
} from './dados-data'
import { ReviewToolbar } from './ReviewToolbar'
import { ReviewTable } from './ReviewTable'
import { ErrorCart, type Justificativa } from './ErrorCart'
import { ApprovePanel } from './ApprovePanel'

export function DadosPorCategoriaScreen() {
  const periodos = useMemo(() => getPeriodos(), [])
  const periodoTipoLabel = PERIODICIDADE === 'anual' ? 'Ano' : 'Mês'

  const [categoriaId, setCategoriaId] = useState(REVIEW_CATEGORIES[0].id)
  const [periodoId, setPeriodoId] = useState(periodos[0].id)

  // Decisão por categoria (mock — no produto real flipa o ciclo no dashboard-v2)
  const [decisions, setDecisions] = useState<Record<string, ReviewDecision>>({})
  // Resultados aprovados: categoriaId → tCO₂e confirmado
  const [aprovados, setAprovados] = useState<Record<string, number>>({})

  // Seleção (carrinho) + justificativas, escopadas por categoria.
  // Reset ao trocar de categoria via key no DrawerLikeBody.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [justificativas, setJustificativas] = useState<Map<string, Justificativa>>(new Map())

  const cat = findReviewCategory(categoriaId)
  const rows = useMemo(() => getReviewRows(categoriaId), [categoriaId])
  const resumo = useMemo(() => getCategoriaResumo(categoriaId), [categoriaId])

  const cartRows = useMemo(() => rows.filter((r) => selectedIds.has(r.id)), [rows, selectedIds])

  function resetSelection() {
    setSelectedIds(new Set())
    setJustificativas(new Map())
  }

  function changeCategoria(id: string) {
    setCategoriaId(id)
    resetSelection()
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setJustificativas((jm) => {
          const njm = new Map(jm)
          njm.delete(id)
          return njm
        })
      } else {
        next.add(id)
      }
      return next
    })
  }

  function toggleMany(ids: string[], select: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const id of ids) {
        if (select) next.add(id)
        else next.delete(id)
      }
      return next
    })
    if (!select) {
      setJustificativas((jm) => {
        const njm = new Map(jm)
        for (const id of ids) njm.delete(id)
        return njm
      })
    }
  }

  function setMotivo(rowId: string, motivoId: string) {
    setJustificativas((jm) => {
      const njm = new Map(jm)
      const cur = njm.get(rowId) ?? { motivoId: '', texto: '' }
      njm.set(rowId, { ...cur, motivoId })
      return njm
    })
  }

  function setTexto(rowId: string, texto: string) {
    setJustificativas((jm) => {
      const njm = new Map(jm)
      const cur = njm.get(rowId) ?? { motivoId: '', texto: '' }
      njm.set(rowId, { ...cur, texto })
      return njm
    })
  }

  function recusar() {
    setDecisions((d) => ({ ...d, [categoriaId]: 'reprovado' }))
    setAprovados((a) => {
      const next = { ...a }
      delete next[categoriaId]
      return next
    })
    resetSelection()
  }

  function aprovar(tco2e: number) {
    setDecisions((d) => ({ ...d, [categoriaId]: 'aprovado' }))
    setAprovados((a) => ({ ...a, [categoriaId]: tco2e }))
    resetSelection()
  }

  const decision = decisions[categoriaId] ?? 'pendente'
  const hasCart = cartRows.length > 0

  return (
    <div className="flex flex-col h-full">
      <GeniusNavbarSync />

      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        {/* Header */}
        <div className="shrink-0 px-6 h-12 flex items-center gap-2 border-b border-border">
          <span className="text-[13px] font-sans text-muted-foreground shrink-0">{EMPRESA}</span>
          <span className="text-muted-foreground/40 shrink-0">/</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-border text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Inventário GEE {DASH_ANO}
          </span>
          <span className="text-muted-foreground/40 shrink-0">/</span>
          <h1 className="text-[13px] font-sans font-semibold text-foreground truncate">
            Revisão de dados por categoria
          </h1>
        </div>

        <ReviewToolbar
          categoriaId={categoriaId}
          onCategoria={changeCategoria}
          periodos={periodos}
          periodoId={periodoId}
          onPeriodo={setPeriodoId}
          periodoTipoLabel={periodoTipoLabel}
          decisions={decisions}
        />

        {/* Corpo: tabela + painel lateral */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4 px-6 py-4 overflow-hidden">
          <div className="min-h-0 min-w-0 flex flex-col">
            <ReviewTable
              key={`${categoriaId}:${periodoId}`}
              categoriaId={categoriaId}
              rows={rows}
              selectedIds={selectedIds}
              onToggleRow={toggleRow}
              onToggleMany={toggleMany}
            />
          </div>

          {/* Painel: carrinho de erros OU aprovar. Carrinho ativo tem prioridade. */}
          <aside className="min-h-0 hidden lg:flex flex-col">
            {hasCart ? (
              <ErrorCart
                rows={cartRows}
                justificativas={justificativas}
                onSetMotivo={setMotivo}
                onSetTexto={setTexto}
                onRemove={toggleRow}
                onClear={resetSelection}
                onRecusar={recusar}
              />
            ) : (
              <ApprovePanel
                key={categoriaId}
                resumo={resumo}
                categoriaLabel={cat.label}
                onAprovar={aprovar}
              />
            )}
          </aside>
        </div>

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
  )
}
