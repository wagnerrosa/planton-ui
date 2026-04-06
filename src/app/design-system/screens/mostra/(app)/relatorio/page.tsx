import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { MostraNavbarSync } from '@/components/navigation/MostraNavbarSync'

export default function RelatorioPage() {
  return (
    <>
      <MostraNavbarSync breadcrumbs={[{ label: 'Relatório' }]} />
      <div className="max-w-[1920px] mx-auto px-6 pt-10">
        <Heading as="h1" size="heading-xl">Relatório Geral</Heading>
        <Body muted className="mt-2">Em construção — Fase 6</Body>
      </div>
    </>
  )
}
