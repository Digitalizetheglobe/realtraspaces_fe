# Dynamic SEO Implementation Guide

This implementation provides a comprehensive solution for handling dynamic SEO metadata from the API at `https://api.realtraspaces.com/api/seo/meta-tags/{page}`.

## Overview

The system consists of several components that work together to provide both server-side and client-side SEO metadata handling:

1. **API Utilities** (`src/utils/api.ts`) - Handles API calls
2. **Server-side SEO** (`src/utils/serverSeo.ts`) - Generates metadata for Next.js pages
3. **Custom Hook** (`src/hooks/useSeo.ts`) - Manages SEO data state
4. **Page Component** (`src/components/PageWithSeo.tsx`) - Wraps pages with dynamic SEO
5. **SEO Head Component** (`src/components/SeoHead.tsx`) - Renders static meta tags

## API Response Format

The API returns data in this format:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "page": "home",
    "metaTitle": "",
    "metaDescription": "Description for home page",
    "metaKeywords": "real estate, property, home",
    "canonicalUrl": "https://example.com",
    "createdAt": "2025-07-29T09:32:34.000Z",
    "updatedAt": "2025-07-29T09:32:34.000Z"
  }
}
```

## Usage Examples

### 1. Basic Page Implementation

```tsx
// src/app/page.tsx
import { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "../utils/serverSeo";
import PageWithSeo from "../components/PageWithSeo";

// Server-side metadata generation
export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("home");
}

export default function Home() {
  return (
    <PageWithSeo page="home">
      <main>
        {/* Your page content */}
      </main>
    </PageWithSeo>
  );
}
```

### 2. Page with Custom Fallbacks

```tsx
export default function About() {
  return (
    <PageWithSeo 
      page="about"
      fallbackTitle="About Us | Realtra Spaces"
      fallbackDescription="Learn more about Realtra Spaces and our mission"
      fallbackKeywords="about, company, real estate"
      fallbackCanonical="https://realtraspaces.com/about"
    >
      <main>
        {/* Your page content */}
      </main>
    </PageWithSeo>
  );
}
```

### 3. Page with Loading State

```tsx
export default function Properties() {
  return (
    <PageWithSeo 
      page="properties"
      showLoadingState={true}
    >
      <main>
        {/* Your page content */}
      </main>
    </PageWithSeo>
  );
}
```

### 4. Using the Hook Directly

```tsx
'use client';

import { useSeo } from '../hooks/useSeo';

export default function CustomPage() {
  const { seoData, isLoading, error, refetch } = useSeo('custom-page');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{seoData?.metaTitle}</h1>
      <p>{seoData?.metaDescription}</p>
    </div>
  );
}
```

## Components

### PageWithSeo Component

A higher-order component that wraps pages and automatically handles SEO metadata updates.

**Props:**
- `page` (string, required) - The page identifier for the API
- `children` (ReactNode, required) - The page content
- `fallbackTitle` (string, optional) - Fallback title if API fails
- `fallbackDescription` (string, optional) - Fallback description if API fails
- `fallbackKeywords` (string, optional) - Fallback keywords if API fails
- `fallbackCanonical` (string, optional) - Fallback canonical URL if API fails
- `showLoadingState` (boolean, optional) - Whether to show loading/error states

### useSeo Hook

A custom hook that manages SEO data fetching and state.

**Returns:**
- `seoData` - The SEO metadata from the API
- `isLoading` - Loading state
- `error` - Error message if any
- `refetch` - Function to refetch the data

## Server-Side vs Client-Side

### Server-Side (Recommended)
- Uses Next.js `generateMetadata` function
- Better for SEO as metadata is available during initial page load
- Faster page loads
- Better search engine crawling

### Client-Side
- Updates metadata after page loads
- Useful for dynamic content
- Fallback for server-side failures
- Good for user experience

## Error Handling

The system includes comprehensive error handling:

1. **API Failures** - Falls back to default metadata
2. **Network Issues** - Graceful degradation
3. **Invalid Data** - Uses fallback values
4. **Loading States** - Optional loading indicators

## SEO Tags Generated

The system automatically generates and updates:

- **Basic Meta Tags:**
  - `<title>`
  - `<meta name="description">`
  - `<meta name="keywords">`
  - `<link rel="canonical">`

- **Open Graph Tags:**
  - `og:title`
  - `og:description`
  - `og:url`
  - `og:type`

- **Twitter Card Tags:**
  - `twitter:card`
  - `twitter:title`
  - `twitter:description`

## Configuration

### API Base URL
Update the API base URL in `src/utils/api.ts`:
```typescript
const API_BASE_URL = 'https://api.realtraspaces.com/api';
```

### Default Fallback Values
Update default values in components as needed:
```typescript
fallbackTitle = "Realtra Spaces | Premium Real Estate in Mumbai"
fallbackDescription = "Discover the best real estate opportunities..."
```

## Best Practices

1. **Always use server-side metadata** for important pages
2. **Provide meaningful fallbacks** for all metadata fields
3. **Test with different API responses** to ensure robustness
4. **Monitor API performance** and implement caching if needed
5. **Use descriptive page identifiers** for better organization

## Troubleshooting

### Common Issues

1. **Metadata not updating** - Check if the page identifier matches the API
2. **API errors** - Verify the API endpoint and response format
3. **Client-side only updates** - Ensure server-side metadata is implemented
4. **Duplicate meta tags** - The system handles this automatically

### Debug Mode

Add console logs to debug issues:
```typescript
const { seoData, isLoading, error } = useSeo('page-name');
console.log('SEO Data:', seoData);
console.log('Loading:', isLoading);
console.log('Error:', error);
``` 