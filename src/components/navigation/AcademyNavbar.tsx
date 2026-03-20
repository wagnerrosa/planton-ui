'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, Search, ChevronRight, LogOut, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { useSidebar } from '@/components/shadcn/sidebar'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface AcademyNavbarProps {
  /** Itens do breadcrumb. O primeiro item é sempre implícito como "Home". */
  breadcrumbs?: BreadcrumbItem[]
  /** Nome do usuário logado (exibido no avatar e dropdown). */
  userName?: string
  /** URL do avatar do usuário. Fallback para iniciais quando ausente. */
  userAvatarUrl?: string
  /** Callback do botão hamburger (toggle sidebar). */
  onMenuToggle?: () => void
  /**
   * Callback disparado quando o usuário clica no botão de busca (trigger ⌘K).
   *
   * TODO: implementar SearchModal (spotlight)
   * - Abrir um modal/overlay fullscreen ou centrado com input real
   * - Suportar busca em tempo real por conteúdos e trilhas
   * - Fechar com Escape ou clique fora
   * - Atalho de teclado ⌘K (ou Ctrl+K) deve também disparar este callback
   *
   * Por ora, este callback não recebe query — apenas sinaliza a intenção de abrir.
   * Quando o modal for implementado, a assinatura pode evoluir para
   * `onSearchOpen?: () => void` e a query será gerenciada internamente no modal.
   */
  onSearch?: () => void
  /** Callback de logout. */
  onLogout?: () => void
  /** Callback de perfil. */
  onProfile?: () => void
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center justify-center w-8 h-8 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
      aria-label="Alternar tema"
    >
      <Sun size={16} className="dark:hidden" />
      <Moon size={16} className="hidden dark:block" />
    </button>
  )
}

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className="w-7 h-7 rounded-full object-cover"
      />
    )
  }

  return (
    <span className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center font-mono text-[0.625rem] font-medium text-sidebar-foreground/80 select-none">
      {initials}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AcademyNavbar({
  breadcrumbs = [],
  userName = 'Usuário',
  userAvatarUrl,
  onMenuToggle,
  onSearch,
  onLogout,
  onProfile,
}: AcademyNavbarProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <nav className="sticky top-0 z-[60] border-b border-sidebar-border bg-sidebar">
      <div className="w-full h-14 flex items-stretch">

        {/* ---- Left ---- */}
        <div className="flex items-stretch self-stretch flex-1 min-w-0">
          {/* Hamburger */}
          <div
            className="flex items-center px-4 border-r border-sidebar-border hover:bg-sidebar-accent transition-colors cursor-pointer"
            onClick={() => { toggleSidebar(); onMenuToggle?.() }}
          >
            <button
              className="flex items-center justify-center w-8 h-8 shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
              aria-label="Abrir/fechar menu"
            >
              <Menu size={18} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center px-5 shrink-0 border-r border-sidebar-border">
            <Link href="/design-system/screens/academy" className="flex items-center">
              <Image
                src="/logos_produtos/planton_academy_forest.svg"
                alt="Planton Academy"
                width={164}
                height={33}
                priority
                className="dark:hidden"
              />
              <Image
                src="/logos_produtos/planton_academy_branco.svg"
                alt="Planton Academy"
                width={164}
                height={33}
                priority
                className="hidden dark:block"
              />
            </Link>
          </div>

          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 px-5 border-r border-sidebar-border min-w-0 overflow-hidden">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1
                return (
                  <span key={index} className="flex items-center gap-1 min-w-0">
                    {index > 0 && (
                      <ChevronRight size={12} className="shrink-0 text-sidebar-foreground/30" />
                    )}
                    {isLast || !item.href ? (
                      <span
                        className={`font-sans text-[13px] truncate ${
                          isLast
                            ? 'text-sidebar-foreground font-medium'
                            : 'text-sidebar-foreground/50'
                        }`}
                      >
                        {item.label}
                      </span>
                    ) : (
                      <a
                        href={item.href}
                        className="font-sans text-[13px] text-sidebar-foreground/50 hover:text-sidebar-foreground truncate transition-colors"
                      >
                        {item.label}
                      </a>
                    )}
                  </span>
                )
              })}
            </nav>
          )}
        </div>

        {/* ---- Right ---- */}
        <div className="flex items-stretch gap-0 shrink-0 self-stretch">
          {/* Search trigger */}
          <div className="hidden sm:flex items-center px-4 border-l border-sidebar-border">
            <button
              onClick={() => onSearch?.()}
              className="flex items-center gap-2.5 h-8 w-52 px-3 bg-sidebar-accent/20 border border-sidebar-border/60 text-sidebar-foreground/40 hover:bg-sidebar-accent/40 hover:border-sidebar-border hover:text-sidebar-foreground/60 transition-all group"
              aria-label="Buscar"
            >
              <Search size={13} className="shrink-0" />
              <span className="flex-1 text-left font-sans text-[13px] truncate">
                Buscar...
              </span>
              <span className="flex items-center gap-0.5 shrink-0">
                <kbd className="font-mono text-[10px] leading-none px-1 py-0.5 bg-sidebar-foreground/10 border border-sidebar-border/60 text-sidebar-foreground/30 group-hover:text-sidebar-foreground/50 group-hover:border-sidebar-border transition-colors">
                  ⌘K
                </kbd>
              </span>
            </button>
          </div>

          {/* Theme toggle */}
          <div className="flex items-center px-4 border-l border-sidebar-border hover:bg-sidebar-accent transition-colors">
            <ThemeToggleButton />
          </div>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 px-4 border-l border-sidebar-border self-stretch hover:bg-sidebar-accent transition-colors"
                aria-label="Menu do usuário"
              >
                <UserAvatar name={userName} avatarUrl={userAvatarUrl} />
                <span className="hidden sm:block font-sans text-[13px] text-sidebar-foreground/80 max-w-[100px] truncate">
                  {userName}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-none">
              {onProfile && (
                <>
                  <DropdownMenuItem
                    onClick={onProfile}
                    className="font-sans text-[13px] gap-2 cursor-pointer"
                  >
                    <User size={14} />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={onLogout}
                className="font-sans text-[13px] gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut size={14} />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </nav>
  )
}
