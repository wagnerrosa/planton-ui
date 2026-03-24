import Link from 'next/link'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'

export function CertificationBanner() {
  return (
    <Link
      href="/design-system/screens/academy/trilhas"
      className="group relative isolate flex h-full w-full overflow-hidden bg-planton-forest text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-planton-accent/30 cursor-pointer lg:-ml-8 lg:w-[calc(100%+2rem)] rounded-none flex-1"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.12] transition-opacity duration-300 group-hover:opacity-[0.18]"
        style={{
          backgroundImage: "url('/patterns/Textura_Forest.jpg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />

      <span
        aria-hidden
        className="absolute left-0 top-0 z-10 w-[3px] h-0 bg-planton-accent transition-[height] ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 group-hover:h-full"
      />

      <div className="relative z-20 flex flex-1 flex-col justify-center gap-4 px-8 py-8 md:px-10 md:py-10">
        <div className="flex flex-col items-start gap-2">
          <Heading as="h3" size="heading-lg" className="text-white">
            Faça cursos e conquiste seu certificado
          </Heading>

          <Body size="base" muted className="max-w-[42ch] text-white/80">
            Cursos estruturados para evoluir do básico ao avançado
          </Body>
        </div>

        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 font-sans text-base font-normal text-white transition-all duration-150 group-hover:gap-3">
            Ver trilhas →
          </span>
        </div>
      </div>
    </Link>
  )
}
