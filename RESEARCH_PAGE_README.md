# Property Market Research Page

## Overview
The research page provides comprehensive property market analysis using 5 different types of interactive charts built with Chart.js. The page fetches real property data from the LeadRat API and presents it in various visual formats for market insights.

## Features

### 1. **Properties by Location** 📍
- **Chart Type**: Bar Chart
- **Data**: Distribution of properties across different cities
- **Icon**: MapPin
- **Insight**: Shows which cities have the most property listings

### 2. **Rent vs Sale Distribution** 🏠
- **Chart Type**: Doughnut Chart
- **Data**: Breakdown of properties available for rent vs sale
- **Icon**: Home
- **Insight**: Market composition analysis

### 3. **Price per Sq. Ft. Analysis** 💰
- **Chart Type**: Bar Chart
- **Data**: Top 10 properties ranked by price per square foot
- **Icon**: DollarSign
- **Insight**: Premium property identification

### 4. **Carpet Area Distribution** 📐
- **Chart Type**: Bar Chart
- **Data**: Properties grouped by carpet area ranges
- **Icon**: Square
- **Insight**: Size preference analysis

### 5. **Hot Markets Analysis** 📈
- **Chart Type**: Multi-axis Bar Chart
- **Data**: Markets with high engagement (shares + ratings)
- **Icon**: TrendingUp
- **Insight**: Trending locations identification

## Technical Implementation

### API Integration
- **Endpoint**: `https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous`
- **Parameters**: `PageNumber=1&PageSize=100`
- **Headers**: 
  - `accept: application/json`
  - `tenant: realtraspaces`

### Data Processing
The page processes raw property data to create:
- Location-wise aggregations
- Rent/Sale type classifications
- Price per square foot calculations
- Carpet area range distributions
- Hot market scoring based on engagement metrics

### Chart Library
- **Primary**: Chart.js with react-chartjs-2
- **Chart Types**: Bar, Doughnut, Multi-axis Bar
- **Features**: Responsive, interactive, customizable colors

## User Interface

### Graph Selector
- 5 interactive buttons with icons
- Visual feedback for active selection
- Smooth transitions between graphs

### Summary Statistics
- Total Properties count
- Cities Covered count
- Average Price per Sq.Ft
- Hot Markets count

### Responsive Design
- Mobile-friendly layout
- Adaptive chart sizing
- Clean, modern UI with Tailwind CSS

## Data Structure

### Property Interface
```typescript
interface Property {
  id: string;
  title: string;
  saleType: string;
  enquiredFor: string;
  monetaryInfo: {
    expectedPrice: number;
    currency: string;
  };
  dimension: {
    area: number;
    carpetArea: number;
    unit: string;
  };
  address: {
    city: string;
    locality: string;
  };
  status: string;
  shareCount: number;
  rating: string;
}
```

## Usage

1. Navigate to `/research` page
2. Wait for data to load from API
3. Click on any of the 5 graph type buttons
4. View the interactive chart with detailed insights
5. Hover over chart elements for additional information

## Error Handling

- Loading states with spinner
- API error handling with console logging
- Empty data state with user-friendly message
- Graceful fallbacks for missing property data

## Dependencies

- `chart.js`: Core charting library
- `react-chartjs-2`: React wrapper for Chart.js
- `lucide-react`: Icon library
- `tailwindcss`: Styling framework
