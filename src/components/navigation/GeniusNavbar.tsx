'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useSidebar } from '@/components/shadcn/sidebar'
import type { BreadcrumbItem } from './AcademyNavbar'

const BASE = '/design-system/screens/genius'

export interface GeniusNavbarProps {
  breadcrumbs?: BreadcrumbItem[]
  onMenuToggle?: () => void
}

export function GeniusNavbar({
  breadcrumbs = [],
  onMenuToggle,
}: GeniusNavbarProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <nav className="sticky top-0 z-[60] border-b border-sidebar-border bg-sidebar">
      <div className="w-full h-14 flex items-stretch relative">

        {/* Left */}
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

          {/* Logo + Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-0 px-4 md:px-5 min-w-0 overflow-hidden">
            <Link href={`${BASE}/chat`} className="flex items-center shrink-0 mr-3" aria-label="Planton Genius">
              <img
                src="/logos_produtos/planton_genius_branco.svg"
                alt="Planton Genius"
                className="h-5 w-auto"
              />
            </Link>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <span key={index} className="flex items-center gap-2 min-w-0">
                  <span className="text-sidebar-foreground/40 text-sm select-none">/</span>
                  {item.variant === 'pill' ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-sidebar-border text-[10px] font-heading font-semibold uppercase tracking-wider text-sidebar-foreground/70 shrink-0">
                      {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />}
                      {item.label}
                    </span>
                  ) : isLast || !item.href ? (
                    <span className={`font-sans text-[13px] truncate ${isLast ? 'text-sidebar-foreground font-medium' : 'text-sidebar-foreground/60'}`}>
                      {item.label}
                    </span>
                  ) : (
                    <a
                      href={item.href}
                      className="font-sans text-[13px] text-sidebar-foreground/60 hover:text-sidebar-foreground truncate transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                </span>
              )
            })}
          </nav>
        </div>



      </div>
    </nav>
  )
}
