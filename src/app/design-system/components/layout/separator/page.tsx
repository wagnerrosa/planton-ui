import { ComponentPage } from '@/components/ui/ComponentPage'
import { Separator } from '@/components/shadcn/separator'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('layout', 'separator')!

export default function SeparatorPage() {
  return (
    <ComponentPage
      category="Layout & Structure"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >

      {/* Separator inline */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Separator inline</h2>
        <p className="text-sm text-muted-foreground">
          Usado dentro de um container para dividir conteúdo internamente. Respeita a largura do elemento pai.
        </p>
        <div className="flex flex-col gap-4 max-w-xl">
          <span className="text-sm text-foreground">Seção A</span>
          <Separator />
          <span className="text-sm text-foreground">Seção B</span>
          <Separator />
          <span className="text-sm text-foreground">Seção C</span>
        </div>
        <div className="bg-muted rounded-none p-4 font-mono text-xs text-muted-foreground">
          {`<Separator />`}
        </div>
      </section>

      {/* Separator vertical */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Separator vertical</h2>
        <p className="text-sm text-muted-foreground">
          Usado para separar elementos lado a lado, como itens em uma navbar ou breadcrumb.
        </p>
        <div className="flex items-center gap-4 h-8">
          <span className="text-sm text-foreground">Item A</span>
          <Separator orientation="vertical" />
          <span className="text-sm text-foreground">Item B</span>
          <Separator orientation="vertical" />
          <span className="text-sm text-foreground">Item C</span>
        </div>
        <div className="bg-muted rounded-none p-4 font-mono text-xs text-muted-foreground">
          {`<Separator orientation="vertical" />`}
        </div>
      </section>

      {/* Borda de seção — padrão Planton */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Borda de seção — padrão Planton</h2>
        <p className="text-sm text-muted-foreground">
          Borda <code className="font-mono bg-muted px-1">border-t border-border</code> aplicada fora do container <code className="font-mono bg-muted px-1">max-w</code>, ocupando a largura total da tela.
          É o padrão visual da marca Planton para separar seções de página — usado no footer, entre carousels da Home e em divisões de layout.
        </p>

        {/* Simulação visual */}
        <div className="flex flex-col border border-border overflow-hidden">
          <div className="px-6 py-8 bg-background flex flex-col gap-1">
            <span className="font-mono text-xs text-planton-muted">Seção anterior</span>
            <span className="text-sm text-foreground">Continue assistindo</span>
          </div>
          <div className="border-t border-border" />
          <div className="px-6 py-8 bg-background flex flex-col gap-1">
            <span className="font-mono text-xs text-planton-muted">Próxima seção</span>
            <span className="text-sm text-foreground">Novos conteúdos</span>
          </div>
        </div>

        <div className="bg-muted rounded-none p-4 font-mono text-xs text-muted-foreground whitespace-pre">{`{/* Fecha o container max-w */}
</div>

{/* Borda de largura total */}
<div className="border-t border-border" />

{/* Abre novo container max-w */}
<div className="max-w-[1400px] mx-auto px-6 py-10">`}</div>
      </section>

      {/* Padrão de grid com bordas */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Padrão de grid com bordas</h2>
        <p className="text-sm text-muted-foreground">
          Para grids de cards, as bordas são aplicadas no container e em cada item para evitar duplicação nas arestas externas.
        </p>

        <div className="grid grid-cols-3 overflow-hidden border-t border-l border-border max-w-xl">
          {['01', '02', '03', '04', '05', '06'].map((n) => (
            <div key={n} className="border-r border-b border-border px-4 py-6 flex items-center justify-center">
              <span className="font-mono text-xs text-planton-muted">{n}</span>
            </div>
          ))}
        </div>

        <div className="bg-muted rounded-none p-4 font-mono text-xs text-muted-foreground whitespace-pre">{`{/* Container: border-t border-l */}
<div className="grid grid-cols-3 overflow-hidden border-t border-l border-border">
  {/* Cada item: border-r border-b */}
  <div className="border-r border-b border-border">...</div>
</div>`}</div>
      </section>

    </ComponentPage>
  )
}
