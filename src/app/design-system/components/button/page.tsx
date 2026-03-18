'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Button } from '@/components/primitives/Button'
import { buttonMeta } from '@/lib/components-registry'

export default function ButtonPage() {
  return (
    <ComponentPage
      category="System"
      name={buttonMeta.name}
      description={buttonMeta.description}
      filePath={buttonMeta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Variantes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <div className="bg-planton-forest p-4">
            <Button variant="primary-dark">Primary Dark</Button>
          </div>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Como link</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button href="/design-system/components/button">Button como link</Button>
        </div>
      </section>
    </ComponentPage>
  )
}
