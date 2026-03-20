import type { ReactNode } from 'react'

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md border border-border bg-background p-10 flex flex-col gap-6">
      {children}
    </div>
  )
}
