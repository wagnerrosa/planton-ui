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
  categoriaId: string
  schemaId: string
  schemaLabel: string
  /** unidade/filial de origem do dado (coluna do próprio schema) */
  unidade: string
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

export function getReviewRows(categoriaId: string): ReviewRow[] {
  const cat = findReviewCategory(categoriaId)
  const rows: ReviewRow[] = []
  for (const schema of cat.schemas) {
    schema.rows.forEach((raw, idx) => {
      const cellStatus = (raw._cellStatus as Record<string, CellStatus>) ?? {}
      const statuses = Object.values(cellStatus)
      rows.push({
        id: `${cat.id}:${schema.id}:${idx}`,
        categoriaId: cat.id,
        schemaId: schema.id,
        schemaLabel: schema.label,
        unidade: unidadeOf(raw),
        cellStatus,
        errorCount: statuses.filter((s) => s === 'error').length,
        warningCount: statuses.filter((s) => s === 'warning').length,
        tco2e: parseTco2e(raw.tco2e as string | undefined),
        raw,
      })
    })
  }
  return rows
}

// Resumo de uma categoria para a toolbar/painel (linhas, erros, soma tCO₂e).
export type CategoriaResumo = {
  totalLinhas: number
  totalErros: number
  totalAvisos: number
  somaTco2e: number
}

export function getCategoriaResumo(categoriaId: string): CategoriaResumo {
  const rows = getReviewRows(categoriaId)
  return {
    totalLinhas: rows.length,
    totalErros: rows.reduce((a, r) => a + r.errorCount, 0),
    totalAvisos: rows.reduce((a, r) => a + r.warningCount, 0),
    somaTco2e: rows.reduce((a, r) => a + r.tco2e, 0),
  }
}

// ── Decisão da revisão (estado local, mock) ──────────────────────────────────
// É o que, no produto real, flipa o ciclo de coleta no dashboard-v2:
// 'aprovado' / 'reprovado'. 'pendente' = ainda em revisão.
export type ReviewDecision = 'pendente' | 'aprovado' | 'reprovado'

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
