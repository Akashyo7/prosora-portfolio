/**
 * Ghost Blog Service - Prosora Blog Integration
 * Fetches latest blog posts from Ghost Content API with caching and error handling
 */

class GhostBlogService {
  constructor() {
    // Ghost API Configuration
    this.apiUrl = 'https://prosorablog.ghost.io';
    this.contentApiKey = '599126721854c8246be2695409'; // Content API key (public)
    this.apiVersion = 'content'; // Use 'content' instead of versioned API
    
    // Cache configuration
    this.cache = new Map();
    this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
    this.maxPosts = 6; // Fetch max 6 posts for cleaner layout
    
    console.log('🔧 Ghost Blog Service initialized');
    console.log('📡 API URL:', this.apiUrl);
  }

  /**
   * Build Ghost Content API URL with proper parameters
   */
  buildApiUrl(endpoint, params = {}) {
    const baseUrl = `${this.apiUrl}/ghost/api/${this.apiVersion}/${endpoint}/`; // Added trailing slash
    const searchParams = new URLSearchParams({
      key: this.contentApiKey,
      ...params
    });
    
    return `${baseUrl}?${searchParams.toString()}`;
  }

  /**
   * Check if cached data is still valid
   */
  isCacheValid(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    
    const now = Date.now();
    const isValid = (now - cached.timestamp) < this.cacheTimeout;
    
    if (!isValid) {
      this.cache.delete(cacheKey);
      console.log('🗑️ Cache expired for:', cacheKey);
    }
    
    return isValid;
  }

  /**
   * Get cached data if valid
   */
  getCachedData(cacheKey) {
    if (this.isCacheValid(cacheKey)) {
      console.log('💾 Using cached data for:', cacheKey);
      return this.cache.get(cacheKey).data;
    }
    return null;
  }

  /**
   * Cache data with timestamp
   */
  setCachedData(cacheKey, data) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    console.log('💾 Cached data for:', cacheKey);
  }

  /**
   * Transform Ghost post data to portfolio format
   */
  transformPost(ghostPost) {
    return {
      id: ghostPost.id,
      title: ghostPost.title,
      excerpt: ghostPost.excerpt || ghostPost.custom_excerpt || this.generateExcerpt(ghostPost.html),
      publishedDate: ghostPost.published_at,
      lastModified: ghostPost.updated_at,
      tags: ghostPost.tags?.map(tag => tag.name) || ['Blog'],
      slug: ghostPost.slug,
      coverImage: ghostPost.feature_image,
      url: `https://prosora.blog/${ghostPost.slug}`, // Full blog URL
      author: {
        name: ghostPost.primary_author?.name || 'Akash Prosora',
        avatar: ghostPost.primary_author?.profile_image
      },
      readTime: this.calculateReadTime(ghostPost.html || ghostPost.plaintext),
      status: 'Published',
      
      // Additional metadata for SEO
      metaTitle: ghostPost.meta_title || ghostPost.title,
      metaDescription: ghostPost.meta_description || ghostPost.excerpt,
      ogImage: ghostPost.og_image || ghostPost.feature_image,
      twitterImage: ghostPost.twitter_image || ghostPost.feature_image
    };
  }

  /**
   * Generate excerpt from HTML content
   */
  generateExcerpt(html, maxLength = 120) {
    if (!html) return 'Read more about this topic...';
    
    // Strip HTML tags and get plain text
    const plainText = html.replace(/<[^>]*>/g, '').trim();
    
    if (plainText.length <= maxLength) return plainText;
    
    // Find last complete sentence within limit
    const truncated = plainText.substring(0, maxLength);
    const lastSentence = truncated.lastIndexOf('.');
    
    if (lastSentence > maxLength * 0.7) {
      return truncated.substring(0, lastSentence + 1);
    }
    
    // Fallback to word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  }

  /**
   * Calculate estimated read time
   */
  calculateReadTime(content) {
    if (!content) return '2 min read';
    
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    
    return `${minutes} min read`;
  }

  /**
   * Fetch latest blog posts from Ghost API
   */
  async fetchPosts() {
    const cacheKey = 'ghost-posts-latest';
    
    // Check cache first
    const cachedPosts = this.getCachedData(cacheKey);
    if (cachedPosts) {
      return cachedPosts;
    }

    try {
      console.log('🔄 Fetching latest posts from Ghost API...');
      
      const apiUrl = this.buildApiUrl('posts', {
        limit: this.maxPosts,
        include: 'tags,authors',
        fields: 'id,title,slug,excerpt,custom_excerpt,html,plaintext,feature_image,published_at,updated_at,meta_title,meta_description,og_image,twitter_image',
        filter: 'status:published',
        order: 'published_at DESC'
      });

      console.log('📡 API Request URL:', apiUrl.replace(this.contentApiKey, 'KEY_HIDDEN'));

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Prosora Portfolio/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Ghost API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.posts || !Array.isArray(data.posts)) {
        throw new Error('Invalid response format from Ghost API');
      }

      console.log(`✅ Successfully fetched ${data.posts.length} posts from Ghost`);
      
      // Transform posts to portfolio format
      const transformedPosts = data.posts.map(post => this.transformPost(post));
      
      // Cache the results
      this.setCachedData(cacheKey, transformedPosts);
      
      // Log post details for debugging
      transformedPosts.forEach(post => {
        console.log(`📝 Post: "${post.title}" - ${post.url}`);
      });

      return transformedPosts;

    } catch (error) {
      console.error('❌ Ghost API Error:', error.message);
      
      // Return fallback posts for graceful degradation
      return this.getFallbackPosts();
    }
  }

  /**
   * Fetch latest posts with retry logic and error handling
   */
  async fetchLatestPosts(retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${retries} - Fetching latest posts...`);
        return await this.fetchPosts();
      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
        
        if (attempt === retries) {
          console.log('🔄 All attempts failed, returning fallback posts');
          return this.getFallbackPosts();
        }
        
        // Exponential backoff: wait 1s, 2s, 4s between retries
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Get fallback posts when API fails
   */
  getFallbackPosts() {
    console.log('🔄 Using fallback posts due to API failure');
    
    return [
      {
        id: 'fallback-1',
        title: 'Welcome to My Blog',
        excerpt: 'Exploring product management, strategy, and innovation in the digital age.',
        publishedDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        tags: ['Welcome', 'Product Management'],
        slug: 'welcome-to-my-blog',
        coverImage: null,
        url: 'https://prosora.blog',
        author: {
          name: 'Akash Prosora',
          avatar: null
        },
        readTime: '3 min read',
        status: 'Published'
      },
      {
        id: 'fallback-2',
        title: 'Building Better Products',
        excerpt: 'Insights on creating user-centered products that solve real problems.',
        publishedDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        lastModified: new Date(Date.now() - 86400000).toISOString(),
        tags: ['Product', 'Strategy'],
        slug: 'building-better-products',
        coverImage: null,
        url: 'https://prosora.blog',
        author: {
          name: 'Akash Prosora',
          avatar: null
        },
        readTime: '5 min read',
        status: 'Published'
      }
    ];
  }

  /**
   * Get Ghost newsletter signup URL
   */
  getNewsletterSignupUrl() {
    return `${this.apiUrl}/#/portal/signup`;
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Ghost API cache cleared');
  }
}

// Export singleton instance
const ghostBlogService = new GhostBlogService();
export default ghostBlogService;