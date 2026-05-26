import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Sans, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Toaster } from "@/components/shadcn/sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Planton UI",
  description: "Token, component and pattern reference for all Planton products.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Planton UI - Design System",
    description: "Token, component and pattern reference for all Planton products.",
    url: "https://design.planton.eco.br",
    siteName: "Planton UI",
    images: [
      {
        url: "https://design.planton.eco.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Planton UI Design System",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planton UI - Design System",
    description: "Token, component and pattern reference for all Planton products.",
    images: ["https://design.planton.eco.br/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/logos_planton/planton_square_inside.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${instrumentSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
        <div id="portal" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-YJ5N58SXSY" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YJ5N58SXSY');
        `}</Script>
      </body>
    </html>
  );
}
