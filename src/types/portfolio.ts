// TypeScript interfaces for portfolio data models

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  roles: string[];
  descriptions: string[];
  email: string;
  location: string;
  education: string;
  profileImages: string[];
  socialLinks: SocialLink[];
}

export interface AboutInfo {
  prosora: string;
  story: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  type: 'education' | 'work' | 'achievement' | 'personal' | 'learning';
}

export interface CaseStudy {
  id: string;
  title: string;
  type: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  tags: string[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl?: string;
  credentialUrl?: string;
}

export interface PortfolioData {
  personal: PersonalInfo;
  about: AboutInfo;
  timeline: TimelineItem[];
  work: CaseStudy[];
  certificates?: Certificate[];
}

// Blog interfaces for future implementation
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: Date;
  tags: string[];
  readingTime: number;
  featured: boolean;
  author: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}