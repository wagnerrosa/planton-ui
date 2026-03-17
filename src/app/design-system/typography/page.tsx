import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Label } from '@/components/primitives/Label'

export default function TypographyPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-20">
      <div className="flex flex-col gap-2">
        <Eyebrow>Foundations</Eyebrow>
        <Heading as="h1" size="heading-xl">Tipografia</Heading>
      </div>

      {/* Headings */}
      <section className="flex flex-col gap-8">
        <Label>Heading — Space Grotesk</Label>
        <div className="flex flex-col gap-6 border-t border-border pt-8">
          {(
            [
              ['display-xl', 'Display XL — 64–80px'],
              ['display-lg', 'Display LG — 48–70px'],
              ['heading-xl', 'Heading XL — 40–56px'],
              ['heading-lg', 'Heading LG — 28–36px'],
            ] as const
          ).map(([size, label]) => (
            <div key={size} className="flex flex-col gap-1 border-b border-border/50 pb-6">
              <span className="font-mono text-[0.6875rem] text-planton-muted uppercase tracking-[0.12em]">{label}</span>
              <Heading as="h2" size={size}>Planton Design</Heading>
            </div>
          ))}
        </div>
      </section>

      {/* Body */}
      <section className="flex flex-col gap-8">
        <Label>Body — Instrument Sans</Label>
        <div className="flex flex-col gap-6 border-t border-border pt-8">
          {(['lg', 'base', 'sm'] as const).map((size) => (
            <div key={size} className="flex flex-col gap-1 border-b border-border/50 pb-6">
              <span className="font-mono text-[0.6875rem] text-planton-muted uppercase tracking-[0.12em]">body {size}</span>
              <Body size={size}>
                Planton conecta produtores rurais com os melhores serviços do agronegócio. Nossa plataforma foi construída para ser clara, eficiente e confiável.
              </Body>
            </div>
          ))}
        </div>
      </section>

      {/* Utility */}
      <section className="flex flex-col gap-8">
        <Label>Utility — Geist Mono</Label>
        <div className="flex flex-col gap-6 border-t border-border pt-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[0.6875rem] text-planton-muted uppercase tracking-[0.12em]">Eyebrow — 11px · 0.12em · uppercase</span>
            <Eyebrow>Categoria do conteúdo</Eyebrow>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[0.6875rem] text-planton-muted uppercase tracking-[0.12em]">Label — 12px · 0.05em · uppercase</span>
            <Label>Status · Indicador · Índice</Label>
          </div>
        </div>
      </section>

      {/* On dark */}
      <section className="flex flex-col gap-4">
        <Label>Em superfície escura</Label>
        <div className="bg-planton-dark p-12 flex flex-col gap-6">
          <Eyebrow>Categoria</Eyebrow>
          <Heading size="heading-xl" surface="dark">Título em fundo escuro</Heading>
          <Body surface="dark">Texto corrido em superfície escura com opacidade total.</Body>
          <Body surface="dark" muted>Texto secundário com 80% de opacidade.</Body>
        </div>
      </section>
    </main>
  )
}
