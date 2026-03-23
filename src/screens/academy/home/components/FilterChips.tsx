'use client'

import type { ContentType, ContentStatus, ContentTag } from '../mock-data'

type FilterState = {
  type: ContentType | null
  tag: ContentTag | null
  status: ContentStatus | null
}

type FilterChipsProps = {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

const TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: 'video', label: 'Vídeo' },
  { value: 'artigo', label: 'Artigo' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'guia', label: 'Guia' },
  { value: 'trilha', label: 'Trilhas' },
]

const TAG_OPTIONS: { value: ContentTag; label: string }[] = [
  { value: 'ESG', label: 'ESG' },
  { value: 'Emissões', label: 'Emissões' },
  { value: 'ISO', label: 'ISO' },
  { value: 'Sustentabilidade', label: 'Sustentabilidade' },
  { value: 'Carbono', label: 'Carbono' },
  { value: 'Clima', label: 'Clima' },
]

const STATUS_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: 'nao-iniciado', label: 'Não iniciado' },
  { value: 'visualizado', label: 'Em andamento' },
  { value: 'concluido', label: 'Concluído' },
]

export type { FilterState }

export function FilterChips({ filters, onChange }: FilterChipsProps) {
  function toggleType(t: ContentType) {
    onChange({ ...filters, type: filters.type === t ? null : t })
  }

  function toggleTag(t: ContentTag) {
    onChange({ ...filters, tag: filters.tag === t ? null : t })
  }

  function toggleStatus(s: ContentStatus) {
    onChange({ ...filters, status: filters.status === s ? null : s })
  }

  return (
    <div className="flex items-start gap-4 w-full max-w-5xl flex-wrap">
      <FilterRow label="Tipo">
        {TYPE_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={filters.type === opt.value}
            onClick={() => toggleType(opt.value)}
          />
        ))}
      </FilterRow>

      <span className="w-px bg-border self-stretch" />

      <FilterRow label="Tema" className="flex-1 min-w-[200px]">
        {TAG_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={filters.tag === opt.value}
            onClick={() => toggleTag(opt.value)}
          />
        ))}
      </FilterRow>

      <span className="w-px bg-border self-stretch" />

      <FilterRow label="Status">
        {STATUS_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={filters.status === opt.value}
            onClick={() => toggleStatus(opt.value)}
          />
        ))}
      </FilterRow>
    </div>
  )
}

function FilterRow({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <span className="font-mono text-[10px] uppercase tracking-widest text-planton-muted">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {children}
      </div>
    </div>
  )
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-planton-accent/60 focus-visible:ring-offset-1 ${
        active
          ? 'bg-planton-accent text-planton-ink'
          : 'bg-planton-accent/10 text-foreground/80 hover:bg-planton-accent/20 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  )
}
