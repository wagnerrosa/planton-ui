import { ContentScreen } from '@/screens/academy/content/ContentScreen'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ContentPage({ params }: Props) {
  const { id } = await params
  return <ContentScreen contentId={id} />
}
