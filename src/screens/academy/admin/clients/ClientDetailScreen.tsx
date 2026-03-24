'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Users, Clock, Award, BookCheck, Plus, Pause, Play, Pencil } from 'lucide-react'
import { AcademyNavbarSync } from '@/components/navigation/AcademyNavbarSync'
import { AcademyFooter } from '@/components/navigation/AcademyFooter'
import { Heading } from '@/components/primitives/Heading'
import { Body } from '@/components/primitives/Body'
import { Button } from '@/components/primitives/Button'
import { Badge } from '@/components/shadcn/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Skeleton } from '@/components/shadcn/skeleton'
import { AdminStatsCard } from '../components/AdminStatsCard'
import { CLIENTS, type Client, type MemberRole } from '../mock-data'

const BASE = '/design-system/screens/academy'

export function ClientDetailScreen({ clientId }: { clientId: string }) {
  const [loading, setLoading] = useState(true)
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [addDomainOpen, setAddDomainOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const client = CLIENTS.find((c) => c.id === clientId)

  if (!client) {
    return (
      <>
        <AcademyNavbarSync breadcrumbs={[{ label: 'Admin', href: `${BASE}/admin` }, { label: 'Clientes', href: `${BASE}/admin/clients` }, { label: 'Não encontrado' }]} />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Body muted>Cliente não encontrado</Body>
        </div>
      </>
    )
  }

  const statusBadgeVariant = client.status === 'ativo' ? 'success' : 'destructive'

  const kpis = [
    { label: 'Usuários', value: String(client.totalUsers), change: '+12', period: 'últimos 30 dias', trend: 'up' as const, icon: <Users size={16} /> },
    { label: 'Horas consumidas', value: `${client.totalHours}h`, change: '+8%', period: 'vs. mês anterior', trend: 'up' as const, icon: <Clock size={16} /> },
    { label: 'Certificados', value: String(client.totalCertificates), change: '+5', period: 'últimos 30 dias', trend: 'up' as const, icon: <Award size={16} /> },
    { label: 'Trilhas concluídas', value: String(client.trailsCompleted), change: '+18', period: 'últimos 30 dias', trend: 'up' as const, icon: <BookCheck size={16} /> },
  ]

  return (
    <>
      <AcademyNavbarSync breadcrumbs={[
        { label: 'Admin', href: `${BASE}/admin` },
        { label: 'Clientes', href: `${BASE}/admin/clients` },
        { label: client.name },
      ]} />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          {/* Header */}
          <div className="max-w-[1920px] mx-auto px-6 pt-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Heading as="h1" size="heading-xl">{client.name}</Heading>
                  <Badge variant={statusBadgeVariant}>{client.status}</Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <Body muted className="font-mono text-sm">{client.cnpj}</Body>
                  <Body muted className="text-sm">
                    Domínios: {client.domains.join(', ')}
                  </Body>
                  <Body muted className="text-sm">
                    Plano: {client.plan.name} — vence em {client.plan.expiration}
                    {client.plan.daysRemaining <= 30 && client.plan.daysRemaining > 0 && (
                      <Badge variant="warning" className="ml-2">{client.plan.daysRemaining} dias</Badge>
                    )}
                  </Body>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => toast.success(client.status === 'ativo' ? 'Cliente suspenso' : 'Cliente ativado')}>
                  {client.status === 'ativo' ? <><Pause size={15} className="mr-1.5" />Suspender</> : <><Play size={15} className="mr-1.5" />Ativar</>}
                </Button>
                <Button onClick={() => toast('Edição em breve')}>
                  <Pencil size={15} className="mr-1.5" />
                  Editar
                </Button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="overflow-hidden border-t border-l border-border">
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border-r border-b border-border p-6 flex flex-col gap-3">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4">
                  {kpis.map((kpi) => (
                    <AdminStatsCard key={kpi.label} {...kpi} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs: Membros / Domínios */}
          <div className="max-w-[1920px] mx-auto px-6 pb-10">
            <div className="border border-border">
              <Tabs defaultValue="members">
                <div className="px-10 pt-10 pb-0 border-b border-border">
                  <TabsList>
                    <TabsTrigger value="members">Membros</TabsTrigger>
                    <TabsTrigger value="domains">Domínios</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="members" className="mt-0">
                  <div className="p-6 flex justify-end">
                    <Button onClick={() => setAddMemberOpen(true)}>
                      <Plus size={15} className="mr-1.5" />
                      Adicionar membro
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Papel</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                          </TableRow>
                        ))
                      ) : client.members.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-12">
                            <div className="flex flex-col items-center gap-3">
                              <Users size={32} className="text-planton-muted" />
                              <Body muted>Nenhum membro cadastrado</Body>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        client.members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell className="text-sm">{member.email}</TableCell>
                            <TableCell>
                              <Select defaultValue={member.role} onValueChange={(v) => toast.success(`Papel alterado para ${v === 'gestor-master' ? 'Gestor Master' : 'Aluno'}`)}>
                                <SelectTrigger className="w-[160px] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="aluno">Aluno</SelectItem>
                                  <SelectItem value="gestor-master">Gestor Master</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="domains" className="mt-0">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Body muted>Domínios autorizados para este cliente</Body>
                      <Button onClick={() => setAddDomainOpen(true)}>
                        <Plus size={15} className="mr-1.5" />
                        Adicionar domínio
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {client.domains.map((domain) => (
                        <div key={domain} className="flex items-center justify-between border border-border px-4 py-3">
                          <span className="font-mono text-sm">{domain}</span>
                          <Badge variant="outline">ativo</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <AcademyFooter />
      </div>

      {/* Dialog: Adicionar membro */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar membro</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="member-email">E-mail</Label>
              <Input id="member-email" placeholder="usuario@empresa.com.br" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="member-name">Nome</Label>
              <Input id="member-name" placeholder="Nome completo" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setAddMemberOpen(false); toast.success('Membro adicionado') }}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Adicionar domínio */}
      <Dialog open={addDomainOpen} onOpenChange={setAddDomainOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar domínio</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-domain">Domínio</Label>
              <Input id="new-domain" placeholder="empresa.com.br" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setAddDomainOpen(false); toast.success('Domínio adicionado') }}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
