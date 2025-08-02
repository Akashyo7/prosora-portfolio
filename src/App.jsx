import { useEffect, useState } from 'react';
import Layout from './components/layout/Layout';
import SEOHead from './components/SEO/SEOHead';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import StorySection from './components/sections/StorySection';
import WorkSection from './components/sections/WorkSection';
import TimelineSection from './components/sections/TimelineSection';
import ContactSection from './components/sections/ContactSection';
import BlogSection from './components/blog/BlogSection';

import { MusicProvider } from './contexts/MusicContext';
import { initAnalytics } from './utils/analytics.js';
import { initPerformanceMonitoring } from './utils/performance.js';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Initialize analytics and performance monitoring
  useEffect(() => {
    initAnalytics();
    initPerformanceMonitoring();
    
    // Keep original loading time for visual consistency
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <MusicProvider>
      {/* Preloader - matching original */}
      {isLoading && <div className="preloader" />}
      
      <Layout>
        {/* SEO Head - Dynamic meta tags and structured data */}
        <SEOHead />
        
        {/* Hero Section - Matching original design */}
        <HeroSection />

        {/* Work Section - Carousel like original */}
        <WorkSection />

        {/* About Section - Enhanced with animations */}
        <AboutSection />

        {/* My Story Section - Matching original structure */}
        <StorySection />

        {/* Timeline Section - Interactive with animations */}
        <TimelineSection />

        {/* Blog Section - Notion-powered blog system */}
        <BlogSection />

        {/* Contact Section - Enhanced with animations */}
        <ContactSection />
      </Layout>
    </MusicProvider>
  );
}

export default App;
