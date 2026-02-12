
import React, { useState, useEffect } from 'react';
import { Product, ViewMode, AnalyticsData } from './types.ts';
import { NoonApiService } from './services/noonApiService.ts';
import Navbar from './components/Navbar.tsx';
import ProductGrid from './components/ProductGrid.tsx';
import Dashboard from './views/Dashboard.tsx';
import MarketingAssistant from './views/MarketingAssistant.tsx';
import { Layout, Shield, Loader2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(true);
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await NoonApiService.getProducts();
      setProducts(data);
      setLastSync(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error("App: Load products failed", err);
      setError(err.message || 'Failed to connect to Noon API');
    } finally {
      setIsLoading(false);
    }
  };

  const renderView = () => {
    if (products.length === 0 && !isLoading && !error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900">No Products Found</h2>
          <p className="text-gray-500 max-w-md mt-2">Your Noon account is connected, but we couldn't find any active items in your catalog. Ensure your products are "Live" on the Noon Seller Center.</p>
          <button 
            onClick={loadProducts}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Try Syncing Again
          </button>
        </div>
      );
    }

    switch (currentView) {
      case ViewMode.STOREFRONT:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
             <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden text-white shadow-2xl">
               <div className="relative z-10 max-w-2xl">
                 <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Official Seller Portal</h1>
                 <p className="text-lg text-indigo-100 mb-8">Direct inventory synchronization from Noon.com. Browse our latest collection with live stock status.</p>
                 <div className="flex flex-wrap gap-4">
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center text-sm font-semibold">
                       <CheckCircle className="w-4 h-4 mr-2" />
                       Noon API Verified
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center text-sm font-semibold">
                       <RefreshCw className="w-4 h-4 mr-2" />
                       Auto-Sync Active
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
        return <div className="p-8 text-center text-gray-500">View coming soon...</div>;
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
              <p className="text-gray-500 font-medium">Reading Noon Seller API...</p>
            </div>
          ) : error ? (
             <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto my-10 animate-fade-in shadow-sm">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-red-900">Connection Interrupted</h2>
                <p className="text-red-700 mt-2 mb-6 font-medium">{error}</p>
                
                <div className="text-left bg-white p-6 rounded-xl border border-red-100 text-sm text-gray-600 mb-6 shadow-inner">
                  <h4 className="font-bold text-gray-900 mb-2">Troubleshooting Steps:</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Go to Vercel Settings &gt; Environment Variables.</li>
                    <li>Ensure <strong>NOON_APP_ID</strong> is exactly your <code>key_id</code> from the JSON.</li>
                    <li>Ensure <strong>NOON_APP_KEY</strong> is the <code>Secret Key</code> you copied from the popup (not the JSON private key).</li>
                    <li>Verify <strong>NOON_BUSINESS_UNIT</strong> is set to <code>UAE</code>.</li>
                  </ul>
                </div>
                
                <button 
                  onClick={loadProducts}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  Retry Connection
                </button>
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
          <p className="text-gray-500 text-sm mb-4">The independent marketing engine for Noon.com Sellers</p>
          <div className="flex items-center justify-center space-x-6">
            <span className="text-xs text-gray-400 font-medium">Last Sync: {lastSync}</span>
            <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
            <span className="text-xs text-gray-400 font-medium uppercase">Market: {process.env.NOON_BUSINESS_UNIT || 'UAE'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
