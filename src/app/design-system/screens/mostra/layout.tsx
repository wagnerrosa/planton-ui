/**
 * MostraScreensLayout — raiz do módulo Mostra
 *
 * O login (rota /mostra/login) não usa o layout (app)
 * As telas autenticadas (rota /mostra/(app)/*) usam o layout (app) com sidebar
 */

export default function MostraScreensLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
