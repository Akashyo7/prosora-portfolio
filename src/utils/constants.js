// Animation variants for consistent motion design
export const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

// Social media links
export const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/aka-shy/',
    icon: 'linkedin',
    color: '#0077B5'
  },
  {
    name: 'Twitter',
    url: 'https://x.com/imakash_y',
    icon: 'twitter',
    color: '#1DA1F2'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/a_akasho7/',
    icon: 'instagram',
    color: '#E4405F'
  },
  {
    name: 'YouTube',
    url: 'http://www.youtube.com/@aakashyadav2458',
    icon: 'youtube',
    color: '#FF0000'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=100005669528044&sk=about',
    icon: 'facebook',
    color: '#1877F2'
  }
];

// Navigation items
export const navItems = [
  { name: 'About', href: '#about' },
  { name: 'My Story', href: '#story' },
  { name: 'Timeline', href: '#timeline' },
  { name: 'Work', href: '#work' },
  { name: 'Contact', href: '#contact' }
];

// Resume link
export const resumeLink = '/CV_Akash_2025.pdf';