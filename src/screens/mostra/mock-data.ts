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
  statusHistory?: StatusHistoryItem[]
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
  statusHistory?: StatusHistoryItem[]
}

export type ChatMessage = {
  id: string
  autor: string
  mensagem: string
  data: string
}

export type StatusHistoryItem = {
  status: EmpresaStatus | FornecedorStatus
  data: string
  nota?: string
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
  'aguardando-contrato': { label: 'Aguardando Contrato', color: 'bg-info-surface text-info border-info-border' },
  'elegivel': { label: 'Elegível', color: 'bg-success-surface text-success border-success-border' },
  'nao-elegivel': { label: 'Não Elegível', color: 'bg-destructive-surface text-destructive border-destructive-border' },
  'cadastrado': { label: 'Cadastrado', color: 'bg-success text-success-foreground' },
}

export const FORNECEDOR_STATUS_CONFIG: Record<FornecedorStatus, { label: string; color: string }> = {
  'processo-iniciado': { label: 'Processo Iniciado', color: 'bg-info-surface text-info border-info-border' },
  'aguardando-contrato': { label: 'Aguardando Contrato', color: 'bg-info-surface text-info border-info-border' },
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
  {
    id: 'p5',
    nome: 'AgroVerde Alimentos',
    cnpj: '44.111.222/0001-33',
    tipo: 'empresa',
    status: 'aguardando-revisao-manual',
    dataSolicitacao: '2026-04-04',
  },
  {
    id: 'p6',
    nome: 'GreenAudit Consultoria',
    cnpj: '22.111.333/0001-99',
    tipo: 'fornecedor',
    status: 'aguardando-contrato',
    dataSolicitacao: '2026-04-04',
  },
  {
    id: 'p7',
    nome: 'BioMed Saúde',
    cnpj: '66.333.444/0001-55',
    tipo: 'empresa',
    status: 'aguardando-revisao-manual',
    dataSolicitacao: '2026-04-05',
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
    statusHistory: [
      { status: 'processo-iniciado', data: '2026-04-01', nota: 'Cadastro iniciado via formulário.' },
      { status: 'aguardando-revisao-manual', data: '2026-04-02', nota: 'Documentação enviada. Aguardando revisão manual.' },
    ],
    chatHistory: [
      { id: 'c1', autor: 'IA', mensagem: 'Olá! Vou ajudar você a cadastrar sua empresa no programa Mostra Sua Pegada. Qual é o nome da empresa?', data: '2026-04-01' },
      { id: 'c2', autor: 'Empresa', mensagem: 'Verde Embalagens Ltda.', data: '2026-04-01' },
      { id: 'c3', autor: 'IA', mensagem: 'Perfeito! Qual o CNPJ da Verde Embalagens Ltda?', data: '2026-04-01' },
      { id: 'c4', autor: 'Empresa', mensagem: '12.345.678/0001-90', data: '2026-04-01' },
      { id: 'c5', autor: 'IA', mensagem: 'Ótimo. Qual o setor de atuação da empresa?', data: '2026-04-01' },
      { id: 'c6', autor: 'Empresa', mensagem: 'Embalagens.', data: '2026-04-01' },
      { id: 'c7', autor: 'IA', mensagem: 'Certo. Agora preciso dos dados do responsável. Qual o nome completo?', data: '2026-04-01' },
      { id: 'c8', autor: 'Empresa', mensagem: 'Ana Souza, Diretora de Sustentabilidade.', data: '2026-04-01' },
      { id: 'c9', autor: 'IA', mensagem: 'E o e-mail e telefone de contato?', data: '2026-04-01' },
      { id: 'c10', autor: 'Empresa', mensagem: 'ana.souza@verdeemb.com.br e (11) 99999-0001.', data: '2026-04-01' },
      { id: 'c11', autor: 'IA', mensagem: 'Cadastro concluído! Seus dados foram enviados para revisão manual. Em breve você receberá um retorno.', data: '2026-04-01' },
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
    statusHistory: [
      { status: 'processo-iniciado', data: '2026-04-02', nota: 'Cadastro iniciado via formulário.' },
      { status: 'aguardando-revisao-manual', data: '2026-04-02', nota: 'Dados submetidos. Aguardando revisão.' },
    ],
    chatHistory: [
      { id: 'c12', autor: 'IA', mensagem: 'Olá! Vou ajudar a cadastrar sua empresa. Qual o nome?', data: '2026-04-02' },
      { id: 'c13', autor: 'Empresa', mensagem: 'NaturaDrop S.A.', data: '2026-04-02' },
      { id: 'c14', autor: 'IA', mensagem: 'Qual o CNPJ?', data: '2026-04-02' },
      { id: 'c15', autor: 'Empresa', mensagem: '98.765.432/0001-11', data: '2026-04-02' },
      { id: 'c16', autor: 'IA', mensagem: 'Setor de atuação?', data: '2026-04-02' },
      { id: 'c17', autor: 'Empresa', mensagem: 'Cosméticos.', data: '2026-04-02' },
      { id: 'c18', autor: 'IA', mensagem: 'Nome do responsável e cargo?', data: '2026-04-02' },
      { id: 'c19', autor: 'Empresa', mensagem: 'Carlos Lima, CEO.', data: '2026-04-02' },
      { id: 'c20', autor: 'IA', mensagem: 'E-mail de contato?', data: '2026-04-02' },
      { id: 'c21', autor: 'Empresa', mensagem: 'carlos@naturadrop.com', data: '2026-04-02' },
      { id: 'c22', autor: 'IA', mensagem: 'Tudo certo! Cadastro enviado para análise.', data: '2026-04-02' },
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
  {
    id: 'e7',
    nome: 'AgroVerde Alimentos',
    cnpj: '44.111.222/0001-33',
    setor: 'Agronegócio',
    responsavel: 'Lucia Barbosa',
    cargo: 'Diretora de ESG',
    email: 'lucia@agroverde.com.br',
    status: 'processo-iniciado',
    dataEntrada: '2026-04-04',
  },
  {
    id: 'e8',
    nome: 'ClearWater Saneamento',
    cnpj: '55.222.333/0001-44',
    setor: 'Saneamento',
    responsavel: 'Ricardo Nunes',
    cargo: 'Gerente de Sustentabilidade',
    email: 'ricardo@clearwater.com.br',
    status: 'elegivel',
    dataEntrada: '2026-03-28',
  },
  {
    id: 'e9',
    nome: 'BioMed Saúde',
    cnpj: '66.333.444/0001-55',
    setor: 'Saúde',
    responsavel: 'Camila Torres',
    cargo: 'CEO',
    email: 'camila@biomed.com.br',
    status: 'aguardando-contrato',
    dataEntrada: '2026-04-05',
  },
  {
    id: 'e10',
    nome: 'LogiSustenta',
    cnpj: '77.444.555/0001-66',
    setor: 'Logística',
    responsavel: 'Bruno Cardoso',
    cargo: 'Sócio-fundador',
    email: 'bruno@logisustenta.com.br',
    status: 'cadastrado',
    dataEntrada: '2026-02-10',
  },
  {
    id: 'e11',
    nome: 'Renovar Energia',
    cnpj: '88.555.666/0001-77',
    setor: 'Energia',
    responsavel: 'Patricia Moreira',
    cargo: 'Diretora de Operações',
    email: 'patricia@renovarenergia.com',
    status: 'processo-iniciado',
    dataEntrada: '2026-04-06',
  },
  {
    id: 'e12',
    nome: 'Ciclo Verde Reciclagem',
    cnpj: '99.666.777/0001-88',
    setor: 'Reciclagem',
    responsavel: 'Gustavo Pinto',
    cargo: 'Gerente Geral',
    email: 'gustavo@cicloverde.com.br',
    status: 'nao-elegivel',
    dataEntrada: '2026-03-01',
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
    statusHistory: [
      { status: 'processo-iniciado', data: '2026-04-03', nota: 'Sistema automático' },
      { status: 'elegivel', data: '2026-04-03', nota: 'Sistema automático' },
      { status: 'aguardando-contrato', data: '2026-04-04', nota: 'Sistema automático' },
    ],
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
    statusHistory: [
      { status: 'processo-iniciado', data: '2026-03-20', nota: 'Sistema automático' },
      { status: 'elegivel', data: '2026-03-20', nota: 'Sistema automático' },
    ],
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
    statusHistory: [
      { status: 'processo-iniciado', data: '2026-03-05', nota: 'Sistema automático' },
      { status: 'nao-elegivel', data: '2026-03-06', nota: 'Setor incompatível com critérios do programa' },
    ],
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
    statusHistory: [
      { status: 'processo-iniciado', data: '2026-02-15', nota: 'Sistema automático' },
      { status: 'elegivel', data: '2026-02-15', nota: 'Sistema automático' },
      { status: 'aguardando-contrato', data: '2026-02-20', nota: 'Sistema automático' },
      { status: 'cadastrado', data: '2026-03-01', nota: 'Contrato assinado e cadastro finalizado' },
    ],
  },
  {
    id: 'f5',
    nome: 'GreenAudit Consultoria',
    cnpj: '22.111.333/0001-99',
    site: 'www.greenaudit.com.br',
    responsavel: 'Fernanda Lopes',
    cargo: 'Sócia',
    email: 'fernanda@greenaudit.com.br',
    clientesIndicados: ['NaturaDrop S.A.', 'AgroVerde Alimentos'],
    status: 'processo-iniciado',
    dataEntrada: '2026-04-04',
    statusHistory: [
      { status: 'processo-iniciado', data: '2026-04-04', nota: 'Sistema automático' },
    ],
  },
  {
    id: 'f6',
    nome: 'SolarTech Energia',
    cnpj: '33.222.444/0001-11',
    site: 'www.solartech.com.br',
    responsavel: 'Eduardo Campos',
    cargo: 'Diretor Técnico',
    email: 'eduardo@solartech.com.br',
    clientesIndicados: ['Renovar Energia'],
    status: 'elegivel',
    dataEntrada: '2026-03-22',
    statusHistory: [
      { status: 'processo-iniciado', data: '2026-03-22', nota: 'Sistema automático' },
      { status: 'elegivel', data: '2026-03-22', nota: 'Sistema automático' },
    ],
  },
  {
    id: 'f7',
    nome: 'AquaPura Tratamento',
    cnpj: '44.333.555/0001-22',
    responsavel: 'Vanessa Rocha',
    cargo: 'Gerente de Projetos',
    email: 'vanessa@aquapura.com.br',
    clientesIndicados: [],
    status: 'aguardando-contrato',
    dataEntrada: '2026-04-05',
    statusHistory: [
      { status: 'processo-iniciado', data: '2026-04-05', nota: 'Sistema automático' },
      { status: 'elegivel', data: '2026-04-05', nota: 'Sistema automático' },
      { status: 'aguardando-contrato', data: '2026-04-06', nota: 'Sistema automático' },
    ],
  },
  {
    id: 'f8',
    nome: 'CircularHub',
    cnpj: '55.444.666/0001-33',
    site: 'www.circularhub.com.br',
    responsavel: 'Rafael Cunha',
    cargo: 'CEO',
    email: 'rafael@circularhub.com.br',
    clientesIndicados: ['Ciclo Verde Reciclagem', 'BioMed Saúde'],
    status: 'cadastrado',
    dataEntrada: '2026-02-08',
    statusHistory: [
      { status: 'processo-iniciado', data: '2026-02-08', nota: 'Sistema automático' },
      { status: 'elegivel', data: '2026-02-08', nota: 'Sistema automático' },
      { status: 'aguardando-contrato', data: '2026-02-12', nota: 'Sistema automático' },
      { status: 'cadastrado', data: '2026-02-20', nota: 'Contrato assinado e cadastro finalizado' },
    ],
  },
  {
    id: 'f9',
    nome: 'EcoMetrics Analytics',
    cnpj: '66.555.777/0001-44',
    site: 'www.ecometrics.com.br',
    responsavel: 'Isabela Mendes',
    cargo: 'Head de Dados',
    email: 'isabela@ecometrics.com.br',
    clientesIndicados: ['LogiSustenta', 'ClearWater Saneamento'],
    status: 'nao-elegivel',
    dataEntrada: '2026-03-12',
    statusHistory: [
      { status: 'processo-iniciado', data: '2026-03-12', nota: 'Sistema automático' },
      { status: 'nao-elegivel', data: '2026-03-13', nota: 'Documentação insuficiente para elegibilidade' },
    ],
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

export const PAGE_SIZE = 5

// --------------- Utils ---------------

export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
