import type { Trail } from '../home/mock-data'

// Cores inline (CSS vars não funcionam em divs absolutas)
const LINE = 'rgba(247,243,219,0.2)'
const CREAM = '#F7F3DB'
const CREAM60 = 'rgba(247,243,219,0.6)'
const ACCENT = '#ADCF78'

export function CertificatePreview({ trail }: { trail: Trail }) {
  return (
    // container-type: size permite uso de cqw/cqh nas fontes filhas
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: '16/9', backgroundColor: '#145559', containerType: 'size' }}
    >
      {/* ── LINHAS ESTRUTURAIS ─────────────────────────────────────── */}
      <div className="absolute inset-0 border pointer-events-none" style={{ borderColor: LINE }} />
      <div className="absolute inset-[10px] border pointer-events-none" style={{ borderColor: LINE }} />
      <div className="absolute left-0 right-0 h-px pointer-events-none" style={{ top: '28%', backgroundColor: LINE }} />
      <div className="absolute left-0 right-0 h-px pointer-events-none" style={{ top: '58%', backgroundColor: LINE }} />
      <div className="absolute top-0 w-px pointer-events-none" style={{ left: '42%', height: '28%', backgroundColor: LINE }} />
      <div className="absolute top-0 w-px pointer-events-none" style={{ left: '60%', height: '28%', backgroundColor: LINE }} />
      <div className="absolute w-px pointer-events-none" style={{ left: '60%', top: '58%', bottom: 0, backgroundColor: LINE }} />

      {/* ── CONTEÚDO ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col">

        {/* ROW 1: Header (28%) */}
        <div className="flex items-stretch" style={{ height: '28%' }}>
          {/* Logo (42%) */}
          <div className="flex items-center" style={{ width: '42%', paddingLeft: '5cqw' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Logo_Planton_01.svg"
              alt="Planton"
              style={{
                height: '10cqh',
                width: 'auto',
                filter: 'brightness(0) saturate(100%) invert(95%) sepia(10%) saturate(300%) hue-rotate(10deg)',
              }}
            />
          </div>

          {/* B Corp (18%) */}
          <div className="flex items-center justify-center" style={{ width: '18%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/selo-b.svg"
              alt="Certified B Corporation"
              style={{
                height: '14cqh',
                width: 'auto',
                filter: 'brightness(0) saturate(100%) invert(95%) sepia(10%) saturate(300%) hue-rotate(10deg)',
              }}
            />
          </div>

          {/* Cert info (40%) */}
          <div className="flex flex-col items-start justify-center" style={{ width: '40%', paddingLeft: '4cqw', paddingRight: '4cqw', gap: '0.4cqh' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1cqw', color: CREAM60, lineHeight: 1.4 }}>
              Certificado nº U8bfc-0336c407a2fa
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1cqw', color: CREAM60, lineHeight: 1.4 }}>
              academy.planton.eco.br/8bfc-0336c407a2fa
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1cqw', color: CREAM60, lineHeight: 1.4 }}>
              Referência: 0004
            </span>
          </div>
        </div>

        {/* ROW 2: Student name (30%) */}
        <div className="flex items-center" style={{ height: '30%', paddingLeft: '5cqw' }}>
          <div className="flex flex-col" style={{ gap: '0.5cqh' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4cqw', color: CREAM, lineHeight: 1.4 }}>
              Certificado
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '6cqw', color: ACCENT, lineHeight: 1 }}>
              Nome do Aluno
            </span>
          </div>
        </div>

        {/* ROW 3: Trail info + texture (42%) */}
        <div className="flex flex-1">
          {/* Left (60%) */}
          <div className="flex flex-col justify-between" style={{ width: '60%', paddingLeft: '5cqw', paddingRight: '3cqw', paddingTop: '3cqh', paddingBottom: '3cqh' }}>
            <div className="flex flex-col" style={{ gap: '0.8cqh' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4cqw', color: CREAM, lineHeight: 1.4 }}>
                Concluiu com sucesso a trilha:
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '3.6cqw', color: ACCENT, lineHeight: 1.15 }}>
                {trail.title}
              </span>
            </div>
            <div className="flex" style={{ gap: '4cqw' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2cqw', color: CREAM }}>
                Data: 20/03/2026
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2cqw', color: CREAM }}>
                Duração: {trail.totalDuration}
              </span>
            </div>
          </div>

          {/* Right: city texture (40%) */}
          <div className="relative flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/patterns/Textura_cidade.png"
              alt=""
              className="absolute object-cover opacity-60"
              style={{ top: 0, left: 0, right: 10, bottom: 10, width: 'calc(100% - 10px)', height: 'calc(100% - 10px)' }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
