'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarProvider } from '@/components/shadcn/sidebar'
import { GeniusSidebar } from '@/components/navigation/GeniusSidebar'
import { GeniusNavbar } from '@/components/navigation/GeniusNavbar'
import { GeniusNavbarProvider, useGeniusNavbar } from '@/components/navigation/GeniusNavbarContext'

function GeniusLayoutInner({ children }: { children: React.ReactNode }) {
  const { breadcrumbs } = useGeniusNavbar()
  const mainRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        <GeniusNavbar breadcrumbs={breadcrumbs} />

        <div className="flex flex-1 overflow-hidden">
          <GeniusSidebar />
          <main ref={mainRef} className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-hidden h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default function GeniusAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <GeniusNavbarProvider>
      <GeniusLayoutInner>{children}</GeniusLayoutInner>
    </GeniusNavbarProvider>
  )
}
