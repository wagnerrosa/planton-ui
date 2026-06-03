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
]

// Plano de status por filial × categoria. Index das CATEGORIA_COLS (6 categorias):
// [combustao-movel, energia-eletrica, emissoes-fugitivas, combustao-estacionaria,
//  viagens-negocios, residuos]
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
]

// Esquemas por categoria (rótulos derivados do Chat) p/ a seção Volume do drawer.
const SCHEMA_LABELS: Record<string, string[]> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.schemas.map((s) => s.label)]),
)

const DATAS_PRIMEIRO = ['15 jan 2025', '18 jan 2025', '21 jan 2025', '11 jan 2025']
const HORAS = ['09h12', '11h40', '14h22', '16h05', '17h48']

function buildCombination(seed: FilialSeed, catIdx: number): Combination {
  const status = seed.status[catIdx]
  const catId = CATEGORIA_COLS[catIdx].id
  const respondente = seed.respIdx === null ? undefined : RESPONDENTES[seed.respIdx]

  if (status === 'nao-aplicavel') {
    return {
      status,
      respondente,
      atividade: { primeiroDado: '—', ultimaAtualizacao: '—', diasSemAtualizar: 0 },
      volume: { totalLinhas: 0, schemas: [] },
      qualidade: { linhasOk: 0, linhasProblema: 0, ultimaVerificacao: '—', resultado: 'nunca' },
    }
  }

  if (status === 'sem-respondente') {
    return {
      status,
      respondente: undefined,
      atividade: { primeiroDado: '—', ultimaAtualizacao: '—', diasSemAtualizar: 8 },
      volume: { totalLinhas: 0, schemas: [] },
      qualidade: { linhasOk: 0, linhasProblema: 0, ultimaVerificacao: '—', resultado: 'nunca' },
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

  return {
    status,
    respondente,
    atividade: { primeiroDado, ultimaAtualizacao, diasSemAtualizar },
    volume: { totalLinhas, schemas },
    qualidade: { linhasOk, linhasProblema, ultimaVerificacao, resultado },
  }
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
