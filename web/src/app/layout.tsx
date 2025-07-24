import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./index.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#f08a5d",
};

export const metadata: Metadata = {
  title: {
    default: "Opportunity Cost – See Prices in Bitcoin Instantly",
    template: "%s | Opportunity Cost",
  },
  description:
    "Opportunity Cost is a browser extension for Chrome and Firefox that instantly converts USD prices to Bitcoin (satoshis) as you browse. Dual display, privacy-first, and open source.",
  keywords: [
    "Bitcoin",
    "Satoshis",
    "Browser Extension",
    "USD to BTC",
    "Fiat Conversion",
    "Chrome Extension",
    "Firefox Add-on",
    "Opportunity Cost",
    "Crypto",
    "BTC Prices",
    "Bitcoin Standard",
  ],
  authors: [{ name: "TFTC", url: "https://tftc.io" }],
  creator: "TFTC",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Opportunity Cost – See Prices in Bitcoin Instantly",
    description:
      "Convert USD prices to Bitcoin (satoshis) as you browse. Dual display, privacy-first, and open source.",
    siteName: "Opportunity Cost",
    images: [
      {
        url: "/images/og-image_v1.png",
        width: 1200,
        height: 630,
        alt: "Opportunity Cost Extension – See Prices in Bitcoin",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Opportunity Cost – See Prices in Bitcoin Instantly",
    description:
      "Convert USD prices to Bitcoin (satoshis) as you browse. Dual display, privacy-first, and open source.",
    images: [
      {
        url: "/images/og-image_v1.png",
        alt: "Opportunity Cost Extension – See Prices in Bitcoin",
      },
    ],
    creator: "@tftc21",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
