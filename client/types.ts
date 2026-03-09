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
