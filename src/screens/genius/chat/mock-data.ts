import type { ComponentType } from 'react'
import { Truck, Flame, Zap, Snowflake, Plane, Trash2, Helicopter, Anchor, Trees, PlaneTakeoff, PlaneLanding, Ship, Container, Van, Wheat, House, Recycle, Droplets, type LucideProps } from 'lucide-react'
import { CowIcon } from '@/components/genius/icons/CowIcon'

export type SchemaColumn = {
  id: string
  title: string
  width: number
  type?: 'text' | 'bubble'
  options?: string[]
  /** descrição da coluna (tooltip/ajuda) */
  description?: string
}

export type CellStatus = 'error' | 'warning'

export type SchemaRow = {
  [key: string]: string | Record<string, CellStatus> | undefined
  _cellStatus?: Record<string, CellStatus>
}

export type TableSchema = {
  id: string
  label: string
  columns: SchemaColumn[]
  rows: SchemaRow[]
  isResumo?: boolean
}

export type ChatAttachment = {
  name: string
  ext: string
  processingId?: string
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  hasInventoryData?: boolean
  timestamp: Date
  variant?: 'error' | 'warning' | 'success'
  isOnboarding?: boolean
  attachments?: ChatAttachment[]
}

export type EmissionCategory = {
  id: string
  label: string
  /** Ícone — lucide ou SVG custom compatível ({@link LucideProps}), ex.: CowIcon. */
  icon: ComponentType<LucideProps>
  hint: string
  scope: 1 | 2 | 3
  schemas: TableSchema[]
  initialChat: ChatMessage[]
  direction?: 'up' | 'down'
}

const now = new Date()
const t = (offsetMin: number) => new Date(now.getTime() - offsetMin * 60_000)

const UNIDADES_EMPRESA = [
  'Matriz SP', 'CD Guarulhos', 'Loja Rio de Janeiro', 'Filial BH',
  'Fábrica Campinas', 'CD Cajamar', 'CD Recife', 'Loja Santos', 'Loja Campinas',
]

// ── Dados base de Combustão móvel (rodoviário) ───────────────────────────────
// Compartilhados pelos 3 schemas (litros / quilometragem / origem→destino) p/
// que as linhas tenham o mesmo vocabulário (frota, combustível, responsável).
const CM_TIPOS_VEICULO = [
  'Automóvel', 'Automóvel', 'Automóvel',
  'Caminhão', 'Caminhão', 'Caminhão',
  'Gerador', 'Gerador', 'Gerador',
  'Utilitário', 'Van', 'Empilhadeira',
  'Caminhão', 'Caminhão', 'Automóvel',
  'Automóvel', 'Utilitário', 'Van',
  'Caminhão', 'Caminhão',
]
const CM_COMBUSTIVEIS = [
  { nome: 'Diesel S10', fator: '2,67 kg/L', mult: 2.67 },
  { nome: 'Diesel S500', fator: '2,68 kg/L', mult: 2.68 },
  { nome: 'Gasolina', fator: '2,21 kg/L', mult: 2.21 },
  { nome: 'Etanol', fator: '1,52 kg/L', mult: 1.52 },
  { nome: 'GNV', fator: '1,87 kg/m³', mult: 1.87 },
  { nome: 'Biodiesel B10', fator: '2,40 kg/L', mult: 2.40 },
]
const CM_RESPONSAVEIS = [
  'Carlos Mendes', 'Patrícia Souza', 'Diego Martins', 'Ana Beatriz Lima',
  'Roberto Carvalho', 'Juliana Pereira', 'Fernando Alves', 'Camila Rodrigues',
  'Marcos Oliveira', 'Beatriz Santos',
]
const CM_PERIODOS = [
  'Jan/2026', 'Fev/2026', 'Mar/2026', 'Abr/2026', 'Mai/2026', 'Jun/2026',
  'Jul/2026', 'Ago/2026', 'Set/2026', 'Out/2025', 'Nov/2025', 'Dez/2025',
]
// Prefixo do identificador (placa/frota) por tipo de veículo.
const CM_PREFIXO_ID: Record<string, string> = {
  Automóvel: 'CAR', Caminhão: 'TRK', Gerador: 'GEN',
  Utilitário: 'UTL', Van: 'VAN', Empilhadeira: 'EMP',
}

function cmBase(i: number) {
  const tipoVeiculo = CM_TIPOS_VEICULO[i % CM_TIPOS_VEICULO.length]
  const comb = CM_COMBUSTIVEIS[i % CM_COMBUSTIVEIS.length]
  return {
    filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
    mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
    responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    anoVeiculo: String(2012 + ((i * 7) % 13)),
    tipoVeiculo,
    comb,
    identificador: `${CM_PREFIXO_ID[tipoVeiculo] ?? 'VEI'}-${String(1000 + i * 13).slice(-4)}`,
  }
}

function buildCombustaoMovelLitros(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = cmBase(i)
    const consumoNum = 500 + ((i * 137) % 28000)
    const tco2eNum = (consumoNum * b.comb.mult) / 1000

    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificador: b.identificador,
      consumo: consumoNum.toLocaleString('pt-BR'),
      unidade: b.comb.nome === 'GNV' ? 'm³' : 'litros',
      tipo_combustivel: b.comb.nome,
      tipo_veiculo: b.tipoVeiculo,
      ano_veiculo: b.anoVeiculo,
      // Campos retidos para a revisão (tela Dados-por-categoria) — não são colunas
      // visíveis no Chat, mas alimentam soma de tCO₂e, filtro de responsável e período.
      periodo: b.mes_emissao,
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }

    // Sprinkle errors/warnings deterministically (~12% rows)
    if (i % 17 === 3) {
      row.consumo = ''
      row.tco2e = ''
      row._cellStatus = { consumo: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { tipo_combustivel: 'warning' }
    } else if (i % 31 === 5) {
      row.ano_veiculo = ''
      row._cellStatus = { ano_veiculo: 'error' }
    } else if (i % 29 === 11) {
      row._cellStatus = { unidade: 'warning' }
    }

    rows.push(row)
  }
  return rows
}

// Por quilometragem: mesma frota, mas o consumo entra como distância percorrida.
// tCO₂e estimado por km·fator (mock determinístico, mesma ordem de grandeza).
function buildCombustaoMovelDistancia(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = cmBase(i)
    const distNum = 1200 + ((i * 173) % 48000)
    const isMilhas = i % 11 === 0
    const tco2eNum = (distNum * b.comb.mult * 0.31) / 1000

    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificador: b.identificador,
      distancia: distNum.toLocaleString('pt-BR'),
      unidade: isMilhas ? 'milhas' : 'km',
      tipo_combustivel: b.comb.nome,
      tipo_veiculo: b.tipoVeiculo,
      ano_veiculo: b.anoVeiculo,
      periodo: b.mes_emissao,
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }

    if (i % 17 === 3) {
      row.distancia = ''
      row.tco2e = ''
      row._cellStatus = { distancia: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { tipo_combustivel: 'warning' }
    } else if (i % 31 === 5) {
      row.ano_veiculo = ''
      row._cellStatus = { ano_veiculo: 'error' }
    } else if (i % 29 === 11) {
      row._cellStatus = { unidade: 'warning' }
    }

    rows.push(row)
  }
  return rows
}

// Origem → Destino: o sistema calcula a distância da rota; o respondente informa
// endereços de partida/chegada. tCO₂e derivado da distância calculada da rota.
function buildCombustaoMovelEnderecos(): SchemaRow[] {
  const enderecos = [
    'Av. Paulista, 1000 - São Paulo/SP',
    'Rod. Anhanguera, km 25 - Jundiaí/SP',
    'Rua das Indústrias, 450 - Guarulhos/SP',
    'Av. das Nações, 200 - Campinas/SP',
    'Porto de Santos - Santos/SP',
    'Rod. Dutra, km 160 - Rio de Janeiro/RJ',
    'Distrito Industrial - Cajamar/SP',
    'Av. Brasil, 3000 - Belo Horizonte/MG',
    'Centro de Distribuição - Recife/PE',
  ]
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = cmBase(i)
    const kmNum = 800 + ((i * 211) % 32000)
    const tco2eNum = (kmNum * b.comb.mult * 0.31) / 1000

    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificador: b.identificador,
      endereco_partida: enderecos[i % enderecos.length],
      endereco_chegada: enderecos[(i + 3) % enderecos.length],
      tipo_combustivel: b.comb.nome,
      tipo_veiculo: b.tipoVeiculo,
      ano_veiculo: b.anoVeiculo,
      // Campos retidos p/ a revisão (não-colunas no Chat).
      periodo: b.mes_emissao,
      km_calculado: kmNum.toLocaleString('pt-BR'),
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }

    if (i % 17 === 3) {
      row.endereco_chegada = ''
      row.tco2e = ''
      row._cellStatus = { endereco_chegada: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { tipo_combustivel: 'warning' }
    } else if (i % 31 === 5) {
      row.ano_veiculo = ''
      row._cellStatus = { ano_veiculo: 'error' }
    } else if (i % 29 === 11) {
      row._cellStatus = { endereco_partida: 'warning' }
    }

    rows.push(row)
  }
  return rows
}

// ── Combustão móvel aéreo / hidroviário ──────────────────────────────────────
// Mesma forma do rodoviário "Por litros" (consumo em volume de combustível), mas
// sem tipo/ano de veículo — a frota é aeronave/embarcação, identificada só pelo
// código. Combustíveis e fatores específicos de cada modal.
const CM_AEREO_COMBUSTIVEIS = [
  { nome: 'Querosene de Aviação (QAV)', fator: '3,15 kg/L', mult: 3.15 },
  { nome: 'Gasolina de Aviação (AvGas)', fator: '3,10 kg/L', mult: 3.10 },
  { nome: 'Jet A-1', fator: '3,16 kg/L', mult: 3.16 },
]
const CM_HIDRO_COMBUSTIVEIS = [
  { nome: 'Óleo Diesel Marítimo (MDO)', fator: '3,21 kg/L', mult: 3.21 },
  { nome: 'Óleo Combustível Pesado (HFO)', fator: '3,11 kg/L', mult: 3.11 },
  { nome: 'Diesel S10', fator: '2,67 kg/L', mult: 2.67 },
  { nome: 'GNV', fator: '1,87 kg/m³', mult: 1.87 },
]

function buildCombustaoMovelModal(
  combustiveis: { nome: string; fator: string; mult: number }[],
  idPrefix: string,
): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const comb = combustiveis[i % combustiveis.length]
    const consumoNum = 800 + ((i * 211) % 64000)
    const tco2eNum = (consumoNum * comb.mult) / 1000

    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      identificador: `${idPrefix}-${String(1000 + i * 13).slice(-4)}`,
      consumo: consumoNum.toLocaleString('pt-BR'),
      unidade: comb.nome === 'GNV' ? 'm³' : 'litros',
      tipo_combustivel: comb.nome,
      // Campos retidos p/ a revisão (não-colunas no Chat).
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }

    if (i % 17 === 3) {
      row.consumo = ''
      row.tco2e = ''
      row._cellStatus = { consumo: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { tipo_combustivel: 'warning' }
    } else if (i % 29 === 11) {
      row._cellStatus = { unidade: 'warning' }
    }

    rows.push(row)
  }
  return rows
}

// Colunas do schema "Por litros" dos modais aéreo/hidroviário (sem tipo/ano de
// veículo). `identificadorDesc` varia: frota/aeronave vs frota/embarcação.
function modalLitrosColumns(identificadorDesc: string, combustiveis: string[]): SchemaColumn[] {
  return [
    { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
    { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
    { id: 'identificador', title: 'Identificador', width: 150, description: identificadorDesc },
    { id: 'consumo', title: 'Consumo', width: 130, description: 'Quantidade de combustível consumido.' },
    { id: 'unidade', title: 'Unidade de medida', width: 150, type: 'bubble', options: ['litros', 'm³', 'kg'], description: 'Unidade de medida (litros, m³, kg, etc.).' },
    { id: 'tipo_combustivel', title: 'Tipo de combustível', width: 200, type: 'bubble', options: combustiveis, description: 'Tipo de combustível utilizado.' },
  ]
}

// ── Aquisição de energia elétrica (escopo 2) ─────────────────────────────────
// 3 ambientes de contratação: SIN (rede/cativo), ACL (mercado livre) e geração
// própria. Consumo em kWh/MWh; tCO₂e retido p/ revisão (fator SIN ~0,0385).
const EE_UNIDADES = ['kWh', 'MWh', 'GWh']
const EE_FONTES_ACL = ['Solar', 'Eólica', 'Hídrica', 'Biomassa']
const EE_FATOR_SIN = 0.0385 // tCO₂/MWh (rede)

function eeConsumoMWh(i: number): number {
  // 8–520 MWh determinístico.
  return 8 + ((i * 173) % 512)
}

function buildEnergiaSIN(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const mwh = eeConsumoMWh(i)
    const usaMWh = i % 3 !== 0
    const consumoNum = usaMWh ? mwh : mwh * 1000
    const tco2eNum = mwh * EE_FATOR_SIN

    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      consumo: consumoNum.toLocaleString('pt-BR'),
      unidade: usaMWh ? 'MWh' : 'kWh',
      origem: 'SIN',
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: '0,0385 tCO₂/MWh',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }

    if (i % 17 === 3) {
      row.consumo = ''
      row.tco2e = ''
      row._cellStatus = { consumo: 'error' }
    } else if (i % 29 === 11) {
      row._cellStatus = { unidade: 'warning' }
    }
    rows.push(row)
  }
  return rows
}

function buildEnergiaACL(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const mwh = eeConsumoMWh(i)
    const usaMWh = i % 3 !== 0
    const consumoNum = usaMWh ? mwh : mwh * 1000
    const fonte = EE_FONTES_ACL[i % EE_FONTES_ACL.length]
    // ~60% têm certificado I-REC (zera a emissão); resto fica pendente de autodeclaração.
    const temIrec = i % 5 < 3
    // I-REC presente → fonte renovável certificada, fator 0. Sem → usa o fator da rede.
    const tco2eNum = temIrec ? 0 : mwh * EE_FATOR_SIN

    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      consumo: consumoNum.toLocaleString('pt-BR'),
      unidade: usaMWh ? 'MWh' : 'kWh',
      origem: 'ACL',
      fonte,
      // Registro: observação p/ o Inventory Calculator. Com I-REC vira doc
      // comprobatório (código do certificado); sem, fica autodeclaração pendente.
      registro: temIrec ? `I-REC ${String(100000 + i * 37).slice(-6)}` : 'Autodeclaração Pendente',
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: temIrec ? '0,00 tCO₂/MWh (I-REC)' : '0,0385 tCO₂/MWh',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }

    if (i % 17 === 3) {
      row.consumo = ''
      row.tco2e = ''
      row._cellStatus = { consumo: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { registro: 'warning' }
    } else if (i % 29 === 11) {
      row._cellStatus = { fonte: 'warning' }
    }
    rows.push(row)
  }
  return rows
}

function buildEnergiaGeracaoPropria(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const mwh = eeConsumoMWh(i)
    const usaMWh = i % 3 !== 0
    const consumoNum = usaMWh ? mwh : mwh * 1000
    // Geração própria cobre 40–110% do consumo (excedente injetado na rede).
    const geracaoMWh = Math.round(mwh * (0.4 + ((i * 7) % 70) / 100))
    const geracaoNum = usaMWh ? geracaoMWh : geracaoMWh * 1000
    const fonte = EE_FONTES_ACL[i % EE_FONTES_ACL.length]
    // Geração própria renovável → emissão associada ~0 (mock).
    const tco2eNum = 0

    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      consumo: consumoNum.toLocaleString('pt-BR'),
      unidade_consumo: usaMWh ? 'MWh' : 'kWh',
      geracao: geracaoNum.toLocaleString('pt-BR'),
      unidade_geracao: usaMWh ? 'MWh' : 'kWh',
      origem: fonte,
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }

    if (i % 17 === 3) {
      row.geracao = ''
      row._cellStatus = { geracao: 'error' }
    } else if (i % 29 === 11) {
      row._cellStatus = { origem: 'warning' }
    }
    rows.push(row)
  }
  return rows
}

// ── Mudança no Uso do Solo (escopo 1) ────────────────────────────────────────
// Conversão de uso da terra: área (ha) que mudou de uso anterior → posterior, com
// eventual subproduto (ex.: lenha) da supressão. 2 abas: "Solo" (sem detalhe de
// vegetação) e "Vegetação" (acrescenta bioma/tipo/fitofisionomia da vegetação
// suprimida). tCO₂e retido p/ revisão, estimado por área·fator (mock).
const MUS_USOS = [
  'Cultura anual', 'Cana', 'Perene', 'Pastagem', 'Silvicultura',
]
const MUS_USOS_POSTERIOR = [
  'Cultura anual', 'Cana', 'Perene', 'Pastagem', 'Silvicultura', 'Assentamentos', 'Outros',
]
// Uso anterior da aba Vegetação inclui vegetação natural (origem da supressão).
const MUS_USOS_VEG = [...MUS_USOS, 'Vegetação natural']
const MUS_USOS_VEG_POSTERIOR = [...MUS_USOS_POSTERIOR, 'Vegetação natural']
const MUS_SUBPRODUTOS = [
  'Sim — lenha', 'Não', 'Sim — toras', 'Não', 'Sim — cavaco', 'Não',
]
const MUS_BIOMAS = ['Amazônia', 'Cerrado', 'Mata Atlântica', 'Caatinga', 'Pampa', 'Pantanal']
const MUS_TIPO_VEG = ['Primária', 'Secundária']
const MUS_FITO = [
  'Floresta Ombrófila Densa', 'Floresta Estacional Semidecidual', 'Savana Arborizada',
  'Floresta Estacional Decidual', 'Campo Limpo', 'Floresta Ombrófila Mista',
]
// Fator de emissão por hectare convertido (mock, tCO₂e/ha). Varia por uso anterior:
// converter vegetação natural emite mais que converter cultura já existente.
const MUS_FATOR_HA: Record<string, number> = {
  'Vegetação natural': 480,
  'Silvicultura': 120,
  'Perene': 90,
  'Pastagem': 60,
  'Cana': 45,
  'Cultura anual': 30,
}

function musBase(i: number) {
  const usoAnterior = MUS_USOS[i % MUS_USOS.length]
  const areaNum = 5 + ((i * 31) % 1200)
  const subproduto = MUS_SUBPRODUTOS[i % MUS_SUBPRODUTOS.length]
  const temSubproduto = subproduto.startsWith('Sim')
  const fator = MUS_FATOR_HA[usoAnterior] ?? 60
  const tco2eNum = (areaNum * fator) / 1000
  return {
    filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
    mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
    responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    usoAnterior,
    usoPosterior: MUS_USOS_POSTERIOR[(i + 3) % MUS_USOS_POSTERIOR.length],
    area: areaNum.toLocaleString('pt-BR'),
    subproduto,
    quantidade: temSubproduto ? (10 + ((i * 17) % 480)).toLocaleString('pt-BR') + ' m³' : '—',
    fator,
    tco2e: tco2eNum,
  }
}

function buildMudancaUsoSolo(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = musBase(i)
    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      area: b.area,
      uso_anterior: b.usoAnterior,
      uso_posterior: b.usoPosterior,
      subprodutos: b.subproduto,
      quantidade: b.quantidade,
      periodo: b.mes_emissao,
      fator: `${b.fator.toLocaleString('pt-BR')} tCO₂e/ha`,
      tco2e: b.tco2e.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }

    if (i % 17 === 3) {
      row.area = ''
      row.tco2e = ''
      row._cellStatus = { area: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { uso_posterior: 'warning' }
    } else if (i % 31 === 5) {
      row.quantidade = ''
      row._cellStatus = { quantidade: 'error' }
    } else if (i % 29 === 11) {
      row._cellStatus = { subprodutos: 'warning' }
    }

    rows.push(row)
  }
  return rows
}

// Aba Vegetação: mesma base, mas a conversão parte de vegetação natural —
// acrescenta bioma/tipo/fitofisionomia e usa o fator mais alto.
function buildMudancaUsoSoloVegetacao(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const usoAnterior = MUS_USOS_VEG[i % MUS_USOS_VEG.length]
    const areaNum = 5 + ((i * 43) % 980)
    const subproduto = MUS_SUBPRODUTOS[i % MUS_SUBPRODUTOS.length]
    const temSubproduto = subproduto.startsWith('Sim')
    const fator = MUS_FATOR_HA[usoAnterior] ?? 60
    const tco2eNum = (areaNum * fator) / 1000

    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      area: areaNum.toLocaleString('pt-BR'),
      uso_anterior: usoAnterior,
      uso_posterior: MUS_USOS_VEG_POSTERIOR[(i + 3) % MUS_USOS_VEG_POSTERIOR.length],
      bioma: MUS_BIOMAS[i % MUS_BIOMAS.length],
      tipo_vegetacao: MUS_TIPO_VEG[i % MUS_TIPO_VEG.length],
      fitofisionomia: MUS_FITO[i % MUS_FITO.length],
      subprodutos: subproduto,
      quantidade: temSubproduto ? (10 + ((i * 23) % 520)).toLocaleString('pt-BR') + ' m³' : '—',
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: `${fator.toLocaleString('pt-BR')} tCO₂e/ha`,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }

    if (i % 17 === 3) {
      row.area = ''
      row.tco2e = ''
      row._cellStatus = { area: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { tipo_vegetacao: 'warning' }
    } else if (i % 31 === 5) {
      row._cellStatus = { bioma: 'warning' }
    } else if (i % 29 === 11) {
      row._cellStatus = { fitofisionomia: 'warning' }
    }

    rows.push(row)
  }
  return rows
}

// ── Dados base de Efluentes Líquidos ─────────────────────────────────────────
// A planilha de origem (template Faber-Castell) é uma matriz parâmetro × mês ×
// (Ent./Saída) por bloco (filial × tipo de efluente), em 2 seções: Pré e Pós
// Tratamento. Aqui normalizamos p/ uma forma "longa": 1 linha = 1 ETAPA de
// medição. Um bloco (filial × mês × tipo × fase) tem N etapas (2–4):
//   • etapa 01 = entrada da fase;
//   • última etapa = saída da fase;
//   • etapas intermediárias = pontos do meio do processo.
// Assim cada linha carrega UMA medição por parâmetro (DBO/DQO/N₂/Volume) —
// sem o par Ent./Saída em colunas separadas. A "Fase" (Pré/Pós) é uma coluna,
// não mais uma aba: tudo numa única tabela.
const EFL_TIPOS = ['Esgoto doméstico (sanitário)', 'Efluente industrial']
const EFL_TRATAMENTOS = [
  'Biológico (lodos ativados)',
  'Anaeróbio (reator UASB)',
  'Lagoa anaeróbia',
  'Fossa séptica',
  'Físico-químico',
  'Sem tratamento (rede pública)',
]
const EFL_DISPOSICOES = [
  'Rede de coleta da prefeitura, direcionada para ETE do Município',
  'Lançamento em corpo hídrico (rio)',
  'Infiltração no solo',
  'Reuso interno (água de processo)',
]
const EFL_FASES = ['Pré-tratamento', 'Pós-tratamento']

// Perfil fixo de cada unidade da empresa: responsável sempre o mesmo, tratamento
// e disposição próprios, e quais fases a unidade monitora. Caso real do template
// (Faber-Castell): a unidade de Prata só tem Pós-tratamento — nem toda unidade
// faz pré-tratamento. `fases` define o que cada uma emite.
type EflUnidade = {
  filial: string
  responsavel: string
  tipo: string
  tratamento: string
  disposicao: string
  fases: string[]
}
const EFL_UNIDADES: EflUnidade[] = [
  // Unidade só Pós-tratamento — caso real (Prata): efluente vai direto ao
  // tratamento principal, sem etapa de pré declarada.
  { filial: 'Prata', responsavel: 'Carlos Mendes', tipo: 'Esgoto doméstico (sanitário)', tratamento: 'Biológico (lodos ativados)', disposicao: 'Rede de coleta da prefeitura, direcionada para ETE do Município', fases: ['Pós-tratamento'] },
  { filial: 'São Carlos', responsavel: 'Patrícia Souza', tipo: 'Efluente industrial', tratamento: 'Físico-químico', disposicao: 'Lançamento em corpo hídrico (rio)', fases: ['Pré-tratamento', 'Pós-tratamento'] },
  { filial: 'Manaus', responsavel: 'Diego Martins', tipo: 'Efluente industrial', tratamento: 'Anaeróbio (reator UASB)', disposicao: 'Lançamento em corpo hídrico (rio)', fases: ['Pré-tratamento', 'Pós-tratamento'] },
  // Outra unidade só Pós-tratamento.
  { filial: 'Filial BH', responsavel: 'Ana Beatriz Lima', tipo: 'Esgoto doméstico (sanitário)', tratamento: 'Fossa séptica', disposicao: 'Infiltração no solo', fases: ['Pós-tratamento'] },
  { filial: 'Fábrica Campinas', responsavel: 'Roberto Carvalho', tipo: 'Efluente industrial', tratamento: 'Lagoa anaeróbia', disposicao: 'Reuso interno (água de processo)', fases: ['Pré-tratamento', 'Pós-tratamento'] },
  { filial: 'CD Guarulhos', responsavel: 'Juliana Pereira', tipo: 'Esgoto doméstico (sanitário)', tratamento: 'Sem tratamento (rede pública)', disposicao: 'Rede de coleta da prefeitura, direcionada para ETE do Município', fases: ['Pós-tratamento'] },
]

const fmtMgL = (n: number) =>
  n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })

const efl2 = (n: number) => String(n).padStart(2, '0')

// Forma longa: 1 linha = 1 etapa de medição. Itera unidade → mês → fase(s da
// unidade) → etapas. Cada unidade tem responsável/tratamento/disposição fixos;
// só as medições (DBO/DQO/N₂/volume) variam por mês/fase/etapa. A remoção total
// da fase é distribuída ao longo das etapas — a etapa de saída chega ao final.
function buildEfluentes(): SchemaRow[] {
  const rows: SchemaRow[] = []
  let seq = 0 // contador global p/ sprinkle determinístico de erros/avisos
  // Itera mês por fora, unidade por dentro: assim todas as 6 unidades aparecem
  // já nos primeiros meses (em vez de esgotar o teto de 100 numa só unidade).
  for (let m = 0; m < CM_PERIODOS.length && rows.length < 100; m++) {
    const mes = CM_PERIODOS[m]
    for (let u = 0; u < EFL_UNIDADES.length && rows.length < 100; u++) {
      const unidade = EFL_UNIDADES[u]
      // Carga bruta do mês — varia por unidade (u) e mês (m), estável. Essas
      // variáveis acompanham o efluente ao longo das fases: a saída de uma fase
      // é a entrada da próxima (o mesmo efluente flui Pré → Pós, não recomeça).
      let cargaDbo = 120 + (((u * 7 + m) * 53) % 900)
      let cargaDqo = Math.round(cargaDbo * (1.9 + ((u + m) % 5) * 0.15))
      let cargaVol = 500 + (((u * 5 + m) * 97) % 350)
      const n2Medido = (u + m) % 6 === 0

      for (const fase of unidade.fases) {
        if (rows.length >= 100) break
        const isPos = fase === 'Pós-tratamento'
        // Pré: 2 etapas (entrada → saída). Pós: 2–4 (entrada, meio(s), saída).
        const nEtapas = isPos ? 2 + (m % 3) : 2
        const remocaoTotal = isPos ? 0.85 + (m % 5) * 0.025 : 0.1 + (m % 4) * 0.05
        // "< 2" = abaixo do limite de detecção do laboratório (template real),
        // só na saída do pós-tratamento.
        const abaixoDeteccao = isPos && (u + m) % 11 === 8
        // Carga no início desta fase (= saída da fase anterior, se houver).
        const dboFaseEnt = cargaDbo
        const dqoFaseEnt = cargaDqo
        const volFaseEnt = cargaVol

        for (let e = 0; e < nEtapas && rows.length < 100; e++) {
          const i = seq++
          const isSaida = e === nEtapas - 1
          // Fração da remoção desta fase já aplicada (0 na entrada → 1 na saída).
          const frac = e / (nEtapas - 1)
          const dboNum = isSaida && abaixoDeteccao ? 2 : dboFaseEnt * (1 - remocaoTotal * frac)
          const dqoNum = dqoFaseEnt * (1 - remocaoTotal * frac)
          const volNum = volFaseEnt - Math.round(frac * (volFaseEnt * 0.03))
          const etapaLabel =
            e === 0 ? 'Entrada' : isSaida ? 'Saída' : `Etapa ${efl2(e + 1)}`

          // Ao sair da fase, a carga corrente passa a ser a desta etapa de saída,
          // que vira a entrada da próxima fase.
          if (isSaida) {
            cargaDbo = dboNum
            cargaDqo = dqoNum
            cargaVol = volNum
          }

          const row: SchemaRow = {
            filial: unidade.filial,
            mes_emissao: mes,
            tipo_efluente: unidade.tipo,
            fase,
            etapa: `${efl2(e + 1)} · ${etapaLabel}`,
            tratamento: unidade.tratamento,
            disposicao_final: unidade.disposicao,
            dbo: isSaida && abaixoDeteccao ? '< 2' : fmtMgL(dboNum),
            dbo_unidade: 'mg/L',
            dqo: fmtMgL(dqoNum),
            dqo_unidade: 'mg/L',
            n2: n2Medido ? fmtMgL(90 - frac * 55 + ((i * 7) % 20)) : '—',
            n2_unidade: n2Medido ? 'kgN/m³' : '—',
            volume: volNum.toLocaleString('pt-BR'),
            volume_unidade: 'm³',
            periodo: mes,
            responsavel: unidade.responsavel,
          }

          if (i % 17 === 3) {
            row.volume = ''
            row._cellStatus = { volume: 'error' }
          } else if (i % 23 === 7) {
            // DBO sobe em vez de cair na fase — eficiência negativa, inconsistente.
            row.dbo = fmtMgL(dboFaseEnt * 1.05)
            row._cellStatus = { dbo: 'warning' }
          } else if (i % 31 === 5) {
            row._cellStatus = { n2: 'warning' }
          } else if (i % 29 === 11) {
            row._cellStatus = { tratamento: 'warning' }
          }

          rows.push(row)
        }
      }
    }
  }
  return rows
}

// ── Transporte (escopo 3) — Aéreo & Hidroviário, Upstream/Downstream ─────────
// Frete contratado: peso da carga × distância da rota → tCO₂e (mock). A tabela é
// a MESMA por modal; up/downstream só muda rótulo/ícone/vocabulário, não as
// colunas nem os dados. Builders parametrizados por modal compartilham a base.
const TR_ROTAS_AEREO = [
  { partida: 'GRU - São Paulo', destino: 'GIG - Rio de Janeiro' },
  { partida: 'VCP - Campinas', destino: 'CNF - Belo Horizonte' },
  { partida: 'GRU - São Paulo', destino: 'MIA - Miami' },
  { partida: 'BSB - Brasília', destino: 'REC - Recife' },
  { partida: 'GRU - São Paulo', destino: 'LIS - Lisboa' },
  { partida: 'POA - Porto Alegre', destino: 'GRU - São Paulo' },
]
const TR_ROTAS_HIDRO = [
  { partida: 'Porto de Santos', destino: 'Porto de Roterdã' },
  { partida: 'Porto de Paranaguá', destino: 'Porto de Xangai' },
  { partida: 'Porto de Itajaí', destino: 'Porto de Santos' },
  { partida: 'Porto de Suape', destino: 'Porto de Hamburgo' },
  { partida: 'Porto do Rio Grande', destino: 'Porto de Buenos Aires' },
  { partida: 'Porto de Vitória', destino: 'Porto de Roterdã' },
]
const TR_TIPOS_NAVIO = ['Graneleiro', 'Carga geral', 'Porta-contêineres', 'Ro-Ro', 'Cruzeiro', 'Refrigerado']
const TR_TAMANHOS_NAVIO = ['Handysize', 'Handymax', 'Panamax', 'Aframax', 'Suezmax', 'Capesize']

// Peso da carga (kg ou ton) + distância da rota → tCO₂e. Fatores aéreo ≫ hidro.
function buildTransporteAereo(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const rota = TR_ROTAS_AEREO[i % TR_ROTAS_AEREO.length]
    const usaTon = i % 4 === 0
    const pesoKg = 200 + ((i * 137) % 48000)
    const pesoNum = usaTon ? pesoKg / 1000 : pesoKg
    const distKm = 350 + ((i * 211) % 9000)
    // Fator frete aéreo ~0,5 kgCO₂e/(ton·km).
    const tco2eNum = ((pesoKg / 1000) * distKm * 0.5) / 1000

    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      identificador: `AWB-${String(10000 + i * 17).slice(-5)}`,
      aeroporto_partida: rota.partida,
      aeroporto_destino: rota.destino,
      peso: pesoNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      unidade: usaTon ? 'ton' : 'kg',
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: '0,50 kgCO₂e/ton·km',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }

    if (i % 17 === 3) {
      row.peso = ''
      row.tco2e = ''
      row._cellStatus = { peso: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { aeroporto_destino: 'warning' }
    } else if (i % 29 === 11) {
      row._cellStatus = { unidade: 'warning' }
    }

    rows.push(row)
  }
  return rows
}

function buildTransporteHidro(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const rota = TR_ROTAS_HIDRO[i % TR_ROTAS_HIDRO.length]
    const usaTon = i % 3 !== 0
    const pesoKg = 5000 + ((i * 173) % 980000)
    const pesoNum = usaTon ? pesoKg / 1000 : pesoKg
    const distKm = 800 + ((i * 311) % 18000)
    // Fator frete marítimo ~0,015 kgCO₂e/(ton·km) — muito mais eficiente que aéreo.
    const tco2eNum = ((pesoKg / 1000) * distKm * 0.015) / 1000

    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      identificador: `BL-${String(100000 + i * 37).slice(-6)}`,
      porto_partida: rota.partida,
      porto_destino: rota.destino,
      peso: pesoNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      unidade: usaTon ? 'ton' : 'kg',
      tipo_navio: TR_TIPOS_NAVIO[i % TR_TIPOS_NAVIO.length],
      tamanho_navio: TR_TAMANHOS_NAVIO[i % TR_TAMANHOS_NAVIO.length],
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: '0,015 kgCO₂e/ton·km',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }

    if (i % 17 === 3) {
      row.peso = ''
      row.tco2e = ''
      row._cellStatus = { peso: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { porto_destino: 'warning' }
    } else if (i % 31 === 5) {
      row._cellStatus = { tipo_navio: 'warning' }
    } else if (i % 29 === 11) {
      row._cellStatus = { unidade: 'warning' }
    }

    rows.push(row)
  }
  return rows
}

// Colunas compartilhadas pelos schemas up/downstream de cada modal — a tabela é
// idêntica nas duas direções.
function transporteAereoColumns(): SchemaColumn[] {
  return [
    { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
    { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
    { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da entrega/rota/transportadora.' },
    { id: 'aeroporto_partida', title: 'Aeroporto de Partida', width: 220, description: 'Aeroporto de origem/partida (cidade ou código IATA).' },
    { id: 'aeroporto_destino', title: 'Aeroporto de Destino', width: 220, description: 'Aeroporto de destino/chegada (cidade ou código IATA).' },
    { id: 'peso', title: 'Peso', width: 130, description: 'Peso da carga transportada.' },
    { id: 'unidade', title: 'Unidade de Medida', width: 160, type: 'bubble', options: ['ton', 'kg', 'g'], description: 'Unidade de medida do peso (toneladas, kg, etc.).' },
  ]
}

function transporteHidroColumns(): SchemaColumn[] {
  return [
    { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
    { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
    { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da entrega/rota/transportadora.' },
    { id: 'porto_partida', title: 'Porto de Partida', width: 200, description: 'Porto de origem/partida (cidade ou código).' },
    { id: 'porto_destino', title: 'Porto de Destino', width: 200, description: 'Porto de destino/chegada (cidade ou código).' },
    { id: 'peso', title: 'Peso', width: 130, description: 'Peso da carga transportada.' },
    { id: 'unidade', title: 'Unidade de Medida', width: 160, type: 'bubble', options: ['ton', 'kg', 'g'], description: 'Unidade de medida do peso (toneladas, kg, etc.).' },
    { id: 'tipo_navio', title: 'Tipo de Navio', width: 200, type: 'bubble', options: ['Graneleiro', 'Carga geral', 'Porta-contêineres', 'Ro-Ro', 'Cruzeiro', 'Refrigerado'], description: 'Tipo de navio (graneleiro, carga geral, porta-contêineres, Ro-Ro, cruzeiro, refrigerado).' },
    { id: 'tamanho_navio', title: 'Tamanho do Navio', width: 170, type: 'bubble', options: ['Handysize', 'Handymax', 'Panamax', 'Aframax', 'Suezmax', 'Capesize'], description: 'Tamanho do navio utilizado.' },
  ]
}

// ── Transporte Rodoviário (escopo 3) — Upstream/Downstream ───────────────────
// Frete rodoviário contratado. Reaproveita a frota/combustíveis da Combustão
// Móvel (cmBase), mas é transporte de carga: acrescenta peso + tipo de frete. 3
// abas (litros / distância / origem→destino) idênticas nas duas direções; up/down
// só muda rótulo/ícone/vocabulário.
const TR_RODO_FRETES = ['Fracionado', 'Dedicado']
const TR_RODO_ENDERECOS = [
  'Av. Paulista, 1000 - São Paulo/SP',
  'Rod. Anhanguera, km 25 - Jundiaí/SP',
  'Rua das Indústrias, 450 - Guarulhos/SP',
  'Av. das Nações, 200 - Campinas/SP',
  'Porto de Santos - Santos/SP',
  'Rod. Dutra, km 160 - Rio de Janeiro/RJ',
  'Distrito Industrial - Cajamar/SP',
  'Av. Brasil, 3000 - Belo Horizonte/MG',
  'Centro de Distribuição - Recife/PE',
]

function trRodoBase(i: number) {
  const b = cmBase(i)
  const pesoKg = 500 + ((i * 197) % 42000)
  const usaTon = i % 4 === 0
  return {
    ...b,
    identificador: `CTE-${String(100000 + i * 37).slice(-6)}`,
    peso: (usaTon ? pesoKg / 1000 : pesoKg).toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
    unidadePeso: usaTon ? 'ton' : 'kg',
    tipoFrete: TR_RODO_FRETES[i % TR_RODO_FRETES.length],
  }
}

function buildTransporteRodoLitros(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = trRodoBase(i)
    const consumoNum = 500 + ((i * 137) % 28000)
    const tco2eNum = (consumoNum * b.comb.mult) / 1000

    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificador: b.identificador,
      consumo: consumoNum.toLocaleString('pt-BR'),
      unidade: b.comb.nome === 'GNV' ? 'm³' : 'litros',
      tipo_combustivel: b.comb.nome,
      periodo: b.mes_emissao,
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }

    if (i % 17 === 3) {
      row.consumo = ''
      row.tco2e = ''
      row._cellStatus = { consumo: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { tipo_combustivel: 'warning' }
    } else if (i % 29 === 11) {
      row._cellStatus = { unidade: 'warning' }
    }

    rows.push(row)
  }
  return rows
}

function buildTransporteRodoDistancia(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = trRodoBase(i)
    const distNum = 1200 + ((i * 173) % 48000)
    const isMilhas = i % 11 === 0
    const tco2eNum = (distNum * b.comb.mult * 0.31) / 1000

    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificador: b.identificador,
      distancia: distNum.toLocaleString('pt-BR'),
      unidade_distancia: isMilhas ? 'milhas' : 'km',
      peso: b.peso,
      unidade_peso: b.unidadePeso,
      tipo_combustivel: b.comb.nome,
      tipo_veiculo: b.tipoVeiculo,
      tipo_frete: b.tipoFrete,
      periodo: b.mes_emissao,
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }

    if (i % 17 === 3) {
      row.distancia = ''
      row.tco2e = ''
      row._cellStatus = { distancia: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { tipo_combustivel: 'warning' }
    } else if (i % 31 === 5) {
      row.peso = ''
      row._cellStatus = { peso: 'error' }
    } else if (i % 29 === 11) {
      row._cellStatus = { tipo_frete: 'warning' }
    }

    rows.push(row)
  }
  return rows
}

function buildTransporteRodoEnderecos(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = trRodoBase(i)
    const kmNum = 800 + ((i * 211) % 32000)
    const tco2eNum = (kmNum * b.comb.mult * 0.31) / 1000

    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificador: b.identificador,
      endereco_partida: TR_RODO_ENDERECOS[i % TR_RODO_ENDERECOS.length],
      endereco_chegada: TR_RODO_ENDERECOS[(i + 3) % TR_RODO_ENDERECOS.length],
      peso: b.peso,
      unidade_peso: b.unidadePeso,
      tipo_combustivel: b.comb.nome,
      tipo_veiculo: b.tipoVeiculo,
      tipo_frete: b.tipoFrete,
      periodo: b.mes_emissao,
      km_calculado: kmNum.toLocaleString('pt-BR'),
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }

    if (i % 17 === 3) {
      row.endereco_chegada = ''
      row.tco2e = ''
      row._cellStatus = { endereco_chegada: 'error' }
    } else if (i % 23 === 7) {
      row._cellStatus = { tipo_combustivel: 'warning' }
    } else if (i % 31 === 5) {
      row.peso = ''
      row._cellStatus = { peso: 'error' }
    } else if (i % 29 === 11) {
      row._cellStatus = { tipo_frete: 'warning' }
    }

    rows.push(row)
  }
  return rows
}

const TR_RODO_COMBUSTIVEIS_OPT = ['Diesel S10', 'Diesel S500', 'Gasolina', 'Etanol', 'GNV', 'Biodiesel B10']
const TR_RODO_VEICULOS_OPT = ['Automóvel', 'Caminhão', 'Gerador', 'Utilitário', 'Van', 'Empilhadeira']

// Colunas compartilhadas pelas 3 abas dos schemas up/downstream rodoviário.
function transporteRodoLitrosColumns(): SchemaColumn[] {
  return [
    { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
    { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
    { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da entrega/rota/transportadora.' },
    { id: 'consumo', title: 'Litros Consumidos', width: 160, description: 'Quantidade de litros consumidos.' },
    { id: 'unidade', title: 'Unidade de Medida', width: 160, type: 'bubble', options: ['litros', 'm³', 'kg'], description: 'Unidade de medida (litros, m³, kg, etc.).' },
    { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 200, type: 'bubble', options: TR_RODO_COMBUSTIVEIS_OPT, description: 'Tipo de combustível utilizado.' },
  ]
}

function transporteRodoDistanciaColumns(): SchemaColumn[] {
  return [
    { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
    { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
    { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da entrega/rota/transportadora.' },
    { id: 'distancia', title: 'Distância', width: 130, description: 'Distância percorrida pelo veículo.' },
    { id: 'unidade_distancia', title: 'Unidade de Medida', width: 170, type: 'bubble', options: ['km', 'milhas', 'metros'], description: 'Unidade de medida da distância (metros, km, etc.).' },
    { id: 'peso', title: 'Peso', width: 130, description: 'Peso da carga transportada.' },
    { id: 'unidade_peso', title: 'Unidade de Medida', width: 170, type: 'bubble', options: ['ton', 'kg', 'g'], description: 'Unidade de medida do peso (toneladas, kg, etc.).' },
    { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 200, type: 'bubble', options: TR_RODO_COMBUSTIVEIS_OPT, description: 'Tipo de combustível utilizado.' },
    { id: 'tipo_veiculo', title: 'Tipo de Veículo', width: 160, type: 'bubble', options: TR_RODO_VEICULOS_OPT, description: 'Tipo de veículo utilizado.' },
    { id: 'tipo_frete', title: 'Tipo de Frete', width: 160, type: 'bubble', options: TR_RODO_FRETES, description: 'Tipo de frete (fracionado ou dedicado).' },
  ]
}

function transporteRodoEnderecosColumns(): SchemaColumn[] {
  return [
    { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
    { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
    { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da entrega/rota/transportadora.' },
    { id: 'endereco_partida', title: 'Endereço de Partida', width: 240, description: 'Endereço de origem/partida (CEP, rua, cidade ou estado).' },
    { id: 'endereco_chegada', title: 'Endereço de Chegada', width: 240, description: 'Endereço de destino/chegada (CEP, rua, cidade ou estado).' },
    { id: 'peso', title: 'Peso', width: 130, description: 'Peso da carga transportada.' },
    { id: 'unidade_peso', title: 'Unidade de Medida', width: 170, type: 'bubble', options: ['ton', 'kg', 'g'], description: 'Unidade de medida do peso (toneladas, kg, etc.).' },
    { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 200, type: 'bubble', options: TR_RODO_COMBUSTIVEIS_OPT, description: 'Tipo de combustível utilizado.' },
    { id: 'tipo_veiculo', title: 'Tipo de Veículo', width: 160, type: 'bubble', options: TR_RODO_VEICULOS_OPT, description: 'Tipo de veículo utilizado.' },
    { id: 'tipo_frete', title: 'Tipo de Frete', width: 160, type: 'bubble', options: TR_RODO_FRETES, description: 'Tipo de frete (fracionado ou dedicado).' },
  ]
}

// As 3 abas (litros/distância/origem→destino) são idênticas nas duas direções —
// fábrica única reutilizada por upstream e downstream.
function transporteRodoSchemas(idSuffix: string): TableSchema[] {
  return [
    { id: `rodo-litros-${idSuffix}`, label: 'Por litros', columns: transporteRodoLitrosColumns(), rows: buildTransporteRodoLitros() },
    { id: `rodo-distancia-${idSuffix}`, label: 'Por distância', columns: transporteRodoDistanciaColumns(), rows: buildTransporteRodoDistancia() },
    { id: `rodo-enderecos-${idSuffix}`, label: 'Origem → Destino', columns: transporteRodoEnderecosColumns(), rows: buildTransporteRodoEnderecos() },
  ]
}

// ── Viagens a Negócios (escopo 3) — 6 modais ─────────────────────────────────
// Deslocamento de funcionários a trabalho. 6 abas: rodoviário (litros/distância/
// origem→destino), aéreo, e coletivo (distância/origem→destino — metrô/trem/ônibus).
// Reusa frota/combustíveis da Combustão Móvel (cmBase) no rodoviário. tCO₂e mock.
const VN_AEROPORTOS = [
  { partida: 'GRU - São Paulo', destino: 'GIG - Rio de Janeiro' },
  { partida: 'VCP - Campinas', destino: 'CNF - Belo Horizonte' },
  { partida: 'GRU - São Paulo', destino: 'MIA - Miami' },
  { partida: 'BSB - Brasília', destino: 'REC - Recife' },
  { partida: 'GRU - São Paulo', destino: 'LIS - Lisboa' },
  { partida: 'POA - Porto Alegre', destino: 'GRU - São Paulo' },
]
const VN_COLETIVO_VEICULOS = ['Metrô', 'Trem', 'Ônibus intermunicipal', 'Ônibus urbano', 'BRT', 'VLT']

function vnRodoLitros(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = cmBase(i)
    const consumoNum = 500 + ((i * 137) % 28000)
    const tco2eNum = (consumoNum * b.comb.mult) / 1000
    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificador: b.identificador,
      consumo: consumoNum.toLocaleString('pt-BR'),
      unidade: b.comb.nome === 'GNV' ? 'm³' : 'litros',
      tipo_combustivel: b.comb.nome,
      periodo: b.mes_emissao,
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }
    if (i % 17 === 3) { row.consumo = ''; row.tco2e = ''; row._cellStatus = { consumo: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { tipo_combustivel: 'warning' } }
    else if (i % 29 === 11) { row._cellStatus = { unidade: 'warning' } }
    rows.push(row)
  }
  return rows
}

function vnRodoDistancia(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = cmBase(i)
    const distNum = 1200 + ((i * 173) % 48000)
    const isMilhas = i % 11 === 0
    const tco2eNum = (distNum * b.comb.mult * 0.31) / 1000
    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificador: b.identificador,
      distancia: distNum.toLocaleString('pt-BR'),
      unidade: isMilhas ? 'milhas' : 'km',
      tipo_combustivel: b.comb.nome,
      tipo_veiculo: b.tipoVeiculo,
      periodo: b.mes_emissao,
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }
    if (i % 17 === 3) { row.distancia = ''; row.tco2e = ''; row._cellStatus = { distancia: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { tipo_combustivel: 'warning' } }
    else if (i % 29 === 11) { row._cellStatus = { unidade: 'warning' } }
    rows.push(row)
  }
  return rows
}

function vnRodoEnderecos(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = cmBase(i)
    const kmNum = 800 + ((i * 211) % 32000)
    const tco2eNum = (kmNum * b.comb.mult * 0.31) / 1000
    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificador: b.identificador,
      endereco_partida: TR_RODO_ENDERECOS[i % TR_RODO_ENDERECOS.length],
      endereco_chegada: TR_RODO_ENDERECOS[(i + 3) % TR_RODO_ENDERECOS.length],
      tipo_combustivel: b.comb.nome,
      tipo_veiculo: b.tipoVeiculo,
      periodo: b.mes_emissao,
      km_calculado: kmNum.toLocaleString('pt-BR'),
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }
    if (i % 17 === 3) { row.endereco_chegada = ''; row.tco2e = ''; row._cellStatus = { endereco_chegada: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { tipo_combustivel: 'warning' } }
    else if (i % 29 === 11) { row._cellStatus = { endereco_partida: 'warning' } }
    rows.push(row)
  }
  return rows
}

function vnAereo(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const rota = VN_AEROPORTOS[i % VN_AEROPORTOS.length]
    const distKm = 350 + ((i * 211) % 9000)
    // Fator passageiro·km aéreo ~0,18 kgCO₂e/(pax·km).
    const tco2eNum = (distKm * 0.18) / 1000
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      identificador: `BILH-${String(10000 + i * 17).slice(-5)}`,
      aeroporto_partida: rota.partida,
      aeroporto_destino: rota.destino,
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: '0,18 kgCO₂e/pax·km',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.aeroporto_destino = ''; row.tco2e = ''; row._cellStatus = { aeroporto_destino: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { aeroporto_partida: 'warning' } }
    rows.push(row)
  }
  return rows
}

function vnColetivoDistancia(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const distNum = 5 + ((i * 73) % 320)
    const isMilhas = i % 11 === 0
    const funcionarios = 1 + ((i * 7) % 40)
    // Fator transporte coletivo ~0,04 kgCO₂e/(pax·km).
    const tco2eNum = (distNum * funcionarios * 0.04) / 1000
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      identificador: `VG-${String(1000 + i * 13).slice(-4)}`,
      funcionarios: String(funcionarios),
      distancia: distNum.toLocaleString('pt-BR'),
      unidade: isMilhas ? 'milhas' : 'km',
      tipo_veiculo: VN_COLETIVO_VEICULOS[i % VN_COLETIVO_VEICULOS.length],
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: '0,04 kgCO₂e/pax·km',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.distancia = ''; row.tco2e = ''; row._cellStatus = { distancia: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { funcionarios: 'warning' } }
    else if (i % 29 === 11) { row._cellStatus = { tipo_veiculo: 'warning' } }
    rows.push(row)
  }
  return rows
}

function vnColetivoEnderecos(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const funcionarios = 1 + ((i * 7) % 40)
    const kmNum = 5 + ((i * 53) % 280)
    const tco2eNum = (kmNum * funcionarios * 0.04) / 1000
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      identificador: `VG-${String(1000 + i * 13).slice(-4)}`,
      funcionarios: String(funcionarios),
      endereco_partida: TR_RODO_ENDERECOS[i % TR_RODO_ENDERECOS.length],
      endereco_chegada: TR_RODO_ENDERECOS[(i + 3) % TR_RODO_ENDERECOS.length],
      tipo_veiculo: VN_COLETIVO_VEICULOS[i % VN_COLETIVO_VEICULOS.length],
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      km_calculado: kmNum.toLocaleString('pt-BR'),
      fator: '0,04 kgCO₂e/pax·km',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.endereco_chegada = ''; row.tco2e = ''; row._cellStatus = { endereco_chegada: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { funcionarios: 'warning' } }
    else if (i % 29 === 11) { row._cellStatus = { tipo_veiculo: 'warning' } }
    rows.push(row)
  }
  return rows
}

// ── Combustão Estacionária (escopo 1) ────────────────────────────────────────
// Combustível queimado em equipamentos fixos (caldeira, forno, gerador). Consumo
// × fator → tCO₂e (mock). 1 aba.
const CE_COMBUSTIVEIS = [
  { nome: 'Gás Natural', unidade: 'm³', fator: '2,02 kg/m³', mult: 2.02 },
  { nome: 'GLP', unidade: 'kg', fator: '2,93 kg/kg', mult: 2.93 },
  { nome: 'Diesel S10', unidade: 'litros', fator: '2,67 kg/L', mult: 2.67 },
  { nome: 'Óleo Combustível', unidade: 'litros', fator: '3,11 kg/L', mult: 3.11 },
  { nome: 'Lenha', unidade: 'ton', fator: '1.580 kg/t', mult: 1580 },
  { nome: 'Carvão Mineral', unidade: 'ton', fator: '2.420 kg/t', mult: 2420 },
]
const CE_FONTES = [
  'Caldeira', 'Forno industrial', 'Gerador a diesel', 'Aquecedor de processo',
  'Secador', 'Fornalha', 'Estufa', 'Turbina',
]

function buildCombustaoEstacionaria(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const comb = CE_COMBUSTIVEIS[i % CE_COMBUSTIVEIS.length]
    const qtdNum = 50 + ((i * 113) % 24000)
    const tco2eNum = (qtdNum * comb.mult) / 1000
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      quantidade: qtdNum.toLocaleString('pt-BR'),
      unidade: comb.unidade,
      tipo_combustivel: comb.nome,
      fonte_emissao: CE_FONTES[i % CE_FONTES.length],
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.quantidade = ''; row.tco2e = ''; row._cellStatus = { quantidade: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { tipo_combustivel: 'warning' } }
    else if (i % 31 === 5) { row._cellStatus = { fonte_emissao: 'warning' } }
    else if (i % 29 === 11) { row._cellStatus = { unidade: 'warning' } }
    rows.push(row)
  }
  return rows
}

// ── Emissões Fugitivas (escopo 1) ────────────────────────────────────────────
// Liberação não-intencional de gases (recarga de refrigerante, extintor, SF₆).
// Quantidade × GWP → tCO₂e (mock). 1 aba.
const EF_GASES = [
  { nome: 'R-410A (HFC)', gwp: 2088 },
  { nome: 'R-134a (HFC)', gwp: 1430 },
  { nome: 'R-32 (HFC)', gwp: 675 },
  { nome: 'R-404A (HFC)', gwp: 3922 },
  { nome: 'SF₆', gwp: 23500 },
  { nome: 'CO₂ (extintor)', gwp: 1 },
  { nome: 'PFC-14 (CF₄)', gwp: 6630 },
]
const EF_FONTES = [
  'Ar-condicionado', 'Câmara fria', 'Chiller', 'Extintor de incêndio',
  'Disjuntor de alta tensão', 'Refrigerador comercial', 'Split corporativo',
]

function buildEmissoesFugitivas(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const gas = EF_GASES[i % EF_GASES.length]
    const usaG = i % 4 === 0
    const qtdKg = 0.5 + ((i * 7) % 60) + ((i * 13) % 100) / 100
    const qtdNum = usaG ? qtdKg * 1000 : qtdKg
    const tco2eNum = (qtdKg * gas.gwp) / 1000
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      fonte_emissao: EF_FONTES[i % EF_FONTES.length],
      gas: gas.nome,
      quantidade: qtdNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      unidade: usaG ? 'g' : 'kg',
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: `GWP ${gas.gwp.toLocaleString('pt-BR')}`,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.quantidade = ''; row.tco2e = ''; row._cellStatus = { quantidade: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { gas: 'warning' } }
    else if (i % 31 === 5) { row._cellStatus = { fonte_emissao: 'warning' } }
    else if (i % 29 === 11) { row._cellStatus = { unidade: 'warning' } }
    rows.push(row)
  }
  return rows
}

// ── Atividades Agrícolas: Manejo de Solo (escopo 1) ──────────────────────────
// 3 abas: fertilizantes (N aplicado → N₂O), arroz (cultivo alagado → CH₄),
// palhada (resíduo de cultura → N₂O). tCO₂e mock por quantidade·fator.
const AG_FERTILIZANTES = [
  { nome: 'Ureia', n: 45 },
  { nome: 'Calcário', n: 0 },
  { nome: 'Sulfato de amônio', n: 21 },
  { nome: 'Nitrato de amônio', n: 34 },
  { nome: 'MAP', n: 11 },
  { nome: 'DAP', n: 18 },
]
const AG_MANEJO_AGUA = ['Sequeiro', 'Irrigado', 'Alimentado por chuva', 'Água profunda']
const AG_CULTURAS = ['Soja', 'Milho', 'Feijão', 'Arroz', 'Trigo', 'Cana']
// Categorias de pastagem (fermentação entérica), espelha o anexo.
const AG_CATEGORIAS_PASTAGEM = [
  'Jovens <1 ano', 'Jovens 1–2 anos', 'Fêmeas >2 anos', 'Machos >2 anos', 'Reprodutores',
]

function buildAgFertilizantes(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const fert = AG_FERTILIZANTES[i % AG_FERTILIZANTES.length]
    const qtdNum = 100 + ((i * 137) % 48000)
    // N₂O do N aplicado: N · 1% · 44/28 · GWP 273 (mock simplificado).
    const nKg = (qtdNum * fert.n) / 100
    const tco2eNum = (nKg * 0.01 * (44 / 28) * 273) / 1000
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      tipo_fertilizante: fert.nome,
      quantidade: qtdNum.toLocaleString('pt-BR') + ' kg',
      perc_nitrogenio: `${fert.n}%`,
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: 'N₂O · 1% N · GWP 273',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.quantidade = ''; row.tco2e = ''; row._cellStatus = { quantidade: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { tipo_fertilizante: 'warning' } }
    else if (i % 29 === 11) { row._cellStatus = { perc_nitrogenio: 'warning' } }
    rows.push(row)
  }
  return rows
}

function buildAgArroz(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const areaNum = 2 + ((i * 31) % 900)
    const manejo = AG_MANEJO_AGUA[i % AG_MANEJO_AGUA.length]
    const matOrgNum = 1 + ((i * 17) % 12)
    // CH₄ do arroz alagado: área · fator/ha (irrigado emite mais que sequeiro).
    const fatorHa = manejo === 'Irrigado' || manejo === 'Água profunda' ? 1.3 : 0.4
    const tco2eNum = areaNum * fatorHa
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      area: areaNum.toLocaleString('pt-BR'),
      manejo_agua: manejo,
      quantidade: `${matOrgNum.toLocaleString('pt-BR')} ton/ha`,
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: `${fatorHa.toLocaleString('pt-BR')} tCO₂e/ha`,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.area = ''; row.tco2e = ''; row._cellStatus = { area: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { manejo_agua: 'warning' } }
    else if (i % 29 === 11) { row._cellStatus = { quantidade: 'warning' } }
    rows.push(row)
  }
  return rows
}

function buildAgPalhada(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const cultura = AG_CULTURAS[i % AG_CULTURAS.length]
    const prodNum = 1 + ((i * 23) % 40)
    // Resíduo de cultura → N₂O: produção · fator (mock).
    const tco2eNum = prodNum * 0.45
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      tipo_cultura: cultura,
      quantidade: `${prodNum.toLocaleString('pt-BR')} ton/ha`,
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: '0,45 tCO₂e/ton',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.quantidade = ''; row.tco2e = ''; row._cellStatus = { quantidade: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { tipo_cultura: 'warning' } }
    rows.push(row)
  }
  return rows
}

// ── Atividades Agrícolas: Fermentação Entérica (escopo 1) ─────────────────────
// CH₄ da digestão do rebanho. 2 abas: pastagem (por categoria animal) e
// confinamento (só headcount). tCO₂e mock por cabeça·fator.
function buildAgPastagem(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const cabecasNum = 10 + ((i * 137) % 4800)
    // Fator CH₄ por categoria: adultos emitem mais que jovens (mock, tCO₂e/cabeça/ano).
    const cat = AG_CATEGORIAS_PASTAGEM[i % AG_CATEGORIAS_PASTAGEM.length]
    const fatorCabeca = cat.startsWith('Jovens') ? 1.1 : 2.4
    const tco2eNum = (cabecasNum * fatorCabeca) / 1000
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      categoria_pastagem: cat,
      quantidade: `${cabecasNum.toLocaleString('pt-BR')} cabeças`,
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: `${fatorCabeca.toLocaleString('pt-BR')} tCO₂e/cabeça`,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.quantidade = ''; row.tco2e = ''; row._cellStatus = { quantidade: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { categoria_pastagem: 'warning' } }
    rows.push(row)
  }
  return rows
}

function buildAgConfinamento(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const cabecasNum = 20 + ((i * 173) % 6800)
    // Confinamento: dieta mais energética, fator por cabeça maior (mock).
    const tco2eNum = (cabecasNum * 2.9) / 1000
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      quantidade: `${cabecasNum.toLocaleString('pt-BR')} cabeças`,
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: '2,9 tCO₂e/cabeça',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.quantidade = ''; row.tco2e = ''; row._cellStatus = { quantidade: 'error' } }
    rows.push(row)
  }
  return rows
}

// ── Deslocamento Casa-Trabalho (escopo 3) ────────────────────────────────────
// Commuting dos colaboradores. 6 abas: deslocamento individual (distância/CEP) e
// fretado contratado (litros/distância/rota/rota-compartilhada). Colunas opcionais
// (tipo de combustível/veículo no fretado) ficam vazias em ~30% das linhas (det.).
const DCT_MEIOS_TRANSPORTE = [
  'Carro próprio', 'Moto', 'Ônibus', 'Metrô', 'Trem', 'Bicicleta', 'A pé', 'Carona',
]
const DCT_COMBUSTIVEIS = ['Gasolina', 'Etanol', 'Diesel S10', 'GNV', 'Flex', '—']
const DCT_VEICULOS_FRETADO = ['Ônibus', 'Micro-ônibus', 'Van', 'Van executiva']
const DCT_CEPS = [
  '01310-100', '04543-000', '20040-002', '30130-005', '13010-111',
  '07750-000', '50030-230', '11013-551', '88301-303', '90010-150',
]
const DCT_ROTAS = [
  'Rota Centro → Matriz SP', 'Rota Zona Sul → CD Guarulhos', 'Rota Litoral → Loja Santos',
  'Rota Norte → Fábrica Campinas', 'Rota Leste → CD Cajamar', 'Rota Oeste → Filial BH',
]
// Combustível "opcional" — vazio em ~30% das linhas (det. por índice).
function dctOpt(value: string, i: number): string {
  return i % 10 < 3 ? '' : value
}

function buildDctFuncDistancia(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const distNum = 2 + ((i * 31) % 80)
    const meses = 1 + (i % 12)
    const diasSemana = 1 + (i % 5)
    const comb = DCT_COMBUSTIVEIS[i % DCT_COMBUSTIVEIS.length]
    // Commuting: dist · dias · meses · fator carro (mock).
    const tco2eNum = (distNum * 2 * diasSemana * 4 * meses * 0.17) / 1000
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      identificacao: `COLAB-${String(1000 + i * 13).slice(-4)}`,
      distancia: distNum.toLocaleString('pt-BR'),
      unidade: i % 11 === 0 ? 'milhas' : 'km',
      meses_trabalhados: String(meses),
      dias_semana: String(diasSemana),
      meio_transporte: DCT_MEIOS_TRANSPORTE[i % DCT_MEIOS_TRANSPORTE.length],
      tipo_combustivel: comb,
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: '0,17 kgCO₂e/km',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.distancia = ''; row.tco2e = ''; row._cellStatus = { distancia: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { meio_transporte: 'warning' } }
    else if (i % 29 === 11) { row._cellStatus = { unidade: 'warning' } }
    rows.push(row)
  }
  return rows
}

function buildDctFuncEndereco(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const meses = 1 + (i % 12)
    const diasSemana = 1 + (i % 5)
    // Sistema calcula a distância pelo CEP; tCO₂e estimado (mock).
    const distEst = 3 + ((i * 17) % 70)
    const tco2eNum = (distEst * 2 * diasSemana * 4 * meses * 0.17) / 1000
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      identificacao: `COLAB-${String(1000 + i * 13).slice(-4)}`,
      cep_colaborador: DCT_CEPS[i % DCT_CEPS.length],
      meses_trabalhados: String(meses),
      dias_semana: String(diasSemana),
      meio_transporte: DCT_MEIOS_TRANSPORTE[i % DCT_MEIOS_TRANSPORTE.length],
      tipo_combustivel: DCT_COMBUSTIVEIS[i % DCT_COMBUSTIVEIS.length],
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: '0,17 kgCO₂e/km',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.cep_colaborador = ''; row.tco2e = ''; row._cellStatus = { cep_colaborador: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { meio_transporte: 'warning' } }
    rows.push(row)
  }
  return rows
}

function buildDctFretadoLitros(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = cmBase(i)
    const consumoNum = 500 + ((i * 137) % 28000)
    const tco2eNum = (consumoNum * b.comb.mult) / 1000
    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificador: b.identificador,
      consumo: consumoNum.toLocaleString('pt-BR'),
      unidade: b.comb.nome === 'GNV' ? 'm³' : 'litros',
      tipo_combustivel: b.comb.nome,
      tipo_veiculo: dctOpt(DCT_VEICULOS_FRETADO[i % DCT_VEICULOS_FRETADO.length], i),
      periodo: b.mes_emissao,
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }
    if (i % 17 === 3) { row.consumo = ''; row.tco2e = ''; row._cellStatus = { consumo: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { tipo_combustivel: 'warning' } }
    else if (i % 29 === 11) { row._cellStatus = { unidade: 'warning' } }
    rows.push(row)
  }
  return rows
}

function buildDctFretadoDistancia(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = cmBase(i)
    const distNum = 1200 + ((i * 173) % 48000)
    const tco2eNum = (distNum * b.comb.mult * 0.31) / 1000
    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificador: b.identificador,
      distancia: distNum.toLocaleString('pt-BR'),
      unidade: i % 11 === 0 ? 'milhas' : 'km',
      tipo_combustivel: dctOpt(b.comb.nome, i),
      tipo_veiculo: dctOpt(DCT_VEICULOS_FRETADO[i % DCT_VEICULOS_FRETADO.length], i + 1),
      periodo: b.mes_emissao,
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }
    if (i % 17 === 3) { row.distancia = ''; row.tco2e = ''; row._cellStatus = { distancia: 'error' } }
    else if (i % 29 === 11) { row._cellStatus = { unidade: 'warning' } }
    rows.push(row)
  }
  return rows
}

function buildDctFretadoEnderecos(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = cmBase(i)
    const diasSemana = 1 + (i % 5)
    const colaboradores = 5 + ((i * 7) % 40)
    const kmNum = 800 + ((i * 211) % 32000)
    const tco2eNum = (kmNum * b.comb.mult * 0.31) / 1000
    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificacao: DCT_ROTAS[i % DCT_ROTAS.length],
      enderecos_rota: DCT_CEPS[i % DCT_CEPS.length],
      dias_semana: String(diasSemana),
      colaboradores: String(colaboradores),
      tipo_veiculo: dctOpt(DCT_VEICULOS_FRETADO[i % DCT_VEICULOS_FRETADO.length], i),
      tipo_combustivel: dctOpt(b.comb.nome, i + 1),
      periodo: b.mes_emissao,
      km_calculado: kmNum.toLocaleString('pt-BR'),
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }
    if (i % 17 === 3) { row.enderecos_rota = ''; row.tco2e = ''; row._cellStatus = { enderecos_rota: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { colaboradores: 'warning' } }
    rows.push(row)
  }
  return rows
}

function buildDctFretadoCompartilhado(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const b = cmBase(i)
    const diasSemana = 1 + (i % 5)
    const distEst = 3 + ((i * 17) % 70)
    const tco2eNum = (distEst * 2 * diasSemana * 4 * b.comb.mult * 0.31) / 1000
    const row: SchemaRow = {
      filial: b.filial,
      mes_emissao: b.mes_emissao,
      identificacao: `COLAB-${String(1000 + i * 13).slice(-4)}`,
      cep_colaborador: DCT_CEPS[i % DCT_CEPS.length],
      dias_semana: String(diasSemana),
      tipo_combustivel: dctOpt(b.comb.nome, i),
      periodo: b.mes_emissao,
      fator: b.comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: b.responsavel,
    }
    if (i % 17 === 3) { row.cep_colaborador = ''; row.tco2e = ''; row._cellStatus = { cep_colaborador: 'error' } }
    else if (i % 23 === 7) { row._cellStatus = { dias_semana: 'warning' } }
    rows.push(row)
  }
  return rows
}

// ── Resíduos Sólidos (Compostagem) (escopo 1) ────────────────────────────────
// Resíduos orgânicos destinados à compostagem → CH₄ do processo. Colunas de
// metano/biogás recuperado e destino são opcionais (vazias em ~30% das linhas).
const RC_DESTINOS_BIOGAS = ['Queima em flare', 'Geração de energia', 'Venda', '—']

function buildResiduosCompostagem(): SchemaRow[] {
  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const qtdNum = 1 + ((i * 31) % 480)
    // CH₄ da compostagem: massa · fator (mock, tCO₂e/ton).
    const tco2eNum = qtdNum * 0.12
    const metanoNum = (qtdNum * (8 + (i % 12))) / 100
    const row: SchemaRow = {
      filial: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      mes_emissao: CM_PERIODOS[i % CM_PERIODOS.length],
      quantidade: qtdNum.toLocaleString('pt-BR'),
      unidade: i % 4 === 0 ? 'kg' : 'ton',
      metano: dctOpt(metanoNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }), i),
      unidade_metano: dctOpt(i % 3 === 0 ? 'kg' : 'm³', i),
      destino_biogas: dctOpt(RC_DESTINOS_BIOGAS[i % RC_DESTINOS_BIOGAS.length], i),
      periodo: CM_PERIODOS[i % CM_PERIODOS.length],
      fator: '0,12 tCO₂e/ton',
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel: CM_RESPONSAVEIS[i % CM_RESPONSAVEIS.length],
    }
    if (i % 17 === 3) { row.quantidade = ''; row.tco2e = ''; row._cellStatus = { quantidade: 'error' } }
    else if (i % 29 === 11) { row._cellStatus = { unidade: 'warning' } }
    rows.push(row)
  }
  return rows
}

// ── Resíduos (escopo 3) — tratados externamente ─────────────────────────────
// Resíduos gerados nas operações e destinados a tratamento externo. 1 linha =
// (filial × mês × categoria do resíduo). Cada categoria tem uma participação
// (%) no total de resíduos da filial — as % de uma filial somam ~100%. Metano/
// biogás e destino são opcionais (só fazem sentido p/ orgânico em aterro/compost.).
// Categoria do resíduo (A–M) + participação fixa (%) no mix da filial. Cada
// categoria vira uma coluna de porcentagem; a letra (A, B, C...) prefixa o
// título. "Outros (inertes)" é calculado automaticamente = 100 − soma das demais.
// `proc`/`fator` definem destinação e fator de emissão (mock, tCO₂e/ton).
const RES_MIX = [
  { letra: 'A', categoria: 'Papéis/Papelão', pct: 10, proc: 'Reciclagem', fator: 0.02 },
  { letra: 'B', categoria: 'Têxteis', pct: 4, proc: 'Aterro sanitário', fator: 0.25 },
  { letra: 'C', categoria: 'Alimentares', pct: 18, proc: 'Compostagem', fator: 0.12 },
  { letra: 'D', categoria: 'Madeira', pct: 6, proc: 'Reciclagem', fator: 0.05 },
  { letra: 'E', categoria: 'Jardim/Parque', pct: 8, proc: 'Compostagem', fator: 0.10 },
  { letra: 'F', categoria: 'Fraldas', pct: 5, proc: 'Aterro sanitário', fator: 0.30 },
  { letra: 'G', categoria: 'Borracha/Couro', pct: 3, proc: 'Incineração', fator: 0.40 },
  { letra: 'H', categoria: 'Lodo doméstico/de esgoto', pct: 7, proc: 'Aterro sanitário', fator: 0.35 },
  { letra: 'I', categoria: 'Lodo industrial', pct: 6, proc: 'Incineração', fator: 0.45 },
  { letra: 'J', categoria: 'Plásticos', pct: 20, proc: 'Reciclagem', fator: 0.03 },
  { letra: 'K', categoria: 'Resíduos de serviços de saúde', pct: 2, proc: 'Incineração', fator: 1.2 },
  { letra: 'L', categoria: 'Resíduos fósseis líquidos', pct: 3, proc: 'Incineração', fator: 0.9 },
  // M = inertes, calculado automaticamente (100 − soma das demais).
  { letra: 'M', categoria: 'Outros (inertes — calculado automaticamente)', pct: 100 - (10 + 4 + 18 + 6 + 8 + 5 + 3 + 7 + 6 + 20 + 2 + 3), proc: 'Aterro sanitário', fator: 0.0 },
]
const RES_PROCESSAMENTOS = ['Aterro sanitário', 'Incineração', 'Compostagem', 'Reciclagem']
// Cada categoria do mix vira uma COLUNA de porcentagem. O id é estável
// (`pct_0`, `pct_1`, ...) e o título mostra "Letra · Categoria".
const RES_PCT_COLS = RES_MIX.map((m, idx) => ({
  id: `pct_${idx}`,
  titulo: `${m.letra} · ${m.categoria}`,
  pct: m.pct,
}))

function buildResiduos(): SchemaRow[] {
  const rows: SchemaRow[] = []
  let seq = 0
  for (let m = 0; m < CM_PERIODOS.length && rows.length < 100; m++) {
    const mes = CM_PERIODOS[m]
    for (let u = 0; u < UNIDADES_EMPRESA.length && rows.length < 100; u++) {
      // Total mensal de resíduos da filial (ton) — varia por filial/mês, estável.
      const totalTon = 8 + (((u * 5 + m) * 13) % 60)
      for (const mix of RES_MIX) {
        if (rows.length >= 100) break
        const i = seq++
        const qtdNum = (totalTon * mix.pct) / 100
        // Metano só p/ orgânico em compostagem/aterro (recuperação de biogás).
        const temBiogas = mix.proc === 'Compostagem' || mix.proc === 'Aterro sanitário'
        const metanoNum = temBiogas ? (qtdNum * (8 + (i % 12))) / 100 : 0
        const tco2eNum = qtdNum * mix.fator

        const row: SchemaRow = {
          filial: UNIDADES_EMPRESA[u],
          mes_emissao: mes,
          quantidade: qtdNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
          unidade: 'ton',
          processamento: mix.proc,
          metano: temBiogas ? dctOpt(metanoNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }), i) : '—',
          unidade_metano: temBiogas ? dctOpt(i % 3 === 0 ? 'kg' : 'm³', i) : '—',
          destino_biogas: temBiogas ? dctOpt(RC_DESTINOS_BIOGAS[i % RC_DESTINOS_BIOGAS.length], i) : '—',
          periodo: mes,
          fator: `${mix.fator.toLocaleString('pt-BR')} tCO₂e/ton`,
          tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
          responsavel: CM_RESPONSAVEIS[u % CM_RESPONSAVEIS.length],
        }
        // Uma coluna de % por categoria — o mix completo da filial, repetido em
        // toda linha (cada categoria é uma coluna fixa A, B, C...).
        for (const col of RES_PCT_COLS) {
          row[col.id] = `${col.pct}%`
        }

        if (i % 17 === 3) {
          row.quantidade = ''
          row.tco2e = ''
          row._cellStatus = { quantidade: 'error' }
        } else if (i % 23 === 7) {
          row._cellStatus = { pct_1: 'warning' }
        } else if (i % 31 === 5) {
          row._cellStatus = { processamento: 'warning' }
        } else if (i % 29 === 11) {
          row._cellStatus = { pct_0: 'warning' }
        }

        rows.push(row)
      }
    }
  }
  return rows
}

export const CATEGORIES: EmissionCategory[] = [
  {
    id: 'agricola-manejo-solo',
    label: 'Atividades Agrícolas (Manejo de Solo)',
    icon: Wheat,
    scope: 1,
    hint: 'Envie o manejo de solo: fertilizantes (N aplicado), cultivo de arroz ou palhada/resíduo de cultura.',
    initialChat: [
      {
        id: 'ams-1',
        role: 'assistant',
        content: 'Categoria de Atividades Agrícolas (Manejo de Solo) ativa. Envie dados de fertilizantes, arroz ou palhada.',
        timestamp: t(48),
      },
    ],
    schemas: [
      {
        id: 'fertilizantes',
        label: 'Fertilizantes',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'tipo_fertilizante', title: 'Tipo de Fertilizante', width: 220, type: 'bubble', options: AG_FERTILIZANTES.map((f) => f.nome), description: 'Tipo de fertilizante (ureia, calcário, sulfato de amônio, nitrato de amônio, MAP, DAP, etc.).' },
          { id: 'quantidade', title: 'Quantidade', width: 160, description: 'Quantidade total consumida do fertilizante.' },
          { id: 'perc_nitrogenio', title: '% Nitrogênio', width: 150, description: 'Porcentagem (%) de nitrogênio no fertilizante.' },
        ],
        rows: buildAgFertilizantes(),
      },
      {
        id: 'arroz',
        label: 'Arroz',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'area', title: 'Área (ha)', width: 130, description: 'Área total (hectares) cultivada.' },
          { id: 'manejo_agua', title: 'Manejo da Água', width: 200, type: 'bubble', options: AG_MANEJO_AGUA, description: 'Regime do manejo de água (sequeiro, irrigado, alimentado por chuva, água profunda).' },
          { id: 'quantidade', title: 'Quantidade', width: 200, description: 'Quantidade de matéria orgânica aplicada no solo (ton/ha).' },
        ],
        rows: buildAgArroz(),
      },
      {
        id: 'palhada',
        label: 'Palhada',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'tipo_cultura', title: 'Tipo de Cultura (Palhada)', width: 220, type: 'bubble', options: AG_CULTURAS, description: 'Tipo de cultura (soja, milho, feijão, arroz, trigo, cana, etc.).' },
          { id: 'quantidade', title: 'Quantidade', width: 200, description: 'Produção total da cultura principal (ton/ha).' },
        ],
        rows: buildAgPalhada(),
      },
    ],
  },
  {
    id: 'agricola-fermentacao-enterica',
    label: 'Atividades Agrícolas (Fermentação Entérica)',
    icon: CowIcon,
    scope: 1,
    hint: 'Envie o rebanho por categoria: animais em pastagem ou em confinamento.',
    initialChat: [
      {
        id: 'afe-1',
        role: 'assistant',
        content: 'Categoria de Atividades Agrícolas (Fermentação Entérica) ativa. Envie o rebanho em pastagem ou confinamento.',
        timestamp: t(46),
      },
    ],
    schemas: [
      {
        id: 'pastagem',
        label: 'Pastagem',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'categoria_pastagem', title: 'Categoria da Pastagem', width: 260, type: 'bubble', options: AG_CATEGORIAS_PASTAGEM, description: 'Categoria animal (jovens <1 ano, jovens 1–2 anos, fêmeas >2 anos, machos >2 anos, reprodutores).' },
          { id: 'quantidade', title: 'Quantidade', width: 200, description: 'Quantidade de animais por categoria.' },
        ],
        rows: buildAgPastagem(),
      },
      {
        id: 'confinamento',
        label: 'Confinamento',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'quantidade', title: 'Quantidade', width: 200, description: 'Quantidade de animais em confinamento.' },
        ],
        rows: buildAgConfinamento(),
      },
    ],
  },
  {
    id: 'combustao-movel',
    label: 'Combustão Móvel (Rodoviário)',
    icon: Truck,
    scope: 1,
    hint: 'Envie consumos em litros, quilometragem percorrida ou rotas origem→destino da sua frota.',
    initialChat: [
      {
        id: 'cm-1',
        role: 'assistant',
        content: 'Categoria de Combustão Móvel (Rodoviário) ativa. Envie dados em litros, quilometragem ou pontos de origem/destino.',
        timestamp: t(60),
      },
    ],
    schemas: [
      {
        id: 'litros',
        label: 'Por litros',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da frota/veículo.' },
          { id: 'consumo', title: 'Consumo', width: 130, description: 'Quantidade de combustível consumido.' },
          { id: 'unidade', title: 'Unidade de medida', width: 150, type: 'bubble', options: ['litros', 'm³', 'kg'], description: 'Unidade de medida (litros, m³, kg, etc.).' },
          { id: 'tipo_combustivel', title: 'Tipo de combustível', width: 160, type: 'bubble', options: ['Diesel S10', 'Diesel S500', 'Gasolina', 'Etanol', 'GNV', 'Biodiesel B10'], description: 'Tipo de combustível utilizado.' },
          { id: 'tipo_veiculo', title: 'Tipo de veículo', width: 150, type: 'bubble', options: ['Automóvel', 'Caminhão', 'Gerador', 'Utilitário', 'Van', 'Empilhadeira'], description: 'Tipo de veículo utilizado.' },
          { id: 'ano_veiculo', title: 'Ano do veículo', width: 130, description: 'Ano de fabricação do veículo.' },
        ],
        rows: buildCombustaoMovelLitros(),
      },
      {
        id: 'km',
        label: 'Por quilometragem',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da frota/veículo.' },
          { id: 'distancia', title: 'Distância', width: 130, description: 'Distância percorrida pelo veículo.' },
          { id: 'unidade', title: 'Unidade de medida', width: 150, type: 'bubble', options: ['km', 'milhas', 'metros'], description: 'Unidade de medida da distância (metros, km, etc.).' },
          { id: 'tipo_combustivel', title: 'Tipo de combustível', width: 160, type: 'bubble', options: ['Diesel S10', 'Diesel S500', 'Gasolina', 'Etanol', 'GNV', 'Biodiesel B10'], description: 'Tipo de combustível utilizado.' },
          { id: 'tipo_veiculo', title: 'Tipo de veículo', width: 150, type: 'bubble', options: ['Automóvel', 'Caminhão', 'Gerador', 'Utilitário', 'Van', 'Empilhadeira'], description: 'Tipo de veículo utilizado.' },
          { id: 'ano_veiculo', title: 'Ano do veículo', width: 130, description: 'Ano de fabricação do veículo.' },
        ],
        rows: buildCombustaoMovelDistancia(),
      },
      {
        id: 'origem-destino',
        label: 'Origem → Destino',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da frota/veículo.' },
          { id: 'endereco_partida', title: 'Endereço de Partida', width: 240, description: 'Endereço de origem/partida (CEP, rua, cidade ou estado).' },
          { id: 'endereco_chegada', title: 'Endereço de Chegada', width: 240, description: 'Endereço de destino/chegada (CEP, rua, cidade ou estado).' },
          { id: 'tipo_combustivel', title: 'Tipo de combustível', width: 160, type: 'bubble', options: ['Diesel S10', 'Diesel S500', 'Gasolina', 'Etanol', 'GNV', 'Biodiesel B10'], description: 'Tipo de combustível utilizado.' },
          { id: 'tipo_veiculo', title: 'Tipo de veículo', width: 150, type: 'bubble', options: ['Automóvel', 'Caminhão', 'Gerador', 'Utilitário', 'Van', 'Empilhadeira'], description: 'Tipo de veículo utilizado.' },
          { id: 'ano_veiculo', title: 'Ano do veículo', width: 130, description: 'Ano de fabricação do veículo.' },
        ],
        rows: buildCombustaoMovelEnderecos(),
      },
    ],
  },
  {
    id: 'combustao-movel-aereo',
    label: 'Combustão Móvel (Aéreo)',
    icon: Helicopter,
    scope: 1,
    hint: 'Envie o consumo de combustível em litros da sua frota de aeronaves.',
    initialChat: [
      {
        id: 'cma-1',
        role: 'assistant',
        content: 'Categoria de Combustão Móvel (Aéreo) ativa. Envie o consumo de combustível por aeronave.',
        timestamp: t(58),
      },
    ],
    schemas: [
      {
        id: 'litros',
        label: 'Por litros',
        columns: modalLitrosColumns(
          'Identificação da frota/aeronave.',
          ['Querosene de Aviação (QAV)', 'Gasolina de Aviação (AvGas)', 'Jet A-1'],
        ),
        rows: buildCombustaoMovelModal(CM_AEREO_COMBUSTIVEIS, 'AER'),
      },
    ],
  },
  {
    id: 'combustao-movel-hidroviario',
    label: 'Combustão Móvel (Hidroviário)',
    icon: Anchor,
    scope: 1,
    hint: 'Envie o consumo de combustível em litros da sua frota de embarcações.',
    initialChat: [
      {
        id: 'cmh-1',
        role: 'assistant',
        content: 'Categoria de Combustão Móvel (Hidroviário) ativa. Envie o consumo de combustível por embarcação.',
        timestamp: t(56),
      },
    ],
    schemas: [
      {
        id: 'litros',
        label: 'Por litros',
        columns: modalLitrosColumns(
          'Identificação da frota/embarcação.',
          ['Óleo Diesel Marítimo (MDO)', 'Óleo Combustível Pesado (HFO)', 'Diesel S10', 'GNV'],
        ),
        rows: buildCombustaoMovelModal(CM_HIDRO_COMBUSTIVEIS, 'EMB'),
      },
    ],
  },
  {
    id: 'energia-eletrica',
    label: 'Aquisição de Energia Elétrica',
    icon: Zap,
    scope: 2,
    hint: 'Envie o consumo de energia elétrica por ambiente de contratação: SIN (cativo), ACL (mercado livre) ou geração própria.',
    initialChat: [
      {
        id: 'ee-1',
        role: 'assistant',
        content: 'Categoria de Aquisição de Energia Elétrica ativa. Envie o consumo por ambiente: SIN, ACL ou geração própria.',
        timestamp: t(40),
      },
    ],
    schemas: [
      {
        id: 'sin',
        label: 'SIN',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'consumo', title: 'Consumo', width: 130, description: 'Consumo de energia elétrica.' },
          { id: 'unidade', title: 'Unidade de medida', width: 150, type: 'bubble', options: ['kWh', 'MWh', 'GWh'], description: 'Unidade de medida (kWh, MWh, etc.).' },
          { id: 'origem', title: 'Origem', width: 140, type: 'bubble', options: ['SIN'], description: 'Tipo da fonte de energia elétrica. Vai ser sempre: SIN.' },
        ],
        rows: buildEnergiaSIN(),
      },
      {
        id: 'acl',
        label: 'ACL',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'consumo', title: 'Consumo', width: 130, description: 'Consumo de energia elétrica (ACL).' },
          { id: 'unidade', title: 'Unidade de medida', width: 150, type: 'bubble', options: ['kWh', 'MWh', 'GWh'], description: 'Unidade de medida (kWh, MWh, etc.).' },
          { id: 'origem', title: 'Origem', width: 140, type: 'bubble', options: ['ACL'], description: 'Tipo da fonte de energia elétrica. Vai ser sempre: ACL.' },
          { id: 'fonte', title: 'Fonte', width: 150, type: 'bubble', options: ['Solar', 'Eólica', 'Hídrica', 'Biomassa'], description: 'Fonte renovável da energia: solar, eólica, hídrica.' },
          { id: 'registro', title: 'Registro', width: 220, description: 'Observação para o cálculo: com I-REC vira documento comprobatório; sem, fica como autodeclaração pendente.' },
        ],
        rows: buildEnergiaACL(),
      },
      {
        id: 'geracao-propria',
        label: 'Geração própria',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'consumo', title: 'Consumo', width: 130, description: 'Consumo de energia elétrica.' },
          { id: 'unidade_consumo', title: 'Unidade de Medida Consumo', width: 200, type: 'bubble', options: ['kWh', 'MWh', 'GWh'], description: 'Unidade de medida do consumo (kWh, MWh, etc.).' },
          { id: 'geracao', title: 'Geração', width: 130, description: 'Quantidade de energia gerada.' },
          { id: 'unidade_geracao', title: 'Unidade de Medida Geração', width: 200, type: 'bubble', options: ['kWh', 'MWh', 'GWh'], description: 'Unidade de medida da geração (kWh, MWh, etc.).' },
          { id: 'origem', title: 'Origem', width: 160, type: 'bubble', options: ['Solar', 'Eólica', 'Hídrica', 'Biomassa'], description: 'Tipo da fonte de energia elétrica (geração própria).' },
        ],
        rows: buildEnergiaGeracaoPropria(),
      },
    ],
  },
  {
    id: 'mudanca-uso-solo',
    label: 'Mudança no Uso do Solo',
    icon: Trees,
    scope: 1,
    hint: 'Envie a área (ha) convertida, o uso anterior e posterior do solo e eventuais subprodutos da supressão.',
    initialChat: [
      {
        id: 'mus-1',
        role: 'assistant',
        content: 'Categoria de Mudança no Uso do Solo ativa. Envie a área convertida, o uso anterior/posterior do solo e subprodutos gerados.',
        timestamp: t(45),
      },
    ],
    schemas: [
      {
        id: 'solo',
        label: 'Solo',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'area', title: 'Área (ha)', width: 130, description: 'Área total (hectares) da mudança.' },
          { id: 'uso_anterior', title: 'Uso Anterior', width: 180, type: 'bubble', options: ['Cultura anual', 'Cana', 'Perene', 'Pastagem', 'Silvicultura'], description: 'Uso anterior do solo (cultura anual, cana, perene, pastagem, silvicultura).' },
          { id: 'uso_posterior', title: 'Uso Posterior', width: 180, type: 'bubble', options: ['Cultura anual', 'Cana', 'Perene', 'Pastagem', 'Silvicultura', 'Assentamentos', 'Outros'], description: 'Uso posterior do solo (cultura anual, cana, perene, pastagem, silvicultura, assentamentos ou outros).' },
          { id: 'subprodutos', title: 'Subprodutos', width: 180, description: 'Há geração de subprodutos? Quais? (ex.: lenha).' },
          { id: 'quantidade', title: 'Quantidade', width: 140, description: 'Quantidade de subproduto gerado.' },
        ],
        rows: buildMudancaUsoSolo(),
      },
      {
        id: 'vegetacao',
        label: 'Vegetação',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'area', title: 'Área (ha)', width: 130, description: 'Área total (hectares) da mudança.' },
          { id: 'uso_anterior', title: 'Uso Anterior', width: 190, type: 'bubble', options: ['Cultura anual', 'Cana', 'Perene', 'Pastagem', 'Silvicultura', 'Vegetação natural'], description: 'Uso anterior do solo (cultura anual, cana, perene, pastagem, silvicultura, vegetação natural).' },
          { id: 'uso_posterior', title: 'Uso Posterior', width: 200, type: 'bubble', options: ['Cultura anual', 'Cana', 'Perene', 'Pastagem', 'Silvicultura', 'Vegetação natural', 'Assentamentos', 'Outros'], description: 'Uso posterior do solo (cultura anual, cana, perene, pastagem, silvicultura, vegetação natural, assentamentos ou outros).' },
          { id: 'bioma', title: 'Bioma', width: 160, type: 'bubble', options: ['Amazônia', 'Cerrado', 'Mata Atlântica', 'Caatinga', 'Pampa', 'Pantanal'], description: 'Bioma da vegetação.' },
          { id: 'tipo_vegetacao', title: 'Tipo de Vegetação', width: 170, type: 'bubble', options: ['Primária', 'Secundária'], description: 'Tipo de vegetação (primária ou secundária).' },
          { id: 'fitofisionomia', title: 'Fitofisionomia', width: 240, description: 'Fitofisionomia/detalhamento da vegetação.' },
          { id: 'subprodutos', title: 'Subprodutos', width: 180, description: 'Há geração de subprodutos? Quais? (ex.: lenha).' },
          { id: 'quantidade', title: 'Quantidade', width: 140, description: 'Quantidade de subproduto gerado.' },
        ],
        rows: buildMudancaUsoSoloVegetacao(),
      },
    ],
  },
  {
    id: 'efluentes-liquidos',
    label: 'Efluentes Líquidos',
    icon: Droplets,
    scope: 1,
    hint: 'Envie o volume mensal de efluente, as análises de DBO/DQO/N₂ (entrada e saída) e o tratamento utilizado por filial.',
    initialChat: [
      {
        id: 'efl-1',
        role: 'assistant',
        content: 'Categoria de Efluentes Líquidos ativa. Envie o volume de efluente, as análises de DBO/DQO/nitrogênio (entrada e saída do tratamento) e o tipo de tratamento por filial.',
        timestamp: t(38),
      },
    ],
    schemas: [
      {
        id: 'efluentes',
        label: 'Efluentes',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'tipo_efluente', title: 'Tipo de Efluente', width: 230, type: 'bubble', options: EFL_TIPOS, description: 'Tipo de efluente gerado (esgoto doméstico/sanitário ou efluente industrial).' },
          { id: 'fase', title: 'Fase', width: 170, type: 'bubble', options: EFL_FASES, description: 'Fase do tratamento desta medição: pré-tratamento ou pós-tratamento.' },
          { id: 'etapa', title: 'Etapa', width: 110, description: 'Nº da etapa de medição dentro da fase (01 = entrada; a última etapa é a saída; as do meio são pontos intermediários). Cada etapa é uma linha.' },
          { id: 'tratamento', title: 'Tratamento Utilizado', width: 230, type: 'bubble', options: EFL_TRATAMENTOS, description: 'Tipo de tratamento aplicado ao efluente.' },
          { id: 'disposicao_final', title: 'Disposição Final', width: 300, description: 'Destino do efluente após tratamento (rede pública/ETE, corpo hídrico, solo, reuso).' },
          { id: 'dbo', title: 'DBO', width: 120, description: 'Demanda Bioquímica de Oxigênio medida nesta etapa ("< 2" = abaixo do limite de detecção).' },
          { id: 'dbo_unidade', title: 'Unidade de medida (DBO)', width: 200, type: 'bubble', options: ['mg/L', 'kg/m³'], description: 'Unidade de medida da DBO (mg/L ou kg/m³).' },
          { id: 'dqo', title: 'DQO', width: 120, description: 'Demanda Química de Oxigênio medida nesta etapa.' },
          { id: 'dqo_unidade', title: 'Unidade de medida (DQO)', width: 200, type: 'bubble', options: ['mg/L', 'kg/m³'], description: 'Unidade de medida da DQO (mg/L ou kg/m³).' },
          { id: 'n2', title: 'Teor de N₂', width: 130, description: 'Teor de nitrogênio medido nesta etapa (medição periódica; "—" quando não medido no mês).' },
          { id: 'n2_unidade', title: 'Unidade de medida (N₂)', width: 200, type: 'bubble', options: ['kgN/m³', 'mg/L'], description: 'Unidade de medida do teor de nitrogênio (kgN/m³ ou mg/L).' },
          { id: 'volume', title: 'Volume de Efluente', width: 170, description: 'Volume mensal de efluente nesta etapa.' },
          { id: 'volume_unidade', title: 'Unidade de medida (Volume)', width: 210, type: 'bubble', options: ['m³', 'L'], description: 'Unidade de medida do volume (m³ ou litros).' },
        ],
        rows: buildEfluentes(),
      },
    ],
  },
  {
    id: 'residuos-compostagem',
    label: 'Resíduos Sólidos (Compostagem)',
    icon: Recycle,
    scope: 1,
    hint: 'Envie os resíduos orgânicos destinados à compostagem e, opcionalmente, o metano/biogás recuperado.',
    initialChat: [
      {
        id: 'rc-1',
        role: 'assistant',
        content: 'Categoria de Resíduos Sólidos (Compostagem) ativa. Envie a quantidade de resíduos compostados e o biogás recuperado.',
        timestamp: t(42),
      },
    ],
    schemas: [
      {
        id: 'residuos-compostagem',
        label: 'Compostagem',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'quantidade', title: 'Quantidade', width: 140, description: 'Quantidade de resíduos destinados à compostagem.' },
          { id: 'unidade', title: 'Unidade de Medida (Resíduo)', width: 230, type: 'bubble', options: ['ton', 'kg', 'm³'], description: 'Unidade de medida da quantidade de resíduos (toneladas, kg, etc.).' },
          { id: 'metano', title: 'Quantidade de Metano/Biogás', width: 230, description: 'Quantidade de metano/biogás recuperado (opcional).' },
          { id: 'unidade_metano', title: 'Unidade de Medida (Metano)', width: 220, type: 'bubble', options: ['m³', 'kg', 'ton'], description: 'Unidade de medida do metano/biogás (toneladas, kg, etc.) (opcional).' },
          { id: 'destino_biogas', title: 'Destino do Biogás', width: 220, type: 'bubble', options: RC_DESTINOS_BIOGAS, description: 'Destino do biogás (queima em flare, geração de energia ou venda) (opcional).' },
        ],
        rows: buildResiduosCompostagem(),
      },
    ],
  },
  {
    id: 'emissoes-fugitivas',
    label: 'Emissões Fugitivas',
    icon: Snowflake,
    scope: 1,
    hint: 'Envie a recarga de gases (refrigerantes, SF₆, extintores) por fonte de emissão.',
    initialChat: [
      {
        id: 'ef-1',
        role: 'assistant',
        content: 'Categoria de Emissões Fugitivas ativa. Envie a fonte de emissão, o gás e a quantidade recarregada.',
        timestamp: t(30),
      },
    ],
    schemas: [
      {
        id: 'emissao-fugitiva',
        label: 'Emissões fugitivas',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'fonte_emissao', title: 'Fonte de Emissão', width: 220, type: 'bubble', options: EF_FONTES, description: 'Fonte de emissão (ar-condicionado, extintor, câmara fria, etc.).' },
          { id: 'gas', title: 'Gás', width: 200, type: 'bubble', options: EF_GASES.map((g) => g.nome), description: 'Tipo de gás (HFCs, PFCs, SF₆, NF₃, CO₂, etc.).' },
          { id: 'quantidade', title: 'Quantidade', width: 140, description: 'Quantidade total consumida.' },
          { id: 'unidade', title: 'Unidade de Medida', width: 160, type: 'bubble', options: ['kg', 'g', 'ton', 'litros'], description: 'Unidade de medida (litros, m³, toneladas, kg, etc.).' },
        ],
        rows: buildEmissoesFugitivas(),
      },
    ],
  },
  {
    id: 'combustao-estacionaria',
    label: 'Combustão Estacionária',
    icon: Flame,
    scope: 1,
    hint: 'Envie o consumo de combustível por equipamento fixo (caldeira, forno, gerador) e fonte de emissão.',
    initialChat: [
      {
        id: 'ce-1',
        role: 'assistant',
        content: 'Categoria de Combustão Estacionária ativa. Envie a quantidade de combustível, o tipo e a fonte de emissão.',
        timestamp: t(50),
      },
    ],
    schemas: [
      {
        id: 'combustao-estacionaria',
        label: 'Combustão estacionária',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'quantidade', title: 'Quantidade', width: 140, description: 'Quantidade consumida.' },
          { id: 'unidade', title: 'Unidade de Medida', width: 170, type: 'bubble', options: ['litros', 'm³', 'ton', 'kg'], description: 'Unidade de medida (litros, m³, toneladas, kg, etc.).' },
          { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 200, type: 'bubble', options: CE_COMBUSTIVEIS.map((c) => c.nome), description: 'Tipos de combustível consumido.' },
          { id: 'fonte_emissao', title: 'Fonte de Emissão', width: 220, type: 'bubble', options: CE_FONTES, description: 'Equipamentos ou ferramentas consumindo combustível.' },
        ],
        rows: buildCombustaoEstacionaria(),
      },
    ],
  },
  {
    id: 'viagens-negocios',
    label: 'Viagens a Negócios',
    icon: Plane,
    scope: 3,
    hint: 'Envie deslocamentos a trabalho: rodoviário (litros/distância/rota), aéreo ou transporte coletivo (distância/rota).',
    initialChat: [
      {
        id: 'vn-1',
        role: 'assistant',
        content: 'Categoria de Viagens a Negócios ativa. Envie os deslocamentos a trabalho por modal: rodoviário, aéreo ou coletivo.',
        timestamp: t(20),
      },
    ],
    schemas: [
      {
        id: 'rodoviario-litros',
        label: 'Rodoviário · Litros',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da frota/veículo.' },
          { id: 'consumo', title: 'Litros Consumidos', width: 160, description: 'Quantidade de litros consumidos.' },
          { id: 'unidade', title: 'Unidade de Medida', width: 160, type: 'bubble', options: ['litros', 'm³', 'kg'], description: 'Unidade de medida (litros, m³, kg, etc.).' },
          { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 200, type: 'bubble', options: TR_RODO_COMBUSTIVEIS_OPT, description: 'Tipo de combustível utilizado.' },
        ],
        rows: vnRodoLitros(),
      },
      {
        id: 'rodoviario-distancia',
        label: 'Rodoviário · Distância',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da frota/veículo.' },
          { id: 'distancia', title: 'Distância', width: 130, description: 'Distância percorrida pelo veículo.' },
          { id: 'unidade', title: 'Unidade de Medida', width: 170, type: 'bubble', options: ['km', 'milhas', 'metros'], description: 'Unidade de medida da distância (metros, km, etc.).' },
          { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 200, type: 'bubble', options: TR_RODO_COMBUSTIVEIS_OPT, description: 'Tipo de combustível utilizado.' },
          { id: 'tipo_veiculo', title: 'Tipo de Veículo', width: 160, type: 'bubble', options: TR_RODO_VEICULOS_OPT, description: 'Tipo de veículo utilizado.' },
        ],
        rows: vnRodoDistancia(),
      },
      {
        id: 'rodoviario-enderecos',
        label: 'Rodoviário · Origem → Destino',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da frota/veículo.' },
          { id: 'endereco_partida', title: 'Endereço de Partida', width: 240, description: 'Endereço de origem/partida (CEP, rua, cidade ou estado).' },
          { id: 'endereco_chegada', title: 'Endereço de Chegada', width: 240, description: 'Endereço de destino/chegada (CEP, rua, cidade ou estado).' },
          { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 200, type: 'bubble', options: TR_RODO_COMBUSTIVEIS_OPT, description: 'Tipo de combustível utilizado.' },
          { id: 'tipo_veiculo', title: 'Tipo de Veículo', width: 160, type: 'bubble', options: TR_RODO_VEICULOS_OPT, description: 'Tipo de veículo utilizado.' },
        ],
        rows: vnRodoEnderecos(),
      },
      {
        id: 'aereo',
        label: 'Aéreo',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da frota/aeronave.' },
          { id: 'aeroporto_partida', title: 'Aeroporto de Partida', width: 220, description: 'Aeroporto de origem/partida (cidade ou código IATA).' },
          { id: 'aeroporto_destino', title: 'Aeroporto de Destino', width: 220, description: 'Aeroporto de destino/chegada (cidade ou código IATA).' },
        ],
        rows: vnAereo(),
      },
      {
        id: 'coletivo-distancia',
        label: 'Coletivo · Distância',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da frota/veículo.' },
          { id: 'funcionarios', title: 'Nº de Funcionários', width: 170, description: 'Número de funcionários que realizou a viagem.' },
          { id: 'distancia', title: 'Distância', width: 130, description: 'Distância percorrida na viagem.' },
          { id: 'unidade', title: 'Unidade de Medida', width: 170, type: 'bubble', options: ['km', 'milhas', 'metros'], description: 'Unidade de medida da distância (metros, km, etc.).' },
          { id: 'tipo_veiculo', title: 'Tipo de Veículo', width: 200, type: 'bubble', options: VN_COLETIVO_VEICULOS, description: 'Tipo de veículo (metrô, trem, ônibus intermunicipal, etc.).' },
        ],
        rows: vnColetivoDistancia(),
      },
      {
        id: 'coletivo-enderecos',
        label: 'Coletivo · Origem → Destino',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da frota/veículo.' },
          { id: 'funcionarios', title: 'Nº de Funcionários', width: 170, description: 'Número de funcionários que realizou a viagem.' },
          { id: 'endereco_partida', title: 'Endereço de Partida', width: 240, description: 'Endereço de origem/partida (CEP, rua, cidade ou estado).' },
          { id: 'endereco_chegada', title: 'Endereço de Chegada', width: 240, description: 'Endereço de destino/chegada (CEP, rua, cidade ou estado).' },
          { id: 'tipo_veiculo', title: 'Tipo de Veículo', width: 200, type: 'bubble', options: VN_COLETIVO_VEICULOS, description: 'Tipo de veículo (metrô, trem, ônibus intermunicipal, etc.).' },
        ],
        rows: vnColetivoEnderecos(),
      },
    ],
  },
  {
    id: 'transporte-aereo-upstream',
    label: 'Transporte Aéreo Upstream',
    icon: PlaneTakeoff,
    scope: 3,
    direction: 'up',
    hint: 'Envie os fretes aéreos a montante (insumos recebidos): rota, peso e unidade da carga transportada.',
    initialChat: [
      {
        id: 'tau-1',
        role: 'assistant',
        content: 'Categoria de Transporte Aéreo Upstream ativa. Envie os fretes de entrada (insumos): aeroporto de partida/destino e peso da carga.',
        timestamp: t(36),
      },
    ],
    schemas: [
      {
        id: 'aereo-up',
        label: 'Fretes aéreos',
        columns: transporteAereoColumns(),
        rows: buildTransporteAereo(),
      },
    ],
  },
  {
    id: 'transporte-aereo-downstream',
    label: 'Transporte Aéreo Downstream',
    icon: PlaneLanding,
    scope: 3,
    direction: 'down',
    hint: 'Envie os fretes aéreos a jusante (produtos expedidos): rota, peso e unidade da carga transportada.',
    initialChat: [
      {
        id: 'tad-1',
        role: 'assistant',
        content: 'Categoria de Transporte Aéreo Downstream ativa. Envie os fretes de saída (produtos): aeroporto de partida/destino e peso da carga.',
        timestamp: t(34),
      },
    ],
    schemas: [
      {
        id: 'aereo-down',
        label: 'Fretes aéreos',
        columns: transporteAereoColumns(),
        rows: buildTransporteAereo(),
      },
    ],
  },
  {
    id: 'transporte-hidro-upstream',
    label: 'Transporte Hidroviário Upstream',
    icon: Container,
    scope: 3,
    direction: 'up',
    hint: 'Envie os fretes marítimos/fluviais a montante (insumos recebidos): rota, peso e tipo de navio.',
    initialChat: [
      {
        id: 'thu-1',
        role: 'assistant',
        content: 'Categoria de Transporte Hidroviário Upstream ativa. Envie os fretes de entrada (insumos): porto de partida/destino, peso e navio.',
        timestamp: t(32),
      },
    ],
    schemas: [
      {
        id: 'hidro-up',
        label: 'Fretes hidroviários',
        columns: transporteHidroColumns(),
        rows: buildTransporteHidro(),
      },
    ],
  },
  {
    id: 'transporte-hidro-downstream',
    label: 'Transporte Hidroviário Downstream',
    icon: Ship,
    scope: 3,
    direction: 'down',
    hint: 'Envie os fretes marítimos/fluviais a jusante (produtos expedidos): rota, peso e tipo de navio.',
    initialChat: [
      {
        id: 'thd-1',
        role: 'assistant',
        content: 'Categoria de Transporte Hidroviário Downstream ativa. Envie os fretes de saída (produtos): porto de partida/destino, peso e navio.',
        timestamp: t(30),
      },
    ],
    schemas: [
      {
        id: 'hidro-down',
        label: 'Fretes hidroviários',
        columns: transporteHidroColumns(),
        rows: buildTransporteHidro(),
      },
    ],
  },
  {
    id: 'transporte-rodo-upstream',
    label: 'Transporte Rodoviário Upstream',
    icon: Truck,
    scope: 3,
    direction: 'up',
    hint: 'Envie os fretes rodoviários a montante (insumos recebidos): litros, distância ou rotas origem→destino.',
    initialChat: [
      {
        id: 'tru-1',
        role: 'assistant',
        content: 'Categoria de Transporte Rodoviário Upstream ativa. Envie os fretes de entrada (insumos) em litros, distância ou origem/destino.',
        timestamp: t(28),
      },
    ],
    schemas: transporteRodoSchemas('up'),
  },
  {
    id: 'transporte-rodo-downstream',
    label: 'Transporte Rodoviário Downstream',
    icon: Van,
    scope: 3,
    direction: 'down',
    hint: 'Envie os fretes rodoviários a jusante (produtos expedidos): litros, distância ou rotas origem→destino.',
    initialChat: [
      {
        id: 'trd-1',
        role: 'assistant',
        content: 'Categoria de Transporte Rodoviário Downstream ativa. Envie os fretes de saída (produtos) em litros, distância ou origem/destino.',
        timestamp: t(26),
      },
    ],
    schemas: transporteRodoSchemas('down'),
  },
  {
    id: 'emissoes-casa-trabalho',
    label: 'Deslocamento Casa-Trabalho',
    icon: House,
    scope: 3,
    hint: 'Envie o commuting dos colaboradores: deslocamento individual (distância/CEP) ou transporte fretado (litros/distância/rota).',
    initialChat: [
      {
        id: 'dct-1',
        role: 'assistant',
        content: 'Categoria de Deslocamento Casa-Trabalho ativa. Envie o deslocamento dos colaboradores ou os fretados contratados.',
        timestamp: t(24),
      },
    ],
    schemas: [
      {
        id: 'func-distancia',
        label: 'Colaboradores · Distância',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificacao', title: 'Identificação', width: 170, description: 'Identificação dos colaboradores (nome, matrícula, etc.).' },
          { id: 'distancia', title: 'Distância', width: 130, description: 'Distância total percorrida pelo colaborador.' },
          { id: 'unidade', title: 'Unidade de Medida', width: 170, type: 'bubble', options: ['km', 'milhas', 'metros'], description: 'Unidade de medida da distância (metros, km, etc.).' },
          { id: 'meses_trabalhados', title: 'Quantidade de meses trabalhados', width: 230, description: 'Meses trabalhados no ano por colaborador.' },
          { id: 'dias_semana', title: 'Dias na semana presencial', width: 200, description: 'Dias por semana presencial.' },
          { id: 'meio_transporte', title: 'Meio de Transporte', width: 190, type: 'bubble', options: DCT_MEIOS_TRANSPORTE, description: 'Principal meio de transporte.' },
          { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 180, type: 'bubble', options: DCT_COMBUSTIVEIS, description: 'Tipo de combustível utilizado.' },
        ],
        rows: buildDctFuncDistancia(),
      },
      {
        id: 'func-endereco',
        label: 'Colaboradores · CEP',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificacao', title: 'Identificação', width: 170, description: 'Identificação dos colaboradores (nome, matrícula, etc.).' },
          { id: 'cep_colaborador', title: 'CEP do Colaborador', width: 180, description: 'CEP de cada colaborador.' },
          { id: 'meses_trabalhados', title: 'Quantidade de meses trabalhados', width: 230, description: 'Meses trabalhados no ano por colaborador.' },
          { id: 'dias_semana', title: 'Dias na semana presencial', width: 200, description: 'Dias por semana presencial.' },
          { id: 'meio_transporte', title: 'Meio de Transporte', width: 190, type: 'bubble', options: DCT_MEIOS_TRANSPORTE, description: 'Principal meio de transporte.' },
          { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 180, type: 'bubble', options: DCT_COMBUSTIVEIS, description: 'Tipo de combustível utilizado.' },
        ],
        rows: buildDctFuncEndereco(),
      },
      {
        id: 'fretado-litros',
        label: 'Fretado · Litros',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da frota/veículo.' },
          { id: 'consumo', title: 'Consumo', width: 130, description: 'Quantidade de combustível consumido.' },
          { id: 'unidade', title: 'Unidade de Medida', width: 170, type: 'bubble', options: ['litros', 'm³', 'kg'], description: 'Unidade de medida (litros, m³, kg, etc.).' },
          { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 200, type: 'bubble', options: TR_RODO_COMBUSTIVEIS_OPT, description: 'Tipo de combustível utilizado.' },
          { id: 'tipo_veiculo', title: 'Tipo de Veículo', width: 170, type: 'bubble', options: DCT_VEICULOS_FRETADO, description: 'Tipo de veículo utilizado (opcional).' },
        ],
        rows: buildDctFretadoLitros(),
      },
      {
        id: 'fretado-distancia',
        label: 'Fretado · Distância',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificador', title: 'Identificador', width: 150, description: 'Identificação da frota/veículo.' },
          { id: 'distancia', title: 'Distância', width: 130, description: 'Distância percorrida pelo veículo.' },
          { id: 'unidade', title: 'Unidade de Medida', width: 170, type: 'bubble', options: ['km', 'milhas', 'metros'], description: 'Unidade de medida da distância (metros, km, etc.).' },
          { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 200, type: 'bubble', options: TR_RODO_COMBUSTIVEIS_OPT, description: 'Tipo de combustível utilizado (opcional).' },
          { id: 'tipo_veiculo', title: 'Tipo de Veículo', width: 170, type: 'bubble', options: DCT_VEICULOS_FRETADO, description: 'Tipo de veículo utilizado (opcional).' },
        ],
        rows: buildDctFretadoDistancia(),
      },
      {
        id: 'fretado-enderecos',
        label: 'Fretado · Rota',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificacao', title: 'Identificação', width: 200, description: 'Identificação da rota.' },
          { id: 'enderecos_rota', title: 'Endereços da Rota', width: 180, description: 'CEP de cada colaborador.' },
          { id: 'dias_semana', title: 'Dias na semana', width: 150, description: 'Número de dias na semana que a rota opera.' },
          { id: 'colaboradores', title: 'Quantidade de colaboradores', width: 220, description: 'Quantidade de colaboradores que usam a rota.' },
          { id: 'tipo_veiculo', title: 'Tipo de Veículo', width: 170, type: 'bubble', options: DCT_VEICULOS_FRETADO, description: 'Tipo de veículo utilizado (opcional).' },
          { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 200, type: 'bubble', options: TR_RODO_COMBUSTIVEIS_OPT, description: 'Tipo de combustível utilizado (opcional).' },
        ],
        rows: buildDctFretadoEnderecos(),
      },
      {
        id: 'fretado-compartilhado',
        label: 'Fretado · Rota compartilhada',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'identificacao', title: 'Identificação', width: 170, description: 'Identificação dos colaboradores (nome, matrícula, etc.).' },
          { id: 'cep_colaborador', title: 'CEP do Colaborador', width: 180, description: 'CEP de cada colaborador.' },
          { id: 'dias_semana', title: 'Dias na semana', width: 150, description: 'Número de dias na semana que o funcionário pega o fretado.' },
          { id: 'tipo_combustivel', title: 'Tipo de Combustível', width: 200, type: 'bubble', options: TR_RODO_COMBUSTIVEIS_OPT, description: 'Tipo de combustível utilizado (opcional).' },
        ],
        rows: buildDctFretadoCompartilhado(),
      },
    ],
  },
  {
    id: 'residuos',
    label: 'Resíduos Tratados Externamente',
    icon: Trash2,
    scope: 3,
    hint: 'Envie a quantidade de resíduos tratados externamente por categoria, o tipo de processamento/destinação e, opcionalmente, o metano/biogás recuperado.',
    initialChat: [
      {
        id: 'rs-1',
        role: 'assistant',
        content: 'Categoria de Resíduos (Escopo 3) ativa. Envie a quantidade de resíduos por categoria (papel, plástico, orgânico...), o tipo de processamento/destinação e o biogás recuperado, se houver.',
        timestamp: t(10),
      },
    ],
    schemas: [
      {
        id: 'residuos-tratados-externamente',
        label: 'Tratados externamente',
        columns: [
          { id: 'filial', title: 'Filial', width: 180, type: 'bubble' },
          { id: 'mes_emissao', title: 'Mês de Emissão', width: 140, type: 'bubble', description: 'Mês de referência da emissão (nome, número 1–12 ou extraído de data DD/MM/YYYY).' },
          { id: 'quantidade', title: 'Quantidade de Resíduos', width: 180, description: 'Quantidade de resíduos destinados a tratamento externo.' },
          { id: 'unidade', title: 'Unidade de Medida (Resíduo)', width: 230, type: 'bubble', options: ['ton', 'kg', 'm³'], description: 'Unidade de medida da quantidade de resíduos (toneladas, kg, etc.).' },
          { id: 'processamento', title: 'Tipo de processamento / Destinação', width: 270, type: 'bubble', options: RES_PROCESSAMENTOS, description: 'Tipo de processamento/destinação (aterro, incineração, compostagem, reciclagem).' },
          { id: 'metano', title: 'Quantidade de Metano/Biogás', width: 230, description: 'Quantidade de metano/biogás recuperado (opcional).' },
          { id: 'unidade_metano', title: 'Unidade de Medida (Metano)', width: 220, type: 'bubble', options: ['m³', 'kg', 'ton'], description: 'Unidade de medida do metano/biogás (toneladas, kg, etc.) (opcional).' },
          { id: 'destino_biogas', title: 'Destino do Biogás', width: 220, type: 'bubble', options: RC_DESTINOS_BIOGAS, description: 'Destino do biogás (queima em flare, geração de energia ou venda) (opcional).' },
          // Uma coluna de porcentagem por categoria do resíduo (A · …, B · …).
          ...RES_PCT_COLS.map((col) => ({
            id: col.id,
            title: col.titulo,
            width: 230,
            description: `Participação de "${col.titulo}" no total de resíduos gerados pela filial no mês.`,
          })),
        ],
        rows: buildResiduos(),
      },
    ],
  },
]

export const DEFAULT_CATEGORY_ID = CATEGORIES[0].id

export function findCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]
}

export function getSchemaWorstStatus(schema: TableSchema): CellStatus | null {
  let worst: CellStatus | null = null
  for (const row of schema.rows) {
    const cs = row._cellStatus
    if (!cs) continue
    for (const status of Object.values(cs)) {
      if (status === 'error') return 'error'
      if (status === 'warning') worst = 'warning'
    }
  }
  return worst
}

export function getCategoryWorstStatus(cat: EmissionCategory): CellStatus | null {
  let worst: CellStatus | null = null
  for (const schema of cat.schemas) {
    const s = getSchemaWorstStatus(schema)
    if (s === 'error') return 'error'
    if (s === 'warning') worst = 'warning'
  }
  return worst
}
