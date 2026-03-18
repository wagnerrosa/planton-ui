'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Alert, AlertBody, AlertDescription, AlertTitle } from '@/components/shadcn/alert'
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('feedback', 'alert')!

export default function AlertPage() {
  return (
    <ComponentPage
      category="Feedback"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Variantes</h2>
        <div className="flex flex-col gap-4 max-w-xl">
          <Alert variant="info">
            <Info className="h-4 w-4" />
            <AlertBody>
              <AlertTitle>Acesso não ativado</AlertTitle>
              <AlertDescription>Sua empresa ainda não tem acesso ativo ao Planton Academy.</AlertDescription>
            </AlertBody>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertBody>
              <AlertTitle>Código inválido</AlertTitle>
              <AlertDescription>Código inválido ou expirado.</AlertDescription>
            </AlertBody>
          </Alert>
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertBody>
              <AlertTitle>Certificado emitido!</AlertTitle>
              <AlertDescription>Seu certificado está disponível para download.</AlertDescription>
            </AlertBody>
          </Alert>
          <Alert variant="warning">
            <TriangleAlert className="h-4 w-4" />
            <AlertBody>
              <AlertTitle>Plano a vencer</AlertTitle>
              <AlertDescription>Seu plano vence em 28 dias.</AlertDescription>
            </AlertBody>
          </Alert>
          <Alert>
            <AlertDescription>
              O GRI 404 aborda treinamento e educação, incluindo horas médias de treinamento por colaborador e programas de aprimoramento de habilidades.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </ComponentPage>
  )
}
