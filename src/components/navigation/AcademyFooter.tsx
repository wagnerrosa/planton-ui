import Image from 'next/image'
import Link from 'next/link'

type AcademyFooterProps = {
  /**
   * 'default' — footer fixo na base do conteúdo, fundo branco, borda superior.
   *             Usado no layout do Academy.
   *
   * 'overlay' — footer fixo sobre imagem/background (ex: tela de Login).
   *             Transparente, texto branco, sem borda.
   */
  variant?: 'default' | 'overlay'
}

const LINKS = [
  { label: 'Site', href: 'https://planton.eco.br', external: true },
  { label: 'Privacidade', href: '#', external: false },
  { label: 'Termos', href: '#', external: false },
]

export function AcademyFooter({ variant = 'default' }: AcademyFooterProps) {
  const isOverlay = variant === 'overlay'

  if (isOverlay) {
    return (
      <footer className="fixed bottom-0 left-0 w-full z-10 flex flex-col items-center gap-4 pt-16 pb-6 pointer-events-none bg-gradient-to-t from-black/60 via-black/20 to-transparent">
        <div className="flex  items-center gap-6 font-sans text-[12px] text-white/60 pointer-events-auto">
          {LINKS.map(({ label, href, external }, i) => (
            <span key={label} className="flex items-center gap-1">
              {i > 0 && <span className="text-white/20">·</span>}
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="hover:text-white/80 transition-colors"
              >
                {label}
              </a>
            </span>
          ))}
        </div>

        <Link href="/design-system/screens" className="opacity-70 hover:opacity-90 transition-opacity pointer-events-auto">
          <Image
            src="/logos_planton/planton_vertical_tagline.svg"
            alt="Planton"
            width={84}
            height={72}
            priority={false}
          />
        </Link>
      </footer>
    )
  }

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1400px] mx-auto px-4 py-4 md:py-0 md:h-[67px] flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
        {/* Logo */}
        <Link href="/design-system/screens">
          <Image
            src="/Logo_Planton_01.svg"
            alt="Planton"
            width={115}
            height={28}
            priority={false}
            style={{ width: 115, height: 'auto' }}
          />
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          {LINKS.map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
