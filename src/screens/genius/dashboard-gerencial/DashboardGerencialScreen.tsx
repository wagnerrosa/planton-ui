'use client'

import { useMemo, useState } from 'react'
import { LayoutGrid, Rows3 } from 'lucide-react'
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import { TopSummary } from './TopSummary'
import { AttentionPanel } from './AttentionPanel'
import { MatrixView } from './MatrixView'
import { CategoryView } from './CategoryView'
import { FilialDrawer, type DrawerTarget } from './FilialDrawer'
import {
  EMPRESA,
  ANO_BASE,
  getOverview,
  getAttentionItems,
  type CombinationStatus,
} from './dashboard-data'

type ViewTab = 'visao-geral' | 'por-respondente' | 'por-categoria' | 'historico'
type TableView = 'filial' | 'categoria'

const TABS: { id: ViewTab; label: string; enabled: boolean }[] = [
  { id: 'visao-geral', label: 'Visão Geral', enabled: true },
  { id: 'por-respondente', label: 'Por Respondente', enabled: false },
  { id: 'por-categoria', label: 'Por Categoria', enabled: false },
  { id: 'historico', label: 'Histórico', enabled: false },
]

export function DashboardGerencialScreen() {
  const [activeTab, setActiveTab] = useState<ViewTab>('visao-geral')
  const [tableView, setTableView] = useState<TableView>('filial')
  const [drawerTarget, setDrawerTarget] = useState<DrawerTarget>(null)

  // Filtros da matriz (controlados aqui p/ os chips/KPIs poderem ajustá-los)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [categoriaFilter, setCategoriaFilter] = useState('todas')

  const overview = useMemo(() => getOverview(), [])
  const attentionItems = useMemo(() => getAttentionItems(), [])
  const requerAcao = overview.porStatus['reprovado'] + overview.porStatus['sem-respondente']

  function openDrawer(filialId: string, categoriaId?: string) {
    setDrawerTarget({ filialId, categoriaId })
  }

  // KPI/chip → ajusta filtro e garante visão por filial
  function handleFilterStatus(status: CombinationStatus | 'requer-acao') {
    setTableView('filial')
    setStatusFilter(status === 'em-preenchimento' ? 'pendentes' : status === 'enviado' ? 'concluidas' : status)
  }

  return (
    <div className="flex flex-col h-full">
      <GeniusNavbarSync breadcrumbs={[{ label: 'Dashboard Gerencial' }]} />

      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        {/* Header da tela */}
        <div className="shrink-0 px-6 pt-5 pb-3 border-b border-border">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
              Inventário GEE {ANO_BASE}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success-surface text-success text-[10px] font-sans font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              ao vivo
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

          {/* Tabs por visão */}
          <div className="flex gap-0 mt-3 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                disabled={!tab.enabled}
                onClick={() => tab.enabled && setActiveTab(tab.id)}
                className={`px-3.5 py-2 text-[12px] font-sans font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-planton-accent text-planton-accent'
                    : tab.enabled
                      ? 'border-transparent text-muted-foreground hover:text-foreground'
                      : 'border-transparent text-muted-foreground/40 cursor-not-allowed'
                }`}
                title={tab.enabled ? undefined : 'Em breve'}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Corpo */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'visao-geral' ? (
            <div className="flex flex-col gap-5 max-w-[1480px] mx-auto w-full">
              <TopSummary overview={overview} requerAcao={requerAcao} onFilterStatus={handleFilterStatus} />

              <AttentionPanel items={attentionItems} onOpen={openDrawer} />

              {/* Toggle de visão da tabela */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="font-heading text-[15px] font-semibold text-foreground">
                    {tableView === 'filial' ? 'Matriz Filial × Categoria' : 'Coleta por Categoria'}
                  </h2>
                  <p className="text-[11px] font-sans text-muted-foreground mt-0.5">
                    {tableView === 'filial'
                      ? 'Clique numa célula ou linha para ver detalhes do responsável'
                      : 'Expanda uma categoria para ver as unidades'}
                  </p>
                </div>
                <div className="flex items-center border border-border overflow-hidden">
                  <ToggleBtn
                    active={tableView === 'filial'}
                    onClick={() => setTableView('filial')}
                    icon={<LayoutGrid size={14} />}
                    label="Por Filial"
                  />
                  <ToggleBtn
                    active={tableView === 'categoria'}
                    onClick={() => setTableView('categoria')}
                    icon={<Rows3 size={14} />}
                    label="Por Categoria"
                  />
                </div>
              </div>

              {tableView === 'filial' ? (
                <MatrixView
                  search={search}
                  statusFilter={statusFilter}
                  categoriaFilter={categoriaFilter}
                  onSearch={setSearch}
                  onStatusFilter={setStatusFilter}
                  onCategoriaFilter={setCategoriaFilter}
                  onOpenDrawer={openDrawer}
                />
              ) : (
                <CategoryView onOpenDrawer={openDrawer} />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-20">
              <span className="font-heading text-base font-semibold text-foreground">
                {TABS.find((t) => t.id === activeTab)?.label}
              </span>
              <span className="text-[13px] font-sans text-muted-foreground max-w-sm">
                Esta visão estará disponível em breve.
              </span>
            </div>
          )}
        </div>
      </div>

      <FilialDrawer target={drawerTarget} onClose={() => setDrawerTarget(null)} />
    </div>
  )
}

function ToggleBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 h-8 text-[12px] font-sans font-medium transition-colors ${
        active
          ? 'bg-planton-accent text-white'
          : 'bg-background text-muted-foreground hover:bg-muted'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
