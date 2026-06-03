'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/wayfare/JsonLd';
import { SITE_URL } from '@/lib/seo';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const pathname = usePathname();

  // Build structured data items: always start with Home, then append page items
  // The last item without href should point to the current page URL
  const structuredItems = [
    { name: 'Home', url: SITE_URL },
    ...items.map((item) => ({
      name: item.label,
      url: item.href
        ? `${SITE_URL}${item.href}`
        : `${SITE_URL}${pathname}`,
    })),
  ];

  return (
    <>
      <BreadcrumbJsonLd items={{ items: structuredItems }} />
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 py-4 overflow-x-auto" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center gap-1 hover:text-teal-400 transition-colors shrink-0">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight className="h-3 w-3 text-gray-600" />
            {item.href ? (
              <Link href={item.href} className="hover:text-teal-400 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-teal-400 font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
