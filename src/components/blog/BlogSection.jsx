import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import ghostBlogService from '../../services/ghostBlogService.js';
import './BlogSection.css';

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load blog posts from Ghost
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading blog posts from Ghost...');
        
        const blogPosts = await ghostBlogService.fetchLatestPosts();
        console.log('✅ Ghost blog posts loaded:', blogPosts.length, 'posts');
        
        setPosts(blogPosts);
      } catch (error) {
        console.error('❌ Failed to load Ghost blog posts:', error);
        
        // Use fallback posts on error
        const fallbackPosts = ghostBlogService.getFallbackPosts();
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
        console.log('🏁 Ghost blog loading completed');
      }
    };

    loadPosts();
  }, []);

  // Simple navigation - pairs of posts (matching WorkSection exactly)
  const totalSlides = Math.ceil(posts.length / 2);
  
  // Auto-play functionality - matching WorkSection exactly
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <>
      {/* Blog Header Section - matching WorkSection structure exactly */}
      <section id="blog" className="h2---section---about">
        <motion.a 
          href="https://prosora.blog"
          target="_blank"
          rel="noopener noreferrer"
          className="h2---link-block w-inline-block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="h2---text"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            blog<span style={{ color: '#f8cb74' }}>.</span>
          </motion.h2>
          <div className="h2---o about">
            <p className="paragraph">
              Insights on product management, strategy, and my professional journey
            </p>
          </div>
        </motion.a>
      </section>

      {/* Blog Content Section - matching WorkSection structure exactly */}
      <section className="blog">
        <div className="w-layout-cell">
          {/* Layered Structure - Background + Cards + Navigation (matching WorkSection exactly) */}
          <div className="blog-container">
            {/* Background Layer */}
            <div className="blog-background"></div>
            
            {/* Cards Layer - Uniform Structure with Smart Placeholder */}
            <div className="blog-cards-container">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading latest posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No blog posts available at the moment.</p>
                  <a 
                    href="https://prosora.blog" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Visit Blog <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ) : (
                <div className="blog-grid grid grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                  {(() => {
                    const currentPosts = posts.slice(currentSlide * 2, currentSlide * 2 + 2);
                    const needsPlaceholder = currentPosts.length === 1;
                    
                    return (
                      <>
                        {currentPosts.map((post) => (
                          <div key={post.id} className="blog-card">
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="blog-card-link block group"
                            >
                              {/* Uniform Image Container */}
                              <div className="blog-image-container">
                                <div className="blog-image-wrapper">
                                  <img
                                    src={post.feature_image}
                                    alt={post.title}
                                    className="blog-image"
                                    loading="lazy"
                                    onLoad={() => {
                                      console.log('✅ Blog image loaded successfully:', post.title);
                                    }}
                                    onError={(e) => {
                                      console.log('❌ Blog image failed to load:', post.title);
                                      
                                      // Show placeholder immediately
                                      e.target.style.display = 'none';
                                      e.target.parentElement.innerHTML = `
                                        <div class="blog-image-placeholder">
                                          <div class="placeholder-content">
                                            <div class="placeholder-icon">📝</div>
                                            <div class="placeholder-text">${post.title}</div>
                                          </div>
                                        </div>
                                      `;
                                    }}
                                  />
                                </div>
                              </div>
                              
                              {/* Uniform Typography Container */}
                              <div className="blog-text-container">
                                <div className="blog-project-type">
                                  {post.primary_tag?.name || 'BLOG POST'}
                                </div>
                                <div className="blog-project-title">
                                  "{post.title}"
                                </div>
                              </div>
                            </a>
                          </div>
                        ))}
                        
                        {/* Smart Placeholder Card - Only when needed */}
                        {needsPlaceholder && (
                          <div className="blog-card blog-placeholder-card">
                            <div className="blog-card-link block group cursor-default">
                              {/* Placeholder Image Container */}
                              <div className="blog-image-container">
                                <div className="blog-image-wrapper">
                                  <div className="blog-image-placeholder blog-smart-placeholder">
                                    <div className="placeholder-content">
                                      <div className="placeholder-icon">✍️</div>
                                      <div className="placeholder-text">More Coming Soon</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Placeholder Typography Container */}
                              <div className="blog-text-container">
                                <div className="blog-project-type blog-placeholder-type">
                                  UPCOMING POST
                                </div>
                                <div className="blog-project-title blog-placeholder-title">
                                  "Stay Tuned"
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Descriptions Layer - Between Cards and Navigation */}
            <div className="blog-descriptions">
              <div className="blog-descriptions-container">
                {(() => {
                  const currentPosts = posts.slice(currentSlide * 2, currentSlide * 2 + 2);
                  const needsPlaceholder = currentPosts.length === 1;
                  
                  return (
                    <div className="blog-descriptions-grid">
                      {currentPosts.map((post) => (
                        <div key={`desc-${post.id}`} className="blog-description">
                          <p className="blog-description-text">
                            {post.excerpt || post.custom_excerpt || 'Discover insights and strategies that drive product success and professional growth.'}
                          </p>
                        </div>
                      ))}
                      
                      {/* Smart Placeholder Description - Only when needed */}
                      {needsPlaceholder && (
                        <div className="blog-description blog-placeholder-description">
                          <p className="blog-description-text blog-placeholder-description-text">
                            More insights on product management, strategy, and professional growth coming soon.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Navigation Layer - Small Elegant Dots */}
            <div className="blog-navigation">
              <div className="blog-dots-container">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`blog-dot ${currentSlide === index ? 'blog-dot-active' : ''}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogSection;