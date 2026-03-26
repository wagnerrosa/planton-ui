import Image from 'next/image'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type FloatingButtonProps = {
  open: boolean
  onClick: () => void
}

export function FloatingButton({ open, onClick }: FloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Fechar tutor' : 'Abrir tutor'}
      className={cn(
        'fixed bottom-6 right-6 z-[60] transition-all duration-300 ease-[var(--ease-sweep)]',
        'shadow-md shadow-black/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/15 active:scale-[0.98] active:shadow-sm',
        open
          ? 'flex h-14 w-14 items-center justify-center rounded-full border border-planton-accent bg-planton-dark text-planton-accent shadow-lg'
          : cn(
              'flex h-14 items-center overflow-hidden rounded-full py-0 pl-6 pr-0',
              'border border-white/15 bg-background/60 backdrop-blur-2xl backdrop-saturate-150',
            ),
      )}
    >
      {/* X icon — visible when open */}
      <span
        className={cn(
          'transition-all duration-300',
          open
            ? 'relative rotate-0 scale-100'
            : 'absolute rotate-90 scale-0',
        )}
      >
        <X size={22} />
      </span>

      {/* Selo — visible when closed */}
      <span
        className={cn(
          'flex items-center gap-4 transition-all duration-300',
          open ? 'pointer-events-none absolute scale-0 opacity-0' : 'scale-100 opacity-100',
        )}
      >
        <span className="font-heading text-base font-semibold leading-none text-planton-forest">
          Tutor IA
        </span>
        <span className="h-8 w-px bg-white/20" />
        <Image
          src="/powered_by_genius.svg"
          alt="Powered by Planton Genius"
          width={130}
          height={22}
          className="h-5 w-auto object-contain"
          unoptimized
        />
        {/* Planton symbol — full height, flush right */}
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[1px] border-white/20 bg-planton-accent/5">
          <Image
            src="/favicon/favicon.svg"
            alt="Planton"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md object-contain"
            unoptimized
          />
        </span>
      </span>
    </button>
  )
}
