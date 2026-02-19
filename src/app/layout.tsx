import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import MobileGuard from "@/components/MobileGuard";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Attiéké Express CI - Commande d'attiéké en Côte d'Ivoire",
  description: "Application web moderne de commande d'attiéké frais et sec en Côte d'Ivoire.",
};

import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning>
        <Providers>
          <MobileGuard />
          <Navbar />
          <main>{children}</main>
        </Providers>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
