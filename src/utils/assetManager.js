// Asset management utilities for images and static files

/**
 * Asset paths and configurations
 */
export const ASSET_PATHS = {
  images: '/assets/',
  icons: '/assets/',
  documents: '/documents/'
};

/**
 * Image optimization configurations
 */
export const IMAGE_CONFIGS = {
  profile: {
    sizes: [150, 300, 500],
    formats: ['webp', 'jpg'],
    quality: 85
  },
  work: {
    sizes: [400, 600, 800],
    formats: ['webp', 'jpg'],
    quality: 80
  },
  icons: {
    sizes: [24, 32, 48],
    formats: ['png', 'svg'],
    quality: 90
  }
};

/**
 * Get optimized image URL
 * @param {string} imagePath - Original image path
 * @param {Object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (imagePath, options = {}) => {
  const { width, height, quality = 85, format } = options;
  
  // For now, return the original path
  // In production, this could integrate with services like Cloudinary or Vercel Image Optimization
  return imagePath;
};

/**
 * Preload critical images
 * @param {Array} imagePaths - Array of image paths to preload
 */
export const preloadImages = (imagePaths) => {
  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
};

/**
 * Lazy load image with fallback
 * @param {string} src - Image source
 * @param {string} fallback - Fallback image source
 * @returns {Promise} Promise that resolves when image loads
 */
export const lazyLoadImage = (src, fallback = null) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(src);
    img.onerror = () => {
      if (fallback) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallback);
        fallbackImg.onerror = () => reject(new Error('Failed to load image and fallback'));
        fallbackImg.src = fallback;
      } else {
        reject(new Error('Failed to load image'));
      }
    };
    
    img.src = src;
  });
};

/**
 * Generate responsive image srcSet
 * @param {string} basePath - Base image path
 * @param {Array} sizes - Array of sizes
 * @returns {string} srcSet string
 */
export const generateSrcSet = (basePath, sizes = [400, 600, 800]) => {
  return sizes
    .map(size => `${getOptimizedImageUrl(basePath, { width: size })} ${size}w`)
    .join(', ');
};

/**
 * Get image dimensions from URL
 * @param {string} imageUrl - Image URL
 * @returns {Promise} Promise that resolves with dimensions
 */
export const getImageDimensions = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

/**
 * Check if image exists
 * @param {string} imageUrl - Image URL to check
 * @returns {Promise<boolean>} Promise that resolves to true if image exists
 */
export const imageExists = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};

/**
 * Convert image URL to proper format (handle URL encoding)
 * @param {string} imageUrl - Original image URL
 * @returns {string} Properly formatted image URL
 */
export const formatImageUrl = (imageUrl) => {
  // Handle URL encoding issues
  return imageUrl.replace(/%20/g, '%20').replace(/ /g, '%20');
};

/**
 * Get placeholder image for loading states
 * @param {number} width - Placeholder width
 * @param {number} height - Placeholder height
 * @param {string} color - Placeholder color
 * @returns {string} Data URL for placeholder
 */
export const getPlaceholderImage = (width = 400, height = 300, color = '#f3f4f6') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // Add loading text
  ctx.fillStyle = '#9ca3af';
  ctx.font = '16px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Loading...', width / 2, height / 2);
  
  return canvas.toDataURL();
};

/**
 * Asset validation utilities
 */
export const validateAssets = {
  /**
   * Validate image file type
   * @param {string} filename - File name
   * @returns {boolean} Whether file type is valid
   */
  isValidImageType: (filename) => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return validExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  },
  
  /**
   * Validate file size (for future file uploads)
   * @param {number} size - File size in bytes
   * @param {number} maxSize - Maximum allowed size in bytes
   * @returns {boolean} Whether file size is valid
   */
  isValidFileSize: (size, maxSize = 5 * 1024 * 1024) => { // 5MB default
    return size <= maxSize;
  }
};

/**
 * Performance monitoring for assets
 */
export const assetPerformance = {
  /**
   * Measure image load time
   * @param {string} imageUrl - Image URL
   * @returns {Promise} Promise with load time data
   */
  measureLoadTime: (imageUrl) => {
    const startTime = performance.now();
    
    return lazyLoadImage(imageUrl).then(() => {
      const endTime = performance.now();
      return {
        url: imageUrl,
        loadTime: endTime - startTime,
        timestamp: new Date().toISOString()
      };
    });
  },
  
  /**
   * Get asset loading statistics
   * @returns {Object} Performance statistics
   */
  getStats: () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    
    const imageResources = resources.filter(resource => 
      resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    );
    
    return {
      totalImages: imageResources.length,
      averageLoadTime: imageResources.reduce((sum, img) => sum + img.duration, 0) / imageResources.length,
      slowestImage: imageResources.reduce((slowest, img) => 
        img.duration > (slowest?.duration || 0) ? img : slowest, null
      ),
      pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart
    };
  }
};