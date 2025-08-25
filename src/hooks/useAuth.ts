import React, { useState, useEffect } from 'react';
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

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
        // Validate the token with the server using the API service
        const isValid = await apiService.validateToken();
        
        if (isValid) {
          const parsedAdminData = JSON.parse(storedAdminData);
          setAdminData(parsedAdminData);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear storage and redirect to login
          if (isBrowser) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
          }
          setAdminData(null);
          setIsAuthenticated(false);
          router.push('/dashboard/adminlogin');
        }
      } else {
        setIsAuthenticated(false);
        setAdminData(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setAdminData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string, admin: AdminData) => {
    if (isBrowser) {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(admin));
    }
    setAdminData(admin);
    setIsAuthenticated(true);
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

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push('/dashboard/adminlogin');
      return false;
    }
    return true;
  };

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