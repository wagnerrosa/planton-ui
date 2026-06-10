// Helpers derivados extras para o Dashboard v2 (hybrid: resumo + pendências +
// lista colapsada). Reaproveita o data layer da v1 (dashboard-gerencial) e só
// preenche as lacunas que o desenho novo precisa — sem duplicar o mock.

import {
  FILIAIS,
  CATEGORIA_COLS,
  getFilialProgress,
  type CombinationStatus,
  type Combination,
  type Filial,
  type AttentionItem,
  type LogEvent,
  type LogEventType,
} from './dashboard-data'

// Ordem canônica dos segmentos da barra: pior → neutro (espelha a union de
// CombinationStatus, do mais urgente ao menos). Usada na barra segmentada e na
// legenda para uma leitura consistente.
export const SEGMENT_ORDER: CombinationStatus[] = [
  'reprovado',
  'sem-respondente',
  'em-preenchimento',
  'aguardando',
  'enviado',
  'aprovado',
]

// Severidade (do AttentionItem) → tokens de tema. AttentionItem.severity não
// mapeia 1:1 para STATUS_META, então a seção de atenção tem sua própria fonte.
export const SEVERITY_META: Record<
  AttentionItem['severity'],
  { dotClass: string; accentClass: string; surfaceClass: string }
> = {
  reprov: {
    dotClass: 'bg-destructive',
    accentClass: 'text-destructive',
    surfaceClass: 'border-l-destructive',
  },
  crit: {
    dotClass: 'bg-destructive',
    accentClass: 'text-destructive',
    surfaceClass: 'border-l-destructive',
  },
  warn: {
    dotClass: 'bg-warning',
    accentClass: 'text-warning',
    surfaceClass: 'border-l-warning',
  },
  info: {
    dotClass: 'bg-info',
    accentClass: 'text-info',
    surfaceClass: 'border-l-info',
  },
}

// Pior status entre as combinações aplicáveis de uma filial (eixo-filial não
// expõe isso na v1; só a categoria via CategoriaRollup.status). Reusa a mesma
// escala de severidade.
const STATUS_RANK: CombinationStatus[] = [
  'reprovado',
  'sem-respondente',
  'aguardando',
  'em-preenchimento',
  'enviado',
  'aprovado',
]

export function getFilialWorstStatus(filial: Filial): CombinationStatus {
  let worst: CombinationStatus = 'aprovado'
  let hasApplicable = false
  for (const col of CATEGORIA_COLS) {
    const s = filial.combinacoes[col.id].status
    if (s === 'nao-aplicavel') continue
    hasApplicable = true
    if (STATUS_RANK.indexOf(s) < STATUS_RANK.indexOf(worst)) worst = s
  }
  return hasApplicable ? worst : 'nao-aplicavel'
}

// Tira de pontos (preview de status por categoria) de uma filial — sequência
// na ordem das colunas, para o mini-strip na linha colapsada.
export type StatusDot = { categoriaId: string; categoriaLabel: string; status: CombinationStatus }

export function getFilialStatusStrip(filial: Filial): StatusDot[] {
  return CATEGORIA_COLS.map((col) => ({
    categoriaId: col.id,
    categoriaLabel: col.label,
    status: filial.combinacoes[col.id].status,
  }))
}

// Strip inverso: por categoria → dots de cada filial.
export type FilialDot = { filialId: string; filialSigla: string; filialNome: string; status: CombinationStatus }

export function getCategoriaStatusStrip(categoriaId: string): FilialDot[] {
  return FILIAIS.map((f) => ({
    filialId: f.id,
    filialSigla: f.sigla,
    filialNome: f.nome,
    status: f.combinacoes[categoriaId].status,
  }))
}

// Linha de filial pronta p/ a lista colapsada (nome, sigla, respondente, pct,
// pior status, strip). Ordenável por completude.
export type FilialRow = {
  id: string
  sigla: string
  nome: string
  respondenteNome?: string
  done: number
  total: number
  pct: number
  worstStatus: CombinationStatus
  strip: StatusDot[]
  categoriasComDados: number
  categoriasSemDados: number
}

export function getFilialRows(): FilialRow[] {
  return FILIAIS.map((f) => {
    const prog = getFilialProgress(f)
    const aplicaveis = CATEGORIA_COLS.filter((c) => f.combinacoes[c.id].status !== 'nao-aplicavel')
    const comDados = aplicaveis.filter((c) => f.combinacoes[c.id].volume.totalLinhas > 0)
    return {
      id: f.id,
      sigla: f.sigla,
      nome: f.nome,
      respondenteNome: f.respondente?.nome,
      done: prog.done,
      total: prog.total,
      pct: prog.pct,
      worstStatus: getFilialWorstStatus(f),
      strip: getFilialStatusStrip(f),
      categoriasComDados: comDados.length,
      categoriasSemDados: aplicaveis.length - comDados.length,
    }
  })
}

// ── Timeline do respondente (log — spec 6.8) ──────────────────────────────────
// A timeline é o log cronológico de eventos da combinação (comb.log), mapeado
// 1:1 para itens visuais. Cada tipo de evento tem um tom fixo:
//   done = ✓ verde (conclusões) · fail = ✗ vermelho (problemas/recusas) ·
//   neutral = ícone informativo. Um passo "current" sintético (derivado do
//   status) é anexado ao fim quando a combinação aguarda uma próxima ação.

export type TimelineState = 'done' | 'pending' | 'fail' | 'neutral'

export type TimelineEvent = {
  key: string
  label: string
  detail?: string  // data · hora
  meta?: string    // contexto secundário (linhas, resultado, etc.)
  action?: string  // CTA / banner contextual inline
  state: TimelineState
}

// Tom visual por tipo de evento (spec 6.8: ✓ verde / ✗ vermelho / neutro).
const EVENT_TONE: Record<LogEventType, TimelineState> = {
  'responsavel-alocado': 'done',
  'sem-dados': 'neutral',
  'responsavel-alterado': 'neutral',
  'responsavel-removido': 'fail',
  'em-preenchimento': 'done',
  'verificacao': 'done',          // sobrescrito p/ fail quando erros > 0
  'enviado-revisao': 'done',
  'recusado-gestor': 'fail',
  'reaberto-gestor': 'neutral',
  'em-preenchimento-novo': 'neutral',
  'aprovado-gestor': 'done',
  'chat-reiniciado': 'neutral',
}

function dt(ev: LogEvent): string {
  return ev.hora ? `${ev.data} · ${ev.hora}` : ev.data
}

// Mapeia um evento do log → item visual da timeline.
function mapLogEvent(ev: LogEvent, i: number): TimelineEvent {
  const key = `${ev.type}-${i}`
  const detail = dt(ev)
  switch (ev.type) {
    case 'responsavel-alocado':
      return { key, label: 'Responsável alocado', detail, meta: ev.respondente, state: 'done' }
    case 'sem-dados':
      return { key, label: 'Sem dados', detail, state: 'neutral' }
    case 'responsavel-alterado':
      return {
        key,
        label: 'Responsável alterado',
        detail,
        meta: ev.respondenteAnterior && ev.respondente
          ? `${ev.respondenteAnterior} → ${ev.respondente}`
          : ev.respondente,
        state: 'neutral',
      }
    case 'responsavel-removido':
      return { key, label: 'Responsável removido', detail, state: 'fail' }
    case 'em-preenchimento':
      return {
        key,
        label: 'Em preenchimento',
        detail,
        meta: ev.linhas != null ? `${ev.linhas.toLocaleString('pt-BR')} linhas iniciais` : undefined,
        state: 'done',
      }
    case 'verificacao': {
      const erros = ev.erros ?? 0
      return erros > 0
        ? { key, label: 'Verificação', detail, action: `${erros} erros bloqueantes`, state: 'fail' }
        : { key, label: 'Verificação', detail, meta: '0 erros — pronto para envio', state: 'done' }
    }
    case 'enviado-revisao':
      return {
        key,
        label: 'Enviado para revisão',
        detail,
        meta: ev.linhas != null ? `${ev.linhas.toLocaleString('pt-BR')} linhas enviadas` : undefined,
        state: 'done',
      }
    case 'recusado-gestor':
      return {
        key,
        label: 'Recusado pelo gestor',
        detail,
        action: ev.linhas != null
          ? `${ev.linhas} linhas com problema. Solicite ao responsável para corrigir os dados e reenviar.`
          : undefined,
        state: 'fail',
      }
    case 'reaberto-gestor':
      return { key, label: 'Reaberto pelo gestor', detail, meta: ev.observacao, state: 'neutral' }
    case 'em-preenchimento-novo':
      return { key, label: 'Em preenchimento', detail, state: 'neutral' }
    case 'aprovado-gestor':
      return { key, label: 'Aprovado pelo gestor', detail, state: 'done' }
    case 'chat-reiniciado':
      return { key, label: 'Chat reiniciado', detail, state: 'neutral' }
    default: {
      // Exaustividade: força erro de compilação se um tipo novo não for tratado.
      const _exhaustive: never = ev.type
      void _exhaustive
      void EVENT_TONE
      return { key, label: String(ev.type), detail, state: 'neutral' }
    }
  }
}

export function getCombinationTimeline(comb: Combination): TimelineEvent[] {
  if (comb.status === 'nao-aplicavel') {
    return [{ key: 'na', label: 'Não aplicável a esta filial', state: 'pending' }]
  }

  // A timeline é exatamente o log de eventos (spec 6.8). Sem passos sintéticos
  // de "aguardando" — esses estados não fazem parte dos eventos rastreados; o
  // status atual já é exibido no badge do header do drawer.
  return comb.log.map(mapLogEvent)
}

// Total de linhas coletadas em todo o inventário (KPI de volume do topo).
export function getTotalLinhas(): number {
  let total = 0
  for (const f of FILIAIS) {
    for (const col of CATEGORIA_COLS) {
      total += f.combinacoes[col.id].volume.totalLinhas
    }
  }
  return total
}
