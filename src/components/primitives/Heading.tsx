import { cn } from '@/lib/utils'

type HeadingSize = 'display-xl' | 'display-lg' | 'heading-xl' | 'heading-lg'
type HeadingSurface = 'light' | 'dark'

type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  size?: HeadingSize
  surface?: HeadingSurface
  children: React.ReactNode
  className?: string
}

const sizeClasses: Record<HeadingSize, string> = {
  'display-xl': 'text-[clamp(4rem,5vw,5rem)] tracking-[-0.05em] leading-[1.0]',
  'display-lg': 'text-[clamp(3rem,4.375vw,4.375rem)] tracking-[-0.05em] leading-[1.0]',
  'heading-xl': 'text-[clamp(2.5rem,3.5vw,3.5rem)] tracking-[-0.04em] leading-[1.05]',
  'heading-lg': 'text-[clamp(1.75rem,2.25vw,2.25rem)] tracking-[-0.02em] leading-[1.15]',
}

export function Heading({
  as: Tag = 'h2',
  size = 'heading-xl',
  surface = 'light',
  children,
  className,
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        'font-heading',
        sizeClasses[size],
        surface === 'light' ? 'text-planton-forest' : 'text-planton-cream',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
