'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/shadcn/sheet'
import { Button } from '@/components/primitives/Button'
import { Body } from '@/components/primitives/Body'
import { Heading } from '@/components/primitives/Heading'
import { Separator } from '@/components/shadcn/separator'
import { StatusBadge } from '../../components/StatusBadge'
import { Field } from '../../components/Field'
import { formatDateBR, type Empresa, type EmpresaStatus } from '../../mock-data'

type EmpresaDetailSheetProps = {
  empresa: Empresa | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (status: EmpresaStatus) => void
  onEdit: () => void
}

export function EmpresaDetailSheet({
  empresa,
  open,
  onOpenChange,
  onStatusChange,
  onEdit,
}: EmpresaDetailSheetProps) {
  if (!empresa) return null

  const isAguardandoRevisao = empresa.status === 'aguardando-revisao-manual'
  const isAguardandoContrato = empresa.status === 'aguardando-contrato'
  const isElegivel = empresa.status === 'elegivel'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-left text-base font-semibold">{empresa.nome}</SheetTitle>
              <Body size="sm" className="text-muted-foreground font-mono mt-0.5">{empresa.cnpj}</Body>
            </div>
            <StatusBadge status={empresa.status} tipo="empresa" />
          </div>
        </SheetHeader>

        {/* Actions por status */}
        {(isAguardandoRevisao || isAguardandoContrato || isElegivel) && (
          <div className="px-6 py-3 border-b border-border bg-muted/20">
            <Body size="sm" className="text-muted-foreground mb-2 uppercase tracking-wider">Ações</Body>
            <div className="flex flex-wrap gap-2">
              {isAguardandoRevisao && (
                <>
                  <Button size="sm" variant="primary" onClick={() => onStatusChange('elegivel')}>
                    Marcar como Elegível
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onStatusChange('nao-elegivel')}>
                    Marcar como Não Elegível
                  </Button>
                </>
              )}
              {isElegivel && (
                <Button size="sm" variant="secondary" onClick={() => onStatusChange('aguardando-contrato')}>
                  Aguardar Contrato
                </Button>
              )}
              {isAguardandoContrato && (
                <Button size="sm" variant="primary" onClick={() => onStatusChange('cadastrado')}>
                  Marcar como Cadastrado
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={onEdit}>
                Editar dados
              </Button>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 px-6 py-5 space-y-5">
          {/* Dados da empresa */}
          <div className="space-y-3">
            <Heading as="h3" size="heading-md">Dados da Empresa</Heading>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CNPJ" value={empresa.cnpj} />
              <Field label="Setor" value={empresa.setor} />
            </div>
          </div>

          <Separator />

          {/* Responsável */}
          <div className="space-y-3">
            <Heading as="h3" size="heading-md">Responsável</Heading>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nome" value={empresa.responsavel} />
              <Field label="Cargo" value={empresa.cargo} />
              <Field label="E-mail" value={empresa.email} />
              <Field label="Telefone" value={empresa.telefone} />
            </div>
          </div>

          {/* Documentos */}
          {(empresa.logoUrl || empresa.documentoUrl) && (
            <>
              <Separator />
              <div className="space-y-3">
                <Heading as="h3" size="heading-md">Documentos</Heading>
                <div className="grid grid-cols-2 gap-3">
                  {empresa.logoUrl && (
                    <div className="space-y-0.5">
                      <Body size="sm" className="text-muted-foreground uppercase tracking-wider">Logotipo</Body>
                      <a href={empresa.logoUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline underline-offset-2">
                        Ver arquivo
                      </a>
                    </div>
                  )}
                  {empresa.documentoUrl && (
                    <div className="space-y-0.5">
                      <Body size="sm" className="text-muted-foreground uppercase tracking-wider">Pegada de Carbono</Body>
                      <a href={empresa.documentoUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline underline-offset-2">
                        Ver arquivo
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Datas */}
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data de entrada" value={formatDateBR(empresa.dataEntrada)} />
          </div>

          {/* Chat History */}
          {empresa.chatHistory && empresa.chatHistory.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <Heading as="h3" size="heading-md">Histórico de Contato</Heading>
                <div className="space-y-2">
                  {empresa.chatHistory.map((msg) => (
                    <div key={msg.id} className="border border-border p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <Body size="sm" className="font-medium">{msg.autor}</Body>
                        <Body size="sm" className="text-muted-foreground">{formatDateBR(msg.data)}</Body>
                      </div>
                      <Body size="sm">{msg.mensagem}</Body>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="px-6 py-4 border-t border-border">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full">
            Fechar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
