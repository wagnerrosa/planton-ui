'use client'

import { useMemo, useState } from 'react'
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import {
  EMPRESA,
  ANO_BASE,
  getOverview,
  getAttentionItems,
} from './dashboard-data'
import { FilialDrawerV2, type DrawerTarget } from './FilialDrawerV2'
import { AttentionSheet } from './AttentionSheet'
import { getTotalLinhas } from './v2-derive'
import { DashboardTop, type MiniStat } from './DashboardTop'
import { CollectionPanel } from './CollectionPanel'

export function DashboardV2Screen() {
  const [drawerTarget, setDrawerTarget] = useState<DrawerTarget>(null)
  const [attentionOpen, setAttentionOpen] = useState(false)

  const overview = useMemo(() => getOverview(), [])
  const attentionItems = useMemo(() => getAttentionItems(), [])
  const totalLinhas = useMemo(() => getTotalLinhas(), [])

  const stats: MiniStat[] = useMemo(
    () => [
      {
        key: 'concluidas',
        label: 'combinações concluídas',
        value: String(overview.concluidas),
        tone: 'success',
      },
      {
        key: 'sem-resp',
        label: 'sem responsável',
        value: String(overview.porStatus['sem-respondente']),
        tone: overview.porStatus['sem-respondente'] > 0 ? 'warning' : 'default',
      },
      {
        key: 'reprovadas',
        label: 'reprovadas',
        value: String(overview.porStatus['reprovado']),
        tone: overview.porStatus['reprovado'] > 0 ? 'destructive' : 'default',
      },
      {
        key: 'linhas',
        label: 'linhas coletadas',
        value: totalLinhas.toLocaleString('pt-BR'),
        tone: 'accent',
      },
    ],
    [overview, totalLinhas],
  )

  function openDrawer(filialId: string, categoriaId?: string) {
    setDrawerTarget({ filialId, categoriaId })
  }

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
            Inventário GEE {ANO_BASE}
          </span>
          <span className="text-muted-foreground/40 shrink-0">/</span>
          <h1 className="text-[13px] font-sans font-semibold text-foreground truncate">
            Rastreamento de Coleta de Dados
          </h1>
        </div>

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-col gap-12 max-w-[1280px] mx-auto w-full">
            <DashboardTop
              overview={overview}
              stats={stats}
              attentionItems={attentionItems}
              onAttentionOpen={openDrawer}
              onSeeAllAttention={() => setAttentionOpen(true)}
            />
            <CollectionPanel onOpenDrawer={openDrawer} />
          </div>
        </div>
      </div>

      <AttentionSheet
        open={attentionOpen}
        items={attentionItems}
        onOpenChange={setAttentionOpen}
        onOpenItem={openDrawer}
      />
      <FilialDrawerV2 target={drawerTarget} onClose={() => setDrawerTarget(null)} />
    </div>
  )
}
