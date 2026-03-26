import { X } from 'lucide-react'
import { TutorAvatar } from './TutorAvatar'

type TutorHeaderProps = {
  onClose: () => void
}

export function TutorHeader({ onClose }: TutorHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
      <div className="flex items-center gap-2.5">
        <TutorAvatar size="md" />
        <div>
          <h3 className="font-heading text-sm font-medium leading-none text-foreground">Tutor Planton</h3>
          <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-planton-accent">IA Assistente</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar tutor"
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
      >
        <X size={16} />
      </button>
    </div>
  )
}
