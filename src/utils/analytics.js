// Analytics and performance monitoring utilities

/**
 * Web Vitals monitoring
 */
export const webVitals = {
  /**
   * Initialize web vitals monitoring
   */
  init: () => {
    if (typeof window === 'undefined') return;
    
    // Import web-vitals dynamically to avoid SSR issues
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Core Web Vitals
      getCLS(webVitals.sendToAnalytics);
      getFID(webVitals.sendToAnalytics);
      getFCP(webVitals.sendToAnalytics);
      getLCP(webVitals.sendToAnalytics);
      getTTFB(webVitals.sendToAnalytics);
      
      console.log('Web Vitals monitoring initialized');
    }).catch(error => {
      console.warn('Web Vitals not available, continuing without performance monitoring:', error);
    });
  },

  /**
   * Send metrics to analytics service
   * @param {Object} metric - Web vitals metric
   */
  sendToAnalytics: (metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric);
    }

    // Send to analytics service (Google Analytics, Vercel Analytics, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }

    // Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && window.va) {
      window.va('track', 'Web Vital', {
        metric: metric.name,
        value: metric.value,
        id: metric.id,
      });
    }
  },
};

/**
 * Performance monitoring utilities
 */
export const performance = {
  /**
   * Measure and log page load performance
   */
  measurePageLoad: () => {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        const metrics = {
          // Navigation timing
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          
          // Paint timing
          firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          
          // Resource timing
          totalResources: performance.getEntriesByType('resource').length,
          
          // Memory usage (if available)
          memoryUsage: performance.memory ? {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit,
          } : null,
        };

        console.log('Page Performance Metrics:', metrics);
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'page_load_performance', {
            event_category: 'Performance',
            dom_content_loaded: Math.round(metrics.domContentLoaded),
            load_complete: Math.round(metrics.loadComplete),
            first_paint: Math.round(metrics.firstPaint),
            first_contentful_paint: Math.round(metrics.firstContentfulPaint),
          });
        }
      }, 0);
    });
  },

  /**
   * Monitor resource loading performance
   */
  monitorResources: () => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          // Log slow resources
          if (entry.duration > 1000) {
            console.warn('Slow resource:', entry.name, `${Math.round(entry.duration)}ms`);
          }
          
          // Monitor image loading
          if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            console.log('Image loaded:', entry.name, `${Math.round(entry.duration)}ms`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  },

  /**
   * Monitor long tasks that block the main thread
   */
  monitorLongTasks: () => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.warn('Long task detected:', `${Math.round(entry.duration)}ms`, entry);
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'long_task', {
            event_category: 'Performance',
            event_label: 'Main Thread Blocking',
            value: Math.round(entry.duration),
          });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('Long task monitoring not supported:', error);
    }
  },
};

/**
 * Error tracking utilities
 */
export const errorTracking = {
  /**
   * Initialize error tracking
   */
  init: () => {
    if (typeof window === 'undefined') return;

    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      errorTracking.logError(event.error, 'Global Error');
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      errorTracking.logError(event.reason, 'Unhandled Promise Rejection');
    });
  },

  /**
   * Log error to analytics service
   * @param {Error} error - Error object
   * @param {string} context - Error context
   */
  logError: (error, context = 'Unknown') => {
    const errorInfo = {
      message: error.message || 'Unknown error',
      stack: error.stack || 'No stack trace',
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorInfo);
    }

    // Send to analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: errorInfo.message,
        fatal: false,
      });
    }
  },
};

/**
 * User interaction tracking
 */
export const userTracking = {
  /**
   * Track page views
   * @param {string} page - Page identifier
   */
  trackPageView: (page) => {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    if (typeof window !== 'undefined' && window.va) {
      window.va('track', 'Page View', { page });
    }
  },

  /**
   * Track custom events
   * @param {string} action - Event action
   * @param {string} category - Event category
   * @param {string} label - Event label
   * @param {number} value - Event value
   */
  trackEvent: (action, category = 'User Interaction', label = '', value = 0) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    if (typeof window !== 'undefined' && window.va) {
      window.va('track', action, { category, label, value });
    }
  },

  /**
   * Track section visibility
   * @param {string} section - Section name
   */
  trackSectionView: (section) => {
    userTracking.trackEvent('Section View', 'Navigation', section);
  },

  /**
   * Track external link clicks
   * @param {string} url - External URL
   */
  trackExternalLink: (url) => {
    userTracking.trackEvent('External Link Click', 'Outbound', url);
  },
};

/**
 * Initialize all analytics and monitoring
 */
export const initAnalytics = () => {
  if (typeof window === 'undefined') return;

  // Initialize web vitals monitoring
  webVitals.init();

  // Initialize performance monitoring
  performance.measurePageLoad();
  performance.monitorResources();
  performance.monitorLongTasks();

  // Initialize error tracking
  errorTracking.init();

  console.log('Analytics and performance monitoring initialized');
};