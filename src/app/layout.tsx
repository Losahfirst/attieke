import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import MobileGuard from "@/components/MobileGuard";

export const metadata: Metadata = {
  title: "Attiéké Express CI - Commande d'attiéké en Côte d'Ivoire",
  description: "Application web moderne de commande d'attiéké frais et sec en Côte d'Ivoire.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <MobileGuard />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
