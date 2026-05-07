import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cooper = localFont({
  src: "./fonts/CooperLtBT-Regular.ttf",
  variable: "--font-cooper",
});

export const metadata: Metadata = {
  title: "Sygna Brands | Gerador de Identidade Visual IA",
  description: "Crie a identidade visual da sua marca em segundos usando inteligência artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${cooper.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
