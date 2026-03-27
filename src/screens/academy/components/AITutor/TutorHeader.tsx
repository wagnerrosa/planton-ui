import Image from 'next/image'
import { X } from 'lucide-react'
import { TutorAvatar } from './TutorAvatar'

type TutorHeaderProps = {
  onClose: () => void
  isMobile?: boolean
}

export function TutorHeader({ onClose, isMobile }: TutorHeaderProps) {
  return (
    <div
      className="flex items-center border-b border-white/10 px-5 py-4"
      style={isMobile ? { paddingTop: `calc(1rem + env(safe-area-inset-top))` } : undefined}
    >
      {/* Left group: avatar + Tutor IA + separator + powered by */}
      <div className="flex items-center gap-3">
        <TutorAvatar size="md" />
        <h3 className="font-heading text-sm font-semibold leading-none text-planton-forest">
          Tutor IA
        </h3>
        <span className="h-4 w-px bg-white/20" />
        <Image
          src="/powered_by_genius_horizontal.svg"
          alt="Powered by Planton Genius"
          width={110}
          height={18}
          className="h-3.5 w-auto object-contain opacity-90"
          unoptimized
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar tutor"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
      >
        <X size={16} />
      </button>
    </div>
  )
}
