'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Palette, Type, Component, Layout } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '@/components/shadcn/sidebar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const foundations = [
  { href: '/design-system/colors',     label: 'Cores',      icon: Palette },
  { href: '/design-system/typography', label: 'Tipografia', icon: Type },
]

const system = [
  { href: '/design-system/components', label: 'Componentes', icon: Component },
  { href: '/design-system/patterns',   label: 'Padrões',     icon: Layout },
]

export function DesignSystemSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar
      className="w-[260px] shrink-0 border-r border-sidebar-border rounded-none"
      collapsible="none"
    >
      <SidebarHeader className="px-5 py-5 border-b border-sidebar-border">
        <Link href="/" className="flex flex-col gap-2">
          <Image
            src="/Logo_Planton_01.svg"
            alt="Planton"
            width={120}
            height={26}
            priority
          />
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40">
            Design System
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40 px-2 mb-1">
            Foundations
          </SidebarGroupLabel>
          <SidebarMenu>
            {foundations.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === href}
                  className="rounded-none font-sans text-sm text-sidebar-foreground gap-2.5 px-2 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-planton-accent"
                >
                  <Link href={href}>
                    <Icon size={15} />
                    {label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40 px-2 mb-1">
            System
          </SidebarGroupLabel>
          <SidebarMenu>
            {system.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === href}
                  className="rounded-none font-sans text-sm text-sidebar-foreground gap-2.5 px-2 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-planton-accent"
                >
                  <Link href={href}>
                    <Icon size={15} />
                    {label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-3 py-3">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
