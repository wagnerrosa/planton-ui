import { ComponentPage } from '@/components/ui/ComponentPage'
import { Separator } from '@/components/shadcn/separator'
import { Label } from '@/components/shadcn/label'
import { Input } from '@/components/shadcn/input'
import { Checkbox } from '@/components/shadcn/checkbox'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('inputs', 'label')!

export default function LabelPage() {
  return (
    <ComponentPage
      category="Inputs & Forms"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Com Input</h2>
        <div className="flex flex-col gap-2 max-w-sm">
          <Label htmlFor="email">E-mail corporativo</Label>
          <Input id="email" type="email" placeholder="nome@empresa.com" />
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Com Checkbox</h2>
        <div className="flex items-center gap-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Aceito os termos de uso e política de privacidade</Label>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Estado desabilitado</h2>
        <div className="flex flex-col gap-2 max-w-sm">
          <Label htmlFor="disabled" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Campo bloqueado
          </Label>
          <Input id="disabled" disabled placeholder="Indisponível" className="peer" />
        </div>
      </section>
    </ComponentPage>
  )
}
