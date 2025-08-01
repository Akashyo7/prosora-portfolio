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

// Debug environment variables loading
console.log('🔧 Environment variables check:');
console.log('VITE_NOTION_TOKEN exists:', !!import.meta.env.VITE_NOTION_TOKEN);
console.log('VITE_NOTION_DATABASE_ID exists:', !!import.meta.env.VITE_NOTION_DATABASE_ID);
console.log('All env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

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
    console.log('🔍 getBlogPosts() called');
    console.log('🌍 Current URL:', window.location.href);
    console.log('🔧 Environment:', import.meta.env.MODE);
    
    // Try multiple approaches in order
    const approaches = [
      { name: 'API Proxy', method: () => this.tryAPIProxy() },
      { name: 'CORS Proxy', method: () => this.tryCORSProxy() },
      { name: 'Mock Data', method: () => this.getMockPosts() }
    ];
    
    for (const approach of approaches) {
      try {
        console.log(`🚀 Trying ${approach.name}...`);
        const result = await approach.method();
        if (result && result.length > 0) {
          console.log(`✅ ${approach.name} succeeded with ${result.length} posts`);
          return result;
        }
      } catch (error) {
        console.error(`❌ ${approach.name} failed:`, error.message);
      }
    }
    
    console.log('🔄 All approaches failed, using mock data');
    return this.getMockPosts();
  }

  async tryAPIProxy() {
    const response = await fetch('/api/blog');
    
    if (!response.ok) {
      throw new Error(`API proxy failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.posts && data.posts.length > 0) {
      return data.posts;
    }
    
    throw new Error('No posts in API response');
  }

  async tryCORSProxy() {
    console.log('🌐 Trying CORS proxy approach...');
    
    if (!NOTION_CONFIG.token || !NOTION_CONFIG.databaseId) {
      throw new Error('Missing Notion configuration');
    }

    // Use a simple, reliable CORS proxy
    const proxyUrl = 'https://corsproxy.io/?';
    const notionUrl = `https://api.notion.com/v1/databases/${NOTION_CONFIG.databaseId}/query`;
    
    const response = await fetch(proxyUrl + encodeURIComponent(notionUrl), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_CONFIG.token}`,
        'Notion-Version': NOTION_CONFIG.version,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100
      })
    });

    if (!response.ok) {
      throw new Error(`CORS proxy failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 CORS proxy response:', data);
    
    if (!data.results || data.results.length === 0) {
      throw new Error('No posts found in Notion');
    }
    
    const transformedPosts = data.results.map(page => this.transformNotionPage(page));
    console.log('🔄 Transformed posts via CORS proxy:', transformedPosts.length);
    return transformedPosts;
  }

  /**
   * Direct Notion API call for local development
   * @returns {Promise<Array>} Array of blog posts
   */
  async getBlogPostsDirect() {
    console.log('🔍 getBlogPostsDirect() called for local development');
    console.log('Token exists:', !!NOTION_CONFIG.token);
    console.log('Database ID:', NOTION_CONFIG.databaseId);
    
    if (!NOTION_CONFIG.token || !NOTION_CONFIG.databaseId) {
      console.warn('⚠️ Notion configuration missing. Using mock data.');
      return this.getMockPosts();
    }

    try {
      console.log('🚀 Making direct Notion API request...');
      const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_CONFIG.databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_CONFIG.token}`,
          'Notion-Version': NOTION_CONFIG.version,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 100
        })
      });

      console.log('📡 Direct Notion API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Direct Notion API error:', errorText);
        console.log('🔄 Falling back to mock data...');
        return this.getMockPosts();
      }

      const data = await response.json();
      console.log('✅ Direct Notion API response received:', data);
      console.log('📊 Results count:', data.results?.length || 0);
      
      if (!data.results || data.results.length === 0) {
        console.log('📝 No posts found in Notion, using mock data');
        return this.getMockPosts();
      }
      
      const transformedPosts = data.results.map(page => this.transformNotionPage(page));
      console.log('🔄 Transformed posts:', transformedPosts);
      
      return transformedPosts;
    } catch (error) {
      console.error('❌ Direct Notion API failed:', error);
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
    const dateProperty = properties.Date || properties.date || properties.Created || properties.created;
    const tagsProperty = properties.Tags || properties.tags || properties.Category || properties.category;
    const excerptProperty = properties.Excerpt || properties.excerpt || properties.Description || properties.description || properties.Summary || properties.summary;
    
    const title = this.extractText(titleProperty) || 'Untitled Post';
    const featuredImage = this.extractCoverImage(page);
    
    console.log('📝 Extracted data:', {
      title,
      status: statusProperty?.select?.name,
      date: dateProperty?.date?.start,
      tags: tagsProperty?.multi_select?.length || 0,
      featuredImage: featuredImage,
      hasPageCover: !!page.cover,
      coverType: page.cover?.type
    });
    
    const extractedImage = this.extractCoverImage(page);
    const tags = tagsProperty?.multi_select?.map(tag => tag.name) || [];
    
    return {
      id: page.id,
      title,
      slug: this.generateSlug(title),
      excerpt: this.extractText(excerptProperty) || '',
      date: dateProperty?.date?.start || new Date().toISOString().split('T')[0],
      tags,
      status: statusProperty?.select?.name || 'Published', // Default to Published if no status
      featured: properties.Featured?.checkbox || false,
      featuredImage: extractedImage || this.generatePlaceholderImage(title, tags),
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
    if (!richText) return '';
    
    // Handle different property types
    if (richText.rich_text && Array.isArray(richText.rich_text)) {
      return richText.rich_text.map(text => text.plain_text || '').join('');
    }
    
    // Handle title property
    if (richText.title && Array.isArray(richText.title)) {
      return richText.title.map(text => text.plain_text || '').join('');
    }
    
    // Handle plain text
    if (typeof richText === 'string') {
      return richText;
    }
    
    // Handle direct text content
    if (richText.plain_text) {
      return richText.plain_text;
    }
    
    return '';
  }

  /**
   * Extract cover image from Notion page
   * @param {Object} page - Notion page object
   * @returns {string|null} Cover image URL
   */
  extractCoverImage(page) {
    console.log('🖼️ Extracting cover image from page:', page.id);
    console.log('📋 Page structure:', {
      hasCover: !!page.cover,
      coverType: page.cover?.type,
      properties: Object.keys(page.properties)
    });
    
    // Check page cover first (this is the main cover image)
    if (page.cover) {
      console.log('📸 Found page cover:', page.cover);
      if (page.cover.type === 'external') {
        console.log('✅ Using external cover image:', page.cover.external.url);
        return page.cover.external.url;
      } else if (page.cover.type === 'file') {
        console.log('✅ Using file cover image:', page.cover.file.url);
        return page.cover.file.url;
      }
    }
    
    // Check if there's a Cover property in the database
    const properties = page.properties;
    const possibleCoverProps = ['Cover', 'cover', 'Image', 'image', 'Featured Image', 'Thumbnail'];
    
    for (const propName of possibleCoverProps) {
      const coverProperty = properties[propName];
      if (coverProperty) {
        console.log(`🖼️ Found ${propName} property:`, coverProperty);
        
        if (coverProperty.type === 'files' && coverProperty.files && coverProperty.files.length > 0) {
          const file = coverProperty.files[0];
          if (file.type === 'external') {
            console.log('✅ Using external file from property:', file.external.url);
            return file.external.url;
          } else if (file.type === 'file') {
            console.log('✅ Using file from property:', file.file.url);
            return file.file.url;
          }
        } else if (coverProperty.type === 'url' && coverProperty.url) {
          console.log('✅ Using URL from property:', coverProperty.url);
          return coverProperty.url;
        }
      }
    }
    
    console.log('❌ No cover image found for page:', page.id);
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
   * Generate a placeholder image URL based on post content
   * @param {string} title - Post title
   * @param {Array} tags - Post tags
   * @returns {string} Placeholder image URL
   */
  generatePlaceholderImage(title, tags = []) {
    // Create a simple placeholder using a service like Unsplash or generate one
    const primaryTag = tags[0] || 'blog';
    const encodedTitle = encodeURIComponent(title.substring(0, 50));
    
    // Use Unsplash for high-quality placeholder images based on content
    const unsplashCategories = {
      'product': 'business,technology',
      'management': 'business,office',
      'strategy': 'business,planning',
      'analytics': 'data,charts',
      'career': 'success,growth',
      'iit': 'education,university',
      'oyo': 'travel,hotel',
      'data': 'technology,analytics',
      'operations': 'business,workflow'
    };
    
    const category = unsplashCategories[primaryTag.toLowerCase()] || 'business,technology';
    return `https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80`;
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
        featuredImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80',
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
        featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80',
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
        featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80',
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
        featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80',
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