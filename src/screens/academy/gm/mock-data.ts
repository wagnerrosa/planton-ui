// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CollaboratorStatus = 'ativo' | 'convite-enviado' | 'nunca-acessou'

export type WatchedContent = {
  id: string
  title: string
  type: 'video' | 'artigo' | 'podcast' | 'guia'
  watchedAt: string
}

export type Collaborator = {
  id: string
  name: string
  email: string
  status: CollaboratorStatus
  trailsCompleted: number
  hoursWatched: number
  certificates: number
  lastAccess: string | null
  watchedContents: WatchedContent[]
  certificateNames: string[]
}

export type GMPlan = {
  name: string
  expiration: string
  startDate: string
  daysRemaining: number
  totalDays: number
}

export type GMKPI = {
  label: string
  value: string
  change: string
  period: string
  trend: 'up' | 'down' | 'neutral'
}

export type TopTrail = {
  id: string
  title: string
  accessCount: number
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

export const GM_COMPANY = {
  name: 'AgroTech Solutions',
  cnpj: '12.345.678/0001-90',
}

export const GM_PLAN: GMPlan = {
  name: 'Enterprise',
  expiration: '2026-08-15',
  startDate: '2025-08-15',
  daysRemaining: 144,
  totalDays: 365,
}

// Helper: format ISO date to pt-BR (DD/MM/AAAA)
export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export const GM_KPIS: GMKPI[] = [
  { label: 'Total de usuários', value: '42', change: '+5', period: 'últimos 30 dias', trend: 'up' },
  { label: 'Usuários ativos', value: '36', change: '+3', period: 'últimos 30 dias', trend: 'up' },
  { label: 'Horas consumidas', value: '845h', change: '+18%', period: 'vs. mês anterior', trend: 'up' },
  { label: 'Certificados emitidos', value: '89', change: '+12', period: 'últimos 30 dias', trend: 'up' },
]

export const GM_TOP_TRAILS: TopTrail[] = [
  { id: 'at1', title: 'Gestão de Emissões GEE', accessCount: 38 },
  { id: 'at2', title: 'Fundamentos ESG', accessCount: 31 },
  { id: 'at3', title: 'Relatório GEE Avançado', accessCount: 24 },
  { id: 'at5', title: 'Compensação e Mercado de Carbono', accessCount: 17 },
  { id: 'at4', title: 'Carbono e Biodiversidade', accessCount: 9 },
]

export const GM_COLLABORATORS: Collaborator[] = [
  {
    id: 'gc1', name: 'Ana Oliveira', email: 'ana@agrotech.com.br', status: 'ativo',
    trailsCompleted: 3, hoursWatched: 24, certificates: 2, lastAccess: '2026-03-24',
    certificateNames: ['Gestão de Emissões GEE', 'Fundamentos ESG'],
    watchedContents: [
      { id: 'ct1', title: 'Introdução ao GHG Protocol', type: 'video', watchedAt: '2026-03-10' },
      { id: 'ct3', title: 'ESG na Prática Agrícola', type: 'video', watchedAt: '2026-03-15' },
      { id: 'ct2', title: 'Fatores de Emissão - Guia Prático', type: 'guia', watchedAt: '2026-03-18' },
      { id: 'ct4', title: 'Podcast: Futuro Sustentável', type: 'podcast', watchedAt: '2026-03-20' },
    ],
  },
  {
    id: 'gc2', name: 'Pedro Santos', email: 'pedro@agrotech.com.br', status: 'ativo',
    trailsCompleted: 2, hoursWatched: 18, certificates: 1, lastAccess: '2026-03-23',
    certificateNames: ['Gestão de Emissões GEE'],
    watchedContents: [
      { id: 'ct1', title: 'Introdução ao GHG Protocol', type: 'video', watchedAt: '2026-03-05' },
      { id: 'ct6', title: 'Inventário de Emissões Scope 1', type: 'video', watchedAt: '2026-03-12' },
      { id: 'ct5', title: 'Carbono no Solo', type: 'artigo', watchedAt: '2026-03-20' },
    ],
  },
  {
    id: 'gc3', name: 'Mariana Costa', email: 'mariana@agrotech.com.br', status: 'ativo',
    trailsCompleted: 4, hoursWatched: 32, certificates: 3, lastAccess: '2026-03-25',
    certificateNames: ['Gestão de Emissões GEE', 'Fundamentos ESG', 'Relatório GEE Avançado'],
    watchedContents: [
      { id: 'ct1', title: 'Introdução ao GHG Protocol', type: 'video', watchedAt: '2026-02-28' },
      { id: 'ct3', title: 'ESG na Prática Agrícola', type: 'video', watchedAt: '2026-03-02' },
      { id: 'ct6', title: 'Inventário de Emissões Scope 1', type: 'video', watchedAt: '2026-03-08' },
      { id: 'ct7', title: 'Relatório GEE - Template', type: 'guia', watchedAt: '2026-03-14' },
      { id: 'ct10', title: 'Compensação de Carbono', type: 'podcast', watchedAt: '2026-03-22' },
    ],
  },
  {
    id: 'gc4', name: 'Lucas Mendes', email: 'lucas@agrotech.com.br', status: 'ativo',
    trailsCompleted: 1, hoursWatched: 8, certificates: 0, lastAccess: '2026-03-20',
    certificateNames: [],
    watchedContents: [
      { id: 'ct1', title: 'Introdução ao GHG Protocol', type: 'video', watchedAt: '2026-03-18' },
      { id: 'ct4', title: 'Podcast: Futuro Sustentável', type: 'podcast', watchedAt: '2026-03-20' },
    ],
  },
  {
    id: 'gc5', name: 'Juliana Ferreira', email: 'juliana@agrotech.com.br', status: 'ativo',
    trailsCompleted: 5, hoursWatched: 41, certificates: 4, lastAccess: '2026-03-22',
    certificateNames: ['Gestão de Emissões GEE', 'Fundamentos ESG', 'Relatório GEE Avançado', 'Compensação e Mercado de Carbono'],
    watchedContents: [
      { id: 'ct1', title: 'Introdução ao GHG Protocol', type: 'video', watchedAt: '2026-02-20' },
      { id: 'ct2', title: 'Fatores de Emissão - Guia Prático', type: 'guia', watchedAt: '2026-02-25' },
      { id: 'ct3', title: 'ESG na Prática Agrícola', type: 'video', watchedAt: '2026-03-01' },
      { id: 'ct6', title: 'Inventário de Emissões Scope 1', type: 'video', watchedAt: '2026-03-07' },
      { id: 'ct7', title: 'Relatório GEE - Template', type: 'guia', watchedAt: '2026-03-12' },
      { id: 'ct10', title: 'Compensação de Carbono', type: 'podcast', watchedAt: '2026-03-18' },
    ],
  },
  {
    id: 'gc6', name: 'Roberto Almeida', email: 'roberto@agrotech.com.br', status: 'ativo',
    trailsCompleted: 2, hoursWatched: 15, certificates: 1, lastAccess: '2026-03-18',
    certificateNames: ['Fundamentos ESG'],
    watchedContents: [
      { id: 'ct3', title: 'ESG na Prática Agrícola', type: 'video', watchedAt: '2026-03-10' },
      { id: 'ct4', title: 'Podcast: Futuro Sustentável', type: 'podcast', watchedAt: '2026-03-14' },
      { id: 'ct5', title: 'Carbono no Solo', type: 'artigo', watchedAt: '2026-03-18' },
    ],
  },
  {
    id: 'gc7', name: 'Patricia Rocha', email: 'patricia@agrotech.com.br', status: 'ativo',
    trailsCompleted: 3, hoursWatched: 27, certificates: 2, lastAccess: '2026-03-21',
    certificateNames: ['Gestão de Emissões GEE', 'Fundamentos ESG'],
    watchedContents: [
      { id: 'ct1', title: 'Introdução ao GHG Protocol', type: 'video', watchedAt: '2026-03-03' },
      { id: 'ct3', title: 'ESG na Prática Agrícola', type: 'video', watchedAt: '2026-03-09' },
      { id: 'ct2', title: 'Fatores de Emissão - Guia Prático', type: 'guia', watchedAt: '2026-03-16' },
    ],
  },
  {
    id: 'gc8', name: 'Thiago Barbosa', email: 'thiago@agrotech.com.br', status: 'convite-enviado',
    trailsCompleted: 0, hoursWatched: 0, certificates: 0, lastAccess: null,
    certificateNames: [], watchedContents: [],
  },
  {
    id: 'gc9', name: 'Camila Ribeiro', email: 'camila@agrotech.com.br', status: 'convite-enviado',
    trailsCompleted: 0, hoursWatched: 0, certificates: 0, lastAccess: null,
    certificateNames: [], watchedContents: [],
  },
  {
    id: 'gc10', name: 'Diego Martins', email: 'diego@agrotech.com.br', status: 'nunca-acessou',
    trailsCompleted: 0, hoursWatched: 0, certificates: 0, lastAccess: null,
    certificateNames: [], watchedContents: [],
  },
  {
    id: 'gc11', name: 'Bruna Souza', email: 'bruna@agrotech.com.br', status: 'ativo',
    trailsCompleted: 2, hoursWatched: 19, certificates: 1, lastAccess: '2026-03-24',
    certificateNames: ['Gestão de Emissões GEE'],
    watchedContents: [
      { id: 'ct1', title: 'Introdução ao GHG Protocol', type: 'video', watchedAt: '2026-03-16' },
      { id: 'ct6', title: 'Inventário de Emissões Scope 1', type: 'video', watchedAt: '2026-03-22' },
    ],
  },
  {
    id: 'gc12', name: 'Rafael Nunes', email: 'rafael@agrotech.com.br', status: 'nunca-acessou',
    trailsCompleted: 0, hoursWatched: 0, certificates: 0, lastAccess: null,
    certificateNames: [], watchedContents: [],
  },
]
