import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Header }  from "@/components/header";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Therapy Agent",
  description: "Your personal AI therapy companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>

        <Providers>
          {/* header */}
          <Header />
          {/* main */}
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
