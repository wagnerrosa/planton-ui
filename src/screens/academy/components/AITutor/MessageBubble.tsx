import { Avatar, AvatarImage, AvatarFallback } from '@/components/shadcn/avatar'
import { cn } from '@/lib/utils'
import type { Message, RichBlock } from './types'
import { TutorAvatar } from './TutorAvatar'

const USER_AVATAR_URL = 'https://avatars.githubusercontent.com/u/7215006?v=4'

function RichContent({ blocks }: { blocks: RichBlock[] }) {
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'text':
            return (
              <p key={i} className="text-sm leading-relaxed">
                {block.content}
              </p>
            )
          case 'list':
            return (
              <ul key={i} className="flex flex-col gap-1 pl-4">
                {block.items.map((item, j) => (
                  <li key={j} className="text-sm leading-relaxed list-disc marker:text-planton-accent">
                    {item}
                  </li>
                ))}
              </ul>
            )
          case 'highlight':
            return (
              <div
                key={i}
                className="rounded-lg border border-planton-accent/25 bg-planton-accent/10 px-3 py-2 text-sm leading-relaxed"
              >
                {block.content}
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

type MessageBubbleProps = {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-2.5', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      {isUser ? (
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarImage src={USER_AVATAR_URL} alt="Voce" />
          <AvatarFallback className="text-xs">W</AvatarFallback>
        </Avatar>
      ) : (
        <TutorAvatar size="sm" />
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'rounded-tr-sm bg-planton-forest text-white'
            : 'rounded-tl-sm border border-white/10 bg-white/5 backdrop-blur-sm',
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.blocks[0]?.type === 'text' ? message.blocks[0].content : ''}</p>
        ) : (
          <RichContent blocks={message.blocks} />
        )}
      </div>
    </div>
  )
}
