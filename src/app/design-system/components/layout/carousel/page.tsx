'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shadcn/carousel'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('layout', 'carousel')!

const items = [
  { id: '1', label: 'Gestão de Emissões', color: '#145559' },
  { id: '2', label: 'Fundamentos ESG', color: '#ADCF78' },
  { id: '3', label: 'Pegada de Carbono', color: '#64BDC6' },
  { id: '4', label: 'Normas ISO', color: '#3C4829' },
  { id: '5', label: 'Economia Circular', color: '#0A2D30' },
]

export default function CarouselPage() {
  return (
    <ComponentPage
      category="Layout & Structure"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Carrossel horizontal</h2>
        <div className="max-w-2xl">
          <Carousel opts={{ align: 'start', loop: false }}>
            <CarouselContent className="-ml-4">
              {items.map((item) => (
                <CarouselItem key={item.id} className="pl-4 basis-1/3">
                  <div
                    className="flex items-center justify-center h-32 border border-border"
                    style={{ backgroundColor: item.color }}
                  >
                    <span className="text-sm font-sans text-white">{item.label}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Carrossel com loop</h2>
        <div className="max-w-2xl">
          <Carousel opts={{ align: 'start', loop: true }}>
            <CarouselContent className="-ml-4">
              {items.map((item) => (
                <CarouselItem key={item.id} className="pl-4 basis-1/2">
                  <div
                    className="flex items-center justify-center h-24 border border-border"
                    style={{ backgroundColor: item.color }}
                  >
                    <span className="text-sm font-sans text-white">{item.label}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </ComponentPage>
  )
}
