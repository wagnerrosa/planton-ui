import Link from 'next/link'
import { Heading } from '@/components/primitives/Heading'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Body } from '@/components/primitives/Body'

export default function PatternsPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <Eyebrow>Patterns</Eyebrow>
        <Heading as="h1" size="heading-xl">Screen Patterns</Heading>
        <Body muted className="max-w-2xl">
          Screen patterns have been promoted to <strong>Screens</strong> — real product screens from Planton.
          Browse the Screens section in the sidebar to view each screen.
        </Body>
      </div>

      <section className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Go to</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 overflow-hidden border-t border-l border-border">
          <Link
            href="/design-system/screens/academy/login"
            className="group border-r border-b border-border p-6 flex flex-col gap-2 hover:bg-card transition-colors"
          >
            <span className="font-sans text-base font-medium text-foreground group-hover:text-planton-accent transition-colors">
              Academy , Login
            </span>
            <span className="text-sm text-planton-muted leading-[1.65]">Authentication screen</span>
          </Link>
          <Link
            href="/design-system/screens/academy/home"
            className="group border-r border-b border-border p-6 flex flex-col gap-2 hover:bg-card transition-colors"
          >
            <span className="font-sans text-base font-medium text-foreground group-hover:text-planton-accent transition-colors">
              Academy , Home
            </span>
            <span className="text-sm text-planton-muted leading-[1.65]">Trails and courses listing</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
