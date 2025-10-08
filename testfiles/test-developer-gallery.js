// Test file to verify developer API and gallery functionality
const API_BASE_URL = 'https://api.realtraspaces.com';

async function testDeveloperAPI() {
  try {
    console.log('Testing Developer API...');
    
    const response = await fetch(`${API_BASE_URL}/api/developers`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.success && data.data) {
      console.log('✅ API call successful');
      console.log(`📊 Found ${data.data.length} developers`);
      
      // Check for developers with images
      const developersWithImages = data.data.filter(dev => dev.images && dev.images.length > 0);
      console.log(`🖼️  Developers with images: ${developersWithImages.length}`);
      
      if (developersWithImages.length > 0) {
        console.log('\n📋 Sample developers with images:');
        developersWithImages.slice(0, 3).forEach((dev, index) => {
          console.log(`${index + 1}. ${dev.buildername} - ${dev.location || 'No location'}`);
          console.log(`   Images: ${dev.images.length}`);
          console.log(`   First image: ${dev.images[0]}`);
        });
        
        // Test image URL construction
        const firstDev = developersWithImages[0];
        const imageUrl = `${API_BASE_URL}/developers/${firstDev.images[0]}`;
        console.log(`\n🔗 Sample image URL: ${imageUrl}`);
        
        // Test if image is accessible
        try {
          const imgResponse = await fetch(imageUrl, { method: 'HEAD' });
          console.log(`🖼️  Image accessible: ${imgResponse.ok ? '✅ Yes' : '❌ No'} (${imgResponse.status})`);
        } catch (imgError) {
          console.log(`🖼️  Image accessible: ❌ Error - ${imgError.message}`);
        }
      } else {
        console.log('⚠️  No developers with images found');
      }
      
      // Check developer structure
      if (data.data.length > 0) {
        const sampleDev = data.data[0];
        console.log('\n🏗️  Developer object structure:');
        console.log('Keys:', Object.keys(sampleDev));
        console.log('Sample developer:', {
          id: sampleDev.id,
          buildername: sampleDev.buildername,
          location: sampleDev.location,
          images: sampleDev.images,
          hasImages: sampleDev.images && sampleDev.images.length > 0
        });
      }
      
    } else {
      console.log('❌ API response indicates no success or no data');
      console.log('Response:', data);
    }
    
  } catch (error) {
    console.error('❌ Error testing developer API:', error);
  }
}

// Test gallery image processing
function testGalleryImageProcessing() {
  console.log('\n🎨 Testing Gallery Image Processing...');
  
  // Mock developer data
  const mockDevelopers = [
    {
      id: 1,
      buildername: "Sample Developer 1",
      location: "Dubai",
      images: ["image1.jpg", "image2.jpg"]
    },
    {
      id: 2,
      buildername: "Sample Developer 2", 
      location: "Abu Dhabi",
      images: ["image3.jpg"]
    }
  ];
  
  // Process developers into gallery images
  const processedImages = mockDevelopers
    .filter(developer => developer.images && developer.images.length > 0)
    .map(developer => {
      const firstImage = developer.images[0];
      return {
        id: developer.id.toString(),
        src: `${API_BASE_URL}/developers/${firstImage}`,
        alt: `${developer.buildername} - ${developer.location || 'Property Development'}`,
        size: Math.random() > 0.5 ? 'large' : 'small',
        developerName: developer.buildername,
        developerLink: `/developers/${developer.id}`
      };
    });
  
  console.log('✅ Gallery image processing successful');
  console.log('Processed images:', processedImages);
  
  return processedImages;
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Developer Gallery Tests...\n');
  
  await testDeveloperAPI();
  testGalleryImageProcessing();
  
  console.log('\n✨ Tests completed!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runTests();
} else {
  // Browser environment
  console.log('🌐 Running in browser - use runTests() to start tests');
  window.runTests = runTests;
}
