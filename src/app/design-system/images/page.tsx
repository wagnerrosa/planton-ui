import Image from 'next/image'
import { Download } from 'lucide-react'

const images = [
  {
    slug: 'CAATINGA-BG',
    label: 'Caatinga',
    description: 'Dry, resilient vegetation of the northeastern semi-arid region, with cacti, bromeliads and cracked soil under intense sunlight.',
  },
  {
    slug: 'MATA-ATLANTICA-BG',
    label: 'Mata Atlântica',
    description: 'One of the most biodiverse forests on the planet, with dense tropical vegetation, rivers and lush wildlife.',
  },
  {
    slug: 'PAMPA-BG',
    label: 'Pampa',
    description: 'Open grasslands of southern Brazil, with native grasses, wide skies and the characteristic landscape of the gaucho pampas.',
  },
  {
    slug: 'PANTANAL-BG',
    label: 'Pantanal',
    description: 'The largest tropical wetland in the world, rich in wildlife, mirrored waters and transitional vegetation.',
  },
  {
    slug: 'SERRA-SUL-BG',
    label: 'Serra do Sul',
    description: 'Mountains with araucaria forests, mist between the peaks and the characteristic cold of the Brazilian southern highlands.',
  },
]

export default function ImagesPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16">

      <div className="flex flex-col gap-2 mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Foundations</span>
        <h1 className="font-heading text-[clamp(2.5rem,3.5vw,3.5rem)] leading-[1.05] tracking-[-0.04em] text-planton-forest">
          Images
        </h1>
      </div>

      <p className="font-sans text-sm text-planton-muted leading-[1.65] max-w-xl mb-12">
        Sceneries of Brazilian biomes created exclusively for Planton with generative AI technology.
        Available for use across platform products.
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
