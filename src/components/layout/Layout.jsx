import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { screenReaderUtils } from '../../utils/accessibility.js';

const Layout = ({ children }) => {
  // Create aria-live region for screen reader announcements
  useEffect(() => {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    return () => {
      const existingRegion = document.getElementById('aria-live-region');
      if (existingRegion) {
        document.body.removeChild(existingRegion);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip Link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="skip-link focus-visible:focus"
        onFocus={() => screenReaderUtils.updateLiveRegion('Skip to main content link focused')}
      >
        Skip to main content
      </a>
      
      <Header />
      
      <main 
        id="main-content" 
        className="flex-grow pt-20"
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;