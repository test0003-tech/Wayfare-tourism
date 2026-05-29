import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/wayfare/Navbar";
import Footer from "@/components/wayfare/Footer";
import ChatBot from "@/components/wayfare/ChatBot";
import WishlistDrawer from "@/components/wayfare/WishlistDrawer";
import BackToTop from "@/components/wayfare/BackToTop";

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
    icon: "/images/logo-wayfare-new.png",
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
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
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
