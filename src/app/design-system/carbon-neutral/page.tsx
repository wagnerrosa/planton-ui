'use client'

import Image from 'next/image'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { CopyPath } from '@/components/ui/CopyButton'
import { cn } from '@/lib/utils'

type SealAsset = {
  name: string
  description: string
  usage: string
  when: string
  file: string
  bg: 'light' | 'dark' | 'neutral'
  previewPng?: boolean
}

type SealGroup = {
  label: string
  title: string
  description: string
  items: SealAsset[]
}

const sealGroups: SealGroup[] = [
  {
    label: 'Versão principal',
    title: 'Principal: duas variantes',
    description: 'A versão principal usa as cores da marca (gradiente accent + texto forest/branco). Escolha a variante conforme o fundo: escura para fundos escuros/neutros, clara para fundos brancos ou claros.',
    items: [
      {
        name: 'Principal, Fundo escuro',
        description: 'Ícone com gradiente accent, texto "PLANTON" em branco. Para fundos escuros e neutros.',
        usage: 'Fundos escuros e neutros',
        when: 'Fundo escuro, neutro, ou com contraste insuficiente para texto forest.',
        file: 'public/carbon_neutral/planton_carbon_neutral.svg',
        bg: 'neutral',
        previewPng: true,
      },
      {
        name: 'Principal, Fundo claro',
        description: 'Ícone com gradiente accent, texto "PLANTON" em forest. Para fundos brancos e claros.',
        usage: 'Fundos claros (white, card, creme)',
        when: 'Fundo branco ou claro onde o texto branco perderia contraste.',
        file: 'public/carbon_neutral/planton_carbon_neutral_.svg',
        bg: 'light',
        previewPng: true,
      },
    ],
  },
  {
    label: 'Versões monocromáticas',
    title: 'Monocromáticas',
    description: 'Para contextos com restrição de cor, impressão, ou quando a versão principal não é adequada.',
    items: [
      {
        name: 'Branca',
        description: 'Toda branca. Para fundos escuros onde a versão principal não tem contraste.',
        usage: 'Fundos escuros (forest, dark, foto escura)',
        when: 'Fundo muito escuro ou foto escura onde qualquer cor se perde.',
        file: 'public/carbon_neutral/planton_carbon_neutral_white.svg',
        bg: 'dark',
      },
      {
        name: 'Forest',
        description: 'Toda na cor forest. Alternativa sóbria para fundos claros e contextos com restrição de cor.',
        usage: 'Fundos claros com restrição de cor',
        when: 'Quando o uso de cor é restrito (impressão, contexto corporativo sóbrio).',
        file: 'public/carbon_neutral/planton_carbon_neutral_forrest.svg',
        bg: 'light',
        previewPng: true,
      },
      {
        name: 'Forest N',
        description: 'Forest com destaque visual no "N" de Neutro. Moldura ao redor do ícone.',
        usage: 'Fundos claros com espaço para o N destacado',
        when: 'Quando há espaço para dar ênfase ao conceito de Neutro.',
        file: 'public/carbon_neutral/planton_carbon_neutral_forrest_N.svg',
        bg: 'light',
        previewPng: true,
      },
    ],
  },
]

function SealCard({ asset }: { asset: SealAsset }) {
  const publicPath = '/' + asset.file.replace('public/', '')
  const pngPath = publicPath.replace('.svg', '.png')

  const bgClass =
    asset.bg === 'dark'
      ? 'bg-planton-forest'
      : asset.bg === 'neutral'
        ? 'bg-[#0A2D30]'
        : 'bg-white'

  const previewSrc = asset.previewPng ? pngPath : publicPath

  return (
    <div className="border-r border-b border-border flex flex-col">
      {/* Preview */}
      <div className={`flex items-center justify-center h-64 px-10 ${bgClass}`}>
        <Image
          src={previewSrc}
          alt={asset.name}
          width={160}
          height={200}
          className="object-contain max-h-44 w-auto"
          unoptimized
        />
      </div>

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-2 border-t border-border flex-1">
        <span className="font-sans text-sm font-medium text-foreground">{asset.name}</span>
        <span className="font-sans text-xs text-planton-muted leading-relaxed">{asset.description}</span>

        <div className="flex items-start gap-2 mt-1 p-2.5 bg-planton-accent/5 border border-planton-accent/15">
          <span className="font-mono text-[10px] text-planton-accent uppercase tracking-[0.08em] mt-0.5 shrink-0">Quando usar</span>
          <span className="font-sans text-xs text-planton-muted/80 leading-relaxed">{asset.when}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-1">
          <span className={`inline-block w-2 h-2 rounded-full ${asset.bg === 'dark' ? 'bg-planton-forest' : 'bg-border'}`} />
          <span className="font-mono text-[11px] text-planton-muted/70 uppercase tracking-[0.08em]">{asset.usage}</span>
        </div>

        <CopyPath path={asset.file} />

        <div className="flex gap-2 mt-1">
          <a
            href={publicPath}
            download
            className={cn(
              'relative inline-flex items-center overflow-hidden border rounded-none group flex-1 justify-center',
              'font-sans font-medium tracking-[0.02em] text-sm px-4 py-3',
              'transition-[color] duration-[300ms] ease-out',
              'border-planton-accent text-planton-accent hover:text-planton-white',
            )}
          >
            <span aria-hidden className="absolute inset-0 -translate-x-full transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 group-hover:translate-x-0 bg-planton-accent" />
            <span className="relative z-10">SVG</span>
          </a>
          <a
            href={pngPath}
            download
            className={cn(
              'relative inline-flex items-center overflow-hidden border rounded-none group flex-1 justify-center',
              'font-sans font-medium tracking-[0.02em] text-sm px-4 py-3',
              'transition-[color] duration-[300ms] ease-out',
              'border-border text-planton-muted hover:text-planton-white',
            )}
          >
            <span aria-hidden className="absolute inset-0 -translate-x-full transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 group-hover:translate-x-0 bg-planton-forest" />
            <span className="relative z-10">PNG</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function CarbonNeutralPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-16">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <Eyebrow>Foundations</Eyebrow>
        <Heading as="h1" size="heading-xl">Selo Carbon Neutral</Heading>
        <Body muted className="max-w-2xl">
          Selo de carbono neutro concedido pelo Planton a empresas parceiras. Use corretamente conforme o contexto, sempre priorizando a versão principal na variante adequada ao fundo.
        </Body>
      </div>

      {/* Sobre o Selo */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Sobre o selo</span>
          <h2 className="font-heading text-xl text-planton-forest tracking-[-0.02em]">O que é e como usar</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border overflow-hidden">
          <div className="p-5 bg-surface-card flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-planton-accent">Concessão</span>
            <p className="font-sans text-sm text-foreground leading-relaxed">
              O selo é concedido pelo Planton após auditoria e verificação das emissões da empresa. Não pode ser auto-declarado.
            </p>
          </div>
          <div className="p-5 bg-surface-card flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-planton-accent">Integridade</span>
            <p className="font-sans text-sm text-foreground leading-relaxed">
              Nunca altere as cores, proporções ou elementos do selo. Use sempre os arquivos originais disponibilizados aqui.
            </p>
          </div>
          <div className="p-5 bg-surface-card flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-planton-accent">Tamanho mínimo</span>
            <p className="font-sans text-sm text-foreground leading-relaxed">
              Manter largura mínima de <strong>80px</strong> em digital e <strong>20mm</strong> em impresso para garantir legibilidade do texto.
            </p>
          </div>
        </div>
      </section>

      {/* Regra de contraste */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Regra de contraste</span>
          <h2 className="font-heading text-xl text-planton-forest tracking-[-0.02em]">Escolha correta por fundo</h2>
          <p className="font-sans text-sm text-planton-muted leading-[1.65] max-w-xl">
            A versão principal existe em duas variantes de texto (branco para fundos escuros, forest para fundos claros). As monocromáticas são para casos com restrição de cor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border border-border overflow-hidden">
          <div className="flex flex-col">
            <div className="bg-[#0A2D30] flex items-center justify-center h-48 px-8">
              <Image src="/carbon_neutral/planton_carbon_neutral.png" alt="Principal fundo escuro" width={90} height={115} className="object-contain max-h-28 w-auto" unoptimized />
            </div>
            <div className="p-4 bg-surface-card border-t border-border flex flex-col gap-1">
              <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.08em]">Fundo escuro/neutro</span>
              <span className="font-sans text-sm text-foreground">Versão <strong>Principal, texto branco</strong></span>
              <span className="font-mono text-xs text-planton-muted/70 mt-1">bg-forest · bg-dark · bg-neutral</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-white flex items-center justify-center h-48 px-8">
              <Image src="/carbon_neutral/planton_carbon_neutral_.png" alt="Principal fundo claro" width={90} height={115} className="object-contain max-h-28 w-auto" unoptimized />
            </div>
            <div className="p-4 bg-surface-card border-t border-border flex flex-col gap-1">
              <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.08em]">Fundo claro</span>
              <span className="font-sans text-sm text-foreground">Versão <strong>Principal, texto forest</strong></span>
              <span className="font-mono text-xs text-planton-muted/70 mt-1">bg-white · bg-card · bg-cream</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-planton-forest flex items-center justify-center h-48 px-8">
              <Image src="/carbon_neutral/planton_carbon_neutral_white.svg" alt="Branca fundo forest" width={90} height={115} className="object-contain max-h-28 w-auto" unoptimized />
            </div>
            <div className="p-4 bg-surface-card border-t border-border flex flex-col gap-1">
              <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.08em]">Fundo muito escuro</span>
              <span className="font-sans text-sm text-foreground">Versão <strong>Branca</strong></span>
              <span className="font-mono text-xs text-planton-muted/70 mt-1">bg-planton-forest · foto escura</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="bg-white flex items-center justify-center h-48 px-8">
              <Image src="/carbon_neutral/planton_carbon_neutral_forrest.png" alt="Forest fundo claro" width={90} height={115} className="object-contain max-h-28 w-auto" unoptimized />
            </div>
            <div className="p-4 bg-surface-card border-t border-border flex flex-col gap-1">
              <span className="font-mono text-xs text-planton-accent uppercase tracking-[0.08em]">Cor restrita</span>
              <span className="font-sans text-sm text-foreground">Versão <strong>Forest</strong></span>
              <span className="font-mono text-xs text-planton-muted/70 mt-1">impressão · contexto sóbrio</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grupos de variações */}
      {sealGroups.map((group) => (
        <section key={group.label} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">{group.label}</span>
            <h2 className="font-heading text-xl text-planton-forest tracking-[-0.02em]">{group.title}</h2>
            <p className="font-sans text-sm text-planton-muted leading-[1.65] max-w-xl">{group.description}</p>
          </div>
          <div className={`grid grid-cols-1 items-stretch gap-px border-t border-l border-border overflow-hidden ${
            group.items.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {group.items.map((seal) => (
              <SealCard key={seal.file} asset={seal} />
            ))}
          </div>
        </section>
      ))}

      {/* Zona de exclusão + Exemplo real */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Uso correto</span>
          <h2 className="font-heading text-xl text-planton-forest tracking-[-0.02em]">Zona de exclusão e exemplo real</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border overflow-hidden">
          {/* Zona de exclusão */}
          <div className="flex flex-col">
            <div className="bg-[#0A2D30] flex-1 flex flex-col items-center justify-center gap-6 p-12 min-h-72">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 -m-12 border border-dashed border-planton-accent/40 pointer-events-none" />
                <div className="absolute -top-9 left-1/2 -translate-x-1/2">
                  <span className="font-mono text-[10px] text-planton-accent/70 whitespace-nowrap">← zona de exclusão →</span>
                </div>
                <Image
                  src="/carbon_neutral/planton_carbon_neutral.png"
                  alt="Zona de exclusão do selo"
                  width={120}
                  height={150}
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
            <div className="p-4 bg-surface-card border-t border-border flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-planton-accent">Zona de exclusão</span>
              <p className="font-sans text-sm text-planton-muted leading-relaxed">
                Mantenha ao redor do selo uma área livre equivalente à largura do "N" do ícone. Nenhum elemento deve entrar nessa zona.
              </p>
            </div>
          </div>

          {/* Exemplo real */}
          <div className="flex flex-col">
            <div className="flex-1 overflow-hidden">
              <Image
                src="/carbon_neutral/Imagem_Certificado.jpg"
                alt="Selo Carbon Neutral em evento de premiação"
                width={800}
                height={600}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="p-4 bg-surface-card border-t border-border flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-planton-accent">Exemplo real</span>
              <p className="font-sans text-sm text-planton-muted leading-relaxed">
                O selo em uso em evento de premiação de empresas Carbon Neutral certificadas pelo Planton.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
