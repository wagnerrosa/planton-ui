import { Truck, Flame, Zap, Snowflake, Plane, Trash2, type LucideIcon } from 'lucide-react'

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
  icon: LucideIcon
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

export const CATEGORIES: EmissionCategory[] = [
  {
    id: 'combustao-movel',
    label: 'Combustão móvel',
    icon: Truck,
    scope: 1,
    hint: 'Envie consumos em litros, quilometragem percorrida ou rotas origem→destino da sua frota.',
    initialChat: [
      {
        id: 'cm-1',
        role: 'assistant',
        content: 'Categoria de Combustão móvel ativa. Envie dados em litros, quilometragem ou pontos de origem/destino.',
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
    id: 'energia-eletrica',
    label: 'Energia elétrica',
    icon: Zap,
    scope: 2,
    hint: 'Envie consumo em kWh por unidade ou valores das faturas em BRL com tarifa média.',
    initialChat: [
      {
        id: 'ee-1',
        role: 'assistant',
        content: 'Categoria de Energia elétrica ativa. Envie consumo em kWh ou valor das faturas em BRL.',
        timestamp: t(40),
      },
    ],
    schemas: [
      {
        id: 'kwh',
        label: 'Por kWh',
        columns: [
          { id: 'unidade-op', title: 'Unidade', width: 180, type: 'bubble' },
          { id: 'consumo', title: 'Consumo', width: 130 },
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble', options: ['kWh', 'MWh', 'GWh'] },
          { id: 'periodo', title: 'Período', width: 130, type: 'bubble' },
          { id: 'fator', title: 'Fator SIN', width: 150 },
          { id: 'tco2e', title: 'tCO₂e', width: 100 },
          { id: 'fornecedor', title: 'Fornecedor', width: 160, type: 'bubble' },
        ],
        rows: [
          { 'unidade-op': 'Matriz SP', consumo: '87.300', unidade: 'kWh', periodo: 'Jan/2026', fator: '0,0385 tCO₂/MWh', tco2e: '3,36', fornecedor: 'Enel' },
          { 'unidade-op': 'Fábrica Campinas', consumo: '124.500', unidade: 'kWh', periodo: 'Jan/2026', fator: '0,0385 tCO₂/MWh', tco2e: '4,79', fornecedor: 'CPFL' },
          { 'unidade-op': 'CD Guarulhos', consumo: '52.200', unidade: 'kWh', periodo: 'Jan/2026', fator: '0,0385 tCO₂/MWh', tco2e: '2,01', fornecedor: 'Enel' },
        ],
      },
      {
        id: 'fatura',
        label: 'Por fatura',
        columns: [
          { id: 'unidade-op', title: 'Unidade', width: 180, type: 'bubble' },
          { id: 'valor', title: 'Valor fatura', width: 140 },
          { id: 'tarifa', title: 'Tarifa média', width: 140 },
          { id: 'kwh-est', title: 'kWh estimado', width: 140 },
          { id: 'periodo', title: 'Período', width: 130, type: 'bubble' },
          { id: 'tco2e', title: 'tCO₂e', width: 100 },
        ],
        rows: [
          { 'unidade-op': 'Matriz SP', valor: 'R$ 62.400', tarifa: 'R$ 0,715/kWh', 'kwh-est': '87.272', periodo: 'Jan/2026', tco2e: '3,36' },
          { 'unidade-op': 'Fábrica Campinas', valor: 'R$ 84.200', tarifa: 'R$ 0,676/kWh', 'kwh-est': '124.556', periodo: 'Jan/2026', tco2e: '4,79' },
        ],
      },
    ],
  },
  {
    id: 'emissoes-fugitivas',
    label: 'Emissões fugitivas',
    icon: Snowflake,
    scope: 1,
    hint: 'Envie dados de recarga de gases refrigerantes (R-410A, R-134a, R-32) por equipamento.',
    initialChat: [
      {
        id: 'ef-1',
        role: 'assistant',
        content: 'Categoria de Emissões fugitivas ativa. Envie dados de recarga de refrigerantes (R-410A, R-134a, etc).',
        timestamp: t(30),
      },
    ],
    schemas: [
      {
        id: 'refrigerantes',
        label: 'Refrigerantes',
        columns: [
          { id: 'unidade_empresa', title: 'Unidade', width: 180, type: 'bubble' },
          { id: 'equipamento', title: 'Equipamento', width: 220 },
          { id: 'gas', title: 'Gás', width: 120, type: 'bubble' },
          { id: 'recarga', title: 'Recarga', width: 130 },
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble', options: ['kg', 'g', 'lb'] },
          { id: 'gwp', title: 'GWP', width: 100 },
          { id: 'periodo', title: 'Período', width: 130, type: 'bubble' },
          { id: 'tco2e', title: 'tCO₂e', width: 100 },
        ],
        rows: [
          { unidade_empresa: 'Matriz SP', equipamento: 'Chillers', gas: 'R-410A', recarga: '4,2', unidade: 'kg', gwp: '2.088', periodo: '2025', tco2e: '8,77' },
          { unidade_empresa: 'Fábrica Campinas', equipamento: 'Split corporativo', gas: 'R-32', recarga: '1,8', unidade: 'kg', gwp: '675', periodo: '2025', tco2e: '1,22' },
          { unidade_empresa: 'CD Guarulhos', equipamento: 'Câmara fria', gas: 'R-134a', recarga: '6,5', unidade: 'kg', gwp: '1.430', periodo: '2025', tco2e: '9,30' },
        ],
      },
    ],
  },
  {
    id: 'combustao-estacionaria',
    label: 'Combustão estacionária',
    icon: Flame,
    scope: 1,
    hint: 'Envie consumo de gás natural, GLP ou diesel de geradores e caldeiras.',
    initialChat: [
      {
        id: 'ce-1',
        role: 'assistant',
        content: 'Categoria de Combustão estacionária ativa. Envie dados de gás natural, GLP, diesel de geradores ou outros combustíveis fixos.',
        timestamp: t(50),
      },
    ],
    schemas: [
      {
        id: 'gas-natural',
        label: 'Gás natural',
        columns: [
          { id: 'unidade-op', title: 'Unidade', width: 180, type: 'bubble' },
          { id: 'equipamento', title: 'Equipamento', width: 220 },
          { id: 'consumo', title: 'Consumo', width: 130 },
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble', options: ['m³', 'kg', 'litros', 'GJ'] },
          { id: 'periodo', title: 'Período', width: 130, type: 'bubble' },
          { id: 'tco2e', title: 'tCO₂e', width: 100 },
        ],
        rows: [
          { 'unidade-op': 'Fábrica Campinas', equipamento: 'Caldeira principal', consumo: '1.200', unidade: 'm³', periodo: 'Jan/2026', tco2e: '2,4' },
          { 'unidade-op': 'Fábrica Campinas', equipamento: 'Forno industrial', consumo: '', unidade: 'm³', periodo: 'Jan/2026', tco2e: '6,8', _cellStatus: { consumo: 'error' } },
          { 'unidade-op': 'Matriz SP', equipamento: 'Aquecimento refeitório', consumo: '180', unidade: 'm³', periodo: 'Jan/2026', tco2e: '0,36' },
        ],
      },
      {
        id: 'glp',
        label: 'GLP',
        columns: [
          { id: 'unidade-op', title: 'Unidade', width: 180, type: 'bubble' },
          { id: 'equipamento', title: 'Equipamento', width: 220 },
          { id: 'consumo', title: 'Consumo', width: 130 },
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble', options: ['m³', 'kg', 'litros', 'GJ'] },
          { id: 'periodo', title: 'Período', width: 130, type: 'bubble' },
          { id: 'tco2e', title: 'tCO₂e', width: 100 },
        ],
        rows: [
          { 'unidade-op': 'Matriz SP', equipamento: 'Cozinha refeitório', consumo: '340', unidade: 'kg', periodo: 'Jan/2026', tco2e: '1,02' },
          { 'unidade-op': 'CD Guarulhos', equipamento: 'Empilhadeiras', consumo: '820', unidade: 'kg', periodo: 'Jan/2026', tco2e: '2,46' },
        ],
      },
    ],
  },
  {
    id: 'viagens-negocios',
    label: 'Viagens a negócios',
    icon: Plane,
    scope: 3,
    hint: 'Envie dados de voos (origem/destino/classe), hospedagens ou deslocamentos rodoviários.',
    initialChat: [
      {
        id: 'vn-1',
        role: 'assistant',
        content: 'Categoria de Viagens a negócios ativa. Envie dados de voos, hospedagens ou deslocamentos rodoviários.',
        timestamp: t(20),
      },
    ],
    schemas: [
      {
        id: 'voos',
        label: 'Voos',
        columns: [
          { id: 'unidade_empresa', title: 'Unidade', width: 180, type: 'bubble' },
          { id: 'origem', title: 'Origem', width: 180 },
          { id: 'destino', title: 'Destino', width: 180 },
          { id: 'classe', title: 'Classe', width: 120, type: 'bubble' },
          { id: 'viagens', title: 'Viagens', width: 100 },
          { id: 'periodo', title: 'Período', width: 130, type: 'bubble' },
          { id: 'tco2e', title: 'tCO₂e', width: 100 },
        ],
        rows: [
          { unidade_empresa: 'Matriz SP', origem: 'GRU - São Paulo', destino: 'GIG - Rio', classe: 'Econômica', viagens: '18', periodo: 'Q1/2026', tco2e: '2,43' },
          { unidade_empresa: 'Filial BH', origem: 'CNF - Confins', destino: 'GRU - São Paulo', classe: 'Econômica', viagens: '12', periodo: 'Q1/2026', tco2e: '3,72' },
          { unidade_empresa: 'Matriz SP', origem: 'GRU - São Paulo', destino: 'MIA - Miami', classe: 'Executiva', viagens: '4', periodo: 'Q1/2026', tco2e: '12,80' },
          { unidade_empresa: 'Loja Rio de Janeiro', origem: 'SDU - Rio', destino: 'LIS - Lisboa', classe: 'Executiva', viagens: '2', periodo: 'Q1/2026', tco2e: '9,75' },
        ],
      },
      {
        id: 'hospedagem',
        label: 'Hospedagem',
        columns: [
          { id: 'unidade_empresa', title: 'Unidade', width: 180, type: 'bubble' },
          { id: 'cidade', title: 'Cidade', width: 180, type: 'bubble' },
          { id: 'categoria', title: 'Categoria', width: 140, type: 'bubble' },
          { id: 'diarias', title: 'Diárias', width: 100 },
          { id: 'periodo', title: 'Período', width: 130, type: 'bubble' },
          { id: 'tco2e', title: 'tCO₂e', width: 100 },
        ],
        rows: [
          { unidade_empresa: 'Matriz SP', cidade: 'Rio de Janeiro', categoria: '4 estrelas', diarias: '36', periodo: 'Q1/2026', tco2e: '0,52' },
          { unidade_empresa: 'Filial BH', cidade: 'Brasília', categoria: '4 estrelas', diarias: '24', periodo: 'Q1/2026', tco2e: '0,35' },
          { unidade_empresa: 'Loja Rio de Janeiro', cidade: 'Miami', categoria: '5 estrelas', diarias: '12', periodo: 'Q1/2026', tco2e: '0,28' },
        ],
      },
    ],
  },
  {
    id: 'residuos',
    label: 'Resíduos',
    icon: Trash2,
    scope: 3,
    hint: 'Envie volumes por tipo (orgânico, reciclável, perigoso) e destinação final.',
    initialChat: [
      {
        id: 'rs-1',
        role: 'assistant',
        content: 'Categoria de Resíduos ativa. Envie dados por tipo (orgânico, reciclável, perigoso) e destinação.',
        timestamp: t(10),
      },
    ],
    schemas: [
      {
        id: 'por-tipo',
        label: 'Por tipo',
        columns: [
          { id: 'unidade_empresa', title: 'Unidade', width: 180, type: 'bubble' },
          { id: 'tipo', title: 'Tipo de resíduo', width: 200, type: 'bubble' },
          { id: 'destinacao', title: 'Destinação', width: 180, type: 'bubble' },
          { id: 'quantidade', title: 'Quantidade', width: 130 },
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble', options: ['ton', 'kg', 'm³'] },
          { id: 'periodo', title: 'Período', width: 130, type: 'bubble' },
          { id: 'tco2e', title: 'tCO₂e', width: 100 },
        ],
        rows: [
          { unidade_empresa: 'CD Guarulhos', tipo: 'Orgânico', destinacao: 'Aterro sanitário', quantidade: '4,2', unidade: 'ton', periodo: 'Jan/2026', tco2e: '1,96' },
          { unidade_empresa: 'Filial BH', tipo: 'Reciclável misto', destinacao: 'Cooperativa', quantidade: '3,8', unidade: 'ton', periodo: 'Jan/2026', tco2e: '0,42' },
          { unidade_empresa: 'Loja Rio de Janeiro', tipo: 'Perigoso', destinacao: 'Incineração', quantidade: '0,5', unidade: 'ton', periodo: 'Jan/2026', tco2e: '1,59' },
        ],
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
