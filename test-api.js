// Simple test script to check if the blog API works
// Run with: node test-api.js

const testAPI = async () => {
  try {
    console.log('🧪 Testing blog API...')
    
    // Test local development API
    const response = await fetch('http://localhost:3000/api/blog')
    
    console.log('📡 Response status:', response.status)
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API Success!')
      console.log('📊 Posts count:', data.count)
      console.log('📝 First post:', data.posts?.[0]?.title)
    } else {
      const errorData = await response.json()
      console.error('❌ API Error:', errorData)
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message)
    console.log('💡 Make sure to run "vercel dev" first!')
  }
}

testAPI()