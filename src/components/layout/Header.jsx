import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeLink } from '../../utils/constants';
import { getSocialLinks } from '../../utils/contentLoader.js';
import { formatImageUrl } from '../../utils/assetManager.js';
import { useMusic } from '../../contexts/MusicContext';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const socialLinks = getSocialLinks();
  const { isPlaying, isMuted, toggleMute } = useMusic();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scroll state
      setIsScrolled(currentScrollY > 50);
      
      // Show/hide header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide when scrolling down
      } else {
        setIsVisible(true); // Show when scrolling up
      }
      
      setLastScrollY(currentScrollY);
      
      // Update active section
      updateActiveSection();
    };

    const updateActiveSection = () => {
      const sections = ['about', 'story', 'timeline', 'work', 'blog', 'contact'];
      const scrollPosition = window.scrollY + 100; // Offset for header height
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Smooth scroll function
  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const headerHeight = 80; // Account for fixed header
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: 'about', href: '#about' },
    { name: 'my story', href: '#story' },
    { name: 'timeline', href: '#timeline' },
    { name: 'blog', href: '#blog' },
    { name: 'contact', href: '#contact' },
  ];

  const socialIcons = {
    youtube: '📺',
    instagram: '📸',
    facebook: '📘',
    twitter: '🐦',
    linkedin: '💼'
  };

  // Helper function to get social icon file paths
  const getSocialIconPath = (platform) => {
    const iconPaths = {
      youtube: '65ff10e815a68428a1bf0ccc_icons8-youtube.gif',
      instagram: '65fa7f8d65e6c276c9996c2f_icons8-instagram-50.png',
      facebook: '65fa80c6e3051ca6b6a2cc53_icons8-facebook-50.png',
      twitter: '65fa867b6af60d82924d0013_icons8-twitter-50.png',
      linkedin: '65fa81a16af60d8292488b2f_icons8-linkedin-32.png'
    };
    return iconPaths[platform] || '';
  };

  return (
    <motion.section
      initial={{ y: -100 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 1)'
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`top_navigation_bar fixed top-0 left-0 right-0 z-50 text-white backdrop-blur-sm px-6 py-3 ${
        isScrolled ? 'shadow-lg' : ''
      }`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}
    >
      {/* Logo */}
      <motion.a
        href="#about"
        onClick={(e) => handleSmoothScroll(e, '#about')}
        whileHover={{ scale: 1.05 }}
        className="logo inline-block"
      >
        <img
          src={formatImageUrl("/assets/65fa94e25269e52953a17a94_Prosora_logo_edited.png")}
          alt="Prosora"
          className="h-12 md:h-14 lg:h-16 w-auto max-w-[373px]"
          loading="lazy"
        />
      </motion.a>

      {/* Desktop Navigation Tabs */}
      <div className="navbar_tabs hidden lg:flex items-center justify-center space-x-6">
        {navItems.map((item) => (
          <motion.a
            key={item.name}
            href={item.href}
            onClick={(e) => handleSmoothScroll(e, item.href)}
            whileHover={{ y: -2 }}
            className={`link-block inline-block relative transition-colors duration-200 ${
              activeSection === item.name.replace('my ', '') 
                ? 'text-blue-400' 
                : 'text-white hover:text-gray-300'
            }`}
          >
            <div className="text-block px-2 py-1">
              {item.name}
            </div>
            {activeSection === item.name.replace('my ', '') && (
              <motion.div
                layoutId="activeSection"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400"
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </motion.a>
        ))}
        <motion.a
          href={resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -2 }}
          className="link-block inline-block text-white hover:text-gray-300 transition-colors duration-200"
        >
          <div className="text-block px-2 py-1">resume</div>
        </motion.a>
      </div>

      {/* Desktop Social Icons & Music Control */}
      <div className="navbar_icons hidden lg:flex items-center space-x-3">
        {/* Elegant Musical Note Toggle Button */}
        <motion.button
          onClick={toggleMute}
          whileHover={{ scale: 1.1, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className="link-block inline-block transition-all duration-300"
          aria-label={isMuted ? "Unmute music" : "Mute music"}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: isMuted ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
            filter: isMuted ? 'grayscale(100%)' : 'none',
            padding: '4px',
            textDecoration: isMuted ? 'line-through' : 'none'
          }}
        >
          ♪
        </motion.button>
        
        {socialLinks.map((social) => (
          <motion.a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="link-block inline-block hover:opacity-80 transition-opacity duration-200"
            aria-label={social.label}
          >
            <img
              src={formatImageUrl(`/assets/${getSocialIconPath(social.platform)}`)}
              alt={social.label}
              className="w-6 h-6"
              loading="lazy"
            />
          </motion.a>
        ))}
      </div>

      {/* Mobile: Clean Spotify-Style Layout (Contact removed to save space) */}
      <div className="mobile-actions-row lg:hidden">
        {/* Mobile Resume Button */}
        <motion.a
          href={resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.95 }}
          className="mobile-text-btn"
        >
          Resume
        </motion.a>

        {/* Mobile Music Control */}
        <motion.button
          onClick={toggleMute}
          whileTap={{ scale: 0.95 }}
          className="mobile-music-btn"
          aria-label={isMuted ? "Unmute music" : "Mute music"}
          style={{
            color: isMuted ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.9)',
            textDecoration: isMuted ? 'line-through' : 'none'
          }}
        >
          ♪
        </motion.button>

        {/* Hamburger Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mobile-hamburger-btn"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </motion.button>
      </div>

      {/* Modern Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu-overlay lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mobile-menu-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="self-end text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Navigation Links */}
              <nav className="mobile-menu-nav">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`${
                      activeSection === item.name.replace('my ', '') ? 'active' : ''
                    }`}
                  >
                    {item.name}
                  </motion.a>
                ))}
                <motion.a
                  href={resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + navItems.length * 0.1 }}
                >
                  resume
                </motion.a>
              </nav>

              {/* Social Icons & Music Control */}
              <motion.div
                className="mobile-menu-social"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + navItems.length * 0.1 }}
              >
                {/* Music Control */}
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute music" : "Mute music"}
                  style={{
                    color: isMuted ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
                    filter: isMuted ? 'grayscale(100%)' : 'none',
                    fontSize: '18px',
                    textDecoration: isMuted ? 'line-through' : 'none'
                  }}
                >
                  ♪
                </button>
                
                {/* Social Links */}
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <img
                      src={formatImageUrl(`/assets/${getSocialIconPath(social.platform)}`)}
                      alt={social.label}
                      loading="lazy"
                    />
                  </a>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Header;