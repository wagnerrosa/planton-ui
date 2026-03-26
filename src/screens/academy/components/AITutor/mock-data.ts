import type { QuickPrompt, RichBlock } from './types'

export const QUICK_PROMPTS: QuickPrompt[] = [
  { label: 'Quero uma trilha para começar', prompt: 'Quero começar a estudar, me recomende uma trilha' },
  { label: 'Tenho uma dúvida sobre o conteúdo', prompt: 'Tenho uma dúvida sobre um conteúdo da plataforma' },
  { label: 'Me explica um conceito', prompt: 'Pode me explicar um conceito do curso?' },
]

/** Respostas mock indexadas por keyword simples. */
const MOCK_RESPONSES: Record<string, RichBlock[]> = {
  estudar: [
    { type: 'text', content: 'Com base no seu progresso, recomendo focar nestes conteudos:' },
    {
      type: 'list',
      items: [
        'Inventario de Emissoes — voce esta em 60%, falta pouco!',
        'Fatores de Emissao — e pre-requisito para a proxima trilha',
        'Relatorio GHG Protocol — conteudo novo disponivel',
      ],
    },
    { type: 'highlight', content: 'Dica: completar "Inventario de Emissoes" desbloqueia o certificado da trilha Carbon Basics.' },
  ],
  gee: [
    { type: 'text', content: 'GEE significa Gases de Efeito Estufa. Sao gases que absorvem e reemitem radiacao infravermelha na atmosfera, contribuindo para o aquecimento global.' },
    {
      type: 'list',
      items: [
        'CO2 (dioxido de carbono) — principal GEE de origem antropica',
        'CH4 (metano) — pecuaria, aterros e gas natural',
        'N2O (oxido nitroso) — agricultura e processos industriais',
      ],
    },
    { type: 'highlight', content: 'Na trilha "Carbon Basics" voce encontra um modulo completo sobre GEE com exercicios praticos.' },
  ],
  trilha: [
    { type: 'text', content: 'Para quem esta comecando, recomendo estas trilhas:' },
    {
      type: 'list',
      items: [
        'Carbon Basics — fundamentos de carbono e inventario',
        'ESG Essentials — introducao ao framework ESG',
        'Sustentabilidade 101 — visao geral de sustentabilidade corporativa',
      ],
    },
  ],
  iniciante: [
    { type: 'text', content: 'Para quem esta comecando, recomendo estas trilhas:' },
    {
      type: 'list',
      items: [
        'Carbon Basics — fundamentos de carbono e inventario',
        'ESG Essentials — introducao ao framework ESG',
        'Sustentabilidade 101 — visao geral de sustentabilidade corporativa',
      ],
    },
  ],
}

const FALLBACK_RESPONSE: RichBlock[] = [
  { type: 'text', content: 'Boa pergunta! Ainda estou aprendendo sobre esse tema. Por enquanto, recomendo explorar as trilhas disponiveis na plataforma — elas cobrem os principais topicos de sustentabilidade e carbono.' },
]

export function getMockResponse(input: string): RichBlock[] {
  const lower = input.toLowerCase()
  for (const [keyword, blocks] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(keyword)) return blocks
  }
  return FALLBACK_RESPONSE
}
