'use client'

/**
 * MostraNavbarContext
 *
 * Resolve o problema de boundary no Next.js App Router:
 * a <MostraNavbar> vive no layout (fora da árvore das telas), mas precisa
 * exibir breadcrumbs dinâmicos definidos por cada tela filha.
 *
 * Mesmo padrão do AcademyNavbarContext, namespace separado.
 */

import { createContext, useContext, useState } from 'react'
import type { BreadcrumbItem } from './AcademyNavbar'

type MostraNavbarState = {
  breadcrumbs: BreadcrumbItem[]
  userName: string
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
  setUserName: (name: string) => void
}

const MostraNavbarContext = createContext<MostraNavbarState>({
  breadcrumbs: [],
  userName: 'Usuário',
  setBreadcrumbs: () => {},
  setUserName: () => {},
})

export function MostraNavbarProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [userName, setUserName] = useState('Wagner Rosa')

  return (
    <MostraNavbarContext.Provider value={{ breadcrumbs, userName, setBreadcrumbs, setUserName }}>
      {children}
    </MostraNavbarContext.Provider>
  )
}

export function useMostraNavbar() {
  return useContext(MostraNavbarContext)
}
