'use client'

import { useRouter } from 'next/navigation'
import { EurecicloLoginScreen } from '@/screens/eureciclo/login/EurecicloLoginScreen'

export default function EurecicloLoginPage() {
  const router = useRouter()
  return (
    <EurecicloLoginScreen
      onLogin={() => router.push('/design-system/screens/eureciclo/lp-builder')}
    />
  )
}
