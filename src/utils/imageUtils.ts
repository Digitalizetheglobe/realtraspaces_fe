// Utility functions for handling blog images

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.realtraspaces.com';

/**
 * Get the full URL for a blog image
 * @param filename - The filename of the image stored in the database
 * @returns The complete URL to access the image
 */
export const getBlogImageUrl = (filename: string): string => {
  if (!filename) return '';
  
  // If it's already a full URL, return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Return the URL using the blogImages static route
  return `${API_BASE_URL}/blogImages/${filename}`;
};

/**
 * Get the full URL for a blog image using the API route
 * @param filename - The filename of the image stored in the database
 * @returns The complete URL to access the image via API
 */
export const getBlogImageApiUrl = (filename: string): string => {
  if (!filename) return '';
  
  // If it's already a full URL, return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Return the URL using the API route
  return `${API_BASE_URL}/api/blogs/image/${filename}`;
};

/**
 * Get multiple blog image URLs
 * @param filenames - Array of image filenames
 * @returns Array of complete URLs
 */
export const getBlogImageUrls = (filenames: string[]): string[] => {
  if (!Array.isArray(filenames)) return [];
  return filenames.map(filename => getBlogImageUrl(filename));
};

/**
 * Get multiple blog image URLs using API route
 * @param filenames - Array of image filenames
 * @returns Array of complete URLs
 */
export const getBlogImageApiUrls = (filenames: string[]): string[] => {
  if (!Array.isArray(filenames)) return [];
  return filenames.map(filename => getBlogImageApiUrl(filename));
};

// Developer image utilities
export const getDeveloperImageUrl = (filename: string): string => {
  if (!filename) return '';
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  return `${API_BASE_URL}/developers/${filename}`;
};

export const getDeveloperImageUrls = (filenames: string[]): string[] => {
  if (!Array.isArray(filenames)) return [];
  return filenames.map(filename => getDeveloperImageUrl(filename));
};

// Team image utilities
export const getTeamImageUrl = (filename: string): string => {
  if (!filename) return '';
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  return `${API_BASE_URL}/team/${filename}`;
};

// Generic image URL utility
export const getImageUrl = (filename: string, type: 'blog' | 'developer' | 'team' = 'blog'): string => {
  if (!filename) return '';
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  switch (type) {
    case 'developer':
      return getDeveloperImageUrl(filename);
    case 'team':
      return getTeamImageUrl(filename);
    default:
      return getBlogImageUrl(filename);
  }
};
