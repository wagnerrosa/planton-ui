'use client'

import { SidebarProvider } from '@/components/shadcn/sidebar'
import { AcademySidebar } from '@/components/navigation/AcademySidebar'
import { AcademyNavbar } from '@/components/navigation/AcademyNavbar'
import { AcademyNavbarProvider, useAcademyNavbar } from '@/components/navigation/AcademyNavbarContext'

function AcademyLayoutInner({ children }: { children: React.ReactNode }) {
  const { breadcrumbs, userName } = useAcademyNavbar()

  return (
    <SidebarProvider>
      <div className="fixed inset-0 z-50 flex flex-col bg-background">
        {/* Navbar — full width, acima do flex sidebar+main */}
        <AcademyNavbar userName={userName} breadcrumbs={breadcrumbs} />

        {/* Sidebar + conteúdo */}
        <div className="flex flex-1 overflow-hidden">
          <AcademySidebar />
          <main className="flex-1 overflow-auto">
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
