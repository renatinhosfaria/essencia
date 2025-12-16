import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Essencia - Projeto de Transformação",
  description: "Apresentação do projeto Essencia para o Colégio Essência Feliz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} antialiased overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
