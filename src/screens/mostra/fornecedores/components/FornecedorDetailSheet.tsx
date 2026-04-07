'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/shadcn/sheet'
import { Button } from '@/components/primitives/Button'
import { Body } from '@/components/primitives/Body'
import { Heading } from '@/components/primitives/Heading'
import { Separator } from '@/components/shadcn/separator'
import { StatusBadge } from '../../components/StatusBadge'
import { Field } from '../../components/Field'
import { formatDateBR, type Fornecedor, type FornecedorStatus } from '../../mock-data'

type FornecedorDetailSheetProps = {
  fornecedor: Fornecedor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (status: FornecedorStatus) => void
  onEdit: () => void
}

export function FornecedorDetailSheet({
  fornecedor,
  open,
  onOpenChange,
  onStatusChange,
  onEdit,
}: FornecedorDetailSheetProps) {
  if (!fornecedor) return null

  const isProcessoIniciado = fornecedor.status === 'processo-iniciado'
  const isElegivel = fornecedor.status === 'elegivel'
  const isAguardandoContrato = fornecedor.status === 'aguardando-contrato'
  const hasActions = isProcessoIniciado || isElegivel || isAguardandoContrato

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-left text-base font-semibold">{fornecedor.nome}</SheetTitle>
              <Body size="sm" className="text-muted-foreground font-mono mt-0.5">{fornecedor.cnpj}</Body>
            </div>
            <StatusBadge status={fornecedor.status} tipo="fornecedor" />
          </div>
        </SheetHeader>

        {/* Actions por status */}
        {hasActions && (
          <div className="px-6 py-3 border-b border-border bg-muted/20">
            <Body size="sm" className="text-muted-foreground mb-2 uppercase tracking-wider">Ações</Body>
            <div className="flex flex-wrap gap-2">
              {isProcessoIniciado && (
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
          {/* Dados do fornecedor */}
          <div className="space-y-3">
            <Heading as="h3" size="heading-md">Dados do Fornecedor</Heading>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CNPJ" value={fornecedor.cnpj} />
              <Field label="Site" value={fornecedor.site} />
            </div>
          </div>

          <Separator />

          {/* Responsável */}
          <div className="space-y-3">
            <Heading as="h3" size="heading-md">Responsável</Heading>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nome" value={fornecedor.responsavel} />
              <Field label="Cargo" value={fornecedor.cargo} />
              <Field label="E-mail" value={fornecedor.email} />
              <Field label="Telefone" value={fornecedor.telefone} />
            </div>
          </div>

          <Separator />

          {/* Clientes indicados */}
          <div className="space-y-3">
            <Heading as="h3" size="heading-md">Clientes Indicados</Heading>
            {fornecedor.clientesIndicados.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {fornecedor.clientesIndicados.map((cliente) => (
                  <span
                    key={cliente}
                    className="border border-border px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {cliente}
                  </span>
                ))}
              </div>
            ) : (
              <Body size="sm" className="text-muted-foreground">Nenhum cliente indicado.</Body>
            )}
          </div>

          {/* Logo */}
          {fornecedor.logoUrl && (
            <>
              <Separator />
              <div className="space-y-2">
                <Body size="sm" className="text-muted-foreground uppercase tracking-wider">Logotipo</Body>
                <a href={fornecedor.logoUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline underline-offset-2">
                  Ver arquivo
                </a>
              </div>
            </>
          )}

          {/* Data */}
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data de entrada" value={formatDateBR(fornecedor.dataEntrada)} />
          </div>
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
