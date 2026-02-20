import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import { Providers } from "@/components/Providers";
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Attiéké Express CI - Commande d'attiéké en Côte d'Ivoire",
  description: "Application web moderne de commande d'attiéké frais et sec en Côte d'Ivoire.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: '#D4AF37',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Attiéké Express CI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning>
        <Providers>
          <SplashScreen />
          <Navbar />
          <main className="main-content">{children}</main>
          <BottomNav />
        </Providers>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
