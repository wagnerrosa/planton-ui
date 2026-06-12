'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { BreadcrumbItem } from './AcademyNavbar'

export type InventoryStatus = {
  submittedCount: number
  totalCount: number
}

type GeniusNavbarState = {
  breadcrumbs: BreadcrumbItem[]
  userName: string
  inventoryStatus: InventoryStatus | null
  rightContent: ReactNode
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
  setUserName: (name: string) => void
  setInventoryStatus: (status: InventoryStatus | null) => void
  setRightContent: (content: ReactNode) => void
}

const GeniusNavbarContext = createContext<GeniusNavbarState>({
  breadcrumbs: [],
  userName: 'Usuário',
  inventoryStatus: null,
  rightContent: null,
  setBreadcrumbs: () => {},
  setUserName: () => {},
  setInventoryStatus: () => {},
  setRightContent: () => {},
})

export function GeniusNavbarProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [userName, setUserName] = useState('Wagner Rosa')
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus | null>(null)
  const [rightContent, setRightContent] = useState<ReactNode>(null)

  return (
    <GeniusNavbarContext.Provider
      value={{
        breadcrumbs,
        userName,
        inventoryStatus,
        rightContent,
        setBreadcrumbs,
        setUserName,
        setInventoryStatus,
        setRightContent,
      }}
    >
      {children}
    </GeniusNavbarContext.Provider>
  )
}

export function useGeniusNavbar() {
  return useContext(GeniusNavbarContext)
}
