// Quick test script to debug AI configuration API
const testAIConfigAPI = async () => {
  try {
    console.log('Testing AI Config API...');
    
    // Test 1: Check enabled models endpoint
    console.log('\n1. Testing enabled models endpoint:');
    const enabledResponse = await fetch('http://localhost:5000/api/admin/dashboard/ai-config/enabled');
    const enabledData = await enabledResponse.json();
    console.log('Enabled models response:', enabledData);
    
    // Test 2: Check get all models endpoint (requires auth)
    console.log('\n2. Testing get all models endpoint (without auth):');
    const allResponse = await fetch('http://localhost:5000/api/admin/dashboard/ai-config');
    console.log('Status:', allResponse.status);
    const allData = await allResponse.json();
    console.log('All models response:', allData);
    
    // Test 3: Test API key validation
    console.log('\n3. Testing API key validation:');
    const testResponse = await fetch('http://localhost:5000/api/admin/dashboard/ai-config/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        modelId: 'groq',
        apiKey: 'test-key'
      })
    });
    console.log('Test API status:', testResponse.status);
    const testData = await testResponse.json();
    console.log('Test API response:', testData);
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
};

testAIConfigAPI();
