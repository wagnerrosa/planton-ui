import { DesignSystemShell } from '@/components/navigation/DesignSystemShell'

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DesignSystemShell>{children}</DesignSystemShell>
}
