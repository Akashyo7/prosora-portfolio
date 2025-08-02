/**
 * Client-Side Notion Blog Service
 * Handles all Notion API interactions with error handling and caching
 */

class NotionBlogService {
  constructor() {
    this.baseURL = 'https://api.notion.com/v1';
    this.token = import.meta.env.VITE_NOTION_TOKEN;
    this.databaseId = import.meta.env.VITE_NOTION_DATABASE_ID;
    this.version = '2022-06-28';
    this.cacheKey = 'notion-blog-cache';
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get headers for Notion API requests
   */
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Notion-Version': this.version,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Fetch blog posts from Notion database
   * Uses a proxy approach to handle CORS limitations
   */
  async fetchPosts(limit = 10) {
    try {
      console.log('🔄 Fetching blog posts from Notion...');
      
      const requestBody = {
        page_size: limit,
        filter: {
          property: 'Status',
          select: {
            equals: 'Published'
          }
        },
        sorts: [
          {
            property: 'Published Date',
            direction: 'descending'
          }
        ]
      };

      // Try proxy API first (handles CORS)
      let response;
      try {
        response = await fetch(`/api/notion-proxy?endpoint=databases/${this.databaseId}/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
      } catch (proxyError) {
        console.log('⚠️ Proxy failed, trying direct API call');
        
        // Fallback to direct API call
        response = await fetch(`${this.baseURL}/databases/${this.databaseId}/query`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(requestBody)
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const posts = this.parsePosts(data.results);
      
      // Cache the results
      this.setCachedPosts(posts);
      
      console.log('✅ Successfully fetched', posts.length, 'blog posts');
      return posts;
      
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      
      // Try to return cached data
      const cachedPosts = this.getCachedPosts();
      if (cachedPosts.length > 0) {
        console.log('📦 Using cached blog posts');
        return cachedPosts;
      }
      
      // Return fallback data with sample posts
      console.log('🔄 Using fallback blog posts');
      return this.getFallbackPosts();
    }
  }

  /**
   * Fetch individual blog post content
   */
  async fetchPost(postId) {
    try {
      console.log('🔄 Fetching blog post:', postId);
      
      const response = await fetch(`${this.baseURL}/pages/${postId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
      }

      const page = await response.json();
      return this.parsePost(page);
      
    } catch (error) {
      console.error('❌ Error fetching post:', error);
      throw error;
    }
  }

  /**
   * Fetch blog post content blocks
   */
  async fetchPostContent(postId) {
    try {
      console.log('🔄 Fetching post content:', postId);
      
      const response = await fetch(`${this.baseURL}/blocks/${postId}/children`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseContent(data.results);
      
    } catch (error) {
      console.error('❌ Error fetching post content:', error);
      throw error;
    }
  }

  /**
   * Parse Notion pages into blog post objects
   */
  parsePosts(pages) {
    return pages.map(page => this.parsePost(page));
  }

  /**
   * Parse individual Notion page into blog post object
   */
  parsePost(page) {
    const properties = page.properties;
    const title = this.extractText(properties.Title || properties.Name);
    const excerpt = this.extractText(properties.Excerpt) || '';
    const publishedDate = properties['Published Date']?.date?.start || page.created_time;
    
    const coverImage = this.extractCoverImage(page);
    
    // Generate reliable Notion URL
    const notionUrl = page.url || `https://www.notion.so/${page.id.replace(/-/g, '')}`;
    
    return {
      id: page.id,
      title: title,
      excerpt: excerpt,
      publishedDate: publishedDate,
      lastModified: page.last_edited_time,
      tags: properties.Tags?.multi_select?.map(tag => tag.name) || [],
      status: properties.Status?.select?.name || 'Published',
      slug: this.createSlug(title),
      coverImage: coverImage,
      url: notionUrl,
      author: {
        name: 'Prosora',
        avatar: null
      },
      // Map to BlogSection expected properties
      featuredImage: coverImage,
      date: publishedDate,
      readTime: '5 min read' // Default read time
    };
  }

  /**
   * Parse Notion content blocks
   */
  parseContent(blocks) {
    return blocks.map(block => ({
      id: block.id,
      type: block.type,
      content: this.extractBlockContent(block),
      hasChildren: block.has_children
    }));
  }

  /**
   * Extract text from Notion rich text property
   */
  extractText(property) {
    if (!property) return '';
    
    if (property.title) {
      return property.title.map(text => text.plain_text).join('');
    }
    
    if (property.rich_text) {
      return property.rich_text.map(text => text.plain_text).join('');
    }
    
    return '';
  }

  /**
   * Extract cover image from Notion page
   */
  extractCoverImage(page) {
    if (page.cover) {
      if (page.cover.type === 'external') {
        return page.cover.external.url;
      }
      if (page.cover.type === 'file') {
        return page.cover.file.url;
      }
    }
    return null;
  }

  /**
   * Extract content from Notion block
   */
  extractBlockContent(block) {
    const blockType = block.type;
    const blockData = block[blockType];
    
    if (blockData && blockData.rich_text) {
      return blockData.rich_text.map(text => text.plain_text).join('');
    }
    
    if (blockType === 'image') {
      return blockData.external?.url || blockData.file?.url || '';
    }
    
    return '';
  }

  /**
   * Create URL-friendly slug from title
   */
  createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Cache blog posts in localStorage
   */
  setCachedPosts(posts) {
    try {
      const cacheData = {
        posts,
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache posts:', error);
    }
  }

  /**
   * Get cached blog posts from localStorage
   */
  getCachedPosts() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return [];
      
      const cacheData = JSON.parse(cached);
      const isExpired = Date.now() - cacheData.timestamp > this.cacheExpiry;
      
      if (isExpired) {
        localStorage.removeItem(this.cacheKey);
        return [];
      }
      
      return cacheData.posts || [];
    } catch (error) {
      console.warn('Failed to get cached posts:', error);
      return [];
    }
  }

  /**
   * Get fallback posts when API fails
   */
  getFallbackPosts() {
    return [
      {
        id: 'fallback-1',
        title: 'My AI Development Journey',
        excerpt: 'Exploring the intersection of artificial intelligence and product development, sharing insights from building AI-powered solutions.',
        publishedDate: '2025-02-01T00:00:00.000Z',
        lastModified: '2025-02-01T00:00:00.000Z',
        tags: ['AI', 'Development', 'Product'],
        status: 'Published',
        slug: 'ai-development-journey',
        coverImage: null,
        url: '#',
        author: {
          name: 'Prosora',
          avatar: null
        },
        // BlogSection expected properties
        featuredImage: null,
        date: '2025-02-01T00:00:00.000Z',
        readTime: '5 min read'
      },
      {
        id: 'fallback-2',
        title: 'Strategy & Analytics in Modern Business',
        excerpt: 'How data-driven decision making and strategic thinking are reshaping the business landscape in 2025.',
        publishedDate: '2025-01-28T00:00:00.000Z',
        lastModified: '2025-01-28T00:00:00.000Z',
        tags: ['Strategy', 'Analytics', 'Business'],
        status: 'Published',
        slug: 'strategy-analytics-modern-business',
        coverImage: null,
        url: '#',
        author: {
          name: 'Prosora',
          avatar: null
        },
        // BlogSection expected properties
        featuredImage: null,
        date: '2025-01-28T00:00:00.000Z',
        readTime: '4 min read'
      },
      {
        id: 'fallback-3',
        title: 'Building Scalable Product Solutions',
        excerpt: 'Lessons learned from designing and implementing scalable product architectures that grow with your business.',
        publishedDate: '2025-01-25T00:00:00.000Z',
        lastModified: '2025-01-25T00:00:00.000Z',
        tags: ['Product', 'Scalability', 'Architecture'],
        status: 'Published',
        slug: 'building-scalable-product-solutions',
        coverImage: null,
        url: '#',
        author: {
          name: 'Prosora',
          avatar: null
        },
        // BlogSection expected properties
        featuredImage: null,
        date: '2025-01-25T00:00:00.000Z',
        readTime: '6 min read'
      }
    ];
  }

  /**
   * Test API connection
   */
  async testConnection() {
    try {
      console.log('🔄 Testing Notion API connection...');
      
      const response = await fetch(`${this.baseURL}/databases/${this.databaseId}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`API test failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Notion API connection successful');
      console.log('📊 Database info:', {
        title: this.extractText(data.title[0]),
        id: data.id,
        properties: Object.keys(data.properties)
      });
      
      return true;
    } catch (error) {
      console.error('❌ Notion API connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const notionBlogService = new NotionBlogService();
export default notionBlogService;