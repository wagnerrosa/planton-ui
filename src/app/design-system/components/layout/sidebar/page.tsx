import { ComponentPage } from '@/components/ui/ComponentPage'
import { Separator } from '@/components/shadcn/separator'
import { findComponent } from '@/lib/components-registry'
import { Home, BookOpen, GraduationCap, Settings, User } from 'lucide-react'

const meta = findComponent('layout', 'sidebar')!

const navItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: BookOpen, label: 'Trilhas', active: false },
  { icon: GraduationCap, label: 'Certificados', active: false },
  { icon: Settings, label: 'Configurações', active: false },
  { icon: User, label: 'Perfil', active: false },
]

export default function SidebarPage() {
  return (
    <ComponentPage
      category="Layout & Structure"
      name={meta.name}
      description={meta.description}
      filePath={meta.filePath}
    >
      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Preview estático , estrutura da sidebar</h2>
        <div className="w-[260px] border border-border bg-sidebar rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-sidebar-border">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40">
              Planton Academy
            </span>
          </div>

          {/* Nav */}
          <nav className="px-3 py-3 flex flex-col gap-0.5">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-sidebar-foreground/40 px-2 mb-1">
              Menu
            </span>
            {navItems.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 px-2 py-2 text-sm font-sans rounded-none ${
                  active
                    ? 'bg-sidebar-accent text-planton-accent'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon size={15} />
                {label}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border px-3 py-3">
            <span className="font-mono text-[0.6875rem] text-sidebar-foreground/40">v0.2.0</span>
          </div>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-planton-accent">Uso no projeto</h2>
        <div className="flex flex-col gap-3 text-sm text-planton-muted leading-[1.65] max-w-xl">
          <p>
            O componente <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">Sidebar</code> do shadcn é a base estrutural para as sidebars do projeto:
          </p>
          <ul className="flex flex-col gap-1.5 pl-5 list-disc">
            <li><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">DesignSystemSidebar</code> , navegação do Design System</li>
            <li><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">AcademySidebar</code> , sidebar do Academy (push no desktop, overlay no mobile)</li>
          </ul>
          <p>
            Suporta estados <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">expanded</code> / <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">collapsed</code> e converte automaticamente para <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">Sheet</code> no mobile via <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">useIsMobile()</code>.
          </p>
        </div>
      </section>
    </ComponentPage>
  )
}
