'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, ChevronDown, LogOut, User } from 'lucide-react'
import { useSidebar } from '@/components/shadcn/sidebar'
import { useAcademyNavbar } from './AcademyNavbarContext'
import { ThemeToggleButton, UserAvatar } from './AcademyNavbar'
import { MOCK_TRAILS } from '@/screens/academy/home/mock-data'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/shadcn/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

const BASE = '/design-system/screens/academy'

function SidebarNav({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const trails = MOCK_TRAILS.filter((t) => t.status !== 'em-breve')
  const isTrailsActive = pathname.startsWith(`${BASE}/trail`)
  const [trailsOpen, setTrailsOpen] = useState(isTrailsActive)

  return (
    <nav className="px-3 py-4 flex flex-col gap-1">
      {/* Home */}
      <Link
        href={`${BASE}/home`}
        onClick={onLinkClick}
        className={`flex items-center gap-2.5 px-2 py-2 text-sm font-sans transition-colors ${
          pathname === `${BASE}/home`
            ? 'bg-sidebar-accent text-planton-accent'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        <Home size={15} />
        Home
      </Link>

      {/* Trilhas */}
      <div>
        <button
          type="button"
          onClick={() => setTrailsOpen((v) => !v)}
          className={`w-full flex items-center gap-2.5 px-2 py-2 text-sm font-sans transition-colors ${
            isTrailsActive
              ? 'bg-sidebar-accent text-planton-accent'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }`}
        >
          <BookOpen size={15} />
          <span className="flex-1 text-left">Trilhas</span>
          <ChevronDown
            size={13}
            className={`transition-transform ${trailsOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {trailsOpen && (
          <div className="flex flex-col mt-0.5">
            {trails.map((trail) => (
              <Link
                key={trail.id}
                href={`${BASE}/trail/${trail.id}`}
                onClick={onLinkClick}
                className={`pl-9 pr-2 py-1.5 text-[13px] font-sans transition-colors ${
                  pathname === `${BASE}/trail/${trail.id}`
                    ? 'text-planton-accent'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                {trail.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

function SidebarFooter({ onClose }: { onClose: () => void }) {
  const { userName } = useAcademyNavbar()

  return (
    <div className="mt-auto border-t border-sidebar-border px-3 py-3 flex flex-col gap-2">
      {/* User info */}
      <div className="flex items-center gap-2.5 px-2 py-2">
        <UserAvatar name={userName} />
        <span className="flex-1 font-sans text-sm text-sidebar-foreground truncate">
          {userName}
        </span>
        <ThemeToggleButton />
      </div>

      {/* Actions */}
      <Link
        href="#"
        onClick={onClose}
        className="flex items-center gap-2.5 px-2 py-2 text-sm font-sans text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
      >
        <User size={15} />
        Perfil
      </Link>

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

export function AcademySidebar() {
  const { open, isMobile, openMobile, setOpenMobile } = useSidebar()

  // Mobile: overlay sheet
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

  // Desktop: push sidebar
  if (!open) return null

  return (
    <aside className="w-[268px] shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
      <SidebarNav />
    </aside>
  )
}
