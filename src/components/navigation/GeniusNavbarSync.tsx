'use client'

import { useEffect, type ReactNode } from 'react'
import { useGeniusNavbar } from './GeniusNavbarContext'
import type { BreadcrumbItem } from './AcademyNavbar'

export function GeniusNavbarSync({
  breadcrumbs = [],
  rightContent = null,
}: {
  breadcrumbs?: BreadcrumbItem[]
  rightContent?: ReactNode
}) {
  const { setBreadcrumbs, setRightContent } = useGeniusNavbar()

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setRightContent(rightContent)
    return () => setRightContent(null)
  }, [rightContent, setRightContent])

  return null
}
