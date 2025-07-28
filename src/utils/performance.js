/**
 * Performance monitoring utilities
 */

// Web Vitals monitoring
export const measureWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Measure First Contentful Paint
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log('🎯 First Contentful Paint:', entry.startTime.toFixed(2) + 'ms');
      }
      if (entry.name === 'largest-contentful-paint') {
        console.log('🎯 Largest Contentful Paint:', entry.startTime.toFixed(2) + 'ms');
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
  } catch (e) {
    // Fallback for older browsers
    console.log('Performance Observer not supported');
  }
};

// Measure Cumulative Layout Shift
export const measureCLS = () => {
  if (typeof window === 'undefined') return;

  let clsValue = 0;
  let clsEntries = [];

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        const firstSessionEntry = clsEntries[0];
        const lastSessionEntry = clsEntries[clsEntries.length - 1];

        if (!firstSessionEntry || 
            entry.startTime - lastSessionEntry.startTime < 1000 ||
            entry.startTime - firstSessionEntry.startTime < 5000) {
          clsEntries.push(entry);
          clsValue += entry.value;
        }
      }
    }
    console.log('🎯 Cumulative Layout Shift:', clsValue.toFixed(4));
  });

  try {
    observer.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.log('Layout Shift Observer not supported');
  }
};

// Resource loading performance
export const measureResourceLoading = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');

    console.log('🎯 Page Load Performance:');
    console.log('  - DOM Content Loaded:', navigation.domContentLoadedEventEnd.toFixed(2) + 'ms');
    console.log('  - Load Complete:', navigation.loadEventEnd.toFixed(2) + 'ms');
    console.log('  - Total Resources:', resources.length);

    // Find largest resources
    const largeResources = resources
      .filter(resource => resource.transferSize > 100000) // > 100KB
      .sort((a, b) => b.transferSize - a.transferSize)
      .slice(0, 5);

    if (largeResources.length > 0) {
      console.log('🎯 Largest Resources:');
      largeResources.forEach(resource => {
        console.log(`  - ${resource.name}: ${(resource.transferSize / 1024).toFixed(2)}KB`);
      });
    }
  });
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    measureWebVitals();
    measureCLS();
    measureResourceLoading();
  }
};