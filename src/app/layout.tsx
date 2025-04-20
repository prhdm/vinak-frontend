// src/app/layout.tsx
import '../app/globals.css'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import localFont from 'next/font/local';

const inter = Inter({ subsets: ["latin"] });

const sfProRounded = localFont({
  src: [
    {
      path: '../../public/fonts/sf-pro-rounded-regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sf-pro-rounded-medium.otf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-sf-pro-rounded',
});

export const metadata: Metadata = {
  title: "GHEDDIS | Album Pre-sale",
  description: "Pre-sale Website for GHEDDIS album by VINAK",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} ${sfProRounded.variable}`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}