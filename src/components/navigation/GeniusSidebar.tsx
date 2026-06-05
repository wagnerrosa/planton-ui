'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageSquare,
  BarChart2,
  LogOut,
} from 'lucide-react'
import { useSidebar } from '@/components/shadcn/sidebar'
import { useGeniusNavbar } from './GeniusNavbarContext'
import { ThemeToggleButton, UserAvatar } from './AcademyNavbar'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/shadcn/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

const BASE = '/design-system/screens/genius'

const NAV_GROUPS = [
  {
    label: 'Principal',
    items: [
      { href: `${BASE}/chat`, label: 'Chat', icon: MessageSquare },
    ],
  },
  {
    label: 'Dashboards',
    items: [
      { href: `${BASE}/dashboard-v2`, label: 'Dashboard v2', icon: BarChart2 },
    ],
  },
]

function SidebarNav({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="px-3 py-4 flex flex-col gap-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-0.5">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40 px-2 mb-1">
            {group.label}
          </span>
          {group.items.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={onLinkClick}
                className={`flex items-center gap-2.5 px-2 py-2 text-sm font-sans transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-planton-accent'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}

function SidebarFooter({ onClose }: { onClose: () => void }) {
  const { userName } = useGeniusNavbar()

  return (
    <div className="mt-auto border-t border-sidebar-border px-3 py-3 flex flex-col gap-2">
      <div className="flex items-center gap-2.5 px-2 py-2">
        <UserAvatar name={userName} />
        <div className="flex-1 min-w-0">
          <span className="font-sans text-sm text-sidebar-foreground truncate block">
            {userName}
          </span>
          <span className="font-sans text-[11px] text-sidebar-foreground/50 truncate block">
            Admin
          </span>
        </div>
        <ThemeToggleButton />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-2.5 px-2 py-2 text-sm font-sans text-destructive hover:bg-sidebar-accent transition-colors w-full"
      >
        <LogOut size={15} />
        Sair
      </button>
    </div>
  )
}

export function GeniusSidebar() {
  const { open, isMobile, openMobile, setOpenMobile } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[268px] p-0 bg-sidebar border-sidebar-border flex flex-col">
          <VisuallyHidden>
            <SheetTitle>Menu de navegação</SheetTitle>
          </VisuallyHidden>
          <SidebarNav onLinkClick={() => setOpenMobile(false)} />
          <SidebarFooter onClose={() => setOpenMobile(false)} />
        </SheetContent>
      </Sheet>
    )
  }

  if (!open) return null

  return (
    <aside className="w-[268px] shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
      <SidebarNav />
      <SidebarFooter onClose={() => {}} />
    </aside>
  )
}
