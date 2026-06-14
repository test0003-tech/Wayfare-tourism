import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Wayfare Admin",
  description: "Wayfare Travel admin dashboard for managing packages, destinations, hotels, flights, reviews, bookings, and more.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
