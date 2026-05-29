'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
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
  );
}
