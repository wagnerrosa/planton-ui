export const duration = {
  fast:   200,
  base:   300,
  reveal: 400,
  sweep:  500,
  shine:  700,
} as const

export const easing = {
  sweep:   'cubic-bezier(0.16, 1, 0.3, 1)',
  lift:    'cubic-bezier(0.22, 1, 0.36, 1)',
  default: 'ease-out',
} as const

export const reveal = {
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' },
} as const
