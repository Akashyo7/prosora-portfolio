// Notion API integration for blog system

/**
 * Notion API configuration
 */
const NOTION_CONFIG = {
  apiUrl: 'https://api.notion.com/v1',
  version: '2022-06-28',
  // These will be set via environment variables
  token: import.meta.env.VITE_NOTION_TOKEN,
  databaseId: import.meta.env.VITE_NOTION_DATABASE_ID,
};

/**
 * Notion API client
 */
class NotionClient {
  constructor() {
    this.headers = {
      'Authorization': `Bearer ${NOTION_CONFIG.token}`,
      'Notion-Version': NOTION_CONFIG.version,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Make API request to Notion
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} API response
   */
  async request(endpoint, options = {}) {
    const url = `${NOTION_CONFIG.apiUrl}${endpoint}`;
    
    console.log('🌐 Making request to:', url);
    console.log('📋 Request headers:', this.headers);
    console.log('⚙️ Request options:', options);
    
    try {
      const response = await fetch(url, {
        headers: this.headers,
        ...options,
      });

      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`Notion API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);
      return data;
    } catch (error) {
      console.error('💥 Notion API request failed:', error);
      throw error;
    }
  }

  /**
   * Query database for published blog posts
   * @returns {Promise<Array>} Array of blog posts
   */
  async getBlogPosts() {
    console.log('🔍 Checking Notion configuration...');
    console.log('Token exists:', !!NOTION_CONFIG.token);
    console.log('Database ID:', NOTION_CONFIG.databaseId);
    
    if (!NOTION_CONFIG.token || !NOTION_CONFIG.databaseId) {
      console.warn('⚠️ Notion configuration missing. Using mock data.');
      console.log('Token:', NOTION_CONFIG.token ? 'Present' : 'Missing');
      console.log('Database ID:', NOTION_CONFIG.databaseId ? 'Present' : 'Missing');
      return this.getMockPosts();
    }

    try {
      console.log('🚀 Making Notion API request...');
      // Get all pages from the database (no filter to see what's available)
      const response = await this.request(`/databases/${NOTION_CONFIG.databaseId}/query`, {
        method: 'POST',
        body: JSON.stringify({
          // Remove sorts for now to avoid property name issues
          page_size: 100
        })
      });

      console.log('✅ Notion API response received:', response);
      console.log('📊 Results count:', response.results?.length || 0);
      
      if (!response.results || response.results.length === 0) {
        console.log('📝 No published posts found in Notion, using mock data');
        return this.getMockPosts();
      }
      
      const transformedPosts = response.results.map(page => this.transformNotionPage(page));
      console.log('🔄 Transformed posts:', transformedPosts);
      
      return transformedPosts;
    } catch (error) {
      console.error('❌ Failed to fetch blog posts from Notion:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        stack: error.stack
      });
      console.log('🔄 Falling back to mock data...');
      return this.getMockPosts();
    }
  }

  /**
   * Get a specific blog post by ID
   * @param {string} pageId - Notion page ID
   * @returns {Promise<Object>} Blog post data
   */
  async getBlogPost(pageId) {
    if (!NOTION_CONFIG.token) {
      return this.getMockPost(pageId);
    }

    try {
      const [page, blocks] = await Promise.all([
        this.request(`/pages/${pageId}`),
        this.request(`/blocks/${pageId}/children`)
      ]);

      return {
        ...this.transformNotionPage(page),
        content: this.transformNotionBlocks(blocks.results)
      };
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
      return this.getMockPost(pageId);
    }
  }

  /**
   * Transform Notion page to blog post format
   * @param {Object} page - Notion page object
   * @returns {Object} Transformed blog post
   */
  transformNotionPage(page) {
    console.log('🔄 Transforming Notion page:', page.id);
    console.log('📋 Available properties:', Object.keys(page.properties));
    
    const properties = page.properties;
    
    // Try different possible property names
    const titleProperty = properties.Title || properties.Name || properties.title || properties.name;
    const statusProperty = properties.Status || properties.status;
    const dateProperty = properties.Date || properties.date || properties.Created;
    const tagsProperty = properties.Tags || properties.tags || properties.Category;
    const excerptProperty = properties.Excerpt || properties.excerpt || properties.Description;
    
    const title = this.extractText(titleProperty) || 'Untitled Post';
    
    console.log('📝 Extracted data:', {
      title,
      status: statusProperty?.select?.name,
      date: dateProperty?.date?.start,
      tags: tagsProperty?.multi_select?.length || 0
    });
    
    return {
      id: page.id,
      title,
      slug: this.generateSlug(title),
      excerpt: this.extractText(excerptProperty) || '',
      date: dateProperty?.date?.start || new Date().toISOString().split('T')[0],
      tags: tagsProperty?.multi_select?.map(tag => tag.name) || [],
      status: statusProperty?.select?.name || 'Published', // Default to Published if no status
      featured: properties.Featured?.checkbox || false,
      featuredImage: this.extractCoverImage(page),
      readingTime: this.calculateReadingTime(this.extractText(excerptProperty) || ''),
      lastModified: page.last_edited_time,
      // Use the actual Notion page URL for direct access
      url: page.url || `https://notion.so/${page.id.replace(/-/g, '')}`
    };
  }

  /**
   * Transform Notion blocks to content
   * @param {Array} blocks - Notion blocks
   * @returns {string} HTML content
   */
  transformNotionBlocks(blocks) {
    return blocks.map(block => {
      switch (block.type) {
        case 'paragraph':
          return `<p>${this.extractText(block.paragraph)}</p>`;
        case 'heading_1':
          return `<h1>${this.extractText(block.heading_1)}</h1>`;
        case 'heading_2':
          return `<h2>${this.extractText(block.heading_2)}</h2>`;
        case 'heading_3':
          return `<h3>${this.extractText(block.heading_3)}</h3>`;
        case 'bulleted_list_item':
          return `<li>${this.extractText(block.bulleted_list_item)}</li>`;
        case 'numbered_list_item':
          return `<li>${this.extractText(block.numbered_list_item)}</li>`;
        case 'quote':
          return `<blockquote>${this.extractText(block.quote)}</blockquote>`;
        case 'code':
          return `<pre><code>${this.extractText(block.code)}</code></pre>`;
        case 'divider':
          return '<hr>';
        default:
          return '';
      }
    }).join('');
  }

  /**
   * Extract plain text from Notion rich text
   * @param {Object} richText - Notion rich text object
   * @returns {string} Plain text
   */
  extractText(richText) {
    if (!richText || !richText.rich_text) return '';
    return richText.rich_text.map(text => text.plain_text).join('');
  }

  /**
   * Extract cover image from Notion page
   * @param {Object} page - Notion page object
   * @returns {string|null} Cover image URL
   */
  extractCoverImage(page) {
    if (page.cover) {
      if (page.cover.type === 'external') {
        return page.cover.external.url;
      } else if (page.cover.type === 'file') {
        return page.cover.file.url;
      }
    }
    return null;
  }

  /**
   * Generate URL slug from title
   * @param {string} title - Post title
   * @returns {string} URL slug
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Calculate reading time
   * @param {string} content - Post content
   * @returns {number} Reading time in minutes
   */
  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Mock data for development/fallback
   * @returns {Array} Mock blog posts
   */
  getMockPosts() {
    console.log('📝 Returning mock blog posts');
    return [
      {
        id: 'mock-1',
        title: 'Product Management Lessons from OYO',
        slug: 'product-management-lessons-from-oyo',
        excerpt: 'Key insights from managing product operations at OYO and working with chatbot "Yo". Learn how to scale product operations and improve user experience.',
        date: '2025-01-20',
        tags: ['Product Management', 'OYO', 'Operations'],
        status: 'Published',
        featured: true,
        featuredImage: null,
        readingTime: 5,
        url: 'https://www.notion.so/Prosora-Portfolio-Blog-Posts-23bcf31b151380a196f7dff950badaa9'
      },
      {
        id: 'mock-2',
        title: 'From IIT Bombay to Product Strategy',
        slug: 'from-iit-bombay-to-product-strategy',
        excerpt: 'My journey from engineering to product management and the lessons learned along the way. Transitioning from technical roles to strategic thinking.',
        date: '2025-01-15',
        tags: ['Career', 'Product Strategy', 'IIT Bombay'],
        status: 'Published',
        featured: false,
        featuredImage: null,
        readingTime: 7,
        url: 'https://www.notion.so/Prosora-Portfolio-Blog-Posts-23bcf31b151380a196f7dff950badaa9'
      },
      {
        id: 'mock-3',
        title: 'Data-Driven Decision Making in Product',
        slug: 'data-driven-decision-making-in-product',
        excerpt: 'How to leverage analytics and data to make better product decisions. Building a culture of experimentation and measurement.',
        date: '2025-01-10',
        tags: ['Analytics', 'Product Management', 'Data'],
        status: 'Published',
        featured: false,
        featuredImage: null,
        readingTime: 6,
        url: 'https://www.notion.so/Prosora-Portfolio-Blog-Posts-23bcf31b151380a196f7dff950badaa9'
      },
      {
        id: 'mock-4',
        title: 'Building Scalable Product Operations',
        slug: 'building-scalable-product-operations',
        excerpt: 'Strategies for scaling product operations and maintaining quality as your team grows. Process optimization and team coordination.',
        date: '2025-01-05',
        tags: ['Operations', 'Scaling', 'Process'],
        status: 'Published',
        featured: false,
        featuredImage: null,
        readingTime: 8,
        url: 'https://www.notion.so/Prosora-Portfolio-Blog-Posts-23bcf31b151380a196f7dff950badaa9'
      }
    ];
  }

  /**
   * Mock single post for development/fallback
   * @param {string} id - Post ID
   * @returns {Object} Mock blog post with content
   */
  getMockPost(id) {
    const posts = this.getMockPosts();
    const post = posts.find(p => p.id === id) || posts[0];
    
    return {
      ...post,
      content: `
        <h2>Introduction</h2>
        <p>This is a sample blog post content. In a real implementation, this would be fetched from your Notion database.</p>
        
        <h2>Key Points</h2>
        <ul>
          <li>Point one about product management</li>
          <li>Point two about strategy</li>
          <li>Point three about execution</li>
        </ul>
        
        <blockquote>
          "Product management is about making the right decisions with incomplete information."
        </blockquote>
        
        <h2>Conclusion</h2>
        <p>These insights have shaped my approach to product management and continue to guide my decisions.</p>
      `
    };
  }
}

// Export singleton instance
export const notionClient = new NotionClient();

/**
 * Blog API functions
 */
export const blogAPI = {
  /**
   * Get all published blog posts
   * @returns {Promise<Array>} Blog posts
   */
  getPosts: async () => {
    console.log('🚀 blogAPI.getPosts called');
    try {
      const result = await notionClient.getBlogPosts();
      console.log('✅ blogAPI.getPosts result:', result);
      return result;
    } catch (error) {
      console.error('❌ blogAPI.getPosts error:', error);
      // Force return mock data if anything fails
      return notionClient.getMockPosts();
    }
  },

  /**
   * Get a specific blog post
   * @param {string} slug - Post slug
   * @returns {Promise<Object>} Blog post
   */
  getPost: async (slug) => {
    const posts = await notionClient.getBlogPosts();
    const post = posts.find(p => p.slug === slug);
    
    if (!post) {
      throw new Error(`Blog post not found: ${slug}`);
    }
    
    return notionClient.getBlogPost(post.id);
  },

  /**
   * Get posts by tag
   * @param {string} tag - Tag name
   * @returns {Promise<Array>} Filtered blog posts
   */
  getPostsByTag: async (tag) => {
    const posts = await notionClient.getBlogPosts();
    return posts.filter(post => 
      post.tags.some(postTag => 
        postTag.toLowerCase() === tag.toLowerCase()
      )
    );
  },

  /**
   * Get featured posts
   * @returns {Promise<Array>} Featured blog posts
   */
  getFeaturedPosts: async () => {
    const posts = await notionClient.getBlogPosts();
    return posts.filter(post => post.featured);
  },

  /**
   * Search posts
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching blog posts
   */
  searchPosts: async (query) => {
    const posts = await notionClient.getBlogPosts();
    const lowercaseQuery = query.toLowerCase();
    
    return posts.filter(post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
};