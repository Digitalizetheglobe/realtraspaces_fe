import { useState, useEffect } from 'react';
import { fetchSeoMetaData, SeoMetaData } from '../utils/api';

export const useSeo = (page: string) => {
  const [seoData, setSeoData] = useState<SeoMetaData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeoData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchSeoMetaData(page);
        if (data) {
          setSeoData(data);
        } else {
          setError('Failed to load SEO data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (page) {
      loadSeoData();
    }
  }, [page]);

  return {
    seoData,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      fetchSeoMetaData(page).then(data => {
        setSeoData(data);
        setIsLoading(false);
      }).catch(err => {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      });
    }
  };
}; 