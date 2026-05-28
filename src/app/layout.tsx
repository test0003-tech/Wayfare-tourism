import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wayfare — Premium Travel Experiences",
  description:
    "Book domestic and international tour packages, hotels, and flights with Wayfare. Kerala, Kashmir, Goa, Dubai, Maldives, Thailand & more. Honeymoon, adventure, family packages starting from ₹11,999.",
  keywords: [
    "Wayfare",
    "travel packages",
    "honeymoon packages",
    "Kerala tours",
    "Kashmir packages",
    "Goa holidays",
    "Dubai tours",
    "Maldives packages",
    "Thailand travel",
    "Singapore packages",
    "domestic tours India",
    "international tour packages",
    "hotel booking",
    "flight deals",
  ],
  authors: [{ name: "Wayfare Travel" }],
  icons: {
    icon: "/images/logo-wayfare.png",
  },
  openGraph: {
    title: "Wayfare — Premium Travel Experiences",
    description:
      "Book domestic and international tour packages, hotels, and flights. Honeymoon, adventure, family packages starting from ₹11,999.",
    type: "website",
    siteName: "Wayfare",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} antialiased bg-gray-950 text-gray-100`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
