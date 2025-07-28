/**
 * TypeScript-style interfaces for HeadphoneAnimation component
 * (Using JSDoc for type checking in JavaScript)
 */

/**
 * @typedef {'onLoad' | 'onScroll' | 'onHover'} AnimationTrigger
 * Defines when the animation should start
 */

/**
 * @typedef {'absolute' | 'relative'} PositionType
 * Defines the CSS positioning of the animation container
 */

/**
 * @typedef {'small' | 'medium' | 'large'} SizeType
 * Defines the size variant of the headphone shadows
 */

/**
 * @typedef {Object} HeadphoneAnimationProps
 * @property {AnimationTrigger} [trigger='onLoad'] - When to trigger the animation
 * @property {number} [delay=1.5] - Delay before animation starts (in seconds)
 * @property {number} [duration=2] - Duration of the cup slide animation (in seconds)
 * @property {PositionType} [position='absolute'] - CSS positioning type
 * @property {SizeType} [size='medium'] - Size variant of the animation
 * @property {boolean} [disabled=false] - Whether to disable the animation
 * @property {Function} [onAnimationComplete] - Callback when entire animation completes
 * @property {Function} [onCupsConnected] - Callback when cups reach their position
 */

/**
 * @typedef {Object} SizeConfig
 * @property {number} cupWidth - Width of headphone cups in pixels
 * @property {number} cupHeight - Height of headphone cups in pixels
 * @property {number} bandWidth - Width of headphone band in pixels
 */

/**
 * @typedef {Object} AnimationConfig
 * @property {number} cupDuration - Duration for cup slide animation
 * @property {number} bandDuration - Duration for band appearance animation
 * @property {number} cupDelay - Delay before cups start animating
 * @property {number} bandDelay - Delay before band starts animating
 * @property {string|Array} easing - Easing function for animations
 */

export const DEFAULT_PROPS = {
  trigger: 'onLoad',
  delay: 1.5,
  duration: 2,
  position: 'absolute',
  size: 'medium',
  disabled: false,
  onAnimationComplete: null,
  onCupsConnected: null
};

export const SIZE_CONFIGS = {
  small: { cupWidth: 58, cupHeight: 77, bandWidth: 160 },
  medium: { cupWidth: 72, cupHeight: 96, bandWidth: 200 },
  large: { cupWidth: 86, cupHeight: 115, bandWidth: 240 }
};

export const ANIMATION_EASINGS = {
  natural: [0.25, 0.46, 0.45, 0.94],
  smooth: 'easeOut',
  linear: 'linear'
};