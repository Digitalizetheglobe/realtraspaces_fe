'use client';

import React from 'react';
import { useSeo } from '../hooks/useSeo';

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
  fallbackCanonical = "https://realtraspaces.com/",
  showLoadingState = false
}: PageWithSeoProps) {
  const { seoData, isLoading, error } = useSeo(page);

  // Use dynamic SEO data or fallback values
  const title = seoData?.metaTitle || fallbackTitle;
  const description = seoData?.metaDescription || fallbackDescription;
  const keywords = seoData?.metaKeywords || fallbackKeywords;
  const canonical = seoData?.canonicalUrl || fallbackCanonical;

  // Effect to update document metadata
  React.useEffect(() => {
    // Set basic metadata
    document.title = title;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // Update Open Graph tags
    const updateMetaTag = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:url', canonical);
    updateMetaTag('og:type', 'website');

    // Update Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    updateTwitterTag('twitter:card', 'summary_large_image');
    updateTwitterTag('twitter:title', title);
    updateTwitterTag('twitter:description', description);

  }, [title, description, keywords, canonical]);

  // Show loading state if requested and data is loading
  if (showLoadingState && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return <>{children}</>;
} 