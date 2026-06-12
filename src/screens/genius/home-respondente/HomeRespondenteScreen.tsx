'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, CalendarClock, CalendarDays, CalendarRange, CheckCircle2 } from 'lucide-react'
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { EMPRESA } from '../dashboard-v2/dashboard-data'
import {
  PERIODO_STATUS_META,
  KPI_STATUSES,
  CHAT_HREF,
  COM_PRAZO,
  countByStatus,
  inventariosDoCenario,
  getReprovado,
  getProgresso,
  getFilaPriorizada,
  formatPrazoCurto,
  type DemoScenario,
  type Inventario,
  type PeriodoStatus,
} from './home-data'

const MICRO_LABEL = 'text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground'
const INVENTORY_KPI_STATUSES = KPI_STATUSES.filter((status) => status !== 'aguardando')

export function HomeRespondenteScreen() {
  // Filtro por status — clicar num KPI alterna; clicar de novo limpa.
  const [filtro, setFiltro] = useState<PeriodoStatus | null>(null)
  const [demoScenario, setDemoScenario] = useState<DemoScenario>('default')

  const inventarios = useMemo(() => inventariosDoCenario(demoScenario), [demoScenario])
  const counts = useMemo(() => countByStatus(inventarios), [inventarios])
  const reprovado = useMemo(() => getReprovado(inventarios), [inventarios])
  // Próximo prazo da fila priorizada (1º item) + progresso geral, p/ o resumo do rodapé.
  const proximoPrazo = useMemo(() => {
    const fila = getFilaPriorizada(inventarios)
    return fila.find(({ periodo }) => periodo.prazo) ?? null
  }, [inventarios])
  const totalPeriodos = inventarios.reduce(
    (acc, inv) => acc + inv.periodos.filter((p) => p.status !== 'aguardando').length,
    0,
  )
  const pendentes = counts.reprovado + counts['em-andamento'] + counts.disponivel
  const subtitulo = reprovado
    ? 'Uma pendência bloqueia o inventário — comece por ela.'
    : pendentes > 0
      ? `Você tem ${pendentes} ${pendentes === 1 ? 'período pendente' : 'períodos pendentes'} de coleta.`
      : 'Tudo em dia por aqui.'
  const navbarActions = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <NavbarScenarioButton
          label="Tudo em dia"
          active={demoScenario === 'all-clear'}
          onClick={() => setDemoScenario((cur) => (cur === 'all-clear' ? 'default' : 'all-clear'))}
        />
        <NavbarScenarioButton
          label="Só anual"
          active={demoScenario === 'annual-only'}
          onClick={() => setDemoScenario((cur) => (cur === 'annual-only' ? 'default' : 'annual-only'))}
        />
        <NavbarScenarioButton
          label="Anual + histórico"
          active={demoScenario === 'annual-with-history'}
          onClick={() => setDemoScenario((cur) => (cur === 'annual-with-history' ? 'default' : 'annual-with-history'))}
        />
      </div>
    ),
    [demoScenario],
  )

  return (
    <div className="flex flex-col h-full">
      <GeniusNavbarSync
        breadcrumbs={[{ label: EMPRESA }, { label: 'Seus inventários' }]}
        rightContent={navbarActions}
      />

      {/* Shell igual ao DashboardV2: bg-background, corpo px-6 py-8, max-w 1280 */}
      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-col gap-6 max-w-[1280px] mx-auto w-full">
            {/* Cabeçalho: editorial à esquerda + visão geral vertical à direita */}
            <header className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-stretch">
              <div className="bg-card border border-border p-6 lg:p-7 flex flex-col gap-5 min-w-0">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-planton-accent">
                    {EMPRESA}
                  </span>
                  <h1 className="font-heading text-2xl font-semibold text-foreground">Sua central de coleta</h1>
                  <p className="text-[13px] font-sans text-muted-foreground">{subtitulo}</p>
                </div>

                {reprovado && !filtro && (
                  <Link
                    href={CHAT_HREF}
                    className="group flex items-center gap-3 border border-destructive-border bg-destructive-surface px-4 py-3 transition-colors hover:border-destructive/40"
                  >
                    <AlertCircle size={14} className="shrink-0 text-destructive" />
                    <span className="min-w-0 flex-1 truncate text-[12px] font-sans text-destructive">
                      <span className="font-medium">{reprovado.periodo.label} reprovado</span>
                      {reprovado.periodo.motivo && <span className="opacity-80"> — {reprovado.periodo.motivo}</span>}
                    </span>
                    <span className="shrink-0 inline-flex items-center gap-1 text-[12px] font-sans font-medium text-destructive">
                      Corrigir
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                )}

                {/* Resumo de signal real — preenche o rodapé e ancora no fundo do card. */}
                <div className="mt-auto grid grid-cols-2 gap-px border-t border-border -mx-6 -mb-6 lg:-mx-7 lg:-mb-7">
                  <div className="flex items-center gap-2.5 px-6 py-4 lg:px-7">
                    <CalendarClock size={16} className="shrink-0 text-muted-foreground" />
                    <div className="flex flex-col min-w-0">
                      <span className={MICRO_LABEL}>Próximo prazo</span>
                      {proximoPrazo?.periodo.prazo ? (
                        <span className="text-[13px] font-sans font-medium text-foreground truncate">
                          {proximoPrazo.periodo.label.split(' ')[0]}
                          <span className="mx-1.5 text-muted-foreground">·</span>
                          {formatPrazoCurto(proximoPrazo.periodo.prazo)}
                        </span>
                      ) : (
                        <span className="text-[13px] font-sans text-muted-foreground">Sem prazos abertos</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 px-6 py-4 lg:px-7 border-l border-border">
                    <CheckCircle2 size={16} className="shrink-0 text-muted-foreground" />
                    <div className="flex flex-col min-w-0">
                      <span className={MICRO_LABEL}>Progresso geral</span>
                      <span className="text-[13px] font-sans font-medium text-foreground tabular-nums">
                        {counts.respondido}/{totalPeriodos} ciclos
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <VisaoGeralCard counts={counts} filtro={filtro} onFiltro={setFiltro} />
            </header>

            <section className="flex flex-col gap-4">
              <span className={MICRO_LABEL}>Inventários</span>
              <div className="flex flex-col gap-4">
                {inventarios.map((inv) => (
                  <InventarioResumoCard key={inv.id} inv={inv} filtro={filtro} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavbarScenarioButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-sans font-medium transition-colors ${
        active
          ? 'border-sidebar-foreground/30 bg-sidebar-accent text-sidebar-foreground'
          : 'border-sidebar-border text-sidebar-foreground/70 hover:border-sidebar-foreground/20 hover:text-sidebar-foreground'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-success' : 'bg-sidebar-foreground/30'}`} />
      {label}
    </button>
  )
}

function VisaoGeralCard({
  counts,
  filtro,
  onFiltro,
}: {
  counts: Record<PeriodoStatus, number>
  filtro: PeriodoStatus | null
  onFiltro: (status: PeriodoStatus | null) => void
}) {
  return (
    <div className="bg-card border border-border">
      <div className="px-5 py-4 border-b border-border">
        <span className={MICRO_LABEL}>Visão geral</span>
      </div>

      <div className="flex flex-col">
        {INVENTORY_KPI_STATUSES.map((status) => {
          const meta = PERIODO_STATUS_META[status]
          const active = filtro === status
          return (
            <button
              key={status}
              type="button"
              onClick={() => onFiltro(active ? null : status)}
              className={`relative flex items-center gap-3 px-5 py-4 text-left transition-colors ${
                active ? 'bg-muted/40' : 'hover:bg-muted/30'
              }`}
            >
              {active && <span className={`absolute left-0 inset-y-0 w-0.5 ${meta.dotClass}`} />}
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.dotClass}`} />
              <span className={`text-[12px] font-sans flex-1 ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {meta.kpiLabel}
              </span>
              <span className={`font-heading text-3xl font-semibold tabular-nums leading-none ${meta.textClass}`}>
                {counts[status]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function InventarioResumoCard({ inv, filtro }: { inv: Inventario; filtro: PeriodoStatus | null }) {
  const { done, total } = getProgresso(inv)
  const PeriodIcon = inv.periodicidade === 'mensal' ? CalendarDays : CalendarRange
  const reprovado = inv.periodos.find((p) => p.status === 'reprovado')
  const primaryAction =
    inv.periodos.find((p) => p.status === 'reprovado')
    ?? inv.periodos.find((p) => p.status === 'em-andamento')
    ?? inv.periodos.find((p) => p.status === 'disponivel')
    ?? null
  const historico = inv.periodos.every((p) => p.status === 'respondido')
  const inventoryDimmed = filtro != null && !inv.periodos.some((p) => p.status === filtro)
  const headerActionLabel = historico ? 'Ver histórico' : primaryAction?.status ? PERIODO_STATUS_META[primaryAction.status].cta : null
  const actionToneClass = historico
    ? 'border-border text-muted-foreground hover:border-foreground/30 hover:bg-muted/30'
    : primaryAction
      ? `${PERIODO_STATUS_META[primaryAction.status].textClass} border-border hover:border-foreground/30 hover:bg-muted/30`
      : 'border-border text-muted-foreground hover:border-foreground/30 hover:bg-muted/30'

  return (
    <section
      className={`bg-card border border-border p-5 lg:p-6 flex flex-col gap-4 transition-opacity ${
        historico ? 'bg-muted/[0.12]' : ''
      } ${inventoryDimmed ? 'opacity-35' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 flex-wrap">
          <span className={`text-[14px] font-sans font-medium truncate ${historico ? 'text-muted-foreground' : 'text-foreground'}`}>
            {inv.nome}
          </span>
          <span className="inline-flex items-center gap-1 border border-border bg-card px-1.5 py-0.5 text-[9px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
            <PeriodIcon size={10} />
            {inv.periodicidade}
          </span>
          {reprovado && (
            <Link
              href={CHAT_HREF}
              className="group inline-flex min-w-0 items-center gap-1.5 text-[11px] font-sans text-destructive"
            >
              <AlertCircle size={12} className="shrink-0" />
              <span className="truncate">1 correção pendente · {reprovado.label.split(' ')[0]}</span>
            </Link>
          )}
          {historico && !reprovado && (
            <Link
              href={CHAT_HREF}
              className="group inline-flex min-w-0 items-center gap-1.5 text-[11px] font-sans text-muted-foreground"
            >
              <CheckCircle2 size={12} className="shrink-0" />
              <span className="truncate">Inventário já respondido</span>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {headerActionLabel && (
            <Link
              href={CHAT_HREF}
              className={`group inline-flex items-center gap-1.5 border px-3 py-1.5 text-[11px] font-sans font-medium transition-colors ${actionToneClass}`}
            >
              {headerActionLabel}
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          <span className={`font-heading text-[15px] font-semibold tabular-nums shrink-0 ${historico ? 'text-muted-foreground' : 'text-foreground'}`}>
            {done}/{total}
          </span>
        </div>
      </div>

      <div className={`flex gap-px h-2 ${historico ? 'opacity-60' : ''}`}>
        {inv.periodos.map((p) => (
          <span
            key={p.id}
            className={`flex-1 ${p.status === 'aguardando' ? 'bg-border' : PERIODO_STATUS_META[p.status].dotClass}`}
          />
        ))}
      </div>

      {inv.periodicidade === 'mensal' ? (
        <TooltipProvider delayDuration={100}>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {inv.periodos.map((p) => {
              const meta = PERIODO_STATUS_META[p.status]
              const aguardando = p.status === 'aguardando'
              const acionavel = COM_PRAZO.includes(p.status)
              const dimmed = filtro != null && p.status !== filtro

              const cell = (
                <span
                  className={`h-[72px] border border-border bg-card flex flex-col items-center justify-center gap-1.5 px-2 transition-colors ${
                    aguardando ? 'cursor-default' : 'hover:border-planton-accent/50'
                  } ${p.status === 'respondido' ? 'opacity-65 hover:opacity-100' : ''} ${historico ? 'opacity-55 hover:opacity-80' : ''} ${dimmed ? 'opacity-30' : ''}`}
                >
                  <span
                    className={`text-[10px] font-heading uppercase tracking-wider ${
                      aguardando || historico ? 'text-muted-foreground/60' : 'text-foreground'
                    }`}
                  >
                    {p.shortLabel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        aguardando ? 'bg-muted-foreground/40' : meta.dotClass
                      }`}
                    />
                    {acionavel && p.prazo && (
                      <span className="text-[10px] font-sans tabular-nums leading-none text-muted-foreground">
                        {formatPrazoCurto(p.prazo)}
                      </span>
                    )}
                  </span>
                </span>
              )

              if (aguardando || dimmed) return <span key={p.id}>{cell}</span>

              return (
                <Tooltip key={p.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={CHAT_HREF}
                      aria-label={`${p.label} · ${meta.label}${acionavel && p.prazo ? ` · até ${formatPrazoCurto(p.prazo)}` : ''}`}
                    >
                      {cell}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="text-[11px]">
                    {p.label} · {meta.label}
                    {acionavel && p.prazo && ` · até ${formatPrazoCurto(p.prazo)}`}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </TooltipProvider>
      ) : (
        (() => {
          const p = inv.periodos[0]
          const meta = PERIODO_STATUS_META[p.status]
          const dimmed = filtro != null && p.status !== filtro
          return (
            <Link
              href={CHAT_HREF}
              className={`h-16 border border-border px-4 flex items-center justify-between transition-colors hover:border-planton-accent/50 ${
                dimmed ? 'opacity-30 pointer-events-none' : ''
              }`}
            >
              <span className={`text-[14px] font-sans ${historico ? 'text-muted-foreground' : 'text-foreground'}`}>
                Ano completo
              </span>
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${meta.dotClass}`} />
                {p.prazo && (
                  <span className="text-[12px] font-sans text-muted-foreground">
                    até {formatPrazoCurto(p.prazo)}
                  </span>
                )}
              </span>
            </Link>
          )
        })()
      )}
    </section>
  )
}
