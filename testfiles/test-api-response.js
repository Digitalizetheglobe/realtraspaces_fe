// Test script to check API response structure
async function testApiResponse() {
  try {
    const response = await fetch("http://localhost:8000/api/developers");
    const data = await response.json();

    console.log('=== API Response Structure ===');
    console.log('Full response:', JSON.stringify(data, null, 2));

    if (data.data && data.data.length > 0) {
      const firstDeveloper = data.data[0];
      console.log('\n=== First Developer ===');
      console.log('ID:', firstDeveloper.id);
      console.log('Name:', firstDeveloper.buildername);
      console.log('Builder Logo:', firstDeveloper.builder_logo);
      console.log('Images:', firstDeveloper.images);
      console.log('Images type:', typeof firstDeveloper.images);
      console.log('Is images array?', Array.isArray(firstDeveloper.images));
      console.log('Images length:', firstDeveloper.images ? firstDeveloper.images.length : 'N/A');
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the test
testApiResponse();
