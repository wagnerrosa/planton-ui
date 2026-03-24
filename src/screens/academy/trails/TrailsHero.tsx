'use client'

export function TrailsHero() {
  return (
    <div className="relative w-full overflow-hidden bg-black h-[75vh] min-h-[520px]">
      {/* Background video via iframe Mux — cover technique */}
      {/* O iframe respeita 16/9 internamente; sobredimensionamos para cobrir o container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            // Garante que sempre cobre: largura mínima baseada no aspect ratio do container
            width: 'max(100%, calc(100vh * 16 / 9))',
            height: 'max(100%, calc(100vw * 9 / 16))',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <iframe
            src="https://player.mux.com/Saalk9MFlAPv1moxI00yiyJzvxdQOesW23fPVc3AL802w?metadata-video-title=Inventário+de+emissões&video-title=Inventário+de+emissões&accent-color=%2396d35f&autoplay=1&muted=1&loop=1&controls=0&disable_cookies=1"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
          />
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-14 md:pb-20">
        <div className="w-full max-w-[1920px] mx-auto px-6 md:px-10">
          <div className="flex flex-col gap-4 max-w-lg">
            {/* Label */}
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-planton-accent/80">
              Trilhas de aprendizagem
            </span>

            {/* Headline */}
            <h1 className="font-heading text-4xl md:text-5xl font-semibold leading-tight text-white">
              Aprenda ESG com trilhas estruturadas
            </h1>

            {/* Sub */}
            <p className="font-sans text-base leading-relaxed text-white/70 max-w-sm">
              Evolua do básico ao avançado com jornadas guiadas e conquiste seu certificado
            </p>

            {/* Pillars */}
            <div className="flex items-center gap-4 pt-1">
              {['Jornada', 'Progressão', 'Certificação'].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] text-white/50"
                >
                  <span className="w-1 h-1 rounded-full bg-planton-accent/60 shrink-0" />
                  {item}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <a
                href="#trilhas"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-planton-accent text-planton-dark font-mono text-xs font-medium hover:bg-planton-accent/90 transition-colors duration-150"
              >
                Explorar trilhas
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
