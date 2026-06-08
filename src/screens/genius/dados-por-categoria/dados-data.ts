// Data layer da tela de Revisão por categoria (usuário Engenheiro).
// Reaproveita o mock do Chat (CATEGORIES[].schemas[].rows) — os mesmos dados que
// o respondente enviou — e só deriva o que a revisão precisa: linhas achatadas
// com id estável, contagem de erros, períodos navegáveis e motivos de recusa.

import { CATEGORIES, type EmissionCategory, type SchemaRow, type CellStatus } from '../chat/mock-data'

// ── Tipo de inventário / períodos ──────────────────────────────────────────
// Mensal → navega meses do ano-base · Anual → navega anos. Mock define o tipo.
export type Periodicidade = 'mensal' | 'anual'

export const PERIODICIDADE: Periodicidade = 'mensal'
export const ANO_BASE = 2026

const MESES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export type Periodo = { id: string; label: string }

// Lista de períodos navegáveis conforme a periodicidade.
export function getPeriodos(): Periodo[] {
  if (PERIODICIDADE === 'anual') {
    return [ANO_BASE - 2, ANO_BASE - 1, ANO_BASE].map((y) => ({
      id: String(y),
      label: String(y),
    }))
  }
  return MESES.map((m) => ({ id: `${m}/${ANO_BASE}`, label: `${m} ${ANO_BASE}` }))
}

// ── Categorias ──────────────────────────────────────────────────────────────
export const REVIEW_CATEGORIES = CATEGORIES

export function findReviewCategory(id: string): EmissionCategory {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]
}

// ── Linhas achatadas para a tabela de revisão ────────────────────────────────
// Cada linha do schema vira um ReviewRow com id estável (categoria:schema:idx).
// Erros/avisos do _cellStatus são contados para sinalização na tabela e carrinho.
export type ReviewRow = {
  id: string
  /** código curto único na categoria (ex: L1, K2) — identifica a linha tabela↔carrinho */
  code: string
  categoriaId: string
  schemaId: string
  schemaLabel: string
  /** unidade/filial de origem do dado (coluna do próprio schema) */
  unidade: string
  /** respondente responsável pela filial/unidade */
  respondente: string
  /** células com problema, por coluna */
  cellStatus: Record<string, CellStatus>
  errorCount: number
  warningCount: number
  /** tCO₂e numérico parseado (pt-BR), 0 se vazio */
  tco2e: number
  /** valores crus para render da tabela */
  raw: SchemaRow
}

// pt-BR "1.234,56" → 1234.56 · "" → 0
function parseTco2e(value: string | undefined): number {
  if (!value) return 0
  const n = Number(value.replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

function unidadeOf(row: SchemaRow): string {
  const v = row.unidade_empresa ?? (row as Record<string, unknown>)['unidade-op']
  return typeof v === 'string' && v ? v : '—'
}

function respondenteOf(row: SchemaRow): string {
  const v = row.responsavel
  return typeof v === 'string' && v ? v : '—'
}

export function getReviewRows(categoriaId: string): ReviewRow[] {
  const cat = findReviewCategory(categoriaId)
  const rows: ReviewRow[] = []
  for (const schema of cat.schemas) {
    schema.rows.forEach((raw, idx) => {
      // Na revisão, os dados já chegaram preenchidos: o respondente nunca envia
      // célula vazia. O pior caso é um aviso. Convertemos qualquer 'error' do
      // mock em 'warning' e preenchemos eventuais valores vazios de forma
      // determinística (sem mexer no mock compartilhado do Chat).
      const rawStatus = (raw._cellStatus as Record<string, CellStatus>) ?? {}
      const cellStatus: Record<string, CellStatus> = {}
      const filled: SchemaRow = { ...raw }
      const seedNum = (idx * 37 + schema.id.charCodeAt(0)) % 100

      for (const [colId, status] of Object.entries(rawStatus)) {
        cellStatus[colId] = status === 'error' ? 'warning' : status
        const v = filled[colId]
        if (v === '' || v === undefined) {
          filled[colId] = fillEmpty(colId, seedNum)
        }
      }

      const statuses = Object.values(cellStatus)
      const tco2eRaw = (filled.tco2e as string | undefined) ?? ''

      rows.push({
        id: `${cat.id}:${schema.id}:${idx}`,
        code: `${schema.id.charAt(0).toUpperCase()}${idx + 1}`,
        categoriaId: cat.id,
        schemaId: schema.id,
        schemaLabel: schema.label,
        unidade: unidadeOf(filled),
        respondente: respondenteOf(filled),
        cellStatus,
        errorCount: 0,
        warningCount: statuses.length,
        tco2e: parseTco2e(tco2eRaw),
        raw: filled,
      })
    })
  }
  return rows
}

// Valor determinístico para preencher uma célula que veio vazia no mock —
// nunca exibimos "vazio" na revisão.
function fillEmpty(colId: string, seed: number): string {
  if (colId === 'tco2e') return (1 + (seed % 18) + (seed % 100) / 100).toFixed(2).replace('.', ',')
  if (colId === 'quantidade' || colId === 'consumo') return (500 + seed * 27).toLocaleString('pt-BR')
  if (colId === 'responsavel') return ['Carlos Mendes', 'Patrícia Souza', 'Ana Beatriz Lima'][seed % 3]
  return '—'
}

// Resumo de uma categoria para a toolbar/painel (linhas, erros, soma tCO₂e).
export type CategoriaResumo = {
  totalLinhas: number
  totalErros: number
  totalAvisos: number
  somaTco2e: number
  /** nº de schemas (abas) somados na categoria */
  totalSchemas: number
  /** rótulos dos schemas somados, p/ explicar a origem da soma */
  schemaLabels: string[]
  /** quebra por aba/schema: linhas e soma tCO₂e de cada guia */
  porSchema: { id: string; label: string; linhas: number; soma: number }[]
  /** quebra por unidade/filial: linhas e soma tCO₂e de cada unidade */
  porUnidade: { id: string; label: string; linhas: number; soma: number }[]
  /** filiais por respondente: quem tem dados e quem não tem */
  porRespondente: {
    respondente: string
    filiais: { unidade: string; temDados: boolean; linhas: number }[]
  }[]
}

export function getCategoriaResumo(categoriaId: string): CategoriaResumo {
  const cat = findReviewCategory(categoriaId)
  const rows = getReviewRows(categoriaId)
  const porSchema = cat.schemas.map((s) => {
    const sr = rows.filter((r) => r.schemaId === s.id)
    return {
      id: s.id,
      label: s.label,
      linhas: sr.length,
      soma: sr.reduce((a, r) => a + r.tco2e, 0),
    }
  })
  // Quebra por unidade/filial — agrupa por r.unidade preservando 1ª aparição.
  const unidadeOrdem: string[] = []
  const porUnidadeMap = new Map<string, { linhas: number; soma: number }>()
  for (const r of rows) {
    const u = r.unidade || '—'
    if (!porUnidadeMap.has(u)) {
      porUnidadeMap.set(u, { linhas: 0, soma: 0 })
      unidadeOrdem.push(u)
    }
    const acc = porUnidadeMap.get(u)!
    acc.linhas += 1
    acc.soma += r.tco2e
  }
  const porUnidade = unidadeOrdem
    .map((u) => ({ id: u, label: u, ...porUnidadeMap.get(u)! }))
    .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR', { sensitivity: 'base' }))
  // Agrupa filiais por respondente.
  const respOrdem: string[] = []
  const respMap = new Map<string, Map<string, number>>()
  for (const r of rows) {
    if (!respMap.has(r.respondente)) {
      respMap.set(r.respondente, new Map())
      respOrdem.push(r.respondente)
    }
    const filiais = respMap.get(r.respondente)!
    filiais.set(r.unidade, (filiais.get(r.unidade) ?? 0) + 1)
  }
  const porRespondente = respOrdem.map((resp) => {
    const filiais = respMap.get(resp)!
    const list = [...filiais.entries()].map(([unidade, linhas]) => ({
      unidade,
      temDados: true,
      linhas,
    }))
    // Respondentes com apenas 1 filial ganham uma filial fictícia sem dados para demo.
    if (list.length === 1) {
      list.push({ unidade: `${list[0].unidade} (filial 2)`, temDados: false, linhas: 0 })
    }
    return { respondente: resp, filiais: list }
  })

  return {
    totalLinhas: rows.length,
    totalErros: rows.reduce((a, r) => a + r.errorCount, 0),
    totalAvisos: rows.reduce((a, r) => a + r.warningCount, 0),
    somaTco2e: rows.reduce((a, r) => a + r.tco2e, 0),
    totalSchemas: cat.schemas.length,
    schemaLabels: cat.schemas.map((s) => s.label),
    porSchema,
    porUnidade,
    porRespondente,
  }
}

// ── Decisão da revisão (estado local, mock) ──────────────────────────────────
// É o que, no produto real, flipa o ciclo de coleta no dashboard-v2:
// 'aprovado' / 'reprovado'. 'pendente' = ainda em revisão.
export type ReviewDecision = 'pendente' | 'aprovado' | 'reprovado'

// ── Grupo de recusa (carrinho) ───────────────────────────────────────────────
// Um grupo = 1 motivo aplicado a N linhas. O engenheiro marca linhas na tabela,
// escolhe o motivo uma vez e adiciona o conjunto como um grupo. Justifica em lote.
export type RejectionGroup = {
  id: string
  motivoId: string
  texto: string
  rowIds: string[]
}

// Rótulo do motivo a partir do id (para render dos grupos).
export function motivoLabel(motivoId: string): string {
  return MOTIVOS_RECUSA.find((m) => m.id === motivoId)?.label ?? motivoId
}

// ── Motivos de recusa pré-definidos (para o carrinho de erros) ────────────────
export const MOTIVOS_RECUSA: { id: string; label: string }[] = [
  { id: 'valor-ausente', label: 'Valor obrigatório ausente' },
  { id: 'fator-incorreto', label: 'Fator de emissão incorreto' },
  { id: 'unidade-errada', label: 'Unidade de medida incorreta' },
  { id: 'periodo-incorreto', label: 'Período fora do inventário' },
  { id: 'sem-responsavel', label: 'Responsável não informado' },
  { id: 'valor-suspeito', label: 'Valor inconsistente / suspeito' },
  { id: 'documento-faltando', label: 'Documento comprobatório faltando' },
  { id: 'outro', label: 'Outro (descrever)' },
]
