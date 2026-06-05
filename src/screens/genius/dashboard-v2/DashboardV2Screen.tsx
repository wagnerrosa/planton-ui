'use client'

import { useMemo, useState } from 'react'
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import {
  EMPRESA,
  ANO_BASE,
  getOverview,
  getAttentionItems,
} from '../dashboard-gerencial/dashboard-data'
import { FilialDrawer, type DrawerTarget } from '../dashboard-gerencial/FilialDrawer'
import { getTotalLinhas } from './v2-derive'
import { HeroSummary, type MiniStat } from './HeroSummary'
import { AttentionList } from './AttentionList'
import { CollectionPanel } from './CollectionPanel'

export function DashboardV2Screen() {
  const [drawerTarget, setDrawerTarget] = useState<DrawerTarget>(null)

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
      <GeniusNavbarSync breadcrumbs={[{ label: 'Dashboard Gerencial' }]} />

      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        {/* Header da tela */}
        <div className="shrink-0 px-6 pt-5 pb-4 border-b border-border">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
              Inventário GEE {ANO_BASE}
            </span>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mt-1">
            <h1 className="font-heading text-xl font-semibold text-foreground">
              Rastreamento de Coleta de Dados
            </h1>
            <span className="text-[12px] font-sans text-muted-foreground">
              {EMPRESA} · ano-base {ANO_BASE}
            </span>
          </div>
        </div>

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-6 max-w-[1280px] mx-auto w-full">
            <HeroSummary overview={overview} stats={stats} />
            <AttentionList items={attentionItems} onOpen={openDrawer} />
            <CollectionPanel onOpenDrawer={openDrawer} />
          </div>
        </div>
      </div>

      <FilialDrawer target={drawerTarget} onClose={() => setDrawerTarget(null)} />
    </div>
  )
}
