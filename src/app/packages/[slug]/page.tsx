import { getAllEdgePackages } from '@/lib/edge-data';
import PackageDetailClient from './PackageDetailClient';

export function generateStaticParams() {
  const items = getAllEdgePackages();
  return items.map((item) => ({ slug: item.slug }));
}

export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <PackageDetailClient params={params} />;
}
