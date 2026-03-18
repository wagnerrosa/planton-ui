import Link from 'next/link'
import { Heading } from '@/components/primitives/Heading'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Body } from '@/components/primitives/Body'

const screens = [
  {
    product: 'Academy',
    items: [
      { href: '/design-system/screens/academy/login', label: 'Login', description: 'Tela de autenticação' },
      { href: '/design-system/screens/academy/home',  label: 'Home',  description: 'Listagem de trilhas e cursos' },
    ],
  },
]

export default function ScreensPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <Eyebrow>Screens</Eyebrow>
        <Heading as="h1" size="heading-xl">Screens</Heading>
        <Body muted className="max-w-2xl">
          Telas reais dos produtos Planton. Cada screen compõe componentes do design system para formar interfaces completas.
        </Body>
      </div>

      {screens.map((product) => (
        <section key={product.product} className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">{product.product}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden border-t border-l border-border">
            {product.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group border-r border-b border-border p-6 flex flex-col gap-2 hover:bg-card transition-colors"
              >
                <span className="font-sans text-base font-medium text-foreground group-hover:text-planton-accent transition-colors">
                  {item.label}
                </span>
                <span className="text-sm text-planton-muted leading-[1.65]">{item.description}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
