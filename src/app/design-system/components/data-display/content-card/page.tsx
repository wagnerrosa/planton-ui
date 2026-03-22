'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { ContentCard } from '@/screens/academy/home/components/ContentCard'
import { findComponent } from '@/lib/components-registry'
import { CONTENT_ITEMS, CONTINUE_WATCHING_ITEMS } from '@/screens/academy/home/mock-data'

const meta = findComponent('data-display', 'content-card')!

export default function ContentCardPage() {
  return (
    <ComponentPage
      category="Data Display · Academy"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      {/* Padrão */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Padrão</h2>
        <p className="font-sans text-sm text-planton-muted -mt-3">
          Cards com aspect ratio 4:5, texto overlay com gradient e hover scale + shadow. Vídeos mostram GIF preview no hover. Non-video usam imagens de biomas como fallback.
        </p>
        <div className="flex gap-4 flex-wrap">
          {CONTENT_ITEMS.slice(0, 4).map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      </section>

      {/* Continue assistindo */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Continue assistindo</h2>
        <p className="font-sans text-sm text-planton-muted -mt-3">
          Exibe barra de progresso, badge de porcentagem e label da trilha dentro do card. Usado na seção &quot;Continue assistindo&quot; da Home.
        </p>
        <div className="flex gap-4 flex-wrap">
          {CONTINUE_WATCHING_ITEMS.slice(0, 4).map((item) => (
            <ContentCard key={item.id} content={item} showProgress showTrail />
          ))}
        </div>
      </section>

      {/* Badges */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Badges</h2>
        <p className="font-sans text-sm text-planton-muted -mt-3">
          Badges contextuais: &quot;Novo&quot; (top-left), porcentagem de progresso (top-right) e &quot;Concluído&quot; (top-right). Renderizados automaticamente com base nos dados do conteúdo.
        </p>
        <div className="flex gap-4 flex-wrap">
          {/* Novo */}
          {CONTENT_ITEMS.filter((i) => i.isNew).slice(0, 1).map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
          {/* Progresso */}
          {CONTINUE_WATCHING_ITEMS.slice(0, 1).map((item) => (
            <ContentCard key={item.id} content={item} showProgress />
          ))}
          {/* Concluído */}
          {CONTENT_ITEMS.filter((i) => i.status === 'concluido').slice(0, 1).map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      </section>
    </ComponentPage>
  )
}
