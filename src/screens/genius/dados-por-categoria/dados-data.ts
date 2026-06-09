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
  const v = row.filial ?? row.unidade_empresa ?? (row as Record<string, unknown>)['unidade-op']
  return typeof v === 'string' && v ? v : '—'
}

// ── Procedência do dado (colunas extras só da revisão) ───────────────────────
// ID do arquivo: preenchido na importação, intacto após edições. Linhas manuais
// ficam vazias. Origem: "manual" só para linhas digitadas à mão; linhas
// importadas mantêm o nome do arquivo mesmo após edição. Alterações: nomes das
// colunas alteradas (";" entre elas) — registra o que mudou numa linha importada;
// vazia para linhas não-editadas e manuais. Aqui é mock determinístico por índice.
const ARQUIVOS_IMPORTADOS = [
  'frota-jan-2026.xlsx',
  'consumo-diesel-Q1.csv',
  'abastecimento_matriz.xlsx',
  'relatorio-frota.pdf',
]

export type Procedencia = { fileId: string; origem: string; alteracoes: string }

// Schemas de Combustão móvel que recebem as colunas extras da revisão
// (Responsável / Origem do dado / Alterações). Mantém em sincronia com a tabela.
const PROCEDENCIA_SCHEMAS = new Set(['litros', 'km', 'origem-destino'])

function isProcedenciaSchema(categoriaId: string, schemaId: string): boolean {
  return categoriaId === 'combustao-movel' && PROCEDENCIA_SCHEMAS.has(schemaId)
}

// Rótulo da 1ª coluna "de valor" alterada, por schema — usado no mock de Alterações.
const ALTERACAO_VALOR_POR_SCHEMA: Record<string, string> = {
  litros: 'Consumo; Unidade de medida',
  km: 'Distância; Unidade de medida',
  'origem-destino': 'Endereço de Chegada',
}

function procedenciaOf(schemaId: string, idx: number): Procedencia {
  const arquivo = ARQUIVOS_IMPORTADOS[idx % ARQUIVOS_IMPORTADOS.length]
  const fileId = `arq_${schemaId}_${String(1000 + (idx % ARQUIVOS_IMPORTADOS.length)).slice(-4)}`

  // ~7% linhas digitadas à mão (sem arquivo).
  if (idx % 15 === 4) {
    return { fileId: '', origem: 'manual', alteracoes: '' }
  }
  // ~16% linhas importadas e depois editadas (1–2 colunas alteradas) — origem
  // continua o arquivo; o que mudou fica registrado em Alterações.
  if (idx % 13 === 2) {
    return { fileId, origem: arquivo, alteracoes: ALTERACAO_VALOR_POR_SCHEMA[schemaId] ?? 'Valor' }
  }
  if (idx % 19 === 6) {
    return { fileId, origem: arquivo, alteracoes: 'Ano do veículo' }
  }
  // Resto: importada e intacta.
  return { fileId, origem: arquivo, alteracoes: '' }
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

      // Colunas de procedência (Combustão móvel: litros, quilometragem e origem→destino).
      if (isProcedenciaSchema(cat.id, schema.id)) {
        const proc = procedenciaOf(schema.id, idx)
        filled.fileId = proc.fileId
        filled.origem = proc.origem
        filled.alteracoes = proc.alteracoes
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
  if (colId === 'quantidade' || colId === 'consumo' || colId === 'distancia') return (500 + seed * 27).toLocaleString('pt-BR')
  if (colId === 'ano_veiculo') return String(2012 + (seed % 13))
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
    /** decisão da revisão p/ este respondente nesta categoria (undefined = pendente) */
    status?: RespStatus
    filiais: { unidade: string; temDados: boolean; linhas: number }[]
    /** arquivos enviados por este respondente (mock) */
    arquivos: RespondenteArquivo[]
  }[]
}

// Arquivo enviado por um respondente, exibido no painel de aprovação.
export type RespondenteArquivo = {
  id: string
  name: string
  ext: string
  /** nº de linhas da categoria vinculadas a este arquivo */
  linhas: number
}

// Mock determinístico de arquivos por respondente — derivado do nome para
// variar sem aleatoriedade (Date.now/Math.random quebram render server).
function arquivosDoRespondente(respondente: string, totalLinhas: number): RespondenteArquivo[] {
  const slug = respondente.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')
  const seed = respondente.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const templates = [
    { suffix: 'planilha-base', ext: 'xlsx' },
    { suffix: 'comprovantes', ext: 'pdf' },
    { suffix: 'consumo-detalhado', ext: 'csv' },
    { suffix: 'notas-fiscais', ext: 'pdf' },
    { suffix: 'medicoes-mensais', ext: 'xlsx' },
    { suffix: 'relatorio-frota', ext: 'csv' },
  ]
  // 2 a 6 arquivos — varia por respondente p/ exercitar o threshold (carrossel).
  const n = 2 + (seed % (templates.length - 1))
  const chosen = templates.slice(0, n)
  // Distribui as linhas entre os arquivos (último fica com o resto).
  return chosen.map((t, i) => {
    const base = Math.floor(totalLinhas / n)
    const linhas = i === n - 1 ? totalLinhas - base * (n - 1) : base
    return {
      id: `arq_${slug}_${i}`,
      name: `${slug}-${t.suffix}.${t.ext}`,
      ext: t.ext,
      linhas: Math.max(linhas, 0),
    }
  })
}

export function getCategoriaResumo(
  categoriaId: string,
  // Status por respondente nesta categoria. Recusados continuam na lista de
  // porRespondente (o painel os mostra colapsados), mas suas linhas saem dos
  // totais/quebras — recusar = negar o envio inteiro do respondente.
  respStatus: Record<string, RespStatus> = {},
): CategoriaResumo {
  const cat = findReviewCategory(categoriaId)
  const allRows = getReviewRows(categoriaId)
  const isRecusado = (resp: string) => respStatus[resp] === 'recusado'
  // Linhas válidas p/ totais e quebras: exclui respondentes recusados.
  const rows = allRows.filter((r) => !isRecusado(r.respondente))
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
  // Agrupa filiais por respondente. Itera TODAS as linhas (inclusive recusados)
  // p/ preservar a ordem e a presença de quem foi recusado na lista.
  const respOrdem: string[] = []
  const respMap = new Map<string, Map<string, number>>()
  for (const r of allRows) {
    if (!respMap.has(r.respondente)) {
      respMap.set(r.respondente, new Map())
      respOrdem.push(r.respondente)
    }
    const filiais = respMap.get(r.respondente)!
    filiais.set(r.unidade, (filiais.get(r.unidade) ?? 0) + 1)
  }
  const porRespondente = respOrdem.map((resp) => {
    const status = respStatus[resp]
    // Recusado: o envio foi negado por inteiro — painel mostra só o nome, sem
    // filiais/arquivos. Não monta as quebras p/ não vazar dado descartado.
    if (status === 'recusado') {
      return { respondente: resp, status, filiais: [], arquivos: [] }
    }
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
    const linhasComDados = list.reduce((a, f) => a + f.linhas, 0)
    return {
      respondente: resp,
      status,
      filiais: list,
      arquivos: arquivosDoRespondente(resp, linhasComDados),
    }
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

// ── Status do respondente dentro de uma categoria ────────────────────────────
// A revisão é granular por respondente (cada um envia tudo de uma vez — todas as
// suas filiais/linhas). Recusar nega o envio inteiro; aprovar registra o restante.
// A categoria nunca "fecha": dado novo (reenvio ou outro respondente) pode chegar.
// Sem entrada no mapa = pendente.
export type RespStatus = 'aprovado' | 'recusado'

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
