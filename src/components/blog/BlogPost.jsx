/**
 * BlogPost Component - Individual blog post page
 * Renders full blog post content from Notion on your site
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import notionBlogService from '../../services/notionBlogService.js';
import './BlogPost.css';

const BlogPost = ({ slug, onBack }) => {
  const [post, setPost] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlogPost();
  }, [slug]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading blog post with slug:', slug);
      
      // First, get all posts to find the one with matching slug
      const posts = await notionBlogService.fetchPosts(50);
      const targetPost = posts.find(p => p.slug === slug);
      
      if (!targetPost) {
        throw new Error(`Blog post with slug "${slug}" not found`);
      }
      
      console.log('✅ Found blog post:', targetPost.title);
      setPost(targetPost);
      
      // Fetch full content
      console.log('🔄 Loading blog post content...');
      const postContent = await notionBlogService.fetchPostContent(targetPost.id);
      console.log('✅ Blog post content loaded:', postContent.length, 'blocks');
      setContent(postContent);
      
    } catch (error) {
      console.error('❌ Failed to load blog post:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-post-container">
        <div className="blog-post-loading">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-post-container">
        <div className="blog-post-error">
          <h2>❌ Error Loading Post</h2>
          <p>{error}</p>
          <button onClick={onBack} className="back-button">
            <ArrowLeft size={20} />
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-post-container">
        <div className="blog-post-error">
          <h2>📄 Post Not Found</h2>
          <p>The blog post you're looking for doesn't exist.</p>
          <button onClick={onBack} className="back-button">
            <ArrowLeft size={20} />
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="blog-post-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Back Navigation */}
      <motion.button
        onClick={onBack}
        className="back-button"
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
        Back to Blog
      </motion.button>

      {/* Blog Post Header */}
      <motion.header
        className="blog-post-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Cover Image */}
        {post.coverImage && (
          <div className="blog-post-cover">
            <img
              src={post.coverImage}
              alt={post.title}
              className="blog-post-cover-image"
              onError={(e) => {
                console.error('❌ Cover image failed to load:', post.coverImage);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Title */}
        <h1 className="blog-post-title">{post.title}</h1>

        {/* Meta Information */}
        <div className="blog-post-meta">
          <div className="meta-item">
            <Calendar size={16} />
            <span>{new Date(post.publishedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          
          <div className="meta-item">
            <Clock size={16} />
            <span>{post.readTime || '5 min read'}</span>
          </div>

          {post.tags.length > 0 && (
            <div className="meta-item">
              <Tag size={16} />
              <span>{post.tags.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="blog-post-excerpt">{post.excerpt}</p>
        )}
      </motion.header>

      {/* Blog Post Content */}
      <motion.article
        className="blog-post-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {content.length > 0 ? (
          content.map((block, index) => (
            <BlogContentBlock key={block.id || index} block={block} />
          ))
        ) : (
          <div className="blog-post-fallback">
            <p>Content is being loaded from Notion...</p>
            <a 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="notion-link"
            >
              View on Notion →
            </a>
          </div>
        )}
      </motion.article>

      {/* Footer */}
      <motion.footer
        className="blog-post-footer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="blog-post-author">
          <div className="author-info">
            <h4>{post.author.name}</h4>
            <p>Published on {new Date(post.publishedDate).toLocaleDateString()}</p>
          </div>
        </div>

        <button onClick={onBack} className="back-button-footer">
          <ArrowLeft size={20} />
          Back to Blog
        </button>
      </motion.footer>
    </motion.div>
  );
};

/**
 * BlogContentBlock - Renders individual Notion content blocks
 */
const BlogContentBlock = ({ block }) => {
  const renderBlock = () => {
    switch (block.type) {
      case 'paragraph':
        return <p className="content-paragraph">{block.content}</p>;
      
      case 'heading_1':
        return <h1 className="content-heading-1">{block.content}</h1>;
      
      case 'heading_2':
        return <h2 className="content-heading-2">{block.content}</h2>;
      
      case 'heading_3':
        return <h3 className="content-heading-3">{block.content}</h3>;
      
      case 'bulleted_list_item':
        return <li className="content-list-item">{block.content}</li>;
      
      case 'numbered_list_item':
        return <li className="content-numbered-item">{block.content}</li>;
      
      case 'image':
        return (
          <div className="content-image-container">
            <img 
              src={block.content} 
              alt="Blog content" 
              className="content-image"
              onError={(e) => {
                console.error('❌ Content image failed to load:', block.content);
                e.target.style.display = 'none';
              }}
            />
          </div>
        );
      
      case 'code':
        return (
          <pre className="content-code">
            <code>{block.content}</code>
          </pre>
        );
      
      default:
        return <div className="content-unsupported">Unsupported block type: {block.type}</div>;
    }
  };

  return (
    <motion.div
      className={`content-block content-block-${block.type}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {renderBlock()}
    </motion.div>
  );
};

export default BlogPost;