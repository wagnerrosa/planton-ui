'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shadcn/accordion'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('layout', 'accordion')!

export default function AccordionPage() {
  return (
    <ComponentPage
      category="Layout & Structure"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">FAQ</h2>
        <Accordion type="single" collapsible className="max-w-xl border border-border divide-y divide-border">
          <AccordionItem value="cert" className="border-0 px-4">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
              Como funciona a certificação?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              Ao concluir todos os conteúdos e obter aprovação no quiz final com nota mínima de 70%, o certificado é emitido automaticamente e disponibilizado na sua área do aluno.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="quiz" className="border-0 px-4">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
              O que acontece se eu não passar no quiz?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              Você pode refazer o quiz quantas vezes precisar, sem restrição de tentativas. Recomendamos revisar os conteúdos da trilha antes de tentar novamente.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="offline" className="border-0 px-4">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
              Posso acessar os conteúdos offline?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              No momento, o Planton Academy requer conexão com a internet para reprodução dos conteúdos. O suporte a modo offline está previsto para versões futuras da plataforma.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </ComponentPage>
  )
}
