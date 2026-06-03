import { getAllEdgeDestinations } from '@/lib/edge-data';
import DestinationDetailClient from './DestinationDetailClient';

export function generateStaticParams() {
  const items = getAllEdgeDestinations();
  return items.map((item) => ({ slug: item.slug }));
}

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <DestinationDetailClient params={params} />;
}
