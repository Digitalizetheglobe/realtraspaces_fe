"use client";
import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Briefcase, Shield, Edit, 
  Home, Heart, Search, LogOut, GitCompare, 
  Building
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import PageWithSeo from "../../components/PageWithSeo";

type UserProfile = {
  fullName: string;
  email: string;
  mobileNumber: string;
  location: string;
  company: string;
  createdAt: string;
  updatedAt: string;
};

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState('profile');
  const [savedPropertiesCount, setSavedPropertiesCount] = useState(0);
  const [comparedPropertiesCount, setComparedPropertiesCount] = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchSavedPropertiesCount = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/webusers/saved-properties?page=1&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSavedPropertiesCount(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching saved properties count:", error);
    }
  };

  const fetchComparedPropertiesCount = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:8000/api/webusers/compare/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComparedPropertiesCount(data.data?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching compared properties count:", error);
    } finally {
      setLoadingCounts(false);
    }
  };

  // Helper to fetch all saved property IDs
  const fetchAllSavedPropertyIds = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return [];
    let ids: string[] = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const response = await fetch(`http://localhost:8000/api/webusers/saved-properties?page=${page}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) break;
      const data = await response.json();
      const properties = data.data || [];
      ids.push(...properties.map((p: any) => p.propertyId));
      hasMore = data.pagination && data.pagination.total > page * 50;
      page++;
    }
    return ids;
  };

  // Clear all saved and compared properties
  const handleClearAll = async () => {
    setClearing(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Not authenticated');
      setClearing(false);
      return;
    }
    try {
      // 1. Clear compared properties
      await fetch('http://localhost:8000/api/webusers/compare/clear', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      // 2. Clear all saved properties (loop)
      const ids = await fetchAllSavedPropertyIds();
      await Promise.all(
        ids.map(id =>
          fetch(`http://localhost:8000/api/webusers/saved-properties/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      toast.success('All saved and compared properties cleared!');
      // Refresh counts
      await Promise.all([
        fetchSavedPropertiesCount(),
        fetchComparedPropertiesCount()
      ]);
    } catch (err) {
      toast.error('Failed to clear all properties');
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchSavedPropertiesCount(),
        fetchComparedPropertiesCount()
      ]);
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:8000/api/webusers/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data.data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching profile');
        toast.error(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    toast.success('Logged out successfully');
    router.push('/signin');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigateTo = (route: string) => {
    setActiveRoute(route);
    if (route !== 'profile') {
      router.push(`/${route}`);
    }
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          backgroundColor: '#F1F1F4',
          fontFamily: 'Raleway, sans-serif'
        }}
      >
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center mt-4" style={{ color: '#6E6E73' }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          backgroundColor: '#F1F1F4',
          fontFamily: 'Raleway, sans-serif'
        }}
      >
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-red-500" />
            <h2 className="text-2xl font-bold mt-4" style={{ color: '#1A1A1A' }}>Error Loading Profile</h2>
            <p className="mt-2" style={{ color: '#6E6E73' }}>{error}</p>
            <button
              onClick={() => router.push('/signin')}
              className="cursor-pointer mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageWithSeo page="profile-page">
    <div 
      className="min-h-screen flex"
      style={{ 
        backgroundColor: '#F1F1F4',
        fontFamily: 'Raleway, sans-serif'
      }}
    >
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 border-b border-[#E5E5E7]">
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Realtraspace</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => router.push('/compareproperties')}
            className={` cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeRoute === 'compare-properties' ? 'bg-blue-50 text-blue-600' : 'hover:bg-[#F1F1F4]'}`}
          >
            <GitCompare className="h-5 w-5" />
            <span className="text-black">Compare Properties</span>
          </button>
          
          <button
            onClick={() => router.push('/properties')}
            className={`cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeRoute === 'explore' ? 'bg-blue-50 text-blue-600' : 'hover:bg-[#F1F1F4]'}`}
          >
            <Search className="h-5 w-5" />
            <span className="text-black">Explore More</span>
          </button>
          
          <button
            onClick={() => router.push('/profile-page')}
            className={`cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeRoute === 'profile-page' ? 'bg-blue-50 text-blue-600' : 'hover:bg-[#F1F1F4]'}`}
          >
            <User className="h-5 w-5" />
            <span className="text-black">Profile</span>
          </button>
          
          <button
            onClick={() => router.push('/SavedProperties')}
            className={`cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeRoute === 'saved-properties' ? 'bg-blue-50 text-blue-600' : 'hover:bg-[#F1F1F4]'}`}
          >
            <Heart className="h-5 w-5" />
            <span className="text-black">Saved Properties</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-8"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#1A1A1A' }}>My Profile</h1>
           
          </div>
          
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
              {/* Left Column - Basic Info */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-32 h-32 bg-[#F1F1F4] rounded-full flex items-center justify-center mb-4">
                    <User className="h-16 w-16 text-[#6E6E73]" />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                    {profile?.fullName || 'No Name'}
                  </h2>
                  <p className="text-[#6E6E73]">{profile?.company || 'No Company'}</p>
                </div>
                
                <div className="space-y-4">
                  {/* <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-[#6E6E73]" />
                    <span style={{ color: '#1A1A1A' }}>{profile?.email || 'No Email'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-[#6E6E73]" />
                    <span style={{ color: '#1A1A1A' }}>{profile?.mobileNumber || 'No Mobile'}</span>
                  </div> */}
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-[#6E6E73]" />
                    <span style={{ color: '#1A1A1A' }}>{profile?.location || 'No Location'}</span>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Additional Info */}
              <div className="md:col-span-2">
                <div className="bg-[#F1F1F4] rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#1A1A1A' }}>
                    Account Information
 {/* <button 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              onClick={() => setActiveRoute('edit-profile')}
            >
              <Edit className="h-5 w-5" />
              <span>Edit Profile</span>
            </button> */}
                  </h3>
                  
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm" style={{ color: '#6E6E73' }}>Full Name</p>
                      <p style={{ color: '#1A1A1A' }}>
                        {profile?.fullName || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm" style={{ color: '#6E6E73' }}>Mobile Number</p>
                      <p style={{ color: '#1A1A1A' }}>
                        {profile?.mobileNumber || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm" style={{ color: '#6E6E73' }}>Account Status</p>
                      <div className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <span style={{ color: '#1A1A1A' }}>Active</span>
                      </div>
                      
                    </div>
                    
                    <div>
                      <p className="text-sm" style={{ color: '#6E6E73' }}>Verification</p>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-blue-500 mr-2" />
                        <span style={{ color: '#1A1A1A' }}>Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Sections */}
                <div className="space-y-6">
             
                 <div className='flex flex-col md:flex-row gap-4'>  
                 <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#1A1A1A' }}>
                      Saved Properties
                    </h3>
                    <div className="cursor-pointer bg-white border border-[#E5E5E7] rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
                         onClick={() => router.push('/SavedProperties')}>
                      <div className="text-3xl font-bold text-black mb-2">
                        {loadingCounts ? '...' : savedPropertiesCount}
                      </div>
                      <p className="text-[#6E6E73] text-sm">
                        Properties saved to your list
                      </p>
                      <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                        View all saved properties
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#1A1A1A' }}>
                      Compare Properties
                    </h3>
                    <div className="cursor-pointer bg-white border border-[#E5E5E7] rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
                         onClick={() => router.push('/compareproperties')}>
                      <div className="text-3xl font-bold text-black mb-2">
                        {loadingCounts ? '...' : comparedPropertiesCount}
                      </div>
                      <p className="text-[#6E6E73] text-sm">
                        Properties in your comparison list
                      </p>
                      <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                        {comparedPropertiesCount > 0 ? 'View comparison' : 'Add properties to compare'}
                      </button>
                    </div>
                  </div>
                 </div>
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    
                    <button
                      onClick={handleClearAll}
                      disabled={clearing}
                      className="mt-2 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {clearing ? 'Clearing...' : 'Clear All Saved & Compared'}
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
            
            {/* Footer Actions */}
            {/* <div className="border-t border-[#E5E5E7] p-6 flex justify-end space-x-4">
              <button 
                className="px-6 py-2 border border-[#E5E5E7] rounded-lg font-semibold hover:bg-[#F1F1F4] transition-colors duration-200" 
                style={{ color: '#6E6E73' }}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Save Changes
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
    </PageWithSeo>
  );
};

export default ProfilePage;