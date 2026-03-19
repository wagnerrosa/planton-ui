import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-default flex flex-col items-center justify-center gap-10 p-12">
      <div className="text-center flex flex-col items-center gap-6">
        <Image
          src="/Logo_Planton_01.svg"
          alt="Planton"
          width={180}
          height={39}
          priority
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-[clamp(3rem,5vw,5rem)] leading-[1.05] tracking-[-0.05em] text-planton-forest">
            Design System
          </h1>
          <p className="font-sans text-base leading-[1.65] text-planton-muted max-w-md">
            Tokens, primitivos, componentes e padrões para todos os produtos Planton.
          </p>
        </div>
      </div>

      <Link
        href="/design-system"
        className="group relative inline-flex items-center overflow-hidden border border-planton-accent px-6 py-3 font-sans text-sm font-medium text-planton-accent transition-colors duration-300"
      >
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-planton-accent transition-transform ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 group-hover:translate-x-0"
        />
        <span className="relative z-10 group-hover:text-planton-white transition-colors duration-300">
          Ver Design System →
        </span>
      </Link>
    </main>
  )
}
