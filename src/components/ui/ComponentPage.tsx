'use client'

import { Heading } from '@/components/primitives/Heading'
import { Eyebrow } from '@/components/primitives/Eyebrow'

type ComponentPageProps = {
  category: string
  name: string
  description: string
  filePath: string
  children: React.ReactNode
}

export function ComponentPage({ category, name, description, filePath, children }: ComponentPageProps) {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <Eyebrow>{category}</Eyebrow>
        <Heading as="h1" size="heading-xl">{name}</Heading>
        <p className="text-sm text-planton-muted leading-[1.65] max-w-2xl">{description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-mono text-xs text-planton-muted/60">Path:</span>
          <code className="font-mono text-xs text-planton-accent bg-planton-forest/10 px-2 py-1">{filePath}</code>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        {children}
      </div>
    </main>
  )
}
