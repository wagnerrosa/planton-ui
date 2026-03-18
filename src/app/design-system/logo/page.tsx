'use client'

import Image from 'next/image'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { CopyPath } from '@/components/ui/CopyButton'
import { cn } from '@/lib/utils'

type LogoAsset = {
  name: string
  description: string
  usage: string
  file: string
  bg: 'light' | 'dark'
}

const brandLogos: { group: string; description: string; items: LogoAsset[] }[] = [
  {
    group: 'Horizontal',
    description: 'Versão principal. Use como padrão sempre que houver espaço horizontal suficiente.',
    items: [
      {
        name: 'Horizontal - Forest',
        description: 'Logo horizontal em verde forest. Para fundos claros.',
        usage: 'Fundos claros (white, card)',
        file: 'public/Logo_Planton_01.svg',
        bg: 'light',
      },
      {
        name: 'Horizontal - Accent',
        description: 'Logo horizontal em verde accent (lima). Para fundos escuros.',
        usage: 'Fundos escuros (forest, dark)',
        file: 'public/logos_planton/planton_horizontal_aberto_accent.svg',
        bg: 'dark',
      },
    ],
  },
  {
    group: 'Vertical',
    description: 'Use quando o espaço horizontal for limitado (ex.: mobile, sidebars estreitas).',
    items: [
      {
        name: 'Vertical',
        description: 'Ícone + nome empilhados verticalmente.',
        usage: 'Espaço horizontal limitado',
        file: 'public/logos_planton/planton_vertical.svg',
        bg: 'light',
      },
    ],
  },
  {
    group: 'Com Tagline',
    description: 'Use somente em contextos de branding específicos (apresentações, materiais de marketing). Não use na UI do produto.',
    items: [
      {
        name: 'Vertical com Tagline',
        description: 'Versão completa com tagline. Uso restrito a materiais de marca.',
        usage: 'Materiais de marketing e branding',
        file: 'public/logos_planton/planton_vertical_tagline.svg',
        bg: 'dark',
      },
    ],
  },
  {
    group: 'Ícone',
    description: 'Símbolo isolado. Use em favicons, avatares e espaços muito reduzidos.',
    items: [
      {
        name: 'Square',
        description: 'Ícone quadrado sem texto.',
        usage: 'Favicon, avatar, espaços compactos',
        file: 'public/logos_planton/planton_square.svg',
        bg: 'light',
      },
      {
        name: 'Square Inside',
        description: 'Variação do ícone com detalhe interno.',
        usage: 'Variação alternativa do ícone',
        file: 'public/logos_planton/planton_square_inside.svg',
        bg: 'light',
      },
    ],
  },
]

const productLogos: { product: string; items: LogoAsset[] }[] = [
  {
    product: 'Planton Academy',
    items: [
      {
        name: 'Academy - Forest',
        description: 'Logo Academy em verde forest.',
        usage: 'Fundos claros',
        file: 'public/logos_produtos/planton_academy_forest.svg',
        bg: 'light',
      },
      {
        name: 'Academy - Branco',
        description: 'Logo Academy em branco.',
        usage: 'Fundos escuros',
        file: 'public/logos_produtos/planton_academy_branco.svg',
        bg: 'dark',
      },
    ],
  },
  {
    product: 'Planton Genius',
    items: [
      {
        name: 'Genius - Forest',
        description: 'Logo Genius em verde forest.',
        usage: 'Fundos claros',
        file: 'public/logos_produtos/planton_genius_forest.svg',
        bg: 'light',
      },
      {
        name: 'Genius - Branco',
        description: 'Logo Genius em branco.',
        usage: 'Fundos escuros',
        file: 'public/logos_produtos/planton_genius_branco.svg',
        bg: 'dark',
      },
    ],
  },
]


function LogoCard({ asset }: { asset: LogoAsset }) {
  const publicPath = '/' + asset.file.replace('public/', '')

  return (
    <div className="border-r border-b border-border flex flex-col">
      {/* Preview */}
      <div
        className={`flex items-center justify-center h-36 px-8 ${
          asset.bg === 'dark' ? 'bg-planton-forest' : 'bg-surface-default'
        }`}
      >
        <Image
          src={publicPath}
          alt={asset.name}
          width={200}
          height={80}
          className="object-contain max-h-16 w-auto"
          unoptimized
        />
      </div>

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-2 border-t border-border">
        <span className="font-sans text-sm font-medium text-foreground">{asset.name}</span>
        <span className="font-sans text-xs text-planton-muted leading-relaxed">{asset.description}</span>

        <div className="flex items-center gap-1.5 mt-1">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              asset.bg === 'dark' ? 'bg-planton-forest' : 'bg-border'
            }`}
          />
          <span className="font-mono text-[11px] text-planton-muted/70 uppercase tracking-[0.08em]">
            {asset.usage}
          </span>
        </div>

        <CopyPath path={asset.file} />

        <a
          href={publicPath}
          download
          className={cn(
            'relative inline-flex items-center overflow-hidden border rounded-none group mt-1',
            'font-sans font-medium tracking-[0.02em] text-sm px-6 py-3',
            'transition-[color] duration-[300ms] ease-out',
            'border-planton-accent text-planton-accent hover:text-planton-white',
          )}
        >
          <span aria-hidden className="absolute inset-0 -translate-x-full transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 group-hover:translate-x-0 bg-planton-accent" />
          <span className="relative z-10">Download SVG</span>
        </a>
      </div>
    </div>
  )
}

export default function LogoPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-16">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <Eyebrow>Foundations</Eyebrow>
        <Heading as="h1" size="heading-xl">Logo</Heading>
        <Body muted className="max-w-2xl">
          Uso correto da marca Planton e suas variações.
        </Body>
      </div>

      {/* Usage Rules */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Regras de uso</span>
          <h2 className="font-heading text-xl text-planton-forest tracking-[-0.02em]">Cor do logo por contexto</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-border overflow-hidden">
          {/* Light background */}
          <div className="flex flex-col">
            <div className="bg-white flex items-center justify-center h-40 px-12">
              <Image
                src="/Logo_Planton_01.svg"
                alt="Planton - fundo claro"
                width={200}
                height={50}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="p-4 bg-surface-card border-t border-border flex flex-col gap-1">
              <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.08em]">Fundo claro</span>
              <span className="font-sans text-sm text-foreground">Use o logo em <strong>Planton Forest</strong> (verde escuro)</span>
              <span className="font-mono text-xs text-planton-muted/70 mt-1">bg-white · bg-card · bg-surface-default</span>
            </div>
          </div>

          {/* Dark background */}
          <div className="flex flex-col">
            <div className="bg-planton-forest flex items-center justify-center h-40 px-12">
              <Image
                src="/logos_planton/planton_horizontal_aberto_accent.svg"
                alt="Planton - fundo escuro"
                width={200}
                height={50}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="p-4 bg-surface-card border-t border-border flex flex-col gap-1">
              <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.08em]">Fundo escuro</span>
              <span className="font-sans text-sm text-foreground">Use o logo em <strong>Planton Accent</strong> (verde lima)</span>
              <span className="font-mono text-xs text-planton-muted/70 mt-1">bg-planton-forest · bg-planton-dark · bg-surface-dark</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logo Variations */}
      {brandLogos.map((group) => (
        <section key={group.group} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Variações da marca</span>
            <h2 className="font-heading text-xl text-planton-forest tracking-[-0.02em]">{group.group}</h2>
            <p className="font-sans text-sm text-planton-muted leading-[1.65] max-w-xl">{group.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border-t border-l border-border overflow-hidden">
            {group.items.map((asset) => (
              <LogoCard key={asset.file} asset={asset} />
            ))}
          </div>
        </section>
      ))}

      {/* Product Logos */}
      <section className="flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Logos de produto</span>
          <h2 className="font-heading text-xl text-planton-forest tracking-[-0.02em]">Produtos Planton</h2>
          <p className="font-sans text-sm text-planton-muted leading-[1.65] max-w-xl">
            Cada produto tem versões para fundos claros (forest) e escuros (branco). Nunca misture - use sempre a versão correta para o contexto.
          </p>
        </div>

        {productLogos.map((product) => (
          <div key={product.product} className="flex flex-col gap-4">
            <h3 className="font-sans text-sm font-medium text-foreground">{product.product}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border-t border-l border-border overflow-hidden">
              {product.items.map((asset) => (
                <LogoCard key={asset.file} asset={asset} />
              ))}
            </div>
          </div>
        ))}
      </section>

    </main>
  )
}
