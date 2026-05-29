'use client'

import { Trash2 } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { MATERIALS, YEAR_OPTIONS, type MaterialType } from '../mock-data'

export type RecyclingRowData = {
  id: string
  year: number | null
  material: MaterialType | null
  tons: string
}

type RecyclingRowProps = {
  data: RecyclingRowData
  duplicate?: boolean
  canRemove: boolean
  onChange: (next: RecyclingRowData) => void
  onRemove: () => void
}

export function RecyclingRow({ data, duplicate, canRemove, onChange, onRemove }: RecyclingRowProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border p-3 md:p-2 md:flex-row md:items-center md:gap-2 ${
        duplicate ? 'border-warning bg-warning/5' : 'border-border bg-background'
      }`}
    >
      <div className="flex flex-col gap-2 md:flex-row md:flex-1 md:gap-2">
        <Select
          value={data.year ? String(data.year) : undefined}
          onValueChange={(v) => onChange({ ...data, year: Number(v) })}
        >
          <SelectTrigger className="h-11 text-base md:text-sm md:w-28">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {YEAR_OPTIONS.map((y) => (
              <SelectItem key={y} value={String(y)} className="text-base py-3">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={data.material ?? undefined}
          onValueChange={(v) => onChange({ ...data, material: v as MaterialType })}
        >
          <SelectTrigger className="h-11 text-base md:text-sm md:flex-1">
            <SelectValue placeholder="Material" />
          </SelectTrigger>
          <SelectContent>
            {MATERIALS.map((m) => (
              <SelectItem key={m.value} value={m.value} className="text-base py-3">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative md:w-36">
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={data.tons}
            onChange={(e) => onChange({ ...data, tons: e.target.value })}
            placeholder="0"
            className="h-11 text-base md:text-sm pr-10"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            t
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label="Remover registro"
        className="flex items-center justify-center h-11 w-11 shrink-0 rounded-md border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors disabled:opacity-40 disabled:cursor-not-allowed md:h-11 md:w-11"
      >
        <Trash2 size={16} />
      </button>

      {duplicate && (
        <span className="text-xs text-warning md:hidden">
          Ano e material duplicados — ajuste antes de enviar.
        </span>
      )}
    </div>
  )
}
