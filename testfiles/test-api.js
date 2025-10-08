// Simple test script to check API endpoint accessibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.realtraspaces.com';

async function testApiEndpoint() {
  const endpoints = [
    `${API_BASE_URL}/api/seo/meta-tags/home`,
    `${API_BASE_URL}/api/seo/meta-tags/about`,
    `${API_BASE_URL}/api/blogs/`,
    `${API_BASE_URL}/api/jobs`
  ];

  console.log('Testing API endpoints...');
  console.log('API Base URL:', API_BASE_URL);
  console.log('---');

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await fetch(endpoint);
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
      } else {
        console.log('Error response:', response.statusText);
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
    console.log('---');
  }
}

testApiEndpoint(); 