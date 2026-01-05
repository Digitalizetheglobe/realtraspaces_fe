import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '../utils/api';

interface AdminData {
  id: number;
  fullName: string;
  mobileNumber: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Global flag to prevent multiple simultaneous validations
let isValidating = false;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [skipValidation, setSkipValidation] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Only access localStorage if we're in a browser environment
      const token = isBrowser ? localStorage.getItem('adminToken') : null;
      const storedAdminData = isBrowser ? localStorage.getItem('adminData') : null;

      if (token && storedAdminData) {
        try {
          // Parse admin data first
          const parsedAdminData = JSON.parse(storedAdminData);
          
          // Set state immediately to prevent race conditions
          setAdminData(parsedAdminData);
          setIsAuthenticated(true);
          setIsLoading(false); // Set loading to false immediately
          
          // Only validate token if we haven't just logged in
          // Skip validation if skipValidation flag is set (just logged in) or if already validating
          if (!skipValidation && !isValidating) {
            isValidating = true;
            // Validate the token with the server in the background (non-blocking)
            // Don't clear state on validation failure - let it fail on actual API calls
            apiService.validateToken()
              .catch((error) => {
                // Only log the error, don't clear state
                // The token will be validated on actual API calls
                console.warn('Token validation failed (non-critical):', error);
              })
              .finally(() => {
                isValidating = false;
              });
          } else if (skipValidation) {
            // Reset the skip flag after first check
            setSkipValidation(false);
          }
        } catch (parseError) {
          // If parsing fails, clear invalid data
          if (isBrowser) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
          }
          setAdminData(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setAdminData(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Don't clear auth state on errors - might be temporary
      setIsLoading(false);
    }
  };

  const login = (token: string, admin: AdminData) => {
    if (isBrowser) {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(admin));
    }
    // Set state immediately to prevent race conditions
    setAdminData(admin);
    setIsAuthenticated(true);
    setIsLoading(false);
    // Set flag to skip validation on next checkAuthStatus call
    // This prevents unnecessary token validation right after login
    setSkipValidation(true);
  };

  const logout = () => {
    if (isBrowser) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
    }
    setAdminData(null);
    setIsAuthenticated(false);
    router.push('/dashboard/adminlogin');
  };

  const requireAuth = useCallback(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/dashboard/adminlogin');
      return false;
    }
    return true;
  }, [isLoading, isAuthenticated, router]);

  return {
    isAuthenticated,
    adminData,
    isLoading,
    login,
    logout,
    requireAuth,
    checkAuthStatus,
  };
}; 