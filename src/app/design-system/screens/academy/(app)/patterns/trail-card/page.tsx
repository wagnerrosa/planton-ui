import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { CopyPath } from '@/components/ui/CopyButton'
import { TrailCard } from '@/screens/academy/trails/TrailCard'
import { MOCK_TRAILS } from '@/screens/academy/home/mock-data'

export default function TrailCardPatternPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Eyebrow>Pattern — Trilhas</Eyebrow>
        <Heading as="h1" size="heading-xl">TrailCard</Heading>
        <Body muted className="max-w-2xl">
          Card de trilha com layout duas colunas: info à esquerda e imagem de bioma com CTA overlay à direita. Usado na tela de listagem de trilhas.
        </Body>
        <div className="mt-2">
          <CopyPath path="src/screens/academy/trails/TrailCard.tsx" />
        </div>
      </div>

      {/* Live demo — all statuses */}
      <section className="flex flex-col gap-6">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">
          Variações — status
        </span>
        <div className="flex flex-col gap-4">
          {MOCK_TRAILS.map((t) => (
            <TrailCard
              key={t.id}
              trail={{
                id: t.id,
                title: t.title,
                description: t.description,
                contentsCount: t.totalItems,
                duration: t.totalDuration,
                progress: t.progress,
                status: t.status,
                contents: t.contents,
                href: `/design-system/screens/academy/trail/${t.id}`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Anatomy */}
      <section className="flex flex-col gap-6">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Anatomia</span>
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden border-t border-l border-border">
          {[
            {
              zone: 'Status badge',
              desc: 'Label mono 0.625rem + ícone (Clock/PlayCircle/Award). Cor: accent para concluída, accent/80 para em andamento, cream/50 para demais.',
            },
            {
              zone: 'Título',
              desc: 'font-heading text-xl/3xl, text-planton-cream. Hover: text-planton-accent com transition 200ms.',
            },
            {
              zone: 'Thumbnails de conteúdo',
              desc: 'Até 5 miniaturas 44×44px com ícone de tipo (PlayCircle/Headphones/FileText/BookOpen) ou CheckCircle2 para concluídos. Contador "+N" se houver mais.',
            },
            {
              zone: 'Progress bar',
              desc: 'h-px, track bg-planton-accent/20, fill bg-planton-accent. Percentual em mono 0.625rem. Só exibido quando progress > 0.',
            },
            {
              zone: 'Meta footer',
              desc: 'Contagem de conteúdos + duração em font-mono 0.625rem text-planton-cream/40. Posicionado via mt-auto.',
            },
            {
              zone: 'Imagem bioma + CTA',
              desc: '5 biomas rotativos por ID (Mata Atlântica → Caatinga → Serra Sul → Pantanal → Pampa). CTA overlay: border white/70, backdrop-blur, texto contextual (Começar/Continuar/Rever). Hover: brightness 1.0 + scale 1.03.',
            },
          ].map((item) => (
            <div key={item.zone} className="border-r border-b border-border p-6 flex flex-col gap-2">
              <code className="font-mono text-xs text-planton-accent">{item.zone}</code>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Status config */}
      <section className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Status</span>
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Ícone</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Label</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">CTA overlay</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['nao-iniciada', 'Clock', 'Não iniciada', 'Começar'],
                ['em-andamento', 'PlayCircle', 'Em andamento', 'Continuar'],
                ['concluida', 'Award', 'Concluída', 'Rever'],
                ['em-breve', 'Clock', 'Em breve', 'Continuar'],
              ].map(([status, icon, label, cta]) => (
                <tr key={status} className="border-b border-border even:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-planton-accent">{status}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{icon}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{label}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{cta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Props */}
      <section className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Props</span>
        <div className="border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Prop</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Tipo</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Obrigatório</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-widest">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['id', 'string', 'sim', 'Usado para selecionar a imagem de bioma (índice numérico extraído do id)'],
                ['title', 'string', 'sim', 'Título da trilha'],
                ['description', 'string', 'não', 'Descrição com line-clamp-2'],
                ['contentsCount', 'number', 'sim', 'Total de conteúdos'],
                ['duration', 'string', 'sim', 'Duração total (ex: "4h 30min")'],
                ['progress', 'number', 'não', 'Percentual 0-100. Barra só aparece se > 0'],
                ['status', 'TrailStatus', 'não', 'nao-iniciada | em-andamento | concluida | em-breve'],
                ['href', 'string', 'sim', 'URL de destino do Link'],
                ['contents', 'ContentItem[]', 'não', 'Array de conteúdos para as thumbnails (máx 5 exibidos)'],
              ].map(([prop, type, required, desc]) => (
                <tr key={prop} className="border-b border-border even:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-planton-accent">{prop}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{type}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{required}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Design decisions */}
      <section className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Decisões de design</span>
        <div className="border border-border p-6 flex flex-col gap-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">bg-planton-forest:</strong> fundo fixo da trilha — não usa bg-card para manter o tom editorial independente do dark mode.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Sem border-radius, sem shadow:</strong> segue o design system — borda-zero em superfícies de conteúdo.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Bioma por ID:</strong> <code className="font-mono text-xs bg-muted px-1">parseInt(id.replace(/\D/g, &apos;&apos;), 10) % 5</code> garante imagem consistente e variada sem precisar de campo extra no modelo.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Coluna direita hidden mobile:</strong> em telas pequenas o card fica só com a zona de info. O CTA de navegação ocorre via click no card inteiro (Link wrapper).
          </p>
        </div>
      </section>
    </main>
  )
}
