'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Label as ShadcnLabel } from '@/components/shadcn/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('inputs', 'select')!

export default function SelectPage() {
  return (
    <ComponentPage
      category="Inputs & Forms"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Exemplos</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2 w-56">
            <ShadcnLabel className="text-sm font-medium text-foreground">Cargo / Função</ShadcnLabel>
            <Select>
              <SelectTrigger className="rounded-none border-border">
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analista">Analista</SelectItem>
                <SelectItem value="coordenador">Coordenador</SelectItem>
                <SelectItem value="gerente">Gerente</SelectItem>
                <SelectItem value="diretor">Diretor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 w-56">
            <ShadcnLabel className="text-sm font-medium text-foreground">Status do Voucher</ShadcnLabel>
            <Select>
              <SelectTrigger className="rounded-none border-border">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="usado">Usado</SelectItem>
                <SelectItem value="expirado">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </ComponentPage>
  )
}
