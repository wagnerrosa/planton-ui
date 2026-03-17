import { Heading } from '@/components/primitives/Heading'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Label } from '@/components/primitives/Label'
import { Button } from '@/components/primitives/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Badge } from '@/components/shadcn/badge'
import { Separator } from '@/components/shadcn/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/shadcn/tabs'

export default function ComponentsPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-20">
      <div className="flex flex-col gap-2">
        <Eyebrow>Catalog</Eyebrow>
        <Heading as="h1" size="heading-xl">Componentes</Heading>
      </div>

      {/* Button */}
      <section className="flex flex-col gap-6">
        <Label>Button</Label>
        <Separator />
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <div className="bg-planton-forest p-4">
            <Button variant="primary-dark">Primary Dark</Button>
          </div>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>

      {/* Card */}
      <section className="flex flex-col gap-6">
        <Label>Card</Label>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card index="01" headline="Gestão de Insumos" description="Controle de estoque e pedidos integrados à sua operação." ctaLabel="Saiba mais" />
          <Card index="02" headline="Monitoramento de Lavoura" description="Dados em tempo real para decisões mais rápidas." ctaLabel="Ver demo" />
          <Card index="03" headline="Análise de Solo" description="Laudos digitais e recomendações de correção." ctaLabel="Explorar" />
        </div>
      </section>

      {/* Input / Textarea */}
      <section className="flex flex-col gap-6">
        <Label>Input / Textarea</Label>
        <Separator />
        <div className="flex flex-col gap-4 max-w-sm">
          <Input placeholder="Digite seu nome" className="rounded-none border-border focus-visible:ring-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-planton-accent" />
          <Textarea placeholder="Mensagem..." className="rounded-none border-border focus-visible:ring-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-planton-accent" />
        </div>
      </section>

      {/* Badge */}
      <section className="flex flex-col gap-6">
        <Label>Badge</Label>
        <Separator />
        <div className="flex flex-wrap gap-3">
          <Badge className="rounded-none bg-planton-accent text-planton-ink font-mono text-xs">Ativo</Badge>
          <Badge variant="outline" className="rounded-none border-border font-mono text-xs text-planton-muted">Pendente</Badge>
          <Badge variant="destructive" className="rounded-none font-mono text-xs">Erro</Badge>
        </div>
      </section>

      {/* Tabs */}
      <section className="flex flex-col gap-6">
        <Label>Tabs</Label>
        <Separator />
        <Tabs defaultValue="overview" className="max-w-lg">
          <TabsList className="rounded-none bg-surface-card gap-0 p-0">
            <TabsTrigger value="overview" className="rounded-none font-mono text-xs uppercase tracking-[0.05em]">Visão Geral</TabsTrigger>
            <TabsTrigger value="details"  className="rounded-none font-mono text-xs uppercase tracking-[0.05em]">Detalhes</TabsTrigger>
            <TabsTrigger value="history"  className="rounded-none font-mono text-xs uppercase tracking-[0.05em]">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4 font-sans text-sm text-planton-muted leading-[1.65]">
            Resumo da operação atual com principais métricas.
          </TabsContent>
          <TabsContent value="details" className="pt-4 font-sans text-sm text-planton-muted leading-[1.65]">
            Detalhes técnicos e configurações avançadas.
          </TabsContent>
          <TabsContent value="history" className="pt-4 font-sans text-sm text-planton-muted leading-[1.65]">
            Registro de ações e alterações recentes.
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
