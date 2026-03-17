import { cn } from '@/lib/utils'

type BodySize = 'lg' | 'base' | 'sm'
type BodySurface = 'light' | 'dark'

type BodyProps = {
  size?: BodySize
  surface?: BodySurface
  muted?: boolean
  children: React.ReactNode
  className?: string
}

const sizeClasses: Record<BodySize, string> = {
  lg:   'text-[1.125rem]',
  base: 'text-[1rem]',
  sm:   'text-[0.875rem]',
}

export function Body({
  size = 'base',
  surface = 'light',
  muted = false,
  children,
  className,
}: BodyProps) {
  return (
    <p
      className={cn(
        'font-sans leading-[1.65]',
        sizeClasses[size],
        surface === 'light'
          ? muted ? 'text-planton-muted' : 'text-planton-forest'
          : muted ? 'text-planton-cream/80' : 'text-planton-cream',
        className,
      )}
    >
      {children}
    </p>
  )
}
