import Image from 'next/image'
import { Download } from 'lucide-react'

const images = [
  {
    slug: 'CAATINGA-BG',
    label: 'Caatinga',
    description: 'Vegetação seca e resistente do semiárido nordestino, com cactos, bromélias e solo rachado sob o sol intenso.',
  },
  {
    slug: 'MATA-ATLANTICA-BG',
    label: 'Mata Atlântica',
    description: 'Uma das florestas mais biodiversas do planeta, com densa vegetação tropical, rios e fauna exuberante.',
  },
  {
    slug: 'PAMPA-BG',
    label: 'Pampa',
    description: 'Campos abertos do sul do Brasil, com gramíneas nativas, céu amplo e a paisagem característica dos pampas gaúchos.',
  },
  {
    slug: 'PANTANAL-BG',
    label: 'Pantanal',
    description: 'A maior planície alagável do mundo, rica em vida selvagem, águas espelhadas e vegetação de transição.',
  },
  {
    slug: 'SERRA-SUL-BG',
    label: 'Serra do Sul',
    description: 'Montanhas com mata de araucária, névoa entre os picos e o frio característico do planalto meridional brasileiro.',
  },
]

export default function ImagesPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16">

      <div className="flex flex-col gap-2 mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Foundations</span>
        <h1 className="font-heading text-[clamp(2.5rem,3.5vw,3.5rem)] leading-[1.05] tracking-[-0.04em] text-planton-forest">
          Imagens
        </h1>
      </div>

      <p className="font-sans text-sm text-planton-muted leading-[1.65] max-w-xl mb-12">
        Cenários dos biomas brasileiros criados especialmente para a Planton com tecnologia de IA generativa.
        Disponíveis para uso nos produtos da plataforma.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
        {images.map(({ slug, label, description }) => {
          const src = `/assets/${slug}.jpg`
          return (
            <div key={slug} className="border-b border-r border-border flex flex-col">
              <div className="relative aspect-video overflow-hidden bg-planton-dark">
                <Image
                  src={src}
                  alt={label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <span className="font-mono text-xs uppercase tracking-[0.05em] text-planton-accent">
                  {label}
                </span>
                <p className="font-sans text-xs text-planton-muted leading-[1.65] flex-1">
                  {description}
                </p>
                <a
                  href={src}
                  download={`${slug}.jpg`}
                  className="mt-1 self-start inline-flex items-center gap-2 border border-planton-accent text-planton-accent font-sans font-medium text-xs tracking-[0.02em] px-4 py-2 rounded-none transition-colors hover:bg-planton-accent hover:text-button-on-accent"
                >
                  <Download size={13} />
                  Download
                </a>
              </div>
            </div>
          )
        })}
      </div>

    </main>
  )
}
