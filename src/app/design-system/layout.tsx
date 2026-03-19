import { SidebarProvider } from '@/components/shadcn/sidebar'
import { DesignSystemSidebar, SidebarCollapseButton } from '@/components/navigation/DesignSystemSidebar'

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative">
        <DesignSystemSidebar />
        <SidebarCollapseButton />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
