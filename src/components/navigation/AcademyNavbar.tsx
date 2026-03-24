'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, ChevronRight, ChevronLeft, LogOut, User } from 'lucide-react'
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
import { useAcademyNavbar } from './AcademyNavbarContext'
import { ProfileSheet } from './ProfileSheet'

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
  /** Callback de logout. */
  onLogout?: () => void
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export function ThemeToggleButton() {
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

export function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
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
  onLogout,
}: AcademyNavbarProps) {
  const { toggleSidebar } = useSidebar()
  const { profileOpen, setProfileOpen } = useAcademyNavbar()

  return (
    <nav className="sticky top-0 z-[60] border-b border-sidebar-border bg-sidebar">
      <div className="w-full h-14 flex items-stretch">

        {/* ---- Left ---- */}
        <div className="flex items-stretch self-stretch flex-1 min-w-0">
          {/* Hamburger */}
          <div
            className="flex items-center px-2 md:px-4 border-r border-sidebar-border hover:bg-sidebar-accent transition-colors cursor-pointer"
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
          <div className="flex items-center px-3 md:px-5 shrink-0 border-r border-sidebar-border">
            <Link href="/design-system/screens/academy/home" className="flex items-center">
              <Image
                src="/logos_produtos/planton_academy_forest.svg"
                alt="Planton Academy"
                width={164}
                height={33}
                priority
                className="dark:hidden"
                style={{ width: 164, height: 'auto' }}
              />
              <Image
                src="/logos_produtos/planton_academy_branco.svg"
                alt="Planton Academy"
                width={164}
                height={33}
                priority
                className="hidden dark:block"
                style={{ width: 164, height: 'auto' }}
              />
            </Link>
          </div>

          {/* Breadcrumb , desktop: full trail, mobile: back + current page */}
          {breadcrumbs.length > 0 && (
            <>
              {/* Desktop breadcrumb */}
              <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1 px-5 border-r border-sidebar-border min-w-0 overflow-hidden">
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

              {/* Mobile: back button + current page title */}
              <div className="flex md:hidden items-center gap-1 px-3 min-w-0 overflow-hidden">
                {breadcrumbs.length > 1 && breadcrumbs[breadcrumbs.length - 2]?.href && (
                  <a
                    href={breadcrumbs[breadcrumbs.length - 2].href}
                    className="flex items-center justify-center w-7 h-7 shrink-0 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
                    aria-label="Voltar"
                  >
                    <ChevronLeft size={16} />
                  </a>
                )}
                <span className="font-sans text-[13px] text-sidebar-foreground font-medium truncate">
                  {breadcrumbs[breadcrumbs.length - 1].label}
                </span>
              </div>
            </>
          )}
        </div>

        {/* ---- Right ---- */}
        <div className="flex items-stretch gap-0 shrink-0 self-stretch">
          {/* Theme toggle , desktop only (mobile: inside sidebar) */}
          <div className="hidden md:flex items-center px-4 border-l border-sidebar-border hover:bg-sidebar-accent transition-colors">
            <ThemeToggleButton />
          </div>

          {/* User dropdown , desktop only (mobile: inside sidebar) */}
          <div className="hidden md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 px-4 border-l border-sidebar-border self-stretch hover:bg-sidebar-accent transition-colors"
                  aria-label="Menu do usuário"
                >
                  <UserAvatar name={userName} avatarUrl={userAvatarUrl} />
                  <span className="font-sans text-[13px] text-sidebar-foreground/80 max-w-[100px] truncate">
                    {userName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-none">
                <DropdownMenuItem
                  onClick={() => setProfileOpen(true)}
                  className="font-sans text-[13px] gap-2 cursor-pointer"
                >
                  <User size={14} />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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

      </div>

      <ProfileSheet
        open={profileOpen}
        onOpenChange={setProfileOpen}
        userName={userName}
        userAvatarUrl={userAvatarUrl}
      />
    </nav>
  )
}
