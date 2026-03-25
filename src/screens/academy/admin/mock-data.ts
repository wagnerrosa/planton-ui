// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ClientStatus = 'ativo' | 'suspenso' | 'sem-voucher' | 'inativo' | 'expirado'
export type VoucherStatus = 'ativo' | 'usado' | 'expirado' | 'revogado'
export type ContentType = 'video' | 'artigo' | 'podcast' | 'guia'
export type ContentScope = 'global' | 'exclusivo'
export type TrailStatus = 'rascunho' | 'em-breve' | 'ativa'
export type TrailVisibility = 'global' | 'exclusiva'
export type MemberRole = 'aluno' | 'gestor-master'

export type AdminKPI = {
  label: string
  value: string
  change: string
  period: string
  trend: 'up' | 'down' | 'neutral'
}

export type Client = {
  id: string
  name: string
  cnpj: string
  domains: string[]
  status: ClientStatus
  totalUsers: number
  totalHours: number
  totalCertificates: number
  trailsCompleted: number
  plan: {
    name: string
    expiration: string
    daysRemaining: number
  }
  members: Member[]
}

export type Member = {
  id: string
  name: string
  email: string
  role: MemberRole
}

export type Voucher = {
  id: string
  code: string
  clientName: string
  clientId: string
  status: VoucherStatus
  activationDeadline: string
  planDuration: string
  domains: string[]
  createdAt: string
}

export type CatalogContent = {
  id: string
  title: string
  type: ContentType
  scope: ContentScope
  clients: string[]
  status: 'publicado' | 'rascunho' | 'agendado'
  quizEnabled: boolean
  views: number
  totalHours: number
}

export type AdminTrail = {
  id: string
  title: string
  description: string
  status: TrailStatus
  visibility: TrailVisibility
  contents: string[]
  quizEnabled: boolean
  clients: string[]
  createdAt: string
}

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

// ---------------------------------------------------------------------------
// Mock KPIs
// ---------------------------------------------------------------------------

export const ADMIN_KPIS: AdminKPI[] = [
  { label: 'Empresas ativas', value: '24', change: '+3', period: 'últimos 30 dias', trend: 'up' },
  { label: 'Usuários totais', value: '1.847', change: '+142', period: 'últimos 30 dias', trend: 'up' },
  { label: 'Horas consumidas', value: '3.521h', change: '+18%', period: 'vs. mês anterior', trend: 'up' },
  { label: 'Certificados emitidos', value: '489', change: '+67', period: 'últimos 30 dias', trend: 'up' },
  { label: 'Quizzes respondidos', value: '2.103', change: '+12%', period: 'vs. mês anterior', trend: 'up' },
  { label: 'Trilhas ativas', value: '18', change: '0', period: 'sem variação', trend: 'neutral' },
]

// ---------------------------------------------------------------------------
// Mock Clients
// ---------------------------------------------------------------------------

const MEMBERS_AGRO: Member[] = [
  { id: 'm1', name: 'Carlos Silva', email: 'carlos@agrotech.com.br', role: 'gestor-master' },
  { id: 'm2', name: 'Ana Oliveira', email: 'ana@agrotech.com.br', role: 'aluno' },
  { id: 'm3', name: 'Pedro Santos', email: 'pedro@agrotech.com.br', role: 'aluno' },
  { id: 'm4', name: 'Mariana Costa', email: 'mariana@agrotech.com.br', role: 'aluno' },
]

const MEMBERS_VERDE: Member[] = [
  { id: 'm5', name: 'Fernanda Lima', email: 'fernanda@verdecampo.com.br', role: 'gestor-master' },
  { id: 'm6', name: 'Lucas Mendes', email: 'lucas@verdecampo.com.br', role: 'aluno' },
  { id: 'm7', name: 'Juliana Ferreira', email: 'juliana@verdecampo.com.br', role: 'aluno' },
]

const MEMBERS_ECO: Member[] = [
  { id: 'm8', name: 'Roberto Almeida', email: 'roberto@ecoplantar.com.br', role: 'gestor-master' },
  { id: 'm9', name: 'Patricia Rocha', email: 'patricia@ecoplantar.com.br', role: 'aluno' },
]

const MEMBERS_SUSTENTA: Member[] = [
  { id: 'm10', name: 'Thiago Barbosa', email: 'thiago@sustentagro.com.br', role: 'gestor-master' },
  { id: 'm11', name: 'Camila Ribeiro', email: 'camila@sustentagro.com.br', role: 'aluno' },
  { id: 'm12', name: 'Diego Martins', email: 'diego@sustentagro.com.br', role: 'aluno' },
  { id: 'm13', name: 'Bruna Souza', email: 'bruna@sustentagro.com.br', role: 'aluno' },
  { id: 'm14', name: 'Rafael Nunes', email: 'rafael@sustentagro.com.br', role: 'aluno' },
]

export const CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'AgroTech Solutions',
    cnpj: '12.345.678/0001-90',
    domains: ['agrotech.com.br'],
    status: 'ativo',
    totalUsers: 312,
    totalHours: 845,
    totalCertificates: 89,
    trailsCompleted: 156,
    plan: { name: 'Enterprise', expiration: '2026-08-15', daysRemaining: 144 },
    members: MEMBERS_AGRO,
  },
  {
    id: 'c2',
    name: 'Verde Campo Agro',
    cnpj: '23.456.789/0001-01',
    domains: ['verdecampo.com.br', 'vc-agro.com.br'],
    status: 'ativo',
    totalUsers: 187,
    totalHours: 523,
    totalCertificates: 45,
    trailsCompleted: 92,
    plan: { name: 'Professional', expiration: '2026-04-10', daysRemaining: 17 },
    members: MEMBERS_VERDE,
  },
  {
    id: 'c3',
    name: 'EcoPlantAR',
    cnpj: '34.567.890/0001-12',
    domains: ['ecoplantar.com.br'],
    status: 'expirado',
    totalUsers: 56,
    totalHours: 134,
    totalCertificates: 12,
    trailsCompleted: 28,
    plan: { name: 'Starter', expiration: '2026-02-28', daysRemaining: 0 },
    members: MEMBERS_ECO,
  },
  {
    id: 'c4',
    name: 'SustentAgro',
    cnpj: '45.678.901/0001-23',
    domains: ['sustentagro.com.br'],
    status: 'ativo',
    totalUsers: 489,
    totalHours: 1203,
    totalCertificates: 178,
    trailsCompleted: 312,
    plan: { name: 'Enterprise', expiration: '2026-12-01', daysRemaining: 252 },
    members: MEMBERS_SUSTENTA,
  },
  {
    id: 'c5',
    name: 'Bio Fazendas Ltda',
    cnpj: '56.789.012/0001-34',
    domains: ['biofazendas.com.br'],
    status: 'ativo',
    totalUsers: 98,
    totalHours: 267,
    totalCertificates: 34,
    trailsCompleted: 51,
    plan: { name: 'Professional', expiration: '2026-05-20', daysRemaining: 57 },
    members: [
      { id: 'm15', name: 'Amanda Lopes', email: 'amanda@biofazendas.com.br', role: 'gestor-master' },
      { id: 'm16', name: 'Gustavo Pereira', email: 'gustavo@biofazendas.com.br', role: 'aluno' },
    ],
  },
  {
    id: 'c6',
    name: 'Cerrado Sustentável',
    cnpj: '67.890.123/0001-45',
    domains: ['cerradosustentavel.com.br'],
    status: 'ativo',
    totalUsers: 215,
    totalHours: 612,
    totalCertificates: 67,
    trailsCompleted: 134,
    plan: { name: 'Enterprise', expiration: '2026-04-02', daysRemaining: 9 },
    members: [
      { id: 'm17', name: 'Renata Campos', email: 'renata@cerradosustentavel.com.br', role: 'gestor-master' },
    ],
  },
  {
    id: 'c7',
    name: 'Pampa Agropecuária',
    cnpj: '78.901.234/0001-56',
    domains: ['pampaagro.com.br'],
    status: 'ativo',
    totalUsers: 142,
    totalHours: 389,
    totalCertificates: 28,
    trailsCompleted: 67,
    plan: { name: 'Professional', expiration: '2026-07-30', daysRemaining: 128 },
    members: [
      { id: 'm18', name: 'Eduardo Vieira', email: 'eduardo@pampaagro.com.br', role: 'gestor-master' },
    ],
  },
  {
    id: 'c8',
    name: 'Mata Atlântica Foods',
    cnpj: '89.012.345/0001-67',
    domains: ['mataatlantica.com.br'],
    status: 'ativo',
    totalUsers: 348,
    totalHours: 947,
    totalCertificates: 136,
    trailsCompleted: 245,
    plan: { name: 'Enterprise', expiration: '2026-11-15', daysRemaining: 236 },
    members: [
      { id: 'm19', name: 'Isabela Santos', email: 'isabela@mataatlantica.com.br', role: 'gestor-master' },
    ],
  },
  {
    id: 'c9',
    name: 'Agro Norte Sementes',
    cnpj: '90.123.456/0001-78',
    domains: ['agronorte.com.br'],
    status: 'sem-voucher',
    totalUsers: 0,
    totalHours: 0,
    totalCertificates: 0,
    trailsCompleted: 0,
    plan: { name: '—', expiration: '—', daysRemaining: 0 },
    members: [
      { id: 'm20', name: 'Marcos Tavares', email: 'marcos@agronorte.com.br', role: 'gestor-master' },
    ],
  },
  {
    id: 'c10',
    name: 'Fazendas Reunidas do Sul',
    cnpj: '01.234.567/0001-89',
    domains: ['fazendassul.com.br'],
    status: 'inativo',
    totalUsers: 23,
    totalHours: 45,
    totalCertificates: 5,
    trailsCompleted: 8,
    plan: { name: 'Starter', expiration: '2025-12-31', daysRemaining: 0 },
    members: [
      { id: 'm21', name: 'Letícia Moura', email: 'leticia@fazendassul.com.br', role: 'gestor-master' },
    ],
  },
  {
    id: 'c11',
    name: 'Cerealista Planalto',
    cnpj: '11.222.333/0001-44',
    domains: ['cerealplanalto.com.br'],
    status: 'suspenso',
    totalUsers: 75,
    totalHours: 189,
    totalCertificates: 22,
    trailsCompleted: 34,
    plan: { name: 'Professional', expiration: '2026-06-30', daysRemaining: 98 },
    members: [
      { id: 'm22', name: 'André Fonseca', email: 'andre@cerealplanalto.com.br', role: 'gestor-master' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Expiring plans (≤ 30 days)
// ---------------------------------------------------------------------------

export const EXPIRING_PLANS = CLIENTS.filter(
  (c) => c.status === 'ativo' && c.plan.daysRemaining > 0 && c.plan.daysRemaining <= 30
)

// ---------------------------------------------------------------------------
// Mock Vouchers
// ---------------------------------------------------------------------------

export const VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    code: 'PLANTON-2026-AGRO',
    clientName: 'AgroTech Solutions',
    clientId: 'c1',
    status: 'usado',
    activationDeadline: '2026-01-15',
    planDuration: '12 meses',
    domains: ['agrotech.com.br'],
    createdAt: '2025-12-01',
  },
  {
    id: 'v2',
    code: 'PLANTON-2026-VERDE',
    clientName: 'Verde Campo Agro',
    clientId: 'c2',
    status: 'ativo',
    activationDeadline: '2026-06-30',
    planDuration: '6 meses',
    domains: ['verdecampo.com.br', 'vc-agro.com.br'],
    createdAt: '2026-01-10',
  },
  {
    id: 'v3',
    code: 'PLANTON-2026-ECO',
    clientName: 'EcoPlantAR',
    clientId: 'c3',
    status: 'expirado',
    activationDeadline: '2026-02-15',
    planDuration: '6 meses',
    domains: ['ecoplantar.com.br'],
    createdAt: '2025-11-15',
  },
  {
    id: 'v4',
    code: 'PLANTON-2026-SUST',
    clientName: 'SustentAgro',
    clientId: 'c4',
    status: 'usado',
    activationDeadline: '2026-01-01',
    planDuration: '12 meses',
    domains: ['sustentagro.com.br'],
    createdAt: '2025-10-20',
  },
  {
    id: 'v5',
    code: 'PLANTON-2026-BIO',
    clientName: 'Bio Fazendas Ltda',
    clientId: 'c5',
    status: 'ativo',
    activationDeadline: '2026-07-15',
    planDuration: '6 meses',
    domains: ['biofazendas.com.br'],
    createdAt: '2026-02-01',
  },
  {
    id: 'v6',
    code: 'PLANTON-2026-CERR',
    clientName: 'Cerrado Sustentável',
    clientId: 'c6',
    status: 'ativo',
    activationDeadline: '2026-05-01',
    planDuration: '12 meses',
    domains: ['cerradosustentavel.com.br'],
    createdAt: '2026-03-01',
  },
  {
    id: 'v7',
    code: 'PLANTON-2025-TEST',
    clientName: 'Empresa Teste',
    clientId: '',
    status: 'revogado',
    activationDeadline: '2025-12-31',
    planDuration: '3 meses',
    domains: ['teste.com.br'],
    createdAt: '2025-09-01',
  },
]

// ---------------------------------------------------------------------------
// Mock Catalog Content
// ---------------------------------------------------------------------------

export const CATALOG_CONTENT: CatalogContent[] = [
  { id: 'ct1', title: 'Introdução ao GHG Protocol', type: 'video', scope: 'global', clients: [], status: 'publicado', quizEnabled: true, views: 1247, totalHours: 0.5 },
  { id: 'ct2', title: 'Fatores de Emissão - Guia Prático', type: 'guia', scope: 'global', clients: [], status: 'publicado', quizEnabled: false, views: 892, totalHours: 1.2 },
  { id: 'ct3', title: 'ESG na Prática Agrícola', type: 'video', scope: 'global', clients: [], status: 'publicado', quizEnabled: true, views: 2103, totalHours: 0.75 },
  { id: 'ct4', title: 'Podcast: Futuro Sustentável', type: 'podcast', scope: 'global', clients: [], status: 'publicado', quizEnabled: false, views: 756, totalHours: 0.8 },
  { id: 'ct5', title: 'Carbono no Solo', type: 'artigo', scope: 'global', clients: [], status: 'publicado', quizEnabled: false, views: 634, totalHours: 0.3 },
  { id: 'ct6', title: 'Inventário de Emissões Scope 1', type: 'video', scope: 'exclusivo', clients: ['AgroTech Solutions', 'SustentAgro'], status: 'publicado', quizEnabled: true, views: 412, totalHours: 1.0 },
  { id: 'ct7', title: 'Relatório GEE - Template', type: 'guia', scope: 'exclusivo', clients: ['SustentAgro'], status: 'publicado', quizEnabled: false, views: 189, totalHours: 2.0 },
  { id: 'ct8', title: 'Biodiversidade e Agricultura', type: 'video', scope: 'global', clients: [], status: 'rascunho', quizEnabled: false, views: 0, totalHours: 0.6 },
  { id: 'ct9', title: 'Pegada de Carbono Empresarial', type: 'artigo', scope: 'global', clients: [], status: 'agendado', quizEnabled: true, views: 0, totalHours: 0.4 },
  { id: 'ct10', title: 'Compensação de Carbono', type: 'podcast', scope: 'global', clients: [], status: 'publicado', quizEnabled: false, views: 523, totalHours: 0.9 },
]

// ---------------------------------------------------------------------------
// Mock Top Content (by views)
// ---------------------------------------------------------------------------

export const TOP_CONTENT = [...CATALOG_CONTENT]
  .filter((c) => c.status === 'publicado')
  .sort((a, b) => b.views - a.views)
  .slice(0, 5)

// ---------------------------------------------------------------------------
// Mock Admin Trails
// ---------------------------------------------------------------------------

export const ADMIN_TRAILS: AdminTrail[] = [
  {
    id: 'at1',
    title: 'Gestão de Emissões GEE',
    description: 'Trilha completa sobre inventário e gestão de emissões de gases de efeito estufa.',
    status: 'ativa',
    visibility: 'global',
    contents: ['ct1', 'ct6', 'ct2', 'ct5'],
    quizEnabled: true,
    clients: [],
    createdAt: '2025-11-01',
  },
  {
    id: 'at2',
    title: 'Fundamentos ESG',
    description: 'Introdução aos pilares Environmental, Social e Governance para o agronegócio.',
    status: 'ativa',
    visibility: 'global',
    contents: ['ct3', 'ct4', 'ct10'],
    quizEnabled: true,
    clients: [],
    createdAt: '2025-12-15',
  },
  {
    id: 'at3',
    title: 'Relatório GEE Avançado',
    description: 'Passo a passo para elaboração de relatórios GEE corporativos.',
    status: 'ativa',
    visibility: 'exclusiva',
    contents: ['ct1', 'ct6', 'ct7'],
    quizEnabled: false,
    clients: ['SustentAgro'],
    createdAt: '2026-01-20',
  },
  {
    id: 'at4',
    title: 'Carbono e Biodiversidade',
    description: 'Relação entre sequestro de carbono e preservação da biodiversidade no agro.',
    status: 'rascunho',
    visibility: 'global',
    contents: ['ct5', 'ct8'],
    quizEnabled: false,
    clients: [],
    createdAt: '2026-03-10',
  },
  {
    id: 'at5',
    title: 'Compensação e Mercado de Carbono',
    description: 'Como funciona o mercado voluntário de carbono e compensação de emissões.',
    status: 'em-breve',
    visibility: 'global',
    contents: ['ct10', 'ct9'],
    quizEnabled: true,
    clients: [],
    createdAt: '2026-03-20',
  },
]

// ---------------------------------------------------------------------------
// Mock Quiz Questions (reusable template)
// ---------------------------------------------------------------------------

export const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Qual é o principal gás de efeito estufa emitido pela atividade pecuária?',
    options: ['CO₂', 'CH₄ (Metano)', 'N₂O', 'SF₆'],
    correctIndex: 1,
  },
  {
    id: 'q2',
    question: 'O GHG Protocol classifica emissões em quantos escopos?',
    options: ['2 escopos', '3 escopos', '4 escopos', '5 escopos'],
    correctIndex: 1,
  },
  {
    id: 'q3',
    question: 'Qual escopo cobre emissões diretas da empresa?',
    options: ['Escopo 1', 'Escopo 2', 'Escopo 3', 'Todos os escopos'],
    correctIndex: 0,
  },
]

// ---------------------------------------------------------------------------
// Company summary for dashboard drill-down
// ---------------------------------------------------------------------------

export const COMPANY_SUMMARY = CLIENTS.filter((c) => c.status === 'ativo').map((c) => ({
  id: c.id,
  name: c.name,
  users: c.totalUsers,
  hours: c.totalHours,
  certificates: c.totalCertificates,
  trailsCompleted: c.trailsCompleted,
}))
