import { fetchSeoMetaData } from './api';

export interface MetadataConfig {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    type?: string;
    image?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

export async function generateMetadata(page: string, fallbackConfig?: MetadataConfig) {
  try {
    // Fetch SEO data from API
    const seoData = await fetchSeoMetaData(page);
    
    if (seoData) {
      return {
        title: seoData.metaTitle,
        description: seoData.metaDescription,
        keywords: seoData.metaKeywords,
        alternates: {
          canonical: seoData.canonicalUrl,
        },
        robots: 'index, follow',
        openGraph: {
          title: seoData.metaTitle,
          description: seoData.metaDescription,
          url: seoData.canonicalUrl,
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: seoData.metaTitle,
          description: seoData.metaDescription,
        },
      };
    }
  } catch (error) {
    console.error(`Error generating metadata for page ${page}:`, error);
  }

  // Return fallback metadata if API fails or no data
  return {
    title: fallbackConfig?.title || "Realtra Spaces | Premium Real Estate in Pune",
    description: fallbackConfig?.description || "Discover the best real estate opportunities in Pune with Realtra Spaces. Explore properties, connect with developers, and invest smartly.",
    keywords: fallbackConfig?.keywords || "Real estate Pune, buy property Pune, real estate investment, residential plots, commercial properties",
    alternates: {
      canonical: fallbackConfig?.canonical || "https://Realtraspaces.com/",
    },
    robots: fallbackConfig?.robots || 'index, follow',
    openGraph: {
      title: fallbackConfig?.openGraph?.title || fallbackConfig?.title || "Realtra Spaces | Premium Real Estate in Pune",
      description: fallbackConfig?.openGraph?.description || fallbackConfig?.description || "Discover the best real estate opportunities in Pune with Realtra Spaces. Explore properties, connect with developers, and invest smartly.",
      url: fallbackConfig?.openGraph?.url || fallbackConfig?.canonical || "https://Realtraspaces.com/",
      type: fallbackConfig?.openGraph?.type || 'website',
      image: fallbackConfig?.openGraph?.image,
    },
    twitter: {
      card: fallbackConfig?.twitter?.card || 'summary_large_image',
      title: fallbackConfig?.twitter?.title || fallbackConfig?.title || "Realtra Spaces | Premium Real Estate in Pune",
      description: fallbackConfig?.twitter?.description || fallbackConfig?.description || "Discover the best real estate opportunities in Pune with Realtra Spaces. Explore properties, connect with developers, and invest smartly.",
      image: fallbackConfig?.twitter?.image,
    },
  };
} 