
import { Product } from '../types';

// In a real application, this would fetch from the Noon.com Seller API endpoints.
// Documentation for real integration: https://api.noon.com/seller/v1/
export class NoonApiService {
  private static MOCK_PRODUCTS: Product[] = [
    {
      id: '1',
      sku: 'NOON-001',
      name: 'Ultra-HD Smart Camera Pro',
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
      name: 'Ergonomic Mesh Office Chair',
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
      name: 'Wireless Noise Cancelling Earbuds',
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
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...this.MOCK_PRODUCTS];
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    this.MOCK_PRODUCTS[index] = { ...this.MOCK_PRODUCTS[index], ...updates };
    return this.MOCK_PRODUCTS[index];
  }
}
