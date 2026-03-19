'use client'

import { useEffect } from 'react'
import { useAcademyNavbar } from './AcademyNavbarContext'
import type { BreadcrumbItem } from './AcademyNavbar'

export function AcademyNavbarSync({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  const { setBreadcrumbs } = useAcademyNavbar()

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
