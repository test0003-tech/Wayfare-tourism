import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/wayfare/Navbar";
import Footer from "@/components/wayfare/Footer";
import ChatBot from "@/components/wayfare/ChatBot";
import WishlistDrawer from "@/components/wayfare/WishlistDrawer";
import BackToTop from "@/components/wayfare/BackToTop";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/wayfare/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  LOCALE,
  GEO_REGION,
  GEO_PLACENAME,
  GEO_POSITION,
  ICBM,
  KEYWORDS,
} from "@/lib/seo";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Comprehensive root metadata — the foundation for ALL page SEO
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wayfare — Premium Travel Experiences | Tour Packages, Hotels & Flights",
    template: "%s | Wayfare Travel",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    ...KEYWORDS.brand,
    ...KEYWORDS.services,
    ...KEYWORDS.categories,
    ...KEYWORDS.domestic.slice(0, 8),
    ...KEYWORDS.international.slice(0, 6),
    ...KEYWORDS.priceBooking.slice(0, 5),
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: "Wayfare Travel",
  classification: "Travel & Tourism",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "hi-IN": "/?lang=hi",
      "ta-IN": "/?lang=ta",
      "te-IN": "/?lang=te",
    },
  },
  icons: {
    icon: [
      { url: "/images/logo-wayfare-new.png", sizes: "32x32" },
      { url: "/images/logo-wayfare-new.png", sizes: "192x192" },
      { url: "/images/logo-wayfare-new.png", sizes: "512x512" },
    ],
    apple: [
      { url: "/images/logo-wayfare-new.png", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Wayfare — Premium Travel Experiences | Tour Packages, Hotels & Flights",
    description: SITE_DESCRIPTION,
    type: "website",
    locale: LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Wayfare — Premium Travel Experiences",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wayfare — Premium Travel Experiences",
    description: "Book domestic and international tour packages, hotels, and flights. Honeymoon, adventure, family packages starting from ₹11,999.",
    images: [DEFAULT_OG_IMAGE],
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": GEO_REGION,
    "geo.placename": GEO_PLACENAME,
    "geo.position": GEO_POSITION,
    "ICBM": ICBM,
    "theme-color": "#0d9488",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
    "format-detection": "telephone=yes",
    "revisit-after": "3 days",
    "language": "English",
    "rating": "general",
    "distribution": "global",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning className="dark">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for images */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-gray-950 text-gray-100`}
      >
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1" role="main">{children}</main>
          <Footer />
        </div>
        <ChatBot />
        <WishlistDrawer />
        <BackToTop />
        <Toaster />
      </body>
    </html>
  );
}
