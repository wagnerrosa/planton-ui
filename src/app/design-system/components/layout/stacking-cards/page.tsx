'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { findComponent } from '@/lib/components-registry'
import { StackingCards, StackingCardItem } from '@/components/ui/StackingCards'
import type { MotionValue } from 'framer-motion'

const meta = findComponent('layout', 'stacking-cards')!

const CARDS = [
  { index: '01', title: 'Gestão de Emissões de GEE', description: 'Fundamentos do Protocolo GHG e metodologias de inventário.', color: 'bg-planton-forest' },
  { index: '02', title: 'ESG na Prática', description: 'Frameworks ESG, relatórios GRI e metas de sustentabilidade.', color: 'bg-planton-dark' },
  { index: '03', title: 'ISO 14064 Avançado', description: 'Verificação e validação de inventários de GEE conforme ISO.', color: 'bg-planton-forest/80' },
]

type ChildrenCtx = {
  scrollYProgress: MotionValue<number>
  totalCards: number
  scaleMultiplier: number
}

export default function StackingCardsPage() {
  return (
    <ComponentPage
      category="Layout & Structure"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      {/* Live demo */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">
          Exemplo — Scroll para ver o efeito de empilhamento
        </h2>
        <p className="text-sm text-muted-foreground">
          O container precisa de altura suficiente para o scroll funcionar. Cada card fica <code className="font-mono text-xs bg-muted px-1">sticky</code> e escala progressivamente conforme o scroll avança.
        </p>
        <div className="border border-border overflow-hidden">
          <StackingCards
            totalCards={CARDS.length}
            scaleMultiplier={0.04}
            className="h-[600px]"
          >
            {((ctx: ChildrenCtx) =>
              CARDS.map((card, i) => (
                <StackingCardItem
                  key={card.index}
                  index={i}
                  totalCards={CARDS.length}
                  scaleMultiplier={ctx.scaleMultiplier}
                  scrollYProgress={ctx.scrollYProgress}
                  topStep={4}
                  className={`mx-auto w-full max-w-2xl ${card.color} p-10 border border-white/10`}
                >
                  <span className="font-mono text-xs text-planton-accent/70">{card.index}</span>
                  <h3 className="mt-3 font-heading text-2xl text-planton-cream leading-tight">{card.title}</h3>
                  <p className="mt-2 text-sm text-planton-cream/70 leading-relaxed">{card.description}</p>
                </StackingCardItem>
              ))
            ) as unknown as React.ReactNode}
          </StackingCards>
        </div>
      </section>

      {/* Usage */}
      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">
          Uso
        </h2>
        <div className="border border-border p-6 bg-card">
          <pre className="font-mono text-xs text-foreground/80 leading-relaxed overflow-auto">{`import { StackingCards, StackingCardItem } from '@/components/ui/StackingCards'

<StackingCards
  totalCards={3}
  scaleMultiplier={0.03}   // quanto cada card escala por nível
  className="h-[600px]"    // altura total do scroll container
>
  {({ scrollYProgress, totalCards, scaleMultiplier }) =>
    cards.map((card, i) => (
      <StackingCardItem
        key={card.id}
        index={i}
        totalCards={totalCards}
        scaleMultiplier={scaleMultiplier}
        scrollYProgress={scrollYProgress}
        topStep={3}          // offset vertical em vh por card
        className="sticky bg-planton-forest p-10"
      >
        {/* card content */}
      </StackingCardItem>
    ))
  }
</StackingCards>`}</pre>
        </div>
      </section>

      {/* Props */}
      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">
          Props — StackingCards
        </h2>
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Prop</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Tipo</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Padrão</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['totalCards', 'number', '—', 'Total de cards (necessário para calcular os ranges de scroll)'],
                ['scaleMultiplier', 'number', '0.03', 'Quanto cada card escala por nível de profundidade'],
                ['className', 'string', '—', 'Classe do container (use para definir a altura do scroll)'],
                ['children', 'function | ReactNode', '—', 'Render-prop com { scrollYProgress, totalCards, scaleMultiplier }'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} className="border-b border-border even:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-planton-accent">{prop}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{type}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{def}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ComponentPage>
  )
}
