import { motion } from 'framer-motion';
import { formatImageUrl } from '../../utils/assetManager.js';
import HeadphoneAnimation from '../animations/HeadphoneAnimation.jsx';
import { useMusic } from '../../contexts/MusicContext';
import MusicControls from '../music/MusicControls.jsx';
import { useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const { startAfterAnimation, isPlaying, isMuted } = useMusic();
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [performanceQuality, setPerformanceQuality] = useState('high');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Accessibility: Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        console.log('♿ Accessibility: Reduced motion enabled');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const monitorPerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) { // Check every second
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        if (fps < 45) {
          setPerformanceQuality('low');
          console.warn('🎯 Performance: Reducing animation quality due to low FPS:', fps);
        } else if (fps < 55) {
          setPerformanceQuality('medium');
        } else {
          setPerformanceQuality('high');
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(monitorPerformance);
    };

    const performanceTimer = requestAnimationFrame(monitorPerformance);

    return () => cancelAnimationFrame(performanceTimer);
  }, []);

  // Determine if animations should be disabled
  const shouldDisableAnimations = prefersReducedMotion || performanceQuality === 'low';

  // Testing and validation
  useEffect(() => {
    // Log system status for testing
    console.log('🎯 Animation System Status:', {
      prefersReducedMotion,
      performanceQuality,
      shouldDisableAnimations,
      showMusicControls,
      isPlaying,
      isMuted,
      musicStatus: isPlaying && !isMuted ? 'PLAYING' : 'STOPPED/MUTED',
      timestamp: new Date().toISOString()
    });

    // Validate that content remains accessible
    const heroSection = document.querySelector('[role="banner"]');
    if (heroSection) {
      const isAccessible = heroSection.getAttribute('aria-label') &&
        heroSection.getAttribute('aria-live');
      console.log('♿ Accessibility validation:', isAccessible ? 'PASS' : 'FAIL');
    }

    // Test musical note button functionality
    const musicButton = document.querySelector('[aria-label*="music"]');
    if (musicButton) {
      console.log('🎵 Music button validation:', musicButton ? 'PASS' : 'FAIL');
    }

    // Validate content remains primary focus
    const contentBlocks = document.querySelectorAll('.intro_left, .intro_right');
    const animationElements = document.querySelectorAll('[aria-hidden="true"]');

    console.log('📊 Content vs Animation Balance:', {
      contentBlocks: contentBlocks.length,
      animationElements: animationElements.length,
      ratio: contentBlocks.length / Math.max(animationElements.length, 1),
      status: contentBlocks.length >= 2 ? 'PASS' : 'FAIL'
    });

    // Cross-device compatibility check
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop = window.innerWidth >= 1024;

    console.log('📱 Device Compatibility:', {
      isMobile,
      isTablet,
      isDesktop,
      screenWidth: window.innerWidth,
      animationsOptimized: shouldDisableAnimations || performanceQuality !== 'low'
    });
  }, [prefersReducedMotion, performanceQuality, shouldDisableAnimations, showMusicControls]);

  // Trigger music after headphone animation completes
  useEffect(() => {
    // Start music integration after headphone animation
    startAfterAnimation();

    // Show music controls immediately for testing
    const timer = setTimeout(() => {
      console.log('🎵 Showing music controls');
      setShowMusicControls(true);
    }, 2000); // Show controls 2 seconds after page load for testing

    return () => clearTimeout(timer);
  }, [startAfterAnimation]);

  return (
    <section
      className="intro min-h-screen flex items-center relative"
      aria-label="Hero section introducing Akash Yadav with elegant headphone animation"
      role="banner"
      style={{ paddingTop: '80px', overflow: 'visible', backgroundColor: '#000', color: '#fff' }}
      aria-live={shouldDisableAnimations ? "polite" : "off"}
    >
      {/* Responsive Layout - Three-column on all devices */}
      <div className="hero-container">



        {/* Left Section - Strategy & Analytics */}
        <motion.div
          className="intro_left hero-text-block"
          initial={shouldDisableAnimations ? { opacity: 1 } : { opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={shouldDisableAnimations ? { duration: 0 } : { duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={shouldDisableAnimations ? {} : {
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }}
          whileFocus={shouldDisableAnimations ? {} : {
            scale: 1.02,
            boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
          }}
        >
          <h1 className="heading-2 mb-6 text-white">
            strategy <span className="text-blue-400">.</span> analytics
          </h1>
          <p className="paragraph-2 text-gray-300 text-sm lg:text-base">
            Strategy & operations professional specializing in data backed decision making and project management
          </p>
        </motion.div>

        {/* Center - Single Portfolio Image with Headphone Animation */}
        <motion.div
          className="center-image hero-image-container"
          initial={shouldDisableAnimations ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={shouldDisableAnimations ? { duration: 0 } : { duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={shouldDisableAnimations ? {} : {
            scale: 1.01
          }}
        >
          <motion.img
            src="/assets/akash-profile.jpg"
            alt="Akash Yadav - Portfolio Picture"
            className="image object-cover rounded-lg shadow-lg relative z-10"
            className="hero-profile-image"
            whileHover={shouldDisableAnimations ? {} : { scale: 1.02 }}
            transition={shouldDisableAnimations ? { duration: 0 } : { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            loading="eager"
            onError={(e) => {
              console.log('Desktop image failed to load:', e.target.src);
            }}
          />

          {/* Enhanced Headphone Animation - Perfect Framing Version */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 25,
              overflow: 'visible',
              willChange: 'transform, opacity', // Performance optimization for animations
              transform: 'translate3d(0, 0, 0)' // Force GPU acceleration
            }}
            aria-hidden="true"
            role="presentation"
          >

            {/* Left Headphone Cup - Perfect Screen Edge Position */}
            <motion.div
              style={{
                position: 'absolute',
                top: `calc(100px * var(--headphone-scale, 1))`,
                left: `calc(-1 * var(--headphone-position-offset, 600px))`, // Responsive screen edge position with fallback
                width: `calc(160px * var(--headphone-scale, 1))`,
                height: `calc(200px * var(--headphone-scale, 1))`,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4))',
                borderRadius: '80px 80px 100px 100px',
                filter: 'blur(2px)',
                transform: 'rotate(-15deg) translate3d(0, 0, 0)', // GPU acceleration
                zIndex: 25,
                willChange: 'transform, opacity' // Performance optimization
              }}
              initial={shouldDisableAnimations ? { opacity: 0.45 } : { x: -200, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 0.45, scale: 1 }}
              transition={shouldDisableAnimations ? { duration: 0 } : { delay: 1.5, duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />

            {/* Left Cup - Ultra-Minimal Presence */}
            {showMusicControls && (
              <>
                {/* Barely perceptible breathing */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '170px',
                    left: '-460px',
                    width: '40px',
                    height: '40px',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.02), transparent)',
                    borderRadius: '50%',
                    zIndex: 21,
                    transform: 'rotate(-15deg)'
                  }}
                  animate={shouldDisableAnimations ? { opacity: 0.03 } : {
                    opacity: [0.03, 0.06, 0.03]
                  }}
                  transition={shouldDisableAnimations ? { duration: 0 } : {
                    duration: performanceQuality === 'low' ? 35 : 28, // Slower on low performance
                    repeat: performanceQuality === 'low' ? false : Infinity, // Disable on low performance
                    ease: [0.4, 0.0, 0.6, 1.0], // Organic breathing curve
                    repeatDelay: performanceQuality === 'high' ? Math.random() * 2 : 0 // Randomization only on high performance
                  }}
                />

                {/* Single pixel focus - ultimate minimalism */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '190px',
                    left: '-440px',
                    width: '0.5px',
                    height: '0.5px',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: '50%',
                    zIndex: 22
                  }}
                  animate={{
                    opacity: [0, 0.1, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: [0.25, 0.1, 0.25, 1.0], // Whisper-like timing curve
                    repeatDelay: 80 + Math.random() * 20 // Even more rare appearance with randomization
                  }}
                />
              </>
            )}

            {/* Right Headphone Cup - Perfect Screen Edge Position */}
            <motion.div
              style={{
                position: 'absolute',
                top: `calc(100px * var(--headphone-scale, 1))`,
                right: `calc(-1 * var(--headphone-position-offset, 600px) - 20px)`, // Responsive screen edge position with fallback
                width: `calc(160px * var(--headphone-scale, 1))`,
                height: `calc(200px * var(--headphone-scale, 1))`,
                background: 'linear-gradient(225deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4))',
                borderRadius: '80px 80px 100px 100px',
                filter: 'blur(2px)',
                transform: 'rotate(15deg) translate3d(0, 0, 0)', // GPU acceleration
                zIndex: 25,
                willChange: 'transform, opacity' // Performance optimization
              }}
              initial={shouldDisableAnimations ? { opacity: 0.45 } : { x: 200, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 0.45, scale: 1 }}
              transition={shouldDisableAnimations ? { duration: 0 } : { delay: 1.5, duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />

            {/* Left Vertical Line - From left cup to navbar with Audio Visualizer */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-160px', // Extends much higher to actually reach navbar
                left: '-520px', // Aligned with perfect left cup center position
                width: '4px',
                height: '500px', // Much taller to merge with navbar
                background: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7), rgba(0,0,0,0.4))',
                borderRadius: '2px',
                filter: 'blur(0.5px)',
                zIndex: 24,
                transformOrigin: 'bottom',
                transform: 'translate3d(0, 0, 0)', // GPU acceleration
                willChange: 'transform, opacity' // Performance optimization
              }}
              initial={shouldDisableAnimations ? { opacity: 0.8 } : { scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.8 }}
              transition={shouldDisableAnimations ? { duration: 0 } : { delay: 3.8, duration: 2.2, ease: "easeOut" }}
            />

            {/* Left Audio Visualizer - Ultimate Elegance with Music Coordination */}
            {showMusicControls && (
              <>
                {/* Ultra-subtle breathing line - coordinated with music status */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '-160px',
                    left: '-521px',
                    width: '4px',
                    height: '500px',
                    background: isPlaying && !isMuted
                      ? 'linear-gradient(180deg, rgba(34, 197, 94, 0.06), rgba(34, 197, 94, 0.03), rgba(0,0,0,0.02))' // Subtle green tint when playing
                      : 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.05), rgba(0,0,0,0.02))',
                    borderRadius: '2px',
                    zIndex: 23,
                    transformOrigin: 'bottom',
                    transform: 'translate3d(0, 0, 0)', // GPU acceleration
                    willChange: 'opacity, background' // Performance optimization
                  }}
                  animate={shouldDisableAnimations ? { opacity: 0.05 } : {
                    opacity: isPlaying && !isMuted ? [0.06, 0.12, 0.06] : [0.05, 0.1, 0.05]
                  }}
                  transition={shouldDisableAnimations ? { duration: 0 } : {
                    duration: isPlaying && !isMuted ? 18 : (performanceQuality === 'low' ? 30 : 22), // Faster pulse when playing
                    repeat: performanceQuality === 'low' ? false : Infinity,
                    ease: [0.4, 0.0, 0.6, 1.0], // Organic breathing curve
                    repeatDelay: performanceQuality === 'high' ? Math.random() * 1.5 : 0,
                    background: { duration: 1.2, ease: "easeInOut" } // Smooth color transition
                  }}
                />
              </>
            )}

            {/* Right Vertical Line - From right cup to navbar with Audio Visualizer */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-160px', // Extends much higher to actually reach navbar
                right: '-540px', // Aligned with perfect right cup center position
                width: '4px',
                height: '500px', // Much taller to merge with navbar
                background: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7), rgba(0,0,0,0.4))',
                borderRadius: '2px',
                filter: 'blur(0.5px)',
                zIndex: 24,
                transformOrigin: 'bottom',
                transform: 'translate3d(0, 0, 0)', // GPU acceleration
                willChange: 'transform, opacity' // Performance optimization
              }}
              initial={shouldDisableAnimations ? { opacity: 0.8 } : { scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.8 }}
              transition={shouldDisableAnimations ? { duration: 0 } : { delay: 3.8, duration: 2.2, ease: "easeOut" }}
            />

            {/* Right Audio Visualizer - Ultimate Elegance with Music Coordination */}
            {showMusicControls && (
              <>
                {/* Ultra-subtle breathing line with offset timing - coordinated with music status */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '-160px',
                    right: '-541px',
                    width: '4px',
                    height: '500px',
                    background: isPlaying && !isMuted
                      ? 'linear-gradient(180deg, rgba(34, 197, 94, 0.06), rgba(34, 197, 94, 0.03), rgba(0,0,0,0.02))' // Subtle green tint when playing
                      : 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.05), rgba(0,0,0,0.02))',
                    borderRadius: '2px',
                    zIndex: 23,
                    transformOrigin: 'bottom',
                    transform: 'translate3d(0, 0, 0)', // GPU acceleration
                    willChange: 'opacity, background' // Performance optimization
                  }}
                  animate={shouldDisableAnimations ? { opacity: 0.05 } : {
                    opacity: isPlaying && !isMuted ? [0.06, 0.12, 0.06] : [0.05, 0.1, 0.05]
                  }}
                  transition={shouldDisableAnimations ? { duration: 0 } : {
                    duration: isPlaying && !isMuted ? 20 : (performanceQuality === 'low' ? 32 : 25), // Faster pulse when playing
                    repeat: performanceQuality === 'low' ? false : Infinity,
                    ease: [0.4, 0.0, 0.6, 1.0], // Organic breathing curve
                    delay: 3, // Staggered timing
                    repeatDelay: performanceQuality === 'high' ? Math.random() * 2.5 : 0,
                    background: { duration: 1.2, ease: "easeInOut" } // Smooth color transition
                  }}
                />
              </>
            )}

            {/* Elegant Music Status Indicator Dots - Like Headphone "On" Lights */}

            {/* Left Music Status Dot */}
            <motion.div
              style={{
                position: 'absolute',
                top: '280px',
                left: '-520px', // Aligned with perfect left cup center
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                zIndex: 26,
                cursor: 'pointer',
                willChange: 'background-color, box-shadow, transform',
                transform: 'translate3d(0, 0, 0)' // GPU acceleration
              }}
              initial={shouldDisableAnimations ? { opacity: 0.8 } : { opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.8,
                scale: 1,
                backgroundColor: isPlaying && !isMuted
                  ? 'rgba(34, 197, 94, 0.8)' // Elegant green when playing
                  : 'rgba(239, 68, 68, 0.6)', // Subtle red when stopped/muted
                boxShadow: isPlaying && !isMuted
                  ? '0 0 8px rgba(34, 197, 94, 0.4), 0 0 16px rgba(34, 197, 94, 0.2)' // Green glow
                  : '0 0 4px rgba(239, 68, 68, 0.3)' // Subtle red glow
              }}
              transition={shouldDisableAnimations ? { duration: 0 } : {
                delay: 4.2,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                backgroundColor: { duration: 0.8, ease: "easeInOut" },
                boxShadow: { duration: 0.8, ease: "easeInOut" }
              }}
              whileHover={shouldDisableAnimations ? {} : {
                scale: 1.2,
                boxShadow: isPlaying && !isMuted
                  ? '0 0 12px rgba(34, 197, 94, 0.6), 0 0 24px rgba(34, 197, 94, 0.3)'
                  : '0 0 8px rgba(239, 68, 68, 0.5)'
              }}
            />

            {/* Right Music Status Dot */}
            <motion.div
              style={{
                position: 'absolute',
                top: '280px',
                right: '-540px', // Aligned with perfect right cup center
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                zIndex: 26,
                cursor: 'pointer',
                willChange: 'background-color, box-shadow, transform',
                transform: 'translate3d(0, 0, 0)' // GPU acceleration
              }}
              initial={shouldDisableAnimations ? { opacity: 0.8 } : { opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.8,
                scale: 1,
                backgroundColor: isPlaying && !isMuted
                  ? 'rgba(34, 197, 94, 0.8)' // Elegant green when playing
                  : 'rgba(239, 68, 68, 0.6)', // Subtle red when stopped/muted
                boxShadow: isPlaying && !isMuted
                  ? '0 0 8px rgba(34, 197, 94, 0.4), 0 0 16px rgba(34, 197, 94, 0.2)' // Green glow
                  : '0 0 4px rgba(239, 68, 68, 0.3)' // Subtle red glow
              }}
              transition={shouldDisableAnimations ? { duration: 0 } : {
                delay: 4.4, // Slightly staggered from left dot
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                backgroundColor: { duration: 0.8, ease: "easeInOut" },
                boxShadow: { duration: 0.8, ease: "easeInOut" }
              }}
              whileHover={shouldDisableAnimations ? {} : {
                scale: 1.2,
                boxShadow: isPlaying && !isMuted
                  ? '0 0 12px rgba(34, 197, 94, 0.6), 0 0 24px rgba(34, 197, 94, 0.3)'
                  : '0 0 8px rgba(239, 68, 68, 0.5)'
              }}
            />

            {/* Subtle Breathing Effect for Active Music Status */}
            {isPlaying && !isMuted && showMusicControls && !shouldDisableAnimations && (
              <>
                {/* Left dot breathing glow */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '276px', // Slightly larger to create glow effect
                    left: '-524px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1), transparent)',
                    zIndex: 25,
                    pointerEvents: 'none'
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Right dot breathing glow */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '276px',
                    right: '-544px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1), transparent)',
                    zIndex: 25,
                    pointerEvents: 'none'
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3.2, // Slightly different timing for natural feel
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </>
            )}

          </div>


        </motion.div>

        {/* Right Section - Product & Marketing */}
        <motion.div
          className="intro_right hero-text-block"
          initial={shouldDisableAnimations ? { opacity: 1 } : { opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={shouldDisableAnimations ? { duration: 0 } : { duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={shouldDisableAnimations ? {} : {
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }}
          whileFocus={shouldDisableAnimations ? {} : {
            scale: 1.02,
            boxShadow: "0 0 0 2px rgba(168, 85, 247, 0.5)"
          }}
        >
          <h1 className="heading mb-6 text-white">
            product <span className="text-purple-400">.</span> marketing
          </h1>
          <p className="paragraph-3 text-gray-300 text-sm lg:text-base">
            Product professional with specialization in product discovery, marketing, its operation analytics and customer success
          </p>
        </motion.div>
      </div>





    </section>
  );
};

export default HeroSection;