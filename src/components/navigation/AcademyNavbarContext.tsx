'use client'

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
