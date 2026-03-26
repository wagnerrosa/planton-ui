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
              'flex items-center overflow-visible rounded-l-2xl rounded-r-[2.75rem] py-0 pl-5 pr-1',
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
        {/* Left: text */}
        <span className="flex flex-col items-start gap-1 py-3">
          <span className="font-heading text-base font-semibold leading-none text-planton-forest">
            Tutor IA
          </span>
          <span className="h-px w-full bg-white/20" />
          <Image
            src="/powered_by_genius.svg"
            alt="Powered by Planton Genius"
            width={140}
            height={24}
            className="h-6 w-auto object-contain"
            unoptimized
          />
        </span>

        {/* Right: Planton symbol — circle that overflows */}
        <span className="-mr-1 flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-full border-1 border-white/20 bg-planton-accent/5">
          <Image
            src="/favicon/favicon.svg"
            alt="Planton"
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg object-contain"
            unoptimized
          />
        </span>
      </span>
    </button>
  )
}
