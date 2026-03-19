import { TrailScreen } from '@/screens/academy/trail/TrailScreen'

type Props = {
  params: Promise<{ id: string }>
}

export default async function TrailPage({ params }: Props) {
  const { id } = await params
  return <TrailScreen trailId={id} />
}
