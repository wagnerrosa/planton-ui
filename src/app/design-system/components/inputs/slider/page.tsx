'use client'

import { useState } from 'react'
import { ComponentPage } from '@/components/ui/ComponentPage'
import { Label as ShadcnLabel } from '@/components/shadcn/label'
import { Slider } from '@/components/shadcn/slider'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('inputs', 'slider')!

export default function SliderPage() {
  const [sliderValue, setSliderValue] = useState([1])

  return (
    <ComponentPage
      category="Inputs & Forms"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Velocidade de reprodução</h2>
        <div className="flex flex-col gap-3 max-w-sm">
          <div className="flex justify-between items-center">
            <ShadcnLabel className="text-sm font-medium text-foreground">Velocidade de reprodução</ShadcnLabel>
            <span className="text-sm text-muted-foreground">{sliderValue[0]}x</span>
          </div>
          <Slider
            min={0.5}
            max={2}
            step={0.25}
            value={sliderValue}
            onValueChange={setSliderValue}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.5x</span>
            <span>2x</span>
          </div>
        </div>
      </section>
    </ComponentPage>
  )
}
