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
        'fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full',
        'border border-planton-accent bg-planton-forest text-planton-accent shadow-lg',
        'transition-all duration-300 ease-[var(--ease-sweep)]',
        'hover:scale-105 hover:shadow-xl active:scale-95',
        open && 'bg-planton-dark',
      )}
    >
      <span
        className={cn(
          'absolute transition-all duration-300',
          open ? 'rotate-0 scale-100' : 'rotate-90 scale-0',
        )}
      >
        <X size={22} />
      </span>
      <span
        className={cn(
          'absolute transition-all duration-300',
          open ? '-rotate-90 scale-0' : 'rotate-0 scale-100',
        )}
      >
        <Image
          src="/favicon/favicon-32x32.png"
          alt="Tutor Planton"
          width={28}
          height={28}
          className="object-contain"
          unoptimized
        />
      </span>
    </button>
  )
}
