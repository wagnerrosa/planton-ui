'use client'

import { createContext, useContext, useState } from 'react'
import type { BreadcrumbItem } from './AcademyNavbar'

type GeniusNavbarState = {
  breadcrumbs: BreadcrumbItem[]
  userName: string
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
  setUserName: (name: string) => void
}

const GeniusNavbarContext = createContext<GeniusNavbarState>({
  breadcrumbs: [],
  userName: 'Usuário',
  setBreadcrumbs: () => {},
  setUserName: () => {},
})

export function GeniusNavbarProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [userName, setUserName] = useState('Wagner Rosa')

  return (
    <GeniusNavbarContext.Provider value={{ breadcrumbs, userName, setBreadcrumbs, setUserName }}>
      {children}
    </GeniusNavbarContext.Provider>
  )
}

export function useGeniusNavbar() {
  return useContext(GeniusNavbarContext)
}
