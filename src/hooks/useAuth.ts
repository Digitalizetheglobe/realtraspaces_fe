import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('adminToken');
      const storedAdminData = localStorage.getItem('adminData');

      if (token && storedAdminData) {
        const parsedAdminData = JSON.parse(storedAdminData);
        setAdminData(parsedAdminData);
        setIsAuthenticated(true);
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
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(admin));
    setAdminData(admin);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
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