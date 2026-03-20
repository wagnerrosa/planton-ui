'use client'

/**
 * AcademyNavbarContext
 *
 * Resolve o problema de boundary no Next.js App Router:
 * a <AcademyNavbar> vive no layout (fora da árvore das telas), mas precisa
 * exibir breadcrumbs dinâmicos definidos por cada tela filha.
 *
 * Solução: Context compartilhado entre layout e telas.
 * - O layout lê `breadcrumbs` e passa para <AcademyNavbar>
 * - As telas escrevem via <AcademyNavbarSync> (ver AcademyNavbarSync.tsx)
 */

import { createContext, useContext, useState } from 'react'
import type { BreadcrumbItem } from './AcademyNavbar'

type NavbarState = {
  breadcrumbs: BreadcrumbItem[]
  userName: string
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
  setUserName: (name: string) => void
}

const AcademyNavbarContext = createContext<NavbarState>({
  breadcrumbs: [],
  userName: 'Usuário',
  setBreadcrumbs: () => {},
  setUserName: () => {},
})

export function AcademyNavbarProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [userName, setUserName] = useState('Wagner Rosa')

  return (
    <AcademyNavbarContext.Provider value={{ breadcrumbs, userName, setBreadcrumbs, setUserName }}>
      {children}
    </AcademyNavbarContext.Provider>
  )
}

export function useAcademyNavbar() {
  return useContext(AcademyNavbarContext)
}
