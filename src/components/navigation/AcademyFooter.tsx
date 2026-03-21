'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/shadcn/dialog'
import { Button } from '@/components/primitives/Button'

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

type DialogType = 'privacy' | 'terms' | null

export function AcademyFooter({ variant = 'default' }: AcademyFooterProps) {
  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const isOverlay = variant === 'overlay'

  const linkButtons = [
    {
      label: 'Site',
      action: () => window.open('https://planton.eco.br', '_blank', 'noopener,noreferrer'),
    },
    { label: 'Privacidade', action: () => setOpenDialog('privacy') },
    { label: 'Termos', action: () => setOpenDialog('terms') },
  ]

  if (isOverlay) {
    return (
      <>
        <footer className="fixed bottom-0 left-0 w-full z-10 flex flex-col items-center gap-4 pt-16 pb-6 pointer-events-none bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="flex items-center gap-6 font-sans text-[12px] text-white/60 pointer-events-auto">
            {linkButtons.map(({ label, action }, i) => (
              <span key={label} className="flex items-center gap-1">
                {i > 0 && <span className="text-white/20">&middot;</span>}
                <button
                  onClick={action}
                  className="hover:text-white/80 transition-colors"
                >
                  {label}
                </button>
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

        <PolicyDialog type={openDialog} onClose={() => setOpenDialog(null)} />
      </>
    )
  }

  return (
    <>
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
            {linkButtons.map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <PolicyDialog type={openDialog} onClose={() => setOpenDialog(null)} />
    </>
  )
}

function PolicyDialog({ type, onClose }: { type: DialogType; onClose: () => void }) {
  return (
    <Dialog open={type !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        {type === 'privacy' && <PrivacyContent />}
        {type === 'terms' && <TermsContent />}
        <div>
          <Button onClick={onClose}>Aceitar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PrivacyContent() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Política de Privacidade</DialogTitle>
        <DialogDescription>
          Última atualização: março de 2026
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          A Planton Academy valoriza a privacidade dos seus usuários. Esta política
          descreve como coletamos, utilizamos e protegemos suas informações pessoais.
        </p>

        <section>
          <h3 className="font-semibold text-foreground mb-1">1. Dados coletados</h3>
          <p>
            Coletamos apenas os dados necessários para o funcionamento da plataforma:
            nome, e-mail, dados de navegação e progresso nas trilhas de aprendizagem.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-1">2. Uso dos dados</h3>
          <p>
            Seus dados são utilizados para personalizar a experiência de aprendizagem,
            enviar comunicações relevantes e melhorar continuamente a plataforma.
            Não vendemos ou compartilhamos seus dados com terceiros para fins comerciais.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-1">3. Cookies e rastreamento</h3>
          <p>
            Utilizamos cookies essenciais para o funcionamento do site e ferramentas de
            analytics para entender como a plataforma é utilizada. Você pode desativar
            cookies não essenciais nas configurações do seu navegador.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-1">4. Segurança</h3>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados contra
            acesso não autorizado, perda ou alteração. Os dados são armazenados em
            servidores seguros com criptografia em trânsito e em repouso.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-1">5. Seus direitos</h3>
          <p>
            Você pode solicitar acesso, correção ou exclusão dos seus dados pessoais
            a qualquer momento entrando em contato pelo e-mail contato@planton.eco.br.
          </p>
        </section>
      </div>
    </>
  )
}

function TermsContent() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Termos de Uso</DialogTitle>
        <DialogDescription>
          Última atualização: março de 2026
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          Ao utilizar a Planton Academy, você concorda com os termos descritos abaixo.
          Leia atentamente antes de continuar usando a plataforma.
        </p>

        <section>
          <h3 className="font-semibold text-foreground mb-1">1. Aceitação dos termos</h3>
          <p>
            Ao criar uma conta ou acessar o conteúdo da plataforma, você declara ter
            lido e concordado com estes termos de uso e com a nossa política de
            privacidade.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-1">2. Uso da plataforma</h3>
          <p>
            A Planton Academy é uma plataforma educacional voltada para sustentabilidade
            e meio ambiente. O conteúdo disponibilizado é exclusivamente para fins
            educacionais e de desenvolvimento pessoal.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-1">3. Conta do usuário</h3>
          <p>
            Você é responsável por manter a confidencialidade das suas credenciais de
            acesso. Qualquer atividade realizada com sua conta é de sua responsabilidade.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-1">4. Propriedade intelectual</h3>
          <p>
            Todo o conteúdo da plataforma, incluindo textos, imagens, vídeos, trilhas
            e materiais didáticos, é de propriedade da Planton ou de seus parceiros.
            É proibida a reprodução, distribuição ou uso comercial sem autorização prévia.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-1">5. Modificações</h3>
          <p>
            Reservamo-nos o direito de alterar estes termos a qualquer momento. As
            alterações serão comunicadas pela plataforma e a continuidade do uso
            implica aceitação dos novos termos.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-foreground mb-1">6. Contato</h3>
          <p>
            Para dúvidas sobre estes termos, entre em contato pelo e-mail
            contato@planton.eco.br.
          </p>
        </section>
      </div>
    </>
  )
}
