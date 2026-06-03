import { Layers, Send, Loader2, Clock, AlertTriangle } from 'lucide-react'
import { KpiCard } from './KpiCard'
import { STATUS_META, type CombinationStatus, type Overview } from './dashboard-data'

// Ordem dos segmentos na barra (concluído → pendente → requer ação).
const BAR_ORDER: CombinationStatus[] = [
  'aprovado', 'enviado', 'em-preenchimento', 'aguardando', 'sem-respondente', 'reprovado',
]

export function TopSummary({
  overview,
  requerAcao,
  onFilterStatus,
}: {
  overview: Overview
  requerAcao: number
  onFilterStatus?: (status: CombinationStatus | 'requer-acao') => void
}) {
  const { pctConclusao, concluidas, totalCombinacoes, naoAplicaveis, porStatus } = overview
  const emAndamento = porStatus['em-preenchimento'] + porStatus['aguardando']
  const pendentes = totalCombinacoes - concluidas

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
      {/* Hero compacto — % conclusão + barra segmentada */}
      <div className="flex flex-col gap-3 border border-border bg-card px-5 py-5">
        <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-muted-foreground">
          Progresso do inventário
        </span>
        <div className="flex items-end gap-2">
          <span className="font-heading text-5xl font-semibold leading-none text-planton-accent">
            {pctConclusao}
            <span className="text-2xl text-muted-foreground font-normal">%</span>
          </span>
        </div>
        <span className="text-[13px] font-sans text-muted-foreground">
          <strong className="text-foreground font-semibold">{concluidas} de {totalCombinacoes}</strong>{' '}
          combinações filial × categoria concluídas
        </span>

        {/* Barra segmentada por status */}
        <div className="mt-1 flex h-2 w-full overflow-hidden rounded-full bg-muted">
          {BAR_ORDER.map((status) => {
            const count = porStatus[status]
            if (count === 0) return null
            const pct = (count / totalCombinacoes) * 100
            return (
              <span
                key={status}
                className={`h-full ${STATUS_META[status].barClass}`}
                style={{ width: `${pct}%` }}
                title={`${STATUS_META[status].label}: ${count}`}
              />
            )
          })}
        </div>
        <span className="text-[11px] font-sans text-muted-foreground">
          {naoAplicaveis} combinações não aplicáveis · atualizado {overview.ultimaAtualizacaoLabel}
        </span>
      </div>

      {/* KPI cards estilo agrex */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <KpiCard
          label="Categorias"
          value={totalCombinacoes}
          sublabel="combinações ativas"
          icon={Layers}
        />
        <KpiCard
          label="Concluídas"
          value={concluidas}
          sublabel={`${pctConclusao}% do inventário`}
          icon={Send}
          accent="accent"
          onClick={onFilterStatus ? () => onFilterStatus('enviado') : undefined}
        />
        <KpiCard
          label="Em andamento"
          value={emAndamento}
          sublabel="preench. / aguard."
          icon={Loader2}
          accent="info"
          onClick={onFilterStatus ? () => onFilterStatus('em-preenchimento') : undefined}
        />
        <KpiCard
          label="Pendentes"
          value={pendentes}
          sublabel="ainda não concluídas"
          icon={Clock}
          accent="muted"
        />
        <KpiCard
          label="Requer ação"
          value={requerAcao}
          sublabel="reprovado / sem resp."
          icon={AlertTriangle}
          accent={requerAcao > 0 ? 'destructive' : 'muted'}
          onClick={onFilterStatus ? () => onFilterStatus('requer-acao') : undefined}
        />
      </div>
    </div>
  )
}
