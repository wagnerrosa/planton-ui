'use client'

/**
 * MostraAppLayout
 *
 * Layout raiz de todas as telas do Mostra Sua Pegada. Estrutura:
 *
 *   MostraNavbarProvider
 *     MostraLayoutInner
 *       MostraNavbar         ← lê breadcrumbs/userName do Context
 *       MostraSidebar
 *       <main>
 *         {children}         ← telas usam <MostraNavbarSync> para injetar breadcrumbs
 */

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarProvider } from '@/components/shadcn/sidebar'
import { MostraSidebar } from '@/components/navigation/MostraSidebar'
import { MostraNavbar } from '@/components/navigation/MostraNavbar'
import { MostraNavbarProvider, useMostraNavbar } from '@/components/navigation/MostraNavbarContext'
import { MostraFooter } from '@/components/navigation/MostraFooter'

function MostraLayoutInner({ children }: { children: React.ReactNode }) {
  const { breadcrumbs } = useMostraNavbar()
  const mainRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        {/* Navbar — full width */}
        <MostraNavbar breadcrumbs={breadcrumbs} />

        {/* Sidebar + conteúdo */}
        <div className="flex flex-1 overflow-hidden">
          <MostraSidebar />
          <main ref={mainRef} className="flex-1 overflow-auto flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <MostraFooter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default function MostraAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MostraNavbarProvider>
      <MostraLayoutInner>{children}</MostraLayoutInner>
    </MostraNavbarProvider>
  )
}
