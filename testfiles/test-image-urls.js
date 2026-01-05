// Test file to verify image URL construction and accessibility
const API_BASE_URL = 'http://localhost:8000';

// Mock the getDeveloperImageUrl function
function getDeveloperImageUrl(filename) {
  if (!filename) return '';
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  return `${API_BASE_URL}/developers/${filename}`;
}

async function testImageUrls() {
  try {
    console.log('🔍 Testing Developer API and Image URLs...\n');
    
    // Test the API
    const response = await fetch(`${API_BASE_URL}/api/developers`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API call successful');
    
    if (data.success && data.data) {
      // Find developers with images
      const developersWithImages = data.data.filter(dev => dev.images && dev.images.length > 0);
      console.log(`📊 Found ${developersWithImages.length} developers with images\n`);
      
      if (developersWithImages.length > 0) {
        // Test first 3 developers with images
        for (let i = 0; i < Math.min(3, developersWithImages.length); i++) {
          const dev = developersWithImages[i];
          const firstImage = dev.images[0];
          const imageUrl = getDeveloperImageUrl(firstImage);
          
          console.log(`🏗️  Developer ${i + 1}: ${dev.buildername}`);
          console.log(`   ID: ${dev.id}`);
          console.log(`   Images array: ${dev.images.length} images`);
          console.log(`   First image filename: ${firstImage}`);
          console.log(`   Constructed URL: ${imageUrl}`);
          
          // Test if image is accessible
          try {
            const imgResponse = await fetch(imageUrl, { method: 'HEAD' });
            console.log(`   🖼️  Image accessible: ${imgResponse.ok ? '✅ Yes' : '❌ No'} (${imgResponse.status})`);
            
            if (imgResponse.ok) {
              console.log(`   📏 Content-Type: ${imgResponse.headers.get('content-type')}`);
              console.log(`   📏 Content-Length: ${imgResponse.headers.get('content-length')} bytes`);
            }
          } catch (imgError) {
            console.log(`   🖼️  Image accessible: ❌ Error - ${imgError.message}`);
          }
          
          console.log(''); // Empty line for readability
        }
        
        // Test a specific image URL
        const testDev = developersWithImages[0];
        const testImage = testDev.images[0];
        const testUrl = getDeveloperImageUrl(testImage);
        
        console.log('🧪 Testing specific image URL:');
        console.log(`   Developer: ${testDev.buildername}`);
        console.log(`   Image: ${testImage}`);
        console.log(`   URL: ${testUrl}`);
        
        // Try to fetch the image
        try {
          const testResponse = await fetch(testUrl);
          console.log(`   Response status: ${testResponse.status}`);
          console.log(`   Response headers:`, Object.fromEntries(testResponse.headers.entries()));
          
          if (testResponse.ok) {
            const blob = await testResponse.blob();
            console.log(`   Image blob size: ${blob.size} bytes`);
            console.log(`   Image blob type: ${blob.type}`);
          }
        } catch (testError) {
          console.log(`   Error fetching image: ${testError.message}`);
        }
        
      } else {
        console.log('⚠️  No developers with images found');
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing image URLs:', error);
  }
}

// Run the test
testImageUrls();
