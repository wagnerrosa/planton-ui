'use client'

import { use } from 'react'
import { ClientDetailScreen } from '@/screens/academy/admin/clients/ClientDetailScreen'

export default function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <ClientDetailScreen clientId={id} />
}
