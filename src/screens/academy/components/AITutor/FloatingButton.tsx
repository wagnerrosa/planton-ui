import Image from 'next/image'
import { cn } from '@/lib/utils'

type FloatingButtonProps = {
  open: boolean
  onClick: () => void
}

export function FloatingButton({ open, onClick }: FloatingButtonProps) {
  if (open) return null

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Abrir tutor"
      className={cn(
        'fixed bottom-6 right-6 z-[60] transition-all duration-300 ease-[var(--ease-sweep)]',
        'shadow-md shadow-black/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/15 active:scale-[0.98] active:shadow-sm',
        'flex h-14 items-center overflow-hidden rounded-full py-0 pl-6 pr-0',
        'border border-white/15 bg-background/60 backdrop-blur-2xl backdrop-saturate-150',
      )}
    >
      <span className="flex items-center gap-4">
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
