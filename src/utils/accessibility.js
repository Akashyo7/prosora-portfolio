// Accessibility utilities and helpers

/**
 * Check if user prefers reduced motion
 * @returns {boolean} Whether user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation variants that respect reduced motion preference
 * @param {Object} normalVariants - Normal animation variants
 * @param {Object} reducedVariants - Reduced motion variants (optional)
 * @returns {Object} Appropriate variants based on user preference
 */
export const getAccessibleVariants = (normalVariants, reducedVariants = null) => {
  if (prefersReducedMotion()) {
    return reducedVariants || {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.1 } }
    };
  }
  return normalVariants;
};

/**
 * Get accessible transition settings
 * @param {Object} normalTransition - Normal transition settings
 * @returns {Object} Appropriate transition based on user preference
 */
export const getAccessibleTransition = (normalTransition) => {
  if (prefersReducedMotion()) {
    return { duration: 0.1 };
  }
  return normalTransition;
};

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Trap focus within an element
   * @param {HTMLElement} element - Element to trap focus within
   */
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  },

  /**
   * Announce to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - Priority level ('polite' or 'assertive')
   */
  announce: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  },

  /**
   * Set focus to element with optional delay
   * @param {HTMLElement} element - Element to focus
   * @param {number} delay - Delay in milliseconds
   */
  setFocus: (element, delay = 0) => {
    setTimeout(() => {
      if (element && typeof element.focus === 'function') {
        element.focus();
      }
    }, delay);
  }
};

/**
 * Color contrast utilities
 */
export const colorUtils = {
  /**
   * Calculate relative luminance of a color
   * @param {string} color - Hex color string
   * @returns {number} Relative luminance
   */
  getLuminance: (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  },

  /**
   * Calculate contrast ratio between two colors
   * @param {string} color1 - First color (hex)
   * @param {string} color2 - Second color (hex)
   * @returns {number} Contrast ratio
   */
  getContrastRatio: (color1, color2) => {
    const lum1 = colorUtils.getLuminance(color1);
    const lum2 = colorUtils.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Check if color combination meets WCAG AA standards
   * @param {string} foreground - Foreground color (hex)
   * @param {string} background - Background color (hex)
   * @param {boolean} isLargeText - Whether text is large (18pt+ or 14pt+ bold)
   * @returns {boolean} Whether combination meets WCAG AA
   */
  meetsWCAG: (foreground, background, isLargeText = false) => {
    const ratio = colorUtils.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  }
};

/**
 * Keyboard navigation utilities
 */
export const keyboardUtils = {
  /**
   * Handle arrow key navigation for a list of elements
   * @param {Event} event - Keyboard event
   * @param {HTMLElement[]} elements - Array of focusable elements
   * @param {number} currentIndex - Current focused element index
   * @returns {number} New focused element index
   */
  handleArrowNavigation: (event, elements, currentIndex) => {
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % elements.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + elements.length) % elements.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = elements.length - 1;
        break;
      default:
        return currentIndex;
    }
    
    event.preventDefault();
    elements[newIndex].focus();
    return newIndex;
  },

  /**
   * Add keyboard support to clickable elements
   * @param {HTMLElement} element - Element to add keyboard support to
   * @param {Function} onClick - Click handler function
   */
  addKeyboardSupport: (element, onClick) => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick(event);
      }
    };
    
    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }
};

/**
 * Screen reader utilities
 */
export const screenReaderUtils = {
  /**
   * Create screen reader only text
   * @param {string} text - Text for screen readers
   * @returns {HTMLElement} Hidden element with text
   */
  createSROnlyText: (text) => {
    const element = document.createElement('span');
    element.className = 'sr-only';
    element.textContent = text;
    return element;
  },

  /**
   * Update aria-live region
   * @param {string} message - Message to announce
   * @param {string} priority - Priority level
   */
  updateLiveRegion: (message, priority = 'polite') => {
    let liveRegion = document.getElementById('aria-live-region');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = message;
  }
};

/**
 * Performance utilities for accessibility
 */
export const performanceUtils = {
  /**
   * Debounce function for performance optimization
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function for performance optimization
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle: (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};