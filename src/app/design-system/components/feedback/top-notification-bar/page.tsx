'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { TopNotificationBar } from '@/components/ui/TopNotificationBar'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('feedback', 'top-notification-bar')!

export default function TopNotificationBarPage() {
  return (
    <ComponentPage
      category="Feedback"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      {/* Variantes */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Variantes</h2>
        <div className="flex flex-col gap-4">
          <div className="relative border border-border rounded-lg overflow-hidden">
            <TopNotificationBar
              message="Informação importante sobre o sistema."
              variant="default"
            />
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <TopNotificationBar
              message="Seu período de trial termina em 7 dias."
              variant="warning"
              ctaLabel="Fazer upgrade"
              onCtaClick={() => {}}
            />
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <TopNotificationBar
              message="Seu plano expirou. Renove para continuar acessando."
              variant="danger"
              ctaLabel="Renovar agora"
              onCtaClick={() => {}}
            />
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <TopNotificationBar
              message="Upgrade realizado com sucesso!"
              variant="success"
              dismissible
            />
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <TopNotificationBar
              message="Seu período de trial termina em 7 dias."
              variant="accent"
              ctaLabel="Fazer upgrade"
              onCtaClick={() => {}}
              dismissible
            />
          </div>
        </div>
      </section>

      {/* Com CTA */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Com CTA + Dismissível</h2>
        <div className="relative rounded-lg overflow-hidden">
          <TopNotificationBar
            message="Faltam 3 dias para o fim do seu trial."
            variant="warning"
            ctaLabel="Ver planos"
            onCtaClick={() => {}}
            dismissible
          />
        </div>
      </section>

      {/* Props */}
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border text-planton-muted">
                <th className="py-2 pr-4 font-mono text-xs">Prop</th>
                <th className="py-2 pr-4 font-mono text-xs">Tipo</th>
                <th className="py-2 pr-4 font-mono text-xs">Default</th>
                <th className="py-2 font-mono text-xs">Descrição</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-foreground">message</td>
                <td className="py-2 pr-4 text-planton-muted">string</td>
                <td className="py-2 pr-4 text-planton-muted">—</td>
                <td className="py-2 text-planton-muted font-sans">Texto da notificação (obrigatório)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-foreground">variant</td>
                <td className="py-2 pr-4 text-planton-muted">{`'default' | 'warning' | 'danger' | 'success' | 'accent'`}</td>
                <td className="py-2 pr-4 text-planton-muted">{`'default'`}</td>
                <td className="py-2 text-planton-muted font-sans">Estilo visual da barra</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-foreground">ctaLabel</td>
                <td className="py-2 pr-4 text-planton-muted">string</td>
                <td className="py-2 pr-4 text-planton-muted">—</td>
                <td className="py-2 text-planton-muted font-sans">Texto do botão de ação</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-foreground">onCtaClick</td>
                <td className="py-2 pr-4 text-planton-muted">{`() => void`}</td>
                <td className="py-2 pr-4 text-planton-muted">—</td>
                <td className="py-2 text-planton-muted font-sans">Callback ao clicar no CTA</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-foreground">dismissible</td>
                <td className="py-2 pr-4 text-planton-muted">boolean</td>
                <td className="py-2 pr-4 text-planton-muted">false</td>
                <td className="py-2 text-planton-muted font-sans">Exibe botão de fechar</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-foreground">onClose</td>
                <td className="py-2 pr-4 text-planton-muted">{`() => void`}</td>
                <td className="py-2 pr-4 text-planton-muted">—</td>
                <td className="py-2 text-planton-muted font-sans">Callback ao fechar a notificação</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </ComponentPage>
  )
}
