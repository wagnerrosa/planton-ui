// Helpers derivados extras para o Dashboard v2 (hybrid: resumo + pendências +
// lista colapsada). Reaproveita o data layer da v1 (dashboard-gerencial) e só
// preenche as lacunas que o desenho novo precisa — sem duplicar o mock.

import {
  FILIAIS,
  CATEGORIA_COLS,
  getFilialProgress,
  type CombinationStatus,
  type Filial,
  type AttentionItem,
} from '../dashboard-gerencial/dashboard-data'

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
}

export function getFilialRows(): FilialRow[] {
  return FILIAIS.map((f) => {
    const prog = getFilialProgress(f)
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
    }
  })
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
