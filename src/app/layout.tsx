import type { Metadata } from "next";
import { Inter, Roboto_Mono, Qwitcher_Grypen } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutWithConditionalHeader from "../components/LayoutWithConditionalHeader";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const qwitcherGrypen = Qwitcher_Grypen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-qwitcher-grypen",
});

export const metadata: Metadata = {
  title: "Realtra Spaces",
  description: "Realtra Spaces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="d1FqYJpmpgp0wB8Gea14miRwXziTB4zpF4wkba-F7rc" />
        
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KRB9ZC8WSN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KRB9ZC8WSN');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${qwitcherGrypen.variable} antialiased`}
      >
        <LayoutWithConditionalHeader>{children}</LayoutWithConditionalHeader>
      </body>
    </html>
  );
}
