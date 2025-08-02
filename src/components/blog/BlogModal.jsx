/**
 * BlogModal Component - Shows blog content in a modal overlay
 * Keeps users on your site while displaying Notion content
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Tag } from 'lucide-react';
import notionBlogService from '../../services/notionBlogService.js';
import './BlogModal.css';

const BlogModal = ({ post, isOpen, onClose }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ensure we have a valid Notion URL
  const getNotionUrl = (post) => {
    if (!post) return '#';
    
    // Check if post.url is a valid Notion URL
    if (post.url && post.url.includes('notion.so')) {
      return post.url;
    }
    
    // Generate Notion URL from post ID
    const cleanId = post.id.replace(/-/g, '');
    return `https://www.notion.so/${cleanId}`;
  };

  const notionUrl = getNotionUrl(post);

  useEffect(() => {
    if (isOpen && post) {
      loadContent();
    }
  }, [isOpen, post]);

  const loadContent = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading content for:', post.title);
      console.log('🔗 Post URL:', post.url);
      
      const postContent = await notionBlogService.fetchPostContent(post.id);
      setContent(postContent);
      
    } catch (error) {
      console.error('❌ Failed to load content:', error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="blog-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="blog-modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="blog-modal-header">
            <div className="blog-modal-title-section">
              <h2 className="blog-modal-title">{post.title}</h2>
              <div className="blog-modal-meta">
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                </div>
                {post.tags.length > 0 && (
                  <div className="meta-item">
                    <Tag size={14} />
                    <span>{post.tags.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="blog-modal-actions">
              <a
                href={notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="open-notion-btn"
                title="Open full post in Notion"
              >
                <ExternalLink size={16} />
                <span>Open in Notion</span>
              </a>
              <button onClick={onClose} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="blog-modal-body">
            {loading ? (
              <div className="blog-modal-loading">
                <div className="loading-spinner"></div>
                <p>Loading content...</p>
              </div>
            ) : content.length > 0 ? (
              <div className="blog-modal-content-area">
                {content.slice(0, 10).map((block, index) => (
                  <BlogContentBlock key={block.id || index} block={block} />
                ))}
                
                {content.length > 10 && (
                  <div className="blog-modal-read-more">
                    <p>This is a preview of the blog post.</p>
                    <a
                      href={notionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="read-full-notion-btn"
                    >
                      <ExternalLink size={16} />
                      Read Full Post on Notion
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="blog-modal-fallback">
                <div className="fallback-content">
                  <h3>📖 Read Full Post</h3>
                  <p>{post.excerpt}</p>
                  <a
                    href={notionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-full-notion-btn"
                  >
                    <ExternalLink size={16} />
                    Continue Reading on Notion
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * BlogContentBlock - Renders individual content blocks
 */
const BlogContentBlock = ({ block }) => {
  const renderBlock = () => {
    switch (block.type) {
      case 'paragraph':
        return <p className="content-paragraph">{block.content}</p>;
      
      case 'heading_1':
        return <h2 className="content-heading-1">{block.content}</h2>;
      
      case 'heading_2':
        return <h3 className="content-heading-2">{block.content}</h3>;
      
      case 'heading_3':
        return <h4 className="content-heading-3">{block.content}</h4>;
      
      case 'bulleted_list_item':
        return <li className="content-list-item">{block.content}</li>;
      
      case 'image':
        return (
          <div className="content-image-container">
            <img 
              src={block.content} 
              alt="Blog content" 
              className="content-image"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        );
      
      default:
        return <div className="content-text">{block.content}</div>;
    }
  };

  return (
    <div className={`content-block content-block-${block.type}`}>
      {renderBlock()}
    </div>
  );
};

export default BlogModal;