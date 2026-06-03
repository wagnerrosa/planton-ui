'use client'

import { useState } from 'react'
import { CategoryIcon, type CategoryIconVariant } from '@/components/genius/CategoryIcon'
import { EMISSION_CATEGORIES, type EmissionScope } from '@/components/genius/categories'

const SCOPES: EmissionScope[] = [1, 2, 3]

const SCOPE_BG: Record<number, string> = {
  1: '/assets_ilutracoes/Escopo_01.jpg',
  2: '/assets_ilutracoes/Escopo_02.jpg',
  3: '/assets_ilutracoes/Escopo_03.jpg',
}
const BASE_BG = '/assets_ilutracoes/Escopo_todos.jpg'

const VARIANTS: { id: CategoryIconVariant; label: string; hint: string }[] = [
  { id: 'hover', label: 'Hover', hint: 'Anima 1x ao passar o mouse no chip' },
  { id: 'loop', label: 'Loop', hint: 'Anima em loop infinito (modal de sucesso)' },
  { id: 'static', label: 'Estático', hint: 'Sem animação' },
]

/**
 * Playground de animações de categoria — showcase de duas colunas.
 *
 * Esquerda: chips de categoria agrupados por escopo, scroll na própria página.
 * Direita: painel de imagem que troca conforme o escopo do chip sob hover.
 *
 * Diferenças do empty-state real do ChatScreen:
 *  - sem view-transition / navegação (clique no chip não muda de tela)
 *  - toggle de variant (hover / loop / static) para inspecionar cada modo
 *  - botão "re-disparar" que remonta os ícones para reexecutar a animação
 */
export function GeniusAnimationsScreen() {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null)
  const [variant, setVariant] = useState<CategoryIconVariant>('hover')
  // bump → remonta os CategoryIcon (key) para reexecutar animações de entrada/loop
  const [replayKey, setReplayKey] = useState(0)

  const hoveredCat = hoveredCategoryId ? EMISSION_CATEGORIES.find((c) => c.id === hoveredCategoryId) : null
  const panelBg = hoveredCat ? SCOPE_BG[hoveredCat.scope] ?? BASE_BG : BASE_BG

  return (
    <div className="relative flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Coluna esquerda — chips, scroll próprio */}
        <div className="flex flex-col gap-5 flex-1 min-w-0 overflow-y-auto px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-1">
            <p className="text-foreground text-xl sm:text-2xl font-heading font-normal leading-snug">
              Animações de categoria
            </p>
            <p className="text-muted-foreground text-xs font-sans">
              {VARIANTS.find((v) => v.id === variant)?.hint}
            </p>
          </div>

          {/* Toggle de variant + replay */}
          <div className="flex items-center gap-1.5 w-full">
            <div className="flex items-center gap-1 p-0.5 border border-border bg-muted/40">
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => { setVariant(v.id); setReplayKey((k) => k + 1) }}
                  className={`px-2.5 py-1 text-[11px] font-sans transition-colors ${
                    variant === v.id ? 'bg-foreground text-background font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setReplayKey((k) => k + 1)}
              className="ml-auto px-2.5 py-1 text-[11px] font-sans text-muted-foreground border border-border bg-muted/40 hover:bg-muted transition-colors"
            >
              Re-disparar
            </button>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {SCOPES.map((scope) => {
              const cats = EMISSION_CATEGORIES.filter((c) => c.scope === scope)
              if (cats.length === 0) return null
              // delay base por escopo → entrada escalonada contínua entre grupos
              const offset = EMISSION_CATEGORIES.filter((c) => c.scope < scope).length
              return (
                <div key={scope} className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-sans font-medium">
                    Escopo {scope}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {cats.map((cat, i) => (
                      <div
                        key={cat.id}
                        onMouseEnter={() => setHoveredCategoryId(cat.id)}
                        onMouseLeave={() => setHoveredCategoryId(null)}
                        style={{ animationDelay: `${260 + (offset + i) * 50}ms` }}
                        className="genius-chip flex items-center gap-2 px-3 py-2.5 border border-border bg-background text-sm font-sans text-foreground hover:bg-muted hover:border-planton-accent/40 transition-colors cursor-default"
                      >
                        <CategoryIcon key={replayKey} icon={cat.icon} categoryId={cat.id} variant={variant} className="text-planton-accent" />
                        <span className="truncate text-left text-xs">{cat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Coluna direita — imagem que troca conforme o escopo sob hover */}
        <div className="relative hidden lg:block w-[42%] max-w-[640px] shrink-0 overflow-hidden border-l border-border">
          {/* Base sempre visível — Escopo_todos */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BASE_BG})` }}
            aria-hidden
          />
          {/* Layers de escopo — fade-in sobre a base */}
          {Object.values(SCOPE_BG).map((url) => (
            <div
              key={url}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
              style={{ backgroundImage: `url(${url})`, opacity: panelBg === url ? 1 : 0 }}
              aria-hidden
            />
          ))}
          {/* Rótulo do escopo ativo */}
          <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white text-sm font-sans font-medium drop-shadow">
              {hoveredCat ? `Escopo ${hoveredCat.scope} · ${hoveredCat.label}` : 'Todos os escopos'}
            </p>
          </div>
        </div>
      </div>
  )
}
