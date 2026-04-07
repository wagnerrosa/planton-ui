'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/shadcn/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Button } from '@/components/primitives/Button'
import { Body } from '@/components/primitives/Body'
import { Separator } from '@/components/shadcn/separator'
import { StatusBadge } from '../../components/StatusBadge'
import { StatusSelect } from '../../components/StatusSelect'
import { Field } from '../../components/Field'
import { formatDateBR, EMPRESA_STATUS_CONFIG, type Empresa, type EmpresaStatus } from '../../mock-data'

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto flex flex-col gap-0 p-0 [&>button]:hidden">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-sm shrink-0">
                <AvatarImage src={empresa.logoUrl} alt={empresa.nome} />
                <AvatarFallback className="rounded-sm text-sm font-mono">
                  {empresa.nome.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-left text-base font-semibold">{empresa.nome}</SheetTitle>
                <Body size="sm" className="text-muted-foreground font-mono mt-0.5">{empresa.cnpj}</Body>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusSelect
                currentStatus={empresa.status}
                tipo="empresa"
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
          {/* Dados da empresa */}
          <div className="space-y-3">
            <span className="text-sm font-semibold font-sans block">Dados da Empresa</span>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CNPJ" value={empresa.cnpj} />
              <Field label="Setor" value={empresa.setor} />
            </div>
          </div>

          <Separator />

          {/* Responsável */}
          <div className="space-y-3">
            <span className="text-sm font-semibold font-sans block">Responsável</span>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nome" value={empresa.responsavel} />
              <Field label="Cargo" value={empresa.cargo} />
              <Field label="E-mail" value={empresa.email} />
              <Field label="Telefone" value={empresa.telefone} />
            </div>
          </div>

          {/* Documentos */}
          <Separator />
          <div className="space-y-3">
            <span className="text-sm font-semibold font-sans block">Documentos</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-0.5">
                <Body size="sm" className="text-muted-foreground uppercase tracking-wider">Logotipo</Body>
                {empresa.logoUrl ? (
                  <a href={empresa.logoUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline underline-offset-2">
                    Ver arquivo
                  </a>
                ) : (
                  <Body size="sm">—</Body>
                )}
              </div>
              <div className="space-y-0.5">
                <Body size="sm" className="text-muted-foreground uppercase tracking-wider">Pegada de Carbono</Body>
                {empresa.documentoUrl ? (
                  <a href={empresa.documentoUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline underline-offset-2">
                    Ver arquivo
                  </a>
                ) : (
                  <Body size="sm">—</Body>
                )}
              </div>
            </div>
          </div>

          {/* Datas */}
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data de entrada" value={formatDateBR(empresa.dataEntrada)} />
          </div>

          {/* Histórico de Status */}
          {empresa.statusHistory && empresa.statusHistory.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <span className="text-sm font-semibold font-sans block">Histórico de Status</span>
                <div className="relative flex flex-col gap-0">
                  {empresa.statusHistory.map((item, idx) => {
                    const isLast = idx === empresa.statusHistory!.length - 1
                    return (
                      <div key={idx} className="flex gap-3">
                        {/* linha vertical + bolinha */}
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full border-2 mt-0.5 shrink-0 ${isLast ? 'border-foreground bg-foreground' : 'border-muted-foreground bg-background'}`} />
                          {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
                        </div>
                        {/* conteúdo */}
                        <div className={`pb-4 ${isLast ? '' : ''}`}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">{EMPRESA_STATUS_CONFIG[item.status].label}</span>
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

          {/* Chat de Cadastro */}
          {empresa.chatHistory && empresa.chatHistory.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <span className="text-sm font-semibold font-sans block">Chat de Cadastro</span>
                <div className="border border-border h-64 overflow-y-auto flex flex-col gap-2 p-3">
                  {empresa.chatHistory.map((msg) => {
                    const isIA = msg.autor === 'IA' || msg.autor === 'Sistema'
                    return (
                      <div key={msg.id} className={`flex flex-col gap-0.5 ${isIA ? 'items-start' : 'items-end'}`}>
                        <div className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed ${
                          isIA
                            ? 'bg-muted text-foreground rounded-sm rounded-tl-none'
                            : 'bg-foreground text-background rounded-sm rounded-tr-none'
                        }`}>
                          {msg.mensagem}
                        </div>
                        <Body size="sm" className="text-muted-foreground px-1">
                          {msg.autor} · {formatDateBR(msg.data)}
                        </Body>
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
