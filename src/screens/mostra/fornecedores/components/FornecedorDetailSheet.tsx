'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/shadcn/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Button } from '@/components/primitives/Button'
import { Body } from '@/components/primitives/Body'
import { Separator } from '@/components/shadcn/separator'
import { StatusBadge } from '../../components/StatusBadge'
import { StatusSelect } from '../../components/StatusSelect'
import { Field } from '../../components/Field'
import { formatDateBR, FORNECEDOR_STATUS_CONFIG, type Fornecedor, type FornecedorStatus } from '../../mock-data'

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto flex flex-col gap-0 p-0 [&>button]:hidden">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-sm shrink-0">
                <AvatarImage src={fornecedor.logoUrl} alt={fornecedor.nome} />
                <AvatarFallback className="rounded-sm text-sm font-mono">
                  {fornecedor.nome.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-left text-base font-semibold">{fornecedor.nome}</SheetTitle>
                <Body size="sm" className="text-muted-foreground font-mono mt-0.5">{fornecedor.cnpj}</Body>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusSelect
                currentStatus={fornecedor.status}
                tipo="fornecedor"
                onStatusChange={onStatusChange}
              />
              <Button size="sm" variant="ghost" onClick={onEdit}>
                Editar
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 px-6 py-5 space-y-5">
          {/* Dados do fornecedor */}
          <div className="space-y-3">
            <span className="text-sm font-semibold font-sans block">Dados do Fornecedor</span>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CNPJ" value={fornecedor.cnpj} />
              <Field label="Site" value={fornecedor.site} />
            </div>
          </div>

          <Separator />

          {/* Responsável */}
          <div className="space-y-3">
            <span className="text-sm font-semibold font-sans block">Responsável</span>
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
            <span className="text-sm font-semibold font-sans block">Clientes Indicados</span>
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

          {/* Histórico de Status */}
          {fornecedor.statusHistory && fornecedor.statusHistory.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <span className="text-sm font-semibold font-sans block">Histórico de Status</span>
                <div className="flex flex-col gap-0">
                  {fornecedor.statusHistory.map((item, idx) => {
                    const isLast = idx === fornecedor.statusHistory!.length - 1
                    return (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full border-2 mt-0.5 shrink-0 ${isLast ? 'border-foreground bg-foreground' : 'border-muted-foreground bg-background'}`} />
                          {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
                        </div>
                        <div className="pb-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">{FORNECEDOR_STATUS_CONFIG[item.status as FornecedorStatus].label}</span>
                            <span className="text-xs text-muted-foreground font-mono">{formatDateBR(item.data)}</span>
                          </div>
                          {item.nota && (
                            <Body size="sm" className="text-muted-foreground mt-0.5">{item.nota}</Body>
                          )}
                        </div>
                      </div>
                    )
                  })}
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
