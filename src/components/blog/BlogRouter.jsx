/**
 * BlogRouter Component - Simple client-side routing for blog posts
 * Handles navigation between blog list and individual posts
 */

import { useState, useEffect } from 'react';
import BlogSection from './BlogSection';
import BlogPost from './BlogPost';

const BlogRouter = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'post'
  const [currentSlug, setCurrentSlug] = useState(null);

  // Handle URL changes and browser navigation
  useEffect(() => {
    const handlePopState = () => {
      parseCurrentURL();
    };

    const parseCurrentURL = () => {
      const hash = window.location.hash;
      
      if (hash.startsWith('#blog/')) {
        const slug = hash.replace('#blog/', '');
        if (slug && slug !== currentSlug) {
          setCurrentSlug(slug);
          setCurrentView('post');
        }
      } else if (hash === '#blog' || hash === '') {
        setCurrentView('list');
        setCurrentSlug(null);
      }
    };

    // Parse initial URL
    parseCurrentURL();

    // Listen for browser navigation
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [currentSlug]);

  // Navigate to blog post
  const navigateToPost = (slug) => {
    setCurrentSlug(slug);
    setCurrentView('post');
    window.location.hash = `blog/${slug}`;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate back to blog list
  const navigateToList = () => {
    setCurrentView('list');
    setCurrentSlug(null);
    window.location.hash = 'blog';
    
    // Scroll to blog section
    const blogSection = document.getElementById('blog');
    if (blogSection) {
      blogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render current view
  if (currentView === 'post' && currentSlug) {
    return (
      <BlogPost 
        slug={currentSlug} 
        onBack={navigateToList}
      />
    );
  }

  // Default: render blog list
  return <BlogSection onPostClick={navigateToPost} />;
};

export default BlogRouter;