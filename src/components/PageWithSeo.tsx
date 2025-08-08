'use client';

import React from 'react';
import { useSeo } from '../hooks/useSeo';
import { SeoMetaData } from '../utils/api';

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
  const { seoData, isLoading, error } = useSeo(page);

  // Update document metadata when SEO data is available or when loading is complete
  React.useEffect(() => {
    if (seoData) {
      updateDocumentMetadata(seoData, fallbackTitle, fallbackDescription, fallbackKeywords, fallbackCanonical);
    } else if (!isLoading && !error) {
      // Use fallback metadata when no SEO data is available
      updateDocumentMetadata({
        id: 0,
        page: page,
        metaTitle: fallbackTitle,
        metaDescription: fallbackDescription,
        metaKeywords: fallbackKeywords,
        canonicalUrl: fallbackCanonical,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, fallbackTitle, fallbackDescription, fallbackKeywords, fallbackCanonical);
    }
  }, [seoData, isLoading, error, page, fallbackTitle, fallbackDescription, fallbackKeywords, fallbackCanonical]);

  const updateDocumentMetadata = (
    seoData: SeoMetaData,
    fallbackTitle: string,
    fallbackDescription: string,
    fallbackKeywords: string,
    fallbackCanonical: string
  ) => {
    // Update document title
    document.title = seoData.metaTitle || fallbackTitle;
    
    // Update meta description
    updateMetaTag('description', seoData.metaDescription || fallbackDescription);
    
    // Update meta keywords
    updateMetaTag('keywords', seoData.metaKeywords || fallbackKeywords);
    
    // Update canonical URL
    updateCanonicalLink(seoData.canonicalUrl || fallbackCanonical);
    
    // Update Open Graph tags
    updateOpenGraphTags(seoData, fallbackTitle, fallbackDescription, fallbackCanonical);
    
    // Update Twitter Card tags
    updateTwitterCardTags(seoData, fallbackTitle, fallbackDescription);
  };



  const updateCanonicalLink = (href: string) => {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', href);
  };

  const updateOpenGraphTags = (
    seoData: SeoMetaData,
    fallbackTitle: string,
    fallbackDescription: string,
    fallbackCanonical: string
  ) => {
    const title = seoData.metaTitle || fallbackTitle;
    const description = seoData.metaDescription || fallbackDescription;
    const canonical = seoData.canonicalUrl || fallbackCanonical;

    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:url', canonical, 'property');
    updateMetaTag('og:type', 'website', 'property');
  };

  const updateTwitterCardTags = (
    seoData: SeoMetaData,
    fallbackTitle: string,
    fallbackDescription: string
  ) => {
    const title = seoData.metaTitle || fallbackTitle;
    const description = seoData.metaDescription || fallbackDescription;

    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
  };

  const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
    let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, name);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', content);
  };

  // Show loading state if requested and data is loading
  if (showLoadingState && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error and showLoadingState is true
  if (showLoadingState && error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading page data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 