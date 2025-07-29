'use client';

import { useEffect } from 'react';
import { useSeo } from '../hooks/useSeo';
import { SeoMetaData } from '../utils/api';

interface DynamicSeoHeadProps {
  page: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackKeywords?: string;
  fallbackCanonical?: string;
}

export default function DynamicSeoHead({ 
  page,
  fallbackTitle = "Realtra Spaces | Premium Real Estate in Pune",
  fallbackDescription = "Discover the best real estate opportunities in Pune with Realtra Spaces. Explore properties, connect with developers, and invest smartly.",
  fallbackKeywords = "Real estate Pune, buy property Pune, real estate investment, residential plots, commercial properties",
  fallbackCanonical = "https://Realtraspaces.com/"
}: DynamicSeoHeadProps) {
  const { seoData, isLoading, error } = useSeo(page);

  useEffect(() => {
    if (seoData) {
      // Update document title
      document.title = seoData.metaTitle || fallbackTitle;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', seoData.metaDescription || fallbackDescription);
      
      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', seoData.metaKeywords || fallbackKeywords);
      
      // Update canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', seoData.canonicalUrl || fallbackCanonical);
      
      // Update Open Graph tags
      updateOpenGraphTags(seoData, fallbackTitle, fallbackDescription, fallbackCanonical);
      
      // Update Twitter Card tags
      updateTwitterCardTags(seoData, fallbackTitle, fallbackDescription);
    }
  }, [seoData, fallbackTitle, fallbackDescription, fallbackKeywords, fallbackCanonical]);

  const updateOpenGraphTags = (
    seoData: SeoMetaData, 
    fallbackTitle: string, 
    fallbackDescription: string, 
    fallbackCanonical: string
  ) => {
    const title = seoData.metaTitle || fallbackTitle;
    const description = seoData.metaDescription || fallbackDescription;
    const canonical = seoData.canonicalUrl || fallbackCanonical;

    // Update or create og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // Update or create og:description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);

    // Update or create og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonical);
  };

  const updateTwitterCardTags = (
    seoData: SeoMetaData, 
    fallbackTitle: string, 
    fallbackDescription: string
  ) => {
    const title = seoData.metaTitle || fallbackTitle;
    const description = seoData.metaDescription || fallbackDescription;

    // Update or create twitter:title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', title);

    // Update or create twitter:description
    let twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.setAttribute('content', description);
  };

  // This component doesn't render anything visible
  return null;
} 