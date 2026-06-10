import type { LucideIcon } from 'lucide-react'
import { CATEGORIES } from '../chat/mock-data'

// ── Status ────────────────────────────────────────────────────────────────
// 7 estados de uma combinação filial × categoria. Ordenados do "pior" (requer
// ação) ao "neutro" — usado em priorização e ordenação.
export type CombinationStatus =
  | 'reprovado'
  | 'sem-respondente'
  | 'em-preenchimento'
  | 'aguardando'
  | 'enviado'
  | 'aprovado'
  | 'nao-aplicavel'

type StatusMeta = {
  label: string
  // dot + texto da pill
  dotClass: string
  textClass: string
  // fundo + borda da pill
  cellClass: string
  // segmento da barra de progresso geral (cor sólida via currentColor)
  barClass: string
}

// Mapeamento para tokens de tema já usados pelo ChatScreen — sem cores hardcoded.
export const STATUS_META: Record<CombinationStatus, StatusMeta> = {
  aprovado: {
    label: 'Aprovado',
    dotClass: 'bg-success',
    textClass: 'text-success',
    cellClass: 'bg-success-surface border-success-border text-success',
    barClass: 'bg-success',
  },
  enviado: {
    label: 'Enviado',
    dotClass: 'bg-planton-accent',
    textClass: 'text-planton-accent',
    cellClass: 'bg-planton-accent/10 border-planton-accent/30 text-planton-accent',
    barClass: 'bg-planton-accent',
  },
  'em-preenchimento': {
    label: 'Em preenchimento',
    dotClass: 'bg-info',
    textClass: 'text-info',
    cellClass: 'bg-info-surface border-info-border text-info',
    barClass: 'bg-info',
  },
  aguardando: {
    label: 'Aguardando',
    dotClass: 'bg-info/60',
    textClass: 'text-info/70',
    cellClass: 'bg-info-surface/50 border-info-border/50 text-info/70',
    barClass: 'bg-info/50',
  },
  'sem-respondente': {
    label: 'Sem responsável',
    dotClass: 'bg-warning',
    textClass: 'text-warning',
    cellClass: 'bg-warning-surface border-warning-border text-warning',
    barClass: 'bg-warning',
  },
  reprovado: {
    label: 'Reprovado',
    dotClass: 'bg-destructive',
    textClass: 'text-destructive',
    cellClass: 'bg-destructive-surface border-destructive-border text-destructive',
    barClass: 'bg-destructive',
  },
  'nao-aplicavel': {
    label: 'N/A',
    dotClass: 'bg-muted-foreground/40',
    textClass: 'text-muted-foreground',
    cellClass: 'bg-muted border-border text-muted-foreground',
    barClass: 'bg-muted-foreground/30',
  },
}

// Combinações que "contam" para o progresso do inventário (exclui N/A).
const COUNTED_STATUSES: CombinationStatus[] = [
  'reprovado', 'sem-respondente', 'em-preenchimento', 'aguardando', 'enviado', 'aprovado',
]
// Combinações consideradas "concluídas".
const DONE_STATUSES: CombinationStatus[] = ['enviado', 'aprovado']

// ── Modelo ──────────────────────────────────────────────────────────────────
export type Respondente = {
  nome: string
  email: string
  alocadaEm: string
}

export type SchemaInfo = {
  nome: string
  linhas: number
  status: CombinationStatus
}

// ── Log de eventos (spec 6.8) ─────────────────────────────────────────────────
// Sequência cronológica append-only de tudo que aconteceu com a combinação.
// Tom visual: positive = ✓ verde (conclusões), negative = ✗ vermelho
// (problemas/recusas), neutral = ícone informativo.
export type LogEventType =
  | 'responsavel-alocado'      // 1
  | 'sem-dados'                // 2
  | 'responsavel-alterado'     // 3
  | 'responsavel-removido'     // 4
  | 'em-preenchimento'         // 5
  | 'verificacao'              // 6
  | 'enviado-revisao'          // 7
  | 'recusado-gestor'          // 8
  | 'reaberto-gestor'          // 9
  | 'em-preenchimento-novo'    // 10
  | 'aprovado-gestor'          // 11
  | 'chat-reiniciado'          // 12

export type LogEvent = {
  type: LogEventType
  data: string         // "20 jan 2025"
  hora?: string        // "09h12" — eventos com timestamp preciso
  // Dados contextuais opcionais, conforme o tipo:
  respondente?: string       // nome (alocado / novo respondente)
  respondenteAnterior?: string // nome anterior (responsável alterado)
  linhas?: number            // qtd de linhas (em-preenchimento / enviado)
  erros?: number             // erros bloqueantes (verificação)
  observacao?: string        // texto livre (reabertura)
}

export type Combination = {
  status: CombinationStatus
  respondente?: Respondente
  atividade: {
    primeiroDado: string
    ultimaAtualizacao: string
    diasSemAtualizar: number
  }
  volume: {
    totalLinhas: number
    schemas: SchemaInfo[]
  }
  qualidade: {
    linhasOk: number
    linhasProblema: number
    ultimaVerificacao: string
    resultado: 'passou' | 'falhou' | 'nunca'
  }
  // Log cronológico de eventos (spec 6.8) — fonte da timeline do drawer.
  log: LogEvent[]
}

export type Filial = {
  id: string
  sigla: string
  nome: string
  respondente?: Respondente
  combinacoes: Record<string, Combination> // por categoriaId
}

export type CategoriaCol = {
  id: string
  label: string
  labelCurto: string
  icon: LucideIcon
  scope: 1 | 2 | 3
}

// Colunas da matriz = categorias do produto (deriva do mock do Chat).
export const CATEGORIA_COLS: CategoriaCol[] = CATEGORIES.map((c) => ({
  id: c.id,
  label: c.label,
  labelCurto: c.label,
  icon: c.icon,
  scope: c.scope,
}))

// Empresa / inventário (mock — header da tela).
export const EMPRESA = 'Renova Logística S.A.'
export const ANO_BASE = 2025

// ── Mock determinístico ──────────────────────────────────────────────────────
// Sem Math.random no módulo: tudo derivado de índices, igual ao padrão de
// buildCombustaoMovelLitros em mock-data.ts (evita hydration mismatch).

const RESPONDENTES: Respondente[] = [
  { nome: 'Ana Costa', email: 'ana.costa@renovalog.com', alocadaEm: '12 jan 2025' },
  { nome: 'Bruno Lima', email: 'bruno.lima@renovalog.com', alocadaEm: '14 jan 2025' },
  { nome: 'Carla Neves', email: 'carla.neves@renovalog.com', alocadaEm: '09 jan 2025' },
  { nome: 'Diego Martins', email: 'diego.martins@renovalog.com', alocadaEm: '20 jan 2025' },
  { nome: 'Fernanda Souza', email: 'fernanda.souza@renovalog.com', alocadaEm: '05 fev 2025' },
  { nome: 'Gustavo Prado', email: 'gustavo.prado@renovalog.com', alocadaEm: '10 fev 2025' },
  { nome: 'Helena Rocha', email: 'helena.rocha@renovalog.com', alocadaEm: '17 fev 2025' },
  { nome: 'Igor Fonseca', email: 'igor.fonseca@renovalog.com', alocadaEm: '03 mar 2025' },
]

// Plano de status por filial × categoria. Os seeds cobrem as 6 categorias
// originais; categorias adicionadas depois recebem status determinístico via
// STATUS_FALLBACK_POOL (ver buildCombination).
type FilialSeed = {
  id: string
  sigla: string
  nome: string
  respIdx: number | null // null = sem respondente designado
  status: CombinationStatus[]
}

const FILIAL_SEEDS: FilialSeed[] = [
  {
    id: 'sp', sigla: 'SP', nome: 'São Paulo', respIdx: 0,
    status: ['enviado', 'em-preenchimento', 'aprovado', 'nao-aplicavel', 'aguardando', 'enviado'],
  },
  {
    id: 'rj', sigla: 'RJ', nome: 'Rio de Janeiro', respIdx: 0,
    status: ['reprovado', 'aguardando', 'aprovado', 'nao-aplicavel', 'nao-aplicavel', 'em-preenchimento'],
  },
  {
    id: 'bh', sigla: 'MG', nome: 'Belo Horizonte', respIdx: 1,
    status: ['em-preenchimento', 'aguardando', 'enviado', 'enviado', 'nao-aplicavel', 'aprovado'],
  },
  {
    id: 'curitiba', sigla: 'CT', nome: 'Curitiba', respIdx: null,
    status: ['sem-respondente', 'sem-respondente', 'sem-respondente', 'enviado', 'nao-aplicavel', 'sem-respondente'],
  },
  {
    id: 'recife', sigla: 'RC', nome: 'Recife', respIdx: 2,
    status: ['reprovado', 'enviado', 'aprovado', 'nao-aplicavel', 'aguardando', 'em-preenchimento'],
  },
  {
    id: 'santos', sigla: 'ST', nome: 'Santos', respIdx: 3,
    status: ['aprovado', 'enviado', 'em-preenchimento', 'nao-aplicavel', 'enviado', 'aguardando'],
  },
  {
    id: 'fortaleza', sigla: 'FZ', nome: 'Fortaleza', respIdx: 4,
    status: ['reprovado', 'reprovado', 'aguardando', 'em-preenchimento', 'nao-aplicavel', 'enviado'],
  },
  {
    id: 'manaus', sigla: 'MN', nome: 'Manaus', respIdx: null,
    status: ['sem-respondente', 'sem-respondente', 'nao-aplicavel', 'sem-respondente', 'sem-respondente', 'nao-aplicavel'],
  },
  {
    id: 'porto-alegre', sigla: 'PA', nome: 'Porto Alegre', respIdx: 5,
    status: ['aprovado', 'aprovado', 'aprovado', 'enviado', 'aprovado', 'aprovado'],
  },
  {
    id: 'salvador', sigla: 'SV', nome: 'Salvador', respIdx: 6,
    status: ['em-preenchimento', 'reprovado', 'enviado', 'aguardando', 'em-preenchimento', 'nao-aplicavel'],
  },
  {
    id: 'goiania', sigla: 'GO', nome: 'Goiânia', respIdx: 7,
    status: ['aguardando', 'aguardando', 'sem-respondente', 'nao-aplicavel', 'aguardando', 'em-preenchimento'],
  },
  {
    id: 'campinas', sigla: 'CP', nome: 'Campinas', respIdx: 4,
    status: ['enviado', 'aprovado', 'enviado', 'aprovado', 'nao-aplicavel', 'enviado'],
  },
  // Filiais extras — mock para demonstrar paginação (combustão móvel com 20+ filiais)
  { id: 'natal', sigla: 'NT', nome: 'Natal', respIdx: 0, status: ['aprovado', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel'] },
  { id: 'maceio', sigla: 'MC', nome: 'Maceió', respIdx: 1, status: ['reprovado', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel'] },
  { id: 'joao-pessoa', sigla: 'JP', nome: 'João Pessoa', respIdx: 2, status: ['em-preenchimento', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel'] },
  { id: 'teresina', sigla: 'TE', nome: 'Teresina', respIdx: null, status: ['sem-respondente', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel'] },
  { id: 'sao-luis', sigla: 'SL', nome: 'São Luís', respIdx: 3, status: ['aguardando', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel'] },
  { id: 'belem', sigla: 'BM', nome: 'Belém', respIdx: 4, status: ['enviado', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel'] },
  { id: 'macapa', sigla: 'MP', nome: 'Macapá', respIdx: 5, status: ['aprovado', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel'] },
  { id: 'porto-velho', sigla: 'PV', nome: 'Porto Velho', respIdx: null, status: ['sem-respondente', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel'] },
  { id: 'rio-branco', sigla: 'RB', nome: 'Rio Branco', respIdx: 6, status: ['reprovado', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel'] },
  { id: 'boa-vista', sigla: 'BV', nome: 'Boa Vista', respIdx: 7, status: ['em-preenchimento', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel', 'nao-aplicavel'] },
]

// Esquemas por categoria (rótulos derivados do Chat) p/ a seção Volume do drawer.
const SCHEMA_LABELS: Record<string, string[]> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.schemas.map((s) => s.label)]),
)

const DATAS_PRIMEIRO = ['15 jan 2025', '18 jan 2025', '21 jan 2025', '11 jan 2025']
const HORAS = ['09h12', '11h40', '14h22', '16h05', '17h48']

// Pool de status para categorias sem entry no seed (categorias adicionadas
// depois dos seeds). Determinístico por filial+categoria — sem Math.random.
const STATUS_FALLBACK_POOL: CombinationStatus[] = [
  'aprovado', 'enviado', 'em-preenchimento', 'aguardando', 'sem-respondente', 'reprovado', 'nao-aplicavel',
]

function buildCombination(seed: FilialSeed, catIdx: number): Combination {
  const status =
    seed.status[catIdx] ??
    STATUS_FALLBACK_POOL[(seed.id.charCodeAt(0) + catIdx * 7) % STATUS_FALLBACK_POOL.length]
  const catId = CATEGORIA_COLS[catIdx].id
  const respondente = seed.respIdx === null ? undefined : RESPONDENTES[seed.respIdx]

  if (status === 'nao-aplicavel') {
    return {
      status,
      respondente,
      atividade: { primeiroDado: '—', ultimaAtualizacao: '—', diasSemAtualizar: 0 },
      volume: { totalLinhas: 0, schemas: [] },
      qualidade: { linhasOk: 0, linhasProblema: 0, ultimaVerificacao: '—', resultado: 'nunca' },
      log: [],
    }
  }

  if (status === 'sem-respondente') {
    // Caso desalocado: já teve responsável e foi removido (evento #4) — só em
    // algumas combinações, p/ demonstrar o tipo. Determinístico por seed.
    const foiRemovido = (seed.id.charCodeAt(0) + catIdx) % 3 === 0
    const log: LogEvent[] = foiRemovido
      ? [
          { type: 'responsavel-alocado', data: '08 jan 2025', respondente: RESPONDENTES[catIdx % RESPONDENTES.length].nome },
          { type: 'sem-dados', data: '08 jan 2025' },
          { type: 'responsavel-removido', data: '14 jan 2025' },
        ]
      : []
    return {
      status,
      respondente: undefined,
      atividade: { primeiroDado: '—', ultimaAtualizacao: '—', diasSemAtualizar: 8 },
      volume: { totalLinhas: 0, schemas: [] },
      qualidade: { linhasOk: 0, linhasProblema: 0, ultimaVerificacao: '—', resultado: 'nunca' },
      log,
    }
  }

  // Volume determinístico
  const seedNum = (seed.id.charCodeAt(0) + catIdx * 13) % 100
  const labels = SCHEMA_LABELS[catId] ?? ['Dados']
  const schemas: SchemaInfo[] = labels.map((nome, i) => ({
    nome,
    linhas: 24 + ((seedNum + i * 31) % 180),
    status,
  }))
  const totalLinhas = schemas.reduce((acc, s) => acc + s.linhas, 0)

  // Qualidade depende do status
  const isReprovado = status === 'reprovado'
  const isReady = status === 'aprovado' || status === 'enviado'
  const linhasProblema = isReprovado ? 17 + (seedNum % 14) : isReady ? 0 : 3 + (seedNum % 6)
  const linhasOk = Math.max(totalLinhas - linhasProblema, 0)
  const resultado: Combination['qualidade']['resultado'] =
    isReady ? 'passou' : status === 'aguardando' ? 'nunca' : 'falhou'

  const diasSemAtualizar = isReprovado ? 2 : status === 'em-preenchimento' ? 1 : 0
  const primeiroDado = DATAS_PRIMEIRO[(seedNum + catIdx) % DATAS_PRIMEIRO.length]
  const ultimaAtualizacao =
    diasSemAtualizar === 0
      ? `hoje · ${HORAS[seedNum % HORAS.length]}`
      : diasSemAtualizar === 1
        ? `ontem · ${HORAS[(seedNum + 2) % HORAS.length]}`
        : `há ${diasSemAtualizar} dias`
  const ultimaVerificacao =
    resultado === 'nunca' ? '—' : diasSemAtualizar === 0 ? `hoje · ${HORAS[(seedNum + 1) % HORAS.length]}` : ultimaAtualizacao

  const log = buildLog({
    seed, catIdx, status, respondente,
    totalLinhas, linhasProblema, isReprovado, isReady,
  })

  return {
    status,
    respondente,
    atividade: { primeiroDado, ultimaAtualizacao, diasSemAtualizar },
    volume: { totalLinhas, schemas },
    qualidade: { linhasOk, linhasProblema, ultimaVerificacao, resultado },
    log,
  }
}

// Linha do tempo base: pares (data, hora) em ordem cronológica crescente,
// consumidos sequencialmente por buildLog via um cursor. Garante que todo log
// fique monotônico (cada evento mais novo que o anterior) sem datas embaralhadas.
const CRONOLOGIA: ReadonlyArray<{ data: string; hora: string }> = [
  { data: '08 jan 2025', hora: '09h12' },
  { data: '09 jan 2025', hora: '11h40' },
  { data: '10 jan 2025', hora: '14h22' },
  { data: '11 jan 2025', hora: '16h05' },
  { data: '13 jan 2025', hora: '17h48' },
  { data: '15 jan 2025', hora: '09h12' },
  { data: '17 jan 2025', hora: '11h40' },
  { data: '20 jan 2025', hora: '14h22' },
  { data: '22 jan 2025', hora: '16h05' },
  { data: '24 jan 2025', hora: '17h48' },
  { data: '28 jan 2025', hora: '09h12' },
  { data: '03 fev 2025', hora: '11h40' },
]

// Constrói o log cronológico (spec 6.8) p/ uma combinação com responsável e
// dados. Eventos append-only do mais antigo ao mais recente, com datas sempre
// crescentes (cursor sobre CRONOLOGIA). Combinações reprovadas/aprovadas recebem
// histórico rico (troca de responsável, ciclo de correção, reabertura, chat
// reiniciado) p/ demonstrar todos os tipos da spec 6.8 num fluxo coerente.
function buildLog(ctx: {
  seed: FilialSeed
  catIdx: number
  status: CombinationStatus
  respondente?: Respondente
  totalLinhas: number
  linhasProblema: number
  isReprovado: boolean
  isReady: boolean
}): LogEvent[] {
  const { seed, catIdx, status, respondente, totalLinhas, linhasProblema, isReprovado, isReady } = ctx
  const log: LogEvent[] = []
  const isFilling = status === 'em-preenchimento'
  const isApproved = status === 'aprovado'
  const isAguardando = status === 'aguardando' // alocado, mas nenhum dado ainda
  // Histórico rico: combinações reprovadas e aprovadas demonstram os ciclos
  // completos com eventos raros. Determinístico por seed.
  const rico = (isReprovado || isApproved) && (seed.id.charCodeAt(0) + catIdx) % 2 === 0
  const verifFalhou = isReprovado || (isFilling && linhasProblema > 0)
  const linhasIniciais = Math.max(totalLinhas - 20, 12)

  // Cursor cronológico: cada chamada avança a data, mantendo o log monotônico.
  let cursor = 0
  const ts = () => CRONOLOGIA[Math.min(cursor++, CRONOLOGIA.length - 1)]
  const push = (e: Omit<LogEvent, 'data' | 'hora'> & { semHora?: boolean }) => {
    const { semHora, ...rest } = e
    const t = ts()
    log.push(semHora ? { ...rest, data: t.data } : { ...rest, data: t.data, hora: t.hora })
  }

  // 1. Responsável alocado (+ troca de responsável em casos ricos)
  if (rico) {
    const anterior = RESPONDENTES[(catIdx + 3) % RESPONDENTES.length]
    push({ type: 'responsavel-alocado', respondente: anterior.nome, semHora: true })
    push({ type: 'sem-dados', semHora: true })
    // 3. Responsável alterado
    push({
      type: 'responsavel-alterado',
      respondenteAnterior: anterior.nome,
      respondente: respondente?.nome,
      semHora: true,
    })
  } else {
    push({ type: 'responsavel-alocado', respondente: respondente?.nome, semHora: true })
    // 2. Sem dados (entra automaticamente logo após alocação)
    push({ type: 'sem-dados', semHora: true })
  }

  // "aguardando" = responsável alocado mas nenhum dado entrou: o log para no
  // evento #2 (Sem dados). Os demais eventos exigem dados na bronze.
  if (isAguardando) return log

  // 5. Em preenchimento (primeiro dado na bronze)
  push({ type: 'em-preenchimento', linhas: linhasIniciais })

  // 6. Verificação — quando falhou, mostra a execução com erros, depois a
  // correção do respondente e a reverificação que passou.
  if (verifFalhou) {
    push({ type: 'verificacao', erros: linhasProblema })
    // 10. Em preenchimento — respondente corrige os dados apontados.
    push({ type: 'em-preenchimento-novo' })
  }
  // Verificação que passou (0 erros) — combinações que avançaram além do preenchimento.
  if (isReady || isReprovado) {
    push({ type: 'verificacao', erros: 0 })
  }

  // 7. Enviado para revisão
  if (isReady || isReprovado) {
    push({ type: 'enviado-revisao', linhas: totalLinhas })
  }

  // 8/9/11. Resultado da revisão
  if (isReprovado) {
    // 8. Recusado pelo gestor → trailing "Aguardando correção e reenvio" (v2-derive).
    push({ type: 'recusado-gestor', linhas: linhasProblema })
  } else if (isApproved) {
    if (rico) {
      // 9. Reaberto pelo gestor (sem motivo técnico) seguido de novo ciclo de
      // edição, reverificação e reenvio antes da aprovação final.
      push({ type: 'reaberto-gestor' })
      // 12. Chat reiniciado — respondente reinicia a conversa p/ reenviar.
      push({ type: 'chat-reiniciado' })
      push({ type: 'em-preenchimento-novo' })
      push({ type: 'verificacao', erros: 0 })
      push({ type: 'enviado-revisao', linhas: totalLinhas })
    }
    // 11. Aprovado pelo gestor
    push({ type: 'aprovado-gestor' })
  }

  return log
}

export const FILIAIS: Filial[] = FILIAL_SEEDS.map((seed) => ({
  id: seed.id,
  sigla: seed.sigla,
  nome: seed.nome,
  respondente: seed.respIdx === null ? undefined : RESPONDENTES[seed.respIdx],
  combinacoes: Object.fromEntries(
    CATEGORIA_COLS.map((col, catIdx) => [col.id, buildCombination(seed, catIdx)]),
  ),
}))

// ── Helpers derivados ─────────────────────────────────────────────────────────
export type Overview = {
  totalCombinacoes: number // exclui N/A
  naoAplicaveis: number
  concluidas: number
  pctConclusao: number
  porStatus: Record<CombinationStatus, number>
  ultimaAtualizacaoLabel: string
}

function eachCombination(): Combination[] {
  return FILIAIS.flatMap((f) => CATEGORIA_COLS.map((c) => f.combinacoes[c.id]))
}

export function getOverview(): Overview {
  const porStatus = Object.fromEntries(
    (Object.keys(STATUS_META) as CombinationStatus[]).map((s) => [s, 0]),
  ) as Record<CombinationStatus, number>

  for (const comb of eachCombination()) porStatus[comb.status]++

  const naoAplicaveis = porStatus['nao-aplicavel']
  const totalCombinacoes = COUNTED_STATUSES.reduce((acc, s) => acc + porStatus[s], 0)
  const concluidas = DONE_STATUSES.reduce((acc, s) => acc + porStatus[s], 0)
  const pctConclusao = totalCombinacoes === 0 ? 0 : Math.round((concluidas / totalCombinacoes) * 100)

  return {
    totalCombinacoes,
    naoAplicaveis,
    concluidas,
    pctConclusao,
    porStatus,
    ultimaAtualizacaoLabel: 'há 4 min',
  }
}

export type AttentionItem = {
  id: string
  filialId: string
  categoriaId: string
  severity: 'crit' | 'warn' | 'reprov' | 'info'
  headline: string
  detail: string
  action: string
}

// Prioridade: reprovado > erros bloqueantes (falhou c/ problemas) > sem-respondente > parado.
export function getAttentionItems(): AttentionItem[] {
  const items: AttentionItem[] = []

  for (const filial of FILIAIS) {
    for (const col of CATEGORIA_COLS) {
      const comb = filial.combinacoes[col.id]
      const base = { filialId: filial.id, categoriaId: col.id }

      if (comb.status === 'reprovado') {
        items.push({
          ...base,
          id: `${filial.id}-${col.id}`,
          severity: 'reprov',
          headline: `${filial.nome} · ${col.label} — reprovado`,
          detail: `Respondente: ${comb.respondente?.nome ?? '—'} · ${comb.qualidade.linhasProblema} linhas com problema · ${comb.atividade.diasSemAtualizar} dias sem atualização`,
          action: comb.respondente ? `Contatar ${comb.respondente.nome}` : 'Designar responsável',
        })
      } else if (comb.status === 'sem-respondente') {
        items.push({
          ...base,
          id: `${filial.id}-${col.id}`,
          severity: 'warn',
          headline: `${filial.nome} · ${col.label} — sem responsável designado`,
          detail: `Sem alocação há ${comb.atividade.diasSemAtualizar} dias`,
          action: 'Designar responsável',
        })
      } else if (comb.qualidade.resultado === 'falhou' && comb.qualidade.linhasProblema > 0) {
        items.push({
          ...base,
          id: `${filial.id}-${col.id}`,
          severity: 'crit',
          headline: `${filial.nome} · ${col.label} — ${comb.qualidade.linhasProblema} erros na verificação`,
          detail: `Respondente: ${comb.respondente?.nome ?? '—'} · última verificação falhou`,
          action: 'Ver detalhes do respondente',
        })
      }
    }
  }

  const order: Record<AttentionItem['severity'], number> = { reprov: 0, crit: 1, warn: 2, info: 3 }
  return items.sort((a, b) => order[a.severity] - order[b.severity])
}

export type FilialProgress = { done: number; total: number; pct: number }

export function getFilialProgress(filial: Filial): FilialProgress {
  let done = 0
  let total = 0
  for (const col of CATEGORIA_COLS) {
    const s = filial.combinacoes[col.id].status
    if (s === 'nao-aplicavel') continue
    total++
    if (DONE_STATUSES.includes(s)) done++
  }
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) }
}

// Status agregado da categoria (pior status entre filiais aplicáveis).
const STATUS_RANK: CombinationStatus[] = [
  'reprovado', 'sem-respondente', 'aguardando', 'em-preenchimento', 'enviado', 'aprovado',
]

export type UnidadeRollup = {
  filialId: string
  codigo: string
  nome: string
  status: CombinationStatus
  linhas: number
  observacao: string
}

export type CategoriaRollup = {
  id: string
  label: string
  labelCurto: string
  icon: LucideIcon
  scope: 1 | 2 | 3
  status: CombinationStatus
  unidadesComDados: number
  unidadesSemDados: number
  pctConclusao: number
  unidades: UnidadeRollup[]
}

const OBS_POR_STATUS: Record<CombinationStatus, string> = {
  aprovado: 'Aprovado pelo inventário',
  enviado: 'Enviado — aguardando aprovação',
  'em-preenchimento': 'Preenchimento em andamento',
  aguardando: 'Aguardando primeiro dado',
  'sem-respondente': 'Sem responsável designado',
  reprovado: 'Reprovado — requer correção',
  'nao-aplicavel': 'Não aplicável a esta unidade',
}

export function getCategoriaRollup(): CategoriaRollup[] {
  return CATEGORIA_COLS.map((col, catIdx) => {
    const unidades: UnidadeRollup[] = FILIAIS.map((f, fIdx) => {
      const comb = f.combinacoes[col.id]
      return {
        filialId: f.id,
        codigo: `U${String(catIdx * 10 + fIdx + 1).padStart(3, '0')}`,
        nome: f.nome,
        status: comb.status,
        linhas: comb.volume.totalLinhas,
        observacao: comb.qualidade.linhasProblema > 0
          ? `${comb.qualidade.linhasProblema} linhas com problema`
          : OBS_POR_STATUS[comb.status],
      }
    })

    const aplicaveis = unidades.filter((u) => u.status !== 'nao-aplicavel')
    const comDados = aplicaveis.filter((u) => u.linhas > 0)
    const concluidas = aplicaveis.filter((u) => DONE_STATUSES.includes(u.status))
    const pctConclusao = aplicaveis.length === 0 ? 0 : Math.round((concluidas.length / aplicaveis.length) * 100)

    // pior status entre as aplicáveis
    let status: CombinationStatus = 'aprovado'
    for (const u of aplicaveis) {
      if (STATUS_RANK.indexOf(u.status) < STATUS_RANK.indexOf(status)) status = u.status
    }
    if (aplicaveis.length === 0) status = 'nao-aplicavel'

    return {
      id: col.id,
      label: col.label,
      labelCurto: col.labelCurto,
      icon: col.icon,
      scope: col.scope,
      status,
      unidadesComDados: comDados.length,
      unidadesSemDados: aplicaveis.length - comDados.length,
      pctConclusao,
      unidades,
    }
  })
}

export function findFilial(id: string): Filial | undefined {
  return FILIAIS.find((f) => f.id === id)
}
