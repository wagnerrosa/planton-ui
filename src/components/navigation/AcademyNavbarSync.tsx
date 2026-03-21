'use client'

/**
 * AcademyNavbarSync
 *
 * Componente "invisível" (retorna null) usado pelas telas filhas para injetar
 * breadcrumbs na navbar sem prop drilling.
 *
 * Como usar , dentro de qualquer tela do academy:
 *
 *   <AcademyNavbarSync breadcrumbs={[
 *     { label: 'Trilhas', href: '/academy/trails' },
 *     { label: 'GEE' },
 *   ]} />
 *
 * O componente escreve no AcademyNavbarContext via useEffect na montagem.
 * O layout lê o Context e repassa para <AcademyNavbar>.
 */

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
