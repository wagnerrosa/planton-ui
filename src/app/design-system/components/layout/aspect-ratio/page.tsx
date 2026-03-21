'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { AspectRatio } from '@/components/shadcn/aspect-ratio'
import { findComponent } from '@/lib/components-registry'
import { PlayCircle, ImageIcon } from 'lucide-react'

const meta = findComponent('layout', 'aspect-ratio')!

export default function AspectRatioPage() {
  return (
    <ComponentPage
      category="Layout & Structure"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">16:9 , Player de vídeo</h2>
        <div className="w-96">
          <AspectRatio ratio={16 / 9}>
            <div className="flex items-center justify-center w-full h-full bg-card border border-border">
              <PlayCircle className="w-12 h-12 text-muted-foreground" />
            </div>
          </AspectRatio>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">4:3 , Imagem</h2>
        <div className="w-72">
          <AspectRatio ratio={4 / 3}>
            <div className="flex items-center justify-center w-full h-full bg-card border border-border">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
          </AspectRatio>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">1:1 , Quadrado</h2>
        <div className="w-48">
          <AspectRatio ratio={1}>
            <div className="flex items-center justify-center w-full h-full bg-card border border-border">
              <span className="text-sm text-muted-foreground">1:1</span>
            </div>
          </AspectRatio>
        </div>
      </section>
    </ComponentPage>
  )
}
