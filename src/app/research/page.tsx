"use client"
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  MapPin, 
  Home, 
  Square, 
  TrendingUp,
  Building,
  Navigation
} from 'lucide-react';
import CalculatorSection from '@/components/calculate';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

interface Property {
  id: string;
  title?: string;
  imageUrls?: {
    Images?: Array<{
      imageFilePath: string;
      isCoverImage: boolean;
      orderRank?: number | null;
    }>;
  };
  propertyType?: {
    displayName?: string;
    childType?: {
      displayName?: string;
    };
  };
  address?: {
    subLocality?: string;
    city?: string;
    state?: string;
  };
  monetaryInfo?: {
    expectedPrice?: number;
    expectedRent?: number;
  };
  dimension?: {
    area?: string | number;
    carpetArea?: string | number;
    parking?: string | number;
  };
  unitNo?: string | number;
  furnishStatus?: string;
  attributes?: Array<{
    masterPropertyAttributeId: string;
    value?: string | number;
    displayName?: string;
  }>;
  forSale?: boolean;
  forRent?: boolean;
  // Additional fields that might be in the API response
  saleType?: string;
  enquiredFor?: string;
  status?: string;
  shareCount?: number;
  rating?: string;
}

const Research = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGraph, setActiveGraph] = useState('locations');
  const [processedData, setProcessedData] = useState<any>({});

  // Fetch data from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          'https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=500',
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              tenant: 'realtraspaces',
            },
          }
        );
        const data = await response.json();
        console.log('API Response:', data);
        const propertiesArray = Array.isArray(data)
          ? data
          : data.items || data.data || [];
        console.log('Properties Array:', propertiesArray);
        setProperties(propertiesArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Process data for different graphs
  useEffect(() => {
    if (properties.length === 0) return;

    console.log('Processing properties:', properties.length);

    // Location-wise data
    const locationData = properties.reduce((acc: any, property) => {
      const city = property.address?.city || 'Unknown';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {});

    // Sub-location data (grouped by city like properties page)
    const subLocationData: { [city: string]: { [subLocation: string]: number } } = properties.reduce((acc: any, property) => {
      const city = property.address?.city || 'Unknown';
      const subLocation = property.address?.subLocality || 'Unknown';
      
      if (!acc[city]) {
        acc[city] = {};
      }
      
      if (!acc[city][subLocation]) {
        acc[city][subLocation] = 0;
      }
      
      acc[city][subLocation] += 1;
      return acc;
    }, {});

    // Flatten sub-location data for chart display
    const flattenedSubLocationData: { [label: string]: number } = {};
    Object.keys(subLocationData).forEach(city => {
      Object.keys(subLocationData[city]).forEach(subLocation => {
        const label = `${city} - ${subLocation}`;
        flattenedSubLocationData[label] = subLocationData[city][subLocation];
      });
    });

    // Sort sub-location data by property count (descending)
    const sortedSubLocationEntries = Object.entries(flattenedSubLocationData)
      .sort(([,a], [,b]) => b - a)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as { [label: string]: number });

    // Rent vs Sale data
    const rentSaleData = properties.reduce((acc: any, property) => {
      let type = 'Unknown';
      if (property.forSale) type = 'Sale';
      else if (property.forRent) type = 'Rent';
      else if (property.enquiredFor) type = property.enquiredFor;
      else if (property.saleType) type = property.saleType;
      
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Price per sq.ft data
    const pricePerSqFt = properties
      .filter(p => {
        const price = p.monetaryInfo?.expectedPrice;
        const area = Number(p.dimension?.area);
        return price && area && area > 0;
      })
      .map(p => ({
        title: p.title || 'Unknown Property',
        pricePerSqFt: (p.monetaryInfo?.expectedPrice || 0) / Number(p.dimension?.area || 1),
        area: Number(p.dimension?.area || 0)
      }))
      .sort((a, b) => b.pricePerSqFt - a.pricePerSqFt)
      .slice(0, 10);

    // Carpet area distribution
    const carpetAreaRanges = {
      '0-1000': 0,
      '1001-2000': 0,
      '2001-3000': 0,
      '3001-5000': 0,
      '5000+': 0
    };

    properties.forEach(p => {
      const area = Number(p.dimension?.carpetArea) || 0;
      if (area <= 1000) carpetAreaRanges['0-1000']++;
      else if (area <= 2000) carpetAreaRanges['1001-2000']++;
      else if (area <= 3000) carpetAreaRanges['2001-3000']++;
      else if (area <= 5000) carpetAreaRanges['3001-5000']++;
      else carpetAreaRanges['5000+']++;
    });

    // Hot markets (based on share count and rating)
    const hotMarkets = properties
      .filter(p => (p.shareCount || 0) > 0 || parseFloat(p.rating || '0') > 3)
      .reduce((acc: any, property) => {
        const city = property.address?.city || 'Unknown';
        if (!acc[city]) {
          acc[city] = {
            shareCount: 0,
            avgRating: 0,
            count: 0
          };
        }
        acc[city].shareCount += property.shareCount || 0;
        acc[city].avgRating += parseFloat(property.rating || '0');
        acc[city].count += 1;
        return acc;
      }, {});

    // Calculate average ratings
    Object.keys(hotMarkets).forEach(city => {
      hotMarkets[city].avgRating = hotMarkets[city].avgRating / hotMarkets[city].count;
    });

    console.log('Processed data:', {
      locationData,
      subLocationData,
      flattenedSubLocationData,
      rentSaleData,
      pricePerSqFt: pricePerSqFt.length,
      carpetAreaRanges,
      hotMarkets
    });

    setProcessedData({
      locationData,
      subLocationData: sortedSubLocationEntries,
      rentSaleData,
      pricePerSqFt,
      carpetAreaRanges,
      hotMarkets
    });
  }, [properties]);

  // Graph configurations
  const graphConfigs = {
    locations: {
      title: 'Properties by Location',
      icon: <MapPin className="w-6 h-6" />,
      data: {
        labels: Object.keys(processedData.locationData || {}),
        datasets: [{
          label: 'Number of Properties',
          data: Object.values(processedData.locationData || {}),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Properties by Location',
          },
        },
      }
    },
    subLocation: {
      title: 'Properties by Sub-Location',
      icon: <Navigation className="w-6 h-6" />,
      data: {
        labels: Object.keys(processedData.subLocationData || {}).slice(0, 15), // Limit to top 15 for readability
        datasets: [{
          label: 'Number of Properties',
          data: Object.values(processedData.subLocationData || {}).slice(0, 15),
          backgroundColor: [
            'rgba(255, 159, 64, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(201, 203, 207, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(201, 203, 207, 0.6)',
          ],
          borderColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(201, 203, 207, 0.8)',
          ],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Top 15 Sub-Locations by Property Count',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Properties'
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    },
    rentSale: {
      title: 'Rent vs Sale Distribution',
      icon: <Home className="w-6 h-6" />,
      data: {
        labels: Object.keys(processedData.rentSaleData || {}),
        datasets: [{
          data: Object.values(processedData.rentSaleData || {}),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Rent vs Sale Distribution',
          },
        },
      }
    },
    pricePerSqFt: {
      title: 'Price per Sq. Ft. Analysis',
      icon: <span className="text-2xl font-bold">₹</span>,
      data: {
        labels: (processedData.pricePerSqFt || []).map((item: any) => item.title.substring(0, 20) + '...'),
        datasets: [{
          label: 'Price per Sq. Ft. (INR)',
          data: (processedData.pricePerSqFt || []).map((item: any) => item.pricePerSqFt),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Top 10 Properties by Price per Sq. Ft.',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Price per Sq. Ft. (INR)'
            }
          }
        }
      }
    },
    carpetArea: {
      title: 'Carpet Area Distribution',
      icon: <Square className="w-6 h-6" />,
      data: {
        labels: Object.keys(processedData.carpetAreaRanges || {}),
        datasets: [{
          label: 'Number of Properties',
          data: Object.values(processedData.carpetAreaRanges || {}),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Properties by Carpet Area Range (Sq. Ft.)',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Properties'
            }
          }
        }
      }
    },
    hotMarkets: {
      title: 'Hot Markets Analysis',
      icon: <TrendingUp className="w-6 h-6" />,
      data: {
        labels: Object.keys(processedData.hotMarkets || {}),
        datasets: [
          {
            label: 'Share Count',
            data: Object.values(processedData.hotMarkets || {}).map((market: any) => market.shareCount),
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            yAxisID: 'y',
          },
          {
            label: 'Average Rating',
            data: Object.values(processedData.hotMarkets || {}).map((market: any) => market.avgRating * 10), // Scale for better visibility
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Hot Markets by Share Count and Rating',
          },
        },
        scales: {
          y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            title: {
              display: true,
              text: 'Share Count'
            }
          },
          y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            title: {
              display: true,
              text: 'Average Rating (x10)'
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      }
    }
  };

  const renderGraph = () => {
    const config = graphConfigs[activeGraph as keyof typeof graphConfigs];
    
    switch (activeGraph) {
      case 'locations':
        return <Bar data={config.data} options={config.options} />;
      case 'subLocation':
        return <Bar data={config.data} options={config.options} />;
      case 'rentSale':
        return <Doughnut data={config.data} options={config.options} />;
      case 'pricePerSqFt':
        return <Bar data={config.data} options={config.options} />;
      case 'carpetArea':
        return <Bar data={config.data} options={config.options} />;
      case 'hotMarkets':
        return <Bar data={config.data} options={config.options} />;
      default:
        return <Bar data={config.data} options={config.options} />;
    }
  };

  if (loading) {
    return (
      <div className="pt-10 bg-[#F1F1F4] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 bg-[#F1F1F4] min-h-screen">
        <div className="container mx-auto px-4 ">
            <CalculatorSection/>
        </div>  
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Property Market Research</h1>
          <p className="text-lg text-gray-600">Comprehensive analysis of property market trends and insights</p>
        </div>

        {/* Graph Type Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Analysis Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(graphConfigs).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveGraph(key)}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer duration-300 flex flex-col items-center space-y-2 ${
                  activeGraph === key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="text-blue-600">{config.icon}</div>
                <span className="text-sm font-medium text-center">{config.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Graph Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {graphConfigs[activeGraph as keyof typeof graphConfigs].title}
            </h3>
            <p className="text-gray-600">
              {activeGraph === 'locations' && 'Distribution of properties across different cities and locations'}
              {activeGraph === 'subLocation' && 'Detailed breakdown of properties by sub-locations and neighborhoods'}
              {activeGraph === 'rentSale' && 'Breakdown of properties available for rent vs sale'}
              {activeGraph === 'pricePerSqFt' && 'Top properties ranked by price per square foot'}
              {activeGraph === 'carpetArea' && 'Distribution of properties by carpet area ranges'}
              {activeGraph === 'hotMarkets' && 'Markets with high engagement based on shares and ratings'}
            </p>
          </div>
          
          <div className="h-96 flex items-center justify-center">
            {properties.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-500 text-lg">No property data available</p>
                <p className="text-gray-400 text-sm">Please try refreshing the page</p>
              </div>
            ) : (
              renderGraph()
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <Building className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-800">{properties.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <MapPin className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Cities Covered</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Object.keys(processedData.locationData || {}).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-yellow-600">₹</span>
              <div>
                <p className="text-sm text-gray-600">Avg Price/Sq.Ft</p>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{properties.length > 0 
                    ? Math.round(properties.reduce((sum, p) => 
                        sum + (p.monetaryInfo?.expectedPrice || 0) / Number(p.dimension?.area || 1), 0) / properties.length)
                    : 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Hot Markets</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Object.keys(processedData.hotMarkets || {}).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
    