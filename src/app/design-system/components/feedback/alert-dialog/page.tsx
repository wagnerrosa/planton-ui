'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Button } from '@/components/primitives/Button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn/alert-dialog'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('feedback', 'alert-dialog')!

export default function AlertDialogPage() {
  return (
    <ComponentPage
      category="Feedback"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Confirmação destrutiva</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="primary">Revogar voucher</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revogar voucher?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O voucher será invalidado imediatamente e o colaborador perderá o acesso ao conteúdo vinculado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>Revogar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </ComponentPage>
  )
}
