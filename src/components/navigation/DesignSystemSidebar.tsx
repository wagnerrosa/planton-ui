'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Palette, Type, MousePointer, Component, ImageIcon, Monitor, ChevronLeft, ChevronRight, Images } from 'lucide-react'
import { useSidebar } from '@/components/shadcn/sidebar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { componentCategories } from '@/lib/components-registry'

const foundations = [
  { href: '/design-system/colors',     label: 'Colors',     icon: Palette },
  { href: '/design-system/typography', label: 'Typography', icon: Type },
  { href: '/design-system/logo',       label: 'Logo',       icon: ImageIcon },
  { href: '/design-system/images',     label: 'Images',     icon: Images },
]

const itemClass = (active: boolean) =>
  `flex items-center gap-2.5 px-2 py-2 text-sm font-sans transition-colors rounded-none ${
    active
      ? 'bg-sidebar-accent text-planton-accent'
      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
  }`

const subItemClass = (active: boolean) =>
  `block px-2 py-1.5 text-[13px] font-sans transition-colors rounded-none ${
    active
      ? 'text-planton-accent'
      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
  }`

export function DesignSystemSidebar() {
  const { open, toggleSidebar } = useSidebar()
  const pathname = usePathname()

  if (!open) return null

  return (
    <>
      {/* Overlay to close on mobile when tapping outside */}
      <div
        className="fixed inset-0 z-30 bg-black/40 md:hidden"
        onClick={toggleSidebar}
        aria-hidden="true"
      />
      <aside className="w-[260px] shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col overflow-y-auto relative z-40">
      {/* Header */}
      <div className="px-5 py-5 border-b border-sidebar-border shrink-0 flex items-center justify-between">
        <Link href="/" className="flex flex-col gap-2">
          <Image src="/Logo_Planton_01.svg" alt="Planton" width={120} height={26} priority />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40">
              Design System
            </span>
            <span className="font-mono text-[0.6rem] text-sidebar-foreground/30">v0.3.0</span>
          </div>
        </Link>
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-11 h-11 -mr-2 rounded-full text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors self-start -mt-2"
          aria-label="Collapse menu"
        >
          <ChevronLeft size={12} />
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 flex flex-col gap-4 flex-1">

        {/* Foundations */}
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40 px-2 mb-1">
            Foundations
          </span>
          {foundations.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={itemClass(pathname === href)}>
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        {/* System */}
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40 px-2 mb-1">
            System
          </span>

          <Link
            href="/design-system/components"
            className={itemClass(pathname === '/design-system/components')}
          >
            <Component size={15} />
            Components
          </Link>

          <Link
            href="/design-system/components/button"
            className={itemClass(pathname === '/design-system/components/button')}
          >
            <MousePointer size={15} />
            Button
          </Link>

          {componentCategories.map((category) => {
            const base = `/design-system/components/${category.slug}`
            const isActive = pathname.startsWith(base)
            const CategoryIcon = category.icon
            return (
              <div key={category.slug}>
                <Link
                  href={`${base}/${category.components[0].slug}`}
                  className={itemClass(isActive)}
                >
                  <CategoryIcon size={15} />
                  {category.label}
                </Link>
                {isActive && (
                  <div className="flex flex-col mt-0.5">
                    {category.components.map((comp) => {
                      const path = `${base}/${comp.slug}`
                      return (
                        <Link key={comp.slug} href={path} className={subItemClass(pathname === path)}>
                          <span className="pl-7">{comp.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Screens */}
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40 px-2 mb-1">
            Screens
          </span>

          <Link
            href="/design-system/screens"
            className={itemClass(pathname === '/design-system/screens')}
          >
            <Monitor size={15} />
            Overview
          </Link>

          {/* Mostra Sua Pegada Screens */}
          <div className="flex flex-col gap-0.5 mt-2 pt-2 border-t border-sidebar-border">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40 px-2 mb-1">
              Mostra Sua Pegada
            </span>

            <Link
              href="/design-system/screens/mostra/login"
              className={itemClass(pathname === '/design-system/screens/mostra/login')}
            >
              <span className="text-xs">Login</span>
            </Link>

            <Link
              href="/design-system/screens/mostra/(app)/dashboard"
              className={itemClass(pathname.startsWith('/design-system/screens/mostra/(app)'))}
            >
              <span className="text-xs">Dashboard</span>
            </Link>

            <Link
              href="/design-system/screens/mostra/(app)/empresas"
              className={itemClass(pathname === '/design-system/screens/mostra/(app)/empresas')}
            >
              <span className="text-xs">Empresas</span>
            </Link>

            <Link
              href="/design-system/screens/mostra/(app)/fornecedores"
              className={itemClass(pathname === '/design-system/screens/mostra/(app)/fornecedores')}
            >
              <span className="text-xs">Fornecedores</span>
            </Link>

            <Link
              href="/design-system/screens/mostra/(app)/cadastro-manual"
              className={itemClass(pathname === '/design-system/screens/mostra/(app)/cadastro-manual')}
            >
              <span className="text-xs">Cadastro Manual</span>
            </Link>

            <Link
              href="/design-system/screens/mostra/(app)/configuracoes"
              className={itemClass(pathname === '/design-system/screens/mostra/(app)/configuracoes')}
            >
              <span className="text-xs">Configurações</span>
            </Link>

            <Link
              href="/design-system/screens/mostra/(app)/relatorio"
              className={itemClass(pathname === '/design-system/screens/mostra/(app)/relatorio')}
            >
              <span className="text-xs">Relatório</span>
            </Link>
          </div>

        </div>

      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-3 shrink-0">
        <ThemeToggle />
      </div>
    </aside>
    </>
  )
}

export function SidebarCollapseButton() {
  const { open, toggleSidebar } = useSidebar()

  if (open) return null

  return (
    <button
      onClick={toggleSidebar}
      className="fixed top-[10px] left-1 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
      aria-label="Expand menu"
    >
      <ChevronRight size={12} />
    </button>
  )
}
