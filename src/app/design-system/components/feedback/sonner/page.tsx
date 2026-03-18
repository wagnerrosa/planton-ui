'use client'

import { toast } from 'sonner'
import { ComponentPage } from '@/components/ui/ComponentPage'
import { Button } from '@/components/primitives/Button'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('feedback', 'sonner')!

export default function SonnerPage() {
  return (
    <ComponentPage
      category="Feedback"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Tipos de toast</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => toast.success('Certificado emitido com sucesso')}>
            Toast: sucesso
          </Button>
          <Button variant="primary" onClick={() => toast.info('Conteúdo salvo e agendado para publicação')}>
            Toast: informação
          </Button>
          <Button variant="primary" onClick={() => toast.warning('Seu plano vence em 28 dias')}>
            Toast: aviso
          </Button>
          <Button variant="primary" onClick={() => toast.error('Erro ao validar domínio')}>
            Toast: erro
          </Button>
        </div>
      </section>
    </ComponentPage>
  )
}
