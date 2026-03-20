'use client'

/**
 * AcademyAppLayout
 *
 * Layout raiz de todas as telas do academy. Estrutura:
 *
 *   AcademyNavbarProvider        ← disponibiliza Context para navbar e telas
 *     AcademyLayoutInner
 *       AcademyNavbar            ← lê breadcrumbs/userName do Context
 *       AcademySidebar
 *       <main>
 *         {children}             ← telas renderizam <AcademyNavbarSync> aqui
 *                                   para atualizar os breadcrumbs da navbar
 *
 * Por que AcademyLayoutInner existe separado?
 * O Provider precisa envolver quem consome o Context (AcademyNavbar).
 * Como ambos estão no mesmo arquivo, o inner component resolve o boundary.
 */

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarProvider } from '@/components/shadcn/sidebar'
import { AcademySidebar } from '@/components/navigation/AcademySidebar'
import { AcademyNavbar } from '@/components/navigation/AcademyNavbar'
import { AcademyNavbarProvider, useAcademyNavbar } from '@/components/navigation/AcademyNavbarContext'

function AcademyLayoutInner({ children }: { children: React.ReactNode }) {
  const { breadcrumbs, userName } = useAcademyNavbar()
  const mainRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <SidebarProvider>
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        {/* Navbar — full width, acima do flex sidebar+main */}
        <AcademyNavbar userName={userName} breadcrumbs={breadcrumbs} />

        {/* Sidebar + conteúdo */}
        <div className="flex flex-1 overflow-hidden">
          <AcademySidebar />
          <main ref={mainRef} className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default function AcademyAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AcademyNavbarProvider>
      <AcademyLayoutInner>{children}</AcademyLayoutInner>
    </AcademyNavbarProvider>
  )
}
