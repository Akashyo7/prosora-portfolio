// Simple, reliable blog service
// No API calls, no CORS issues, just works!

import blogPosts from '../data/blog-posts.json';

export const blogService = {
  /**
   * Get all blog posts
   * @returns {Promise<Array>} Blog posts
   */
  async getPosts() {
    console.log('📚 Loading blog posts from static data');
    console.log(`✅ Found ${blogPosts.length} posts`);
    
    // Simulate async behavior for consistency
    return new Promise(resolve => {
      setTimeout(() => resolve(blogPosts), 100);
    });
  },

  /**
   * Get a specific post by slug
   * @param {string} slug - Post slug
   * @returns {Promise<Object|null>} Blog post
   */
  async getPost(slug) {
    const post = blogPosts.find(p => p.slug === slug);
    return new Promise(resolve => {
      setTimeout(() => resolve(post || null), 100);
    });
  },

  /**
   * Get posts by tag
   * @param {string} tag - Tag name
   * @returns {Promise<Array>} Filtered posts
   */
  async getPostsByTag(tag) {
    const filtered = blogPosts.filter(post => 
      post.tags.some(postTag => 
        postTag.toLowerCase() === tag.toLowerCase()
      )
    );
    return new Promise(resolve => {
      setTimeout(() => resolve(filtered), 100);
    });
  }
};