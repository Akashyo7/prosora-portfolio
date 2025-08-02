/**
 * Test script for Notion API connection
 * Run this to verify your Notion integration is working
 */

import notionBlogService from '../services/notionBlogService.js';

export async function testNotionAPI() {
  console.log('🚀 Starting Notion API tests...');
  
  // Test 1: API Connection
  console.log('\n📡 Test 1: API Connection');
  const connectionTest = await notionBlogService.testConnection();
  
  if (!connectionTest) {
    console.error('❌ API connection failed. Please check your credentials.');
    return false;
  }
  
  // Test 2: Fetch Posts
  console.log('\n📝 Test 2: Fetch Blog Posts');
  try {
    const posts = await notionBlogService.fetchPosts(3);
    console.log('✅ Successfully fetched posts:', posts.length);
    
    if (posts.length > 0) {
      console.log('📄 Sample post:', {
        title: posts[0].title,
        excerpt: posts[0].excerpt,
        publishedDate: posts[0].publishedDate,
        tags: posts[0].tags
      });
    }
  } catch (error) {
    console.error('❌ Failed to fetch posts:', error);
    return false;
  }
  
  // Test 3: Cache Functionality
  console.log('\n💾 Test 3: Cache Functionality');
  const cachedPosts = notionBlogService.getCachedPosts();
  console.log('✅ Cached posts available:', cachedPosts.length);
  
  console.log('\n🎉 All tests completed successfully!');
  return true;
}

// Auto-run tests in development
if (import.meta.env.DEV) {
  // Uncomment to run tests automatically
  // testNotionAPI();
}