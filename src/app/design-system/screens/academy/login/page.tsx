import { Suspense } from 'react'
import { LoginFlow } from '@/screens/academy/auth/LoginFlow'

export default function LoginScreenPage() {
  return (
    <Suspense>
      <LoginFlow />
    </Suspense>
  )
}
