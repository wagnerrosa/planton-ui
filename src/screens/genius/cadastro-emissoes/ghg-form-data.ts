// Estrutura do formulário GHG Protocol (ferramenta_ghg_protocol_v2026.0.1).
// Espelha as 5 seções do PDF "Registro Público de Emissões": 2.1 Resumo,
// 2.2 Escopo 1, 2.3 Escopo 2, 2.4 Escopo 3, 2.5 Outros gases (fora de Quioto).
// As células ( - ) do PDF viram inputs editáveis (ver GhgForm). Cada filial tem
// preenchimento próprio; chaveamos os valores por filialId.

import { FILIAIS, EMPRESA, ANO_BASE } from '../dashboard-v2/dashboard-data'

export { FILIAIS, EMPRESA, ANO_BASE }

// ── Períodos (mensal, espelha dados-por-categoria) ──────────────────────────
const MESES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]
export type Periodo = { id: string; label: string }
export function getPeriodos(): Periodo[] {
  return MESES.map((m) => ({ id: `${m}/${ANO_BASE}`, label: `${m} ${ANO_BASE}` }))
}

// ── Colunas da matriz 2.1 ───────────────────────────────────────────────────
// PDF tem 8 colunas em 2 grupos: "Em toneladas de gás" e "Em tCO2e", cada um
// com Escopo 1 / Escopo 2-localização / Escopo 2-escolha de compra / Escopo 3.
// Os 4 escopos repetem; diferenciamos por prefixo de unidade (gas|co2e).
const ESCOPOS = [
  { id: 'e1', label: 'Escopo 1' },
  { id: 'e2-loc', label: 'Escopo 2 — localização' },
  { id: 'e2-comp', label: 'Escopo 2 — escolha de compra' },
  { id: 'e3', label: 'Escopo 3' },
] as const

export const RESUMO_GROUPS = [
  { id: 'gas', label: 'Em toneladas de gás', cols: ESCOPOS },
  { id: 'co2e', label: 'Em toneladas métricas de CO2 equivalente (tCO2e)', cols: ESCOPOS },
] as const

// Lista achatada das 8 colunas (id único = `${grupo}:${escopo}`)
export const RESUMO_COLS = RESUMO_GROUPS.flatMap((g) =>
  g.cols.map((c) => ({ id: `${g.id}:${c.id}`, group: g.id, escopo: c.id, label: c.label })),
)

// Gases da matriz 2.1. HFC/PFC são agregadores expansíveis (accordion Excel):
// a linha-mãe é editável e abaixo dela ficam os sub-gases individuais.
export type ResumoGas = {
  id: string
  label: string
  /** escopos com input (CO2/CH4/N2O têm os 4; HFC..NF3 só E1 e E3 — sem E2 no PDF) */
  escopos: readonly string[]
  /** sub-gases expansíveis (accordion) */
  children?: { id: string; label: string }[]
}

const ESCOPOS_GAS = ['e1', 'e2-loc', 'e2-comp', 'e3'] as const
const ESCOPOS_FLUOR = ['e1', 'e3'] as const // HFC/PFC/SF6/NF3: sem Escopo 2 no PDF

const HFC_CHILDREN = [
  'HFC-23', 'HFC-32', 'HFC-41', 'HFC-125', 'HFC-134', 'HFC-134a', 'HFC-143',
  'HFC-143a', 'HFC-152', 'HFC-152a', 'HFC-161', 'HFC-227ea', 'HFC-236cb',
  'HFC-236ea', 'HFC-236fa', 'HFC-245ca', 'HFC-245fa', 'HFC-365mfc', 'HFC-43-10mee',
].map((l) => ({ id: l.toLowerCase(), label: l }))

const PFC_CHILDREN = [
  'PFC-14', 'PFC-116', 'PFC-218', 'PFC-318', 'PFC-3-1-10', 'PFC-4-1-12',
  'PFC-5-1-14', 'PFC-9-1-18', 'Trifluorometil pentafluoreto de enxofre',
  'Perfluorociclopropano',
].map((l) => ({ id: l.toLowerCase().replace(/\s+/g, '-'), label: l }))

export const RESUMO_GASES: ResumoGas[] = [
  { id: 'co2', label: 'CO2', escopos: ESCOPOS_GAS },
  { id: 'ch4', label: 'CH4', escopos: ESCOPOS_GAS },
  { id: 'n2o', label: 'N2O', escopos: ESCOPOS_GAS },
  { id: 'hfc', label: 'HFC', escopos: ESCOPOS_FLUOR, children: HFC_CHILDREN },
  { id: 'pfc', label: 'PFC', escopos: ESCOPOS_FLUOR, children: PFC_CHILDREN },
  { id: 'sf6', label: 'SF6', escopos: ESCOPOS_FLUOR },
  { id: 'nf3', label: 'NF3', escopos: ESCOPOS_FLUOR },
]

// ── Linhas por categoria (2.2 / 2.3 / 2.4) ──────────────────────────────────
// Cada uma tem 3 colunas no PDF: Emissões tCO2e | CO2 biogênico | Remoções CO2
// biogênico. Algumas categorias omitem "Remoções" no PDF — marcamos por flag.
export type CategoriaLinha = {
  id: string
  label: string
  /** false = sem coluna "Remoções de CO2 biogênico" (espelha PDF) */
  remocoes?: boolean
}

export type FormSecao = {
  id: string
  numero: string
  titulo: string
  /** subtítulo opcional (ex: a abordagem do Escopo 2) */
  subtitulo?: string
  linhas: CategoriaLinha[]
}

// 2.2 Escopo 1
export const ESCOPO1_LINHAS: CategoriaLinha[] = [
  { id: 'combustao-movel', label: 'Combustão móvel', remocoes: false },
  { id: 'combustao-estacionaria', label: 'Combustão estacionária', remocoes: false },
  { id: 'processos-industriais', label: 'Processos industriais', remocoes: true },
  { id: 'residuos', label: 'Resíduos sólidos e efluentes líquidos', remocoes: false },
  { id: 'fugitivas', label: 'Fugitivas', remocoes: false },
  { id: 'agricolas', label: 'Atividades agrícolas', remocoes: true },
  { id: 'uso-solo', label: 'Mudança no uso do solo', remocoes: true },
]

// 2.3 Escopo 2 — duas abordagens, mesmas linhas
export const ESCOPO2_LINHAS: CategoriaLinha[] = [
  { id: 'energia-eletrica', label: 'Aquisição de energia elétrica', remocoes: false },
  { id: 'energia-termica', label: 'Aquisição de energia térmica', remocoes: false },
  { id: 'perdas-td', label: 'Perdas por transmissão e distribuição', remocoes: false },
]

// 2.4 Escopo 3 — 15 categorias do GHG Protocol
export const ESCOPO3_LINHAS: CategoriaLinha[] = [
  { id: 'e3-1', label: '1. Bens e serviços comprados', remocoes: false },
  { id: 'e3-2', label: '2. Bens de capital', remocoes: false },
  { id: 'e3-3', label: '3. Atividades de combustível e energia não inclusas nos Escopos 1 e 2', remocoes: true },
  { id: 'e3-4', label: '4. Transporte e distribuição (upstream)', remocoes: true },
  { id: 'e3-5', label: '5. Resíduos gerados nas operações', remocoes: true },
  { id: 'e3-6', label: '6. Viagens a negócios', remocoes: true },
  { id: 'e3-7', label: '7. Emissões casa-trabalho', remocoes: true },
  { id: 'e3-8', label: '8. Bens arrendados (organização como arrendatária)', remocoes: false },
  { id: 'e3-9', label: '9. Transporte e distribuição (downstream)', remocoes: true },
  { id: 'e3-10', label: '10. Processamento de produtos vendidos', remocoes: false },
  { id: 'e3-11', label: '11. Uso de bens e serviços vendidos', remocoes: false },
  { id: 'e3-12', label: '12. Tratamento de fim de vida dos produtos vendidos', remocoes: false },
  { id: 'e3-13', label: '13. Bens arrendados (organização como arrendadora)', remocoes: false },
  { id: 'e3-14', label: '14. Franquias', remocoes: false },
  { id: 'e3-15', label: '15. Investimentos', remocoes: false },
]

// 2.5 Outros gases fora do Protocolo de Quioto — só Emissões tCO2e
export const OUTROS_GASES: CategoriaLinha[] = [
  'CFC-11', 'CFC-12', 'CFC-13', 'CFC-113', 'CFC-114', 'CFC-115',
  'Halon-1301', 'Halon-1211', 'Halon-2402', 'Tetracloreto de carbono (CCl4)',
  'Bromometano (CH3Br)', 'Methyl chloroform (CH3CCl3)', 'HCFC-21',
  'HCFC-22 (R22)', 'HCFC-123', 'HCFC-124', 'HCFC-141b', 'HCFC-142b',
  'HCFC-225ca', 'HCFC-225cb',
].map((l) => ({ id: l.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''), label: l }))

// Colunas das seções 2.2/2.3/2.4 (a 3ª é condicional por linha)
export const CATEGORIA_COLS = [
  { id: 'tco2e', label: 'Emissões tCO2e' },
  { id: 'biog-emissao', label: 'Emissões de CO2 biogênico' },
  { id: 'biog-remocao', label: 'Remoções de CO2 biogênico' },
] as const

// ── Mock de importação de Excel ─────────────────────────────────────────────
// Gera um preenchimento determinístico para TODAS as células editáveis do form
// (mesmas chaves usadas no GhgForm). Usado pelo botão "Importar Excel" — simula
// a planilha preenchida virar valores no formulário. Determinístico por índice
// (sem Math.random) → sem hydration mismatch.
// Todas as chaves de células editáveis do formulário (linhas-mãe da 2.1, sem
// sub-gases que são opcionais). Usado p/ medir progresso de preenchimento.
export const ALL_FIELD_KEYS: string[] = (() => {
  const keys: string[] = []
  for (const gas of RESUMO_GASES) {
    for (const col of RESUMO_COLS) {
      if (gas.escopos.includes(col.escopo)) keys.push(`resumo|${gas.id}|${col.id}`)
    }
  }
  const cat = (prefixo: string, linhas: CategoriaLinha[]) => {
    for (const l of linhas) for (const col of CATEGORIA_COLS) keys.push(`${prefixo}|${l.id}|${col.id}`)
  }
  cat('e1', ESCOPO1_LINHAS)
  cat('e2loc', ESCOPO2_LINHAS)
  cat('e2comp', ESCOPO2_LINHAS)
  cat('e3', ESCOPO3_LINHAS)
  for (const g of OUTROS_GASES) keys.push(`outros|${g.id}`)
  return keys
})()

// Status de preenchimento de uma combinação (valores de um escopo filial+mês).
export type PreenchStatus = 'vazio' | 'parcial' | 'completo'
export function getPreenchStatus(values: Record<string, string> | undefined): PreenchStatus {
  if (!values) return 'vazio'
  const filled = ALL_FIELD_KEYS.reduce((n, k) => n + ((values[k] ?? '').trim() !== '' ? 1 : 0), 0)
  if (filled === 0) return 'vazio'
  if (filled >= ALL_FIELD_KEYS.length) return 'completo'
  return 'parcial'
}

export function buildMockImport(): Record<string, string> {
  const out: Record<string, string> = {}
  let i = 0
  const val = () => {
    // valores plausíveis, variando por índice
    const n = ((i * 137) % 900) + 12 + (i % 7) / 10
    i += 1
    return n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
  }

  // 2.1 Resumo (linhas-mãe; sub-gases ficam vazios — preenchimento opcional)
  for (const gas of RESUMO_GASES) {
    for (const col of RESUMO_COLS) {
      if (gas.escopos.includes(col.escopo)) out[`resumo|${gas.id}|${col.id}`] = val()
    }
  }
  // 2.2 / 2.4
  const fillCat = (prefixo: string, linhas: CategoriaLinha[]) => {
    for (const l of linhas) {
      for (const col of CATEGORIA_COLS) out[`${prefixo}|${l.id}|${col.id}`] = val()
    }
  }
  fillCat('e1', ESCOPO1_LINHAS)
  fillCat('e2loc', ESCOPO2_LINHAS)
  fillCat('e2comp', ESCOPO2_LINHAS)
  fillCat('e3', ESCOPO3_LINHAS)
  // 2.5 Outros gases
  for (const g of OUTROS_GASES) out[`outros|${g.id}`] = val()

  return out
}
