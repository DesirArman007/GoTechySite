export interface NavItem {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
  subLabel?: string;
  rank?: string;
}

export interface ContentCardProps {
  type: 'video' | 'post' | 'product';
  image: string;
  title?: string;

  subtitle?: string;
  meta1?: string;
  meta2?: string;
  badge?: string;
  link?: string;
}

export interface Product {
  _id: string;
  title: string;
  image: string;
  description?: string;
  status?: string;
  source: string;
  buyLink?: string;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };
}

export interface AboutContent {
  title?: string;
  description?: string;
  story?: string;
  imageUrl?: string;
}

export interface InstagramReel {
  _id: string;
  platformId: string;
  thumbnail: string;
  permalink: string;
  caption: string;
  publishedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
}
