'use client'

import Link from 'next/link'
import { Menu, ChevronRight, ChevronLeft, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { useSidebar } from '@/components/shadcn/sidebar'
import { useMostraNavbar } from './MostraNavbarContext'
import { ThemeToggleButton, UserAvatar } from './AcademyNavbar'
import type { BreadcrumbItem } from './AcademyNavbar'

const BASE = '/design-system/screens/mostra'

export interface MostraNavbarProps {
  breadcrumbs?: BreadcrumbItem[]
  userName?: string
  userAvatarUrl?: string
  onMenuToggle?: () => void
  onLogout?: () => void
}

export function MostraNavbar({
  breadcrumbs = [],
  userName = 'Usuário',
  userAvatarUrl,
  onMenuToggle,
  onLogout,
}: MostraNavbarProps) {
  const { toggleSidebar } = useSidebar()

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

          {/* Logo / Brand */}
          <div className="flex items-center px-3 md:px-5 shrink-0 border-r border-sidebar-border">
            <Link href={`${BASE}/dashboard`} className="flex flex-col leading-none">
              <span className="font-sans text-[10px] font-medium text-sidebar-foreground/50 uppercase tracking-widest">
                Planton
              </span>
              <span className="font-sans text-[13px] font-semibold text-sidebar-foreground">
                Mostra Sua Pegada
              </span>
            </Link>
          </div>

          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && (
            <>
              {/* Desktop */}
              <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1 px-5 border-r border-sidebar-border min-w-0 overflow-hidden">
                {breadcrumbs.map((item, index) => {
                  const isLast = index === breadcrumbs.length - 1
                  return (
                    <span key={index} className="flex items-center gap-1 min-w-0">
                      {index > 0 && (
                        <ChevronRight size={12} className="shrink-0 text-sidebar-foreground/30" />
                      )}
                      {isLast || !item.href ? (
                        <span className={`font-sans text-[13px] truncate ${isLast ? 'text-sidebar-foreground font-medium' : 'text-sidebar-foreground/50'}`}>
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

              {/* Mobile: back + current page */}
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
          {/* Theme toggle — desktop only */}
          <div className="hidden md:flex items-center px-4 border-l border-sidebar-border hover:bg-sidebar-accent transition-colors">
            <ThemeToggleButton />
          </div>

          {/* User dropdown — desktop only */}
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
                <DropdownMenuItem className="font-sans text-[13px] gap-2 cursor-pointer">
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
    </nav>
  )
}
