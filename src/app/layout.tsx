import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/components/common/Providers";
import CursorGlow from "@/components/common/CursorGlow";
import FloatingHelp from "@/components/common/FloatingHelp";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HelpMate | Premium On-Demand Services",
  description: "Experience ultra-premium home services on-demand. Book verified professionals, transparent pricing, and instant tracking in 30 seconds. Inspired by Apple & Airbnb.",
  keywords: ["home service", "AC repair", "luxury cleaning", "electrician", "plumber", "premium salon", "painting"],
  openGraph: {
    title: "HelpMate | Premium On-Demand Services",
    description: "Experience ultra-premium home services on-demand. Book verified professionals, transparent pricing, and instant tracking in 30 seconds.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col selection:bg-accent-lux selection:text-white">
        <Providers>
          <CursorGlow />
          {children}
          <FloatingHelp />
        </Providers>
      </body>
    </html>
  );
}
