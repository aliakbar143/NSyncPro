
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  category: string;
  tags: string[];
  imageUrl: string;
  noonUrl: string;
  lastSync: string;
  performance: {
    views: number;
    clicks: number;
    ctr: number;
  };
}

export interface AnalyticsData {
  date: string;
  visitors: number;
  clicks: number;
  sales: number;
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'VIEWER';
}

export enum ViewMode {
  STOREFRONT = 'STOREFRONT',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  PRODUCT_MGMT = 'PRODUCT_MGMT',
  MARKETING = 'MARKETING',
  ANALYTICS = 'ANALYTICS'
}
