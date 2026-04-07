// ============================================================
// Mostra Sua Pegada — Mock Data Central
// ============================================================

// --------------- Types ---------------

export type EmpresaStatus =
  | 'processo-iniciado'
  | 'aguardando-revisao-manual'
  | 'aguardando-contrato'
  | 'elegivel'
  | 'nao-elegivel'
  | 'cadastrado'

export type FornecedorStatus =
  | 'processo-iniciado'
  | 'aguardando-contrato'
  | 'elegivel'
  | 'nao-elegivel'
  | 'cadastrado'

export type Empresa = {
  id: string
  nome: string
  cnpj: string
  setor: string
  responsavel: string
  cargo: string
  email: string
  telefone?: string
  status: EmpresaStatus
  dataEntrada: string
  logoUrl?: string
  documentoUrl?: string
  chatHistory?: ChatMessage[]
}

export type Fornecedor = {
  id: string
  nome: string
  cnpj: string
  site?: string
  responsavel: string
  cargo: string
  email: string
  telefone?: string
  clientesIndicados: string[]
  status: FornecedorStatus
  dataEntrada: string
  logoUrl?: string
}

export type ChatMessage = {
  id: string
  autor: string
  mensagem: string
  data: string
}

export type PendenciaItem = {
  id: string
  nome: string
  cnpj: string
  tipo: 'empresa' | 'fornecedor'
  status: EmpresaStatus | FornecedorStatus
  dataSolicitacao: string
}

export type MostraKpi = {
  label: string
  value: string
  change: string
  period: string
  trend: 'up' | 'down' | 'neutral'
}

export type ChartDataPoint = {
  mes: string
  empresas: number
  fornecedores: number
}

export type RecusaDataPoint = {
  motivo: string
  quantidade: number
  fill: string
}

// --------------- Status Labels & Colors ---------------

export const EMPRESA_STATUS_CONFIG: Record<EmpresaStatus, { label: string; color: string }> = {
  'processo-iniciado': { label: 'Processo Iniciado', color: 'bg-info-surface text-info border-info-border' },
  'aguardando-revisao-manual': { label: 'Aguardando Revisão', color: 'bg-warning-surface text-warning border-warning-border' },
  'aguardando-contrato': { label: 'Aguardando Contrato', color: 'bg-secondary text-secondary-foreground' },
  'elegivel': { label: 'Elegível', color: 'bg-success-surface text-success border-success-border' },
  'nao-elegivel': { label: 'Não Elegível', color: 'bg-destructive-surface text-destructive border-destructive-border' },
  'cadastrado': { label: 'Cadastrado', color: 'bg-success text-success-foreground' },
}

export const FORNECEDOR_STATUS_CONFIG: Record<FornecedorStatus, { label: string; color: string }> = {
  'processo-iniciado': { label: 'Processo Iniciado', color: 'bg-info-surface text-info border-info-border' },
  'aguardando-contrato': { label: 'Aguardando Contrato', color: 'bg-secondary text-secondary-foreground' },
  'elegivel': { label: 'Elegível', color: 'bg-success-surface text-success border-success-border' },
  'nao-elegivel': { label: 'Não Elegível', color: 'bg-destructive-surface text-destructive border-destructive-border' },
  'cadastrado': { label: 'Cadastrado', color: 'bg-success text-success-foreground' },
}

// --------------- KPIs ---------------

export const MOSTRA_KPIS: MostraKpi[] = [
  { label: 'Total Solicitantes', value: '47', change: '+12%', period: 'vs. mês anterior', trend: 'up' },
  { label: 'Sol. Empresas', value: '18', change: '+8%', period: 'vs. mês anterior', trend: 'up' },
  { label: 'Sol. Fornecedores', value: '21', change: '+15%', period: 'vs. mês anterior', trend: 'up' },
  { label: 'Não Adequados', value: '4', change: '-2%', period: 'vs. mês anterior', trend: 'down' },
]

// --------------- Chart Data ---------------

export const SOLICITANTES_POR_MES: ChartDataPoint[] = [
  { mes: 'Jan', empresas: 3, fornecedores: 4 },
  { mes: 'Fev', empresas: 5, fornecedores: 6 },
  { mes: 'Mar', empresas: 4, fornecedores: 8 },
  { mes: 'Abr', empresas: 7, fornecedores: 5 },
  { mes: 'Mai', empresas: 9, fornecedores: 11 },
  { mes: 'Jun', empresas: 6, fornecedores: 9 },
  { mes: 'Jul', empresas: 8, fornecedores: 7 },
  { mes: 'Ago', empresas: 11, fornecedores: 13 },
  { mes: 'Set', empresas: 10, fornecedores: 12 },
  { mes: 'Out', empresas: 14, fornecedores: 15 },
  { mes: 'Nov', empresas: 12, fornecedores: 14 },
  { mes: 'Dez', empresas: 18, fornecedores: 21 },
]

export const MOTIVOS_RECUSA: RecusaDataPoint[] = [
  { motivo: 'Não Compatível', quantidade: 38, fill: 'var(--destructive)' },
  { motivo: 'Não Adequado', quantidade: 27, fill: 'var(--planton-muted)' },
  { motivo: 'Sem Adequação', quantidade: 21, fill: 'var(--info)' },
  { motivo: 'Outros', quantidade: 14, fill: 'var(--planton-accent)' },
]

// --------------- Pendências ---------------

export const PENDENCIAS: PendenciaItem[] = [
  {
    id: 'p1',
    nome: 'Verde Embalagens Ltda',
    cnpj: '12.345.678/0001-90',
    tipo: 'empresa',
    status: 'aguardando-revisao-manual',
    dataSolicitacao: '2026-04-01',
  },
  {
    id: 'p2',
    nome: 'NaturaDrop S.A.',
    cnpj: '98.765.432/0001-11',
    tipo: 'empresa',
    status: 'aguardando-revisao-manual',
    dataSolicitacao: '2026-04-02',
  },
  {
    id: 'p3',
    nome: 'BioClean Produtos',
    cnpj: '11.222.333/0001-44',
    tipo: 'fornecedor',
    status: 'aguardando-contrato',
    dataSolicitacao: '2026-04-03',
  },
  {
    id: 'p4',
    nome: 'GreenCarbon Consultancy',
    cnpj: '55.666.777/0001-88',
    tipo: 'empresa',
    status: 'aguardando-contrato',
    dataSolicitacao: '2026-04-03',
  },
]

// --------------- Empresas ---------------

export const EMPRESAS: Empresa[] = [
  {
    id: 'e1',
    nome: 'Verde Embalagens Ltda',
    cnpj: '12.345.678/0001-90',
    setor: 'Embalagens',
    responsavel: 'Ana Souza',
    cargo: 'Diretora de Sustentabilidade',
    email: 'ana.souza@verdeemb.com.br',
    telefone: '(11) 99999-0001',
    status: 'aguardando-revisao-manual',
    dataEntrada: '2026-04-01',
    chatHistory: [
      { id: 'c1', autor: 'Sistema', mensagem: 'Cadastro iniciado via formulário.', data: '2026-04-01' },
      { id: 'c2', autor: 'Admin', mensagem: 'Documentação recebida. Em análise.', data: '2026-04-02' },
    ],
  },
  {
    id: 'e2',
    nome: 'NaturaDrop S.A.',
    cnpj: '98.765.432/0001-11',
    setor: 'Cosméticos',
    responsavel: 'Carlos Lima',
    cargo: 'CEO',
    email: 'carlos@naturadrop.com',
    status: 'aguardando-revisao-manual',
    dataEntrada: '2026-04-02',
    chatHistory: [
      { id: 'c3', autor: 'Sistema', mensagem: 'Cadastro iniciado.', data: '2026-04-02' },
    ],
  },
  {
    id: 'e3',
    nome: 'EcoTex Têxtil',
    cnpj: '22.333.444/0001-55',
    setor: 'Têxtil',
    responsavel: 'Mariana Costa',
    cargo: 'Gerente de ESG',
    email: 'mariana@ecotex.com.br',
    status: 'elegivel',
    dataEntrada: '2026-03-15',
  },
  {
    id: 'e4',
    nome: 'GreenCarbon Consultancy',
    cnpj: '55.666.777/0001-88',
    setor: 'Consultoria',
    responsavel: 'Pedro Alves',
    cargo: 'Sócio',
    email: 'pedro@greencarbon.com',
    status: 'aguardando-contrato',
    dataEntrada: '2026-04-03',
  },
  {
    id: 'e5',
    nome: 'Plasteco Indústria',
    cnpj: '77.888.999/0001-22',
    setor: 'Plásticos',
    responsavel: 'Roberta Ferreira',
    cargo: 'Diretora Industrial',
    email: 'roberta@plasteco.com.br',
    status: 'nao-elegivel',
    dataEntrada: '2026-03-10',
  },
  {
    id: 'e6',
    nome: 'SustentaBio',
    cnpj: '33.444.555/0001-66',
    setor: 'Biotecnologia',
    responsavel: 'Felipe Santos',
    cargo: 'Head de Inovação',
    email: 'felipe@sustentabio.com',
    status: 'cadastrado',
    dataEntrada: '2026-02-20',
  },
]

// --------------- Fornecedores ---------------

export const FORNECEDORES: Fornecedor[] = [
  {
    id: 'f1',
    nome: 'BioClean Produtos',
    cnpj: '11.222.333/0001-44',
    site: 'www.bioclean.com.br',
    responsavel: 'Juliana Ramos',
    cargo: 'Gerente Comercial',
    email: 'juliana@bioclean.com.br',
    clientesIndicados: ['EcoTex Têxtil', 'SustentaBio'],
    status: 'aguardando-contrato',
    dataEntrada: '2026-04-03',
  },
  {
    id: 'f2',
    nome: 'ReciclaMax',
    cnpj: '44.555.666/0001-77',
    site: 'www.reciclamax.com',
    responsavel: 'Thiago Melo',
    cargo: 'Diretor',
    email: 'thiago@reciclamax.com',
    clientesIndicados: ['Verde Embalagens Ltda'],
    status: 'elegivel',
    dataEntrada: '2026-03-20',
  },
  {
    id: 'f3',
    nome: 'EcoLogis Transporte',
    cnpj: '66.777.888/0001-33',
    responsavel: 'Sandra Oliveira',
    cargo: 'Sócia-diretora',
    email: 'sandra@ecologis.com.br',
    clientesIndicados: ['Plasteco Indústria'],
    status: 'nao-elegivel',
    dataEntrada: '2026-03-05',
  },
  {
    id: 'f4',
    nome: 'CarbonNeutral Serviços',
    cnpj: '88.999.000/0001-55',
    site: 'www.carbonneutral.com',
    responsavel: 'Marcos Vieira',
    cargo: 'CEO',
    email: 'marcos@carbonneutral.com',
    clientesIndicados: ['GreenCarbon Consultancy', 'EcoTex Têxtil'],
    status: 'cadastrado',
    dataEntrada: '2026-02-15',
  },
]

// --------------- Configurações ---------------

export const SETORES_CONTROVERSOS = [
  'Petroquímica',
  'Mineração de Carvão',
  'Armamentos',
  'Tabaco',
  'Apostas',
]

export const EMPRESAS_CLIENTES = [
  'Nude Sustentabilidade',
  'Instituto Clima',
  'ESG Partners',
]

export const CONSULTORIAS_PARCEIRAS = [
  'GreenCarbon Consultancy',
  'SustentaBio',
]

// --------------- Constants ---------------

export const PAGE_SIZE = 10

// --------------- Utils ---------------

export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
