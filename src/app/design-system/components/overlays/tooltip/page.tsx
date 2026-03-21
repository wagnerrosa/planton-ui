'use client'

import { ComponentPage } from '@/components/ui/ComponentPage'
import { Button } from '@/components/primitives/Button'
import { Separator } from '@/components/shadcn/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { Info, HelpCircle, Settings } from 'lucide-react'
import { findComponent } from '@/lib/components-registry'

const meta = findComponent('overlays', 'tooltip')!

export default function TooltipPage() {
  return (
    <ComponentPage
      category="Overlays"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Posições</h2>
        <TooltipProvider>
          <div className="flex items-center gap-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Topo</Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Tooltip no topo</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Baixo</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Tooltip embaixo</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Esquerda</Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Tooltip à esquerda</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Direita</Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Tooltip à direita</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Com ícones</h2>
        <TooltipProvider>
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-accent transition-colors text-planton-muted">
                  <Info size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Informações adicionais</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-accent transition-colors text-planton-muted">
                  <HelpCircle size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Central de ajuda</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-accent transition-colors text-planton-muted">
                  <Settings size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configurações</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </section>
    </ComponentPage>
  )
}
