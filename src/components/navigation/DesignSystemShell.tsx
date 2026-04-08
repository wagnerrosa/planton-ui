'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider } from '@/components/shadcn/sidebar'
import { DesignSystemSidebar, SidebarCollapseButton } from '@/components/navigation/DesignSystemSidebar'

const SIDEBAR_HIDDEN_ROUTES = [
  '/design-system/screens/mostra/login',
  '/design-system/screens/academy/login',
]

function shouldHideSidebar(pathname: string) {
  const normalizedPath = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname

  return SIDEBAR_HIDDEN_ROUTES.some((route) =>
    normalizedPath === route || normalizedPath.startsWith(`${route}/`),
  )
}

export function DesignSystemShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideSidebar = shouldHideSidebar(pathname)

  if (hideSidebar) {
    return <main className="min-h-screen w-full">{children}</main>
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <DesignSystemSidebar />
        <SidebarCollapseButton />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
