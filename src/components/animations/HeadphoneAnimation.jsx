import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * HeadphoneAnimation Component
 * Creates a POV effect of watching someone put on headphones from behind
 * using minimal black shadow elements that slide in from both sides
 */
const HeadphoneAnimation = ({
  trigger = 'onLoad',
  delay = 1.5,
  duration = 2,
  position = 'absolute',
  size = 'medium',
  disabled = false,
  onAnimationComplete = null,
  onCupsConnected = null
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Disable animation if user prefers reduced motion or explicitly disabled
  const shouldAnimate = !disabled && !prefersReducedMotion;
  
  // Size configurations
  const sizeConfig = {
    small: { cupWidth: 58, cupHeight: 77, bandWidth: 160 },
    medium: { cupWidth: 72, cupHeight: 96, bandWidth: 200 },
    large: { cupWidth: 86, cupHeight: 115, bandWidth: 240 }
  };
  
  const { cupWidth, cupHeight, bandWidth } = sizeConfig[size];
  
  // Animation configurations
  const animationConfig = shouldAnimate 
    ? {
        cupDuration: duration,
        bandDuration: duration * 0.75,
        cupDelay: delay,
        bandDelay: delay + duration * 0.5,
        easing: [0.25, 0.46, 0.45, 0.94]
      }
    : {
        cupDuration: 0.1,
        bandDuration: 0.1,
        cupDelay: 0,
        bandDelay: 0,
        easing: 'linear'
      };

  return (
    <div 
      className={`headphone-animation-container ${position === 'absolute' ? 'absolute' : 'relative'} inset-0 pointer-events-none z-20`}
      aria-hidden="true"
    >
      {/* Left Headphone Cup Shadow */}
      <motion.div
        className="absolute"
        initial={shouldAnimate ? { x: '-300px', y: 0, opacity: 0 } : { opacity: 0.5 }}
        animate={{ x: '0px', y: '0px', opacity: 0.5 }}
        transition={{
          delay: animationConfig.cupDelay,
          duration: animationConfig.cupDuration,
          ease: animationConfig.easing
        }}
        onAnimationComplete={() => {
          if (onCupsConnected) onCupsConnected();
        }}
        style={{
          top: '140px',
          left: '100px',
          width: `${cupWidth}px`,
          height: `${cupHeight}px`,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
          borderRadius: `${cupWidth * 0.5}px ${cupWidth * 0.5}px ${cupHeight * 0.5}px ${cupHeight * 0.5}px`,
          filter: 'blur(1px)',
          transform: 'rotate(-10deg)'
        }}
      />
      
      {/* Right Headphone Cup Shadow */}
      <motion.div
        className="absolute"
        initial={shouldAnimate ? { x: '300px', y: 0, opacity: 0 } : { opacity: 0.5 }}
        animate={{ x: '0px', y: '0px', opacity: 0.5 }}
        transition={{
          delay: animationConfig.cupDelay,
          duration: animationConfig.cupDuration,
          ease: animationConfig.easing
        }}
        style={{
          top: '140px',
          right: '100px',
          width: `${cupWidth}px`,
          height: `${cupHeight}px`,
          background: 'linear-gradient(225deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
          borderRadius: `${cupWidth * 0.5}px ${cupWidth * 0.5}px ${cupHeight * 0.5}px ${cupHeight * 0.5}px`,
          filter: 'blur(1px)',
          transform: 'rotate(10deg)'
        }}
      />
      
      {/* Headphone Band Shadow */}
      <motion.div
        className="absolute"
        initial={shouldAnimate ? { scaleX: 0, opacity: 0 } : { opacity: 0.4 }}
        animate={{ scaleX: 1, opacity: 0.4 }}
        transition={{
          delay: animationConfig.bandDelay,
          duration: animationConfig.bandDuration,
          ease: 'easeOut'
        }}
        onAnimationComplete={() => {
          if (onAnimationComplete) onAnimationComplete();
        }}
        style={{
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${bandWidth}px`,
          height: '15px',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5), rgba(0,0,0,0.1))',
          borderRadius: '50px',
          filter: 'blur(1px)',
          transformOrigin: 'center',
          clipPath: `ellipse(${bandWidth/2}px 15px at 50% 50%)`
        }}
      />
    </div>
  );
};

export default HeadphoneAnimation;