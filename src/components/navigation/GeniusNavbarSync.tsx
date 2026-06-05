'use client'

import { useEffect } from 'react'
import { useGeniusNavbar } from './GeniusNavbarContext'
import type { BreadcrumbItem } from './AcademyNavbar'

export function GeniusNavbarSync({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) {
  const { setBreadcrumbs } = useGeniusNavbar()

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
