'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center gap-2 w-full px-2 py-2 font-sans text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
      aria-label="Alternar tema"
    >
      <Sun size={15} className="dark:hidden" />
      <Moon size={15} className="hidden dark:block" />
      <span className="dark:hidden">Light</span>
      <span className="hidden dark:block">Dark</span>
    </button>
  )
}
