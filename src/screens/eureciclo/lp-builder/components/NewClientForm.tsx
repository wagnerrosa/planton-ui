'use client'

import { Input } from '@/components/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { SETORES, formatCnpj } from '../mock-data'

export type NewClientData = {
  cnpj: string
  name: string
  sector: string
}

type NewClientFormProps = {
  data: NewClientData
  errors: Partial<Record<keyof NewClientData, string>>
  onChange: (next: NewClientData) => void
}

export function NewClientForm({ data, errors, onChange }: NewClientFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Field label="CNPJ" htmlFor="cnpj" error={errors.cnpj}>
        <Input
          id="cnpj"
          value={data.cnpj}
          onChange={(e) => onChange({ ...data, cnpj: formatCnpj(e.target.value) })}
          placeholder="00.000.000/0000-00"
          inputMode="numeric"
          className="h-12 text-base font-mono"
          maxLength={18}
        />
      </Field>

      <Field label="Nome do cliente" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Razão social ou nome fantasia"
          className="h-12 text-base"
        />
      </Field>

      <Field label="Setor" htmlFor="sector" error={errors.sector}>
        <Select
          value={data.sector || undefined}
          onValueChange={(v) => onChange({ ...data, sector: v })}
        >
          <SelectTrigger id="sector" className="h-12 text-base">
            <SelectValue placeholder="Selecione o setor" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} className="max-h-60 overflow-y-auto">
            {SETORES.map((s) => (
              <SelectItem key={s} value={s} className="text-base py-3">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-foreground font-sans">
        {label}
      </label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}
