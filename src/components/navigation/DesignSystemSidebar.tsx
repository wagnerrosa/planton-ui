'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Palette, Type, Layout, MousePointer, Component, ImageIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
} from '@/components/shadcn/sidebar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { componentCategories, buttonMeta } from '@/lib/components-registry'

const foundations = [
  { href: '/design-system/colors',     label: 'Cores',      icon: Palette },
  { href: '/design-system/typography', label: 'Tipografia', icon: Type },
  { href: '/design-system/logo',       label: 'Logo',       icon: ImageIcon },
]

const menuButtonClass = "rounded-none font-sans text-sm text-sidebar-foreground gap-2.5 px-2 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-planton-accent"

const subButtonClass = "rounded-none font-sans text-[13px] text-sidebar-foreground/70 px-2 py-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:text-planton-accent"

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
        {/* Foundations */}
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
                  className={menuButtonClass}
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

        {/* System - Components */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40 px-2 mb-1">
            System
          </SidebarGroupLabel>
          <SidebarMenu>
            {/* Componentes - index */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/design-system/components'}
                className={menuButtonClass}
              >
                <Link href="/design-system/components">
                  <Component size={15} />
                  Componentes
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Button - standalone */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/design-system/components/button'}
                className={menuButtonClass}
              >
                <Link href="/design-system/components/button">
                  <MousePointer size={15} />
                  Button
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Component categories with sub-items */}
            {componentCategories.map((category) => {
              const categoryBasePath = `/design-system/components/${category.slug}`
              const isCategoryActive = pathname.startsWith(categoryBasePath)
              const CategoryIcon = category.icon

              return (
                <SidebarMenuItem key={category.slug}>
                  <SidebarMenuButton
                    asChild
                    isActive={isCategoryActive}
                    className={menuButtonClass}
                  >
                    <Link href={`${categoryBasePath}/${category.components[0].slug}`}>
                      <CategoryIcon size={15} />
                      {category.label}
                    </Link>
                  </SidebarMenuButton>

                  {isCategoryActive && (
                    <SidebarMenuSub>
                      {category.components.map((comp) => {
                        const compPath = `${categoryBasePath}/${comp.slug}`
                        return (
                          <SidebarMenuSubItem key={comp.slug}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === compPath}
                              className={subButtonClass}
                            >
                              <Link href={compPath}>{comp.name}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )
            })}

            {/* Patterns */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/design-system/patterns'}
                className={menuButtonClass}
              >
                <Link href="/design-system/patterns">
                  <Layout size={15} />
                  Padrões
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-3 py-3">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
