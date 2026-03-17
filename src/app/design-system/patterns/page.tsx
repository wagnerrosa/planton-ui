import { Heading } from '@/components/primitives/Heading'
import { Eyebrow } from '@/components/primitives/Eyebrow'
import { Label } from '@/components/primitives/Label'
import { LoginScreen } from '@/patterns/auth/LoginScreen'
import { CourseGrid } from '@/patterns/education/CourseGrid'
import { Separator } from '@/components/shadcn/separator'

const demoLessons = [
  { id: '1', index: '01', title: 'Fundamentos do Solo', description: 'Composição, textura e estrutura do solo agrícola.' },
  { id: '2', index: '02', title: 'Irrigação por Gotejamento', description: 'Eficiência hídrica e instalação de sistemas.' },
  { id: '3', index: '03', title: 'Manejo de Pragas', description: 'Controle integrado e uso responsável de defensivos.' },
  { id: '4', index: '04', title: 'Adubação Verde', description: 'Cobertura vegetal e fixação biológica de nitrogênio.' },
]

export default function PatternsPage() {
  return (
    <main className="min-h-screen bg-surface-default max-w-[1400px] mx-auto px-6 py-16 flex flex-col gap-20">
      <div className="flex flex-col gap-2">
        <Eyebrow>Patterns</Eyebrow>
        <Heading as="h1" size="heading-xl">Padrões de Tela</Heading>
      </div>

      {/* Login */}
      <section className="flex flex-col gap-6">
        <Label>Auth — LoginScreen</Label>
        <Separator />
        <div className="border border-[rgba(0,0,0,0.2)]">
          <LoginScreen />
        </div>
      </section>

      {/* Course Grid */}
      <section className="flex flex-col gap-6">
        <Label>Education — CourseGrid</Label>
        <Separator />
        <CourseGrid lessons={demoLessons} />
      </section>
    </main>
  )
}
