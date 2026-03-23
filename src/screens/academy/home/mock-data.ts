// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContentType = 'video' | 'podcast' | 'artigo' | 'guia' | 'trilha'
export type ContentStatus = 'nao-iniciado' | 'visualizado' | 'concluido'

export type ContentTag = 'ESG' | 'Emissões' | 'ISO' | 'Sustentabilidade' | 'Carbono' | 'Clima'

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
  // Trail 1: Gestão de Emissões
  {
    id: 'c1',
    title: 'O que é GHG Protocol',
    description: 'Entenda a origem, estrutura e relevância do padrão global de inventário de gases de efeito estufa.',
    type: 'video',
    duration: '18min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-1', name: 'Gestão de Emissões' },
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
    trail: { id: 'trail-1', name: 'Gestão de Emissões' },
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
    trail: { id: 'trail-1', name: 'Gestão de Emissões' },
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
    trail: { id: 'trail-1', name: 'Gestão de Emissões' },
    tags: ['Emissões', 'ESG'],
  },
  {
    id: 'c5',
    title: 'Ferramentas de Inventário',
    description: 'Comparativo das principais ferramentas e planilhas para gestão de inventário de GEE.',
    type: 'guia',
    duration: '15min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-1', name: 'Gestão de Emissões' },
    tags: ['Emissões'],
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
    trail: { id: 'trail-1', name: 'Gestão de Emissões' },
    tags: ['Emissões', 'Sustentabilidade'],
  },

  // Trail 2: Resíduos e Circularidade
  {
    id: 'c7',
    title: 'Economia Circular: Conceitos Fundamentais',
    description: 'Os princípios da economia circular e como diferem do modelo linear tradicional.',
    type: 'video',
    duration: '20min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-2', name: 'Resíduos e Circularidade' },
    isNew: true,
    tags: ['Sustentabilidade', 'ESG'],
  },
  {
    id: 'c8',
    title: 'Classificação de Resíduos Sólidos',
    description: 'PNRS, classes de resíduos e obrigações legais para empresas geradoras.',
    type: 'artigo',
    duration: '14min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-2', name: 'Resíduos e Circularidade' },
    isNew: true,
    tags: ['Sustentabilidade', 'ISO'],
  },
  {
    id: 'c9',
    title: 'Logística Reversa na Prática',
    description: 'Como estruturar programas de logística reversa eficientes e em conformidade legal.',
    type: 'video',
    duration: '26min',
    ...muxUrls(MUX_ID),
    status: 'visualizado',
    progress: 50,
    trail: { id: 'trail-2', name: 'Resíduos e Circularidade' },
    isNew: true,
    tags: ['Sustentabilidade'],
  },
  {
    id: 'c10',
    title: 'Métricas de Circularidade',
    description: 'Indicadores para medir o grau de circularidade e reportar para stakeholders.',
    type: 'podcast',
    duration: '33min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-2', name: 'Resíduos e Circularidade' },
    tags: ['Sustentabilidade', 'ESG'],
  },
  {
    id: 'c10a',
    title: 'Guia de Diagnóstico de Resíduos',
    description: 'Passo a passo para mapear, quantificar e categorizar os resíduos gerados na operação.',
    type: 'guia',
    duration: '18min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-2', name: 'Resíduos e Circularidade' },
    tags: ['Sustentabilidade'],
  },

  // Trail 3: Eficiência Energética
  {
    id: 'c11',
    title: 'Fundamentos de Eficiência Energética',
    description: 'Conceitos, legislação e oportunidades para redução do consumo energético nas empresas.',
    type: 'video',
    duration: '22min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-3', name: 'Eficiência Energética' },
    tags: ['Emissões', 'ESG'],
  },
  {
    id: 'c12',
    title: 'Auditorias Energéticas',
    description: 'Como conduzir uma auditoria energética e identificar os maiores focos de desperdício.',
    type: 'artigo',
    duration: '16min',
    ...muxUrls(MUX_ID),
    status: 'visualizado',
    progress: 70,
    trail: { id: 'trail-3', name: 'Eficiência Energética' },
    tags: ['Emissões', 'ISO'],
  },
  {
    id: 'c13',
    title: 'ISO 50001: Sistemas de Gestão de Energia',
    description: 'Requisitos da norma, etapas de implementação e benefícios para a organização.',
    type: 'video',
    duration: '28min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-3', name: 'Eficiência Energética' },
    isNew: true,
    tags: ['ISO', 'Emissões'],
  },
  {
    id: 'c14',
    title: 'Energias Renováveis para Empresas',
    description: 'Opções de contratação de energia limpa: ACL, ACR, GD e PPAs explicados.',
    type: 'podcast',
    duration: '38min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-3', name: 'Eficiência Energética' },
    tags: ['Emissões', 'Sustentabilidade'],
  },
  {
    id: 'c15',
    title: 'Plano de Eficiência Energética',
    description: 'Como montar um plano de ação com metas, responsáveis e indicadores de acompanhamento.',
    type: 'guia',
    duration: '20min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-3', name: 'Eficiência Energética' },
    tags: ['Emissões', 'ISO'],
  },

  // Trail 4: Sustentabilidade Corporativa
  {
    id: 'c16',
    title: 'Estratégia de Sustentabilidade Corporativa',
    description: 'Como integrar sustentabilidade ao core business e criar valor de longo prazo.',
    type: 'video',
    duration: '25min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-4', name: 'Sustentabilidade Corporativa' },
    isNew: true,
    tags: ['ESG', 'Sustentabilidade'],
  },
  {
    id: 'c17',
    title: 'Materialidade e Stakeholders',
    description: 'Como conduzir uma análise de materialidade e engajar os públicos relevantes.',
    type: 'artigo',
    duration: '15min',
    ...muxUrls(MUX_ID),
    status: 'concluido',
    progress: 100,
    trail: { id: 'trail-4', name: 'Sustentabilidade Corporativa' },
    isNew: true,
    tags: ['ESG', 'Sustentabilidade'],
  },
  {
    id: 'c18',
    title: 'ODS e Agenda 2030 nas Empresas',
    description: 'Como mapear contribuições da empresa para os Objetivos de Desenvolvimento Sustentável.',
    type: 'video',
    duration: '23min',
    ...muxUrls(MUX_ID),
    status: 'visualizado',
    progress: 40,
    trail: { id: 'trail-4', name: 'Sustentabilidade Corporativa' },
    tags: ['ESG', 'Sustentabilidade'],
  },
  {
    id: 'c19',
    title: 'Relatório de Sustentabilidade GRI',
    description: 'Estrutura dos padrões GRI e como elaborar um relatório de sustentabilidade credível.',
    type: 'podcast',
    duration: '42min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-4', name: 'Sustentabilidade Corporativa' },
    tags: ['ESG', 'ISO'],
  },
  {
    id: 'c20',
    title: 'Governança Socioambiental',
    description: 'Estruturas de governança, políticas internas e due diligence socioambiental.',
    type: 'guia',
    duration: '19min',
    ...muxUrls(MUX_ID),
    status: 'nao-iniciado',
    progress: 0,
    trail: { id: 'trail-4', name: 'Sustentabilidade Corporativa' },
    tags: ['ESG', 'Sustentabilidade'],
  },
]

// ---------------------------------------------------------------------------
// Trails
// ---------------------------------------------------------------------------

const MOCK_QUIZ_EMISSOES: Quiz = {
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

const MOCK_QUIZ_RESIDUOS: Quiz = {
  status: 'bloqueado',
  questions: [
    {
      question: 'A Política Nacional de Resíduos Sólidos é regida pela lei:',
      options: ['Lei 6.938/81', 'Lei 12.305/10', 'Lei 9.605/98', 'Lei 11.445/07'],
      correctIndex: 1,
    },
    {
      question: 'Economia circular prioriza:',
      options: ['Aterramento de resíduos', 'Incineração', 'Reuso e reciclagem antes do descarte', 'Redução da produção'],
      correctIndex: 2,
    },
  ],
}

const MOCK_QUIZ_ENERGIA: Quiz = {
  status: 'bloqueado',
  questions: [
    {
      question: 'A norma ISO 50001 trata de:',
      options: ['Gestão ambiental', 'Sistemas de gestão de energia', 'Inventário de GEE', 'Relatório de sustentabilidade'],
      correctIndex: 1,
    },
    {
      question: 'ACL significa:',
      options: ['Ambiente de Contratação Livre', 'Auditoria de Consumo de Luz', 'Análise de Carga Local', 'Acordo Climático de Lisboa'],
      correctIndex: 0,
    },
  ],
}

const MOCK_QUIZ_SUSTENTABILIDADE: Quiz = {
  status: 'concluido',
  questions: [
    {
      question: 'Análise de materialidade serve para:',
      options: ['Calcular emissões', 'Identificar temas relevantes para stakeholders', 'Auditar fornecedores', 'Emitir certificados'],
      correctIndex: 1,
    },
    {
      question: 'Os ODS fazem parte de qual agenda?',
      options: ['Agenda 21', 'Agenda 2030', 'Protocolo de Kyoto', 'Acordo de Paris'],
      correctIndex: 1,
    },
  ],
}

export const MOCK_TRAILS: Trail[] = [
  {
    id: 'trail-1',
    title: 'Gestão de Emissões',
    description: 'Fundamentos do inventário de emissões, metodologias GHG Protocol e boas práticas de reporte.',
    totalItems: 6,
    totalDuration: '2h20min',
    progress: 65,
    status: 'em-andamento',
    accentColor: '#145559',
    contents: CONTENT_ITEMS.filter((c) => c.trail?.id === 'trail-1'),
    quiz: MOCK_QUIZ_EMISSOES,
    certificate: { title: 'Gestão de Emissões', status: 'bloqueado' },
  },
  {
    id: 'trail-2',
    title: 'Resíduos e Circularidade',
    description: 'Gestão de resíduos sólidos, economia circular e logística reversa para empresas.',
    totalItems: 5,
    totalDuration: '1h51min',
    progress: 40,
    status: 'em-andamento',
    accentColor: '#ADCF78',
    contents: CONTENT_ITEMS.filter((c) => c.trail?.id === 'trail-2'),
    quiz: MOCK_QUIZ_RESIDUOS,
    certificate: { title: 'Resíduos e Circularidade', status: 'bloqueado' },
  },
  {
    id: 'trail-3',
    title: 'Eficiência Energética',
    description: 'Auditorias, normas ISO 50001 e estratégias para reduzir o consumo energético corporativo.',
    totalItems: 5,
    totalDuration: '2h04min',
    progress: 30,
    status: 'em-andamento',
    accentColor: '#64BDC6',
    contents: CONTENT_ITEMS.filter((c) => c.trail?.id === 'trail-3'),
    quiz: MOCK_QUIZ_ENERGIA,
    certificate: { title: 'Eficiência Energética', status: 'bloqueado' },
  },
  {
    id: 'trail-4',
    title: 'Sustentabilidade Corporativa',
    description: 'Estratégia, materialidade, ODS e reporte GRI para integrar sustentabilidade ao negócio.',
    totalItems: 5,
    totalDuration: '2h04min',
    progress: 100,
    status: 'concluida',
    accentColor: '#3C4829',
    contents: CONTENT_ITEMS.filter((c) => c.trail?.id === 'trail-4'),
    quiz: MOCK_QUIZ_SUSTENTABILIDADE,
    certificate: { title: 'Sustentabilidade Corporativa', status: 'disponivel' },
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
  trailTitle: 'Gestão de Emissões',
  content: CONTENT_ITEMS[2],
}
