// ── Home do respondente — modelo + mock ─────────────────────────────────────
// O respondente pertence a uma empresa e pode estar alocado em N inventários
// simultâneos (ex.: ano passado anual + ano corrente mensal). Cada inventário
// expõe períodos: anual = 1 período (ano inteiro); mensal = 12, liberados
// conforme o mês fecha — futuros ficam 'aguardando' (muted, não acionáveis).

export type PeriodoStatus =
  | 'disponivel'
  | 'em-andamento'
  | 'respondido'
  | 'reprovado'
  | 'aguardando'

export type Periodo = {
  id: string
  label: string // 'Março 2026', 'Ano completo 2025'
  shortLabel: string // 'Mar', 'Ano completo'
  status: PeriodoStatus
  /** Motivo da recusa — só em 'reprovado'. */
  motivo?: string
  /** Data limite p/ responder (ISO) — exibida com countdown no card anual. */
  prazo?: string
}

export type Inventario = {
  id: string
  nome: string
  ano: number
  periodicidade: 'mensal' | 'anual'
  periodos: Periodo[]
}

export type DemoScenario = 'default' | 'all-clear' | 'annual-only' | 'annual-with-history'

type StatusMeta = {
  label: string
  /** Plural p/ os KPIs do topo. */
  kpiLabel: string
  dotClass: string
  textClass: string
  pillClass: string
  /** Texto do CTA no card; null = não acionável. */
  cta: string | null
}

// Mesmos tokens de tema do dashboard-v2/ChatScreen — sem cores hardcoded.
export const PERIODO_STATUS_META: Record<PeriodoStatus, StatusMeta> = {
  disponivel: {
    label: 'Disponível',
    kpiLabel: 'Disponíveis',
    dotClass: 'bg-planton-accent',
    textClass: 'text-planton-accent',
    pillClass: 'bg-planton-accent/10 border-planton-accent/30 text-planton-accent',
    cta: 'Iniciar coleta',
  },
  'em-andamento': {
    label: 'Em andamento',
    kpiLabel: 'Em andamento',
    dotClass: 'bg-info',
    textClass: 'text-info',
    pillClass: 'bg-info-surface border-info-border text-info',
    cta: 'Continuar',
  },
  respondido: {
    label: 'Respondido',
    kpiLabel: 'Respondidos',
    dotClass: 'bg-success',
    textClass: 'text-success',
    pillClass: 'bg-success-surface border-success-border text-success',
    cta: 'Ver envio',
  },
  reprovado: {
    label: 'Reprovado',
    kpiLabel: 'Reprovados',
    dotClass: 'bg-destructive',
    textClass: 'text-destructive',
    pillClass: 'bg-destructive-surface border-destructive-border text-destructive',
    cta: 'Corrigir dados',
  },
  aguardando: {
    label: 'Aguardando',
    kpiLabel: 'Aguardando',
    dotClass: 'bg-muted-foreground/40',
    textClass: 'text-muted-foreground',
    pillClass: 'bg-muted border-border text-muted-foreground',
    cta: null,
  },
}

// Ordem dos KPIs no topo (aguardando fica fora — futuro não é pendência).
export const KPI_STATUSES: PeriodoStatus[] = [
  'respondido',
  'em-andamento',
  'reprovado',
  'disponivel',
]

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const MESES_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

type MesEntry = PeriodoStatus | { status: PeriodoStatus; motivo?: string; prazo?: string }

function mensal(ano: number, statusPorMes: MesEntry[]): Periodo[] {
  return MESES.map((mes, i) => {
    const entry = statusPorMes[i] ?? 'aguardando'
    const { status, motivo, prazo } =
      typeof entry === 'string' ? { status: entry, motivo: undefined, prazo: undefined } : entry
    return {
      id: `${ano}-${String(i + 1).padStart(2, '0')}`,
      label: `${mes} ${ano}`,
      shortLabel: MESES_SHORT[i],
      status,
      motivo,
      prazo,
    }
  })
}

// Mock padrão: ano corrente mensal em curso + ano passado anual aberto
// + histórico mensal completo do ano anterior já respondido.
export const INVENTARIOS: Inventario[] = [
  {
    id: 'gee-2026',
    nome: 'Inventário GEE 2026',
    ano: 2026,
    periodicidade: 'mensal',
    periodos: mensal(2026, [
      'respondido',
      'respondido',
      { status: 'reprovado', motivo: 'Notas de abastecimento divergentes na filial Campinas.', prazo: '2026-06-20' },
      'respondido',
      { status: 'em-andamento', prazo: '2026-06-30' },
      { status: 'disponivel', prazo: '2026-07-10' },
      // jul–dez: aguardando (default)
    ]),
  },
  {
    id: 'gee-2025',
    nome: 'Inventário GEE 2025',
    ano: 2025,
    periodicidade: 'anual',
    periodos: [
      {
        id: '2025-anual',
        label: 'Ano completo 2025',
        shortLabel: 'Ano completo',
        status: 'disponivel',
        prazo: '2026-07-31',
      },
    ],
  },
  {
    id: 'gee-2024',
    nome: 'Inventário GEE 2024',
    ano: 2024,
    periodicidade: 'mensal',
    periodos: mensal(
      2024,
      Array.from({ length: 12 }, () => 'respondido' as PeriodoStatus),
    ),
  },
]

// ── Constantes de apresentação compartilhadas (V1 + V2) ─────────────────────

// Destino da coleta — cards/rows abrem o chat do Genius.
export const CHAT_HREF = '/design-system/screens/genius/chat'

// Imagens de bioma (public/assets) — ciclam pelos cards de período.
export const BIOMAS = [
  '/assets/MATA-ATLANTICA-BG.jpg',
  '/assets/PANTANAL-BG.jpg',
  '/assets/CAATINGA-BG.jpg',
  '/assets/PAMPA-BG.jpg',
  '/assets/SERRA-SUL-BG.jpg',
]

// Só estes status cobram prazo — respondido/aguardando não exibem.
export const COM_PRAZO: PeriodoStatus[] = ['em-andamento', 'disponivel', 'reprovado']

export function diasRestantes(prazoIso: string): number {
  return Math.ceil((new Date(`${prazoIso}T23:59:59`).getTime() - Date.now()) / 86_400_000)
}

// Curto: '20/06' (omite ano, cabe no canto do card).
export function formatPrazoCurto(prazoIso: string): string {
  return new Date(`${prazoIso}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit',
  })
}

// ── Derivações ──────────────────────────────────────────────────────────────

export function countByStatus(invs: Inventario[]): Record<PeriodoStatus, number> {
  const counts: Record<PeriodoStatus, number> = {
    disponivel: 0, 'em-andamento': 0, respondido: 0, reprovado: 0, aguardando: 0,
  }
  for (const inv of invs) for (const p of inv.periodos) counts[p.status] += 1
  return counts
}

// Primeiro período reprovado — alimenta o alerta slim do topo (corrigir bloqueia).
export function getReprovado(invs: Inventario[]): { inv: Inventario; periodo: Periodo } | null {
  for (const inv of invs) {
    const periodo = inv.periodos.find((p) => p.status === 'reprovado')
    if (periodo) return { inv, periodo }
  }
  return null
}

export function getProgresso(inv: Inventario): { done: number; total: number } {
  const done = inv.periodos.filter((p) => p.status === 'respondido').length
  return { done, total: inv.periodos.length }
}

// ── Cenários de demo compartilhados (V1 + V2) ──────────────────────────────

export function resolverTudo(invs: Inventario[]): Inventario[] {
  return invs.map((inv) => ({
    ...inv,
    periodos: inv.periodos.map((p) =>
      COM_PRAZO.includes(p.status)
        ? { ...p, status: 'respondido' as PeriodoStatus, prazo: undefined, motivo: undefined }
        : p,
    ),
  }))
}

export function inventariosAnuaisComHistorico(): Inventario[] {
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

export function inventariosDoCenario(scenario: DemoScenario): Inventario[] {
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

// ── Fila priorizada (V2 cockpit) ─────────────────────────────────────────────
// O que pede ação, do mais urgente: reprovado (bloqueia) > em andamento >
// disponível; empate decide pelo prazo mais próximo (sem prazo vai por último).
const PESO_ACAO: Partial<Record<PeriodoStatus, number>> = {
  reprovado: 0,
  'em-andamento': 1,
  disponivel: 2,
}

export type FilaItem = { inv: Inventario; periodo: Periodo }

export function getFilaPriorizada(invs: Inventario[]): FilaItem[] {
  return invs
    .flatMap((inv) => inv.periodos.map((periodo) => ({ inv, periodo })))
    .filter(({ periodo }) => PESO_ACAO[periodo.status] != null)
    .sort((a, b) => {
      const peso = PESO_ACAO[a.periodo.status]! - PESO_ACAO[b.periodo.status]!
      if (peso !== 0) return peso
      if (a.periodo.prazo && b.periodo.prazo) return a.periodo.prazo.localeCompare(b.periodo.prazo)
      return a.periodo.prazo ? -1 : b.periodo.prazo ? 1 : 0
    })
}

// Períodos já respondidos (histórico colapsável da V2).
export function getRespondidos(invs: Inventario[]): FilaItem[] {
  return invs.flatMap((inv) =>
    inv.periodos.filter((p) => p.status === 'respondido').map((periodo) => ({ inv, periodo })),
  )
}
