'use client'

import { useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { ContentTypeIcon } from './ContentTypeIcon'
import type { ContentItem } from '../mock-data'
import { CONTENT_ITEMS, MOCK_TRAILS } from '../mock-data'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const query = value.trim().toLowerCase()
  const showSuggestions = focused && query.length >= 2

  const matchedContents = showSuggestions
    ? CONTENT_ITEMS.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags?.some((t) => t.toLowerCase().includes(query))
      ).slice(0, 5)
    : []

  const matchedTrails = showSuggestions
    ? MOCK_TRAILS.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      ).slice(0, 3)
    : []

  const hasSuggestions = matchedContents.length > 0 || matchedTrails.length > 0

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-planton-muted" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Buscar por temas, conteúdos ou palavras-chave (ex: Escopo 3, GHG Protocol)"
          className="w-full h-12 pl-12 pr-10 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-planton-muted focus:outline-none focus:ring-2 focus:ring-planton-accent/40 focus:border-planton-accent transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4 text-planton-muted" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && hasSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {matchedContents.length > 0 && (
            <div className="py-1">
              <span className="px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-planton-muted block">Conteúdos</span>
              {matchedContents.map((c) => (
                <SuggestionItem key={c.id} content={c} />
              ))}
            </div>
          )}
          {matchedTrails.length > 0 && (
            <div className="py-1 border-t border-border">
              <span className="px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-planton-muted block">Trilhas</span>
              {matchedTrails.map((t) => (
                <Link
                  key={t.id}
                  href={`/design-system/screens/academy/trail/${t.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/50 transition-colors"
                >
                  <span className="text-sm text-foreground">{t.title}</span>
                  <span className="font-mono text-xs text-planton-muted ml-auto">{t.totalItems} conteúdos</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SuggestionItem({ content }: { content: ContentItem }) {
  return (
    <Link
      href={`/design-system/screens/academy/content/${content.id}`}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/50 transition-colors"
    >
      <ContentTypeIcon type={content.type} showLabel={false} />
      <span className="text-sm text-foreground truncate flex-1">{content.title}</span>
      <span className="font-mono text-xs text-planton-muted shrink-0">{content.duration}</span>
    </Link>
  )
}
