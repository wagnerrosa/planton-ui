'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Label as ShadcnLabel } from '@/components/shadcn/label'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/shadcn/input-otp'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('inputs', 'input-otp')!

export default function InputOTPPage() {
  return (
    <ComponentPage
      category="Inputs & Forms"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Código de verificação</h2>
        <div className="flex flex-col gap-3">
          <ShadcnLabel className="text-sm font-medium text-foreground">Código de verificação</ShadcnLabel>
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">Digite o código enviado para seu e-mail corporativo.</p>
        </div>
      </section>
    </ComponentPage>
  )
}
