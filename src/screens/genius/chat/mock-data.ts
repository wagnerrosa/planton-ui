import { Truck, Flame, Zap, Snowflake, Plane, Trash2, type LucideIcon } from 'lucide-react'

export type SchemaColumn = {
  id: string
  title: string
  width: number
  type?: 'text' | 'bubble'
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
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  hasInventoryData?: boolean
  timestamp: Date
}

export type EmissionCategory = {
  id: string
  label: string
  icon: LucideIcon
  hint: string
  schemas: TableSchema[]
  initialChat: ChatMessage[]
}

const now = new Date()
const t = (offsetMin: number) => new Date(now.getTime() - offsetMin * 60_000)

const UNIDADES_EMPRESA = [
  'Matriz SP', 'CD Guarulhos', 'Loja Rio de Janeiro', 'Filial BH',
  'Fábrica Campinas', 'CD Cajamar', 'CD Recife', 'Loja Santos', 'Loja Campinas',
]

function buildCombustaoMovelLitros(): SchemaRow[] {
  const veiculos = [
    'Frota leve', 'Frota leve', 'Frota leve',
    'Caminhões', 'Caminhões', 'Caminhões',
    'Geradores', 'Geradores', 'Geradores',
    'Frota executiva', 'Vans logística', 'Empilhadeiras a diesel',
    'Caminhão coleta', 'Caminhão coleta', 'Frota comercial',
    'Frota comercial', 'Frota técnica', 'Frota de apoio',
    'Caminhões leves', 'Caminhões pesados',
  ]
  const combustiveis = [
    { nome: 'Diesel S10', fator: '2,67 kg/L', mult: 2.67 },
    { nome: 'Diesel S500', fator: '2,68 kg/L', mult: 2.68 },
    { nome: 'Gasolina', fator: '2,21 kg/L', mult: 2.21 },
    { nome: 'Etanol', fator: '1,52 kg/L', mult: 1.52 },
    { nome: 'GNV', fator: '1,87 kg/m³', mult: 1.87 },
    { nome: 'Biodiesel B10', fator: '2,40 kg/L', mult: 2.40 },
  ]
  const responsaveis = [
    'Carlos Mendes', 'Patrícia Souza', 'Diego Martins', 'Ana Beatriz Lima',
    'Roberto Carvalho', 'Juliana Pereira', 'Fernando Alves', 'Camila Rodrigues',
    'Marcos Oliveira', 'Beatriz Santos',
  ]
  const periodos = [
    'Jan/2026', 'Fev/2026', 'Mar/2026', 'Abr/2026', 'Mai/2026', 'Jun/2026',
    'Jul/2026', 'Ago/2026', 'Set/2026', 'Out/2025', 'Nov/2025', 'Dez/2025',
  ]
  const statusOpts = ['Validado', 'Validado', 'Validado', 'Em revisão', 'Pendente']

  const rows: SchemaRow[] = []
  for (let i = 0; i < 100; i++) {
    const veiculo = veiculos[i % veiculos.length]
    const comb = combustiveis[i % combustiveis.length]
    const qtdNum = 500 + ((i * 137) % 28000)
    const tco2eNum = (qtdNum * comb.mult) / 1000
    const responsavel = responsaveis[i % responsaveis.length]
    const periodo = periodos[i % periodos.length]
    const status = statusOpts[i % statusOpts.length]

    const row: SchemaRow = {
      unidade_empresa: UNIDADES_EMPRESA[i % UNIDADES_EMPRESA.length],
      veiculo,
      combustivel: comb.nome,
      quantidade: qtdNum.toLocaleString('pt-BR'),
      unidade: comb.nome === 'GNV' ? 'm³' : 'litros',
      periodo,
      fator: comb.fator,
      tco2e: tco2eNum.toLocaleString('pt-BR', { maximumFractionDigits: 2 }),
      responsavel,
      status,
    }

    // Sprinkle errors/warnings deterministically (~12% rows)
    if (i % 17 === 3) {
      row.quantidade = ''
      row.tco2e = ''
      row._cellStatus = { quantidade: 'error', tco2e: 'error' }
      row.status = 'Pendente'
    } else if (i % 23 === 7) {
      row._cellStatus = { fator: 'warning' }
      row.status = 'Em revisão'
    } else if (i % 31 === 5) {
      row.responsavel = ''
      row._cellStatus = { responsavel: 'error' }
      row.status = 'Pendente'
    } else if (i % 29 === 11) {
      row._cellStatus = { periodo: 'warning' }
      row.status = 'Em revisão'
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
          { id: 'unidade_empresa', title: 'Unidade', width: 180, type: 'bubble' },
          { id: 'veiculo', title: 'Veículo', width: 200 },
          { id: 'combustivel', title: 'Combustível', width: 140, type: 'bubble' },
          { id: 'quantidade', title: 'Quantidade', width: 130 },
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble' },
          { id: 'periodo', title: 'Período', width: 130, type: 'bubble' },
          { id: 'fator', title: 'Fator', width: 130 },
          { id: 'tco2e', title: 'tCO₂e', width: 100 },
          { id: 'responsavel', title: 'Responsável', width: 160 },
          { id: 'status', title: 'Status', width: 130 },
        ],
        rows: buildCombustaoMovelLitros(),
      },
      {
        id: 'km',
        label: 'Por quilometragem',
        columns: [
          { id: 'unidade_empresa', title: 'Unidade', width: 180, type: 'bubble' },
          { id: 'veiculo', title: 'Veículo', width: 200 },
          { id: 'tipo', title: 'Tipo', width: 140, type: 'bubble' },
          { id: 'km', title: 'Distância', width: 130 },
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble' },
          { id: 'periodo', title: 'Período', width: 130, type: 'bubble' },
          { id: 'fator', title: 'Fator', width: 130 },
          { id: 'tco2e', title: 'tCO₂e', width: 100 },
          { id: 'observacoes', title: 'Observações', width: 260 },
        ],
        rows: [
          { unidade_empresa: 'Matriz SP', veiculo: 'Frota leve', tipo: 'Veículo leve', km: '124.500', unidade: 'km', periodo: 'Jan/2026', fator: '0,17 kg/km', tco2e: '21,17', observacoes: 'Média urbana SP' },
          { unidade_empresa: 'CD Guarulhos', veiculo: 'Caminhões médios', tipo: 'Médio porte', km: '85.200', unidade: 'km', periodo: 'Jan/2026', fator: '0,42 kg/km', tco2e: '35,78', observacoes: 'Rotas regionais', _cellStatus: { observacoes: 'warning' } },
          { unidade_empresa: 'CD Cajamar', veiculo: 'Caminhões pesados', tipo: 'Pesado', km: '42.300', unidade: 'km', periodo: 'Jan/2026', fator: '0,78 kg/km', tco2e: '32,99', observacoes: 'Interestadual' },
          { unidade_empresa: 'Loja Rio de Janeiro', veiculo: 'Motos entrega', tipo: 'Motocicleta', km: '18.400', unidade: 'km', periodo: 'Jan/2026', fator: '0,074 kg/km', tco2e: '1,36', observacoes: 'Last mile' },
        ],
      },
      {
        id: 'origem-destino',
        label: 'Origem → Destino',
        columns: [
          { id: 'unidade_empresa', title: 'Unidade', width: 180, type: 'bubble' },
          { id: 'origem', title: 'Origem', width: 220 },
          { id: 'destino', title: 'Destino', width: 220 },
          { id: 'veiculo', title: 'Veículo', width: 160, type: 'bubble' },
          { id: 'viagens', title: 'Viagens', width: 100 },
          { id: 'kmCalculado', title: 'Km calculado', width: 140 },
          { id: 'periodo', title: 'Período', width: 130, type: 'bubble' },
          { id: 'tco2e', title: 'tCO₂e', width: 100 },
        ],
        rows: [
          { unidade_empresa: 'CD Guarulhos', origem: 'CD Guarulhos', destino: 'Loja Santos', veiculo: 'Caminhão médio', viagens: '24', kmCalculado: '1.872', periodo: 'Jan/2026', tco2e: '0,79' },
          { unidade_empresa: 'CD Guarulhos', origem: 'CD Guarulhos', destino: 'Loja Campinas', veiculo: 'Caminhão médio', viagens: '32', kmCalculado: '3.200', periodo: 'Jan/2026', tco2e: '1,34' },
          { unidade_empresa: 'CD Guarulhos', origem: 'CD Guarulhos', destino: 'Loja Rio de Janeiro', veiculo: 'Caminhão pesado', viagens: '12', kmCalculado: '5.220', periodo: 'Jan/2026', tco2e: '4,07' },
          { unidade_empresa: 'Matriz SP', origem: 'Matriz SP', destino: 'Fábrica Campinas', veiculo: 'Veículo leve', viagens: '48', kmCalculado: '4.704', periodo: 'Jan/2026', tco2e: '0,80' },
        ],
      },
    ],
  },
  {
    id: 'energia-eletrica',
    label: 'Energia elétrica',
    icon: Zap,
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
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble' },
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
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble' },
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
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble' },
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
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble' },
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
          { id: 'unidade', title: 'Unidade', width: 100, type: 'bubble' },
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
