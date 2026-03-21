'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Button } from '@/components/primitives/Button'
import { Separator } from '@/components/shadcn/separator'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('overlays', 'dialog')!

export default function DialogPage() {
  return (
    <ComponentPage
      category="Overlays"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Dialog com formulário</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary">Editar perfil</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar perfil</DialogTitle>
              <DialogDescription>
                Atualize suas informações pessoais. Clique em salvar quando terminar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Nome</Label>
                <Input defaultValue="Wagner Rosa" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Cargo</Label>
                <Input defaultValue="Engenheiro de Software" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="primary">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Dialog informativo</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Termos de uso</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Termos de uso</DialogTitle>
              <DialogDescription>
                Ao utilizar a plataforma Planton Academy, você concorda com os termos de uso e política de privacidade vigentes. Todos os dados são tratados conforme a LGPD.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="primary">Entendi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </ComponentPage>
  )
}
