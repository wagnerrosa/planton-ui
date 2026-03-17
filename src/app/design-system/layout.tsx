import { SidebarProvider } from '@/components/shadcn/sidebar'
import { DesignSystemSidebar } from '@/components/navigation/DesignSystemSidebar'

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DesignSystemSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
