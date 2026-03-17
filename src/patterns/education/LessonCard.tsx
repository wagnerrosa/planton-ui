import { Card } from '@/components/ui/Card'

type LessonCardProps = {
  index: string
  title: string
  description?: string
  href?: string
}

export function LessonCard({ index, title, description, href }: LessonCardProps) {
  return (
    <Card
      index={index}
      headline={title}
      description={description}
      ctaLabel="Ver aula"
      href={href}
    />
  )
}
