export const fontFamily = {
  heading: "'Space Grotesk', sans-serif",
  body:    "'Instrument Sans', sans-serif",
  mono:    "'Geist Mono', monospace",
  voice:   "'Roca', serif",
} as const

export const fontSize = {
  displayXl: 'clamp(4rem, 5vw, 5rem)',
  displayLg: 'clamp(3rem, 4.375vw, 4.375rem)',
  headingXl: 'clamp(2.5rem, 3.5vw, 3.5rem)',
  headingLg: 'clamp(1.75rem, 2.25vw, 2.25rem)',
  bodyLg:    '1.125rem',
  bodyBase:  '1rem',
  bodySm:    '0.875rem',
  eyebrow:   '0.6875rem',
  label:     '0.75rem',
} as const

export const letterSpacing = {
  headingXl: '-0.05em',
  headingLg: '-0.04em',
  headingMd: '-0.02em',
  eyebrow:   '0.12em',
  label:     '0.05em',
} as const

export const lineHeight = {
  displayXl: '1.0',
  displayLg: '1.0',
  headingXl: '1.05',
  headingLg: '1.15',
  quote:     '1.3',
  body:      '1.65',
} as const
