'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function AcademyLogo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Antes de montar (SSR), renderiza o forest como padrão (light)
  const src = mounted && resolvedTheme === 'dark'
    ? '/logos_produtos/planton_academy_branco.svg'
    : '/logos_produtos/planton_academy_forest.svg'

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="Planton Academy" width={240} height={48} className="mx-auto" />
}
