import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

/* ============================================
   POLICES LOHARANOSOA
   ============================================ */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

/* ============================================
   MÉTADONNÉES
   ============================================ */

export const metadata: Metadata = {
  title: {
    default: "École Privée Loharanosoa — Gestion scolaire",
    template: "%s | Loharanosoa",
  },
  description:
    "Application de gestion complète pour l'École Privée Loharanosoa : élèves, professeurs, finances et documents.",
  keywords: [
    "Loharanosoa",
    "école privée",
    "gestion scolaire",
    "Madagascar",
    "élèves",
    "finances",
  ],
  authors: [{ name: "École Privée Loharanosoa" }],
  icons: {
    icon: "/favicon.ico",
  },
};

/* ============================================
   LAYOUT RACINE
   ============================================ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}