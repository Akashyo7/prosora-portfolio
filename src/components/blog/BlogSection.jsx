import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import notionBlogService from '../../services/notionBlogService.js';
import { getAccessibleVariants } from '../../utils/accessibility.js';
import './BlogSection.css';

const BlogSection = ({ onPostClick }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load blog posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading blog posts from Notion...');
        
        const blogPosts = await notionBlogService.fetchPosts(6);
        console.log('✅ Blog posts loaded:', blogPosts.length, 'posts');
        console.log('📝 Posts data:', blogPosts);
        
        // Debug each post's image and content
        blogPosts.forEach((post, index) => {
          console.log(`📄 Post ${index + 1}:`, {
            title: post.title,
            excerpt: post.excerpt?.substring(0, 50) + '...',
            coverImage: post.coverImage,
            publishedDate: post.publishedDate,
            tags: post.tags
          });
          
          // Detailed cover image debugging
          if (post.coverImage) {
            console.log(`🖼️ Cover image for "${post.title}":`, post.coverImage);
          } else {
            console.log(`❌ No cover image for "${post.title}"`);
          }
        });
        
        setPosts(blogPosts);
        setFilteredPosts(blogPosts);
      } catch (error) {
        console.error('❌ Failed to load blog posts:', error);
        console.error('Error details:', error.message, error.stack);
        
        // Set empty array on error to show "no posts" message
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
        console.log('🏁 Blog loading completed');
      }
    };

    loadPosts();
  }, []);

  // Auto-play functionality - simple and clean
  useEffect(() => {
    if (filteredPosts.length <= 2) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(filteredPosts.length / 2));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [filteredPosts.length]);

  // Animation variants
  const containerVariants = getAccessibleVariants({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  });

  const itemVariants = getAccessibleVariants({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  });

  const cardVariants = getAccessibleVariants({
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  });

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  // Debug: Always show posts count
  console.log('🔍 Blog render - Posts:', posts.length, 'Filtered:', filteredPosts.length, 'Loading:', loading);

  return (
    <>
      {/* Blog Header Section - matching original structure */}
      <section id="blog" className="h2---section---about">
        <motion.a 
          href="#"
          className="h2---link-block w-inline-block block text-center py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="h2---text text-black mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            blog<span style={{ color: '#f8cb74' }}>.</span>
          </motion.h2>
          <div className="h2---o about">
            <p className="paragraph font-medium" style={{ color: '#f8cb74' }}>
              Insights on product management, strategy, and my professional journey
            </p>
          </div>
        </motion.a>
      </section>

      {/* Blog Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >

          {/* Blog Posts - Work Section Style */}
          <div className="blog-container relative">
            {/* Background Layer */}
            <div className="blog-background absolute inset-0 -z-10"></div>
            
            {/* Blog Cards Layer - Work Section Style */}
            <div className="blog-cards-container max-w-7xl mx-auto px-4 py-12">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No blog posts found.</p>
                  <p className="text-gray-500 mt-2">Check back soon for insights and updates!</p>
                  <p className="text-red-500 mt-2">Debug: Posts array length: {posts.length}</p>
                </div>
              ) : (
                <>
                  <div className="blog-grid grid grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                    {(() => {
                      const currentPosts = filteredPosts.slice(currentSlide * 2, currentSlide * 2 + 2);
                      const needsPlaceholder = currentPosts.length === 1;
                      
                      return (
                        <>
                          {currentPosts.map((post) => (
                            <div key={post.id} className="blog-card">
                              <button
                                onClick={() => onPostClick && onPostClick(post.slug)}
                                className="blog-card-link block group w-full text-left"
                                style={{ background: 'none', border: 'none', padding: 0 }}
                              >
                                {/* Blog Post Image Container */}
                                <div className="blog-image-container">
                                  <div className="blog-image-wrapper">
                                    {post.coverImage ? (
                                      <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="blog-image"
                                        loading="lazy"
                                        onLoad={() => {
                                          console.log('✅ Cover image loaded successfully:', post.coverImage);
                                        }}
                                        onError={(e) => {
                                          console.error('❌ Cover image failed to load:', post.coverImage);
                                          console.error('❌ Image error details:', e);
                                          e.target.style.display = 'none';
                                          e.target.parentElement.innerHTML = `
                                            <div class="blog-image-placeholder">
                                              <div class="placeholder-content">
                                                <div class="placeholder-icon">📝</div>
                                                <div class="placeholder-text">Blog Post</div>
                                              </div>
                                            </div>
                                          `;
                                        }}
                                      />
                                    ) : (
                                      <div className="blog-image-placeholder">
                                        <div className="placeholder-content">
                                          <div className="placeholder-icon">📝</div>
                                          <div className="placeholder-text">Blog Post</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Blog Post Info - Work Section Style */}
                                <div className="blog-text-container">
                                  <div className="blog-post-meta">
                                    {post.tags[0] || 'BLOG POST'} • {new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </div>
                                  <div className="blog-post-title">
                                    "{post.title}"
                                  </div>
                                  {post.excerpt && (
                                    <div className="blog-post-excerpt">
                                      {post.excerpt.substring(0, 80)}...
                                    </div>
                                  )}
                                  <div className="blog-read-more">
                                    Read More →
                                  </div>
                                </div>
                              </button>
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
                                        <div className="placeholder-text">New Posts Coming</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Placeholder Typography Container */}
                                <div className="blog-text-container">
                                  <div className="blog-post-meta blog-placeholder-meta">
                                    UPCOMING POST • Soon
                                  </div>
                                  <div className="blog-post-title blog-placeholder-title">
                                    "Stay Connected"
                                  </div>
                                  <div className="blog-post-excerpt blog-placeholder-excerpt">
                                    More insights and stories on the way...
                                  </div>
                                  <div className="blog-read-more blog-placeholder-read-more">
                                    Coming Soon
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Navigation Dots - Work Section Style */}
                  {Math.ceil(filteredPosts.length / 2) > 1 && (
                    <div className="blog-navigation">
                      <div className="blog-dots-container">
                        {Array.from({ length: Math.ceil(filteredPosts.length / 2) }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`blog-dot ${currentSlide === index ? 'blog-dot-active' : ''}`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BlogSection;