import { Card } from '@/components/ui/Card'

type Lesson = {
  id: string
  index: string
  title: string
  description?: string
  href?: string
}

type CourseGridProps = {
  lessons: Lesson[]
}

export function CourseGrid({ lessons }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[1400px] mx-auto overflow-hidden border-t border-l border-border">
      {lessons.map((lesson) => (
        <Card
          key={lesson.id}
          index={lesson.index}
          headline={lesson.title}
          description={lesson.description}
          ctaLabel="Ver aula"
          href={lesson.href}
        />
      ))}
    </div>
  )
}
