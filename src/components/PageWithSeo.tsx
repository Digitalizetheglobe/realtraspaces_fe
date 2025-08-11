'use client';

import React from 'react';

interface PageWithSeoProps {
  page: string;
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackKeywords?: string;
  fallbackCanonical?: string;
  showLoadingState?: boolean;
}

export default function PageWithSeo({
  page,
  children,
  fallbackTitle = "Realtra Spaces | Premium Real Estate in Mumbai",
  fallbackDescription = "Discover the best real estate opportunities in Mumbai with Realtra Spaces. Explore properties, connect with developers, and invest smartly.",
  fallbackKeywords = "Real estate Mumbai, buy property Mumbai, real estate investment, residential plots, commercial properties",
  fallbackCanonical = "https://Realtraspaces.com/",
  showLoadingState = false
}: PageWithSeoProps) {
  // Temporarily disable SEO functionality to isolate the issue
  // const { seoData, isLoading, error } = useSeo(page);

  // Simple effect to update document metadata
  React.useEffect(() => {
    // Set basic metadata
    document.title = fallbackTitle;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', fallbackDescription);
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', fallbackKeywords);
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fallbackCanonical);
  }, [fallbackTitle, fallbackDescription, fallbackKeywords, fallbackCanonical]);

  return <>{children}</>;
} 