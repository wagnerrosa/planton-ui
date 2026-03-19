// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContentType = 'video' | 'podcast' | 'artigo' | 'guia'
export type ContentStatus = 'nao-iniciado' | 'visualizado' | 'concluido'

/** Unidade principal de conteúdo — centrada em MUX */
export type ContentItem = {
  id: string
  title: string
  description: string
  type: ContentType
  duration: string
  muxPlaybackId: string
  /** Computed from muxPlaybackId */
  thumbnailUrl: string
  previewUrl: string
  status: ContentStatus
  progress: number
  trail?: {
    id: string
    name: string
  }
  isNew?: boolean
}

export type Trail = {
  id: string
  title: string
  description: string
  totalItems: number
  totalDuration: string
  progress: number
  status: 'nao-iniciada' | 'em-andamento' | 'concluida' | 'em-breve'
  contents: ContentItem[]
  accentColor: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MUX_ID = 'WKpT00e9YdvWkU3IR7JzqLQaPtXhsfXDfhBXuHMyCrd8'

function muxUrls(playbackId: string) {
  return {
    muxPlaybackId: playbackId,
    thumbnailUrl: `https://image.mux.com/${playbackId}/thumbnail.png`,
    previewUrl: `https://image.mux.com/${playbackId}/animated.gif`,
  }
}

// ---------------------------------------------------------------------------
// Content items (shared pool — used both as standalone and inside trails)
// ---------------------------------------------------------------------------

export const CONTENT_ITEMS: ContentItem[] = [
  // Trail 1: Gestão de Emissões de GEE
  {
    id: 'c1',
    title: 'O que é GHG Protocol',
    description: 'Entenda a origem, estrutura e relevância do padrão global de inventário de gases de efeito estufa.',
    type: 'video',
    duration: '18min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-1', name: 'Gestão de Emissões de GEE' },
  },
  {
    id: 'c2',
    title: 'Escopos 1, 2 e 3',
    description: 'Classificação das emissões corporativas: diretas, indiretas de energia e da cadeia de valor.',
    type: 'video',
    duration: '24min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-1', name: 'Gestão de Emissões de GEE' },
  },
  {
    id: 'c3',
    title: 'Fatores de Emissão',
    description: 'Como selecionar e aplicar fatores de emissão confiáveis no seu inventário.',
    type: 'artigo',
    duration: '12min',
    ...muxUrls(MUX_ID),
    status: 'visualizado',
    progress: 60,
    trail: { id: 'trail-1', name: 'Gestão de Emissões de GEE' },
  },
  {
    id: 'c4',
    title: 'Calculando Emissões na Prática',
    description: 'Passo a passo para calcular emissões de Escopo 1 e 2 com exemplos reais.',
    type: 'video',
    duration: '31min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-1', name: 'Gestão de Emissões de GEE' },
  },
  {
    id: 'c5',
    title: 'Ferramentas de Inventário',
    description: 'Comparativo das principais ferramentas e planilhas para gestão de inventário.',
    type: 'guia',
    duration: '15min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-1', name: 'Gestão de Emissões de GEE' },
  },
  {
    id: 'c6',
    title: 'Tendências em GEE',
    description: 'Debate sobre regulação, mercado de carbono e o futuro dos inventários corporativos.',
    type: 'podcast',
    duration: '40min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-1', name: 'Gestão de Emissões de GEE' },
  },

  // Trail 2: Fundamentos ESG
  {
    id: 'c7',
    title: 'Introdução ao ESG',
    description: 'O que é ESG, por que importa e como vem transformando o mercado de capitais global.',
    type: 'video',
    duration: '20min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-2', name: 'Fundamentos ESG' },
    isNew: true,
  },
  {
    id: 'c8',
    title: 'Frameworks de Reporte',
    description: 'GRI, SASB, TCFD e ISSB — entenda cada framework e quando aplicar cada um.',
    type: 'artigo',
    duration: '15min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-2', name: 'Fundamentos ESG' },
    isNew: true,
  },
  {
    id: 'c9',
    title: 'ESG na Prática',
    description: 'Cases reais de empresas que implementaram ESG e os resultados obtidos.',
    type: 'video',
    duration: '28min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-2', name: 'Fundamentos ESG' },
    isNew: true,
  },
  {
    id: 'c10',
    title: 'Guia de Implementação ESG',
    description: 'Roteiro prático para iniciar ou evoluir sua estratégia ESG.',
    type: 'guia',
    duration: '42min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-2', name: 'Fundamentos ESG' },
  },

  // Trail 3: Pegada de Carbono
  {
    id: 'c11',
    title: 'O que é Pegada de Carbono',
    description: 'Definição, abrangência e diferença entre pegada individual, produto e corporativa.',
    type: 'video',
    duration: '15min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-3', name: 'Pegada de Carbono Corporativa' },
  },
  {
    id: 'c12',
    title: 'Metodologias de Cálculo',
    description: 'ISO 14064, GHG Protocol Product Standard e outras metodologias comparadas.',
    type: 'artigo',
    duration: '20min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-3', name: 'Pegada de Carbono Corporativa' },
  },
  {
    id: 'c13',
    title: 'Cases de Redução',
    description: 'Como empresas reais reduziram sua pegada de carbono e os resultados mensuráveis.',
    type: 'video',
    duration: '35min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-3', name: 'Pegada de Carbono Corporativa' },
  },
  {
    id: 'c14',
    title: 'Compensação de Emissões',
    description: 'Créditos de carbono, mercados voluntários e como avaliar projetos de compensação.',
    type: 'podcast',
    duration: '30min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-3', name: 'Pegada de Carbono Corporativa' },
  },
  {
    id: 'c15',
    title: 'Plano de Descarbonização',
    description: 'Como construir metas SBTi, roadmap de ações e comunicar para stakeholders.',
    type: 'guia',
    duration: '25min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-3', name: 'Pegada de Carbono Corporativa' },
  },
]

// ---------------------------------------------------------------------------
// Trails
// ---------------------------------------------------------------------------

export const MOCK_TRAILS: Trail[] = [
  {
    id: 'trail-1',
    title: 'Gestão de Emissões de GEE',
    description: 'Fundamentos do inventário de emissões, metodologias GHG Protocol e boas práticas de reporte.',
    totalItems: 6,
    totalDuration: '2h20min',
    progress: 65,
    status: 'em-andamento',
    accentColor: '#145559',
    contents: CONTENT_ITEMS.filter((c) => c.trail?.id === 'trail-1'),
  },
  {
    id: 'trail-2',
    title: 'Fundamentos ESG',
    description: 'Conceitos, frameworks e aplicação prática dos pilares Ambiental, Social e Governança.',
    totalItems: 4,
    totalDuration: '1h45min',
    progress: 100,
    status: 'concluida',
    accentColor: '#ADCF78',
    contents: CONTENT_ITEMS.filter((c) => c.trail?.id === 'trail-2'),
  },
  {
    id: 'trail-3',
    title: 'Pegada de Carbono Corporativa',
    description: 'Como calcular, comunicar e reduzir a pegada de carbono da sua organização.',
    totalItems: 5,
    totalDuration: '2h05min',
    progress: 0,
    status: 'nao-iniciada',
    accentColor: '#64BDC6',
    contents: CONTENT_ITEMS.filter((c) => c.trail?.id === 'trail-3'),
  },
  {
    id: 'trail-4',
    title: 'Normas ISO de Sustentabilidade',
    description: 'ISO 14001, 14064 e 14067 — estrutura, requisitos e aplicação nas empresas.',
    totalItems: 3,
    totalDuration: '1h10min',
    progress: 0,
    status: 'em-breve',
    accentColor: '#3C4829',
    contents: [],
  },
]

// ---------------------------------------------------------------------------
// Curated lists for Home sections
// ---------------------------------------------------------------------------

/** Conteúdo hero (destaque principal) */
export const HERO_CONTENT = CONTENT_ITEMS[3] // c4: Calculando Emissões na Prática

/** Conteúdos com progresso para "Continue assistindo" */
export const CONTINUE_WATCHING_ITEMS = CONTENT_ITEMS.filter(
  (c) => c.progress > 0 && c.progress < 100
)

/** Conteúdos marcados como novos */
export const NEW_CONTENT_ITEMS = CONTENT_ITEMS.filter((c) => c.isNew)

// Backwards compat — TrailScreen still uses this shape
export const CONTINUE_WATCHING = {
  trailId: 'trail-1',
  trailTitle: 'Gestão de Emissões de GEE',
  content: CONTENT_ITEMS[2],
}
