import { getAllEdgeHotels } from '@/lib/edge-data';
import HotelDetailClient from './HotelDetailClient';

export function generateStaticParams() {
  const items = getAllEdgeHotels();
  return items.map((item) => ({ slug: item.slug }));
}

export default function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <HotelDetailClient params={params} />;
}
