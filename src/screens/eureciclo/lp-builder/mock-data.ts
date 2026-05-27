export type MaterialType = 'plastico' | 'papel' | 'vidro' | 'metal'

export const MATERIALS: { value: MaterialType; label: string }[] = [
  { value: 'plastico', label: 'Plástico' },
  { value: 'papel', label: 'Papel' },
  { value: 'vidro', label: 'Vidro' },
  { value: 'metal', label: 'Metal' },
]

export const SETORES = [
  'Bebidas',
  'Alimentos',
  'Cosméticos',
  'Limpeza',
  'Higiene Pessoal',
  'Farmacêutico',
  'Varejo',
  'Têxtil',
  'Eletrônicos',
  'Outros',
]

export const YEAR_OPTIONS = [2022, 2023, 2024, 2025]

export type RecyclingEntry = {
  id: string
  year: number
  material: MaterialType
  tons: number
}

export type Client = {
  cnpj: string
  name: string
  sector: string
  recycling: RecyclingEntry[]
}

function buildRecyclingFor(seed: number): RecyclingEntry[] {
  const out: RecyclingEntry[] = []
  let counter = 0
  for (const year of YEAR_OPTIONS) {
    for (const mat of MATERIALS) {
      const base =
        mat.value === 'plastico' ? 160 :
        mat.value === 'papel' ? 220 :
        mat.value === 'vidro' ? 95 :
        55
      const yearBoost = (year - 2022) * 8
      const seedJitter = ((seed * 13 + counter * 7) % 25) - 12
      out.push({
        id: `${seed}-${year}-${mat.value}`,
        year,
        material: mat.value,
        tons: Math.max(10, base + yearBoost + seedJitter),
      })
      counter++
    }
  }
  return out
}

export const MOCK_CLIENTS: Client[] = [
  {
    cnpj: '12.345.678/0001-90',
    name: 'Aurora Bebidas S.A.',
    sector: 'Bebidas',
    recycling: buildRecyclingFor(1),
  },
  {
    cnpj: '23.456.789/0001-01',
    name: 'Verde Alimentos Ltda.',
    sector: 'Alimentos',
    recycling: buildRecyclingFor(2),
  },
  {
    cnpj: '34.567.890/0001-12',
    name: 'Naturela Cosméticos',
    sector: 'Cosméticos',
    recycling: buildRecyclingFor(3),
  },
  {
    cnpj: '45.678.901/0001-23',
    name: 'LimpaTudo Indústria',
    sector: 'Limpeza',
    recycling: buildRecyclingFor(4),
  },
  {
    cnpj: '56.789.012/0001-34',
    name: 'Pura Higiene Pessoal',
    sector: 'Higiene Pessoal',
    recycling: buildRecyclingFor(5),
  },
  {
    cnpj: '67.890.123/0001-45',
    name: 'Farma Brasil Distribuidora',
    sector: 'Farmacêutico',
    recycling: buildRecyclingFor(6),
  },
  {
    cnpj: '78.901.234/0001-56',
    name: 'MegaVarejo Supermercados',
    sector: 'Varejo',
    recycling: buildRecyclingFor(7),
  },
  {
    cnpj: '89.012.345/0001-67',
    name: 'Tecidos Atlântico S.A.',
    sector: 'Têxtil',
    recycling: buildRecyclingFor(8),
  },
]

export type LPRecord = {
  id: string
  clientName: string
  cnpj: string
  emails: string[]
  lpUrl: string
  sentAt: Date
  accessCount: number
}

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86_400_000)
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

export function buildLpUrl(clientName: string, cnpj: string): string {
  const idSuffix = cnpj.replace(/\D/g, '').slice(-4)
  return `https://eureciclo.planton.eco.br/${slugify(clientName)}-${idSuffix}`
}

const HISTORY_SEED: Array<{ name: string; cnpj: string; emails: string[]; days: number }> = [
  { name: 'Aurora Bebidas S.A.',          cnpj: '12.345.678/0001-90', emails: ['sustainability@aurora.com.br'],                             days: 1  },
  { name: 'Verde Alimentos Ltda.',         cnpj: '23.456.789/0001-01', emails: ['contato@verdealimentos.com.br','esg@verdealimentos.com.br'], days: 2  },
  { name: 'Naturela Cosméticos',           cnpj: '34.567.890/0001-12', emails: ['marketing@naturela.com.br'],                               days: 3  },
  { name: 'LimpaTudo Indústria',           cnpj: '45.678.901/0001-23', emails: ['lp@limpatudo.ind.br'],                                     days: 4  },
  { name: 'Farma Brasil Distribuidora',    cnpj: '67.890.123/0001-45', emails: ['esg@farmabrasil.com.br','relatorio@farmabrasil.com.br'],    days: 5  },
  { name: 'MegaVarejo Supermercados',      cnpj: '78.901.234/0001-56', emails: ['sustentabilidade@megavarejo.com.br'],                      days: 6  },
  { name: 'Tecidos Atlântico S.A.',        cnpj: '89.012.345/0001-67', emails: ['esg@atlantico.com.br'],                                    days: 7  },
  { name: 'Pura Higiene Pessoal',          cnpj: '56.789.012/0001-34', emails: ['marketing@purahigiene.com.br'],                            days: 8  },
  { name: 'Recicla Fácil Ltda.',           cnpj: '11.222.333/0001-44', emails: ['contato@recicilafacil.com.br'],                            days: 10 },
  { name: 'BioEmbala Embalagens',          cnpj: '22.333.444/0001-55', emails: ['sustent@bioembala.com.br'],                                days: 11 },
  { name: 'Verdão Agro S.A.',              cnpj: '33.444.555/0001-66', emails: ['esg@verdaoagro.com.br','dir@verdaoagro.com.br'],            days: 12 },
  { name: 'Plásticos do Sul Ltda.',        cnpj: '44.555.666/0001-77', emails: ['ambiental@plasticosul.com.br'],                            days: 13 },
  { name: 'Papelão Certo Ind.',            cnpj: '55.666.777/0001-88', emails: ['lp@papelaocerto.ind.br'],                                  days: 15 },
  { name: 'Vidros Premium S.A.',           cnpj: '66.777.888/0001-99', emails: ['esg@vidrospremium.com.br'],                                days: 16 },
  { name: 'Metais Renova Ltda.',           cnpj: '77.888.999/0001-00', emails: ['sustent@metaisrenova.com.br'],                             days: 17 },
  { name: 'EcoFoam Indústria',             cnpj: '88.999.000/0001-11', emails: ['marketing@ecofoam.com.br'],                               days: 18 },
  { name: 'Caixas & Cia. Ltda.',           cnpj: '99.000.111/0001-22', emails: ['contato@caixasecia.com.br'],                               days: 19 },
  { name: 'Alumínio Brasil S.A.',          cnpj: '10.111.222/0001-33', emails: ['esg@aluminbrasil.com.br','dir@aluminbrasil.com.br'],        days: 20 },
  { name: 'Saúde Verde Cosméticos',        cnpj: '21.222.333/0001-44', emails: ['lp@saudeverdecos.com.br'],                                 days: 22 },
  { name: 'TechPack Embalagens',           cnpj: '32.333.444/0001-55', emails: ['sustent@techpack.com.br'],                                 days: 23 },
  { name: 'Borracha Circular Ltda.',       cnpj: '43.444.555/0001-66', emails: ['ambiental@borrachacircular.com.br'],                       days: 25 },
  { name: 'Rio Reciclagem S.A.',           cnpj: '54.555.666/0001-77', emails: ['esg@riorecy.com.br'],                                      days: 26 },
  { name: 'CleanPack Higiene',             cnpj: '65.666.777/0001-88', emails: ['marketing@cleanpack.com.br'],                              days: 28 },
  { name: 'Fibras do Cerrado Ltda.',       cnpj: '76.777.888/0001-99', emails: ['contato@fibrascerrado.com.br'],                            days: 30 },
  { name: 'Polímeros Brasil S.A.',         cnpj: '87.888.999/0001-00', emails: ['lp@polimerosbrasil.com.br','esg@polimerosbrasil.com.br'],   days: 31 },
  { name: 'Embalagem Sustentável Ltda.',   cnpj: '98.999.000/0001-11', emails: ['sustent@embalasust.com.br'],                               days: 33 },
  { name: 'Natura Papel Ind.',             cnpj: '09.000.111/0001-22', emails: ['ambiental@naturapapel.ind.br'],                            days: 35 },
  { name: 'Vidraçaria Ecológica S.A.',     cnpj: '10.112.223/0001-33', emails: ['esg@vidraecol.com.br'],                                    days: 37 },
  { name: 'Iron Cycle Ltda.',              cnpj: '21.223.334/0001-44', emails: ['sustent@ironcycle.com.br'],                                days: 38 },
  { name: 'GreenFlex Embalagens',          cnpj: '32.334.445/0001-55', emails: ['marketing@greenflex.com.br'],                              days: 40 },
  { name: 'Papel & Vida S.A.',             cnpj: '43.445.556/0001-66', emails: ['contato@papelvida.com.br'],                                days: 42 },
  { name: 'Recicle Mais Cooperativa',      cnpj: '54.556.667/0001-77', emails: ['lp@reciclemais.coop.br'],                                  days: 43 },
  { name: 'Engeplast Ltda.',               cnpj: '65.667.778/0001-88', emails: ['esg@engeplast.com.br'],                                    days: 45 },
  { name: 'Tropical Bebidas S.A.',         cnpj: '76.778.889/0001-99', emails: ['sustent@tropicalbebidas.com.br'],                          days: 47 },
  { name: 'Ambiência Limpeza Ltda.',       cnpj: '87.889.990/0001-00', emails: ['ambiental@ambiencia.com.br'],                              days: 48 },
  { name: 'Nova Era Alimentos S.A.',       cnpj: '98.990.001/0001-11', emails: ['esg@novaera.com.br','dir@novaera.com.br'],                  days: 50 },
  { name: 'Circulo de Metais Ltda.',       cnpj: '09.001.112/0001-22', emails: ['marketing@circulometais.com.br'],                          days: 52 },
  { name: 'Ecovidros Norte S.A.',          cnpj: '10.113.224/0001-33', emails: ['contato@ecovidrosnorte.com.br'],                           days: 54 },
  { name: 'Plástico Verde Ind.',           cnpj: '21.224.335/0001-44', emails: ['lp@plasticoverde.ind.br'],                                 days: 55 },
  { name: 'Recicladora Central Ltda.',     cnpj: '32.335.446/0001-55', emails: ['sustent@reciclacentral.com.br'],                           days: 57 },
  { name: 'AluBras Indústria',             cnpj: '43.446.557/0001-66', emails: ['esg@alubras.ind.br'],                                      days: 60 },
  { name: 'Pharma Green Ltda.',            cnpj: '54.557.668/0001-77', emails: ['ambiental@pharmagreen.com.br'],                            days: 62 },
  { name: 'BoxEco Embalagens S.A.',        cnpj: '65.668.779/0001-88', emails: ['marketing@boxeco.com.br'],                                 days: 64 },
  { name: 'Sudeste Reciclagem Ltda.',      cnpj: '76.779.880/0001-99', emails: ['contato@sudesterec.com.br'],                               days: 65 },
  { name: 'Fibra Forte S.A.',              cnpj: '87.880.991/0001-00', emails: ['lp@fibraforte.com.br','esg@fibraforte.com.br'],             days: 67 },
  { name: 'VerdeGás Distribuidora',        cnpj: '98.991.002/0001-11', emails: ['sustent@verdegas.com.br'],                                 days: 70 },
  { name: 'Metalciclo Ltda.',              cnpj: '09.002.113/0001-22', emails: ['ambiental@metalciclo.com.br'],                             days: 72 },
  { name: 'Cooperativa EcoVidro',          cnpj: '10.114.225/0001-33', emails: ['esg@ecovidro.coop.br'],                                    days: 75 },
  { name: 'PaperPath Indústria',           cnpj: '21.225.336/0001-44', emails: ['marketing@paperpath.ind.br'],                              days: 77 },
  { name: 'Plastec Circular S.A.',         cnpj: '32.336.447/0001-55', emails: ['contato@plasteccircular.com.br'],                          days: 80 },
]

export const MOCK_LP_HISTORY: LPRecord[] = HISTORY_SEED.map((s, i) => ({
  id: `h${i + 1}`,
  clientName: s.name,
  cnpj: s.cnpj,
  emails: s.emails,
  lpUrl: buildLpUrl(s.name, s.cnpj),
  sentAt: daysAgo(s.days),
  accessCount: Math.max(0, ((i * 47 + s.days * 13) % 180) + (i % 3 === 0 ? 40 : 0)),
}))

export function getMaterialLabel(value: MaterialType): string {
  return MATERIALS.find((m) => m.value === value)?.label ?? value
}

export function formatCnpj(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}
