import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salfate Abogados | Derecho Público y Administrativo",
  description:
    "Estudio jurídico especializado en Derecho Público, Derecho Administrativo, compras públicas, sumarios, litigación y asesoría integral en todo Chile.",
  keywords: [
    "abogados Chile",
    "derecho público",
    "derecho administrativo",
    "compras públicas",
    "Salfate Abogados",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${cormorant.variable} font-sans bg-graphite text-ink min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
