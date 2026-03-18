'use client'

import { useState } from 'react'
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
import { OnboardingStep } from './steps/OnboardingStep'
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
  | 'onboarding'
  | 'success'

export type AuthContext = {
  email: string
  voucherCode?: string
  scenario?: 'A' | 'B' | 'C'
}

export function LoginFlow() {
  const [step, setStep] = useState<AuthStep>('login')
  const [context, setContext] = useState<AuthContext>({ email: '' })
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)

  const updateContext = (updates: Partial<AuthContext>) => {
    setContext((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-default p-6">
      {step === 'login' && (
        <LoginStep
          onNavigate={setStep}
          onUpdateContext={updateContext}
          onOpenEmailDialog={() => setEmailDialogOpen(true)}
        />
      )}

      {step === 'access-denied' && (
        <AccessDeniedStep onNavigate={setStep} />
      )}

      {step === 'forgot-password' && (
        <ForgotPasswordStep
          onNavigate={setStep}
          onUpdateContext={updateContext}
        />
      )}

      {step === 'reset-password-sent' && (
        <ResetPasswordSentStep
          email={context.email}
          onNavigate={setStep}
        />
      )}

      {step === 'domain-active' && (
        <DomainActiveStep onNavigate={setStep} />
      )}

      {step === 'domain-inactive' && (
        <DomainInactiveStep
          onNavigate={setStep}
          onUpdateContext={updateContext}
        />
      )}

      {step === 'domain-unknown' && (
        <DomainUnknownStep onNavigate={setStep} />
      )}

      {step === 'profile-form' && (
        <ProfileFormStep
          scenario={context.scenario}
          onNavigate={setStep}
        />
      )}

      {step === 'set-password' && (
        <SetPasswordStep onNavigate={setStep} />
      )}

      {step === 'otp-verification' && (
        <OTPVerificationStep
          email={context.email}
          onNavigate={setStep}
        />
      )}

      {step === 'onboarding' && (
        <OnboardingStep onNavigate={setStep} />
      )}

      {step === 'success' && <SuccessStep />}

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
