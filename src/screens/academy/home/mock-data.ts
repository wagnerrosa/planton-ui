export type ContentStatus = 'nao-iniciado' | 'visualizado' | 'concluido'
export type ContentType = 'video' | 'podcast' | 'artigo' | 'guia'

export type ContentItem = {
  id: string
  title: string
  type: ContentType
  duration: string
  status: ContentStatus
  progress: number
  thumbnailColor: string
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
    contents: [
      { id: 'c1', title: 'O que é GHG Protocol', type: 'video', duration: '18min', status: 'concluido', progress: 100, thumbnailColor: '#0A2D30' },
      { id: 'c2', title: 'Escopos 1, 2 e 3', type: 'video', duration: '24min', status: 'concluido', progress: 100, thumbnailColor: '#145559' },
      { id: 'c3', title: 'Fatores de Emissão', type: 'artigo', duration: '12min', status: 'visualizado', progress: 60, thumbnailColor: '#1e3a2f' },
      { id: 'c4', title: 'Calculando Emissões na Prática', type: 'video', duration: '31min', status: 'nao-iniciado', progress: 0, thumbnailColor: '#0A2D30' },
      { id: 'c5', title: 'Ferramentas de Inventário', type: 'guia', duration: '15min', status: 'nao-iniciado', progress: 0, thumbnailColor: '#3C4829' },
      { id: 'c6', title: 'Podcast: Tendências em GEE', type: 'podcast', duration: '40min', status: 'nao-iniciado', progress: 0, thumbnailColor: '#072E14' },
    ],
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
    contents: [
      { id: 'c7', title: 'Introdução ao ESG', type: 'video', duration: '20min', status: 'concluido', progress: 100, thumbnailColor: '#3C4829' },
      { id: 'c8', title: 'Frameworks de Reporte', type: 'artigo', duration: '15min', status: 'concluido', progress: 100, thumbnailColor: '#145559' },
      { id: 'c9', title: 'ESG na Prática', type: 'video', duration: '28min', status: 'concluido', progress: 100, thumbnailColor: '#0A2D30' },
      { id: 'c10', title: 'Guia de Implementação', type: 'guia', duration: '42min', status: 'concluido', progress: 100, thumbnailColor: '#072E14' },
    ],
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
    contents: [
      { id: 'c11', title: 'O que é Pegada de Carbono', type: 'video', duration: '15min', status: 'nao-iniciado', progress: 0, thumbnailColor: '#0A2D30' },
      { id: 'c12', title: 'Metodologias de Cálculo', type: 'artigo', duration: '20min', status: 'nao-iniciado', progress: 0, thumbnailColor: '#145559' },
      { id: 'c13', title: 'Cases de Redução', type: 'video', duration: '35min', status: 'nao-iniciado', progress: 0, thumbnailColor: '#3C4829' },
      { id: 'c14', title: 'Compensação de Emissões', type: 'podcast', duration: '30min', status: 'nao-iniciado', progress: 0, thumbnailColor: '#072E14' },
      { id: 'c15', title: 'Plano de Descarbonização', type: 'guia', duration: '25min', status: 'nao-iniciado', progress: 0, thumbnailColor: '#1e3a2f' },
    ],
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

export const CONTINUE_WATCHING = {
  trailId: 'trail-1',
  trailTitle: 'Gestão de Emissões de GEE',
  content: MOCK_TRAILS[0].contents[2],
}
