// Ultra-simple blog service - just imports JSON, always works!
import blogPosts from '../data/blog-posts.json';

export const blogService = {
  /**
   * Get all blog posts - instant, reliable, no API calls
   */
  getPosts() {
    console.log('📚 Loading blog posts from static data');
    console.log(`✅ Found ${blogPosts.length} posts`);
    console.log('📝 Posts:', blogPosts.map(p => p.title));
    
    return Promise.resolve(blogPosts);
  },

  /**
   * Get a specific post by slug
   */
  getPost(slug) {
    const post = blogPosts.find(p => p.slug === slug);
    return Promise.resolve(post || null);
  },

  /**
   * Get posts by tag
   */
  getPostsByTag(tag) {
    const filtered = blogPosts.filter(post => 
      post.tags.some(postTag => 
        postTag.toLowerCase() === tag.toLowerCase()
      )
    );
    return Promise.resolve(filtered);
  }
};