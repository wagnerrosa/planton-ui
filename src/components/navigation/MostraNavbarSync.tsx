'use client'

/**
 * MostraNavbarSync
 *
 * Componente "invisível" (retorna null) usado pelas telas filhas para injetar
 * breadcrumbs na navbar sem prop drilling.
 *
 * Como usar — dentro de qualquer tela do Mostra:
 *
 *   <MostraNavbarSync breadcrumbs={[
 *     { label: 'Empresas', href: '/mostra/empresas' },
 *     { label: 'Detalhes' },
 *   ]} />
 */

import { useEffect } from 'react'
import { useMostraNavbar } from './MostraNavbarContext'
import type { BreadcrumbItem } from './AcademyNavbar'

export function MostraNavbarSync({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  const { setBreadcrumbs } = useMostraNavbar()

  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
