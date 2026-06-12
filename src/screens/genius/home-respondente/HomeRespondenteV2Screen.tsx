'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CalendarRange,
  Check,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { GeniusNavbarSync } from '@/components/navigation/GeniusNavbarSync'
import { EMPRESA } from '../dashboard-v2/dashboard-data'
import { useCountUp } from '../shared/useCountUp'
import {
  INVENTARIOS,
  PERIODO_STATUS_META,
  KPI_STATUSES,
  CHAT_HREF,
  BIOMAS,
  COM_PRAZO,
  countByStatus,
  getProgresso,
  getFilaPriorizada,
  getRespondidos,
  diasRestantes,
  formatPrazoCurto,
  type FilaItem,
  type Inventario,
  type PeriodoStatus,
} from './home-data'

// ── V2 "Cockpit" — foco na próxima ação ──────────────────────────────────────
// A página responde "o que eu faço agora?": hero dominante com a tarefa mais
// urgente (reprovado > em andamento > disponível), fila priorizada dos demais
// acionáveis, histórico colapsado e rail lateral com visão geral + inventários.

// Demo: marca todo período acionável como respondido (sem mexer no mock real).
function resolverTudo(invs: Inventario[]): Inventario[] {
  return invs.map((inv) => ({
    ...inv,
    periodos: inv.periodos.map((p) =>
      COM_PRAZO.includes(p.status)
        ? { ...p, status: 'respondido' as PeriodoStatus, prazo: undefined, motivo: undefined }
        : p,
    ),
  }))
}

// Bioma fixo por inventário (hero/fila/rail usam o mesmo).
function biomaDoInventario(inv: Inventario): string {
  const i = INVENTARIOS.findIndex((x) => x.id === inv.id)
  return BIOMAS[Math.max(i, 0) % BIOMAS.length]
}

// CTA sólido do hero por status.
const HERO_CTA_BG: Partial<Record<PeriodoStatus, string>> = {
  reprovado: 'bg-destructive text-white',
  'em-andamento': 'bg-info text-white',
  disponivel: 'bg-planton-accent text-planton-ink',
}

// Rampa de urgência (texto) — ≤7 destructive, ≤30 warning, senão muted.
function urgenciaClass(dias: number): string {
  if (dias <= 7) return 'text-destructive'
  if (dias <= 30) return 'text-warning'
  return 'text-muted-foreground'
}

const MICRO_LABEL = 'text-[10px] font-heading font-semibold uppercase tracking-wider text-muted-foreground'

type DemoScenario = 'default' | 'all-clear' | 'annual-only' | 'annual-with-history'

function inventariosAnuaisComHistorico(): Inventario[] {
  const anualAtual = INVENTARIOS.find((inv) => inv.periodicidade === 'anual')
  if (!anualAtual) return []

  return [
    {
      id: 'gee-2025',
      nome: 'Inventário GEE 2025',
      ano: 2025,
      periodicidade: 'anual',
      periodos: anualAtual.periodos,
    },
    {
      id: 'gee-2024-anual',
      nome: 'Inventário GEE 2024',
      ano: 2024,
      periodicidade: 'anual',
      periodos: [
        {
          id: '2024-anual',
          label: 'Ano completo 2024',
          shortLabel: 'Ano completo',
          status: 'respondido',
        },
      ],
    },
    {
      id: 'gee-2023-anual',
      nome: 'Inventário GEE 2023',
      ano: 2023,
      periodicidade: 'anual',
      periodos: [
        {
          id: '2023-anual',
          label: 'Ano completo 2023',
          shortLabel: 'Ano completo',
          status: 'respondido',
        },
      ],
    },
  ]
}

function inventariosDoCenario(scenario: DemoScenario): Inventario[] {
  switch (scenario) {
    case 'all-clear':
      return resolverTudo(INVENTARIOS)
    case 'annual-only':
      return INVENTARIOS.filter((inv) => inv.periodicidade === 'anual')
    case 'annual-with-history':
      return inventariosAnuaisComHistorico()
    default:
      return INVENTARIOS
  }
}

export function HomeRespondenteV2Screen() {
  const [filtro, setFiltro] = useState<PeriodoStatus | null>(null)
  // Cenários de protótipo para validar a home em carteiras diferentes.
  const [demoScenario, setDemoScenario] = useState<DemoScenario>('default')
  // Só libera a data real depois da hidratação, sem setState em effect.
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const hoje = hydrated ? new Date() : null

  const inventarios = useMemo(
    () => inventariosDoCenario(demoScenario),
    [demoScenario],
  )
  const counts = useMemo(() => countByStatus(inventarios), [inventarios])
  const fila = useMemo(() => getFilaPriorizada(inventarios), [inventarios])
  const respondidos = useMemo(() => getRespondidos(inventarios), [inventarios])

  const hero = fila[0] ?? null
  const aSeguir = fila.slice(1)

  const dateline = hoje
    ? hoje
        .toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
        .toUpperCase()
    : ''

  const subtitulo = !hero
    ? 'Tudo em dia por aqui.'
    : hero.periodo.status === 'reprovado'
      ? 'Uma pendência bloqueia o inventário — comece por ela.'
      : `Você tem ${fila.length} ${fila.length === 1 ? 'período pendente' : 'períodos pendentes'} de coleta.`

  return (
    <div className="flex flex-col h-full">
      <GeniusNavbarSync
        breadcrumbs={[{ label: EMPRESA }, { label: 'Seus inventários' }]}
      />

      <div className="flex flex-col flex-1 overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
            {/* Header — col-span-full */}
            <header className="lg:col-span-2 flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-planton-accent">
                  {EMPRESA}
                </span>
                <h1 className="font-heading text-2xl font-semibold text-foreground">Sua central de coleta</h1>
                <p className="text-[13px] font-sans text-muted-foreground">{subtitulo}</p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-2 pt-1">
                {/* Dateline editorial */}
                <span className={MICRO_LABEL}>{dateline}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoScenario((cur) => (cur === 'all-clear' ? 'default' : 'all-clear'))}
                    className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-sans transition-colors ${
                      demoScenario === 'all-clear'
                        ? 'border-success-border bg-success-surface text-success'
                        : 'border-border text-muted-foreground hover:border-foreground/40'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${demoScenario === 'all-clear' ? 'bg-success' : 'bg-muted-foreground/40'}`} />
                    Demo: tudo em dia
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoScenario((cur) => (cur === 'annual-only' ? 'default' : 'annual-only'))}
                    className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-sans transition-colors ${
                      demoScenario === 'annual-only'
                        ? 'border-info-border bg-info-surface text-info'
                        : 'border-border text-muted-foreground hover:border-foreground/40'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${demoScenario === 'annual-only' ? 'bg-info' : 'bg-muted-foreground/40'}`} />
                    Demo: só anual
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoScenario((cur) => (cur === 'annual-with-history' ? 'default' : 'annual-with-history'))}
                    className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-sans transition-colors ${
                      demoScenario === 'annual-with-history'
                        ? 'border-planton-accent/40 bg-planton-accent/10 text-planton-accent'
                        : 'border-border text-muted-foreground hover:border-foreground/40'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${demoScenario === 'annual-with-history' ? 'bg-planton-accent' : 'bg-muted-foreground/40'}`} />
                    Demo: anual + histórico
                  </button>
                </div>
              </div>
            </header>

            {/* Coluna principal */}
            <div className="flex flex-col min-w-0">
              {hero ? <HeroProximaAcao item={hero} hoje={hoje} /> : <HeroVazio inventarios={inventarios} />}

              {/* Fila "A seguir" */}
              {aSeguir.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mt-6 mb-2">
                    <span className={MICRO_LABEL}>A seguir</span>
                    <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-sans font-semibold tabular-nums">
                      {aSeguir.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {aSeguir.map((item) => (
                      <FilaRow
                        key={item.periodo.id}
                        item={item}
                        hoje={hoje}
                        dimmed={filtro != null && item.periodo.status !== filtro}
                      />
                    ))}
                  </div>
                </>
              )}

              <Respondidos itens={respondidos} filtro={filtro} />
            </div>

            {/* Rail direito */}
            <aside className="flex flex-col gap-4 lg:sticky lg:top-8 self-start w-full">
              <VisaoGeral counts={counts} filtro={filtro} onFiltro={setFiltro} />

              <span className={`${MICRO_LABEL} mt-1`}>Inventários</span>
              {inventarios.map((inv) => (
                <InventarioRailCard key={inv.id} inv={inv} filtro={filtro} />
              ))}
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Hero "Próxima ação" ──────────────────────────────────────────────────────

function HeroProximaAcao({ item, hoje }: { item: FilaItem; hoje: Date | null }) {
  const { inv, periodo } = item
  const meta = PERIODO_STATUS_META[periodo.status]
  const dias = hoje && periodo.prazo && COM_PRAZO.includes(periodo.status) ? diasRestantes(periodo.prazo) : null

  return (
    <Link
      href={CHAT_HREF}
      className="relative group block border border-border h-56 lg:h-[340px] overflow-hidden"
    >
      <Image
        src={biomaDoInventario(inv)}
        alt=""
        fill
        sizes="900px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />
      {/* Gradient lateral p/ ancorar o conteúdo à esquerda */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />

      <div className="absolute inset-0 p-5 lg:p-7 flex flex-col justify-between max-w-[560px]">
        {/* Topo: eyebrow + status */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-white/70">
            Próxima ação
          </span>
          <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-sans font-medium backdrop-blur-sm ${meta.pillClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dotClass}`} />
            {meta.label}
          </span>
        </div>

        {/* Meio: período + origem + motivo */}
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-heading text-3xl lg:text-5xl font-semibold text-white leading-none">
              {periodo.label}
            </p>
            <p className="text-[12px] font-sans text-white/70 mt-2">
              {inv.nome} · {inv.periodicidade}
            </p>
          </div>

          {periodo.status === 'reprovado' && periodo.motivo && (
            <div className="flex gap-2 border border-destructive-border bg-destructive-surface/90 backdrop-blur-sm px-3 py-2 max-w-[480px]">
              <AlertCircle size={14} className="shrink-0 text-destructive mt-0.5" />
              <p className="text-[12px] font-sans text-destructive leading-snug line-clamp-2 lg:line-clamp-none">
                {periodo.motivo}
              </p>
            </div>
          )}
        </div>

        {/* Rodapé: countdown + CTA */}
        <div className="flex items-end justify-between gap-4">
          {dias != null && periodo.prazo ? (
            <div className="flex flex-col gap-1">
              {dias > 0 ? (
                <>
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-heading text-3xl font-semibold tabular-nums text-white leading-none">
                      {dias}
                    </span>
                    <span className="text-[13px] font-sans text-white/80">
                      {dias === 1 ? 'dia restante' : 'dias restantes'}
                    </span>
                  </span>
                  <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-white/60">
                    Prazo final · {formatPrazoCurto(periodo.prazo)}
                  </span>
                  {dias <= 7 && <span className="block h-0.5 bg-destructive w-10" />}
                </>
              ) : (
                <span className="font-heading text-2xl font-semibold uppercase tracking-wide text-destructive leading-none">
                  Prazo vencido
                </span>
              )}
            </div>
          ) : (
            <span />
          )}

          <span
            className={`h-10 px-5 inline-flex items-center gap-2 text-[13px] font-sans font-medium shrink-0 ${HERO_CTA_BG[periodo.status] ?? 'bg-foreground text-background'}`}
          >
            {meta.cta}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function HeroVazio({ inventarios }: { inventarios: Inventario[] }) {
  // Próxima liberação = primeiro período aguardando.
  const proximo = inventarios.flatMap((i) => i.periodos).find((p) => p.status === 'aguardando')
  return (
    <div className="relative border border-border h-56 lg:h-[340px] overflow-hidden">
      <Image
        src={BIOMAS[0]}
        alt=""
        fill
        sizes="900px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
      <div className="absolute inset-0 p-5 lg:p-7 flex flex-col justify-center gap-3 max-w-[480px]">
        <span className="inline-flex items-center gap-2 text-[10px] font-heading font-semibold uppercase tracking-wider text-white/70">
          <span className="w-6 h-6 bg-success-surface text-success flex items-center justify-center">
            <Check size={14} />
          </span>
          Nada pendente
        </span>
        <p className="font-heading text-3xl lg:text-4xl font-semibold text-white leading-tight">
          Tudo em dia por aqui.
        </p>
        <p className="text-[13px] font-sans text-white/80">
          Você respondeu todos os períodos liberados.
          {proximo && ` O próximo abre em ${proximo.label.split(' ')[0]}.`}
        </p>
      </div>
    </div>
  )
}

// ── Fila "A seguir" ──────────────────────────────────────────────────────────

const FILA_GRID = 'md:grid md:grid-cols-[40px_minmax(0,1.4fr)_150px_130px_minmax(120px,0.6fr)]'

function FilaRow({ item, hoje, dimmed }: { item: FilaItem; hoje: Date | null; dimmed: boolean }) {
  const { inv, periodo } = item
  const meta = PERIODO_STATUS_META[periodo.status]
  const dias = hoje && periodo.prazo && COM_PRAZO.includes(periodo.status) ? diasRestantes(periodo.prazo) : null

  return (
    <Link
      href={CHAT_HREF}
      className={`group bg-card border border-border px-4 py-3 flex flex-col gap-2 ${FILA_GRID} md:items-center md:gap-3 hover:bg-muted/30 transition-colors ${
        dimmed ? 'opacity-30 pointer-events-none' : ''
      }`}
    >
      {/* Thumb */}
      <span className="relative w-10 h-10 overflow-hidden shrink-0 hidden md:block">
        <Image src={biomaDoInventario(inv)} alt="" fill sizes="80px" className="object-cover" />
      </span>

      {/* Período + origem (ou motivo se reprovado) */}
      <span className="flex flex-col min-w-0">
        <span className="text-[13px] font-sans font-medium text-foreground truncate">{periodo.label}</span>
        {periodo.status === 'reprovado' && periodo.motivo ? (
          <span className="text-[11px] font-sans text-destructive truncate">↳ {periodo.motivo}</span>
        ) : (
          <span className="text-[11px] font-sans text-muted-foreground truncate">
            {inv.nome} · {inv.periodicidade}
          </span>
        )}
      </span>

      {/* Status */}
      <span className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dotClass}`} />
        <span className="text-[12px] font-sans text-foreground">{meta.label}</span>
      </span>

      {/* Prazo + urgência */}
      <span className="flex md:flex-col items-baseline md:items-start gap-1.5 md:gap-0">
        {periodo.prazo ? (
          <>
            <span className="text-[12px] font-sans tabular-nums text-foreground">
              até {formatPrazoCurto(periodo.prazo)}
            </span>
            {dias != null && (
              <span className={`text-[10px] font-sans ${dias > 0 ? urgenciaClass(dias) : 'font-heading font-semibold uppercase text-destructive'}`}>
                {dias > 0 ? `em ${dias} dias` : 'vencido'}
              </span>
            )}
          </>
        ) : (
          <span className="text-[12px] font-sans text-muted-foreground">—</span>
        )}
      </span>

      {/* Ação */}
      <span className={`md:justify-self-end flex items-center gap-1.5 text-[12px] font-sans font-medium ${meta.textClass}`}>
        {meta.cta}
        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

// ── Histórico "Respondidos" (disclosure) ─────────────────────────────────────

function Respondidos({ itens, filtro }: { itens: FilaItem[]; filtro: PeriodoStatus | null }) {
  const [open, setOpen] = useState(false)
  // Filtrar por respondido auto-expande o histórico.
  const expanded = open || filtro === 'respondido'
  if (itens.length === 0) return null

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-left"
      >
        <ChevronDown
          size={15}
          className={`text-muted-foreground transition-transform ${expanded ? '' : '-rotate-90'}`}
        />
        <span className={MICRO_LABEL}>Respondidos</span>
        <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] font-sans font-semibold tabular-nums">
          {itens.length}
        </span>
      </button>

      {expanded && (
        <div className="mt-2 bg-card border border-border divide-y divide-border/50">
          {itens.map(({ inv, periodo }) => {
            const dimmed = filtro != null && filtro !== 'respondido'
            return (
              <Link
                key={periodo.id}
                href={CHAT_HREF}
                className={`group px-4 py-2 flex items-center gap-3 transition-opacity ${
                  dimmed ? 'opacity-30 pointer-events-none' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-success" />
                <span className="text-[12px] font-sans text-foreground flex-1 truncate">
                  {periodo.label}
                  <span className="text-muted-foreground"> · {inv.nome}</span>
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-success">
                  Ver envio
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Rail: visão geral (KPIs clicáveis) ───────────────────────────────────────

function VisaoGeral({
  counts,
  filtro,
  onFiltro,
}: {
  counts: Record<PeriodoStatus, number>
  filtro: PeriodoStatus | null
  onFiltro: (s: PeriodoStatus | null) => void
}) {
  return (
    <div className="bg-card border border-border">
      <div className="px-4 py-3 border-b border-border">
        <span className={MICRO_LABEL}>Visão geral</span>
      </div>
      {KPI_STATUSES.map((status) => {
        const meta = PERIODO_STATUS_META[status]
        const active = filtro === status
        return (
          <KpiRow
            key={status}
            label={meta.kpiLabel}
            count={counts[status]}
            dotClass={meta.dotClass}
            textClass={meta.textClass}
            active={active}
            onClick={() => onFiltro(active ? null : status)}
          />
        )
      })}
      {/* Aguardando: informativo, não filtra (futuro ≠ pendência) */}
      <div className="px-4 py-2.5 flex items-center gap-2.5 border-t border-border/50 cursor-default">
        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-muted-foreground/40" />
        <span className="text-[12px] font-sans text-muted-foreground flex-1">Aguardando</span>
        <span className="font-heading text-xl font-semibold tabular-nums text-muted-foreground">
          {counts.aguardando}
        </span>
      </div>
    </div>
  )
}

function KpiRow({
  label,
  count,
  dotClass,
  textClass,
  active,
  onClick,
}: {
  label: string
  count: number
  dotClass: string
  textClass: string
  active: boolean
  onClick: () => void
}) {
  const value = useCountUp(count)
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full px-4 py-2.5 flex items-center gap-2.5 text-left transition-colors cursor-pointer ${
        active ? 'bg-muted/40' : 'hover:bg-muted/30'
      }`}
    >
      {active && <span className={`absolute left-0 inset-y-0 w-0.5 ${dotClass}`} />}
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
      <span className={`text-[12px] font-sans flex-1 ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
        {label}
      </span>
      <span className={`font-heading text-xl font-semibold tabular-nums ${textClass}`}>{value}</span>
    </button>
  )
}

// ── Rail: card de inventário (trilha de períodos) ────────────────────────────

function InventarioRailCard({ inv, filtro }: { inv: Inventario; filtro: PeriodoStatus | null }) {
  const { done, total } = getProgresso(inv)
  const PeriodIcon = inv.periodicidade === 'mensal' ? CalendarDays : CalendarRange
  const reprovado = inv.periodos.find((p) => p.status === 'reprovado')

  return (
    <div className="bg-card border border-border p-4 flex flex-col gap-3">
      {/* Header: nome + badge + progresso */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-sans font-medium text-foreground truncate flex-1">{inv.nome}</span>
        <span className="inline-flex items-center gap-1 border border-border px-1.5 py-0.5 text-[9px] font-heading font-semibold uppercase tracking-wider text-muted-foreground">
          <PeriodIcon size={10} />
          {inv.periodicidade}
        </span>
        <span className="font-heading text-[15px] font-semibold tabular-nums text-foreground">
          {done}/{total}
        </span>
      </div>

      {/* Barra segmentada — espelho 1:1 da trilha */}
      <div className="flex gap-px h-1.5">
        {inv.periodos.map((p) => (
          <span
            key={p.id}
            className={`flex-1 ${p.status === 'aguardando' ? 'bg-border' : PERIODO_STATUS_META[p.status].dotClass}`}
          />
        ))}
      </div>

      {/* Trilha */}
      {inv.periodicidade === 'mensal' ? (
        <TooltipProvider delayDuration={100}>
          <div className="grid grid-cols-6 gap-1">
            {inv.periodos.map((p) => {
              const meta = PERIODO_STATUS_META[p.status]
              const aguardando = p.status === 'aguardando'
              const acionavel = COM_PRAZO.includes(p.status)
              const dimmed = filtro != null && p.status !== filtro

              const cell = (
                <span
                  className={`h-9 border border-border bg-card flex flex-col items-center justify-center gap-0.5 transition-colors ${
                    aguardando ? 'cursor-default' : 'hover:border-planton-accent/50'
                  } ${p.status === 'respondido' ? 'opacity-60 hover:opacity-100' : ''} ${dimmed ? 'opacity-30' : ''}`}
                >
                  <span
                    className={`text-[10px] font-heading uppercase tracking-wider ${aguardando ? 'text-muted-foreground/50' : 'text-foreground'}`}
                  >
                    {p.shortLabel}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${aguardando ? 'bg-muted-foreground/40' : meta.dotClass}`}
                  />
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
              className={`h-9 border border-border px-3 flex items-center justify-between transition-colors hover:border-planton-accent/50 ${
                dimmed ? 'opacity-30 pointer-events-none' : ''
              }`}
            >
              <span className="text-[12px] font-sans text-foreground">Ano completo</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
                {p.prazo && (
                  <span className="text-[10px] font-sans text-muted-foreground">
                    até {formatPrazoCurto(p.prazo)}
                  </span>
                )}
              </span>
            </Link>
          )
        })()
      )}

      {/* Âncora de correção */}
      {reprovado && (
        <Link
          href={CHAT_HREF}
          className="group flex items-center gap-1.5 text-[11px] font-sans text-destructive"
        >
          <AlertCircle size={12} className="shrink-0" />
          <span className="flex-1 truncate">1 correção pendente · {reprovado.label.split(' ')[0]}</span>
          <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
