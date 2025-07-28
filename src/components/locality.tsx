"use client";
import React, { useState, useEffect } from 'react';

// Define types for property and address
interface Address {
  city?: string;
  subLocality?: string;
}

interface Property {
  address?: Address;
}

// Type for locations state
interface LocationsMap {
  [city: string]: string[];
}

const PropertyLocations = () => {
  const [locations, setLocations] = useState<LocationsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=20'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        
        // Process the data to group by city and subLocality
        const locationMap: { [city: string]: Set<string> } = {};
        
        if (data && data.data) {
          (data.data as Property[]).forEach((property: Property) => {
            if (property.address) {
              const city = property.address.city;
              const subLocality = property.address.subLocality;
              
              if (city && subLocality) {
                if (!locationMap[city]) {
                  locationMap[city] = new Set<string>();
                }
                locationMap[city].add(subLocality);
              }
            }
          });
        }
        
        // Convert Sets to Arrays for easier rendering
        const processedLocations: LocationsMap = {};
        Object.keys(locationMap).forEach((city: string) => {
          processedLocations[city] = Array.from(locationMap[city]);
        });
        
        setLocations(processedLocations);
      } catch (err) {
        let message = 'Unknown error';
        if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, []);

  if (loading) {
    return (
      <div className=" bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <div className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer">
              All Properties 
            </div>
            <div className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer">
              Flats for Rent
            </div>
            <div className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer">
            Flats for Investment
            </div>
            <div className="text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer">
              Flats for Research
            </div>
           
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(locations).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No locations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Object.entries(locations).map(([city, subLocalities]) => (
              <div key={city} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  Flats for Sale in {city}
                </h2>
                <div className="space-y-2">
                  {(subLocalities as string[]).map((subLocality: string, index: number) => (
                    <div key={index}>
                      <a 
                        href="#" 
                        className="text-blue-600 hover:text-blue-800 text-sm hover:underline block"
                      >
                        Flats for Sale in {subLocality}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyLocations;