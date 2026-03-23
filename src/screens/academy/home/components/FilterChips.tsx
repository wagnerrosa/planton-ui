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

const TAG_OPTIONS: ContentTag[] = ['ESG', 'Emissões', 'ISO', 'Sustentabilidade']

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
    <div className="flex flex-wrap items-center gap-2">
      {TYPE_OPTIONS.map((opt) => (
        <Chip
          key={opt.value}
          label={opt.label}
          active={filters.type === opt.value}
          onClick={() => toggleType(opt.value)}
        />
      ))}

      <span className="w-px h-5 bg-border mx-1" />

      {TAG_OPTIONS.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          active={filters.tag === tag}
          onClick={() => toggleTag(tag)}
        />
      ))}

      <span className="w-px h-5 bg-border mx-1" />

      {STATUS_OPTIONS.map((opt) => (
        <Chip
          key={opt.value}
          label={opt.label}
          active={filters.status === opt.value}
          onClick={() => toggleStatus(opt.value)}
        />
      ))}
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
          : 'bg-secondary text-foreground/70 hover:bg-secondary/60 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  )
}
