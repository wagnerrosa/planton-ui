'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, ChevronDown } from 'lucide-react'
import { useSidebar } from '@/components/shadcn/sidebar'
import { MOCK_TRAILS } from '@/screens/academy/home/mock-data'
import { useState } from 'react'

const BASE = '/design-system/screens/academy'

export function AcademySidebar() {
  const { open } = useSidebar()
  const pathname = usePathname()
  const trails = MOCK_TRAILS.filter((t) => t.status !== 'em-breve')
  const isTrailsActive = pathname.startsWith(`${BASE}/trail`)
  const [trailsOpen, setTrailsOpen] = useState(isTrailsActive)

  if (!open) return null

  return (
    <aside className="w-[268px] shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
      <nav className="px-3 py-4 flex flex-col gap-1">

        {/* Home */}
        <Link
          href={`${BASE}/home`}
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
    </aside>
  )
}
