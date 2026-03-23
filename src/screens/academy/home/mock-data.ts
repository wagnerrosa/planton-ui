// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContentType = 'video' | 'podcast' | 'artigo' | 'guia' | 'trilha'
export type ContentStatus = 'nao-iniciado' | 'visualizado' | 'concluido'

export type ContentTag = 'ESG' | 'Emissões' | 'ISO' | 'Sustentabilidade'

/** Unidade principal de conteúdo , centrada em MUX */
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
  trails?: { id: string; name: string }[]
  isNew?: boolean
  tags?: ContentTag[]
}

export type QuizQuestion = {
  question: string
  options: string[]
  correctIndex: number
}

export type Quiz = {
  questions: QuizQuestion[]
  status: 'bloqueado' | 'disponivel' | 'concluido'
}

export type Certificate = {
  title: string
  status: 'bloqueado' | 'disponivel'
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
  quiz: Quiz
  certificate: Certificate
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
// Content items (shared pool , used both as standalone and inside trails)
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
    tags: ['Emissões', 'ESG'],
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
    tags: ['Emissões'],
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
    tags: ['Emissões'],
  },
  {
    id: 'c4',
    title: 'Calculando Emissões na Prática',
    description: 'Passo a passo para calcular emissões de Escopo 1 e 2 com exemplos reais.',
    type: 'video',
    duration: '31min',
    ...muxUrls(MUX_ID),
    status: 'visualizado',
    progress: 35,
    trail: { id: 'trail-1', name: 'Gestão de Emissões de GEE' },
    trails: [
      { id: 'trail-1', name: 'Gestão de Emissões de GEE' },
      { id: 'trail-2', name: 'Fundamentos ESG' },
    ],
    tags: ['Emissões', 'ESG'],
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
    tags: ['Emissões'],
  },
  {
    id: 'c6',
    title: 'Tendências em GEE',
    description: 'Debate sobre regulação, mercado de carbono e o futuro dos inventários corporativos.',
    type: 'podcast',
    duration: '40min',
    ...muxUrls(MUX_ID),
    status: 'visualizado',
    progress: 80,
    trail: { id: 'trail-1', name: 'Gestão de Emissões de GEE' },
    tags: ['Emissões', 'Sustentabilidade'],
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
    tags: ['ESG'],
  },
  {
    id: 'c8',
    title: 'Frameworks de Reporte',
    description: 'GRI, SASB, TCFD e ISSB , entenda cada framework e quando aplicar cada um.',
    type: 'artigo',
    duration: '15min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-2', name: 'Fundamentos ESG' },
    isNew: true,
    tags: ['ESG', 'ISO'],
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
    tags: ['ESG', 'Sustentabilidade'],
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
    isNew: true,
    tags: ['ESG', 'Sustentabilidade'],
  },

  // Trail 3: Pegada de Carbono
  {
    id: 'c10b',
    title: 'Riscos Climáticos nos Negócios',
    description: 'Como identificar, mensurar e reportar riscos físicos e de transição climática.',
    type: 'video',
    duration: '22min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-1', name: 'Gestão de Emissões de GEE' },
    isNew: true,
    tags: ['Emissões', 'Sustentabilidade'],
  },
  {
    id: 'c10c',
    title: 'TCFD na Prática',
    description: 'Como estruturar o disclosure climático segundo as recomendações do TCFD.',
    type: 'podcast',
    duration: '35min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-2', name: 'Fundamentos ESG' },
    isNew: true,
    tags: ['ESG', 'ISO'],
  },
  {
    id: 'c11',
    title: 'O que é Pegada de Carbono',
    description: 'Definição, abrangência e diferença entre pegada individual, produto e corporativa.',
    type: 'video',
    duration: '15min',
    ...muxUrls(MUX_ID),
    status: 'visualizado',
    progress: 45,
    trail: { id: 'trail-3', name: 'Pegada de Carbono Corporativa' },
    tags: ['Emissões', 'Sustentabilidade'],
  },
  {
    id: 'c12',
    title: 'Metodologias de Cálculo',
    description: 'ISO 14064, GHG Protocol Product Standard e outras metodologias comparadas.',
    type: 'artigo',
    duration: '20min',
    ...muxUrls(MUX_ID),
    status: 'visualizado',
    progress: 20,
    trail: { id: 'trail-3', name: 'Pegada de Carbono Corporativa' },
    tags: ['ISO', 'Emissões'],
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
    tags: ['Emissões', 'Sustentabilidade'],
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
    tags: ['Sustentabilidade'],
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
    tags: ['Sustentabilidade', 'Emissões'],
  },
]

// ---------------------------------------------------------------------------
// Trails
// ---------------------------------------------------------------------------

const MOCK_QUIZ_GEE: Quiz = {
  status: 'disponivel',
  questions: [
    {
      question: 'Qual protocolo é o padrão global para inventário de gases de efeito estufa?',
      options: ['ISO 14001', 'GHG Protocol', 'SASB', 'TCFD'],
      correctIndex: 1,
    },
    {
      question: 'O Escopo 3 refere-se a emissões:',
      options: ['Diretas da empresa', 'De energia comprada', 'Da cadeia de valor', 'De combustíveis fósseis'],
      correctIndex: 2,
    },
    {
      question: 'Um fator de emissão é utilizado para:',
      options: ['Medir consumo de energia', 'Converter atividade em CO₂e', 'Calcular créditos de carbono', 'Auditar relatórios ESG'],
      correctIndex: 1,
    },
  ],
}

const MOCK_QUIZ_ESG: Quiz = {
  status: 'concluido',
  questions: [
    {
      question: 'ESG é a sigla para:',
      options: ['Energy, Safety, Governance', 'Environmental, Social, Governance', 'Equity, Sustainability, Growth', 'Emissions, Standards, Goals'],
      correctIndex: 1,
    },
    {
      question: 'O framework GRI é utilizado principalmente para:',
      options: ['Calcular emissões', 'Reporte de sustentabilidade', 'Gestão de riscos', 'Auditoria financeira'],
      correctIndex: 1,
    },
  ],
}

const MOCK_QUIZ_CARBONO: Quiz = {
  status: 'bloqueado',
  questions: [
    {
      question: 'A norma ISO 14064 trata de:',
      options: ['Gestão ambiental', 'Inventário de gases de efeito estufa', 'Eficiência energética', 'Biodiversidade'],
      correctIndex: 1,
    },
    {
      question: 'SBTi significa:',
      options: ['Sustainable Business Targets Initiative', 'Science Based Targets initiative', 'Standard Based Trading Index', 'Sustainability Benchmark Tools International'],
      correctIndex: 1,
    },
  ],
}

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
    quiz: MOCK_QUIZ_GEE,
    certificate: { title: 'Gestão de Emissões de GEE', status: 'bloqueado' },
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
    quiz: MOCK_QUIZ_ESG,
    certificate: { title: 'Fundamentos ESG', status: 'disponivel' },
  },
  {
    id: 'trail-3',
    title: 'Pegada de Carbono Corporativa',
    description: 'Como calcular, comunicar e reduzir a pegada de carbono da sua organização.',
    totalItems: 5,
    totalDuration: '2h05min',
    progress: 30,
    status: 'em-andamento',
    accentColor: '#64BDC6',
    contents: CONTENT_ITEMS.filter((c) => c.trail?.id === 'trail-3'),
    quiz: MOCK_QUIZ_CARBONO,
    certificate: { title: 'Pegada de Carbono Corporativa', status: 'bloqueado' },
  },
  {
    id: 'trail-4',
    title: 'Normas ISO de Sustentabilidade',
    description: 'ISO 14001, 14064 e 14067 , estrutura, requisitos e aplicação nas empresas.',
    totalItems: 3,
    totalDuration: '1h10min',
    progress: 45,
    status: 'em-andamento',
    accentColor: '#3C4829',
    contents: [],
    quiz: { status: 'bloqueado', questions: [] },
    certificate: { title: 'Normas ISO de Sustentabilidade', status: 'bloqueado' },
  },
  {
    id: 'trail-5',
    title: 'Mercado de Carbono',
    description: 'Como funcionam os mercados regulado e voluntário de carbono e como participar.',
    totalItems: 4,
    totalDuration: '1h30min',
    progress: 15,
    status: 'em-andamento',
    accentColor: '#5A7A5A',
    contents: [],
    quiz: { status: 'bloqueado', questions: [] },
    certificate: { title: 'Mercado de Carbono', status: 'bloqueado' },
  },
  {
    id: 'trail-6',
    title: 'Relatório de Sustentabilidade',
    description: 'Como estruturar, escrever e publicar um relatório de sustentabilidade eficaz.',
    totalItems: 5,
    totalDuration: '2h00min',
    progress: 55,
    status: 'em-andamento',
    accentColor: '#7A9E7E',
    contents: [],
    quiz: { status: 'bloqueado', questions: [] },
    certificate: { title: 'Relatório de Sustentabilidade', status: 'bloqueado' },
  },
  {
    id: 'trail-7',
    title: 'Due Diligence Socioambiental',
    description: 'Avaliação de riscos socioambientais em investimentos e cadeias de fornecimento.',
    totalItems: 4,
    totalDuration: '1h20min',
    progress: 75,
    status: 'em-andamento',
    accentColor: '#6B8F71',
    contents: [],
    quiz: { status: 'bloqueado', questions: [] },
    certificate: { title: 'Due Diligence Socioambiental', status: 'bloqueado' },
  },
  {
    id: 'trail-8',
    title: 'Biodiversidade e Negócios',
    description: 'Framework TNFD, riscos de natureza e como integrar biodiversidade à estratégia.',
    totalItems: 3,
    totalDuration: '55min',
    progress: 10,
    status: 'em-andamento',
    accentColor: '#4A7C59',
    contents: [],
    quiz: { status: 'bloqueado', questions: [] },
    certificate: { title: 'Biodiversidade e Negócios', status: 'bloqueado' },
  },
  {
    id: 'trail-9',
    title: 'Finanças Sustentáveis',
    description: 'Taxonomia verde, títulos ESG e como o mercado financeiro precifica risco climático.',
    totalItems: 6,
    totalDuration: '2h30min',
    progress: 40,
    status: 'em-andamento',
    accentColor: '#2E6B5E',
    contents: [],
    quiz: { status: 'bloqueado', questions: [] },
    certificate: { title: 'Finanças Sustentáveis', status: 'bloqueado' },
  },
]

// ---------------------------------------------------------------------------
// Curated lists for Home sections
// ---------------------------------------------------------------------------

/** Tags disponíveis para filtro */
export const AVAILABLE_TAGS: ContentTag[] = ['ESG', 'Emissões', 'ISO', 'Sustentabilidade']

/** Conteúdos hero (destaque principal) , apenas vídeos, máx 3 */
export const HERO_CONTENT = CONTENT_ITEMS[3] // c4: Calculando Emissões na Prática (backwards compat)
export const HERO_CONTENTS = CONTENT_ITEMS.filter((c) => c.type === 'video').slice(0, 3)

/** Conteúdos com progresso para "Continue assistindo" */
export const CONTINUE_WATCHING_ITEMS = CONTENT_ITEMS.filter(
  (c) => c.progress > 0 && c.progress < 100
)

/** Conteúdos marcados como novos */
export const NEW_CONTENT_ITEMS = CONTENT_ITEMS.filter((c) => c.isNew)

// Backwards compat , TrailScreen still uses this shape
export const CONTINUE_WATCHING = {
  trailId: 'trail-1',
  trailTitle: 'Gestão de Emissões de GEE',
  content: CONTENT_ITEMS[2],
}
