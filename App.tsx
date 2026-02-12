
import React, { useState, useEffect } from 'react';
import { Product, ViewMode, AnalyticsData } from './types';
import { NoonApiService } from './services/noonApiService';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import Dashboard from './views/Dashboard';
import MarketingAssistant from './views/MarketingAssistant';
import { Layout, Shield, Loader2, RefreshCw } from 'lucide-react';

const MOCK_ANALYTICS: AnalyticsData[] = [
  { date: 'Mon', visitors: 120, clicks: 15, sales: 2 },
  { date: 'Tue', visitors: 150, clicks: 22, sales: 3 },
  { date: 'Wed', visitors: 110, clicks: 12, sales: 1 },
  { date: 'Thu', visitors: 190, clicks: 35, sales: 5 },
  { date: 'Fri', visitors: 240, clicks: 48, sales: 8 },
  { date: 'Sat', visitors: 280, clicks: 52, sales: 10 },
  { date: 'Sun', visitors: 210, clicks: 38, sales: 6 },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.STOREFRONT);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true); // Default to admin for demo purposes
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await NoonApiService.getProducts();
      setProducts(data);
      setLastSync(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case ViewMode.STOREFRONT:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden text-white shadow-2xl">
               <div className="relative z-10 max-w-2xl">
                 <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Your Direct Portal to Our Noon Store</h1>
                 <p className="text-lg text-indigo-100 mb-8">Exclusive products, real-time stock updates, and lightning fast checkout through the official Noon.com marketplace.</p>
                 <div className="flex flex-wrap gap-4">
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center text-sm font-semibold">
                       <Shield className="w-4 h-4 mr-2" />
                       Noon Verified
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center text-sm font-semibold">
                       <RefreshCw className="w-4 h-4 mr-2" />
                       Live Stock Sync
                    </div>
                 </div>
               </div>
               <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
               <div className="absolute right-10 top-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl"></div>
             </div>
             <ProductGrid products={products} />
          </div>
        );
      case ViewMode.ADMIN_DASHBOARD:
        return <Dashboard analytics={MOCK_ANALYTICS} products={products} />;
      case ViewMode.MARKETING:
        return <MarketingAssistant products={products} />;
      default:
        return <div>View not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isAdmin={isAdmin} 
      />

      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="text-gray-500 font-medium">Synchronizing with Noon Seller API...</p>
            </div>
          ) : (
            renderView()
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <Layout className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">NoonSync Pro</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">Official Product Catalog Synchronization System</p>
          <div className="flex items-center justify-center space-x-6">
            <span className="text-xs text-gray-400 font-medium">Last Sync: {lastSync}</span>
            <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
            <span className="text-xs text-gray-400 font-medium uppercase">API Status: Healthy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
