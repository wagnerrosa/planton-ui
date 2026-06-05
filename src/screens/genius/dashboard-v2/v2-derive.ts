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

// ── Timeline do respondente ───────────────────────────────────────────────────
// Rastreio do ciclo de uma combinação (filial × categoria), derivado do status
// + datas atuais — sem inventar novos campos no mock. Cada evento tem um estado:
//   done = já aconteceu · current = etapa atual · pending = ainda não · fail = reprovado.

export type TimelineState = 'done' | 'current' | 'pending' | 'fail'

export type TimelineEvent = {
  key: string
  label: string
  detail?: string  // data · hora
  meta?: string    // contexto secundário (linhas, resultado, etc.)
  action?: string  // CTA contextual — mini-banner inline
  state: TimelineState
}

export function getCombinationTimeline(comb: Combination): TimelineEvent[] {
  const { status, respondente, atividade, qualidade, datas } = comb

  if (status === 'nao-aplicavel') {
    return [{ key: 'na', label: 'Não aplicável a esta filial', state: 'pending' }]
  }

  const hasResp = !!respondente
  const hasData = status !== 'sem-respondente' && status !== 'aguardando'
  const isFilling = status === 'em-preenchimento'
  const isSent = status === 'enviado' || status === 'aprovado'
  const isApproved = status === 'aprovado'
  const isReproved = status === 'reprovado'
  const verifRodou = qualidade.resultado !== 'nunca'
  const verifFalhou = qualidade.resultado === 'falhou' && qualidade.linhasProblema > 0
  const teveCicloCorreção = verifFalhou && (isSent || isReproved)

  const events: TimelineEvent[] = []

  // 1. Responsável alocado
  events.push({
    key: 'alocado',
    label: hasResp ? 'Responsável alocado' : 'Aguardando alocação de responsável',
    detail: datas.alocado,
    action: !hasResp ? 'Acesse o painel de usuários para designar um responsável a esta combinação.' : undefined,
    state: hasResp ? 'done' : 'current',
  })
  if (!hasResp) return events

  // 2. Dados recebidos
  if (hasData) {
    events.push({
      key: 'dados-recebidos',
      label: 'Dados recebidos',
      detail: datas.dadosRecebidos,
      meta: `${comb.volume.totalLinhas.toLocaleString('pt-BR')} linhas`,
      state: 'done',
    })
  } else if (isFilling) {
    events.push({
      key: 'dados-recebidos',
      label: 'Aguardando dados',
      action: `Responsável alocado mas nenhum dado inserido ainda. Contate ${respondente!.nome} para iniciar o preenchimento.`,
      state: 'current',
    })
    return events
  } else {
    events.push({ key: 'dados-recebidos', label: 'Aguardando dados', state: 'pending' })
    return events
  }

  // 3. Verificação automática
  if (verifRodou) {
    if (teveCicloCorreção) {
      events.push({
        key: 'verif-falhou',
        label: 'Verificação automática',
        detail: datas.verificacaoFalhou,
        action: `${qualidade.linhasProblema} linhas com problema`,
        state: 'fail',
      })
      events.push({
        key: 'correcao',
        label: 'Correção e reenvio',
        detail: datas.correcaoReenvio,
        state: 'done',
      })
      events.push({
        key: 'verif-passou',
        label: 'Verificação automática',
        detail: datas.verificacaoPassed,
        meta: 'passou',
        state: 'done',
      })
    } else if (verifFalhou && isFilling) {
      events.push({
        key: 'verif-falhou',
        label: 'Verificação automática',
        detail: datas.verificacaoFalhou,
        action: `${qualidade.linhasProblema} linhas com problema`,
        state: 'fail',
      })
      events.push({
        key: 'correcao',
        label: 'Correção pendente',
        meta: atividade.diasSemAtualizar > 0
          ? `${atividade.diasSemAtualizar} dia${atividade.diasSemAtualizar !== 1 ? 's' : ''} sem atualização`
          : undefined,
        state: 'current',
      })
      return events
    } else {
      events.push({
        key: 'verif-passou',
        label: 'Verificação automática',
        detail: datas.verificacaoPassed,
        meta: 'passou',
        state: isSent || isReproved || isApproved ? 'done' : 'current',
      })
    }
  }

  // 4. Enviado para revisão humana
  if (isSent || isReproved) {
    events.push({
      key: 'enviado',
      label: 'Enviado para revisão',
      detail: datas.enviado,
      state: 'done',
    })
  } else if (!verifRodou || (verifRodou && !verifFalhou)) {
    events.push({ key: 'enviado', label: 'Envio para revisão', state: 'pending' })
    return events
  }

  // 5. Resultado da revisão humana
  if (isApproved) {
    events.push({
      key: 'resultado',
      label: 'Aprovado',
      detail: datas.aprovado,
      meta: datas.totalLinhas ? `${datas.totalLinhas.toLocaleString('pt-BR')} linhas` : undefined,
      state: 'done',
    })
  } else if (isReproved) {
    events.push({
      key: 'resultado',
      label: 'Reprovado pelo gestor',
      detail: datas.reprovado,
      action: `${qualidade.linhasProblema} linhas a corrigir. Solicite ao responsável para corrigir os dados e reenviar.`,
      state: 'fail',
    })
    events.push({ key: 'aguarda-reenvio', label: 'Aguardando correção e reenvio', state: 'current' })
  } else {
    events.push({ key: 'resultado', label: 'Aguardando aprovação', state: 'pending' })
  }

  return events
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
