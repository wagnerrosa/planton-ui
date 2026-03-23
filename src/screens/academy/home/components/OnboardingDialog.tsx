'use client'

import { useState } from 'react'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/shadcn/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export function OnboardingDialog() {
  const [open, setOpen] = useState(true)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl p-8 gap-6">
        <VisuallyHidden>
          <DialogTitle>Bem-vindo ao Planton Academy</DialogTitle>
          <DialogDescription>Vídeo de boas-vindas ao Planton Academy</DialogDescription>
        </VisuallyHidden>

        <div className="flex flex-col items-center gap-2 text-center">
          <Heading as="h1" size="heading-lg">Bem-vindo ao Planton Academy</Heading>
          <Body size="sm" muted>
            Veja um vídeo rápido sobre como funcionam as trilhas e a certificação.
          </Body>
        </div>

        <iframe
          src="https://player.mux.com/WKpT00e9YdvWkU3IR7JzqLQaPtXhsfXDfhBXuHMyCrd8?accent-color=%2396d35f"
          title="Bem-vindo ao Planton Academy"
          className="w-full border-none aspect-video rounded"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />

      </DialogContent>
    </Dialog>
  )
}
