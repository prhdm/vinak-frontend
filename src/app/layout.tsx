// src/app/layout.tsx
import '../app/globals.css'
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://gheddis.vinak.com'),
  title: "GHEDDIS Album | VINAK Official",
  description: "پیش‌فروش انحصاری آلبوم GHEDDIS از VINAK. دسترسی به آلبوم قبل از انتشار رسمی و پشتیبانی از روش‌های پرداخت بین‌المللی.",
  keywords: ["GHEDDIS", "VINAK", "آلبوم موسیقی", "پیش‌فروش انحصاری", "موسیقی ایرانی", "آلبوم جدید"],
  authors: [{ name: "VINAK" }],
  openGraph: {
    title: "GHEDDIS Album | VINAK Official",
    description: "پیش‌فروش انحصاری آلبوم GHEDDIS از VINAK. دسترسی به آلبوم قبل از انتشار رسمی.",
    type: "website",
    locale: "fa_IR",
    siteName: "GHEDDIS Album",
    images: [
      {
        url: "/album-cover.png",
        width: 1200,
        height: 630,
        alt: "GHEDDIS Album Artwork",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GHEDDIS Album | VINAK Official",
    description: "پیش‌فروش انحصاری آلبوم GHEDDIS از VINAK. دسترسی به آلبوم قبل از انتشار رسمی.",
    images: ["/album-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#b62c2c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}