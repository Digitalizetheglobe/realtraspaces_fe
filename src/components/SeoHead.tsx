import React from "react";
import { SeoMetaData } from "../utils/api";

interface SeoHeadProps {
  seoData?: SeoMetaData | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackKeywords?: string;
  fallbackCanonical?: string;
}

export default function SeoHead({ 
  seoData, 
  fallbackTitle = "Realtra Spaces | Premium Real Estate in Mumbai",
  fallbackDescription = "Discover the best real estate opportunities in Mumbai with Realtra Spaces. Explore properties, connect with developers, and invest smartly.",
  fallbackKeywords = "Real estate Mumbai, buy property Mumbai, real estate investment, residential plots, commercial properties",
  fallbackCanonical = "https://Realtraspaces.com/"
}: SeoHeadProps) {
  // Use API data if available, otherwise use fallback values
  const title = seoData?.metaTitle || fallbackTitle;
  const description = seoData?.metaDescription || fallbackDescription;
  const keywords = seoData?.metaKeywords || fallbackKeywords;
  const canonical = seoData?.canonicalUrl || fallbackCanonical;

  return (
    <>
      {/* Dynamic SEO Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Google Search Console */}
      <meta name="google-site-verification" content="d1FqYJpmpgp0wB8Gea14miRwXziTB4zpF4wkba-F7rc" />
      
      {/* Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XND4426E2W"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XND4426E2W');
          `,
        }}
      />
    </>
  );
} 