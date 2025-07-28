// Content loading utilities and data transformation functions
import { portfolioData } from '../data/portfolio.js';

/**
 * Get all portfolio data
 * @returns {Object} Complete portfolio data
 */
export const getPortfolioData = () => {
  return portfolioData;
};

/**
 * Get personal information
 * @returns {Object} Personal info including social links
 */
export const getPersonalInfo = () => {
  return portfolioData.personal;
};

/**
 * Get about section content
 * @returns {Object} About and story content
 */
export const getAboutInfo = () => {
  return portfolioData.about;
};

/**
 * Get timeline data with optional filtering
 * @param {string} type - Optional filter by timeline type
 * @returns {Array} Timeline items
 */
export const getTimelineData = (type = null) => {
  if (!type) return portfolioData.timeline;
  return portfolioData.timeline.filter(item => item.type === type);
};

/**
 * Get work/case studies data
 * @returns {Array} Work portfolio items
 */
export const getWorkData = () => {
  return portfolioData.work;
};

/**
 * Get specific case study by ID
 * @param {string} id - Case study ID
 * @returns {Object|null} Case study or null if not found
 */
export const getCaseStudyById = (id) => {
  return portfolioData.work.find(item => item.id === id) || null;
};

/**
 * Get social media links
 * @returns {Array} Social media links
 */
export const getSocialLinks = () => {
  return portfolioData.personal.socialLinks;
};

/**
 * Transform image URL for optimization
 * @param {string} imageUrl - Original image URL
 * @param {Object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export const optimizeImageUrl = (imageUrl, options = {}) => {
  const { width, height, quality = 85, format = 'webp' } = options;
  
  // For now, return the original URL
  // In the future, this could integrate with image optimization services
  return imageUrl;
};

/**
 * Validate external links
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get timeline items grouped by year
 * @returns {Object} Timeline items grouped by year
 */
export const getTimelineByYear = () => {
  const grouped = {};
  
  portfolioData.timeline.forEach(item => {
    // Extract year from date (assuming format like "Jun'13" or "Apr'24 - Aug'24")
    const year = item.date.match(/'(\d{2})/)?.[1];
    if (year) {
      const fullYear = year.length === 2 ? `20${year}` : year;
      if (!grouped[fullYear]) {
        grouped[fullYear] = [];
      }
      grouped[fullYear].push(item);
    }
  });
  
  return grouped;
};

/**
 * Get work items by tag
 * @param {string} tag - Tag to filter by
 * @returns {Array} Work items with the specified tag
 */
export const getWorkByTag = (tag) => {
  return portfolioData.work.filter(item => 
    item.tags.some(itemTag => 
      itemTag.toLowerCase().includes(tag.toLowerCase())
    )
  );
};

/**
 * Get all unique tags from work items
 * @returns {Array} Unique tags
 */
export const getAllTags = () => {
  const allTags = portfolioData.work.flatMap(item => item.tags);
  return [...new Set(allTags)].sort();
};

/**
 * Search functionality for portfolio content
 * @param {string} query - Search query
 * @returns {Object} Search results
 */
export const searchPortfolio = (query) => {
  const lowercaseQuery = query.toLowerCase();
  
  const results = {
    work: [],
    timeline: [],
    about: null
  };
  
  // Search in work items
  results.work = portfolioData.work.filter(item =>
    item.title.toLowerCase().includes(lowercaseQuery) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
  
  // Search in timeline
  results.timeline = portfolioData.timeline.filter(item =>
    item.title.toLowerCase().includes(lowercaseQuery) ||
    item.description.toLowerCase().includes(lowercaseQuery)
  );
  
  // Search in about content
  if (
    portfolioData.about.prosora.toLowerCase().includes(lowercaseQuery) ||
    portfolioData.about.story.toLowerCase().includes(lowercaseQuery)
  ) {
    results.about = portfolioData.about;
  }
  
  return results;
};

/**
 * Calculate reading time for text content
 * @param {string} text - Text content
 * @param {number} wordsPerMinute - Reading speed (default: 200 WPM)
 * @returns {number} Reading time in minutes
 */
export const calculateReadingTime = (text, wordsPerMinute = 200) => {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Format date for display
 * @param {string} dateString - Date string from timeline
 * @returns {string} Formatted date
 */
export const formatTimelineDate = (dateString) => {
  // Handle date ranges like "Apr'24 - Aug'24"
  if (dateString.includes(' - ')) {
    const [start, end] = dateString.split(' - ');
    return `${start} - ${end}`;
  }
  
  return dateString;
};

/**
 * Get contact information
 * @returns {Object} Contact details
 */
export const getContactInfo = () => {
  return {
    email: portfolioData.personal.email,
    socialLinks: portfolioData.personal.socialLinks,
    location: portfolioData.personal.location
  };
};