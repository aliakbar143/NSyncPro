
import { Product } from '../types';

export class NoonApiService {
  private static MOCK_PRODUCTS: Product[] = [
    {
      id: '1',
      sku: 'NOON-001',
      name: 'Ultra-HD Smart Camera Pro (Mock)',
      description: '4K Resolution, Night Vision, and AI motion detection for home security.',
      price: 299.00,
      currency: 'AED',
      stock: 45,
      category: 'Electronics',
      tags: ['New', 'Security'],
      imageUrl: 'https://picsum.photos/seed/camera/400/400',
      noonUrl: 'https://noon.com/uae-en/p-12345',
      lastSync: new Date().toISOString(),
      performance: { views: 1200, clicks: 150, ctr: 12.5 }
    },
    {
      id: '2',
      sku: 'NOON-002',
      name: 'Ergonomic Mesh Office Chair (Mock)',
      description: 'High-back desk chair with lumbar support and adjustable armrests.',
      price: 549.00,
      currency: 'AED',
      stock: 8,
      category: 'Home & Office',
      tags: ['Best Seller'],
      imageUrl: 'https://picsum.photos/seed/chair/400/400',
      noonUrl: 'https://noon.com/uae-en/p-67890',
      lastSync: new Date().toISOString(),
      performance: { views: 800, clicks: 80, ctr: 10.0 }
    },
    {
      id: '3',
      sku: 'NOON-003',
      name: 'Wireless Noise Cancelling Earbuds (Mock)',
      description: 'Crystal clear sound with active noise cancellation and 24-hour battery life.',
      price: 199.00,
      currency: 'AED',
      stock: 120,
      category: 'Electronics',
      tags: ['Audio', 'Premium'],
      imageUrl: 'https://picsum.photos/seed/audio/400/400',
      noonUrl: 'https://noon.com/uae-en/p-11223',
      lastSync: new Date().toISOString(),
      performance: { views: 2500, clicks: 400, ctr: 16.0 }
    }
  ];

  static async getProducts(): Promise<Product[]> {
    try {
      // Attempt to fetch from the secure backend proxy
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`Proxy responded with status ${response.status}`);
      }
      
      const products = await response.json();
      console.log('Successfully synced live products from Noon API');
      return products;
    } catch (error) {
      // Graceful fallback to mock data if API is not configured or fails
      console.warn('Noon API sync failed. Showing fallback data. Check Vercel Env Vars.', error);
      return [...this.MOCK_PRODUCTS];
    }
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Implementation for local update logic
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    return { ...products[index], ...updates };
  }
}
