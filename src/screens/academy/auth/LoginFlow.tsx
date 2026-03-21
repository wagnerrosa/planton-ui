'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

const BG_IMAGES = [
  '/assets/SERRA-SUL-BG.jpg',
  '/assets/MATA-ATLANTICA-BG.jpg',
  '/assets/CAATINGA-BG.jpg',
  '/assets/PANTANAL-BG.jpg',
  '/assets/PAMPA-BG.jpg',
]

function shuffled(arr: string[]): string[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function useBgSlideshow(intervalMs = 10000) {
  const queue = useRef<string[]>([])
  const [current, setCurrent] = useState<string | null>(null)
  const [next, setNext] = useState<string | null>(null)
  const [nextVisible, setNextVisible] = useState(false)

  useEffect(() => {
    queue.current = shuffled(BG_IMAGES)
    setCurrent(queue.current[0])

    const timer = setInterval(() => {
      queue.current.shift()
      if (queue.current.length === 0) queue.current = shuffled(BG_IMAGES)
      const nextImg = queue.current[0]

      // Monta o next invisível, depois faz fade in
      setNext(nextImg)
      setNextVisible(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNextVisible(true)
        })
      })

      // Após a transição, promove next para current e limpa
      setTimeout(() => {
        setCurrent(nextImg)
        setNext(null)
        setNextVisible(false)
      }, 1200)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return { current, next, nextVisible }
}
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { LoginStep } from './steps/LoginStep'
import { AccessDeniedStep } from './steps/AccessDeniedStep'
import { ForgotPasswordStep } from './steps/ForgotPasswordStep'
import { ResetPasswordSentStep } from './steps/ResetPasswordSentStep'
import { EmailEntryStep } from './steps/EmailEntryStep'
import { DomainActiveStep } from './steps/DomainActiveStep'
import { DomainInactiveStep } from './steps/DomainInactiveStep'
import { DomainUnknownStep } from './steps/DomainUnknownStep'
import { ProfileFormStep } from './steps/ProfileFormStep'
import { SetPasswordStep } from './steps/SetPasswordStep'
import { OTPVerificationStep } from './steps/OTPVerificationStep'
import { SuccessStep } from './steps/SuccessStep'

export type AuthStep =
  | 'login'
  | 'access-denied'
  | 'forgot-password'
  | 'reset-password-sent'
  | 'email-entry'
  | 'domain-active'
  | 'domain-inactive'
  | 'domain-unknown'
  | 'profile-form'
  | 'set-password'
  | 'otp-verification'
  | 'success'

export type AuthContext = {
  email: string
  voucherCode?: string
  scenario?: 'A' | 'B' | 'C'
}

export function LoginFlow() {
  const searchParams = useSearchParams()
  const initialStep = (searchParams.get('step') as AuthStep) ?? 'login'
  const [step, setStep] = useState<AuthStep>(initialStep === 'email-entry' ? 'login' : initialStep)
  const { current, next, nextVisible } = useBgSlideshow()
  const [context, setContext] = useState<AuthContext>({ email: '' })
  const [emailDialogOpen, setEmailDialogOpen] = useState(initialStep === 'email-entry')

  const updateContext = (updates: Partial<AuthContext>) => {
    setContext((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {current && (
        <Image
          src={current}
          alt=""
          fill
          className="object-cover"
          priority
        />
      )}
      {next && (
        <Image
          src={next}
          alt=""
          fill
          className="object-cover transition-opacity duration-1000"
          style={{ opacity: nextVisible ? 1 : 0 }}
        />
      )}
      <div className="absolute inset-0 bg-black/20" />

      {/* Card */}
      <div className="relative z-20 w-full flex items-center justify-center">
        {step === 'login' && (
          <LoginStep
            onNavigate={setStep}
            onUpdateContext={updateContext}
            onOpenEmailDialog={() => setEmailDialogOpen(true)}
          />
        )}
        {step === 'access-denied' && <AccessDeniedStep onNavigate={setStep} />}
        {step === 'forgot-password' && (
          <ForgotPasswordStep onNavigate={setStep} onUpdateContext={updateContext} />
        )}
        {step === 'reset-password-sent' && (
          <ResetPasswordSentStep email={context.email} onNavigate={setStep} />
        )}
        {step === 'domain-active' && <DomainActiveStep onNavigate={setStep} />}
        {step === 'domain-inactive' && (
          <DomainInactiveStep onNavigate={setStep} onUpdateContext={updateContext} />
        )}
        {step === 'domain-unknown' && <DomainUnknownStep onNavigate={setStep} />}
        {step === 'profile-form' && (
          <ProfileFormStep scenario={context.scenario} onNavigate={setStep} />
        )}
        {step === 'set-password' && <SetPasswordStep onNavigate={setStep} />}
        {step === 'otp-verification' && (
          <OTPVerificationStep email={context.email} onNavigate={setStep} />
        )}
        {step === 'success' && <SuccessStep />}
      </div>

      <AcademyFooter variant="overlay" />

      <EmailEntryStep
        open={emailDialogOpen}
        onOpenChange={(open) => {
          setEmailDialogOpen(open)
          if (!open && step === 'login') return
        }}
        onNavigate={(nextStep) => {
          setEmailDialogOpen(false)
          setStep(nextStep)
        }}
        onUpdateContext={updateContext}
      />
    </div>
  )
}
