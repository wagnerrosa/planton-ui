'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Button } from '@/components/primitives/Button'
import { buttonMeta } from '@/lib/components-registry'
import { Download, ArrowRight } from 'lucide-react'

export default function ButtonPage() {
  return (
    <ComponentPage
      category="System"
      name={buttonMeta.name}
      description={buttonMeta.description}
      filePath={buttonMeta.filePath}
    >
      {/* Variantes com sweep */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Com efeito sweep</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <div className="bg-planton-forest p-4">
            <Button variant="primary-dark">Primary Dark</Button>
          </div>
          <Button variant="icon"><ArrowRight /></Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>

      {/* Variantes simples */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Sem efeito sweep</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </section>

      {/* Com ícone */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Com ícone</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary"><Download /> Baixar PDF</Button>
          <Button variant="secondary"><Download /> Baixar PDF</Button>
          <Button variant="outline"><Download /> Baixar PDF</Button>
          <Button variant="ghost"><Download /> Baixar PDF</Button>
        </div>
      </section>

      {/* Tamanhos */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Tamanhos</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <Button variant="primary" size="default">Default</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="outline" size="default">Default</Button>
          <Button variant="outline" size="sm">Small</Button>
        </div>
      </section>

      {/* Small com ícone */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Small com ícone</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary" size="sm"><ArrowRight /> Ver mais</Button>
          <Button variant="outline" size="sm"><ArrowRight /> Ver mais</Button>
          <Button variant="ghost" size="sm">Ver trilha <ArrowRight /></Button>
          <Button variant="ghost" size="sm"><Download /> Baixar</Button>
        </div>
      </section>

      {/* Como link */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Como link</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button href="/design-system/components/button" variant="primary">Link primário</Button>
          <Button href="/design-system/components/button" variant="outline">Link outline</Button>
        </div>
      </section>
    </ComponentPage>
  )
}
