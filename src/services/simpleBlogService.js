// Simple Blog Service - Direct API calls to working proxy
class SimpleBlogService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async fetchPosts() {
    const cacheKey = 'blog-posts';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('📦 Using cached blog posts');
      return cached.data;
    }

    try {
      console.log('🔄 Fetching blog posts from API...');
      
      const response = await fetch('/api/notion-proxy', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Response received:', data);
      
      // Cache successful response
      this.cache.set(cacheKey, {
        data: data.posts || [],
        timestamp: Date.now()
      });

      return data.posts || [];
    } catch (error) {
      console.error('❌ Blog service error:', error);
      throw new Error(`Failed to fetch blog posts: ${error.message}`);
    }
  }
}

// Export singleton instance
const simpleBlogService = new SimpleBlogService();
export default simpleBlogService;