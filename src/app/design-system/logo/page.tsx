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
    description: 'Primary version. Use as the default whenever there is enough horizontal space.',
    items: [
      {
        name: 'Horizontal - Forest',
        description: 'Horizontal logo in forest green. For light backgrounds.',
        usage: 'Light backgrounds (white, card)',
        file: 'public/Logo_Planton_01.svg',
        bg: 'light',
      },
      {
        name: 'Horizontal - Accent',
        description: 'Horizontal logo in accent green (lime). For dark backgrounds.',
        usage: 'Dark backgrounds (forest, dark)',
        file: 'public/logos_planton/planton_horizontal_aberto_accent.svg',
        bg: 'dark',
      },
    ],
  },
  {
    group: 'Vertical',
    description: 'Use when horizontal space is limited (e.g. mobile, narrow sidebars).',
    items: [
      {
        name: 'Vertical',
        description: 'Icon + name stacked vertically.',
        usage: 'Limited horizontal space',
        file: 'public/logos_planton/planton_vertical.svg',
        bg: 'light',
      },
    ],
  },
  {
    group: 'With Tagline',
    description: 'Use only in specific branding contexts (presentations, marketing materials). Do not use in product UI.',
    items: [
      {
        name: 'Vertical with Tagline',
        description: 'Full version with tagline. Restricted to brand materials.',
        usage: 'Marketing and branding materials',
        file: 'public/logos_planton/planton_vertical_tagline.svg',
        bg: 'dark',
      },
    ],
  },
  {
    group: 'Icon',
    description: 'Standalone symbol. Use in favicons, avatars and very small spaces.',
    items: [
      {
        name: 'Square',
        description: 'Square icon without text.',
        usage: 'Favicon, avatar, compact spaces',
        file: 'public/logos_planton/planton_square.svg',
        bg: 'light',
      },
      {
        name: 'Square Inside',
        description: 'Icon variation with inner detail.',
        usage: 'Alternative icon variation',
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
        description: 'Academy logo in forest green.',
        usage: 'Light backgrounds',
        file: 'public/logos_produtos/planton_academy_forest.svg',
        bg: 'light',
      },
      {
        name: 'Academy - White',
        description: 'Academy logo in white.',
        usage: 'Dark backgrounds',
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
        description: 'Genius logo in forest green.',
        usage: 'Light backgrounds',
        file: 'public/logos_produtos/planton_genius_forest.svg',
        bg: 'light',
      },
      {
        name: 'Genius - White',
        description: 'Genius logo in white.',
        usage: 'Dark backgrounds',
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
          Correct usage of the Planton brand and its variations.
        </Body>
      </div>

      {/* Usage Rules */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Usage rules</span>
          <h2 className="font-heading text-xl text-planton-forest tracking-[-0.02em]">Logo color by context</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-border overflow-hidden">
          {/* Light background */}
          <div className="flex flex-col">
            <div className="bg-white flex items-center justify-center h-40 px-12">
              <Image
                src="/Logo_Planton_01.svg"
                alt="Planton - light background"
                width={200}
                height={50}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="p-4 bg-surface-card border-t border-border flex flex-col gap-1">
              <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.08em]">Light background</span>
              <span className="font-sans text-sm text-foreground">Use the logo in <strong>Planton Forest</strong> (dark green)</span>
              <span className="font-mono text-xs text-planton-muted/70 mt-1">bg-white · bg-card · bg-surface-default</span>
            </div>
          </div>

          {/* Dark background */}
          <div className="flex flex-col">
            <div className="bg-planton-forest flex items-center justify-center h-40 px-12">
              <Image
                src="/logos_planton/planton_horizontal_aberto_accent.svg"
                alt="Planton - dark background"
                width={200}
                height={50}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="p-4 bg-surface-card border-t border-border flex flex-col gap-1">
              <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.08em]">Dark background</span>
              <span className="font-sans text-sm text-foreground">Use the logo in <strong>Planton Accent</strong> (lime green)</span>
              <span className="font-mono text-xs text-planton-muted/70 mt-1">bg-planton-forest · bg-planton-dark · bg-surface-dark</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logo Variations */}
      {brandLogos.map((group) => (
        <section key={group.group} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Brand variations</span>
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
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Product logos</span>
          <h2 className="font-heading text-xl text-planton-forest tracking-[-0.02em]">Planton Products</h2>
          <p className="font-sans text-sm text-planton-muted leading-[1.65] max-w-xl">
            Each product has versions for light (forest) and dark (white) backgrounds. Never mix them — always use the correct version for the context.
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
