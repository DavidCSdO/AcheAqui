import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "AcheAqui — Inteligência de Prospecção B2B em Tempo Real",
  description:
    "Encontre telefones diretos, e-mails validados, WhatsApp e geolocalização de empresas no Brasil em segundos. A plataforma de lead intelligence para times que precisam vender mais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${ibmPlexMono.variable} ${playfair.variable} antialiased scroll-smooth`}
    >
      <body>{children}</body>
    </html>
  );
}
