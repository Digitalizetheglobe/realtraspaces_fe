import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Qwitcher_Grypen } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutWithConditionalHeader from "../components/LayoutWithConditionalHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const qwitcherGrypen = Qwitcher_Grypen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-qwitcher-grypen",
});

export const metadata: Metadata = {
  title: "Realtra Space",
  description: "Realtra Space",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
