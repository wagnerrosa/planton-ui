'use client'

import { createContext, useContext, useState } from 'react'
import type { BreadcrumbItem } from './AcademyNavbar'

export type InventoryStatus = {
  submittedCount: number
  totalCount: number
}

type GeniusNavbarState = {
  breadcrumbs: BreadcrumbItem[]
  userName: string
  inventoryStatus: InventoryStatus | null
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
  setUserName: (name: string) => void
  setInventoryStatus: (status: InventoryStatus | null) => void
}

const GeniusNavbarContext = createContext<GeniusNavbarState>({
  breadcrumbs: [],
  userName: 'Usuário',
  inventoryStatus: null,
  setBreadcrumbs: () => {},
  setUserName: () => {},
  setInventoryStatus: () => {},
})

export function GeniusNavbarProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [userName, setUserName] = useState('Wagner Rosa')
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus | null>(null)

  return (
    <GeniusNavbarContext.Provider value={{ breadcrumbs, userName, inventoryStatus, setBreadcrumbs, setUserName, setInventoryStatus }}>
      {children}
    </GeniusNavbarContext.Provider>
  )
}

export function useGeniusNavbar() {
  return useContext(GeniusNavbarContext)
}
