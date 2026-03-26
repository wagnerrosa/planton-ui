import { TutorAvatar } from './TutorAvatar'

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <TutorAvatar size="sm" />
      <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-planton-accent [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-planton-accent [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-planton-accent [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
