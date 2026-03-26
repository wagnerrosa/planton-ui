import Image from 'next/image'
import { cn } from '@/lib/utils'

type TutorAvatarProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-14 w-14',
} as const

const IMG_PX = { sm: 20, md: 22, lg: 36 } as const

export function TutorAvatar({ size = 'md', className }: TutorAvatarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-white',
        SIZES[size],
        className,
      )}
    >
      <Image
        src="/favicon/favicon.svg"
        alt="Tutor Planton"
        width={IMG_PX[size]}
        height={IMG_PX[size]}
        className="object-contain"
        unoptimized
      />
    </div>
  )
}
