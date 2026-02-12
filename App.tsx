
import React, { useState, useEffect } from 'react';
import { Product, ViewMode, AnalyticsData } from './types';
import { NoonApiService } from './services/noonApiService';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import Dashboard from './views/Dashboard';
import MarketingAssistant from './views/MarketingAssistant';
import ImportModal from './components/ImportModal';
import { Layout, Loader2, RefreshCw, AlertCircle, CheckCircle, Globe, UploadCloud } from 'lucide-react';

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
  const [lastSync, setLastSync] = useState<string>('Pending...');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await NoonApiService.getProducts();
      // Only set products if we got valid API data, otherwise we might rely on fallback
      setProducts(data);
      setLastSync(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error("App: Load products failed", err);
      setError(err.message || 'Failed to sync with Noon Store.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualImport = (importedProducts: Product[]) => {
    setProducts(importedProducts);
    setLastSync('Manual Import: ' + new Date().toLocaleTimeString());
    setError(null); // Clear any API errors since we now have data
  };

  const renderView = () => {
    // Show empty state only if we have NO products and NO loading state
    if (products.length === 0 && !isLoading && !error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900">No Active Products Found</h2>
          <p className="text-gray-500 max-w-md mt-2">We connected to your Noon store but couldn't find any products listed publicly.</p>
          <div className="flex gap-4 mt-6">
            <button 
              onClick={loadProducts}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Retry Sync
            </button>
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Import via Extension
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case ViewMode.STOREFRONT:
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
             <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden text-gray-900 shadow-xl">
               <div className="relative z-10 max-w-2xl">
                 <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Official Noon Collection</h1>
                 <p className="text-lg text-yellow-900/80 font-medium mb-8">Browse our full catalog directly synced from Noon.com. Prices and stock updated in real-time.</p>
                 <div className="flex flex-wrap gap-4">
                    <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl flex items-center text-sm font-bold text-yellow-950">
                       <CheckCircle className="w-4 h-4 mr-2" />
                       Verified Seller (p-476641)
                    </div>
                    <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl flex items-center text-sm font-bold text-yellow-950">
                       <RefreshCw className="w-4 h-4 mr-2" />
                       Live Sync Active
                    </div>
                 </div>
               </div>
               {/* Decorative Circles */}
               <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
               <div className="absolute right-10 top-10 w-40 h-40 bg-yellow-300/30 rounded-full blur-2xl"></div>
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
        onOpenImport={() => setIsImportModalOpen(true)} 
      />

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleManualImport} 
      />

      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 space-y-6">
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">Syncing with Noon Store...</p>
                <p className="text-sm text-gray-500">Fetching live data from seller profile p-476641</p>
              </div>
            </div>
          ) : error && products.length === 0 ? (
             <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto my-10 animate-fade-in shadow-sm">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-red-900">Sync Issue Detected</h2>
                <p className="text-red-700 mt-2 mb-6 font-medium">
                  {error === 'Failed to sync with Noon Store.' ? 'The Noon.com firewall blocked our direct connection.' : error}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={loadProducts}
                    className="px-6 py-2 bg-white border border-red-200 text-red-700 rounded-xl font-bold hover:bg-red-50 transition-all"
                  >
                    Retry Connection
                  </button>
                  <div className="text-gray-400 font-medium">OR</div>
                  <button 
                    onClick={() => setIsImportModalOpen(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center"
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Use Chrome Extension
                  </button>
                </div>
             </div>
          ) : (
            renderView()
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="h-8 w-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
              <Layout className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">NoonSync Pro</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">The independent marketing engine for Noon.com Sellers</p>
          <div className="flex items-center justify-center space-x-6">
            <span className="text-xs text-gray-400 font-medium">Last Sync: {lastSync}</span>
            <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
            <span className="text-xs text-gray-400 font-medium uppercase flex items-center">
              <Globe className="w-3 h-3 mr-1" />
              Store: p-476641
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
