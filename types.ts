import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface PriceTier {
  weight: string;
  price: string;
  features: string[];
}
