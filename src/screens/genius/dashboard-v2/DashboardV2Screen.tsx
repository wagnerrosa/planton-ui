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
        label: 'combinações coletadas e aprovadas',
        value: String(overview.concluidas),
        tone: 'success',
      },
      {
        key: 'sem-resp',
        label: 'filiais sem responsável designado',
        value: String(overview.porStatus['sem-respondente']),
        tone: overview.porStatus['sem-respondente'] > 0 ? 'warning' : 'default',
      },
      {
        key: 'reprovadas',
        label: 'categorias reprovadas pelo gestor',
        value: String(overview.porStatus['reprovado']),
        tone: overview.porStatus['reprovado'] > 0 ? 'destructive' : 'default',
      },
      {
        key: 'linhas',
        label: 'linhas coletadas no inventário',
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
      <GeniusNavbarSync
        breadcrumbs={[
          { label: EMPRESA },
          { label: `Inventário GEE ${ANO_BASE}`, variant: 'pill', dot: true },
          { label: 'Rastreamento de Coleta de Dados' },
        ]}
      />

      <div className="flex flex-col flex-1 overflow-hidden bg-background">
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
