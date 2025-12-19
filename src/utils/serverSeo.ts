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
    // Skip API call during build to prevent timeouts
    if (process.env.NEXT_PHASE === "phase-production-build") {
      // Return fallback immediately during build
      return {
        title: fallbackConfig?.title || "Buy Commercial Property In Mumbai | Realtra Spaces",
        description: fallbackConfig?.description || "Buy commercial property in Mumbai's top business hubs. From compact offices to spacious workspaces, find the right place to build your future.",
        keywords: fallbackConfig?.keywords || "commercial property in mumbai for sale,commercial property in mumbai on rent,commercial buildings in Mumbai, Coworking spaces in Mumbai,commercial property price in mumbai, Office Spaces in Mumbai, office space in mumbai for rent, office space in mumbai for sale, shop on rent in mumbai",
        alternates: {
          canonical: fallbackConfig?.canonical || "https://realtraspaces.com/",
        },
        robots: fallbackConfig?.robots || 'index, follow',
        openGraph: {
          title: fallbackConfig?.openGraph?.title || fallbackConfig?.title || "Realtra Spaces | Premium Real Estate in Mumbai",
          description: fallbackConfig?.openGraph?.description || fallbackConfig?.description || "Discover the best real estate opportunities in Mumbai with Realtra Spaces. Explore properties, connect with developers, and invest smartly.",
          url: fallbackConfig?.openGraph?.url || fallbackConfig?.canonical || "https://realtraspaces.com/",
          type: fallbackConfig?.openGraph?.type || 'website',
          image: fallbackConfig?.openGraph?.image,
        },
        twitter: {
          card: fallbackConfig?.twitter?.card || 'summary_large_image',
          title: fallbackConfig?.twitter?.title || fallbackConfig?.title || "Realtra Spaces | Premium Real Estate in Mumbai",
          description: fallbackConfig?.twitter?.description || fallbackConfig?.description || "Discover the best real estate opportunities in Mumbai with Realtra Spaces. Explore properties, connect with developers, and invest smartly.",
          image: fallbackConfig?.twitter?.image,
        },
      };
    }

    // Fetch SEO data from API (only during runtime, not build)
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
    title: fallbackConfig?.title || "Buy Commercial Property In Mumbai | Realtra Spaces",
    description: fallbackConfig?.description || "Buy commercial property in Mumbai's top business hubs. From compact offices to spacious workspaces, find the right place to build your future.",
    keywords: fallbackConfig?.keywords || "commercial property in mumbai for sale,commercial property in mumbai on rent,commercial buildings in Mumbai, Coworking spaces in Mumbai,commercial property price in mumbai, Office Spaces in Mumbai, office space in mumbai for rent, office space in mumbai for sale, shop on rent in mumbai",
    alternates: {
      canonical: fallbackConfig?.canonical || "https://realtraspaces.com/",
    },
    robots: fallbackConfig?.robots || 'index, follow',
    openGraph: {
      title: fallbackConfig?.openGraph?.title || fallbackConfig?.title || "Realtra Spaces | Premium Real Estate in Mumbai",
      description: fallbackConfig?.openGraph?.description || fallbackConfig?.description || "Discover the best real estate opportunities in Mumbai with Realtra Spaces. Explore properties, connect with developers, and invest smartly.",
      url: fallbackConfig?.openGraph?.url || fallbackConfig?.canonical || "https://realtraspaces.com/",
      type: fallbackConfig?.openGraph?.type || 'website',
      image: fallbackConfig?.openGraph?.image,
    },
    twitter: {
      card: fallbackConfig?.twitter?.card || 'summary_large_image',
      title: fallbackConfig?.twitter?.title || fallbackConfig?.title || "Realtra Spaces | Premium Real Estate in Mumbai",
      description: fallbackConfig?.twitter?.description || fallbackConfig?.description || "Discover the best real estate opportunities in Mumbai with Realtra Spaces. Explore properties, connect with developers, and invest smartly.",
      image: fallbackConfig?.twitter?.image,
    },
  };
} 