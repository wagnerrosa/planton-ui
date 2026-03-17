import { LessonCard } from './LessonCard'

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[1400px] mx-auto">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          index={lesson.index}
          title={lesson.title}
          description={lesson.description}
          href={lesson.href}
        />
      ))}
    </div>
  )
}
